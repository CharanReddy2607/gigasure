package com.gigasure.controller;

import com.gigasure.entity.FraudLog;
import com.gigasure.repository.*;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final WorkerRepository workerRepository;
    private final PolicyRepository policyRepository;
    private final ClaimRepository claimRepository;
    private final FraudLogRepository fraudLogRepository;

    public DashboardController(WorkerRepository workerRepository, PolicyRepository policyRepository, 
                               ClaimRepository claimRepository, FraudLogRepository fraudLogRepository) {
        this.workerRepository = workerRepository;
        this.policyRepository = policyRepository;
        this.claimRepository = claimRepository;
        this.fraudLogRepository = fraudLogRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> getGlobalStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalWorkers", workerRepository.count());
        stats.put("totalPolicies", policyRepository.count());
        stats.put("totalClaims", claimRepository.count());
        return stats;
    }

    @GetMapping("/fraud")
    public List<FraudLog> getFraudAlerts() {
        return fraudLogRepository.findAll();
    }
}
