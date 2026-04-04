package com.gigasure;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GigasureBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(GigasureBackendApplication.class, args);
	}

}
