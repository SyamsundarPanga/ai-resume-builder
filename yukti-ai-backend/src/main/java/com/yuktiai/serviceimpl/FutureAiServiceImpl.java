package com.yuktiai.serviceimpl;

import com.yuktiai.entity.*;
import com.yuktiai.exception.ResourceNotFoundException;
import com.yuktiai.repository.*;
import com.yuktiai.service.FutureAiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class FutureAiServiceImpl implements FutureAiService {

    private final ChatModel chatModel;
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    // V2 Repositories
    private final CoverLetterRepository coverLetterRepository;
    private final LinkedInSummaryRepository linkedInSummaryRepository;
    private final InterviewQuestionsRepository interviewQuestionsRepository;
    private final SkillGapReportRepository skillGapReportRepository;
    private final PortfolioSuggestionsRepository portfolioSuggestionsRepository;

    @Override
    @Transactional
    public String generateCoverLetter(Long resumeId, String jdText, Long userId) throws Exception {
        log.info("Generating V2 Cover Letter for resume: {}", resumeId);
        Resume resume = resumeRepository.findByIdAndUserId(resumeId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));

        String resumeJson = resume.getParsedResume() != null ? resume.getParsedResume().getParsedJson() : "{}";

        String promptText = """
                You are a professional cover letter writer.
                Based on the candidate's resume details and the target job description, generate a highly professional, tailored cover letter.
                Do not invent any achievements, skills, or experience. Use only the factual information provided in the resume.
                
                Candidate Resume JSON:
                %s
                
                Target Job Description:
                %s
                """.formatted(resumeJson, jdText);

        Prompt prompt = new Prompt(promptText);
        String coverLetterText = chatModel.call(prompt).getResult().getOutput().getText();

        User user = userRepository.findById(userId).orElseThrow();
        CoverLetter cl = CoverLetter.builder()
                .user(user)
                .resume(resume)
                .content(coverLetterText)
                .build();
        coverLetterRepository.save(cl);

        return coverLetterText;
    }

    @Override
    @Transactional
    public String generateLinkedInSummary(Long resumeId, Long userId) throws Exception {
        log.info("Generating V2 LinkedIn About section for resume: {}", resumeId);
        Resume resume = resumeRepository.findByIdAndUserId(resumeId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));

        String resumeJson = resume.getParsedResume() != null ? resume.getParsedResume().getParsedJson() : "{}";

        String promptText = """
                You are an executive branding specialist.
                Generate an impactful, professional "About" section for LinkedIn for the candidate based on their resume.
                Include active keywords, key strengths, and areas of interest.
                Keep it concise (1-2 paragraphs) and written in a professional first-person or third-person tone.
                
                Resume JSON:
                %s
                """.formatted(resumeJson);

        Prompt prompt = new Prompt(promptText);
        String linkedInSummaryText = chatModel.call(prompt).getResult().getOutput().getText();

        User user = userRepository.findById(userId).orElseThrow();
        LinkedInSummary ls = LinkedInSummary.builder()
                .user(user)
                .content(linkedInSummaryText)
                .build();
        linkedInSummaryRepository.save(ls);

        return linkedInSummaryText;
    }

    @Override
    @Transactional
    public String generateInterviewQuestions(Long resumeId, String jdText, Long userId) throws Exception {
        log.info("Generating V2 personalized interview questions for resume: {}", resumeId);
        Resume resume = resumeRepository.findByIdAndUserId(resumeId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));

        String resumeJson = resume.getParsedResume() != null ? resume.getParsedResume().getParsedJson() : "{}";

        String promptText = """
                You are an expert technical recruiter.
                Generate a list of 10 customized interview questions mapping the candidate's resume to the target Job Description.
                Categories of questions:
                - Java & Spring Boot Core
                - Practical Project questions (based on listed projects)
                - Behavioral alignment
                - System Design / Architecture
                
                Return a valid JSON array matching this structure EXACTLY:
                [
                  {
                    "category": "Java Core",
                    "question": "What is the JVM memory model...",
                    "hint": "Refer to heap vs stack allocation..."
                  }
                ]
                
                Respond with raw JSON only. Do not include markdown code block syntax (like ```json ... ```) or any other text.
                
                Resume JSON:
                %s
                
                Job Description:
                %s
                """.formatted(resumeJson, jdText);

        Prompt prompt = new Prompt(promptText);
        String response = chatModel.call(prompt).getResult().getOutput().getText();

        if (response.contains("```")) {
            response = response.replaceAll("```json", "")
                               .replaceAll("```", "")
                               .trim();
        }

        User user = userRepository.findById(userId).orElseThrow();
        InterviewQuestions iq = InterviewQuestions.builder()
                .user(user)
                .questionsJson(response)
                .build();
        interviewQuestionsRepository.save(iq);

        return response;
    }

    @Override
    @Transactional
    public String analyzeSkillGap(Long resumeId, String jdText, Long userId) throws Exception {
        log.info("Performing Skill Gap Analysis for resume: {}", resumeId);
        Resume resume = resumeRepository.findByIdAndUserId(resumeId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));

        String resumeJson = resume.getParsedResume() != null ? resume.getParsedResume().getParsedJson() : "{}";

        String promptText = """
                You are a senior technical advisor.
                Analyze the skills mentioned in the resume against the target Job Description.
                Identify skills the candidate already possesses, missing skills, and suggest a structured learning order to bridge the gap.
                
                Return a valid JSON object matching this structure EXACTLY:
                {
                  "alreadyHave": ["Java", "Spring Boot"],
                  "missing": ["Docker", "Kafka", "Redis"],
                  "recommendedLearningOrder": [
                     {
                       "skill": "Docker",
                       "priority": "High",
                       "resourceSuggestion": "Docker Mastery course on Udemy or official documentation"
                     }
                  ]
                }
                
                Respond with raw JSON only. Do not include markdown code block syntax (like ```json ... ```) or any other text.
                
                Resume JSON:
                %s
                
                Job Description:
                %s
                """.formatted(resumeJson, jdText);

        Prompt prompt = new Prompt(promptText);
        String response = chatModel.call(prompt).getResult().getOutput().getText();

        if (response.contains("```")) {
            response = response.replaceAll("```json", "")
                               .replaceAll("```", "")
                               .trim();
        }

        User user = userRepository.findById(userId).orElseThrow();
        SkillGapReport report = SkillGapReport.builder()
                .user(user)
                .reportJson(response)
                .build();
        skillGapReportRepository.save(report);

        return response;
    }

    @Override
    @Transactional
    public String generatePortfolioSuggestions(Long resumeId, Long userId) throws Exception {
        log.info("Generating V2 portfolio suggestions for resume: {}", resumeId);
        Resume resume = resumeRepository.findByIdAndUserId(resumeId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));

        String resumeJson = resume.getParsedResume() != null ? resume.getParsedResume().getParsedJson() : "{}";

        String promptText = """
                You are a developer coach.
                Analyze the projects on the candidate's resume and suggest improvements or additions to their portfolio projects.
                Provide suggestions for technologies, security, APIs, database setup, and presentation.
                
                Return a valid JSON array matching this structure EXACTLY:
                [
                  {
                    "projectTitle": "Hotel Booking System",
                    "suggestion": "Introduce JWT authentication, add documentation, deploy to free hosting",
                    "learningImpact": "Demonstrates security knowledge and REST API best practices"
                  }
                ]
                
                Respond with raw JSON only. Do not include markdown code block syntax (like ```json ... ```) or any other text.
                
                Resume JSON:
                %s
                """.formatted(resumeJson);

        Prompt prompt = new Prompt(promptText);
        String response = chatModel.call(prompt).getResult().getOutput().getText();

        if (response.contains("```")) {
            response = response.replaceAll("```json", "")
                               .replaceAll("```", "")
                               .trim();
        }

        User user = userRepository.findById(userId).orElseThrow();
        PortfolioSuggestions suggestions = PortfolioSuggestions.builder()
                .user(user)
                .suggestionsJson(response)
                .build();
        portfolioSuggestionsRepository.save(suggestions);

        return response;
    }
}
