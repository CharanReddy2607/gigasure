package com.gigasure.repository;

import com.gigasure.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WorkerRepository extends JpaRepository<Worker, Long> {
    Optional<Worker> findByPhoneNumber(String phoneNumber);
    List<Worker> findAllByCurrentLatIsNotNullAndCurrentLngIsNotNull();
}
