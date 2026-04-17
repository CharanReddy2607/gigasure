package com.gigasure.service;

import com.gigasure.dto.FraudResult;
import com.gigasure.entity.Claim;
import com.gigasure.entity.FraudLog;
import com.gigasure.entity.Worker;
import com.gigasure.repository.ClaimRepository;
import com.gigasure.repository.FraudLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class FraudDetectionService {

    private final ClaimRepository claimRepository;
    private final FraudLogRepository fraudLogRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    
    @org.springframework.beans.factory.annotation.Value("${ml.service.url:http://localhost:5000/predictFraud}")
    private String mlServiceUrl;

    public FraudDetectionService(ClaimRepository claimRepository, FraudLogRepository fraudLogRepository) {
        this.claimRepository = claimRepository;
        this.fraudLogRepository = fraudLogRepository;
    }

    public FraudResult analyzeClaim(Claim claim, Worker worker) {
        List<String> reasons = new ArrayList<>();
        
        // 1. Behavioral Analysis (Frequency)
        long recentClaims = behavioralAnalysis(worker, reasons);

        // 2. Spatial Validation (Haversine)
        double distance = spatialValidation(claim, worker, reasons);

        // 3. Risk Scoring (Aggregated)
        double currentRisk = riskScoring(worker, reasons);

        // 4. ML Prediction Layer
        double probability = mlPrediction(recentClaims, distance, currentRisk, reasons);

        // Determine Final Risk Level
        FraudResult.RiskLevel riskLevel = determineRiskLevel(probability, currentRisk);

        if (riskLevel == FraudResult.RiskLevel.HIGH || riskLevel == FraudResult.RiskLevel.CRITICAL) {
            logFraud(claim, String.join("; ", reasons), riskLevel.name());
        }

        return FraudResult.builder()
                .riskLevel(riskLevel)
                .fraudProbability(probability)
                .reasons(reasons)
                .build();
    }

    private long behavioralAnalysis(Worker worker, List<String> reasons) {
        LocalDateTime twoWeeksAgo = LocalDateTime.now().minusDays(14);
        long count = claimRepository.findByPolicyWorkerId(worker.getId()).stream()
                .filter(c -> c.getClaimDate() != null && c.getClaimDate().isAfter(twoWeeksAgo))
                .count();
        if (count >= 3) reasons.add("Behavioral: Claim frequency exceeded ( > 2 in 14 days)");
        return count;
    }

    private double spatialValidation(Claim claim, Worker worker, List<String> reasons) {
        if (worker.getCurrentLat() == null || worker.getCurrentLng() == null) return 0;
        
        // Use city center as simple default for distance demo
        double[] cityCoords = getCityCoords(worker.getCity());
        if (cityCoords == null) return 0;

        double distance = calculateDistance(cityCoords[0], cityCoords[1], worker.getCurrentLat(), worker.getCurrentLng());
        if (distance > 45.0) reasons.add(String.format("Spatial: Location anomaly (%.1f km offset)", distance));
        return distance;
    }

    private double riskScoring(Worker worker, List<String> reasons) {
        double score = worker.getCurrentRiskScore() != null ? worker.getCurrentRiskScore() : 0.0;
        if (score > 2.5) reasons.add("Risk: Aggregate worker risk profile elevated");
        return score;
    }

    @SuppressWarnings("unchecked")
    private double mlPrediction(long frequency, double distance, double risk, List<String> reasons) {
        try {
            Map<String, Object> payload = Map.of(
                "claimFrequency", frequency,
                "distanceFromEvent", distance,
                "workerRiskScore", risk
            );
            
            Map<String, Object> response = restTemplate.postForObject(mlServiceUrl, payload, Map.class);
            if (response != null && response.containsKey("fraudProbability")) {
                double prob = (double) response.get("fraudProbability");
                if (prob > 0.7) reasons.add(String.format("ML: High prediction confidence (%.1f%%)", prob * 100));
                return prob;
            }
        } catch (Exception e) {
            System.err.println("ML Microservice Offline: Falling back to rule-based defaults.");
        }
        return 0.0;
    }

    private FraudResult.RiskLevel determineRiskLevel(double prob, double currentRisk) {
        if (prob > 0.85 || currentRisk > 4.0) return FraudResult.RiskLevel.CRITICAL;
        if (prob > 0.65 || currentRisk > 2.5) return FraudResult.RiskLevel.HIGH;
        if (prob > 0.40) return FraudResult.RiskLevel.MEDIUM;
        return FraudResult.RiskLevel.LOW;
    }

    private void logFraud(Claim claim, String reason, String severity) {
        FraudLog log = new FraudLog();
        log.setClaim(claim);
        log.setReason(reason);
        log.setSeverity(severity);
        log.setDetectedDate(LocalDateTime.now());
        fraudLogRepository.save(log);
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371; // km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    private double[] getCityCoords(String city) {
        if ("mumbai".equalsIgnoreCase(city)) return new double[]{19.0760, 72.8777};
        if ("delhi".equalsIgnoreCase(city)) return new double[]{28.7041, 77.1025};
        if ("bangalore".equalsIgnoreCase(city)) return new double[]{12.9716, 77.5946};
        if ("chennai".equalsIgnoreCase(city)) return new double[]{13.0827, 80.2707};
        return null;
    }
}
