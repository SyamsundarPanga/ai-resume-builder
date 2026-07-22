package com.yuktiai.matching;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class EntityClassifier {

    private final ChatModel chatModel;
    private final ObjectMapper objectMapper;

    @lombok.Data
    public static class ClassifiedJd {
        private List<String> skills = new ArrayList<>();
        private List<String> frameworks = new ArrayList<>();
        private List<String> databases = new ArrayList<>();
        private List<String> cloud = new ArrayList<>();
        private List<String> softSkills = new ArrayList<>();
        private List<String> locations = new ArrayList<>();
        private String workMode = "";
        private String employmentType = "";
        private String experience = "";
    }

    public ClassifiedJd classifyJd(String jdText) {
        log.info("Sending job description text to Gemini for structured entity classification");

        String promptText = """
                You are an expert Job Description Entity Classifier.
                Analyze the job description and extract structured parameters.
                Categorize skills correctly:
                - databases: PostgreSQL, MongoDB, MySQL, Oracle, etc.
                - frameworks: Spring Boot, React, Angular, Django, etc.
                - cloud: AWS, Azure, GCP, Cloud, etc.
                - softSkills: Communication, Teamwork, Leadership, etc.
                - locations: Hyderabad, India, Bangalore, Remote, etc.
                - workMode: Remote, Hybrid, Onsite.
                - employmentType: Full-time, Part-time, Contract.
                
                You must return a valid JSON object matching this structure EXACTLY:
                {
                  "skills": ["Java", "Docker"],
                  "frameworks": ["Spring Boot", "React"],
                  "databases": ["PostgreSQL"],
                  "cloud": ["AWS"],
                  "softSkills": ["Communication"],
                  "locations": ["Hyderabad", "India"],
                  "workMode": "Hybrid",
                  "employmentType": "Full-time",
                  "experience": "1.5+ years"
                }
                
                Do not map Work Modes like "Hybrid", "Remote", or "Onsite" inside the skills or frameworks list. Place them in workMode.
                Respond with raw JSON only. Do not include markdown code block syntax (like ```json ... ```) or any other conversational text.
                
                Job Description Text:
                %s
                """.formatted(jdText);

        try {
            Prompt prompt = new Prompt(promptText);
            String response = chatModel.call(prompt).getResult().getOutput().getText();

            if (response.contains("```")) {
                response = response.replaceAll("```json", "")
                                   .replaceAll("```", "")
                                   .trim();
            }

            return objectMapper.readValue(response, ClassifiedJd.class);
        } catch (Exception e) {
            log.error("Failed to classify JD entities, returning fallback structure", e);
            return new ClassifiedJd();
        }
    }
}
