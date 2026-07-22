package com.yuktiai.serviceimpl;

import com.yuktiai.service.ResumeAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeAnalysisServiceImpl implements ResumeAnalysisService {

    private final ChatModel chatModel;

    @Override
    public String generateAnalysisReport(String resumeJson, String jdJson) {
        log.info("Generating professional explainable Resume Analysis Report");

        String promptText = """
                You are an expert Resume Analyst and ATS Consultant.
                Your task is to analyze the candidate's original resume against the Job Description and the optimized version, and generate a comprehensive Resume Analysis Report in structured JSON.
                
                You must return a valid JSON object matching this structure EXACTLY:
                {
                  "overallMatch": { "original": 50, "optimized": 85, "improvement": 35, "reason": "Tailored core skills and improved experience descriptions" },
                  "skillsMatch": { "original": 40, "optimized": 90, "improvement": 50, "reason": "Mapped direct ontology synonyms like PostgreSQL to Relational Database" },
                  "experienceMatch": { "original": 60, "optimized": 80, "improvement": 20, "reason": "Standardized bullet points with active verbs" },
                  "projectsMatch": { "original": 45, "optimized": 85, "improvement": 40, "reason": "Highlighted relevant tech stacks and projects" },
                  "responsibilitiesMatch": { "original": 50, "optimized": 80, "improvement": 30, "reason": "Mapped bullets directly to JD duties" },
                  "formattingMatch": { "original": 80, "optimized": 95, "improvement": 15, "reason": "Cleaned up layout spacing and indentation" },
                  "educationMatch": { "original": 90, "optimized": 90, "improvement": 0, "reason": "No educational upgrades needed" },
                  "truthScore": { "original": 100, "optimized": 100, "improvement": 0, "reason": "Verified all listed skills and experience claims" },
                  "readabilityScore": { "original": 65, "optimized": 88, "improvement": 23, "reason": "Simplified sentence structures" },
                  
                  "matchedSkills": ["Java - Matched", "Spring Boot - Matched"],
                  "partialMatches": ["PostgreSQL - Matched as Relational Database", "JWT Authentication - Matched as JWT Tokens"],
                  "missingSkills": ["Angular - Missing", "Kafka - Missing"],
                  "experienceGap": ["Candidate lacks 1 year of Microservices leadership exposure requested in JD"],
                  "strengths": ["Strong Java & Spring Boot background", "Robust microservices design exposure"],
                  "weaknesses": ["Missing front-end Angular skills", "No message queue background"],
                  "recommendations": ["Incorporate Angular basic concepts in self-learning section", "Describe queue patterns in project summaries"]
                }
                
                Provide realistic, dynamic evaluations based on the inputs.
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
            return response;
        } catch (Exception e) {
            log.error("Failed to generate resume analysis report", e);
            return "{}";
        }
    }
}
