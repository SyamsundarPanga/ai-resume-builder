package com.yuktiai.controller;

import com.yuktiai.dto.ResumeResponse;
import com.yuktiai.entity.ParsedResume;
import com.yuktiai.entity.Resume;
import com.yuktiai.entity.User;
import com.yuktiai.exception.ResourceNotFoundException;
import com.yuktiai.service.CloudinaryService;
import com.yuktiai.service.ResumeParserService;
import com.yuktiai.repository.ParsedResumeRepository;
import com.yuktiai.repository.ResumeRepository;
import com.yuktiai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
@Slf4j
public class ResumeController {

    private final ResumeRepository resumeRepository;
    private final ParsedResumeRepository parsedResumeRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final ResumeParserService resumeParserService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file) {
        User user = getCurrentUser();
        log.info("Resume upload request by user: {}", user.getEmail());

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "File cannot be empty."));
        }

        // Validate size (10 MB max)
        if (file.getSize() > 10 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(Map.of("message", "File size exceeds limit of 10MB."));
        }

        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || (!originalFileName.toLowerCase().endsWith(".pdf") && !originalFileName.toLowerCase().endsWith(".docx"))) {
            return ResponseEntity.badRequest().body(Map.of("message", "Only PDF and DOCX files are supported."));
        }

        try {
            // 1. Cloudinary upload
            String cloudinaryUrl = cloudinaryService.uploadFile(file);

            // 2. Save resume metadata
            Resume resume = Resume.builder()
                    .user(user)
                    .originalFileName(originalFileName)
                    .cloudinaryUrl(cloudinaryUrl)
                    .fileType(originalFileName.toLowerCase().endsWith(".pdf") ? "PDF" : "DOCX")
                    .build();

            resume = resumeRepository.save(resume);

            // 3. Parse resume with Apache POI/PDFBox & Gemini AI
            String parsedJson = resumeParserService.parseResumeToStructuredJson(file);

            // 4. Save parsed structured JSON
            ParsedResume parsedResume = ParsedResume.builder()
                    .resume(resume)
                    .parsedJson(parsedJson)
                    .build();

            parsedResumeRepository.save(parsedResume);
            resume.setParsedResume(parsedResume);

            return ResponseEntity.ok(mapToResponse(resume));
        } catch (Exception e) {
            log.error("Failed to complete upload and parser flow", e);
            return ResponseEntity.internalServerError().body(Map.of("message", "Error parsing or uploading file: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<ResumeResponse>> getAllResumes() {
        User user = getCurrentUser();
        List<Resume> resumes = resumeRepository.findByUserIdOrderByUploadedAtDesc(user.getId());
        List<ResumeResponse> responses = resumes.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResumeResponse> getResumeById(@PathVariable Long id) {
        User user = getCurrentUser();
        Resume resume = resumeRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with ID: " + id));
        return ResponseEntity.ok(mapToResponse(resume));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResume(@PathVariable Long id) {
        User user = getCurrentUser();
        Resume resume = resumeRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with ID: " + id));

        // Delete from Cloudinary
        cloudinaryService.deleteFile(resume.getCloudinaryUrl());

        // Delete from DB (on cascade deletes parsed resumes)
        resumeRepository.delete(resume);

        return ResponseEntity.ok(Map.of("message", "Resume deleted successfully!"));
    }

    private ResumeResponse mapToResponse(Resume resume) {
        return ResumeResponse.builder()
                .id(resume.getId())
                .originalFileName(resume.getOriginalFileName())
                .cloudinaryUrl(resume.getCloudinaryUrl())
                .fileType(resume.getFileType())
                .uploadedAt(resume.getUploadedAt())
                .parsedJson(resume.getParsedResume() != null ? resume.getParsedResume().getParsedJson() : null)
                .build();
    }
}
