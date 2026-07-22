package com.yuktiai.controller;

import com.yuktiai.entity.ResumeTemplate;
import com.yuktiai.repository.ResumeTemplateRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/resume/templates")
@RequiredArgsConstructor
@Slf4j
public class ResumeTemplateController {

    private final ResumeTemplateRepository templateRepository;

    @PostConstruct
    public void initTemplates() {
        if (templateRepository.count() == 0) {
            log.info("Initializing default resume templates in PostgreSQL database...");
            String[] names = {"ATS Friendly", "Modern", "Professional", "Minimal", "Executive"};
            for (String name : names) {
                ResumeTemplate template = ResumeTemplate.builder()
                        .name(name)
                        .displayName(name)
                        .description("Professional layout style for " + name)
                        .isDefault(name.equalsIgnoreCase("ATS Friendly"))
                        .isActive(true)
                        .build();
                templateRepository.save(template);
            }
        }
    }

    @GetMapping
    public ResponseEntity<List<ResumeTemplate>> getTemplates() {
        List<ResumeTemplate> list = templateRepository.findByIsActiveTrue();
        return ResponseEntity.ok(list);
    }
}
