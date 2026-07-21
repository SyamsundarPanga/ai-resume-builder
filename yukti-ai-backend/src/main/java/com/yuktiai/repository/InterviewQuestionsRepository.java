package com.yuktiai.repository;

import com.yuktiai.entity.InterviewQuestions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewQuestionsRepository extends JpaRepository<InterviewQuestions, Long> {
    List<InterviewQuestions> findByUserIdOrderByCreatedAtDesc(Long userId);
}
