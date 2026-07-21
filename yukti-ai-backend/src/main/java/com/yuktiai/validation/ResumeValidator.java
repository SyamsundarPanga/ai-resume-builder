package com.yuktiai.validation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yuktiai.dto.ResumeData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class ResumeValidator {

    private final ObjectMapper objectMapper;

    @lombok.Data
    public static class ValidationReport {
        private boolean valid = true;
        private List<String> verifiedInformation = new ArrayList<>();
        private List<String> needsUserConfirmation = new ArrayList<>();
        private List<String> potentialUnsupportedClaims = new ArrayList<>();
        private String cleanedOptimizedJson;
    }

    public ValidationReport validateResume(String originalJson, String optimizedJson, List<String> confirmedSkills) {
        log.info("Running programmatic claims validation on optimized resume output");
        ValidationReport report = new ValidationReport();

        try {
            ResumeData original = objectMapper.readValue(originalJson, ResumeData.class);
            ResumeData optimized = objectMapper.readValue(optimizedJson, ResumeData.class);

            Set<String> originalSkills = original.getSkills().stream()
                    .map(String::toLowerCase)
                    .map(String::trim)
                    .collect(Collectors.toSet());

            Set<String> allowedSkills = confirmedSkills.stream()
                    .map(String::toLowerCase)
                    .map(String::trim)
                    .collect(Collectors.toSet());

            // Add original skills to allowed list
            allowedSkills.addAll(originalSkills);

            List<String> cleanedSkills = new ArrayList<>();
            for (String skill : optimized.getSkills()) {
                String cleanSkill = skill.trim().toLowerCase();
                if (allowedSkills.contains(cleanSkill)) {
                    cleanedSkills.add(skill);
                    report.getVerifiedInformation().add("Verified Skill: " + skill);
                } else {
                    // Gemini added a skill that was neither in the original resume nor confirmed by user!
                    report.setValid(false);
                    report.getPotentialUnsupportedClaims().add("Fabricated Skill Filtered: " + skill);
                    log.warn("Programmatic Claim Filter: Removed fabricated skill '{}' from optimized output", skill);
                }
            }

            // Save cleaned skills back into optimized object to prevent silent insertions
            optimized.setSkills(cleanedSkills);

            // Re-serialize the cleaned optimized JSON
            report.setCleanedOptimizedJson(objectMapper.writeValueAsString(optimized));

        } catch (Exception e) {
            log.error("Failed during resume programmatic validation", e);
            report.setValid(false);
            report.setCleanedOptimizedJson(optimizedJson);
        }

        return report;
    }
}
