package com.yuktiai.repository;

import com.yuktiai.entity.OptimizedResume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OptimizedResumeRepository extends JpaRepository<OptimizedResume, Long> {
    List<OptimizedResume> findByResumeUserIdOrderByCreatedAtDesc(Long userId);
}
