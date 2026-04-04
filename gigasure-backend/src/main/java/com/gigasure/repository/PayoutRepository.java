package com.gigasure.repository;

import com.gigasure.entity.Payout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PayoutRepository extends JpaRepository<Payout, Long> {
    List<Payout> findByClaimId(Long claimId);
}
