package com.yuktiai.dto;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Builder
public class ResumeResponse {
    private Long id;
    private String originalFileName;
    private String cloudinaryUrl;
    private String fileType;
    private OffsetDateTime uploadedAt;
    private String parsedJson;
}
