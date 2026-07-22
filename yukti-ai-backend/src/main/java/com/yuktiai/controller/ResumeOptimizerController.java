package com.yuktiai.controller;

import com.yuktiai.service.ResumeAnalysisService;
import com.yuktiai.ats.ATSScoreCalculator;
import com.yuktiai.service.CloudinaryService;
import com.yuktiai.dto.MatchRequest;
import com.yuktiai.dto.OptimizeRequest;
import com.yuktiai.entity.AtsScore;
import com.yuktiai.entity.JobDescription;
import com.yuktiai.entity.OptimizedResume;
import com.yuktiai.entity.Resume;
import com.yuktiai.exception.ResourceNotFoundException;
import com.yuktiai.matching.KeywordMatcher;
import com.yuktiai.matching.SemanticMatcher;
import com.yuktiai.repository.AtsScoreRepository;
import com.yuktiai.repository.JobDescriptionRepository;
import com.yuktiai.repository.OptimizedResumeRepository;
import com.yuktiai.repository.ResumeRepository;
import com.yuktiai.service.PdfGeneratorService;
import com.yuktiai.service.ResumeHistoryService;
import com.yuktiai.service.ResumeOptimizerService;
import com.yuktiai.validation.ResumeValidator;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
@Slf4j
public class ResumeOptimizerController {

    private final ResumeRepository resumeRepository;
    private final JobDescriptionRepository jobDescriptionRepository;
    private final OptimizedResumeRepository optimizedResumeRepository;
    private final AtsScoreRepository atsScoreRepository;
    
    private final ResumeOptimizerService resumeOptimizerService;
    private final PdfGeneratorService pdfGeneratorService;
    private final CloudinaryService cloudinaryService;

    // AI Engine and Scoring Additions
    private final KeywordMatcher keywordMatcher;
    private final SemanticMatcher semanticMatcher;
    private final ATSScoreCalculator atsScoreCalculator;
    private final ResumeValidator resumeValidator;
    private final ResumeAnalysisService resumeAnalysisService;
    private final ResumeHistoryService resumeHistoryService;

    @PostMapping("/match")
    public ResponseEntity<?> matchResume(@Valid @RequestBody MatchRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("Matching resume ID: {} against job description ID: {} for user: {}", 
                request.getResumeId(), request.getJobDescriptionId(), email);

        Resume resume = resumeRepository.findById(request.getResumeId())
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with ID: " + request.getResumeId()));

        JobDescription jobDescription = jobDescriptionRepository.findById(request.getJobDescriptionId())
                .orElseThrow(() -> new ResourceNotFoundException("Job description not found with ID: " + request.getJobDescriptionId()));

        // Security check
        if (!resume.getUser().getEmail().equals(email) || !jobDescription.getUser().getEmail().equals(email)) {
            return ResponseEntity.status(403).body(Map.of("message", "Unauthorized access."));
        }

        String resumeJson = resume.getParsedResume() != null ? resume.getParsedResume().getParsedJson() : "{}";
        String jdJson = jobDescription.getParsedJson() != null ? jobDescription.getParsedJson() : "{}";

        // Execute matching engine
        KeywordMatcher.KeywordMatchResult keywordMatch = keywordMatcher.matchKeywords(resumeJson, jdJson);
        var semanticMatch = semanticMatcher.matchSemantics(resumeJson, jdJson);
        ATSScoreCalculator.ATSBreakdown initialScore = atsScoreCalculator.calculateATSScore(resumeJson, jdJson);

        return ResponseEntity.ok(Map.of(
                "keywordMatch", keywordMatch,
                "semanticMatch", semanticMatch,
                "initialScore", initialScore
        ));
    }

    @PostMapping("/optimize")
    public ResponseEntity<?> optimizeResume(@Valid @RequestBody OptimizeRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("Optimizing resume: {} with job: {} by user: {}", 
                request.getResumeId(), request.getJobDescriptionId(), email);

        Resume resume = resumeRepository.findById(request.getResumeId())
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with ID: " + request.getResumeId()));

        JobDescription jobDescription = jobDescriptionRepository.findById(request.getJobDescriptionId())
                .orElseThrow(() -> new ResourceNotFoundException("Job description not found with ID: " + request.getJobDescriptionId()));

        if (!resume.getUser().getEmail().equals(email) || !jobDescription.getUser().getEmail().equals(email)) {
            return ResponseEntity.status(403).body(Map.of("message", "Unauthorized access."));
        }

        try {
            // 1. Optimize resume details via Gemini (injecting user confirmed skills details)
            String optimizedJson = resumeOptimizerService.getOptimizedResumeJson(
                    resume, jobDescription, request.getConfirmedSkills(), request.getAdditionalExperiences());

            // 2. Programmatic validation check (prevent hallucinated skill injections)
            String resumeJson = resume.getParsedResume() != null ? resume.getParsedResume().getParsedJson() : "{}";
            ResumeValidator.ValidationReport validationReport = resumeValidator.validateResume(
                    resumeJson, optimizedJson, request.getConfirmedSkills());

            // Use the cleaned optimized JSON for final processes
            String cleanedOptimizedJson = validationReport.getCleanedOptimizedJson();

            // 3. Compute final ATS scores based on cleaned optimized details
            ATSScoreCalculator.ATSBreakdown finalScoreBreakdown = atsScoreCalculator.calculateATSScore(
                    cleanedOptimizedJson, jobDescription.getParsedJson());

            // Save final ATS score log to DB
            AtsScore atsScore = AtsScore.builder()
                    .resume(resume)
                    .jobDescription(jobDescription)
                    .overallScore(finalScoreBreakdown.getOverallScore())
                    .skillsScore(finalScoreBreakdown.getSkillsScore())
                    .experienceScore(finalScoreBreakdown.getExperienceScore())
                    .projectsScore(finalScoreBreakdown.getProjectsScore())
                    .educationScore(finalScoreBreakdown.getEducationScore())
                    .formattingScore(finalScoreBreakdown.getFormattingScore())
                    .build();
            atsScoreRepository.save(atsScore);

            // 4. Generate final PDF layout
            byte[] pdfBytes = pdfGeneratorService.generateResumePdf(cleanedOptimizedJson, request.getTemplateName());

            // 5. Cloudinary upload
            String fileName = "optimized_" + resume.getId() + "_" + System.currentTimeMillis();
            String cloudinaryUrl = cloudinaryService.uploadBytes(pdfBytes, fileName);

            // 6. Save optimized resume metadata
            OptimizedResume optimizedResume = OptimizedResume.builder()
                    .resume(resume)
                    .jobDescription(jobDescription)
                    .cloudinaryUrl(cloudinaryUrl)
                    .templateName(request.getTemplateName())
                    .build();
            optimizedResumeRepository.save(optimizedResume);

            // 6b. Save historical version log
            resumeHistoryService.saveNewVersion(resume, cloudinaryUrl, request.getTemplateName(), cleanedOptimizedJson);

            // 7. Generate final Analysis report
            String analysisReport = resumeAnalysisService.generateAnalysisReport(cleanedOptimizedJson, jobDescription.getParsedJson());

            return ResponseEntity.ok(Map.of(
                    "cloudinaryUrl", cloudinaryUrl,
                    "atsScore", atsScore,
                    "validationReport", validationReport,
                    "analysisReport", analysisReport,
                    "optimizedJson", cleanedOptimizedJson
            ));

        } catch (Exception e) {
            log.error("Failed to complete full optimization sequence", e);
            return ResponseEntity.internalServerError().body(Map.of("message", "Optimization failed: " + e.getMessage()));
        }
    }
}
