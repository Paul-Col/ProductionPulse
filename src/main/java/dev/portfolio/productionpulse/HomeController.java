package dev.portfolio.productionpulse;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// Controller providing a simple API welcome message
@RestController
public class HomeController {

    // Display a welcome message at /api/hello
    @GetMapping("/api/hello")
    public String home() {

        // Return a message to the browser
        return "Welcome to ProductionPulse!";

    }

}