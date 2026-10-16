package dev.portfolio.productionpulse.workorders;

// Import existing equipment classes
import dev.portfolio.productionpulse.equipment.Equipment;
import dev.portfolio.productionpulse.equipment.EquipmentRepository;

// Import validation
import jakarta.validation.Valid;

// Import Spring Boot components
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

// Import Java List
import java.util.List;

// REST API controller for maintenance work orders
@RestController
@RequestMapping("/api/orders")
public class MaintenanceOrderController {

    // Repository for maintenance work orders
    private final MaintenanceOrderRepository orderRepository;

    // Repository for registered equipment
    private final EquipmentRepository equipmentRepository;

    // Constructor receives both repositories
    public MaintenanceOrderController(
            MaintenanceOrderRepository orderRepository,
            EquipmentRepository equipmentRepository
    ) {

        this.orderRepository = orderRepository;
        this.equipmentRepository = equipmentRepository;

    }

    // Return all maintenance work orders
    // GET /api/orders
    @GetMapping
    public List<MaintenanceOrder> getAllOrders() {

        // Retrieve all orders from the database
        return orderRepository.findAll();

    }

    // Return a specific maintenance work order
    // GET /api/orders/{id}
    @GetMapping("/{id}")
    public MaintenanceOrder getOrder(
            @PathVariable Long id
    ) {

        // Search for the maintenance order by ID
        return orderRepository.findById(id)

                // Return 404 if the job does not exist
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Maintenance order not found"
                        )
                );

    }

    // Create a new maintenance work order
    // POST /api/orders
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MaintenanceOrder createOrder(
            @Valid @RequestBody MaintenanceOrderRequest request
    ) {

        // Find the equipment that requires maintenance
        Equipment equipment = equipmentRepository
                .findById(request.equipmentId())

                // Return 404 if equipment cannot be found
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Equipment not found"
                        )
                );

        // Create a new maintenance order
        MaintenanceOrder order = new MaintenanceOrder(
                equipment,
                request.title().trim(),
                request.description(),
                request.priority(),
                request.dueDate()
        );

        // Save the new maintenance order
        return orderRepository.save(order);

    }

    // Update the status of an existing maintenance job
    // PATCH /api/orders/{id}/status
    @PatchMapping("/{id}/status")
    public MaintenanceOrder updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody MaintenanceStatusRequest request
    ) {

        // Find the existing maintenance order
        MaintenanceOrder order = orderRepository
                .findById(id)

                // Return 404 if the order does not exist
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Maintenance order not found"
                        )
                );

        // Attempt to update the job status
        try {

            // Apply the status change
            order.changeStatus(request.status());

        } catch (IllegalStateException error) {

            // Return 409 if the status change is not permitted
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    error.getMessage()
            );

        }

        // Save the updated maintenance order
        return orderRepository.save(order);

    }

}