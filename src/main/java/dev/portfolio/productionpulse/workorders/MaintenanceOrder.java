package dev.portfolio.productionpulse.workorders;

// Import the existing Equipment class
import dev.portfolio.productionpulse.equipment.Equipment;

// Import database annotations
import jakarta.persistence.*;

// Import Java date and time classes
import java.time.LocalDate;
import java.time.LocalDateTime;

// Represents a maintenance work order in the database
@Entity
@Table(name = "maintenance_orders")
public class MaintenanceOrder {

    // Unique database ID for each maintenance order
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link the work order to an existing machine
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    // Short title describing the maintenance job
    @Column(nullable = false, length = 150)
    private String title;

    // Detailed description of the fault
    @Column(length = 1000)
    private String description;

    // Priority of the maintenance job
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MaintenancePriority priority;

    // Current status of the maintenance job
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MaintenanceStatus status;

    // Date when the maintenance job is due
    private LocalDate dueDate;

    // Date and time when the job was created
    @Column(nullable = false)
    private LocalDateTime createdAt;

    // Date and time when the job was completed
    private LocalDateTime completedAt;

    // Default constructor required by JPA
    protected MaintenanceOrder() {
    }

    // Constructor used when creating a new maintenance job
    public MaintenanceOrder(
            Equipment equipment,
            String title,
            String description,
            MaintenancePriority priority,
            LocalDate dueDate
    ) {

        // Store the equipment linked to the job
        this.equipment = equipment;

        // Store the maintenance job details
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;

        // Every new maintenance job starts as OPEN
        this.status = MaintenanceStatus.OPEN;

        // Record the creation date and time
        this.createdAt = LocalDateTime.now();

    }

    // Return the maintenance order ID
    public Long getId() {
        return id;
    }

    // Return the equipment requiring maintenance
    public Equipment getEquipment() {
        return equipment;
    }

    // Return the maintenance job title
    public String getTitle() {
        return title;
    }

    // Return the fault description
    public String getDescription() {
        return description;
    }

    // Return the maintenance priority
    public MaintenancePriority getPriority() {
        return priority;
    }

    // Return the current maintenance status
    public MaintenanceStatus getStatus() {
        return status;
    }

    // Return the maintenance due date
    public LocalDate getDueDate() {
        return dueDate;
    }

    // Return the date the job was created
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // Return the date the job was completed
    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    // Method used to change the maintenance job status
    public void changeStatus(MaintenanceStatus nextStatus) {

        // Prevent a completed job from being reopened
        if (status == MaintenanceStatus.COMPLETED
                && nextStatus != MaintenanceStatus.COMPLETED) {

            throw new IllegalStateException(
                    "Completed jobs cannot be reopened"
            );

        }

        // Record the completion date when a job is finished
        if (nextStatus == MaintenanceStatus.COMPLETED
                && status != MaintenanceStatus.COMPLETED) {

            completedAt = LocalDateTime.now();

        }

        // Update the job status
        status = nextStatus;

    }

}