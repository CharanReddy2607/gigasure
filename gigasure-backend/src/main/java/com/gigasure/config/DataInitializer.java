package com.gigasure.config;

import com.gigasure.entity.Policy;
import com.gigasure.entity.Worker;
import com.gigasure.repository.PolicyRepository;
import com.gigasure.repository.WorkerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final WorkerRepository workerRepository;
    private final PolicyRepository policyRepository;

    public DataInitializer(WorkerRepository workerRepository, PolicyRepository policyRepository) {
        this.workerRepository = workerRepository;
        this.policyRepository = policyRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (workerRepository.count() == 0) {
            // Worker 1: Mumbai (Monsoon Shield)
            Worker w1 = createWorker("John Doe", "Mumbai", "Swiggy", "850.00", 1.2);
            createPolicy(w1, "Monsoon Master", "60000.00", "120.00");

            // Worker 2: Delhi (Heatwave Hero)
            Worker w2 = createWorker("Rajesh Kumar", "Delhi", "Zomato", "720.00", 2.1);
            createPolicy(w2, "Heatwave Hero", "45000.00", "95.00");

            // Worker 3: Bangalore (Urban Shield)
            Worker w3 = createWorker("Ananya Singh", "Bangalore", "Dunzo", "950.00", 0.8);
            createPolicy(w3, "Urban Shielder", "80000.00", "180.00");

            // Worker 4: Chennai (Cyclonic Guardian)
            Worker w4 = createWorker("Vijay Raman", "Chennai", "Zepto", "680.00", 1.4);
            createPolicy(w4, "Coastal Guardian", "30000.00", "75.00");

            // Worker 5: Mumbai (Lite Plan)
            Worker w5 = createWorker("Suresh Raina", "Mumbai", "Blinkit", "550.00", 1.0);
            createPolicy(w5, "GigaLite Saver", "20000.00", "55.00");
        }
    }

    private Worker createWorker(String name, String city, String platform, String income, double risk) {
        Worker w = Worker.builder()
                .name(name)
                .city(city)
                .platform(platform)
                .dailyIncome(new BigDecimal(income))
                .currentRiskScore(risk)
                .contactEmail(name.toLowerCase().replace(" ", ".") + "@gigasure.com")
                .build();
        return workerRepository.save(w);
    }

    private void createPolicy(Worker w, String name, String coverage, String premium) {
        Policy p = Policy.builder()
                .worker(w)
                .name(name)
                .coverageAmount(new BigDecimal(coverage))
                .weeklyPremium(new BigDecimal(premium))
                .active(true)
                .startDate(LocalDateTime.now().minusDays(5))
                .endDate(LocalDateTime.now().plusMonths(3))
                .build();
        policyRepository.save(p);
    }
}
