package com.yuktiai.controller;

import com.yuktiai.entity.Resume;
import com.yuktiai.entity.ResumeVersion;
import com.yuktiai.entity.User;
import com.yuktiai.exception.ResourceNotFoundException;
import com.yuktiai.repository.ResumeRepository;
import com.yuktiai.repository.ResumeVersionRepository;
import com.yuktiai.repository.UserRepository;
import com.yuktiai.service.DOCXGeneratorService;
import com.yuktiai.service.PdfGeneratorService;
import com.yuktiai.service.ResumeHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
@Slf4j
public class ResumeHistoryController {

    private final ResumeHistoryService historyService;
    private final ResumeRepository resumeRepository;
    private final ResumeVersionRepository versionRepository;
    private final UserRepository userRepository;
    private final DOCXGeneratorService docxGeneratorService;
    private final PdfGeneratorService pdfGeneratorService;
    private final com.yuktiai.repository.ResumeDownloadRepository resumeDownloadRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    @GetMapping("/history/{resumeId}")
    public ResponseEntity<List<ResumeVersion>> getVersionHistory(@PathVariable Long resumeId) {
        User user = getCurrentUser();
        Resume resume = resumeRepository.findByIdAndUserId(resumeId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found with ID: " + resumeId));

        List<ResumeVersion> versions = historyService.getVersions(resume.getId());
        return ResponseEntity.ok(versions);
    }

    @GetMapping("/version/{id}")
    public ResponseEntity<ResumeVersion> getVersionDetails(@PathVariable Long id) {
        User user = getCurrentUser();
        ResumeVersion version = versionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Version not found with ID: " + id));

        if (!version.getResume().getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(version);
    }

    @PostMapping("/version/restore/{id}")
    public ResponseEntity<?> restoreVersion(@PathVariable Long id) {
        User user = getCurrentUser();
        ResumeVersion version = versionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Version not found with ID: " + id));

        if (!version.getResume().getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Unauthorized access."));
        }

        try {
            historyService.restoreVersion(id);
            return ResponseEntity.ok(Map.of("message", "Version " + version.getVersionNumber() + " successfully restored as active."));
        } catch (Exception e) {
            log.error("Failed to restore version", e);
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to restore version: " + e.getMessage()));
        }
    }

    @DeleteMapping("/version/{id}")
    public ResponseEntity<?> deleteVersion(@PathVariable Long id) {
        User user = getCurrentUser();
        ResumeVersion version = versionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Version not found with ID: " + id));

        if (!version.getResume().getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Unauthorized access."));
        }

        historyService.deleteVersion(id);
        return ResponseEntity.ok(Map.of("message", "Version " + version.getVersionNumber() + " deleted successfully."));
    }

    @PostMapping("/download/docx")
    public ResponseEntity<byte[]> downloadDocx(@RequestBody Map<String, String> payload) {
        String resumeJson = payload.get("resumeJson");
        String templateName = payload.getOrDefault("templateName", "ATS Friendly");

        if (resumeJson == null || resumeJson.trim().isEmpty()) {
             return ResponseEntity.badRequest().build();
        }

        try {
            User user = getCurrentUser();
            byte[] docxBytes = docxGeneratorService.generateResumeDocx(resumeJson, templateName);
            
            // Log download to database
            List<Resume> resumes = resumeRepository.findByUserIdOrderByUploadedAtDesc(user.getId());
            if (!resumes.isEmpty()) {
                com.yuktiai.entity.ResumeDownload download = com.yuktiai.entity.ResumeDownload.builder()
                        .resume(resumes.get(0))
                        .user(user)
                        .format("DOCX")
                        .build();
                resumeDownloadRepository.save(download);
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=resume.docx")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(docxBytes);
        } catch (Exception e) {
            log.error("Failed to generate docx for download", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/download/pdf")
    public ResponseEntity<byte[]> downloadPdf(@RequestBody Map<String, String> payload) {
        String resumeJson = payload.get("resumeJson");
        String templateName = payload.getOrDefault("templateName", "ATS Friendly");

        if (resumeJson == null || resumeJson.trim().isEmpty()) {
             return ResponseEntity.badRequest().build();
        }

        try {
            User user = getCurrentUser();
            byte[] pdfBytes = pdfGeneratorService.generateResumePdf(resumeJson, templateName);

            // Log download to database
            List<Resume> resumes = resumeRepository.findByUserIdOrderByUploadedAtDesc(user.getId());
            if (!resumes.isEmpty()) {
                com.yuktiai.entity.ResumeDownload download = com.yuktiai.entity.ResumeDownload.builder()
                        .resume(resumes.get(0))
                        .user(user)
                        .format("PDF")
                        .build();
                resumeDownloadRepository.save(download);
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=resume.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (Exception e) {
            log.error("Failed to generate PDF for download", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
