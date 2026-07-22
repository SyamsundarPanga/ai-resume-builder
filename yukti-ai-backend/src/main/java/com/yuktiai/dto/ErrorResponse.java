package com.yuktiai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponse {
    @Builder.Default
    private boolean success = false;
    private String message;
    private String errorCode;
    private String timestamp;
    private String path;
    private Object data;
}
