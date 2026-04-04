package com.gigasure.service;

import com.gigasure.entity.Worker;
import com.gigasure.entity.Policy;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class RiskEngineService {

    // Advanced Mock Risk Engine mimicking AI analysis
    public Double calculateRiskScore(String city) {
        if (city == null) return 15.0;
        
        // Mock risk scores weighted by historical climate vulnerabilities
        return switch (city.toLowerCase()) {
            case "mumbai" -> 82.5; // Coastal flood & Monsoon intensity
            case "delhi" -> 78.2;  // Heat dome & pollution curfews
            case "bangalore" -> 45.0; // Moderate climate but high flash-flood risk
            case "chennai" -> 68.4;  // Cyclone & extreme humidity factor
            case "kolkata" -> 72.1; // Heat & tropical storms
            default -> 25.0;
        };
    }

    public double predictActivityDrop(String city, String eventType, double value) {
        // AI Simulation: Predict % drop in delivery activity based on event severity
        double baseDrop = 0.0;
        if ("RAINFALL".equalsIgnoreCase(eventType)) {
            baseDrop = Math.min(95.0, value * 1.8); // 30mm -> 54% drop
        } else if ("HEATWAVE".equalsIgnoreCase(eventType)) {
            baseDrop = Math.min(85.0, (value - 35) * 5.0); // 42C -> 35% drop
        }
        
        // City multiplier (some cities are more resilient)
        double multiplier = city.equalsIgnoreCase("Mumbai") ? 0.8 : 1.1;
        return Math.min(100.0, baseDrop * multiplier);
    }

    public BigDecimal calculateWeeklyPremium(Double riskScore, BigDecimal coverageAmount) {
        // Dynamic Pricing Algorithm
        double basePremiumRate = 0.015; // 1.5% base
        double riskWeight = Math.pow(riskScore / 50.0, 1.2); // Exponential risk scaling
        
        double finalRate = basePremiumRate * riskWeight;
        return coverageAmount.multiply(BigDecimal.valueOf(finalRate));
    }
}
