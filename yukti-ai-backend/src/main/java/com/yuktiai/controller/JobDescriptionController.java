package com.yuktiai.controller;

import com.yuktiai.dto.JobDescriptionRequest;
import com.yuktiai.entity.JobDescription;
import com.yuktiai.entity.User;
import com.yuktiai.exception.ResourceNotFoundException;
import com.yuktiai.service.JobDescriptionParserService;
import com.yuktiai.repository.JobDescriptionRepository;
import com.yuktiai.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-description")
@RequiredArgsConstructor
@Slf4j
public class JobDescriptionController {

    private final JobDescriptionRepository jobDescriptionRepository;
    private final UserRepository userRepository;
    private final JobDescriptionParserService jdParserService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    @PostMapping("/analyze")
    public ResponseEntity<JobDescription> analyzeJobDescription(@Valid @RequestBody JobDescriptionRequest request) {
        User user = getCurrentUser();
        log.info("Analyzing Job Description by user: {}", user.getEmail());

        String parsedJson = jdParserService.parseJobDescription(request.getDescription());

        JobDescription jd = JobDescription.builder()
                .user(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .parsedJson(parsedJson)
                .build();

        jd = jobDescriptionRepository.save(jd);
        return ResponseEntity.ok(jd);
    }

    @GetMapping
    public ResponseEntity<List<JobDescription>> getJobDescriptions() {
        User user = getCurrentUser();
        List<JobDescription> list = jobDescriptionRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(list);
    }
}
