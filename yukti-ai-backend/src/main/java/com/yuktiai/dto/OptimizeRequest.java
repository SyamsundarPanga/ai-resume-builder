package com.yuktiai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class OptimizeRequest {
    @NotNull
    private Long resumeId;

    @NotNull
    private Long jobDescriptionId;

    @NotBlank
    private String templateName;

    private List<String> confirmedSkills = new ArrayList<>();
    private Map<String, String> additionalExperiences = new HashMap<>();
}
