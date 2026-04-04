package com.gigasure.service;

import com.gigasure.entity.Policy;
import com.gigasure.repository.PolicyRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PolicyService {

    private final PolicyRepository policyRepository;

    public PolicyService(PolicyRepository policyRepository) {
        this.policyRepository = policyRepository;
    }

    public Policy createPolicy(Policy policy) {
        policy.setStartDate(LocalDateTime.now());
        policy.setEndDate(LocalDateTime.now().plusMonths(1)); // 1 month policy
        policy.setActive(true);
        return policyRepository.save(policy);
    }

    public Policy getPolicy(Long id) {
        return policyRepository.findById(id).orElse(null);
    }

    public List<Policy> getPoliciesByWorker(Long workerId) {
        return policyRepository.findByWorkerId(workerId);
    }

    public List<Policy> getAllPolicies() {
        return policyRepository.findAll();
    }
}
