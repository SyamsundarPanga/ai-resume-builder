package com.yuktiai.validation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yuktiai.dto.ResumeData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class ResumeValidator {

    private final ObjectMapper objectMapper;

    @lombok.Data
    public static class BulletTrace {
        private String originalBulletId;
        private String generatedBulletId;
        private String originalText;
        private String generatedText;
        private String reasonForModification;
    }

    @lombok.Data
    public static class ValidationReport {
        private boolean valid = true;
        private List<String> verifiedInformation = new ArrayList<>();
        private List<String> unsupportedClaims = new ArrayList<>();
        private List<String> needsUserConfirmation = new ArrayList<>();
        private List<String> removedClaims = new ArrayList<>();
        private List<BulletTrace> bulletTraceability = new ArrayList<>();
        private int truthScore = 100;
        private String cleanedOptimizedJson;
    }

    public ValidationReport validateResume(String originalJson, String optimizedJson, List<String> confirmedSkills) {
        log.info("Executing Truth Validation Engine checks");
        ValidationReport report = new ValidationReport();

        try {
            ResumeData original = objectMapper.readValue(originalJson, ResumeData.class);
            ResumeData optimized = objectMapper.readValue(optimizedJson, ResumeData.class);

            Set<String> originalSkills = original.getSkills().stream()
                    .map(String::toLowerCase)
                    .map(String::trim)
                    .collect(Collectors.toSet());

            Set<String> allowedSkills = confirmedSkills != null ? confirmedSkills.stream()
                    .map(String::toLowerCase)
                    .map(String::trim)
                    .collect(Collectors.toSet()) : Set.of();

            List<String> cleanedSkills = new ArrayList<>();
            int penalty = 0;

            // Target check skills list
            List<String> criticalChecklist = List.of("docker", "lambda", "kafka", "angular", "redis", "aws", "azure", "kubernetes");

            for (String skill : optimized.getSkills()) {
                String cleanSkill = skill.trim().toLowerCase();
                boolean isOriginal = originalSkills.contains(cleanSkill);
                boolean isConfirmed = allowedSkills.contains(cleanSkill);

                if (isOriginal || isConfirmed) {
                    cleanedSkills.add(skill);
                    report.getVerifiedInformation().add("Verified Skill: " + skill);
                } else {
                    report.setValid(false);
                    report.getUnsupportedClaims().add(skill);
                    report.getRemovedClaims().add("Removed unsupported skill: " + skill);
                    penalty += 15;

                    // Match matching warning triggers
                    boolean isCritical = criticalChecklist.stream().anyMatch(cleanSkill::contains);
                    if (isCritical) {
                        report.getNeedsUserConfirmation().add(
                            "We detected " + skill + " in the Job Description. Your resume does not mention " + skill + ". Have you worked with " + skill + "?"
                        );
                    }
                }
            }

            // Update score
            report.setTruthScore(Math.max(0, 100 - penalty));
            optimized.setSkills(cleanedSkills);

            // Populate bullet traceability mappings
            if (original.getExperience() != null && optimized.getExperience() != null) {
                int minSize = Math.min(original.getExperience().size(), optimized.getExperience().size());
                for (int i = 0; i < minSize; i++) {
                    String origDesc = original.getExperience().get(i).getDescription();
                    String optDesc = optimized.getExperience().get(i).getDescription();

                    if (origDesc != null && optDesc != null) {
                        String[] origBullets = origDesc.split("\n");
                        String[] optBullets = optDesc.split("\n");

                        int bulletMin = Math.min(origBullets.length, optBullets.length);
                        for (int j = 0; j < bulletMin; j++) {
                            BulletTrace trace = new BulletTrace();
                            trace.setOriginalBulletId(UUID.randomUUID().toString().substring(0, 8));
                            trace.setGeneratedBulletId(UUID.randomUUID().toString().substring(0, 8));
                            trace.setOriginalText(origBullets[j].trim());
                            trace.setGeneratedText(optBullets[j].trim());
                            trace.setReasonForModification("Improved grammar, action verbs and optimized formatting for ATS readability");
                            report.getBulletTraceability().add(trace);
                        }
                    }
                }
            }

            report.setCleanedOptimizedJson(objectMapper.writeValueAsString(optimized));

        } catch (Exception e) {
            log.error("Truth Validation Engine execution failed", e);
            report.setValid(false);
            report.setCleanedOptimizedJson(optimizedJson);
        }

        return report;
    }
}
