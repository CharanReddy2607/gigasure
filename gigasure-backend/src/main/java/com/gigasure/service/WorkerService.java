package com.gigasure.service;

import com.gigasure.entity.Worker;
import com.gigasure.repository.WorkerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkerService {

    private final WorkerRepository workerRepository;

    public WorkerService(WorkerRepository workerRepository) {
        this.workerRepository = workerRepository;
    }

    public Worker registerWorker(Worker worker) {
        // Here we could assign an initial risk score
        if (worker.getCurrentRiskScore() == null) {
            worker.setCurrentRiskScore(10.0); // Default base risk score
        }
        return workerRepository.save(worker);
    }

    public Worker updateLocation(Long id, Double lat, Double lng) {
        Worker worker = workerRepository.findById(id).orElseThrow();
        worker.setCurrentLat(lat);
        worker.setCurrentLng(lng);
        worker.setLastLocationUpdate(java.time.LocalDateTime.now());
        return workerRepository.save(worker);
    }

    public Worker getWorker(Long id) {
        return workerRepository.findById(id).orElse(null);
    }

    public List<Worker> getAllWorkers() {
        return workerRepository.findAll();
    }
}
