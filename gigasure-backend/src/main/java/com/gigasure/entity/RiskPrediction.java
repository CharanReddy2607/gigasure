package com.gigasure.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "risk_predictions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskPrediction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String city;
    private Double riskScore; // 0.0 to 100.0
    private String primaryFactor; // e.g., "Heavy Rainfall Expected"
    
    private LocalDateTime predictionDate;
}
