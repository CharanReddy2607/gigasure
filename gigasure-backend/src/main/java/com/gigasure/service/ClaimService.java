package com.gigasure.service;

import com.gigasure.dto.FraudResult;
import com.gigasure.entity.*;
import com.gigasure.repository.*;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final PolicyRepository policyRepository;
    private final FraudDetectionService fraudDetectionService;

    public ClaimService(ClaimRepository claimRepository, PolicyRepository policyRepository, FraudDetectionService fraudDetectionService) {
        this.claimRepository = claimRepository;
        this.policyRepository = policyRepository;
        this.fraudDetectionService = fraudDetectionService;
    }

    public void processDisruptionEvent(DisruptionEvent event) {
        // Parametric trigger logic: Activity drop must exceed threshold
        if (event.getDeliveryActivityDrop() != null && event.getDeliveryActivityDrop() > 30.0) {
            triggerClaimsForCity(event.getCity(), event.getEventDate(), event.getType() + " and > 30% drop in deliveries");
        }
    }

    public void triggerClaimsForCity(String city, LocalDateTime eventDate, String reason) {
        List<Policy> allPolicies = policyRepository.findAll();

        for (Policy policy : allPolicies) {
            // Null safety check for worker and city
            if (Boolean.TRUE.equals(policy.getActive()) && policy.getWorker() != null && policy.getWorker().getCity() != null 
                    && policy.getWorker().getCity().equalsIgnoreCase(city)) {
                
                Worker worker = policy.getWorker();
                
                Claim claim = new Claim();
                claim.setPolicy(policy);
                claim.setClaimDate(LocalDateTime.now());
                claim.setTriggerReason(reason);
                
                // Calculate payout: 100% of daily income for parametric trigger
                BigDecimal dailyIncome = worker.getDailyIncome() != null ? worker.getDailyIncome() : BigDecimal.ZERO;
                claim.setPayoutAmount(dailyIncome);

                // Intelligence Layer: Analyze Fraud Risk
                FraudResult fraudResult = fraudDetectionService.analyzeClaim(claim, worker);

                // Status assignment based on risk layers
                if (fraudResult.getRiskLevel() == FraudResult.RiskLevel.CRITICAL || fraudResult.getRiskLevel() == FraudResult.RiskLevel.HIGH) {
                    claim.setStatus("PENDING_REVIEW");
                } else {
                    claim.setStatus("APPROVED");
                }

                claimRepository.save(claim);
                System.out.println("Claim processed for Worker " + worker.getId() + " - Status: " + claim.getStatus());
            }
        }
    }

    public List<Claim> getAllClaims() { return claimRepository.findAll(); }
    public List<Claim> getClaimsByWorker(Long workerId) { return claimRepository.findByPolicy_Worker_Id(workerId); }
    public void deleteClaim(Long id) { claimRepository.deleteById(id); }
}
