 package dev.portfolio.productionpulse.workorders;

// Import Spring Data JPA
import org.springframework.data.jpa.repository.JpaRepository;

// Repository for storing and retrieving maintenance orders
public interface MaintenanceOrderRepository
        extends JpaRepository<MaintenanceOrder, Long> {

    // Spring Data JPA provides database methods automatically

}