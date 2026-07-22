package com.yuktiai.matching;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class SkillNormalizer {

    private final SkillOntology ontology;

    public List<String> normalizeSkills(List<String> skills) {
        if (skills == null) return List.of();
        return skills.stream()
                .filter(s -> s != null && !s.trim().isEmpty())
                .map(ontology::normalize)
                .distinct()
                .collect(Collectors.toList());
    }

    public boolean isMatch(String resumeText, String jdSkill) {
        if (resumeText == null || jdSkill == null) return false;
        String cleanJdSkill = jdSkill.toLowerCase().trim();
        String cleanResumeText = resumeText.toLowerCase();

        // 1. Direct contains check
        if (cleanResumeText.contains(cleanJdSkill)) {
            return true;
        }

        // 2. Ontology equivalent check
        String normalizedJd = ontology.normalize(cleanJdSkill);
        if (cleanResumeText.contains(normalizedJd)) {
            return true;
        }

        return false;
    }
}
