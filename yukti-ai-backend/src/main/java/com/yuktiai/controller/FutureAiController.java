package com.yuktiai.controller;

import com.yuktiai.entity.User;
import com.yuktiai.exception.ResourceNotFoundException;
import com.yuktiai.repository.UserRepository;
import com.yuktiai.service.FutureAiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/future")
@RequiredArgsConstructor
@Slf4j
public class FutureAiController {

    private final FutureAiService futureAiService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    @PostMapping("/cover-letter")
    public ResponseEntity<?> getCoverLetter(@RequestBody Map<String, String> payload) {
        User user = getCurrentUser();
        Long resumeId = Long.parseLong(payload.get("resumeId"));
        String jdText = payload.get("jdText");

        try {
            String content = futureAiService.generateCoverLetter(resumeId, jdText, user.getId());
            return ResponseEntity.ok(Map.of("content", content));
        } catch (Exception e) {
            log.error("Failed to generate cover letter", e);
            return ResponseEntity.internalServerError().body(Map.of("message", "Cover letter failure: " + e.getMessage()));
        }
    }

    @PostMapping("/linkedin-summary")
    public ResponseEntity<?> getLinkedInSummary(@RequestBody Map<String, String> payload) {
        User user = getCurrentUser();
        Long resumeId = Long.parseLong(payload.get("resumeId"));

        try {
            String content = futureAiService.generateLinkedInSummary(resumeId, user.getId());
            return ResponseEntity.ok(Map.of("content", content));
        } catch (Exception e) {
            log.error("Failed to generate LinkedIn summary", e);
            return ResponseEntity.internalServerError().body(Map.of("message", "LinkedIn summary failure: " + e.getMessage()));
        }
    }

    @PostMapping("/interview-questions")
    public ResponseEntity<?> getInterviewQuestions(@RequestBody Map<String, String> payload) {
        User user = getCurrentUser();
        Long resumeId = Long.parseLong(payload.get("resumeId"));
        String jdText = payload.get("jdText");

        try {
            String questionsJson = futureAiService.generateInterviewQuestions(resumeId, jdText, user.getId());
            return ResponseEntity.ok(Map.of("questionsJson", questionsJson));
        } catch (Exception e) {
            log.error("Failed to generate interview questions", e);
            return ResponseEntity.internalServerError().body(Map.of("message", "Interview questions failure: " + e.getMessage()));
        }
    }

    @PostMapping("/skill-gap")
    public ResponseEntity<?> getSkillGapReport(@RequestBody Map<String, String> payload) {
        User user = getCurrentUser();
        Long resumeId = Long.parseLong(payload.get("resumeId"));
        String jdText = payload.get("jdText");

        try {
            String reportJson = futureAiService.analyzeSkillGap(resumeId, jdText, user.getId());
            return ResponseEntity.ok(Map.of("reportJson", reportJson));
        } catch (Exception e) {
            log.error("Failed to generate skill gap report", e);
            return ResponseEntity.internalServerError().body(Map.of("message", "Skill gap failure: " + e.getMessage()));
        }
    }

    @PostMapping("/portfolio-suggestions")
    public ResponseEntity<?> getPortfolioSuggestions(@RequestBody Map<String, String> payload) {
        User user = getCurrentUser();
        Long resumeId = Long.parseLong(payload.get("resumeId"));

        try {
            String suggestionsJson = futureAiService.generatePortfolioSuggestions(resumeId, user.getId());
            return ResponseEntity.ok(Map.of("suggestionsJson", suggestionsJson));
        } catch (Exception e) {
            log.error("Failed to generate portfolio suggestions", e);
            return ResponseEntity.internalServerError().body(Map.of("message", "Portfolio suggestions failure: " + e.getMessage()));
        }
    }
}
