package dev.portfolio.productionpulse.workorders;

// Enum defining the priority of maintenance jobs
public enum MaintenancePriority {

    // Routine maintenance with no urgency
    LOW,

    // Maintenance that should be scheduled
    MEDIUM,

    // Important maintenance requiring attention
    HIGH,

    // Urgent breakdown or safety-related issue
    CRITICAL

}