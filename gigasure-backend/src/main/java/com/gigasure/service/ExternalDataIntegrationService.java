package com.gigasure.service;

import com.gigasure.entity.DisruptionEvent;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class ExternalDataIntegrationService {

    private final DisruptionEventService disruptionEventService;
    private final RestTemplate restTemplate = new RestTemplate();

    public ExternalDataIntegrationService(DisruptionEventService disruptionEventService) {
        this.disruptionEventService = disruptionEventService;
    }

    // Runs every 60 seconds
    @Scheduled(fixedRate = 60000)
    @SuppressWarnings("unchecked")
    public void fetchRealTimeWeatherAndCurfews() {
        String[] cities = { "Mumbai", "Delhi", "Bangalore", "Chennai" };
        String[] lats = { "19.0760", "28.7041", "12.9716", "13.0827" };
        String[] lons = { "72.8777", "77.1025", "77.5946", "80.2707" };

        for (int i = 0; i < cities.length; i++) {
            String city = cities[i];
            String lat = lats[i];
            String lon = lons[i];

            System.out.println("Fetching real-time weather from Open-Meteo for " + city + "...");

            try {
                // Free Open-Meteo API
                String url = String.format(
                        "https://api.open-meteo.com/v1/forecast?latitude=%s&longitude=%s&daily=precipitation_sum,apparent_temperature_max&timezone=auto&forecast_days=1",
                        lat, lon);
                Map<String, Object> response = restTemplate.getForObject(url, Map.class);
                Map<String, java.util.List<?>> daily = (Map<String, java.util.List<?>>) response.get("daily");

                if (daily != null) {
                    java.util.List<Double> precipitation = (java.util.List<Double>) daily.get("precipitation_sum");
                    java.util.List<Double> tempMax = (java.util.List<Double>) daily.get("apparent_temperature_max");

                    double currentPrecipitation = precipitation.get(0);
                    double currentTempMax = tempMax.get(0);

                    System.out.println(city + " - Precip: " + currentPrecipitation + "mm, Temp: " + currentTempMax + "C");

                    // Trigger Check: Rainfall > 30mm
                    if (currentPrecipitation > 30.0) {
                        triggerDisruption(city, "RAINFALL", currentPrecipitation, 70.0);
                    }

                    // Trigger Check: Heatwave > 42C
                    if (currentTempMax > 42.0) {
                        triggerDisruption(city, "HEATWAVE", currentTempMax, 60.0);
                    }
                }
            } catch (Exception e) {
                System.err.println("Failed to fetch weather for " + city + ": " + e.getMessage());
            }
        }
    }

    private void triggerDisruption(String city, String type, double value, double drop) {
        DisruptionEvent event = new DisruptionEvent();
        event.setCity(city);
        event.setType(type);
        event.setValue(value);
        event.setDeliveryActivityDrop(drop);
        disruptionEventService.recordEvent(event);
        System.out.println(">>> AUTOMATED DISRUPTION TRIGGERED: " + type + " in " + city);
    }
}
