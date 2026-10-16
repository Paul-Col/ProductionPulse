package dev.portfolio.productionpulse.equipment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

// Data required when registering new equipment
public record EquipmentRequest(

        // Equipment must have a code
        @NotBlank
        String code,

        // Equipment must have a name
        @NotBlank
        String name,

        // Equipment must have a location
        @NotBlank
        String location,

        // Equipment must have an operating status
        @NotNull
        EquipmentStatus status

) {
}