package com.yuktiai.serviceimpl;

import com.yuktiai.entity.JobDescription;
import com.yuktiai.entity.Resume;
import com.yuktiai.service.ResumeOptimizerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeOptimizerServiceImpl implements ResumeOptimizerService {

    private final ChatModel chatModel;

    @Override
    public String getOptimizedResumeJson(Resume resume, JobDescription jobDescription) {
        return getOptimizedResumeJson(resume, jobDescription, List.of(), Map.of());
    }

    @Override
    public String getOptimizedResumeJson(Resume resume, JobDescription jobDescription, List<String> confirmedSkills, Map<String, String> additionalExperiences) {
        log.info("Optimizing Resume ID: {} with Job Description ID: {} using strict editor sequence", resume.getId(), jobDescription.getId());

        String parsedResumeJson = resume.getParsedResume() != null ? resume.getParsedResume().getParsedJson() : "{}";
        String parsedJdJson = jobDescription.getParsedJson() != null ? jobDescription.getParsedJson() : "{}";

        StringBuilder confirmationRules = new StringBuilder();
        if (confirmedSkills != null && !confirmedSkills.isEmpty()) {
            confirmationRules.append("\nTHE CANDIDATE HAS EXPLICITLY CONFIRMED HAVING WORKED WITH THE FOLLOWING SKILLS AND TECHNOLOGIES:\n");
            for (String skill : confirmedSkills) {
                confirmationRules.append("- Skill: ").append(skill);
                String desc = additionalExperiences.get(skill);
                if (desc != null && !desc.trim().isEmpty()) {
                    confirmationRules.append(" (Details: ").append(desc).append(")");
                }
                confirmationRules.append("\n");
            }
        }

        String promptText = """
                You are a Professional Resume Editor and ATS Alignment Expert.
                Your task is to refine and optimize the candidate's resume JSON to match the job description.
                
                You must follow the strict REWRITE STRATEGY sequence:
                1. Optimization Plan: Review candidate sections, draft wording adjustments, specify project technologies to highlight.
                2. Rewrite: Rewrite the user's experience professionally while strictly preserving original meaning. Do not copy sentences directly from the Job Description.
                3. Validation: Verify that zero fabricated claims (no fake skills, companies, achievements, or certs) are present.
                
                CRITICAL CONSTRAINTS & FORMATTING:
                - Summary: Professional, highly tailored summary. Maximum 4 lines.
                - Experience: Keep work history as bullet points. Maximum 6 bullets per job. Each bullet must be precisely 18-25 words long. Every bullet must start with a strong, active verb.
                - Projects: Every project must include Name, Tech Stack, 3-5 bullets, GitHub link, and Live Link.
                - Skills Grouping: Group all skills into: Programming Languages, Backend, Frontend, Databases, Cloud, DevOps, Tools.
                
                Strictly do NOT invent new skills, companies, projects, or achievements. Only edit and polish existing experiences and technologies.
                
                %s
                
                The output MUST be a valid JSON object matching this structure:
                {
                  "name": "...",
                  "email": "...",
                  "phone": "...",
                  "skills": ["Programming Languages: Java, Python", "Backend: Spring Boot, Microservices", "Databases: PostgreSQL"],
                  "projects": [
                     {
                       "title": "Project Title",
                       "description": "bullet 1\\nbullet 2\\nbullet 3",
                       "technologies": ["techs"],
                       "github": "http://...",
                       "liveLink": "http://..."
                     }
                  ],
                  "experience": [
                     {
                       "company": "...",
                       "role": "...",
                       "startDate": "...",
                       "endDate": "...",
                       "description": "bullet 1\\nbullet 2"
                     }
                  ],
                  "education": [
                     {
                       "institution": "...",
                       "degree": "...",
                       "fieldOfStudy": "...",
                       "startDate": "...",
                       "endDate": "...",
                       "grade": "..."
                     }
                  ],
                  "summary": "Tailored concise professional summary (max 4 lines)",
                  "achievements": [],
                  "certifications": [],
                  "languages": [],
                  "links": []
                }
                
                Respond with raw JSON only. Do not include markdown code block syntax (like ```json ... ```) or any other text.
                
                Candidate Parsed Resume JSON:
                %s
                
                Job Description Parsed JSON:
                %s
                """.formatted(confirmationRules.toString(), parsedResumeJson, parsedJdJson);

        Prompt prompt = new Prompt(promptText);
        String responseContent = chatModel.call(prompt).getResult().getOutput().getText();

        if (responseContent.contains("```")) {
            responseContent = responseContent.replaceAll("```json", "")
                                             .replaceAll("```", "")
                                             .trim();
        }

        log.info("Successfully received optimized resume JSON from Gemini");
        return responseContent;
    }
}
