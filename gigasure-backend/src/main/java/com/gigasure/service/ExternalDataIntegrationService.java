package com.gigasure.service;

import com.gigasure.entity.Worker;
import com.gigasure.repository.WorkerRepository;
import com.gigasure.entity.DisruptionEvent;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;

@Service
public class ExternalDataIntegrationService {

    private final DisruptionEventService disruptionEventService;
    private final WorkerRepository workerRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public ExternalDataIntegrationService(DisruptionEventService disruptionEventService, WorkerRepository workerRepository) {
        this.disruptionEventService = disruptionEventService;
        this.workerRepository = workerRepository;
    }

    // Runs every 60 seconds
    @Scheduled(fixedRate = 60000)
    @SuppressWarnings("unchecked")
    public void fetchRealTimeWeatherAndCurfews() {
        List<Worker> activeWorkers = workerRepository.findAllByCurrentLatIsNotNullAndCurrentLngIsNotNull();
        
        System.out.println("Hyper-Local Audit: Fetching precision weather for " + activeWorkers.size() + " active locations...");

        for (Worker worker : activeWorkers) {
            try {
                // Fetch weather at the EXACT coordinate of the worker
                String url = String.format(
                        "https://api.open-meteo.com/v1/forecast?latitude=%f&longitude=%f&daily=precipitation_sum,apparent_temperature_max&timezone=auto&forecast_days=1",
                        worker.getCurrentLat(), worker.getCurrentLng());
                
                Map<String, Object> response = restTemplate.getForObject(url, Map.class);
                Map<String, List<?>> daily = (Map<String, List<?>>) response.get("daily");

                if (daily != null) {
                    double precip = ((List<Number>) daily.get("precipitation_sum")).get(0).doubleValue();
                    double temp = ((List<Number>) daily.get("apparent_temperature_max")).get(0).doubleValue();

                    // Precision Trigger: Rainfall > 30mm at this specific coordinate
                    if (precip > 30.0) {
                        triggerDisruptionForWorker(worker, "RAINFALL", precip, 70.0);
                    }

                    // Precision Trigger: Heatwave > 42C at this specific coordinate
                    if (temp > 42.0) {
                        triggerDisruptionForWorker(worker, "HEATWAVE", temp, 60.0);
                    }
                }
            } catch (Exception e) {
                System.err.println("Failed precision fetch for Worker " + worker.getId() + ": " + e.getMessage());
            }
        }
    }

    private void triggerDisruptionForWorker(Worker worker, String type, double value, double drop) {
        DisruptionEvent event = new DisruptionEvent();
        event.setCity(worker.getCity());
        event.setType(type);
        event.setMetricValue(value);
        event.setDeliveryActivityDrop(drop);
        
        // We record the event, which then triggers the claim engine for this city/location
        disruptionEventService.recordEvent(event);
        System.out.println(">>> HYPER-LOCAL TRIGGER: " + type + " detected at Worker " + worker.getId() + " location.");
    }
}
