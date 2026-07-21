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
        log.info("Generating comprehensive Resume Analysis Report via Gemini model");

        String promptText = """
                You are an expert Resume Analyst.
                Your task is to analyze the candidate's resume against the Job Description and generate a comprehensive Resume Analysis Report in structured JSON.
                
                The output MUST be a valid JSON object matching this structure EXACTLY:
                {
                  "strengths": ["Strength 1", "Strength 2"],
                  "weaknesses": ["Weakness 1", "Weakness 2"],
                  "matchedSkills": ["Skill A", "Skill B"],
                  "missingSkills": ["Skill X", "Skill Y"],
                  "matchedResponsibilities": ["Resp A"],
                  "missingResponsibilities": ["Resp B"],
                  "formattingSuggestions": ["Font hierarchy needs improvement", "Page margins are uneven"],
                  "summarySuggestions": ["Summary needs active keywords reflecting targeted role"],
                  "projectsToImprove": ["Project A - description lacks metrics"],
                  "experienceToImprove": ["Job A - duties are weakly described"],
                  "grammarSuggestions": ["Minor punctuation errors in Experience section"],
                  "aiRecommendations": ["Recommendations to improve ATS match"]
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
            return response;
        } catch (Exception e) {
            log.error("Failed to generate resume analysis report", e);
            return "{}";
        }
    }
}
