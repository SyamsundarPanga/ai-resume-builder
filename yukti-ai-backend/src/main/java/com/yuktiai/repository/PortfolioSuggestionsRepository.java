package com.yuktiai.repository;

import com.yuktiai.entity.PortfolioSuggestions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortfolioSuggestionsRepository extends JpaRepository<PortfolioSuggestions, Long> {
    List<PortfolioSuggestions> findByUserIdOrderByCreatedAtDesc(Long userId);
}
