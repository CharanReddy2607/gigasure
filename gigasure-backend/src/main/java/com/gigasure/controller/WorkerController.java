package com.gigasure.controller;

import com.gigasure.entity.Worker;
import com.gigasure.service.WorkerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
@CrossOrigin(origins = "*")
public class WorkerController {

    private final WorkerService workerService;

    public WorkerController(WorkerService workerService) {
        this.workerService = workerService;
    }

    @PostMapping
    public Worker register(@RequestBody Worker worker) {
        return workerService.registerWorker(worker);
    }

    @PostMapping("/{id}/location")
    public Worker updateLocation(@PathVariable Long id, @RequestBody java.util.Map<String, Double> location) {
        return workerService.updateLocation(id, location.get("lat"), location.get("lng"));
    }

    @GetMapping("/{id}")
    public Worker getWorker(@PathVariable Long id) {
        return workerService.getWorker(id);
    }

    @GetMapping
    public List<Worker> getAllWorkers() {
        return workerService.getAllWorkers();
    }
}
