package com.yuktiai.service;

public interface DOCXGeneratorService {
    byte[] generateResumeDocx(String resumeJson, String templateName) throws Exception;
}
