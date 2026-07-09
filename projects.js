// =====================================
// BUSINESSOS V11
// Projects Module
// Part 1
// Setup + Save Project
// =====================================

// Customers
let customers =
JSON.parse(localStorage.getItem("customers")) || [];

// Employees
let employees =
JSON.parse(localStorage.getItem("employees")) || [];

// Projects
let projects =
JSON.parse(localStorage.getItem("projects")) || [];

// Edit Mode
let editIndex = -1;

// =====================================
// Start
// =====================================

window.onload = function(){

    loadCustomers();

    loadEmployees();

    loadProjects();

};

// =====================================
// Load Customers
// =====================================

function loadCustomers(){

    const customer =
    document.getElementById("projectCustomer");

    if(!customer) return;

    customer.innerHTML =
    '<option value="">👤 Select Customer</option>';

    customers.forEach((item,index)=>{

        customer.innerHTML +=

        `<option value="${index}">

        ${item.name}

        </option>`;

    });

}

// =====================================
// Load Employees
// =====================================

function loadEmployees(){

    const employee =
    document.getElementById("projectEmployee");

    if(!employee) return;

    employee.innerHTML =
    '<option value="">👨‍💼 Assign Employee</option>';

    employees.forEach((item,index)=>{

        employee.innerHTML +=

        `<option value="${index}">

        ${item.name}

        </option>`;

    });

}

// =====================================
// Save Project
// =====================================

function saveProject(){

    const customerIndex =
    document.getElementById("projectCustomer").value;

    const employeeIndex =
    document.getElementById("projectEmployee").value;

    const project = {

        id:Date.now(),

        projectId:
        "PRJ-"+Date.now(),

        name:
        document.getElementById("projectName").value.trim(),

        customer:
        customerIndex===""

        ? ""

        : customers[customerIndex].name,

        employee:
        employeeIndex===""

        ? ""

        : employees[employeeIndex].name,

        product:
        document.getElementById("projectProduct").value.trim(),

        startDate:
        document.getElementById("startDate").value,

        dueDate:
        document.getElementById("dueDate").value,

        priority:
        document.getElementById("projectPriority").value,

        status:
        document.getElementById("projectStatus").value,

        budget:
        Number(
        document.getElementById("projectBudget").value || 0
        ),

        progress:
        Number(
        document.getElementById("projectProgress").value || 0
        ),

        notes:
        document.getElementById("projectNotes").value.trim()

    };

    if(project.name===""){

        showToast(
            "Enter Project Name",
            "warning"
        );

        return;

    }

    if(editIndex===-1){

        projects.push(project);

        showToast(
            "Project Added Successfully",
            "success"
        );

    }else{

        project.id =
        projects[editIndex].id;

        project.projectId =
        projects[editIndex].projectId;

        projects[editIndex] =
        project;

        editIndex = -1;

        showToast(
            "Project Updated Successfully",
            "success"
        );

    }

    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );

    document
    .getElementById("projectForm")
    .reset();

    loadProjects();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    document.querySelector(
        "#projectForm button[type='submit']"
    ).textContent =
    "💾 Save Project";

}
// =====================================
// BUSINESSOS V11
// Projects Module
// Part 2
// Project List + Search
// =====================================

// Load Projects
function loadProjects(){

    const list =
    document.getElementById("projectTable");

    if(!list) return;

    list.innerHTML = "";

    if(projects.length===0){

        list.innerHTML = `

<div class="list-card">

<h3>📋 No Project Found</h3>

<p>Add your first project.</p>

</div>

`;

        document.getElementById("totalProjects").textContent = "0";

        return;

    }

    let total = 0;

    projects.forEach((project,index)=>{

        total++;

        let priorityBadge = "";
        let statusBadge = "";

        switch(project.priority){

            case "High":
                priorityBadge =
                `<span class="danger-badge">🔴 High</span>`;
                break;

            case "Medium":
                priorityBadge =
                `<span class="warning-badge">🟡 Medium</span>`;
                break;

            default:
                priorityBadge =
                `<span class="success-badge">🟢 Low</span>`;

        }

        switch(project.status){

            case "Completed":
                statusBadge =
                `<span class="success-badge">✅ Completed</span>`;
                break;

            case "In Progress":
                statusBadge =
                `<span class="warning-badge">🚧 In Progress</span>`;
                break;

            case "Cancelled":
                statusBadge =
                `<span class="danger-badge">❌ Cancelled</span>`;
                break;

            default:
                statusBadge =
                `<span class="info-badge">📋 Pending</span>`;

        }

        list.innerHTML += `

<div class="list-card">

<h3>📋 ${project.name}</h3>

<div class="list-item">

<span class="list-label">

👤 Customer

</span>

<span class="list-value">

${project.customer || "-"}

</span>

</div>

<div class="list-item">

<span class="list-label">

👨‍💼 Staff

</span>

<span class="list-value">

${project.employee || "-"}

</span>

</div>

<div class="list-item">

<span class="list-label">

💰 Budget

</span>

<span class="list-value">

₹${Number(project.budget).toFixed(2)}

</span>

</div>

<div class="list-item">

<span class="list-label">

🚦 Priority

</span>

<span class="list-value">

${priorityBadge}

</span>

</div>

<div class="list-item">

<span class="list-label">

🎯 Status

</span>

<span class="list-value">

${statusBadge}

</span>

</div>

<div class="list-item">

<span class="list-label">

📈 Progress

</span>

<span class="list-value">

${project.progress}%

</span>

</div>

<progress
value="${project.progress}"
max="100"
style="width:100%;margin-top:8px;">

</progress>

<div class="card-actions">

<button
class="view-btn"
onclick="viewProject(${index})">

👁️ View

</button>

<button
class="edit-btn"
onclick="editProject(${index})">

✏️ Edit

</button>

<button
class="delete-btn"
onclick="deleteProject(${index})">

🗑️ Delete

</button>

</div>

</div>

`;

    });

    document.getElementById("totalProjects").textContent =
    total;

}

// =====================================
// Search Project
// =====================================

function searchProject(){

    const value =
    document
    .getElementById("searchProject")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#projectTable .list-card")
    .forEach(card=>{

        card.style.display =

        card.innerText
        .toLowerCase()
        .includes(value)

        ? ""

        : "none";

    });

}
// =====================================
// BUSINESSOS V11
// Projects Module
// Part 3
// View + Edit + Delete
// =====================================

// View Project
function viewProject(index){

    const project = projects[index];

    alert(

`📋 Project : ${project.name}

🆔 Project ID : ${project.projectId}

👤 Customer : ${project.customer || "-"}

👨‍💼 Staff : ${project.employee || "-"}

📦 Product : ${project.product || "-"}

📅 Start Date : ${project.startDate}

📅 Due Date : ${project.dueDate}

🚦 Priority : ${project.priority}

🎯 Status : ${project.status}

💰 Budget : ₹${Number(project.budget).toFixed(2)}

📈 Progress : ${project.progress}%

📝 Notes : ${project.notes || "-"}`

    );

}

// =====================================
// Edit Project
// =====================================

function editProject(index){

    const project = projects[index];

    document.getElementById("projectName").value =
    project.name;

    document.getElementById("projectProduct").value =
    project.product;

    document.getElementById("startDate").value =
    project.startDate;

    document.getElementById("dueDate").value =
    project.dueDate;

    document.getElementById("projectPriority").value =
    project.priority;

    document.getElementById("projectStatus").value =
    project.status;

    document.getElementById("projectBudget").value =
    project.budget;

    document.getElementById("projectProgress").value =
    project.progress;

    document.getElementById("projectNotes").value =
    project.notes;

    editIndex = index;

    document.querySelector("#projectForm button[type='submit']").textContent =
    "✏️ Update Project";

    showToast(
        "Edit Mode Enabled",
        "info"
    );

}

// =====================================
// Delete Project
// =====================================

function deleteProject(index){

    if(!confirm(
        "Delete this project?"
    )){

        return;

    }

    projects.splice(index,1);

    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );

    loadProjects();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    editIndex = -1;

    document.querySelector("#projectForm button[type='submit']").textContent =
    "💾 Save Project";

    showToast(
        "Project Deleted Successfully",
        "success"
    );

}

// =====================================
// Due Date Check
// =====================================

function checkDueProjects(){

    const today =
    new Date().toISOString().split("T")[0];

    projects.forEach(project=>{

        if(
            project.dueDate===today &&
            project.status!=="Completed"
        ){

            showToast(
                "Project Due Today: " + project.name,
                "warning"
            );

        }

    });

}
// =====================================
// BUSINESSOS V11
// Projects Module
// Part 4
// Refresh + Dashboard
// =====================================

// Refresh Projects
function refreshProjects(){

    projects =
    JSON.parse(localStorage.getItem("projects")) || [];

    loadProjects();

    checkDueProjects();

}

// =====================================
// Refresh Window Focus
// =====================================

window.addEventListener("focus",function(){

    refreshProjects();

});

// =====================================
// Refresh Storage Change
// =====================================

window.addEventListener("storage",function(){

    refreshProjects();

});

// =====================================
// Dashboard Refresh
// =====================================

function updateDashboard(){

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

}

// =====================================
// Project Form Submit
// =====================================

document
.getElementById("projectForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    saveProject();

    updateDashboard();

});

// =====================================
// Check Due Projects Every Minute
// =====================================

setInterval(function(){

    checkDueProjects();

},60000);

// =====================================
// Initial Refresh
// =====================================

refreshProjects();

console.log(
"BusinessOS Projects Module Loaded"
);