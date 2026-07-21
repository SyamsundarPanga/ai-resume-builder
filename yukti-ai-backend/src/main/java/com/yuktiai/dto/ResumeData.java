package com.yuktiai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeData {
    private String name;
    private String email;
    private String phone;
    @Builder.Default
    private List<String> skills = new ArrayList<>();
    @Builder.Default
    private List<ProjectDto> projects = new ArrayList<>();
    @Builder.Default
    private List<ExperienceDto> experience = new ArrayList<>();
    @Builder.Default
    private List<EducationDto> education = new ArrayList<>();
    private String summary;
    @Builder.Default
    private List<String> achievements = new ArrayList<>();
    @Builder.Default
    private List<String> certifications = new ArrayList<>();
    @Builder.Default
    private List<String> languages = new ArrayList<>();
    @Builder.Default
    private List<String> links = new ArrayList<>();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProjectDto {
        private String title;
        private String description;
        @Builder.Default
        private List<String> technologies = new ArrayList<>();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ExperienceDto {
        private String company;
        private String role;
        private String startDate;
        private String endDate;
        private String description;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EducationDto {
        private String institution;
        private String degree;
        private String fieldOfStudy;
        private String startDate;
        private String endDate;
        private String grade;
    }
}
