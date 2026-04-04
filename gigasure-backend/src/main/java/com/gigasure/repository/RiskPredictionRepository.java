package com.gigasure.repository;

import com.gigasure.entity.RiskPrediction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RiskPredictionRepository extends JpaRepository<RiskPrediction, Long> {
}
