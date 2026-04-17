package com.gigasure.controller;

import com.gigasure.entity.Policy;
import com.gigasure.service.PolicyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policies")
@CrossOrigin(origins = "*")
public class PolicyController {

    private final PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    @PostMapping
    public Policy create(@RequestBody Policy policy) {
        return policyService.createPolicy(policy);
    }

    @GetMapping("/{id}")
    public Policy getPolicy(@PathVariable Long id) {
        return policyService.getPolicy(id);
    }

    @GetMapping("/worker/{workerId}")
    public List<Policy> getWorkerPolicies(@PathVariable Long workerId) {
        return policyService.getPoliciesByWorker(workerId);
    }

    @GetMapping
    public List<Policy> getAllPolicies() {
        return policyService.getAllPolicies();
    }

    @DeleteMapping("/{id}")
    public void deletePolicy(@PathVariable Long id) {
        policyService.deletePolicy(id);
    }
}
