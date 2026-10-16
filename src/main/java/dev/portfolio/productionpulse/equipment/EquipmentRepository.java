package dev.portfolio.productionpulse.equipment;

import org.springframework.data.jpa.repository.JpaRepository;

// Repository used to access equipment records
public interface EquipmentRepository
        extends JpaRepository<Equipment, Long> {

    // Check whether an equipment code already exists
    boolean existsByCodeIgnoreCase(String code);

}