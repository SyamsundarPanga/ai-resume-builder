package com.yuktiai.service;

import com.yuktiai.entity.AtsScore;
import com.yuktiai.entity.JobDescription;
import com.yuktiai.entity.Resume;

import java.util.List;

public interface AtsScoreService {
    AtsScore calculateAndSaveAtsScore(Resume resume, JobDescription jobDescription);
    List<AtsScore> getHistory(Long userId);
    List<AtsScore> getRecentScores(Long userId);
    AtsScore getLatestScore(Long userId);
}
