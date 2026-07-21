package com.yuktiai.repository;

import com.yuktiai.entity.AtsScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AtsScoreRepository extends JpaRepository<AtsScore, Long> {
    List<AtsScore> findByResumeUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT a FROM AtsScore a WHERE a.resume.user.id = :userId ORDER BY a.createdAt DESC")
    List<AtsScore> findRecentScores(@Param("userId") Long userId);

    Optional<AtsScore> findFirstByResumeUserIdOrderByCreatedAtDesc(Long userId);
}
