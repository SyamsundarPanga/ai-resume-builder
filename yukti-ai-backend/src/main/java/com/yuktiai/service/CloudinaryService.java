package com.yuktiai.service;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface CloudinaryService {
    String uploadFile(MultipartFile file) throws IOException;
    String uploadBytes(byte[] bytes, String fileName) throws IOException;
    void deleteFile(String cloudinaryUrl);
}
