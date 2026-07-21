package com.yuktiai.matching;

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
public class KeywordMatcher {

    private final ObjectMapper objectMapper;

    @lombok.Data
    public static class KeywordMatchResult {
        private List<String> matchedKeywords = new ArrayList<>();
        private List<String> missingKeywords = new ArrayList<>();
    }

    public KeywordMatchResult matchKeywords(String resumeJson, String jdJson) {
        KeywordMatchResult result = new KeywordMatchResult();
        try {
            ResumeData resume = objectMapper.readValue(resumeJson, ResumeData.class);
            JdData jd = objectMapper.readValue(jdJson, JdData.class);

            // Collect all resume texts (skills, summary, experience desc, projects desc) to perform substring matches
            StringBuilder resumeTextBuilder = new StringBuilder();
            if (resume.getSkills() != null) {
                resumeTextBuilder.append(" ").append(String.join(" ", resume.getSkills()));
            }
            if (resume.getSummary() != null) {
                resumeTextBuilder.append(" ").append(resume.getSummary());
            }
            if (resume.getExperience() != null) {
                resume.getExperience().forEach(e -> {
                    if (e.getRole() != null) resumeTextBuilder.append(" ").append(e.getRole());
                    if (e.getDescription() != null) resumeTextBuilder.append(" ").append(e.getDescription());
                });
            }
            if (resume.getProjects() != null) {
                resume.getProjects().forEach(p -> {
                    if (p.getTitle() != null) resumeTextBuilder.append(" ").append(p.getTitle());
                    if (p.getDescription() != null) resumeTextBuilder.append(" ").append(p.getDescription());
                    if (p.getTechnologies() != null) resumeTextBuilder.append(" ").append(String.join(" ", p.getTechnologies()));
                });
            }

            String resumeText = resumeTextBuilder.toString().toLowerCase();

            // Match required/preferred skills and keywords from JD
            List<String> jdKeywords = new ArrayList<>();
            if (jd.getRequiredSkills() != null) jdKeywords.addAll(jd.getRequiredSkills());
            if (jd.getPreferredSkills() != null) jdKeywords.addAll(jd.getPreferredSkills());
            if (jd.getKeywords() != null) jdKeywords.addAll(jd.getKeywords());

            Set<String> uniqueJdKeywords = jdKeywords.stream()
                    .filter(k -> k != null && !k.trim().isEmpty())
                    .map(String::trim)
                    .collect(Collectors.toSet());

            for (String keyword : uniqueJdKeywords) {
                // Word boundary check or simple containment
                if (resumeText.contains(keyword.toLowerCase())) {
                    result.getMatchedKeywords().add(keyword);
                } else {
                    result.getMissingKeywords().add(keyword);
                }
            }

        } catch (Exception e) {
            log.error("Failed to parse JSON for keyword matching", e);
        }
        return result;
    }

    // Helper JD DTO for mapping
    @lombok.Data
    public static class JdData {
        private List<String> requiredSkills = new ArrayList<>();
        private List<String> preferredSkills = new ArrayList<>();
        private List<String> responsibilities = new ArrayList<>();
        private List<String> keywords = new ArrayList<>();
        private String experienceRequired;
        private String educationRequired;
    }
}
