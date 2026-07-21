package com.yuktiai.repository;

import com.yuktiai.entity.SkillGapReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillGapReportRepository extends JpaRepository<SkillGapReport, Long> {
    List<SkillGapReport> findByUserIdOrderByCreatedAtDesc(Long userId);
}
