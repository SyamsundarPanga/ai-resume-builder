package com.yuktiai.service;

public interface FutureAiService {
    String generateCoverLetter(Long resumeId, String jdText, Long userId) throws Exception;
    String generateLinkedInSummary(Long resumeId, Long userId) throws Exception;
    String generateInterviewQuestions(Long resumeId, String jdText, Long userId) throws Exception;
    String analyzeSkillGap(Long resumeId, String jdText, Long userId) throws Exception;
    String generatePortfolioSuggestions(Long resumeId, Long userId) throws Exception;
}
