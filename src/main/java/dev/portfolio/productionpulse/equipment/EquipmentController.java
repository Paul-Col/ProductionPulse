
package dev.portfolio.productionpulse.equipment;

// ==========================================
// IMPORTS
// ==========================================

// Validation
import jakarta.validation.Valid;

// Spring Boot HTTP responses
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

// Spring Boot REST controller annotations
import org.springframework.web.bind.annotation.*;

// Spring Boot error handling
import org.springframework.web.server.ResponseStatusException;

// Java utilities
import java.util.List;
import java.util.Locale;


// ==========================================
// EQUIPMENT CONTROLLER
// ==========================================

// Controller for equipment-related API requests
@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    // Repository used to access the equipment database
    private final EquipmentRepository repository;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    // Constructor receives the equipment repository
    public EquipmentController(
            EquipmentRepository repository
    ) {

        // Store the repository for use by controller methods
        this.repository = repository;

    }


    // ==========================================
    // GET ALL EQUIPMENT
    // ==========================================

    // GET /api/equipment
    // Return all equipment records
    @GetMapping
    public List<Equipment> getAllEquipment() {

        // Retrieve all machines from the database
        return repository.findAll();

    }


    // ==========================================
    // REGISTER NEW EQUIPMENT
    // ==========================================

    // POST /api/equipment
    // Register a new item of equipment
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Equipment addEquipment(
            @Valid @RequestBody EquipmentRequest request
    ) {

        // Standardise the equipment code
        String code = request.code()
                .trim()
                .toUpperCase(Locale.ROOT);

        // Prevent duplicate equipment codes
        if (repository.existsByCodeIgnoreCase(code)) {

            // Return HTTP 409 Conflict
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Equipment code already exists"
            );

        }

        // Create a new equipment object
        Equipment equipment = new Equipment(
                code,
                request.name().trim(),
                request.location().trim(),
                request.status()
        );

        // Save equipment and return the saved record
        return repository.save(equipment);

    }


    // ==========================================
    // UPDATE EXISTING EQUIPMENT
    // ==========================================

    // PUT /api/equipment/{id}
    // Update the name, location and status of a machine
    @PutMapping("/{id}")
    public ResponseEntity<Equipment> updateEquipment(

            // Get the equipment database ID from the URL
            @PathVariable Long id,

            // Validate the equipment details sent by JavaScript
            @Valid @RequestBody EquipmentUpdateRequest request

    ) {

        // Find the existing machine in the database
        Equipment equipment = repository.findById(id)

                // Return HTTP 404 if the machine does not exist
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Equipment not found"
                ));

        // Update the existing machine details
        equipment.updateDetails(
                request.name().trim(),
                request.location().trim(),
                request.status()
        );

        // Save the changes to the SQL database
        Equipment updatedEquipment =
                repository.save(equipment);

        // Return HTTP 200 with the updated machine as JSON
        return ResponseEntity.ok(updatedEquipment);

    }

}
