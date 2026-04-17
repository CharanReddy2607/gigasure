package com.gigasure.repository;

import com.gigasure.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByWorker_Id(Long workerId);
    List<Notification> findByWorker_IdAndIsReadFalse(Long workerId);
}
