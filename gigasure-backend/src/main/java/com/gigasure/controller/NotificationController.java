package com.gigasure.controller;

import com.gigasure.entity.Notification;
import com.gigasure.repository.NotificationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/worker/{workerId}")
    public List<Notification> getWorkerNotifications(@PathVariable Long workerId) {
        return notificationRepository.findByWorker_Id(workerId);
    }
}
