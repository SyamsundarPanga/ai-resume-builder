package com.yuktiai.service;

import com.yuktiai.entity.JobDescription;
import com.yuktiai.entity.Resume;

import java.util.List;
import java.util.Map;

public interface ResumeOptimizerService {
    String getOptimizedResumeJson(Resume resume, JobDescription jobDescription);
    String getOptimizedResumeJson(Resume resume, JobDescription jobDescription, List<String> confirmedSkills, Map<String, String> additionalExperiences);
}
