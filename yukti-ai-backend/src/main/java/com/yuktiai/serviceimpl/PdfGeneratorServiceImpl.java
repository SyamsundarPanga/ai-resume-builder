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
        log.info("Generating professional PDF for template: {}", templateName);
        ResumeData data = objectMapper.readValue(resumeJson, ResumeData.class);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 40, 40, 40, 40);
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
        boolean isAts = templateName.equalsIgnoreCase("ats friendly");

        switch (templateName.toLowerCase()) {
            case "modern":
                primaryColor = new Color(0, 102, 153); // Teal
                secondaryColor = new Color(90, 90, 90);
                nameFont = new Font(mainFontFamily, 22, Font.BOLD, primaryColor);
                sectionTitleFont = new Font(mainFontFamily, 12, Font.BOLD, primaryColor);
                break;
            case "professional":
                primaryColor = new Color(26, 54, 93); // Navy
                secondaryColor = new Color(80, 80, 80);
                nameFont = new Font(mainFontFamily, 20, Font.BOLD, primaryColor);
                sectionTitleFont = new Font(mainFontFamily, 11, Font.BOLD, primaryColor);
                break;
            case "minimal":
                primaryColor = new Color(33, 37, 41); // Charcoal
                secondaryColor = new Color(100, 100, 100);
                nameFont = new Font(mainFontFamily, 18, Font.BOLD, primaryColor);
                sectionTitleFont = new Font(mainFontFamily, 11, Font.BOLD, primaryColor);
                break;
            case "executive":
                primaryColor = new Color(116, 26, 26); // Burgundy
                secondaryColor = new Color(50, 50, 50);
                nameFont = new Font(mainFontFamily, 22, Font.BOLD, primaryColor);
                sectionTitleFont = new Font(mainFontFamily, 12, Font.BOLD, primaryColor);
                break;
            case "ats friendly":
            default:
                primaryColor = Color.BLACK;
                secondaryColor = Color.DARK_GRAY;
                nameFont = new Font(mainFontFamily, 16, Font.BOLD, primaryColor);
                sectionTitleFont = new Font(mainFontFamily, 10, Font.BOLD, primaryColor);
                break;
        }

        subTitleFont = new Font(mainFontFamily, 9, Font.BOLD, Color.BLACK);
        bodyFont = new Font(mainFontFamily, 9, Font.NORMAL, Color.BLACK);
        Font boldBodyFont = new Font(mainFontFamily, 9, Font.BOLD, Color.BLACK);
        Font italicBodyFont = new Font(mainFontFamily, 9, Font.ITALIC, Color.DARK_GRAY);

        // Header section (Centering only for professional and ATS, left align otherwise)
        Paragraph namePara = new Paragraph(data.getName() != null ? data.getName().toUpperCase() : "CANDIDATE NAME", nameFont);
        namePara.setAlignment(templateName.equalsIgnoreCase("professional") || isAts ? Element.ALIGN_CENTER : Element.ALIGN_LEFT);
        document.add(namePara);

        StringBuilder contactInfo = new StringBuilder();
        if (data.getEmail() != null) contactInfo.append(data.getEmail());
        if (data.getPhone() != null && !data.getPhone().isEmpty()) contactInfo.append("  |  ").append(data.getPhone());
        if (data.getLocation() != null && !data.getLocation().isEmpty()) contactInfo.append("  |  ").append(data.getLocation());
        if (data.getLinks() != null && !data.getLinks().isEmpty()) {
            for (String link : data.getLinks()) {
                contactInfo.append("  |  ").append(link);
            }
        }
        Paragraph contactPara = new Paragraph(contactInfo.toString(), new Font(mainFontFamily, 8, Font.NORMAL, secondaryColor));
        contactPara.setAlignment(templateName.equalsIgnoreCase("professional") || isAts ? Element.ALIGN_CENTER : Element.ALIGN_LEFT);
        contactPara.setSpacingAfter(8);
        document.add(contactPara);

        addDivider(document, primaryColor);

        // Professional Summary
        if (data.getSummary() != null && !data.getSummary().trim().isEmpty()) {
            addSectionTitle(document, "PROFESSIONAL SUMMARY", sectionTitleFont);
            Paragraph summaryPara = new Paragraph(data.getSummary(), bodyFont);
            summaryPara.setSpacingAfter(10);
            summaryPara.setLeading(11);
            document.add(summaryPara);
        }

        // Key Skills (Grouped rendering logic)
        if (data.getSkills() != null && !data.getSkills().isEmpty()) {
            addSectionTitle(document, "KEY SKILLS", sectionTitleFont);
            for (String skillRow : data.getSkills()) {
                if (skillRow.contains(":")) {
                    String[] parts = skillRow.split(":", 2);
                    Paragraph gp = new Paragraph();
                    gp.add(new Chunk(parts[0].trim() + ": ", boldBodyFont));
                    gp.add(new Chunk(parts[1].trim(), bodyFont));
                    gp.setSpacingAfter(2);
                    gp.setLeading(11);
                    document.add(gp);
                } else {
                    Paragraph gp = new Paragraph(skillRow, bodyFont);
                    gp.setSpacingAfter(2);
                    gp.setLeading(11);
                    document.add(gp);
                }
            }
            Paragraph spacing = new Paragraph(" ");
            spacing.setLeading(4);
            document.add(spacing);
        }

        // Professional Experience
        if (data.getExperience() != null && !data.getExperience().isEmpty()) {
            addSectionTitle(document, "PROFESSIONAL EXPERIENCE", sectionTitleFont);
            for (ResumeData.ExperienceDto exp : data.getExperience()) {
                if (isAts) {
                    // ATS Layout must avoid nested tables completely to prevent parsing errors
                    Paragraph titleLine = new Paragraph();
                    titleLine.add(new Chunk(exp.getRole() + "  -  " + exp.getCompany(), subTitleFont));
                    titleLine.add(new Chunk("  (" + exp.getStartDate() + " - " + exp.getEndDate() + ")", italicBodyFont));
                    titleLine.setSpacingBefore(4);
                    titleLine.setSpacingAfter(2);
                    document.add(titleLine);
                } else {
                    PdfPTable table = new PdfPTable(2);
                    table.setWidthPercentage(100);
                    table.setSpacingBefore(4);
                    table.setSpacingAfter(2);

                    PdfPCell leftCell = new PdfPCell(new Paragraph(exp.getRole() + " - " + exp.getCompany(), subTitleFont));
                    leftCell.setBorder(Rectangle.NO_BORDER);
                    leftCell.setHorizontalAlignment(Element.ALIGN_LEFT);

                    PdfPCell rightCell = new PdfPCell(new Paragraph(exp.getStartDate() + " - " + exp.getEndDate(), italicBodyFont));
                    rightCell.setBorder(Rectangle.NO_BORDER);
                    rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

                    table.addCell(leftCell);
                    table.addCell(rightCell);
                    document.add(table);
                }

                if (exp.getDescription() != null && !exp.getDescription().trim().isEmpty()) {
                    String desc = exp.getDescription();
                    String[] lines = desc.split("\n");
                    for (String line : lines) {
                        if (line.trim().isEmpty()) continue;
                        String bulletText = line.trim();
                        if (bulletText.startsWith("-") || bulletText.startsWith("*") || bulletText.startsWith("•")) {
                            bulletText = bulletText.substring(1).trim();
                        }
                        Paragraph bullet = new Paragraph("• " + bulletText, bodyFont);
                        bullet.setIndentationLeft(12);
                        bullet.setSpacingAfter(2);
                        bullet.setLeading(11);
                        document.add(bullet);
                    }
                }
            }
            Paragraph spacing = new Paragraph(" ");
            spacing.setLeading(6);
            document.add(spacing);
        }

        // Projects
        if (data.getProjects() != null && !data.getProjects().isEmpty()) {
            addSectionTitle(document, "PROJECTS", sectionTitleFont);
            for (ResumeData.ProjectDto proj : data.getProjects()) {
                String techStr = (proj.getTechnologies() != null && !proj.getTechnologies().isEmpty())
                        ? " (" + String.join(", ", proj.getTechnologies()) + ")"
                        : "";

                if (isAts) {
                    StringBuilder linksStr = new StringBuilder();
                    if (proj.getGithub() != null && !proj.getGithub().isEmpty()) linksStr.append("GitHub: ").append(proj.getGithub());
                    if (proj.getLiveLink() != null && !proj.getLiveLink().isEmpty()) {
                        if (linksStr.length() > 0) linksStr.append(" | ");
                        linksStr.append("Live: ").append(proj.getLiveLink());
                    }

                    Paragraph titleLine = new Paragraph();
                    titleLine.add(new Chunk(proj.getTitle() + techStr, subTitleFont));
                    if (linksStr.length() > 0) {
                        titleLine.add(new Chunk("  [" + linksStr.toString() + "]", italicBodyFont));
                    }
                    titleLine.setSpacingBefore(4);
                    titleLine.setSpacingAfter(2);
                    document.add(titleLine);
                } else {
                    PdfPTable table = new PdfPTable(2);
                    table.setWidthPercentage(100);
                    table.setSpacingBefore(4);
                    table.setSpacingAfter(2);

                    PdfPCell leftCell = new PdfPCell(new Paragraph(proj.getTitle() + techStr, subTitleFont));
                    leftCell.setBorder(Rectangle.NO_BORDER);
                    leftCell.setHorizontalAlignment(Element.ALIGN_LEFT);

                    StringBuilder linksStr = new StringBuilder();
                    if (proj.getGithub() != null && !proj.getGithub().isEmpty()) linksStr.append("GitHub: ").append(proj.getGithub());
                    if (proj.getLiveLink() != null && !proj.getLiveLink().isEmpty()) {
                        if (linksStr.length() > 0) linksStr.append(" | ");
                        linksStr.append("Live: ").append(proj.getLiveLink());
                    }

                    PdfPCell rightCell = new PdfPCell(new Paragraph(linksStr.toString(), italicBodyFont));
                    rightCell.setBorder(Rectangle.NO_BORDER);
                    rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

                    table.addCell(leftCell);
                    table.addCell(rightCell);
                    document.add(table);
                }

                if (proj.getDescription() != null && !proj.getDescription().trim().isEmpty()) {
                    String[] lines = proj.getDescription().split("\n");
                    for (String line : lines) {
                        if (line.trim().isEmpty()) continue;
                        String bulletText = line.trim();
                        if (bulletText.startsWith("-") || bulletText.startsWith("*") || bulletText.startsWith("•")) {
                            bulletText = bulletText.substring(1).trim();
                        }
                        Paragraph bullet = new Paragraph("• " + bulletText, bodyFont);
                        bullet.setIndentationLeft(12);
                        bullet.setSpacingAfter(2);
                        bullet.setLeading(11);
                        document.add(bullet);
                    }
                }
            }
            Paragraph spacing = new Paragraph(" ");
            spacing.setLeading(6);
            document.add(spacing);
        }

        // Education
        if (data.getEducation() != null && !data.getEducation().isEmpty()) {
            addSectionTitle(document, "EDUCATION", sectionTitleFont);
            for (ResumeData.EducationDto edu : data.getEducation()) {
                String field = (edu.getFieldOfStudy() != null && !edu.getFieldOfStudy().isEmpty()) ? ", " + edu.getFieldOfStudy() : "";
                
                if (isAts) {
                    Paragraph titleLine = new Paragraph();
                    titleLine.add(new Chunk(edu.getDegree() + field + "  -  " + edu.getInstitution(), subTitleFont));
                    titleLine.add(new Chunk("  (" + edu.getStartDate() + " - " + edu.getEndDate() + ")", italicBodyFont));
                    titleLine.setSpacingBefore(4);
                    titleLine.setSpacingAfter(2);
                    document.add(titleLine);
                } else {
                    PdfPTable table = new PdfPTable(2);
                    table.setWidthPercentage(100);
                    table.setSpacingBefore(4);
                    table.setSpacingAfter(2);

                    PdfPCell leftCell = new PdfPCell(new Paragraph(edu.getDegree() + field + " - " + edu.getInstitution(), subTitleFont));
                    leftCell.setBorder(Rectangle.NO_BORDER);
                    leftCell.setHorizontalAlignment(Element.ALIGN_LEFT);

                    PdfPCell rightCell = new PdfPCell(new Paragraph(edu.getStartDate() + " - " + edu.getEndDate(), italicBodyFont));
                    rightCell.setBorder(Rectangle.NO_BORDER);
                    rightCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

                    table.addCell(leftCell);
                    table.addCell(rightCell);
                    document.add(table);
                }

                if (edu.getGrade() != null && !edu.getGrade().isEmpty()) {
                    Paragraph gradePara = new Paragraph("GPA/Grade: " + edu.getGrade(), bodyFont);
                    gradePara.setIndentationLeft(12);
                    gradePara.setSpacingAfter(4);
                    gradePara.setLeading(11);
                    document.add(gradePara);
                }
            }
        }

        document.close();
        return out.toByteArray();
    }

    private void addSectionTitle(Document document, String title, Font font) throws Exception {
        Paragraph titlePara = new Paragraph(title, font);
        titlePara.setSpacingBefore(8);
        titlePara.setSpacingAfter(3);
        document.add(titlePara);
    }

    private void addDivider(Document document, Color color) throws Exception {
        LineSeparator line = new LineSeparator(1f, 100, color, Element.ALIGN_CENTER, -4);
        Paragraph p = new Paragraph();
        p.add(line);
        p.setSpacingAfter(8);
        document.add(p);
    }
}
