package dev.portfolio.productionpulse.workorders;

// Import validation annotations
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

// Import Java date class
import java.time.LocalDate;

// Record defining the information required
// when creating a maintenance work order
public record MaintenanceOrderRequest(

        // ID of the equipment requiring maintenance
        @NotNull
        @Positive
        Long equipmentId,

        // Short description of the maintenance job
        @NotBlank
        @Size(max = 150)
        String title,

        // Detailed description of the fault
        @Size(max = 1000)
        String description,

        // Priority assigned to the maintenance job
        @NotNull
        MaintenancePriority priority,

        // Optional date when the job should be completed
        LocalDate dueDate

) {
}