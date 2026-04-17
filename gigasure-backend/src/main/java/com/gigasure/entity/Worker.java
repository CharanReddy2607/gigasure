package com.gigasure.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "workers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Worker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String city;
    private String platform;

    private BigDecimal dailyIncome;
    private Double currentRiskScore;
    private String contactEmail;
    private String phoneNumber;

    private Double currentLat;
    private Double currentLng;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private java.time.LocalDateTime lastLocationUpdate;

    // Behavioral Analysis Fields
    private Double safetyRating; // 1.0 to 5.0
    private Double deliveryFrequency; // 0.0 to 1.0
    private Integer totalDeliveriesCompleted;
}
