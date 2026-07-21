package com.yuktiai.service;

public interface PdfGeneratorService {
    byte[] generateResumePdf(String resumeJson, String templateName) throws Exception;
}
