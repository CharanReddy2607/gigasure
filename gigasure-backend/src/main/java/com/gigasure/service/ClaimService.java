package com.gigasure.service;

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
    private final PayoutRepository payoutRepository;
    private final NotificationRepository notificationRepository;
    private final FraudDetectionService fraudDetectionService;

    public ClaimService(ClaimRepository claimRepository, PolicyRepository policyRepository,
            PayoutRepository payoutRepository, NotificationRepository notificationRepository,
            FraudDetectionService fraudDetectionService) {
        this.claimRepository = claimRepository;
        this.policyRepository = policyRepository;
        this.payoutRepository = payoutRepository;
        this.notificationRepository = notificationRepository;
        this.fraudDetectionService = fraudDetectionService;
    }

    public void processDisruptionEvent(DisruptionEvent event) {
        if ("RAINFALL".equalsIgnoreCase(event.getType()) && event.getValue() > 35.0
                && event.getDeliveryActivityDrop() > 50.0) {
            triggerClaimsForCity(event.getCity(), event.getEventDate(), "Heavy rainfall and > 50% drop in deliveries");
        } else if ("HEATWAVE".equalsIgnoreCase(event.getType()) && event.getValue() > 42.0
                && event.getDeliveryActivityDrop() > 50.0) {
            triggerClaimsForCity(event.getCity(), event.getEventDate(),
                    "Extreme heatwave and > 50% drop in deliveries");
        } else if ("CURFEW".equalsIgnoreCase(event.getType()) && event.getDeliveryActivityDrop() > 50.0) {
            triggerClaimsForCity(event.getCity(), event.getEventDate(),
                    "Government curfew and > 50% drop in deliveries");
        }
    }

    private void triggerClaimsForCity(String city, LocalDateTime eventDate, String reason) {
        List<Policy> allPolicies = policyRepository.findAll();

        for (Policy policy : allPolicies) {
            if (policy.isActive() && policy.getWorker().getCity().equalsIgnoreCase(city)) {
                Claim claim = new Claim();
                claim.setPolicy(policy);
                claim.setClaimDate(LocalDateTime.now());
                claim.setTriggerReason(reason);
                claim.setStatus("PROCESSING");

                BigDecimal payoutAmount = policy.getWorker().getDailyIncome().multiply(BigDecimal.valueOf(1.0));
                if (payoutAmount.compareTo(policy.getCoverageAmount()) > 0) {
                    payoutAmount = policy.getCoverageAmount();
                }
                claim.setPayoutAmount(payoutAmount);
                claim = claimRepository.save(claim);

                boolean isSuspicious = fraudDetectionService.evaluateFraudRisk(claim, policy.getWorker());
                if (isSuspicious) {
                    claim.setStatus("PENDING_REVIEW");
                } else {
                    claim.setStatus("APPROVED");
                }
                claimRepository.save(claim);

                Payout payout = new Payout();
                payout.setClaim(claim);
                payout.setAmount(payoutAmount);
                payout.setStatus(isSuspicious ? "PENDING_REVIEW" : "PROCESSING");
                payout.setProcessedDate(LocalDateTime.now());
                payoutRepository.save(payout);

                Notification notif = new Notification();
                notif.setWorker(policy.getWorker());
                if (isSuspicious) {
                    notif.setMessage("A claim for " + reason
                            + " was triggered but requires manual review due to security policies.");
                } else {
                    notif.setMessage("Claim triggered automatically for reason: " + reason + ". Payout of ₹"
                            + payoutAmount + " is processing.");
                }
                notif.setCreatedAt(LocalDateTime.now());
                notif.setRead(false);
                notificationRepository.save(notif);
            }
        }
    }

    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    public List<Claim> getClaimsByWorker(Long workerId) {
        return claimRepository.findByPolicyWorkerId(workerId);
    }
}
