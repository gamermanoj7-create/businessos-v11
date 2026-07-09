// =====================================
// BUSINESSOS V11
// Salary Module
// Part 1
// Setup + Save Salary
// =====================================

// Employees
let employees =
JSON.parse(localStorage.getItem("employees")) || [];

// Salaries
let salaries =
JSON.parse(localStorage.getItem("salaries")) || [];

// Edit Mode
let editIndex = -1;

// =====================================
// Start
// =====================================

window.onload = function(){

    loadEmployees();

    loadSalaries();

};

// =====================================
// Load Employees
// =====================================

function loadEmployees(){

    const employee =
    document.getElementById("salaryEmployee");

    if(!employee) return;

    employee.innerHTML =
    '<option value="">👤 Select Employee</option>';

    employees.forEach((item,index)=>{

        employee.innerHTML +=
        `<option value="${index}">
        ${item.name}
        </option>`;

    });

}

// =====================================
// Employee Change
// =====================================

document
.getElementById("salaryEmployee")
.addEventListener("change",function(){

    const index = this.value;

    if(index===""){

        document.getElementById("salaryAmount").value="";

        return;

    }

    document.getElementById("salaryAmount").value =
    employees[index].salary || 0;

    calculateNetSalary();

});

// =====================================
// Auto Calculate
// =====================================

document
.getElementById("bonus")
.addEventListener("input",calculateNetSalary);

document
.getElementById("deduction")
.addEventListener("input",calculateNetSalary);

// =====================================
// Net Salary
// =====================================

function calculateNetSalary(){

    const salary =
    Number(document.getElementById("salaryAmount").value);

    const bonus =
    Number(document.getElementById("bonus").value || 0);

    const deduction =
    Number(document.getElementById("deduction").value || 0);

    document.getElementById("netSalary").value =

    (salary + bonus - deduction).toFixed(2);

}

// =====================================
// Save Salary
// =====================================

function saveSalary(){

    const employeeIndex =
    document.getElementById("salaryEmployee").value;

    if(employeeIndex===""){

        showToast(
            "Select Employee",
            "warning"
        );

        return;

    }

    const employee =
    employees[employeeIndex];

    const salary = {

        id:Date.now(),

        employee:
        employee.name,

        employeeIndex,

        month:
        document.getElementById("salaryMonth").value,

        basic:
        Number(
        document.getElementById("salaryAmount").value
        ),

        bonus:
        Number(
        document.getElementById("bonus").value || 0
        ),

        deduction:
        Number(
        document.getElementById("deduction").value || 0
        ),

        net:
        Number(
        document.getElementById("netSalary").value
        ),

        paymentMethod:
        document.getElementById("paymentMethod").value,

        status:
        document.getElementById("salaryStatus").value

    };

    if(editIndex===-1){

        salaries.push(salary);

        showToast(
            "Salary Saved Successfully",
            "success"
        );

    }else{

        salary.id =
        salaries[editIndex].id;

        salaries[editIndex] =
        salary;

        editIndex = -1;

        showToast(
            "Salary Updated Successfully",
            "success"
        );

    }

    localStorage.setItem(
        "salaries",
        JSON.stringify(salaries)
    );

    document
    .getElementById("salaryForm")
    .reset();

    loadSalaries();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    document.querySelector("#salaryForm button").textContent =
    "💾 Save Salary";

}
// =====================================
// BUSINESSOS V11
// Salary Module
// Part 2
// Salary List + Search
// =====================================

// Load Salaries
function loadSalaries(){

    const list =
    document.getElementById("salaryTable");

    if(!list) return;

    list.innerHTML = "";

    if(salaries.length===0){

        list.innerHTML = `

<div class="list-card">

<h3>💰 No Salary Record Found</h3>

<p>Add your first salary record.</p>

</div>

`;

        document.getElementById("totalSalaryRecords").textContent = "0";

        return;

    }

    let total = 0;

    salaries.forEach((item,index)=>{

        total++;

        const badge =

        item.status==="Paid"

        ?

        `<span class="success-badge">
        ✅ Paid
        </span>`

        :

        `<span class="danger-badge">
        ❌ Unpaid
        </span>`;

        list.innerHTML += `

<div class="list-card">

<h3>👤 ${item.employee}</h3>

<div class="list-item">

<span class="list-label">

📅 Month

</span>

<span class="list-value">

${item.month}

</span>

</div>

<div class="list-item">

<span class="list-label">

💰 Net Salary

</span>

<span class="list-value">

₹${item.net.toFixed(2)}

</span>

</div>

<div class="list-item">

<span class="list-label">

💳 Payment

</span>

<span class="list-value">

${item.paymentMethod}

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
onclick="viewSalary(${index})">

👁️ View

</button>

<button
class="edit-btn"
onclick="editSalary(${index})">

✏️ Edit

</button>

<button
class="delete-btn"
onclick="deleteSalary(${index})">

🗑️ Delete

</button>

</div>

</div>

`;

    });

    document.getElementById("totalSalaryRecords").textContent =
    total;

}

// =====================================
// Search Salary
// =====================================

function searchSalary(){

    const value =
    document
    .getElementById("searchSalary")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#salaryTable .list-card")
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
// Salary Module
// Part 3
// View + Edit + Delete
// =====================================

// View Salary
function viewSalary(index){

    const salary = salaries[index];

    alert(

`👤 Employee : ${salary.employee}

📅 Month : ${salary.month}

💰 Basic Salary : ₹${salary.basic.toFixed(2)}

🎁 Bonus : ₹${salary.bonus.toFixed(2)}

➖ Deduction : ₹${salary.deduction.toFixed(2)}

💵 Net Salary : ₹${salary.net.toFixed(2)}

💳 Payment : ${salary.paymentMethod}

📌 Status : ${salary.status}`

    );

}

// =====================================
// Edit Salary
// =====================================

function editSalary(index){

    const salary = salaries[index];

    document.getElementById("salaryEmployee").value =
    salary.employeeIndex;

    document.getElementById("salaryMonth").value =
    salary.month;

    document.getElementById("salaryAmount").value =
    salary.basic;

    document.getElementById("bonus").value =
    salary.bonus;

    document.getElementById("deduction").value =
    salary.deduction;

    document.getElementById("netSalary").value =
    salary.net;

    document.getElementById("paymentMethod").value =
    salary.paymentMethod;

    document.getElementById("salaryStatus").value =
    salary.status;

    editIndex = index;

    document.querySelector("#salaryForm button[type='submit']").textContent =
    "✏️ Update Salary";

    showToast(
        "Edit Mode Enabled",
        "info"
    );

}

// =====================================
// Delete Salary
// =====================================

function deleteSalary(index){

    if(!confirm(
        "Delete this salary record?"
    )){

        return;

    }

    salaries.splice(index,1);

    localStorage.setItem(
        "salaries",
        JSON.stringify(salaries)
    );

    loadSalaries();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    editIndex = -1;

    document.querySelector("#salaryForm button[type='submit']").textContent =
    "💾 Save Salary";

    showToast(
        "Salary Deleted Successfully",
        "success"
    );

}

// =====================================
// Salary Slip
// =====================================

function printSalarySlip(index){

    const salary = salaries[index];

    const slip =

`SALARY SLIP

Employee : ${salary.employee}

Month : ${salary.month}

----------------------------

Basic Salary : ₹${salary.basic.toFixed(2)}

Bonus : ₹${salary.bonus.toFixed(2)}

Deduction : ₹${salary.deduction.toFixed(2)}

----------------------------

Net Salary : ₹${salary.net.toFixed(2)}

Payment : ${salary.paymentMethod}

Status : ${salary.status}`;

    alert(slip);

}
// =====================================
// BUSINESSOS V11
// Salary Module
// Part 4
// Refresh + Dashboard
// =====================================

// Refresh Salaries
function refreshSalaries(){

    salaries =
    JSON.parse(localStorage.getItem("salaries")) || [];

    loadSalaries();

}

// =====================================
// Refresh Window Focus
// =====================================

window.addEventListener("focus",function(){

    refreshSalaries();

});

// =====================================
// Refresh Storage Change
// =====================================

window.addEventListener("storage",function(){

    refreshSalaries();

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
// Salary Form Submit
// =====================================

document
.getElementById("salaryForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    saveSalary();

    updateDashboard();

});

// =====================================
// Initial Refresh
// =====================================

refreshSalaries();

console.log(
"BusinessOS Salary Module Loaded"
);