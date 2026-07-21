package com.yuktiai.controller;

import com.yuktiai.entity.AtsScore;
import com.yuktiai.entity.JobDescription;
import com.yuktiai.entity.OptimizedResume;
import com.yuktiai.service.AtsScoreService;
import com.yuktiai.entity.Resume;
import com.yuktiai.entity.User;
import com.yuktiai.exception.ResourceNotFoundException;
import com.yuktiai.repository.JobDescriptionRepository;
import com.yuktiai.repository.OptimizedResumeRepository;
import com.yuktiai.repository.ResumeRepository;
import com.yuktiai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
@Slf4j
public class HistoryController {

    private final ResumeRepository resumeRepository;
    private final JobDescriptionRepository jobDescriptionRepository;
    private final AtsScoreService atsScoreService;
    private final OptimizedResumeRepository optimizedResumeRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    @GetMapping
    public ResponseEntity<?> getHistory() {
        User user = getCurrentUser();
        log.info("Fetching history for user: {}", user.getEmail());

        List<Resume> resumes = resumeRepository.findByUserIdOrderByUploadedAtDesc(user.getId());
        List<JobDescription> jobDescriptions = jobDescriptionRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<AtsScore> atsScores = atsScoreService.getHistory(user.getId());
        List<OptimizedResume> optimizedResumes = optimizedResumeRepository.findByResumeUserIdOrderByCreatedAtDesc(user.getId());

        // Hide sensitive passwords
        resumes.forEach(r -> r.setUser(null));
        jobDescriptions.forEach(jd -> jd.setUser(null));
        atsScores.forEach(s -> {
            s.getResume().setUser(null);
            s.getJobDescription().setUser(null);
        });
        optimizedResumes.forEach(opt -> {
            opt.getResume().setUser(null);
            opt.getJobDescription().setUser(null);
        });

        Map<String, Object> history = new HashMap<>();
        history.put("resumes", resumes);
        history.put("jobDescriptions", jobDescriptions);
        history.put("atsScores", atsScores);
        history.put("optimizedResumes", optimizedResumes);

        return ResponseEntity.ok(history);
    }
}
