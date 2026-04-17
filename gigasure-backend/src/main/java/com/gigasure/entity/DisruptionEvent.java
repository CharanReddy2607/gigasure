package com.gigasure.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "disruption_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DisruptionEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // RAINFALL, HEATWAVE, AQI
    private Double metricValue; // e.g. 40.5 (mm), 42 (C)
    private String city;
    private Double deliveryActivityDrop; // Percentage drop e.g. 55.0 for 55%
    
    private LocalDateTime eventDate;
}
