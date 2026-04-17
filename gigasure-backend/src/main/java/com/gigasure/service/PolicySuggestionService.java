package com.gigasure.service;

import com.gigasure.entity.*;
import com.gigasure.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PolicySuggestionService {

    private final PolicyRepository policyRepository;
    private final NotificationRepository notificationRepository;

    public PolicySuggestionService(PolicyRepository policyRepository, NotificationRepository notificationRepository) {
        this.policyRepository = policyRepository;
        this.notificationRepository = notificationRepository;
    }

    public void evaluateRiskAndSuggestUpgrades(String city, double incomingRainfall) {
        List<Policy> allPolicies = policyRepository.findAll();

        for (Policy policy : allPolicies) {
            if (Boolean.TRUE.equals(policy.getActive()) && policy.getWorker().getCity().equalsIgnoreCase(city)) {
                // If heavy rainfall is hitting, expect around 1.5 days of severe lost wages
                BigDecimal estimatedLoss = policy.getWorker().getDailyIncome().multiply(BigDecimal.valueOf(1.5));

                // Check coverage vulnerability gap - do not alert if they already have premium
                // surplus
                if (policy.getCoverageAmount().compareTo(estimatedLoss) < 0) {

                    // Only send alert once to avoid spamming the database
                    boolean alreadyAlerted = notificationRepository.findAll().stream()
                            .anyMatch(n -> n.getWorker().getId().equals(policy.getWorker().getId())
                                    && n.getMessage().contains("UPGRADE_ALERT"));

                    if (!alreadyAlerted) {
                        Notification notif = new Notification();
                        notif.setWorker(policy.getWorker());
                        notif.setMessage("UPGRADE_ALERT: Urgent Risk! " + incomingRainfall + "mm rain expected. Your " +
                                "₹" + policy.getCoverageAmount() + " coverage may not cover the forecast loss of ₹" +
                                estimatedLoss + ". Upgrade your plan before the storm hits.");
                        notif.setCreatedAt(LocalDateTime.now());
                        notif.setRead(false);
                        notificationRepository.save(notif);
                    }
                }
            }
        }
    }
}
