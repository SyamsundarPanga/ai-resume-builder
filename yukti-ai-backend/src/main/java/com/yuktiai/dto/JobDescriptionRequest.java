package com.yuktiai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class JobDescriptionRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;
}
