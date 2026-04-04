package com.gigasure.service;

import com.gigasure.entity.Claim;
import com.gigasure.entity.FraudLog;
import com.gigasure.entity.Worker;
import com.gigasure.repository.ClaimRepository;
import com.gigasure.repository.FraudLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;

public class FraudDetectionServiceTest {

    private ClaimRepository claimRepository;
    private FraudLogRepository fraudLogRepository;
    private FraudDetectionService fraudDetectionService;

    @BeforeEach
    void setUp() {
        claimRepository = Mockito.mock(ClaimRepository.class);
        fraudLogRepository = Mockito.mock(FraudLogRepository.class);
        fraudDetectionService = new FraudDetectionService(claimRepository, fraudLogRepository);
    }

    @Test
    void testLowRiskWorker_NoFraud() {
        Worker worker = new Worker();
        worker.setId(1L);
        worker.setCurrentRiskScore(1.0); // Low risk

        Claim claim = new Claim();
        claim.setId(10L);

        // No recent claims
        Mockito.when(claimRepository.findByPolicyWorkerId(1L)).thenReturn(List.of());

        boolean isSuspicious = fraudDetectionService.evaluateFraudRisk(claim, worker);
        assertFalse(isSuspicious);

        // Verify no log is created
        Mockito.verify(fraudLogRepository, Mockito.never()).save(any(FraudLog.class));
    }

    @Test
    void testHighRiskWorker_FlagsFraud() {
        Worker worker = new Worker();
        worker.setId(1L);
        worker.setCurrentRiskScore(2.5); // High risk

        Claim claim = new Claim();
        claim.setId(10L);

        Mockito.when(claimRepository.findByPolicyWorkerId(1L)).thenReturn(List.of());

        boolean isSuspicious = fraudDetectionService.evaluateFraudRisk(claim, worker);
        assertTrue(isSuspicious);

        ArgumentCaptor<FraudLog> captor = ArgumentCaptor.forClass(FraudLog.class);
        Mockito.verify(fraudLogRepository).save(captor.capture());
        assertEquals("HIGH", captor.getValue().getSeverity());
    }

    @Test
    void testFrequentClaims_FlagsFraud() {
        Worker worker = new Worker();
        worker.setId(1L);
        worker.setCurrentRiskScore(1.0);

        Claim claim1 = new Claim();
        claim1.setClaimDate(LocalDateTime.now().minusDays(1));
        Claim claim2 = new Claim();
        claim2.setClaimDate(LocalDateTime.now().minusDays(2));
        Claim claim3 = new Claim();
        claim3.setClaimDate(LocalDateTime.now().minusDays(3));

        Claim newClaim = new Claim();
        newClaim.setId(11L);

        Mockito.when(claimRepository.findByPolicyWorkerId(1L)).thenReturn(List.of(claim1, claim2, claim3));

        boolean isSuspicious = fraudDetectionService.evaluateFraudRisk(newClaim, worker);
        assertTrue(isSuspicious);

        ArgumentCaptor<FraudLog> captor = ArgumentCaptor.forClass(FraudLog.class);
        Mockito.verify(fraudLogRepository).save(captor.capture());
        assertEquals("MEDIUM", captor.getValue().getSeverity());
    }
}
