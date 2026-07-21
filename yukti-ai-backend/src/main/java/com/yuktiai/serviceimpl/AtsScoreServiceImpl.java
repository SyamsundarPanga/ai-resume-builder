package com.yuktiai.serviceimpl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yuktiai.entity.AtsScore;
import com.yuktiai.entity.JobDescription;
import com.yuktiai.entity.Resume;
import com.yuktiai.repository.AtsScoreRepository;
import com.yuktiai.service.AtsScoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AtsScoreServiceImpl implements AtsScoreService {

    private final ChatModel chatModel;
    private final AtsScoreRepository atsScoreRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public AtsScore calculateAndSaveAtsScore(Resume resume, JobDescription jobDescription) {
        log.info("Calculating ATS Score for Resume ID: {} and JobDescription ID: {}", resume.getId(), jobDescription.getId());

        String parsedResumeJson = resume.getParsedResume() != null ? resume.getParsedResume().getParsedJson() : "{}";
        String parsedJdJson = jobDescription.getParsedJson() != null ? jobDescription.getParsedJson() : "{}";

        String promptText = """
                You are an ATS (Applicant Tracking System) Score Engine.
                Your job is to compare a candidate's parsed resume JSON with the parsed job description JSON.
                Analyze the match and provide scores out of 100 for the following categories:
                1. overallScore
                2. skillsScore
                3. experienceScore
                4. projectsScore
                5. educationScore
                6. formattingScore
                
                You must return a valid, parseable JSON object matching this structure EXACTLY:
                {
                  "overallScore": 85,
                  "skillsScore": 90,
                  "experienceScore": 80,
                  "projectsScore": 85,
                  "educationScore": 95,
                  "formattingScore": 80
                }
                
                Respond with raw JSON only. Do not include markdown code block syntax (like ```json ... ```) or any other text.
                
                Candidate Parsed Resume JSON:
                %s
                
                Job Description Parsed JSON:
                %s
                """.formatted(parsedResumeJson, parsedJdJson);

        Prompt prompt = new Prompt(promptText);
        String responseContent = chatModel.call(prompt).getResult().getOutput().getText();

        if (responseContent.contains("```")) {
            responseContent = responseContent.replaceAll("```json", "")
                                             .replaceAll("```", "")
                                             .trim();
        }

        try {
            AtsScoreDto dto = objectMapper.readValue(responseContent, AtsScoreDto.class);

            AtsScore atsScore = AtsScore.builder()
                    .resume(resume)
                    .jobDescription(jobDescription)
                    .overallScore(dto.getOverallScore())
                    .skillsScore(dto.getSkillsScore())
                    .experienceScore(dto.getExperienceScore())
                    .projectsScore(dto.getProjectsScore())
                    .educationScore(dto.getEducationScore())
                    .formattingScore(dto.getFormattingScore())
                    .build();

            return atsScoreRepository.save(atsScore);
        } catch (Exception e) {
            log.error("Failed to parse ATS Score JSON from Gemini. Raw response: {}", responseContent, e);
            AtsScore atsScore = AtsScore.builder()
                    .resume(resume)
                    .jobDescription(jobDescription)
                    .overallScore(50)
                    .skillsScore(50)
                    .experienceScore(50)
                    .projectsScore(50)
                    .educationScore(50)
                    .formattingScore(50)
                    .build();
            return atsScoreRepository.save(atsScore);
        }
    }

    @Override
    public List<AtsScore> getHistory(Long userId) {
        return atsScoreRepository.findByResumeUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<AtsScore> getRecentScores(Long userId) {
        return atsScoreRepository.findRecentScores(userId);
    }

    @Override
    public AtsScore getLatestScore(Long userId) {
        return atsScoreRepository.findFirstByResumeUserIdOrderByCreatedAtDesc(userId).orElse(null);
    }

    @lombok.Data
    public static class AtsScoreDto {
        private Integer overallScore;
        private Integer skillsScore;
        private Integer experienceScore;
        private Integer projectsScore;
        private Integer educationScore;
        private Integer formattingScore;
    }
}
