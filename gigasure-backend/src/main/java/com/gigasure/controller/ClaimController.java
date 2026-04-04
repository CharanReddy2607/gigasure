package com.gigasure.controller;

import com.gigasure.entity.Claim;
import com.gigasure.service.ClaimService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@CrossOrigin(origins = "*")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @GetMapping
    public List<Claim> getAllClaims() {
        return claimService.getAllClaims();
    }

    @GetMapping("/worker/{workerId}")
    public List<Claim> getWorkerClaims(@PathVariable Long workerId) {
        return claimService.getClaimsByWorker(workerId);
    }
}
