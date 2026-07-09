// =====================================
// BUSINESSOS V11
// Staff Module
// Part 1
// Setup + Save Employee
// =====================================

// Employees
let employees =
JSON.parse(localStorage.getItem("employees")) || [];

// Edit Mode
let editIndex = -1;

// =====================================
// Start
// =====================================

window.onload = function(){

    loadEmployees();

};

// =====================================
// Save Employee
// =====================================

function saveEmployee(){

    const employee = {

        id: Date.now(),

        name:
        document.getElementById("employeeName").value.trim(),

        phone:
        document.getElementById("employeePhone").value.trim(),

        email:
        document.getElementById("employeeEmail").value.trim(),

        designation:
        document.getElementById("employeeDesignation").value.trim(),

        salary:
        Number(
        document.getElementById("employeeSalary").value || 0
        ),

        joiningDate:
        document.getElementById("joiningDate").value,

        status:
        document.getElementById("employeeStatus").value

    };

    if(employee.name===""){

        showToast(
            "Enter Employee Name",
            "warning"
        );

        return;

    }

    if(employee.phone===""){

        showToast(
            "Enter Phone Number",
            "warning"
        );

        return;

    }

    if(employee.designation===""){

        showToast(
            "Enter Designation",
            "warning"
        );

        return;

    }

    if(editIndex===-1){

        employees.push(employee);

        showToast(
            "Employee Added Successfully",
            "success"
        );

    }else{

        employee.id =
        employees[editIndex].id;

        employees[editIndex] =
        employee;

        editIndex = -1;

        showToast(
            "Employee Updated Successfully",
            "success"
        );

    }

    localStorage.setItem(
        "employees",
        JSON.stringify(employees)
    );

    document
    .getElementById("employeeForm")
    .reset();

    loadEmployees();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    document.querySelector("#employeeForm button").textContent =
    "💾 Save Employee";

}
// =====================================
// BUSINESSOS V11
// Staff Module
// Part 2
// Employee List + Search
// =====================================

// Load Employees
function loadEmployees(){

    const list =
    document.getElementById("employeeTable");

    if(!list) return;

    list.innerHTML = "";

    if(employees.length===0){

        list.innerHTML = `

<div class="list-card">

<h3>👨‍💼 No Employee Found</h3>

<p>Add your first employee.</p>

</div>

`;

        return;

    }

    let totalEmployees = 0;

    employees.forEach((employee,index)=>{

        totalEmployees++;

        const badge =

        employee.status==="Active"

        ?

        `<span class="success-badge">
        🟢 Active
        </span>`

        :

        `<span class="danger-badge">
        🔴 Inactive
        </span>`;

        list.innerHTML += `

<div class="list-card">

<h3>👨‍💼 ${employee.name}</h3>

<div class="list-item">

<span class="list-label">

📞 Phone

</span>

<span class="list-value">

${employee.phone}

</span>

</div>

<div class="list-item">

<span class="list-label">

📧 Email

</span>

<span class="list-value">

${employee.email || "-"}

</span>

</div>

<div class="list-item">

<span class="list-label">

💼 Designation

</span>

<span class="list-value">

${employee.designation}

</span>

</div>

<div class="list-item">

<span class="list-label">

💰 Salary

</span>

<span class="list-value">

₹${employee.salary.toFixed(2)}

</span>

</div>

<div class="list-item">

<span class="list-label">

📅 Joining

</span>

<span class="list-value">

${employee.joiningDate || "-"}

</span>

</div>

<div class="list-item">

<span class="list-label">

Status

</span>

<span class="list-value">

${badge}

</span>

</div>

<div class="card-actions">

<button
class="view-btn"
onclick="viewEmployee(${index})">

👁️ View

</button>

<button
class="edit-btn"
onclick="editEmployee(${index})">

✏️ Edit

</button>

<button
class="delete-btn"
onclick="deleteEmployee(${index})">

🗑️ Delete

</button>

</div>

</div>

`;

    });

    const total =
    document.getElementById("totalEmployees");

    if(total){

        total.textContent =
        totalEmployees;

    }

}

// =====================================
// Search Employee
// =====================================

function searchEmployee(){

    const value =
    document
    .getElementById("searchEmployee")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#employeeTable .list-card")
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
// Staff Module
// Part 3
// View + Edit + Delete
// =====================================

// View Employee
function viewEmployee(index){

    const employee = employees[index];

    alert(

`👨‍💼 Employee : ${employee.name}

📞 Phone : ${employee.phone}

📧 Email : ${employee.email || "-"}

💼 Designation : ${employee.designation}

💰 Salary : ₹${employee.salary}

📅 Joining Date : ${employee.joiningDate || "-"}

🟢 Status : ${employee.status}`

    );

}

// =====================================
// Edit Employee
// =====================================

function editEmployee(index){

    const employee = employees[index];

    document.getElementById("employeeName").value =
    employee.name;

    document.getElementById("employeePhone").value =
    employee.phone;

    document.getElementById("employeeEmail").value =
    employee.email;

    document.getElementById("employeeDesignation").value =
    employee.designation;

    document.getElementById("employeeSalary").value =
    employee.salary;

    document.getElementById("joiningDate").value =
    employee.joiningDate;

    document.getElementById("employeeStatus").value =
    employee.status;

    editIndex = index;

    document.querySelector("#employeeForm button").textContent =
    "✏️ Update Employee";

    showToast(
        "Edit Mode Enabled",
        "info"
    );

}

// =====================================
// Delete Employee
// =====================================

function deleteEmployee(index){

    if(!confirm(
        "Delete this Employee?"
    )){

        return;

    }

    employees.splice(index,1);

    localStorage.setItem(
        "employees",
        JSON.stringify(employees)
    );

    loadEmployees();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    editIndex = -1;

    document.querySelector("#employeeForm button").textContent =
    "💾 Save Employee";

    showToast(
        "Employee Deleted Successfully",
        "success"
    );

}
// =====================================
// BUSINESSOS V11
// Staff Module
// Part 4
// Refresh + Dashboard
// =====================================

// Refresh Employees
function refreshEmployees(){

    employees =
    JSON.parse(localStorage.getItem("employees")) || [];

    loadEmployees();

}

// =====================================
// Refresh Window Focus
// =====================================

window.addEventListener("focus",function(){

    refreshEmployees();

});

// =====================================
// Refresh Storage Change
// =====================================

window.addEventListener("storage",function(){

    refreshEmployees();

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
// Employee Form Submit
// =====================================

document
.getElementById("employeeForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    saveEmployee();

    updateDashboard();

});

// =====================================
// Initial Refresh
// =====================================

refreshEmployees();

console.log(
"BusinessOS Staff Module Loaded"
);