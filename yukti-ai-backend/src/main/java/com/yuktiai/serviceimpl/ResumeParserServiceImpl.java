package com.yuktiai.serviceimpl;

import com.yuktiai.parser.DocumentTextExtractor;
import com.yuktiai.service.ResumeParserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeParserServiceImpl implements ResumeParserService {

    private final DocumentTextExtractor textExtractor;
    private final ChatModel chatModel;

    @Override
    public String parseResumeToStructuredJson(MultipartFile file) throws Exception {
        String rawText = textExtractor.extractText(file);
        if (rawText == null || rawText.trim().isEmpty()) {
            throw new IllegalArgumentException("No text could be extracted from the uploaded document.");
        }

        log.info("Sending extracted resume text to Google Gemini for structural parsing");

        String promptText = """
                You are an expert resume parser system.
                Your task is to parse the raw text of a candidate's resume and convert it into a strict structured JSON format.
                Do not make up any information, only extract what is in the text.
                
                The output MUST be a valid JSON object matching the following structure:
                {
                  "name": "Candidate Name (or empty string)",
                  "email": "Candidate Email (or empty string)",
                  "phone": "Candidate Phone (or empty string)",
                  "location": "Candidate City/State/Country (or empty string)",
                  "skills": ["Skill 1", "Skill 2"],
                  "projects": [
                     {
                       "title": "Project Title",
                       "description": "Description of the project",
                       "technologies": ["technology used"]
                     }
                  ],
                  "experience": [
                     {
                       "company": "Company Name",
                       "role": "Job Role / Title",
                       "startDate": "Start date (e.g. Month Year or Year)",
                       "endDate": "End date (e.g. Month Year, Present, or Year)",
                       "description": "Responsibilities and achievements details"
                     }
                  ],
                  "education": [
                     {
                       "institution": "School or University Name",
                       "degree": "Degree (e.g. B.S., M.S.)",
                       "fieldOfStudy": "Major / Field of Study",
                       "startDate": "Start date",
                       "endDate": "End date",
                       "grade": "GPA or Grade details"
                     }
                  ],
                  "summary": "Professional Summary / Objective",
                  "achievements": ["Achievement 1"],
                  "certifications": ["Certification 1"],
                  "languages": ["Language 1"],
                  "links": ["https://linkedin.com/...", "https://github.com/..."]
                }
                
                If any field is missing or not mentioned in the resume, leave it as an empty string or empty array.
                Respond with raw JSON only. Do not include markdown code block syntax (like ```json ... ```) or any other conversational text.
                
                Raw Resume Text:
                %s
                """.formatted(rawText);

        Prompt prompt = new Prompt(promptText);
        String responseContent = chatModel.call(prompt).getResult().getOutput().getText();

        if (responseContent.contains("```")) {
            responseContent = responseContent.replaceAll("```json", "")
                                             .replaceAll("```", "")
                                             .trim();
        }

        log.info("Successfully received structured JSON from Gemini");
        return responseContent;
    }
}
