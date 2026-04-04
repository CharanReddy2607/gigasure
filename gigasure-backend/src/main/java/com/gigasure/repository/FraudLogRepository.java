package com.gigasure.repository;

import com.gigasure.entity.FraudLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FraudLogRepository extends JpaRepository<FraudLog, Long> {
}
