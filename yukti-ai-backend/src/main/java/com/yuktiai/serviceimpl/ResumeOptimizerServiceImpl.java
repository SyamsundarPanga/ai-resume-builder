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
        log.info("Optimizing Resume ID: {} with Job Description ID: {} using Gemini (with confirmed skills)", resume.getId(), jobDescription.getId());

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
            confirmationRules.append("You are allowed and encouraged to integrate these specific confirmed skills and details into the optimized resume where relevant.\n");
        }

        String promptText = """
                You are a Professional Resume Optimizer and ATS Expert.
                Your task is to optimize the candidate's parsed resume JSON to match the job description.
                
                CRITICAL INSTRUCTIONS:
                - Do NOT create any fake experience.
                - Do NOT create any fake skills.
                - Do NOT create any fake companies or employment history.
                - Do NOT create any fake certifications or degrees.
                - ONLY improve the wording, phrasing, layout, and presentation of the user's actual experience and skills.
                - Emphasize and prioritize matching keywords, methodologies, and technologies that the candidate already has but might have written poorly or formatted weakly.
                - Rewrite professional summaries, experience descriptions, and project details to demonstrate high impact, action verbs, and clear relevance to the job requirements.
                
                %s
                
                The output MUST be a valid JSON object matching the input structure exactly:
                {
                  "name": "...",
                  "email": "...",
                  "phone": "...",
                  "skills": ["Skill 1", "Skill 2"],
                  "projects": [
                     {
                       "title": "Project Title",
                       "description": "Optimized description reflecting impact and tools",
                       "technologies": ["techs"]
                     }
                  ],
                  "experience": [
                     {
                       "company": "Company Name",
                       "role": "Job Role",
                       "startDate": "Start date",
                       "endDate": "End date",
                       "description": "Optimized bullet points using active keywords and metrics if possible"
                     }
                  ],
                  "education": [
                     {
                       "institution": "School Name",
                       "degree": "Degree",
                       "fieldOfStudy": "Field",
                       "startDate": "Start Date",
                       "endDate": "End Date",
                       "grade": "Grade"
                     }
                  ],
                  "summary": "Optimized professional summary mapping the candidate's profile to the target job description details",
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
