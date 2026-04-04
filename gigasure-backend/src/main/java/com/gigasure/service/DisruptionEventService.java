package com.gigasure.service;

import com.gigasure.entity.DisruptionEvent;
import com.gigasure.repository.DisruptionEventRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class DisruptionEventService {

    private final DisruptionEventRepository repository;
    private final ClaimService claimService;

    public DisruptionEventService(DisruptionEventRepository repository, ClaimService claimService) {
        this.repository = repository;
        this.claimService = claimService;
    }

    public DisruptionEvent recordEvent(DisruptionEvent event) {
        event.setEventDate(LocalDateTime.now());
        DisruptionEvent saved = repository.save(event);
        
        // Asynchronously process claim triggering. For simplicity, done synchronously here.
        claimService.processDisruptionEvent(saved);
        
        return saved;
    }

    public java.util.List<DisruptionEvent> getAllEvents() {
        return repository.findAll();
    }
}
