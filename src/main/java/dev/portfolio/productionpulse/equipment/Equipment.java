package dev.portfolio.productionpulse.equipment;

import jakarta.persistence.*;

// Represent equipment as a database table
@Entity
@Table(name = "equipment")
public class Equipment {

    // Unique database ID
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Unique equipment code
    @Column(nullable = false, unique = true)
    private String code;

    // Equipment name
    @Column(nullable = false)
    private String name;

    // Location within the factory
    @Column(nullable = false)
    private String location;

    // Current operating status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EquipmentStatus status;

    // Default constructor required by JPA
    protected Equipment() {
    }

    // Constructor for creating new equipment
    public Equipment(
            String code,
            String name,
            String location,
            EquipmentStatus status
    ) {

        this.code = code;
        this.name = name;
        this.location = location;
        this.status = status;

    }

    // Return equipment database ID
    public Long getId() {
        return id;
    }

    // Return equipment code
    public String getCode() {
        return code;
    }

    // Return equipment name
    public String getName() {
        return name;
    }

    // Return equipment location
    public String getLocation() {
        return location;
    }

    // Return equipment status
    public EquipmentStatus getStatus() {
        return status;
    }

// ==========================================
// UPDATE EQUIPMENT DETAILS
// ==========================================

// Update an existing machine's information
public void updateDetails(
        String name,
        String location,
        EquipmentStatus status
) {

    // Update the machine name
    this.name = name;

    // Update the machine location
    this.location = location;

    // Update the machine operating status
    this.status = status;

}

}
