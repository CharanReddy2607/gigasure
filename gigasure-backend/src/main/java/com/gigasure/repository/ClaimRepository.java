package com.gigasure.repository;

import com.gigasure.entity.Claim;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByPolicyId(Long policyId);
    List<Claim> findByPolicy_Worker_Id(Long workerId);
}
