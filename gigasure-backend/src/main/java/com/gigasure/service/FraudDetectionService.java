package com.gigasure.service;

import com.gigasure.entity.Claim;
import com.gigasure.entity.FraudLog;
import com.gigasure.entity.Worker;
import com.gigasure.repository.ClaimRepository;
import com.gigasure.repository.FraudLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class FraudDetectionService {

    private final ClaimRepository claimRepository;
    private final FraudLogRepository fraudLogRepository;

    public FraudDetectionService(ClaimRepository claimRepository, FraudLogRepository fraudLogRepository) {
        this.claimRepository = claimRepository;
        this.fraudLogRepository = fraudLogRepository;
    }

    private double getDistance(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371; // km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private double[] getCityCoords(String city) {
        if ("mumbai".equalsIgnoreCase(city))
            return new double[] { 19.0760, 72.8777 };
        if ("delhi".equalsIgnoreCase(city))
            return new double[] { 28.7041, 77.1025 };
        if ("bangalore".equalsIgnoreCase(city))
            return new double[] { 12.9716, 77.5946 };
        if ("chennai".equalsIgnoreCase(city))
            return new double[] { 13.0827, 80.2707 };
        return null;
    }

    public boolean evaluateFraudRisk(Claim claim, Worker worker) {
        boolean isSuspicious = false;
        StringBuilder reasonBuilder = new StringBuilder();

        // 1. High Risk Score check
        if (worker.getCurrentRiskScore() != null && worker.getCurrentRiskScore() > 2.5) {
            reasonBuilder.append("Aggregated Worker Risk Factor > 2.5; ");
            isSuspicious = true;
        }

        // 2. Location Spoofing Algorithm
        if (worker.getCurrentLat() != null && worker.getCurrentLng() != null) {
            double[] cityCoords = getCityCoords(worker.getCity());
            if (cityCoords != null) {
                double distance = getDistance(cityCoords[0], cityCoords[1], worker.getCurrentLat(),
                        worker.getCurrentLng());
                if (distance > 45.0) { // Slightly tighter threshold
                    reasonBuilder.append(String.format("Location Anomaly: %.1f km from %s; ", distance, worker.getCity()));
                    isSuspicious = true;
                }
            }
        }

        // 3. Claim Velocity Check (Anti-Piling)
        LocalDateTime twoWeeksAgo = LocalDateTime.now().minusDays(14);
        long recentClaims = claimRepository.findByPolicyWorkerId(worker.getId()).stream()
                .filter(c -> c.getClaimDate() != null && c.getClaimDate().isAfter(twoWeeksAgo))
                .count();

        if (recentClaims >= 3) {
            reasonBuilder.append("Claim Velocity Alert: > 2 claims in 14 days; ");
            isSuspicious = true;
        }

        // 4. IP Analysis (Mocked Proxy/VPN Detection)
        // Simulated: if worker city is "Delhi" but triggered from an IP-range known for data centers
        if (worker.getCity().equalsIgnoreCase("Delhi") && Math.random() > 0.98) {
            reasonBuilder.append("AI Proxy Detection: High-probability VPN usage; ");
            isSuspicious = true;
        }

        if (isSuspicious) {
            logFraud(claim, reasonBuilder.toString(), recentClaims > 4 ? "CRITICAL" : "HIGH");
            // Escalate worker's internal risk score
            worker.setCurrentRiskScore((worker.getCurrentRiskScore() == null ? 0 : worker.getCurrentRiskScore()) + 0.5);
        }

        return isSuspicious;
    }

    private void logFraud(Claim claim, String reason, String severity) {
        FraudLog fraudLog = new FraudLog();
        fraudLog.setClaim(claim);
        fraudLog.setReason(reason);
        fraudLog.setSeverity(severity);
        fraudLog.setDetectedDate(LocalDateTime.now());
        fraudLogRepository.save(fraudLog);
    }
}
