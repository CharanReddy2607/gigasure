package com.gigasure.repository;

import com.gigasure.entity.Policy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PolicyRepository extends JpaRepository<Policy, Long> {
    List<Policy> findByWorker_Id(Long workerId);
}
