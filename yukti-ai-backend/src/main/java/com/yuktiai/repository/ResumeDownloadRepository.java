package com.yuktiai.repository;

import com.yuktiai.entity.ResumeDownload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeDownloadRepository extends JpaRepository<ResumeDownload, Long> {
    List<ResumeDownload> findByUserIdOrderByDownloadedAtDesc(Long userId);
}
