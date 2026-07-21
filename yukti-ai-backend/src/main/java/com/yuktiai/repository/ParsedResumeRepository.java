package com.yuktiai.repository;

import com.yuktiai.entity.ParsedResume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParsedResumeRepository extends JpaRepository<ParsedResume, Long> {
    Optional<ParsedResume> findByResumeId(Long resumeId);
}
