package com.yuktiai.serviceimpl;

import com.yuktiai.service.JobDescriptionParserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobDescriptionParserServiceImpl implements JobDescriptionParserService {

    private final ChatModel chatModel;

    @Override
    public String parseJobDescription(String descriptionText) {
        log.info("Sending job description text to Gemini for structured extraction");

        String promptText = """
                You are an expert Job Description Parser.
                Your task is to analyze the job description text and convert it into a strict structured JSON format.
                Do not make up details. Only extract based on the text.
                
                The output MUST be a valid JSON object matching the following structure:
                {
                  "requiredSkills": ["Skill 1", "Skill 2"],
                  "preferredSkills": ["Skill 1"],
                  "technologies": ["Java", "Docker"],
                  "responsibilities": ["Responsibility 1", "Responsibility 2"],
                  "experienceRequired": "Experience description (e.g. 5+ years, Mid-level, or empty)",
                  "educationRequired": "Education description (e.g. Bachelor's in CS or empty)",
                  "softSkills": ["Communication", "Leadership"],
                  "keywords": ["ATS", "Spring Boot"]
                }
                
                If any field is missing or not mentioned in the job description, leave it as an empty string or empty array.
                Respond with raw JSON only. Do not include markdown code block syntax (like ```json ... ```) or any other conversational text.
                
                Job Description Text:
                %s
                """.formatted(descriptionText);

        Prompt prompt = new Prompt(promptText);
        String responseContent = chatModel.call(prompt).getResult().getOutput().getText();

        if (responseContent.contains("```")) {
            responseContent = responseContent.replaceAll("```json", "")
                                             .replaceAll("```", "")
                                             .trim();
        }

        log.info("Successfully received structured job description JSON from Gemini");
        return responseContent;
    }
}
