package dev.portfolio.productionpulse.workorders;

// Import validation annotation
import jakarta.validation.constraints.NotNull;

// Record containing the new maintenance job status
public record MaintenanceStatusRequest(

        // Require the user to specify a status
        @NotNull
        MaintenanceStatus status

) {
}