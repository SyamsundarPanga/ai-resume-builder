package com.yuktiai.dto;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Builder
public class AtsScoreResponse {
    private Long id;
    private Long resumeId;
    private Long jobDescriptionId;
    private String jobDescriptionTitle;
    private Integer overallScore;
    private Integer skillsScore;
    private Integer experienceScore;
    private Integer projectsScore;
    private Integer educationScore;
    private Integer formattingScore;
    private OffsetDateTime createdAt;
}
