package com.gigasure.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FraudResult {
    public enum RiskLevel { LOW, MEDIUM, HIGH, CRITICAL }

    private RiskLevel riskLevel;
    private double fraudProbability;
    private List<String> reasons;
}
