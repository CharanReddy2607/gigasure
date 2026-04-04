package com.gigasure.controller;

import com.gigasure.entity.DisruptionEvent;
import com.gigasure.service.DisruptionEventService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disruptions")
@CrossOrigin(origins = "*")
public class DisruptionEventController {

    private final DisruptionEventService disruptionEventService;

    public DisruptionEventController(DisruptionEventService disruptionEventService) {
        this.disruptionEventService = disruptionEventService;
    }

    @PostMapping
    public DisruptionEvent triggerDisruption(@RequestBody DisruptionEvent event) {
        return disruptionEventService.recordEvent(event);
    }

    @GetMapping
    public List<DisruptionEvent> getAllDisruptions() {
        return disruptionEventService.getAllEvents();
    }
}
