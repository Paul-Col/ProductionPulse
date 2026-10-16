
// ==========================================
// PRODUCTIONPULSE
// Equipment Update Request
// ==========================================

package dev.portfolio.productionpulse.equipment;

// Import validation annotations
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


// Record containing equipment details to update
public record EquipmentUpdateRequest(

    // Updated machine name
    @NotBlank
    @Size(max = 150)
    String name,

    // Updated machine location
    @NotBlank
    @Size(max = 150)
    String location,

    // Updated operating status
    @NotNull
    EquipmentStatus status

) {}
