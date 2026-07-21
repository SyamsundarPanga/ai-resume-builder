package com.yuktiai.service;

import org.springframework.web.multipart.MultipartFile;

public interface ResumeParserService {
    String parseResumeToStructuredJson(MultipartFile file) throws Exception;
}
