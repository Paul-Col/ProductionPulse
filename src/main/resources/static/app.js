
// ==========================================
// PRODUCTIONPULSE
// Dashboard JavaScript - Step 7.16
// ==========================================


// ==========================================
// API FUNCTIONS
// ==========================================

// Retrieve JSON data from the Spring Boot API
async function fetchData(url) {

    // Send a GET request to the API
    const response = await fetch(url);

    // Check whether the request succeeded
    if (!response.ok) {

        throw new Error(
            `Request failed: ${response.status}`
        );

    }

    // Convert the JSON response to JavaScript
    return await response.json();

}

// ==========================================
// DASHBOARD FILTER DATA
// ==========================================

// Store all equipment returned by Spring Boot
let allEquipment = [];

// Store all maintenance orders returned by Spring Boot
let allMaintenanceOrders = [];

// ==========================================
// TABLE FUNCTIONS
// ==========================================

// Add an ordinary text cell to a table row
function addCell(row, value) {

    // Create the table cell
    const cell = document.createElement("td");

    // Safely display the supplied value
    cell.textContent = value ?? "-";

    // Add the cell to the row
    row.appendChild(cell);

}


// Add a coloured status or priority badge
function addStatusCell(row, value) {

    // Create the cell and status badge
    const cell = document.createElement("td");
    const badge = document.createElement("span");

    // Display the badge text
    badge.textContent = value ?? "UNKNOWN";

    // Convert IN_PROGRESS to in-progress for CSS
    const status = String(value ?? "unknown")
        .toLowerCase()
        .replaceAll("_", "-");

    // Apply the appropriate CSS styling
    badge.className = `status ${status}`;

    // Add the badge to the table cell
    cell.appendChild(badge);

    // Add the cell to the row
    row.appendChild(cell);

}


// Create a table with the supplied headings
function createTable(headings) {

    // Create the table elements
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headingRow = document.createElement("tr");
    const tbody = document.createElement("tbody");

    // Create each column heading
    headings.forEach(heading => {

        const th = document.createElement("th");

        th.textContent = heading;

        headingRow.appendChild(th);

    });

    // Assemble the table
    thead.appendChild(headingRow);
    table.append(thead, tbody);

    // Return the table and body
    return { table, tbody };

}


// ==========================================
// EQUIPMENT STATISTICS
// ==========================================

// Calculate and display equipment statistics
function displayEquipmentStats(equipment) {

    // Calculate equipment totals
    const statistics = [

        {
            label: "Total Equipment",
            value: equipment.length
        },

        {
            label: "Running",
            value: equipment.filter(
                item => item.status === "RUNNING"
            ).length
        },

        {
            label: "Maintenance",
            value: equipment.filter(
                item => item.status === "MAINTENANCE"
            ).length
        },

        {
            label: "Down",
            value: equipment.filter(
                item => item.status === "DOWN"
            ).length
        }

    ];

    // Find the equipment statistics container
    const container = document.getElementById(
        "equipment-stats"
    );

    // Clear old statistics
    container.replaceChildren();

    // Create a card for each statistic
    statistics.forEach(stat => {

        // Create the card
        const card = document.createElement("div");
        card.className = "stat-card";

        // Display the statistic number
        const number = document.createElement("h3");
        number.textContent = stat.value;

        // Display the statistic label
        const label = document.createElement("p");
        label.textContent = stat.label;

        // Add the completed card
        card.append(number, label);
        container.appendChild(card);

    });

}


// ==========================================
// EQUIPMENT REGISTER
// ==========================================

// Display all registered machines with Edit buttons
function displayEquipment(equipment) {

    // Find the equipment table container
    const container = document.getElementById(
        "equipment-list"
    );

    // Remove old table information
    container.replaceChildren();

    // Handle an empty equipment database
    if (equipment.length === 0) {

        container.textContent =
            "No equipment has been registered.";

        return;

    }

    // Create the equipment table
    const { table, tbody } = createTable([
        "Equipment ID",
        "Machine",
        "Location",
        "Status",
        "Action"
    ]);

    // Loop through registered machines
    equipment.forEach(item => {

        // Create the equipment row
        const row = document.createElement("tr");

        // Display equipment information
        addCell(row, item.code);
        addCell(row, item.name);
        addCell(row, item.location);

        // Display the current operating status
        addStatusCell(row, item.status);

        // Create the action cell
        const actionCell = document.createElement("td");

        // Create the Edit button
        const editButton = document.createElement("button");

        // Prevent accidental form submission
        editButton.type = "button";

        // Set the button text and styling
        editButton.textContent = "Edit";
        editButton.className = "action-button";

        // Open the editor when clicked
        editButton.addEventListener("click", () => {

            openEquipmentEditor(item);

        });

        // Add the button to the row
        actionCell.appendChild(editButton);
        row.appendChild(actionCell);

        // Add the equipment row to the table
        tbody.appendChild(row);

    });

    // Display the completed equipment table
    container.appendChild(table);

}


// ==========================================
// OPEN EQUIPMENT EDITOR
// ==========================================

// Populate the editing form with existing machine details
function openEquipmentEditor(equipment) {

    // Find the editing panel
    const panel = document.getElementById(
        "equipment-edit-panel"
    );

    // Stop if the editing panel is missing
    if (!panel) {

        console.error(
            "Equipment edit panel not found in index.html."
        );

        return;

    }

    // Store the equipment database ID
    document.getElementById(
        "edit-equipment-id"
    ).value = equipment.id;

    // Display the equipment code
    document.getElementById(
        "edit-equipment-code"
    ).value = equipment.code;

    // Display the existing machine name
    document.getElementById(
        "edit-equipment-name"
    ).value = equipment.name;

    // Display the existing location
    document.getElementById(
        "edit-equipment-location"
    ).value = equipment.location;

    // Select the existing operating status
    document.getElementById(
        "edit-equipment-status"
    ).value = equipment.status;

    // Clear any previous message
    document.getElementById(
        "equipment-edit-message"
    ).textContent = "";

    // Show the editing panel
    panel.hidden = false;

    // Scroll to the editing form
    panel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    // Focus on the machine name field
    document.getElementById(
        "edit-equipment-name"
    ).focus({
        preventScroll: true
    });

}


// ==========================================
// SAVE EQUIPMENT CHANGES
// ==========================================

// Connect the equipment edit form to Spring Boot
function setupEquipmentEditForm() {

    // Find the equipment editing form
    const form = document.getElementById(
        "equipment-edit-form"
    );

    // Find the editing panel
    const panel = document.getElementById(
        "equipment-edit-panel"
    );

    // Stop if the editing HTML is missing
    if (!form || !panel) {

        return;

    }

    // Find the Cancel button
    const cancelButton = document.getElementById(
        "cancel-equipment-edit"
    );

    // Find the feedback message
    const message = document.getElementById(
        "equipment-edit-message"
    );

    // Find the Save Changes button
    const saveButton = form.querySelector(
        'button[type="submit"]'
    );

    // Handle cancelling equipment editing
    cancelButton.addEventListener("click", () => {

        // Hide the editing panel
        panel.hidden = true;

        // Clear the form
        form.reset();

        // Clear previous messages
        message.textContent = "";

    });

    // Handle saving changes
    form.addEventListener("submit", async event => {

        // Prevent the browser from refreshing
        event.preventDefault();

        // Get the equipment database ID
        const equipmentId = Number(
            document.getElementById(
                "edit-equipment-id"
            ).value
        );

        // Validate the database ID
        if (
            !Number.isInteger(equipmentId) ||
            equipmentId <= 0
        ) {

            message.textContent =
                "Please select a valid machine.";

            message.style.color = "#ef4444";

            return;

        }

        // Collect the updated equipment information
        const updatedDetails = {

            // Updated machine name
            name: document.getElementById(
                "edit-equipment-name"
            ).value.trim(),

            // Updated location
            location: document.getElementById(
                "edit-equipment-location"
            ).value.trim(),

            // Updated operating status
            status: document.getElementById(
                "edit-equipment-status"
            ).value

        };

        // Check required fields
        if (
            !updatedDetails.name ||
            !updatedDetails.location
        ) {

            message.textContent =
                "Machine name and location are required.";

            message.style.color = "#ef4444";

            return;

        }

        // Disable the Save Changes button
        saveButton.disabled = true;

        // Display progress information
        message.textContent = "Saving equipment changes...";
        message.style.color = "#94a3b8";

        try {

            // Send updated equipment to Spring Boot
            const response = await fetch(
                `/api/equipment/${equipmentId}`,
                {

                    // PUT updates an existing machine
                    method: "PUT",

                    // Send JSON data
                    headers: {
                        "Content-Type": "application/json"
                    },

                    // Convert the object into JSON
                    body: JSON.stringify(updatedDetails)

                }
            );

            // Handle a missing equipment record
            if (response.status === 404) {

                throw new Error(
                    "This equipment record could not be found."
                );

            }

            // Handle other server errors
            if (!response.ok) {

                throw new Error(
                    `Unable to update equipment (${response.status}).`
                );

            }

            // Read the updated equipment
            const updatedEquipment = await response.json();

            // Hide the editing panel
            panel.hidden = true;

            // Clear the form
            form.reset();

            // Refresh equipment and maintenance data
            await loadDashboard();

            // Display success message
            message.textContent =
                `${updatedEquipment.code} updated successfully!`;

            message.style.color = "#22c55e";

        } catch (error) {

            // Display the error
            message.textContent = error.message;

            message.style.color = "#ef4444";

            console.error(
                "Equipment update failed:",
                error
            );

        } finally {

            // Re-enable the Save Changes button
            saveButton.disabled = false;

        }

    });

}


// ==========================================
// MAINTENANCE STATISTICS
// ==========================================

// Calculate maintenance work order statistics
function displayMaintenanceStats(orders) {

    // Find the Maintenance Overview section
    const container = document.getElementById(
        "maintenance-stats"
    );

    // Stop if the section does not exist
    if (!container) {

        return;

    }

    // Get the current local date
    const today = new Date();

    // Format it as YYYY-MM-DD
    const currentDate = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    // Count open maintenance jobs
    const open = orders.filter(
        order => order.status === "OPEN"
    ).length;

    // Count jobs currently in progress
    const inProgress = orders.filter(
        order => order.status === "IN_PROGRESS"
    ).length;

    // Count completed jobs
    const completed = orders.filter(
        order => order.status === "COMPLETED"
    ).length;

    // Count overdue jobs that are not completed
    const overdue = orders.filter(order => {

        return order.status !== "COMPLETED" &&
            Boolean(order.dueDate) &&
            order.dueDate < currentDate;

    }).length;

    // Define the maintenance statistics
    const statistics = [

        {
            label: "Open Jobs",
            value: open,
            type: "open"
        },

        {
            label: "In Progress",
            value: inProgress,
            type: "in-progress"
        },

        {
            label: "Completed",
            value: completed,
            type: "completed"
        },

        {
            label: "Overdue",
            value: overdue,
            type: "overdue"
        }

    ];

    // Clear old statistics
    container.replaceChildren();

    // Create the maintenance statistic cards
    statistics.forEach(stat => {

        // Create the card
        const card = document.createElement("div");

        // Apply the appropriate styling
        card.className = `stat-card ${stat.type}`;

        // Display the statistic value
        const number = document.createElement("h3");
        number.textContent = stat.value;

        // Display the statistic label
        const label = document.createElement("p");
        label.textContent = stat.label;

        // Add the card to the dashboard
        card.append(number, label);
        container.appendChild(card);

    });

}


// ==========================================
// MAINTENANCE STATUS BUTTONS
// ==========================================

// Add an action button to a maintenance work order
function addMaintenanceActionCell(row, order) {

    // Create the action cell
    const cell = document.createElement("td");

    // Determine the next maintenance status
    let nextStatus = null;

    // An open job can be started
    if (order.status === "OPEN") {

        nextStatus = "IN_PROGRESS";

    }

    // An in-progress job can be completed
    else if (order.status === "IN_PROGRESS") {

        nextStatus = "COMPLETED";

    }

    // Completed jobs cannot be restarted
    if (order.status === "COMPLETED") {

        cell.textContent = "Finished";

    }

    // Handle an unrecognised maintenance status
    else if (nextStatus === null) {

        cell.textContent = "-";

    }

    else {

        // Create the action button
        const button = document.createElement("button");

        // Prevent form submission
        button.type = "button";

        // Set the button label
        button.textContent =
            nextStatus === "IN_PROGRESS"
                ? "Start Work"
                : "Complete Job";

        // Apply the appropriate styling
        button.className =
            nextStatus === "COMPLETED"
                ? "action-button complete-button"
                : "action-button";

        // Send the status change when clicked
        button.addEventListener("click", () => {

            updateMaintenanceStatus(
                order.id,
                nextStatus,
                button
            );

        });

        // Add the button to the cell
        cell.appendChild(button);

    }

    // Add the action cell to the row
    row.appendChild(cell);

}


// ==========================================
// MAINTENANCE WORK ORDERS
// ==========================================

// Display maintenance jobs from the database
function displayMaintenance(orders) {

    // Find the maintenance table container
    const container = document.getElementById(
        "maintenance-list"
    );

    // Clear old maintenance records
    container.replaceChildren();

    // Handle an empty database
    if (orders.length === 0) {

        container.textContent =
            "No maintenance work orders found.";

        return;

    }

    // Create the maintenance table
    const { table, tbody } = createTable([
        "Job ID",
        "Equipment",
        "Description",
        "Priority",
        "Status",
        "Due Date",
        "Action"
    ]);

    // Add each maintenance job
    orders.forEach(order => {

        // Create a table row
        const row = document.createElement("tr");

        // Display work order details
        addCell(row, order.id);

        // Display the equipment code
        addCell(
            row,
            order.equipment?.code ?? "Unknown"
        );

        // Display the job title
        addCell(row, order.title);

        // Display priority and status
        addStatusCell(row, order.priority);
        addStatusCell(row, order.status);

        // Display the due date
        addCell(row, order.dueDate ?? "-");

        // Add Start Work or Complete Job
        addMaintenanceActionCell(row, order);

        // Add the row to the table
        tbody.appendChild(row);

    });

    // Display the completed table
    container.appendChild(table);

}


// ==========================================
// MAINTENANCE EQUIPMENT DROPDOWN
// ==========================================

// Populate the maintenance form with registered machines
function populateMaintenanceEquipment(equipment) {

    // Find the equipment dropdown
    const dropdown = document.getElementById(
        "maintenance-equipment"
    );

    // Stop if the dropdown is missing
    if (!dropdown) {

        return;

    }

    // Remember the selected machine
    const previousSelection = dropdown.value;

    // Clear the dropdown
    dropdown.replaceChildren();

    // Create the default option
    const placeholder = document.createElement("option");

    placeholder.value = "";

    placeholder.textContent =
        equipment.length === 0
            ? "No equipment registered"
            : "Select Equipment";

    dropdown.appendChild(placeholder);

    // Add each registered machine
    equipment.forEach(item => {

        // Create an option
        const option = document.createElement("option");

        // Store the equipment database ID
        option.value = String(item.id);

        // Display equipment code and machine name
        option.textContent =
            `${item.code} - ${item.name}`;

        // Add the option to the dropdown
        dropdown.appendChild(option);

    });

    // Restore the previous selection
    if (equipment.some(
        item => String(item.id) === previousSelection
    )) {

        dropdown.value = previousSelection;

    }

    // Disable selection if no machines exist
    dropdown.disabled = equipment.length === 0;

}


// ==========================================
// FILTER EQUIPMENT
// ==========================================

// Search and filter the equipment register
function displayFilteredEquipment() {

    // Read the equipment search text
    const searchTerm = document.getElementById(
        "equipment-search"
    ).value.trim().toLowerCase();

    // Read the selected operating status
    const selectedStatus = document.getElementById(
        "equipment-status-filter"
    ).value;

    // Filter all registered equipment
    const filteredEquipment = allEquipment.filter(item => {

        // Combine searchable machine information
        const searchableText = [
            item.code,
            item.name,
            item.location
        ]
            .map(value => String(value ?? ""))
            .join(" ")
            .toLowerCase();

        // Check whether the machine matches the search
        const matchesSearch = searchableText.includes(
            searchTerm
        );

        // Check whether the operating status matches
        const matchesStatus =
            selectedStatus === "ALL" ||
            item.status === selectedStatus;

        // Include records matching both conditions
        return matchesSearch && matchesStatus;

    });

    // Handle an empty equipment database
    if (allEquipment.length === 0) {

        displayEquipment([]);

        return;

    }

    // Handle searches with no matching machines
    if (filteredEquipment.length === 0) {

        document.getElementById(
            "equipment-list"
        ).textContent = "No equipment matches your search.";

        return;

    }

    // Display the matching equipment records
    displayEquipment(filteredEquipment);

}


// ==========================================
// FILTER MAINTENANCE WORK ORDERS
// ==========================================

// Search maintenance jobs by text, status and priority
function displayFilteredMaintenance() {

    // Read the maintenance search text
    const searchTerm = document.getElementById(
        "maintenance-search"
    ).value.trim().toLowerCase();

    // Read the selected maintenance status
    const selectedStatus = document.getElementById(
        "maintenance-status-filter"
    ).value;

    // Read the selected priority
    const selectedPriority = document.getElementById(
        "maintenance-priority-filter"
    ).value;

    // Filter all saved maintenance orders
    const filteredOrders = allMaintenanceOrders.filter(
        order => {

            // Combine searchable maintenance information
            const searchableText = [
                order.id,
                order.title,
                order.description,
                order.equipment?.code,
                order.equipment?.name,
                order.dueDate
            ]
                .map(value => String(value ?? ""))
                .join(" ")
                .toLowerCase();

            // Match the maintenance search text
            const matchesSearch = searchableText.includes(
                searchTerm
            );

            // Match the selected maintenance status
            const matchesStatus =
                selectedStatus === "ALL" ||
                order.status === selectedStatus;

            // Match the selected maintenance priority
            const matchesPriority =
                selectedPriority === "ALL" ||
                order.priority === selectedPriority;

            // Include jobs matching every filter
            return matchesSearch &&
                matchesStatus &&
                matchesPriority;

        }
    );

    // Handle a database with no maintenance orders
    if (allMaintenanceOrders.length === 0) {

        displayMaintenance([]);

        return;

    }

    // Handle searches with no matching work orders
    if (filteredOrders.length === 0) {

        document.getElementById(
            "maintenance-list"
        ).textContent =
            "No maintenance jobs match your search.";

        return;

    }

    // Display the matching maintenance work orders
    displayMaintenance(filteredOrders);

}


// ==========================================
// ACTIVATE DASHBOARD FILTERS
// ==========================================

// Connect search fields and dropdowns to filtering
function setupDashboardFilters() {

    // Filter equipment when the user types
    document.getElementById(
        "equipment-search"
    ).addEventListener(
        "input",
        displayFilteredEquipment
    );

    // Filter equipment when operating status changes
    document.getElementById(
        "equipment-status-filter"
    ).addEventListener(
        "change",
        displayFilteredEquipment
    );

    // Filter maintenance when the user types
    document.getElementById(
        "maintenance-search"
    ).addEventListener(
        "input",
        displayFilteredMaintenance
    );

    // Filter maintenance when job status changes
    document.getElementById(
        "maintenance-status-filter"
    ).addEventListener(
        "change",
        displayFilteredMaintenance
    );

    // Filter maintenance when priority changes
    document.getElementById(
        "maintenance-priority-filter"
    ).addEventListener(
        "change",
        displayFilteredMaintenance
    );

}


// ==========================================
// LOAD DASHBOARD DATA
// ==========================================

// Refresh equipment and maintenance information
async function loadDashboard() {

    // Load registered equipment
    try {

        // Retrieve equipment from Spring Boot
        const equipment = await fetchData(
            "/api/equipment"
        );

        // Store all equipment for filtering
        allEquipment = equipment;

        // Display statistics for all equipment
        displayEquipmentStats(equipment);

        // Display the matching equipment
        displayFilteredEquipment();

// Refresh the maintenance equipment dropdown
populateMaintenanceEquipment(equipment);

    } catch (error) {

        // Display equipment loading errors
        document.getElementById(
            "equipment-list"
        ).textContent = "Unable to load equipment.";

        document.getElementById(
            "equipment-stats"
        ).textContent = "Statistics unavailable.";

        console.error(
            "Equipment loading failed:",
            error
        );

    }

    // Load maintenance work orders
    try {

        // Retrieve work orders from Spring Boot
        const orders = await fetchData(
            "/api/orders"
        );

        // Store all maintenance orders for filtering
        allMaintenanceOrders = orders;

        // Display the matching maintenance jobs
        displayFilteredMaintenance();

        // Update statistics using every maintenance order
        displayMaintenanceStats(orders);

    } catch (error) {

        // Display maintenance loading errors
        document.getElementById(
            "maintenance-list"
        ).textContent = "Unable to load maintenance jobs.";

        // Find the maintenance statistics section
        const stats = document.getElementById(
            "maintenance-stats"
        );

        // Display statistics loading error
        if (stats) {

            stats.textContent =
                "Unable to load maintenance statistics.";

        }

        console.error(
            "Maintenance loading failed:",
            error
        );

    }

}


// ==========================================
// REGISTER NEW EQUIPMENT
// ==========================================

// Connect the equipment registration form
function setupEquipmentForm() {

    // Find the equipment registration form
    const form = document.getElementById(
        "equipment-form"
    );

    // Stop if the form does not exist
    if (!form) {

        return;

    }

    // Listen for equipment registration
    form.addEventListener("submit", async event => {

        // Prevent page reload
        event.preventDefault();

        // Find the feedback message
        const message = document.getElementById(
            "equipment-message"
        );

        // Find the submit button
        const button = form.querySelector(
            'button[type="submit"]'
        );

        // Collect equipment information
        const equipment = {

            code: document.getElementById(
                "equipment-code"
            ).value.trim(),

            name: document.getElementById(
                "equipment-name"
            ).value.trim(),

            location: document.getElementById(
                "equipment-location"
            ).value.trim(),

            status: document.getElementById(
                "equipment-status"
            ).value

        };

        // Disable the submit button
        button.disabled = true;

        // Display progress message
        message.textContent = "Saving equipment...";
        message.style.color = "";

        try {

            // Send equipment to Spring Boot
            const response = await fetch(
                "/api/equipment",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(equipment)

                }
            );

            // Handle duplicate equipment IDs
            if (response.status === 409) {

                throw new Error(
                    "Equipment ID already exists."
                );

            }

            // Handle other errors
            if (!response.ok) {

                throw new Error(
                    `Unable to save equipment (${response.status}).`
                );

            }

            // Read the saved equipment
            const savedEquipment = await response.json();

            // Clear the registration form
            form.reset();

            // Refresh equipment information
            await loadDashboard();

            // Display success message
            message.textContent =
                `${savedEquipment.code} registered successfully!`;

            message.style.color = "#22c55e";

        } catch (error) {

            // Display error message
            message.textContent = error.message;

            message.style.color = "#ef4444";

            console.error(
                "Equipment registration failed:",
                error
            );

        } finally {

            // Re-enable the button
            button.disabled = false;

        }

    });

}


// ==========================================
// CREATE MAINTENANCE WORK ORDER
// ==========================================

// Connect the maintenance form
function setupMaintenanceForm() {

    // Find the maintenance registration form
    const form = document.getElementById(
        "maintenance-form"
    );

    // Stop if the form does not exist
    if (!form) {

        return;

    }

    // Listen for work order creation
    form.addEventListener("submit", async event => {

        // Prevent browser refresh
        event.preventDefault();

        // Find the feedback message
        const message = document.getElementById(
            "maintenance-message"
        );

        // Find the submit button
        const button = form.querySelector(
            'button[type="submit"]'
        );

        // Get the selected equipment database ID
        const equipmentId = Number(
            document.getElementById(
                "maintenance-equipment"
            ).value
        );

        // Validate the equipment selection
        if (
            !Number.isInteger(equipmentId) ||
            equipmentId <= 0
        ) {

            message.textContent =
                "Please select a machine.";

            message.style.color = "#ef4444";

            return;

        }

        // Collect work order information
        const workOrder = {

            equipmentId: equipmentId,

            title: document.getElementById(
                "maintenance-title"
            ).value.trim(),

            description: document.getElementById(
                "maintenance-description"
            ).value.trim(),

            priority: document.getElementById(
                "maintenance-priority"
            ).value,

            dueDate: document.getElementById(
                "maintenance-due-date"
            ).value || null

        };

        // Disable the button
        button.disabled = true;

        // Display progress message
        message.textContent =
            "Creating maintenance work order...";

        message.style.color = "";

        try {

            // Send the work order to Spring Boot
            const response = await fetch(
                "/api/orders",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(workOrder)

                }
            );

            // Handle API errors
            if (!response.ok) {

                throw new Error(
                    `Unable to create work order (${response.status}).`
                );

            }

            // Read the saved work order
            const savedOrder = await response.json();

            // Clear the form
            form.reset();

            // Refresh maintenance information
            await loadDashboard();

            // Display success message
            message.textContent =
                `Work Order #${savedOrder.id} created successfully!`;

            message.style.color = "#22c55e";

        } catch (error) {

            // Display error information
            message.textContent = error.message;

            message.style.color = "#ef4444";

            console.error(
                "Maintenance order creation failed:",
                error
            );

        } finally {

            // Re-enable the button
            button.disabled = false;

        }

    });

}


// ==========================================
// UPDATE MAINTENANCE STATUS
// ==========================================

// Update a maintenance work order's status
async function updateMaintenanceStatus(
    orderId,
    nextStatus,
    button
) {

    // Find the status message element
    let message = document.getElementById(
        "maintenance-status-message"
    );

    // Create the element if it does not exist
    if (!message) {

        message = document.createElement("p");

        message.id = "maintenance-status-message";

        message.setAttribute("role", "status");

        document.getElementById(
            "maintenance-list"
        ).before(message);

    }

    // Disable the action button
    button.disabled = true;

    // Display progress message
    message.textContent = "Updating maintenance job...";

    message.style.color = "#94a3b8";

    try {

        // Send the new status to Spring Boot
        const response = await fetch(
            `/api/orders/${orderId}/status`,
            {

                method: "PATCH",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: nextStatus
                })

            }
        );

        // Handle invalid status changes
        if (response.status === 409) {

            throw new Error(
                "This maintenance status change is not allowed."
            );

        }

        // Handle other errors
        if (!response.ok) {

            throw new Error(
                `Unable to update work order (${response.status}).`
            );

        }

        // Read the updated work order
        const updatedOrder = await response.json();

        // Refresh tables, buttons and statistics
        await loadDashboard();

        // Display the saved status
        message.textContent =
            `Work Order #${updatedOrder.id} updated to ${updatedOrder.status}.`;

        message.style.color = "#22c55e";

    } catch (error) {

        // Display an error message
        message.textContent = error.message;

        message.style.color = "#ef4444";

        console.error(
            "Maintenance status update failed:",
            error
        );

    } finally {

        // Re-enable the action button
        button.disabled = false;

    }

}


// ==========================================
// START PRODUCTIONPULSE DASHBOARD
// ==========================================

// Activate the forms and load database records
function startProductionPulse() {

    // Confirm the JavaScript has loaded
    console.log(
        "ProductionPulse JavaScript loaded"
    );

    // Activate equipment registration
    setupEquipmentForm();

    // Activate equipment editing
    setupEquipmentEditForm();

    // Activate maintenance work order creation
    setupMaintenanceForm();

    // Activate equipment and maintenance filters
    setupDashboardFilters();

    // Load database information
    loadDashboard();

}


// Wait until the HTML is ready
if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        startProductionPulse
    );

} else {

    startProductionPulse();

}
