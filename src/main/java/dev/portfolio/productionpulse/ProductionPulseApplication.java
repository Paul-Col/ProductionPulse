package dev.portfolio.productionpulse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Main class for the ProductionPulse application
@SpringBootApplication
public class ProductionPulseApplication {

    // Main method - starting point of the application
    public static void main(String[] args) {

        // Start the Spring Boot application
        SpringApplication.run(
                ProductionPulseApplication.class,
                args
        );

    }

}