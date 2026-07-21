package com.yuktiai.serviceimpl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;
import com.yuktiai.dto.ResumeData;
import com.yuktiai.service.PdfGeneratorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class PdfGeneratorServiceImpl implements PdfGeneratorService {

    private final ObjectMapper objectMapper;

    @Override
    public byte[] generateResumePdf(String resumeJson, String templateName) throws Exception {
        log.info("Generating PDF for template: {}", templateName);
        ResumeData data = objectMapper.readValue(resumeJson, ResumeData.class);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);
        PdfWriter.getInstance(document, out);

        document.open();

        Color primaryColor;
        Color secondaryColor;
        Font nameFont;
        Font sectionTitleFont;
        Font subTitleFont;
        Font bodyFont;

        boolean isSerif = templateName.equalsIgnoreCase("Professional") || templateName.equalsIgnoreCase("Executive");

        int mainFontFamily = isSerif ? Font.TIMES_ROMAN : Font.HELVETICA;

        switch (templateName.toLowerCase()) {
            case "modern":
                primaryColor = new Color(0, 102, 153); // Teal/Blue
                secondaryColor = new Color(102, 102, 102);
                nameFont = new Font(mainFontFamily, 22, Font.BOLD, primaryColor);
                sectionTitleFont = new Font(mainFontFamily, 13, Font.BOLD, primaryColor);
                break;
            case "professional":
                primaryColor = new Color(26, 54, 93); // Dark navy
                secondaryColor = new Color(74, 85, 104);
                nameFont = new Font(mainFontFamily, 20, Font.BOLD, primaryColor);
                sectionTitleFont = new Font(mainFontFamily, 12, Font.BOLD, primaryColor);
                break;
            case "minimal":
                primaryColor = new Color(33, 37, 41); // Charcoal
                secondaryColor = new Color(108, 117, 125);
                nameFont = new Font(mainFontFamily, 18, Font.BOLD, primaryColor);
                sectionTitleFont = new Font(mainFontFamily, 11, Font.BOLD, primaryColor);
                break;
            case "executive":
                primaryColor = new Color(116, 26, 26); // Burgundy
                secondaryColor = new Color(45, 55, 72);
                nameFont = new Font(mainFontFamily, 22, Font.BOLD, primaryColor);
                sectionTitleFont = new Font(mainFontFamily, 13, Font.BOLD, primaryColor);
                break;
            case "ats friendly":
            default:
                primaryColor = Color.BLACK;
                secondaryColor = Color.DARK_GRAY;
                nameFont = new Font(mainFontFamily, 18, Font.BOLD, primaryColor);
                sectionTitleFont = new Font(mainFontFamily, 11, Font.BOLD, primaryColor);
                break;
        }

        subTitleFont = new Font(mainFontFamily, 10, Font.BOLD, Color.BLACK);
        bodyFont = new Font(mainFontFamily, 9, Font.NORMAL, Color.BLACK);
        Font italicBodyFont = new Font(mainFontFamily, 9, Font.ITALIC, Color.DARK_GRAY);

        Paragraph namePara = new Paragraph(data.getName() != null ? data.getName().toUpperCase() : "YOUR NAME", nameFont);
        namePara.setAlignment(templateName.equalsIgnoreCase("professional") || templateName.equalsIgnoreCase("ats friendly") ? Element.ALIGN_CENTER : Element.ALIGN_LEFT);
        document.add(namePara);

        StringBuilder contactInfo = new StringBuilder();
        if (data.getEmail() != null) contactInfo.append(data.getEmail());
        if (data.getPhone() != null && !data.getPhone().isEmpty()) contactInfo.append("  |  ").append(data.getPhone());
        if (data.getLinks() != null && !data.getLinks().isEmpty()) {
            for (String link : data.getLinks()) {
                contactInfo.append("  |  ").append(link);
            }
        }
        Paragraph contactPara = new Paragraph(contactInfo.toString(), new Font(mainFontFamily, 9, Font.NORMAL, secondaryColor));
        contactPara.setAlignment(templateName.equalsIgnoreCase("professional") || templateName.equalsIgnoreCase("ats friendly") ? Element.ALIGN_CENTER : Element.ALIGN_LEFT);
        contactPara.setSpacingAfter(10);
        document.add(contactPara);

        addDivider(document, primaryColor);

        if (data.getSummary() != null && !data.getSummary().trim().isEmpty()) {
            addSectionTitle(document, "PROFESSIONAL SUMMARY", sectionTitleFont);
            Paragraph summaryPara = new Paragraph(data.getSummary(), bodyFont);
            summaryPara.setSpacingAfter(12);
            document.add(summaryPara);
        }

        if (data.getSkills() != null && !data.getSkills().isEmpty()) {
            addSectionTitle(document, "KEY SKILLS", sectionTitleFont);
            String skillsCsv = String.join(", ", data.getSkills());
            Paragraph skillsPara = new Paragraph(skillsCsv, bodyFont);
            skillsPara.setSpacingAfter(12);
            document.add(skillsPara);
        }

        if (data.getExperience() != null && !data.getExperience().isEmpty()) {
            addSectionTitle(document, "PROFESSIONAL EXPERIENCE", sectionTitleFont);
            for (ResumeData.ExperienceDto exp : data.getExperience()) {
                PdfPTable table = new PdfPTable(2);
                table.setWidthPercentage(100);
                table.setSpacingBefore(4);
                table.setSpacingAfter(2);

                PdfPCell leftCell = new PdfPCell(new Paragraph(exp.getRole() + " - " + exp.getCompany(), subTitleFont));
                leftCell.setBorder(com.lowagie.text.Rectangle.NO_BORDER);
                leftCell.setHorizontalAlignment(Element.ALIGN_LEFT);

                PdfPCell rightCell = new PdfPCell(new Paragraph(exp.getStartDate() + " - " + exp.getEndDate(), italicBodyFont));
                rightCell.setBorder(com.lowagie.text.Rectangle.NO_BORDER);
                rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

                table.addCell(leftCell);
                table.addCell(rightCell);
                document.add(table);

                if (exp.getDescription() != null && !exp.getDescription().trim().isEmpty()) {
                    String desc = exp.getDescription();
                    String[] lines = desc.split("\n");
                    for (String line : lines) {
                        if (line.trim().isEmpty()) continue;
                        String bulletText = line.trim();
                        if (bulletText.startsWith("-") || bulletText.startsWith("*")) {
                            bulletText = bulletText.substring(1).trim();
                        }
                        Paragraph bullet = new Paragraph("• " + bulletText, bodyFont);
                        bullet.setIndentationLeft(12);
                        bullet.setSpacingAfter(2);
                        document.add(bullet);
                    }
                }
                Paragraph spacing = new Paragraph(" ");
                spacing.setLeading(4);
                document.add(spacing);
            }
            Paragraph spacing = new Paragraph(" ");
            spacing.setLeading(6);
            document.add(spacing);
        }

        if (data.getProjects() != null && !data.getProjects().isEmpty()) {
            addSectionTitle(document, "PROJECTS", sectionTitleFont);
            for (ResumeData.ProjectDto proj : data.getProjects()) {
                PdfPTable table = new PdfPTable(2);
                table.setWidthPercentage(100);
                table.setSpacingBefore(4);
                table.setSpacingAfter(2);

                String techStr = (proj.getTechnologies() != null && !proj.getTechnologies().isEmpty())
                        ? " (" + String.join(", ", proj.getTechnologies()) + ")"
                        : "";
                PdfPCell leftCell = new PdfPCell(new Paragraph(proj.getTitle() + techStr, subTitleFont));
                leftCell.setBorder(com.lowagie.text.Rectangle.NO_BORDER);
                leftCell.setHorizontalAlignment(Element.ALIGN_LEFT);

                PdfPCell rightCell = new PdfPCell(new Paragraph("", italicBodyFont));
                rightCell.setBorder(com.lowagie.text.Rectangle.NO_BORDER);
                table.addCell(leftCell);
                table.addCell(rightCell);
                document.add(table);

                if (proj.getDescription() != null && !proj.getDescription().trim().isEmpty()) {
                    String[] lines = proj.getDescription().split("\n");
                    for (String line : lines) {
                        if (line.trim().isEmpty()) continue;
                        String bulletText = line.trim();
                        if (bulletText.startsWith("-") || bulletText.startsWith("*")) {
                            bulletText = bulletText.substring(1).trim();
                        }
                        Paragraph bullet = new Paragraph("• " + bulletText, bodyFont);
                        bullet.setIndentationLeft(12);
                        bullet.setSpacingAfter(2);
                        document.add(bullet);
                    }
                }
                Paragraph spacing = new Paragraph(" ");
                spacing.setLeading(4);
                document.add(spacing);
            }
            Paragraph spacing = new Paragraph(" ");
            spacing.setLeading(6);
            document.add(spacing);
        }

        if (data.getEducation() != null && !data.getEducation().isEmpty()) {
            addSectionTitle(document, "EDUCATION", sectionTitleFont);
            for (ResumeData.EducationDto edu : data.getEducation()) {
                PdfPTable table = new PdfPTable(2);
                table.setWidthPercentage(100);
                table.setSpacingBefore(4);
                table.setSpacingAfter(2);

                String field = (edu.getFieldOfStudy() != null && !edu.getFieldOfStudy().isEmpty()) ? ", " + edu.getFieldOfStudy() : "";
                PdfPCell leftCell = new PdfPCell(new Paragraph(edu.getDegree() + field + " - " + edu.getInstitution(), subTitleFont));
                leftCell.setBorder(com.lowagie.text.Rectangle.NO_BORDER);
                leftCell.setHorizontalAlignment(Element.ALIGN_LEFT);

                PdfPCell rightCell = new PdfPCell(new Paragraph(edu.getStartDate() + " - " + edu.getEndDate(), italicBodyFont));
                rightCell.setBorder(com.lowagie.text.Rectangle.NO_BORDER);
                rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

                table.addCell(leftCell);
                table.addCell(rightCell);
                document.add(table);

                if (edu.getGrade() != null && !edu.getGrade().isEmpty()) {
                    Paragraph gradePara = new Paragraph("GPA/Grade: " + edu.getGrade(), bodyFont);
                    gradePara.setIndentationLeft(12);
                    gradePara.setSpacingAfter(4);
                    document.add(gradePara);
                }
            }
        }

        document.close();
        return out.toByteArray();
    }

    private void addSectionTitle(Document document, String title, Font font) throws Exception {
        Paragraph titlePara = new Paragraph(title, font);
        titlePara.setSpacingBefore(10);
        titlePara.setSpacingAfter(4);
        document.add(titlePara);
    }

    private void addDivider(Document document, Color color) throws Exception {
        LineSeparator line = new LineSeparator(1f, 100, color, Element.ALIGN_CENTER, -4);
        Paragraph p = new Paragraph();
        p.add(line);
        p.setSpacingAfter(10);
        document.add(p);
    }
}
