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
    private final SkillNormalizer skillNormalizer;
    private final SkillOntology skillOntology;
    private final LocationMatcher locationMatcher;
    private final EntityClassifier entityClassifier;

    @lombok.Data
    public static class KeywordMatchResult {
        private List<String> matchedKeywords = new ArrayList<>();
        private List<String> missingKeywords = new ArrayList<>();
        
        // Detailed classification maps
        private List<String> matchedSkills = new ArrayList<>();
        private List<String> missingSkills = new ArrayList<>();
        private List<String> matchedTechnologies = new ArrayList<>();
        private List<String> matchedDatabases = new ArrayList<>();
        private List<String> matchedCloudTechnologies = new ArrayList<>();
        
        // Partial semantic equivalence matches (confidence score details)
        private List<String> partialMatches = new ArrayList<>();
        
        // Responsibilities Match
        private List<String> matchedResponsibilities = new ArrayList<>();
        private List<String> missingResponsibilities = new ArrayList<>();
        
        // Location logs
        private List<String> matchedLocations = new ArrayList<>();
        private List<String> missingLocations = new ArrayList<>();
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
            if (jd.getTechnologies() != null) jdKeywords.addAll(jd.getTechnologies());
            if (jd.getSoftSkills() != null) jdKeywords.addAll(jd.getSoftSkills());
            if (jd.getKeywords() != null) jdKeywords.addAll(jd.getKeywords());

            Set<String> uniqueJdKeywords = jdKeywords.stream()
                    .filter(k -> k != null && !k.trim().isEmpty())
                    .map(String::trim)
                    .collect(Collectors.toSet());

            for (String keyword : uniqueJdKeywords) {
                String cleanKeyword = keyword.toLowerCase().trim();
                
                // 1. Never treat work modes as skills
                if (cleanKeyword.equals("remote") || cleanKeyword.equals("hybrid") || cleanKeyword.equals("onsite")) {
                    continue;
                }

                // 2. Perform Normalized check
                if (resumeText.contains(cleanKeyword)) {
                    result.getMatchedKeywords().add(keyword);
                    classifyMatchedItem(keyword, result);
                } else {
                    // Try ontology normalization mapping match
                    String normKeyword = skillOntology.normalize(cleanKeyword);
                    boolean normalizedMatchFound = false;

                    // Check if any of the candidate's parsed skills normalized matches the keyword normalized value
                    if (resume.getSkills() != null) {
                        for (String rSkill : resume.getSkills()) {
                            if (skillOntology.areEquivalent(rSkill, keyword)) {
                                result.getMatchedKeywords().add(keyword);
                                result.getPartialMatches().add(keyword + " <-> " + rSkill + " (100% confidence via Ontology synonym)");
                                classifyMatchedItem(keyword, result);
                                normalizedMatchFound = true;
                                break;
                            }
                        }
                    }

                    if (!normalizedMatchFound) {
                        result.getMissingKeywords().add(keyword);
                        result.getMissingSkills().add(keyword);
                    }
                }
            }

            // 3. Match Responsibilities
            if (jd.getResponsibilities() != null) {
                for (String resp : jd.getResponsibilities()) {
                    if (resumeText.contains(resp.toLowerCase().trim())) {
                        result.getMatchedResponsibilities().add(resp);
                    } else {
                        result.getMissingResponsibilities().add(resp);
                    }
                }
            }

            // 4. Match locations using LocationMatcher
            String resLocation = resume.getLocation() != null ? resume.getLocation() : "";
            List<String> jdLocs = new ArrayList<>();
            // Extract from raw JD or look up
            if (resumeText.contains("hyderabad")) jdLocs.add("Hyderabad");
            if (resumeText.contains("bangalore")) jdLocs.add("Bangalore");
            
            LocationMatcher.LocationMatchResult locResult = locationMatcher.matchLocation(resLocation, jdLocs, "Hybrid", "Hybrid");
            result.setMatchedLocations(locResult.getMatchedLocations());
            result.setMissingLocations(locResult.getMissingLocations());

        } catch (Exception e) {
            log.error("Failed to parse JSON for keyword matching", e);
        }
        return result;
    }

    private void classifyMatchedItem(String item, KeywordMatchResult result) {
        String clean = item.toLowerCase();
        if (clean.contains("postgres") || clean.contains("mongodb") || clean.contains("sql") || clean.contains("database")) {
            result.getMatchedDatabases().add(item);
        } else if (clean.contains("aws") || clean.contains("cloud") || clean.contains("azure") || clean.contains("gcp")) {
            result.getMatchedCloudTechnologies().add(item);
        } else if (clean.contains("react") || clean.contains("spring") || clean.contains("angular") || clean.contains("vue")) {
            result.getMatchedTechnologies().add(item);
        } else {
            result.getMatchedSkills().add(item);
        }
    }

    // Helper JD DTO for mapping
    @lombok.Data
    public static class JdData {
        private List<String> requiredSkills = new ArrayList<>();
        private List<String> preferredSkills = new ArrayList<>();
        private List<String> technologies = new ArrayList<>();
        private List<String> responsibilities = new ArrayList<>();
        private List<String> softSkills = new ArrayList<>();
        private List<String> keywords = new ArrayList<>();
        private String experienceRequired;
        private String educationRequired;
    }
}
