package com.gigasure.service;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    public String generateOtp(String phoneNumber) {
        String otp = String.format("%06d", new Random().nextInt(1000000));
        otpStore.put(phoneNumber, otp);
        System.out.println(">>> [MOCK SMS] OTP for " + phoneNumber + ": " + otp);
        return otp;
    }

    public boolean validateOtp(String phoneNumber, String otp) {
        String storedOtp = otpStore.get(phoneNumber);
        return otp != null && otp.equals(storedOtp);
    }
}
