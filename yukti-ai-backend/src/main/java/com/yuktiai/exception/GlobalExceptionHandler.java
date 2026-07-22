package com.yuktiai.exception;

import com.yuktiai.dto.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    private String getFormattedTimestamp() {
        return LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
        log.error("Resource not found exception: {}", ex.getMessage());
        ErrorResponse err = ErrorResponse.builder()
                .message(ex.getMessage())
                .errorCode("RESOURCE_NOT_FOUND")
                .timestamp(getFormattedTimestamp())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(err, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex, HttpServletRequest request) {
        log.error("Bad credentials exception: {}", ex.getMessage());
        ErrorResponse err = ErrorResponse.builder()
                .message("Invalid email or password")
                .errorCode("BAD_CREDENTIALS")
                .timestamp(getFormattedTimestamp())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(err, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUsernameNotFound(UsernameNotFoundException ex, HttpServletRequest request) {
        log.error("Username not found exception: {}", ex.getMessage());
        ErrorResponse err = ErrorResponse.builder()
                .message(ex.getMessage())
                .errorCode("USER_NOT_FOUND")
                .timestamp(getFormattedTimestamp())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(err, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex, HttpServletRequest request) {
        log.error("Illegal argument exception: {}", ex.getMessage());
        ErrorResponse err = ErrorResponse.builder()
                .message(ex.getMessage())
                .errorCode("BAD_REQUEST")
                .timestamp(getFormattedTimestamp())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(err, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        log.error("Validation error: {}", errors);

        ErrorResponse err = ErrorResponse.builder()
                .message("Validation Failed")
                .errorCode("VALIDATION_ERROR")
                .timestamp(getFormattedTimestamp())
                .path(request.getRequestURI())
                .data(errors)
                .build();
        return new ResponseEntity<>(err, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception ex, HttpServletRequest request) {
        log.error("An unexpected error occurred: ", ex);
        ErrorResponse err = ErrorResponse.builder()
                .message("An internal server error occurred: " + ex.getMessage())
                .errorCode("INTERNAL_SERVER_ERROR")
                .timestamp(getFormattedTimestamp())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
