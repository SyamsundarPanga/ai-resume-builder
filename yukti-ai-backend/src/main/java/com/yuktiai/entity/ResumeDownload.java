package com.yuktiai.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "resume_downloads")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeDownload {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Resume resume;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Column(name = "format", nullable = false)
    private String format; // "PDF" or "DOCX"

    @Column(name = "downloaded_at")
    @Builder.Default
    private LocalDateTime downloadedAt = LocalDateTime.now();
}
