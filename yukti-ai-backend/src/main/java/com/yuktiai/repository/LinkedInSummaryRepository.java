package com.yuktiai.repository;

import com.yuktiai.entity.LinkedInSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LinkedInSummaryRepository extends JpaRepository<LinkedInSummary, Long> {
    List<LinkedInSummary> findByUserIdOrderByCreatedAtDesc(Long userId);
}
