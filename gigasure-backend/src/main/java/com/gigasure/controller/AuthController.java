package com.gigasure.controller;

import com.gigasure.entity.Worker;
import com.gigasure.repository.WorkerRepository;
import com.gigasure.service.OtpService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    private final OtpService otpService;
    private final WorkerRepository workerRepository;

    public AuthController(OtpService otpService, WorkerRepository workerRepository) {
        this.otpService = otpService;
        this.workerRepository = workerRepository;
    }

    @PostMapping("/otp/send")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String phoneNumber = request.get("phoneNumber");
        log.info(">>> AUTH: Received OTP request for phone: {}", phoneNumber);
        
        String otp = otpService.generateOtp(phoneNumber);
        log.info(">>> AUTH: Generated OTP [{}] for {}", otp, phoneNumber);
        
        return ResponseEntity.ok(Map.of("message", "OTP sent", "otp", otp));
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String phoneNumber = request.get("phoneNumber");
        String otp = request.get("otp");
        log.info(">>> AUTH: Verification attempt for {}: OTP={}", phoneNumber, otp);

        if (otpService.validateOtp(phoneNumber, otp)) {
            log.info(">>> AUTH: Successful verification for {}", phoneNumber);
            Optional<Worker> workerOpt = workerRepository.findByPhoneNumber(phoneNumber);
            Worker worker;
            if (workerOpt.isPresent()) {
                worker = workerOpt.get();
            } else {
                // Register new worker
                worker = Worker.builder()
                        .name("New Worker")
                        .phoneNumber(phoneNumber)
                        .city("Mumbai")
                        .platform("General")
                        .dailyIncome(new BigDecimal("500.00"))
                        .currentRiskScore(1.0)
                        .safetyRating(4.5)
                        .deliveryFrequency(0.8)
                        .totalDeliveriesCompleted(0)
                        .build();
                worker = workerRepository.save(worker);
            }
            return ResponseEntity.ok(worker);
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid OTP"));
        }
    }
}
