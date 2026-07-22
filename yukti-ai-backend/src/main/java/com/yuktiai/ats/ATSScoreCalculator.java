package com.yuktiai.ats;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ATSScoreCalculator {

    private final ChatModel chatModel;
    private final ObjectMapper objectMapper;

    @lombok.Data
    public static class ATSBreakdown {
        private int skillsScore;
        private int experienceScore;
        private int projectsScore;
        private int responsibilitiesScore;
        private int educationScore;
        private int formattingScore;
        private int overallScore;
    }

    public ATSBreakdown calculateATSScore(String resumeJson, String jdJson) {
        log.info("Calculating semantic categories match values using Gemini");
        ATSBreakdown breakdown = new ATSBreakdown();

        String promptText = """
                You are an ATS Resume Grading System.
                Your task is to grade the alignment between a candidate's resume JSON and a job description JSON across these five categories (0 to 100):
                1. skillsScore: How well the candidate's skills and tech stack align with the required skills in the JD.
                2. experienceScore: How relevant is the candidate's work history, job roles, and descriptions to the JD.
                3. projectsScore: How relevant are the candidate's listed projects to the JD technologies.
                4. responsibilitiesScore: How well do the resume bullet points reflect the responsibilities requested in the JD.
                5. educationScore: Alignment of degree/field of study with JD requirements.
                6. formattingScore: General layout, font choices implied by section definitions (standard ranges are 80-100).
                
                SCORING INTEGRITY RULES:
                - "Hybrid", "Remote", and "Onsite" must NEVER be treated as technical skills.
                - Missing target work location keywords must NEVER reduce the skillsScore or experienceScore.
                - Employment types (Full-time, contract, etc.) must NEVER reduce the score.
                
                Provide realistic, dynamic evaluations. Do not hardcode.
                
                You must return a valid JSON object matching this structure EXACTLY:
                {
                  "skillsScore": 85,
                  "experienceScore": 75,
                  "projectsScore": 80,
                  "responsibilitiesScore": 70,
                  "educationScore": 90,
                  "formattingScore": 95
                }
                
                Respond with raw JSON only. Do not include markdown code block syntax (like ```json ... ```) or any other text.
                
                Candidate Resume JSON:
                %s
                
                Job Description JSON:
                %s
                """.formatted(resumeJson, jdJson);

        try {
            Prompt prompt = new Prompt(promptText);
            String response = chatModel.call(prompt).getResult().getOutput().getText();

            if (response.contains("```")) {
                response = response.replaceAll("```json", "")
                                   .replaceAll("```", "")
                                   .trim();
            }

            breakdown = objectMapper.readValue(response, ATSBreakdown.class);

            // Programmatically compute the overall score using the weighted average formula
            double overall = (breakdown.getSkillsScore() * 0.40) +
                             (breakdown.getExperienceScore() * 0.25) +
                             (breakdown.getProjectsScore() * 0.15) +
                             (breakdown.getResponsibilitiesScore() * 0.10) +
                             (breakdown.getEducationScore() * 0.05) +
                             (breakdown.getFormattingScore() * 0.05);

            breakdown.setOverallScore((int) Math.round(overall));

        } catch (Exception e) {
            log.error("Failed to calculate semantic breakdown scores, applying fallback defaults", e);
            breakdown.setSkillsScore(50);
            breakdown.setExperienceScore(50);
            breakdown.setProjectsScore(50);
            breakdown.setResponsibilitiesScore(50);
            breakdown.setEducationScore(50);
            breakdown.setFormattingScore(50);
            breakdown.setOverallScore(50);
        }

        return breakdown;
    }
}
