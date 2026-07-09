// =====================================
// BUSINESSOS V11
// Attendance Module
// Part 1
// Setup + Save Attendance
// =====================================

// Employees
let employees =
JSON.parse(localStorage.getItem("employees")) || [];

// Attendance
let attendance =
JSON.parse(localStorage.getItem("attendance")) || [];

// Edit Mode
let editIndex = -1;

// =====================================
// Start
// =====================================

window.onload = function(){

    loadEmployees();

    loadAttendance();

};

// =====================================
// Load Employees
// =====================================

function loadEmployees(){

    const employee =
    document.getElementById("attendanceEmployee");

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
// Save Attendance
// =====================================

function saveAttendance(){

    const employeeIndex =
    document.getElementById("attendanceEmployee").value;

    if(employeeIndex===""){

        showToast(
            "Select Employee",
            "warning"
        );

        return;

    }

    const employee =
    employees[employeeIndex];

    const record = {

        id: Date.now(),

        employee:
        employee.name,

        employeeIndex,

        date:
        document.getElementById("attendanceDate").value,

        status:
        document.getElementById("attendanceStatus").value,

        checkIn:
        document.getElementById("checkIn").value,

        checkOut:
        document.getElementById("checkOut").value,

        notes:
        document.getElementById("attendanceNotes").value.trim()

    };

    if(editIndex===-1){

        attendance.push(record);

        showToast(
            "Attendance Saved",
            "success"
        );

    }else{

        record.id =
        attendance[editIndex].id;

        attendance[editIndex] =
        record;

        editIndex = -1;

        showToast(
            "Attendance Updated",
            "success"
        );

    }

    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );

    document
    .getElementById("attendanceForm")
    .reset();

    document.getElementById("attendanceDate").value =
    new Date().toISOString().split("T")[0];

    loadAttendance();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    document.querySelector("#attendanceForm button").textContent =
    "💾 Save Attendance";

}
// =====================================
// BUSINESSOS V11
// Attendance Module
// Part 2
// Attendance List + Search
// =====================================

// Load Attendance
function loadAttendance(){

    const list =
    document.getElementById("attendanceTable");

    if(!list) return;

    list.innerHTML = "";

    if(attendance.length===0){

        list.innerHTML = `

<div class="list-card">

<h3>📅 No Attendance Found</h3>

<p>Add your first attendance record.</p>

</div>

`;

        document.getElementById("totalAttendance").textContent = "0";

        return;

    }

    let total = 0;

    attendance.forEach((item,index)=>{

        total++;

        let badge = "";

        if(item.status==="Present"){

            badge =
            `<span class="success-badge">
            🟢 Present
            </span>`;

        }else if(item.status==="Absent"){

            badge =
            `<span class="danger-badge">
            🔴 Absent
            </span>`;

        }else if(item.status==="Half Day"){

            badge =
            `<span class="warning-badge">
            🟡 Half Day
            </span>`;

        }else{

            badge =
            `<span class="info-badge">
            🌴 Leave
            </span>`;

        }

        list.innerHTML += `

<div class="list-card">

<h3>👤 ${item.employee}</h3>

<div class="list-item">

<span class="list-label">

📅 Date

</span>

<span class="list-value">

${item.date}

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

<div class="list-item">

<span class="list-label">

⏰ Check In

</span>

<span class="list-value">

${item.checkIn || "-"}

</span>

</div>

<div class="list-item">

<span class="list-label">

⏱️ Check Out

</span>

<span class="list-value">

${item.checkOut || "-"}

</span>

</div>

<div class="card-actions">

<button
class="view-btn"
onclick="viewAttendance(${index})">

👁️ View

</button>

<button
class="edit-btn"
onclick="editAttendance(${index})">

✏️ Edit

</button>

<button
class="delete-btn"
onclick="deleteAttendance(${index})">

🗑️ Delete

</button>

</div>

</div>

`;

    });

    document.getElementById("totalAttendance").textContent =
    total;

}

// =====================================
// Search Attendance
// =====================================

function searchAttendance(){

    const value =
    document
    .getElementById("searchAttendance")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#attendanceTable .list-card")
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
// Attendance Module
// Part 3
// View + Edit + Delete
// =====================================

// View Attendance
function viewAttendance(index){

    const item = attendance[index];

    alert(

`👤 Employee : ${item.employee}

📅 Date : ${item.date}

📌 Status : ${item.status}

⏰ Check In : ${item.checkIn || "-"}

⏱️ Check Out : ${item.checkOut || "-"}

📝 Notes : ${item.notes || "-"}`

    );

}

// =====================================
// Edit Attendance
// =====================================

function editAttendance(index){

    const item = attendance[index];

    document.getElementById("attendanceEmployee").value =
    item.employeeIndex;

    document.getElementById("attendanceDate").value =
    item.date;

    document.getElementById("attendanceStatus").value =
    item.status;

    document.getElementById("checkIn").value =
    item.checkIn;

    document.getElementById("checkOut").value =
    item.checkOut;

    document.getElementById("attendanceNotes").value =
    item.notes;

    editIndex = index;

    document.querySelector("#attendanceForm button[type='submit']").textContent =
    "✏️ Update Attendance";

    showToast(
        "Edit Mode Enabled",
        "info"
    );

}

// =====================================
// Delete Attendance
// =====================================

function deleteAttendance(index){

    if(!confirm(
        "Delete this attendance record?"
    )){

        return;

    }

    attendance.splice(index,1);

    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );

    loadAttendance();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    editIndex = -1;

    document.querySelector("#attendanceForm button[type='submit']").textContent =
    "💾 Save Attendance";

    showToast(
        "Attendance Deleted Successfully",
        "success"
    );

}
// =====================================
// BUSINESSOS V11
// Attendance Module
// Part 4
// Refresh + Dashboard
// =====================================

// Refresh Attendance
function refreshAttendance(){

    attendance =
    JSON.parse(localStorage.getItem("attendance")) || [];

    loadAttendance();

}

// =====================================
// Refresh Window Focus
// =====================================

window.addEventListener("focus",function(){

    refreshAttendance();

});

// =====================================
// Refresh Storage Change
// =====================================

window.addEventListener("storage",function(){

    refreshAttendance();

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
// Attendance Form Submit
// =====================================

document
.getElementById("attendanceForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    saveAttendance();

    updateDashboard();

});

// =====================================
// Set Today's Date
// =====================================

const attendanceDate =
document.getElementById("attendanceDate");

if(attendanceDate){

    attendanceDate.value =
    new Date().toISOString().split("T")[0];

}

// =====================================
// Initial Refresh
// =====================================

refreshAttendance();

console.log(
"BusinessOS Attendance Module Loaded"
);