package com.yuktiai.parser;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Component
@Slf4j
public class DocumentTextExtractor {

    public String extractText(MultipartFile file) throws IOException {
        String filename = file.getOriginalFilename();
        if (filename == null) {
            throw new IllegalArgumentException("Filename cannot be null");
        }

        try (InputStream inputStream = file.getInputStream()) {
            if (filename.toLowerCase().endsWith(".pdf")) {
                return extractTextFromPdf(inputStream);
            } else if (filename.toLowerCase().endsWith(".docx")) {
                return extractTextFromDocx(inputStream);
            } else {
                throw new IllegalArgumentException("Unsupported file format. Only PDF and DOCX are allowed.");
            }
        }
    }

    private String extractTextFromPdf(InputStream inputStream) throws IOException {
        log.info("Extracting text from PDF using PDFBox");
        byte[] bytes = inputStream.readAllBytes();
        try (PDDocument document = Loader.loadPDF(bytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String extractTextFromDocx(InputStream inputStream) throws IOException {
        log.info("Extracting text from DOCX using Apache POI");
        try (XWPFDocument document = new XWPFDocument(inputStream);
             XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {
            return extractor.getText();
        }
    }
}
