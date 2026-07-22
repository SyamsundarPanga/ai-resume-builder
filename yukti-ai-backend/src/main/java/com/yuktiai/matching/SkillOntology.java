package com.yuktiai.matching;

import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Component
public class SkillOntology {

    private final Map<String, String> normalizationMap = new HashMap<>();

    public SkillOntology() {
        // Setup direct concept mappings (synonyms -> standardized concept name)
        addSynonyms("postgres", "postgresql", "relational database");
        addSynonyms("mysql", "sql", "relational database");
        addSynonyms("oracle", "relational database");
        
        addSynonyms("mongodb", "mongo", "nosql", "non relational database");
        addSynonyms("redis", "nosql", "key value store");
        
        addSynonyms("jwt authentication", "jwt tokens", "jwt", "authentication");
        addSynonyms("spring security", "authentication", "authorization", "security");
        
        addSynonyms("rest api", "rest apis", "restful services", "restful api");
        addSynonyms("typescript", "ts");
        addSynonyms("react", "react.js", "react js");
        addSynonyms("aws", "amazon web services", "cloud");
        addSynonyms("gcp", "google cloud", "cloud");
        addSynonyms("azure", "cloud");
    }

    private void addSynonyms(String target, String... synonyms) {
        String standard = target.toLowerCase().trim();
        normalizationMap.put(standard, standard);
        for (String syn : synonyms) {
            normalizationMap.put(syn.toLowerCase().trim(), standard);
        }
    }

    public String normalize(String skill) {
        if (skill == null) return "";
        String clean = skill.toLowerCase().trim();
        return normalizationMap.getOrDefault(clean, clean);
    }

    public boolean areEquivalent(String skillA, String skillB) {
        if (skillA == null || skillB == null) return false;
        String normA = normalize(skillA);
        String normB = normalize(skillB);
        
        // Simple direct match or check if one is standard synonym mapping
        if (normA.equals(normB)) return true;
        
        // Cross relationship checks (e.g. relational database matches postgresql/mysql)
        if (normA.contains(normB) || normB.contains(normA)) return true;
        
        return false;
    }
}
