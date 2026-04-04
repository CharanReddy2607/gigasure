package com.gigasure.repository;

import com.gigasure.entity.DisruptionEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisruptionEventRepository extends JpaRepository<DisruptionEvent, Long> {
}
