package com.yuktiai.serviceimpl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yuktiai.dto.ResumeData;
import com.yuktiai.service.DOCXGeneratorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DOCXGeneratorServiceImpl implements DOCXGeneratorService {

    private final ObjectMapper objectMapper;

    @Override
    public byte[] generateResumeDocx(String resumeJson, String templateName) throws Exception {
        log.info("Generating DOCX resume using Apache POI, template style: {}", templateName);
        ResumeData data = objectMapper.readValue(resumeJson, ResumeData.class);

        XWPFDocument document = new XWPFDocument();

        // 1. Title / Header Name
        XWPFParagraph namePara = document.createParagraph();
        namePara.setAlignment(ParagraphAlignment.LEFT);
        XWPFRun nameRun = namePara.createRun();
        nameRun.setText(data.getName() != null ? data.getName().toUpperCase() : "YOUR NAME");
        nameRun.setBold(true);
        nameRun.setFontSize(22);
        nameRun.setFontFamily("Calibri");

        // 2. Contact Information
        XWPFParagraph contactPara = document.createParagraph();
        contactPara.setAlignment(ParagraphAlignment.LEFT);
        XWPFRun contactRun = contactPara.createRun();
        StringBuilder contactInfo = new StringBuilder();
        if (data.getEmail() != null) contactInfo.append(data.getEmail());
        if (data.getPhone() != null && !data.getPhone().isEmpty()) contactInfo.append("  |  ").append(data.getPhone());
        if (data.getLinks() != null && !data.getLinks().isEmpty()) {
            for (String link : data.getLinks()) {
                contactInfo.append("  |  ").append(link);
            }
        }
        contactRun.setText(contactInfo.toString());
        contactRun.setFontSize(10);
        contactRun.setColor("555555");
        contactRun.setFontFamily("Calibri");

        // Divider
        XWPFParagraph divPara = document.createParagraph();
        XWPFRun divRun = divPara.createRun();
        divRun.setText("_________________________________________________________________________________");
        divRun.setColor("B8860B");

        // 3. Professional Summary
        if (data.getSummary() != null && !data.getSummary().trim().isEmpty()) {
            addSectionTitle(document, "PROFESSIONAL SUMMARY");
            XWPFParagraph summaryPara = document.createParagraph();
            XWPFRun summaryRun = summaryPara.createRun();
            summaryRun.setText(data.getSummary());
            summaryRun.setFontSize(10.5);
            summaryRun.setFontFamily("Calibri");
        }

        // 4. Key Skills
        if (data.getSkills() != null && !data.getSkills().isEmpty()) {
            addSectionTitle(document, "KEY SKILLS");
            XWPFParagraph skillsPara = document.createParagraph();
            XWPFRun skillsRun = skillsPara.createRun();
            skillsRun.setText(String.join(", ", data.getSkills()));
            skillsRun.setFontSize(10.5);
            skillsRun.setFontFamily("Calibri");
        }

        // 5. Professional Experience
        if (data.getExperience() != null && !data.getExperience().isEmpty()) {
            addSectionTitle(document, "PROFESSIONAL EXPERIENCE");
            for (ResumeData.ExperienceDto exp : data.getExperience()) {
                XWPFParagraph jobHeader = document.createParagraph();
                XWPFRun jobTitleRun = jobHeader.createRun();
                jobTitleRun.setText(exp.getRole() + " - " + exp.getCompany() + "     (" + exp.getStartDate() + " - " + exp.getEndDate() + ")");
                jobTitleRun.setBold(true);
                jobTitleRun.setFontSize(11);
                jobTitleRun.setFontFamily("Calibri");

                if (exp.getDescription() != null && !exp.getDescription().trim().isEmpty()) {
                    String[] lines = exp.getDescription().split("\n");
                    for (String line : lines) {
                        if (line.trim().isEmpty()) continue;
                        String bulletText = line.trim();
                        if (bulletText.startsWith("-") || bulletText.startsWith("*")) {
                            bulletText = bulletText.substring(1).trim();
                        }
                        XWPFParagraph bulletPara = document.createParagraph();
                        bulletPara.setIndentationLeft(360); // 0.25 inches
                        XWPFRun bulletRun = bulletPara.createRun();
                        bulletRun.setText("• " + bulletText);
                        bulletRun.setFontSize(10);
                        bulletRun.setFontFamily("Calibri");
                    }
                }
            }
        }

        // 6. Projects
        if (data.getProjects() != null && !data.getProjects().isEmpty()) {
            addSectionTitle(document, "PROJECTS");
            for (ResumeData.ProjectDto proj : data.getProjects()) {
                XWPFParagraph projHeader = document.createParagraph();
                XWPFRun projRun = projHeader.createRun();
                String techStr = (proj.getTechnologies() != null && !proj.getTechnologies().isEmpty())
                        ? " (" + String.join(", ", proj.getTechnologies()) + ")"
                        : "";
                projRun.setText(proj.getTitle() + techStr);
                projRun.setBold(true);
                projRun.setFontSize(11);
                projRun.setFontFamily("Calibri");

                if (proj.getDescription() != null && !proj.getDescription().trim().isEmpty()) {
                    String[] lines = proj.getDescription().split("\n");
                    for (String line : lines) {
                        if (line.trim().isEmpty()) continue;
                        String bulletText = line.trim();
                        if (bulletText.startsWith("-") || bulletText.startsWith("*")) {
                            bulletText = bulletText.substring(1).trim();
                        }
                        XWPFParagraph bulletPara = document.createParagraph();
                        bulletPara.setIndentationLeft(360);
                        XWPFRun bulletRun = bulletPara.createRun();
                        bulletRun.setText("• " + bulletText);
                        bulletRun.setFontSize(10);
                        bulletRun.setFontFamily("Calibri");
                    }
                }
            }
        }

        // 7. Education
        if (data.getEducation() != null && !data.getEducation().isEmpty()) {
            addSectionTitle(document, "EDUCATION");
            for (ResumeData.EducationDto edu : data.getEducation()) {
                XWPFParagraph eduPara = document.createParagraph();
                XWPFRun eduRun = eduPara.createRun();
                String field = (edu.getFieldOfStudy() != null && !edu.getFieldOfStudy().isEmpty()) ? ", " + edu.getFieldOfStudy() : "";
                eduRun.setText(edu.getDegree() + field + " - " + edu.getInstitution() + "   (" + edu.getStartDate() + " - " + edu.getEndDate() + ")");
                eduRun.setBold(true);
                eduRun.setFontSize(10.5);
                eduRun.setFontFamily("Calibri");

                if (edu.getGrade() != null && !edu.getGrade().isEmpty()) {
                    XWPFParagraph gradePara = document.createParagraph();
                    gradePara.setIndentationLeft(360);
                    XWPFRun gradeRun = gradePara.createRun();
                    gradeRun.setText("GPA/Grade: " + edu.getGrade());
                    gradeRun.setFontSize(10);
                    gradeRun.setFontFamily("Calibri");
                }
            }
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        document.write(out);
        document.close();
        return out.toByteArray();
    }

    private void addSectionTitle(XWPFDocument document, String title) {
        XWPFParagraph titlePara = document.createParagraph();
        titlePara.setSpacingBefore(120);
        titlePara.setSpacingAfter(40);
        XWPFRun titleRun = titlePara.createRun();
        titleRun.setText(title.toUpperCase());
        titleRun.setBold(true);
        titleRun.setFontSize(13);
        titleRun.setColor("B8860B");
        titleRun.setFontFamily("Calibri");
    }
}
