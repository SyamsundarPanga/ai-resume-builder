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
public class SemanticMatcher {

    private final ChatModel chatModel;
    private final ObjectMapper objectMapper;

    @lombok.Data
    public static class SemanticMatch {
        private String jdRequirement;
        private String resumeConcept;
        private String explanation;
    }

    public List<SemanticMatch> matchSemantics(String resumeJson, String jdJson) {
        log.info("Performing Semantic Match via Gemini model");
        List<SemanticMatch> results = new ArrayList<>();

        String promptText = """
                You are a Semantic Matcher for an Applicant Tracking System (ATS).
                Your job is to read a candidate's resume JSON and a job description JSON, and identify semantic matches—where the candidate has experience or skills matching the JD requirements, but uses different terminology or wording.
                
                Examples of semantic matches:
                - JD: "Develop RESTful Services" -> Resume: "Built REST APIs"
                - JD: "Develop Secure Login Module" -> Resume: "Implemented Authentication"
                
                Please return a valid JSON array matching this structure EXACTLY:
                [
                  {
                    "jdRequirement": "The specific requirement or skill from the JD",
                    "resumeConcept": "The matching concept or text found in the resume",
                    "explanation": "Brief explanation of why these are semantically identical"
                  }
                ]
                
                Respond with raw JSON only. Do not include markdown code block syntax (like ```json ... ```) or any other text.
                
                Candidate Resume JSON:
                %s
                
                Job Description JSON:
                %s
                """.formatted(resumeJson, jdJson);

        try {
            Prompt prompt = new Prompt(promptText);
            String responseContent = chatModel.call(prompt).getResult().getOutput().getText();

            if (responseContent.contains("```")) {
                responseContent = responseContent.replaceAll("```json", "")
                                                 .replaceAll("```", "")
                                                 .trim();
            }

            results = objectMapper.readValue(responseContent,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, SemanticMatch.class));
        } catch (Exception e) {
            log.error("Failed to parse semantic match results", e);
        }

        return results;
    }
}
