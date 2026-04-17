package com.gigasure.controller;

import com.gigasure.repository.PayoutRepository;
import com.gigasure.entity.Payout;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/payouts")
@CrossOrigin(origins = "*")
public class PayoutController {

    private final PayoutRepository payoutRepository;

    public PayoutController(PayoutRepository payoutRepository) {
        this.payoutRepository = payoutRepository;
    }

    @GetMapping("/claim/{claimId}")
    public List<Payout> getPayoutsByClaim(@PathVariable Long claimId) {
        return payoutRepository.findByClaimId(claimId);
    }

    @DeleteMapping("/{id}")
    public void deletePayout(@PathVariable Long id) {
        payoutRepository.deleteById(id);
    }
}
