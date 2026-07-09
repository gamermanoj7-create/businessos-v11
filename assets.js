// =====================================
// BUSINESSOS V11
// Assets Module
// Part 1
// Setup + Save Asset
// =====================================

// Employees
let employees =
JSON.parse(localStorage.getItem("employees")) || [];

// Assets
let assets =
JSON.parse(localStorage.getItem("assets")) || [];

// Edit Mode
let editIndex = -1;

// =====================================
// Start
// =====================================

window.onload = function(){

    loadEmployees();

    loadAssets();

};

// =====================================
// Load Employees
// =====================================

function loadEmployees(){

    const employee =
    document.getElementById("assetEmployee");

    if(!employee) return;

    employee.innerHTML =
    '<option value="">👤 Assign Employee</option>';

    employees.forEach((item,index)=>{

        employee.innerHTML +=
        `<option value="${index}">
        ${item.name}
        </option>`;

    });

}

// =====================================
// Save Asset
// =====================================

function saveAsset(){

    const employeeIndex =
    document.getElementById("assetEmployee").value;

    const asset = {

        id:Date.now(),

        assetId:
        "AST-"+Date.now(),

        name:
        document.getElementById("assetName").value.trim(),

        category:
        document.getElementById("assetCategory").value,

        purchaseDate:
        document.getElementById("purchaseDate").value,

        purchasePrice:
        Number(
        document.getElementById("purchasePrice").value || 0
        ),

        location:
        document.getElementById("assetLocation").value.trim(),

        employee:
        employeeIndex===""
        ? ""
        : employees[employeeIndex].name,

        employeeIndex,

        condition:
        document.getElementById("assetCondition").value,

        status:
        document.getElementById("assetStatus").value

    };

    if(asset.name===""){

        showToast(
            "Enter Asset Name",
            "warning"
        );

        return;

    }

    if(editIndex===-1){

        assets.push(asset);

        showToast(
            "Asset Added Successfully",
            "success"
        );

    }else{

        asset.id =
        assets[editIndex].id;

        asset.assetId =
        assets[editIndex].assetId;

        assets[editIndex] =
        asset;

        editIndex = -1;

        showToast(
            "Asset Updated Successfully",
            "success"
        );

    }

    localStorage.setItem(
        "assets",
        JSON.stringify(assets)
    );

    document
    .getElementById("assetForm")
    .reset();

    loadAssets();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    document.querySelector("#assetForm button").textContent =
    "💾 Save Asset";

}
// =====================================
// BUSINESSOS V11
// Assets Module
// Part 2
// Asset List + Search
// =====================================

// Load Assets
function loadAssets(){

    const list =
    document.getElementById("assetTable");

    if(!list) return;

    list.innerHTML = "";

    if(assets.length===0){

        list.innerHTML = `

<div class="list-card">

<h3>📦 No Asset Found</h3>

<p>Add your first asset.</p>

</div>

`;

        document.getElementById("totalAssets").textContent="0";

        document.getElementById("totalAssetValue").textContent="₹0.00";

        return;

    }

    let totalAssets = 0;
    let totalValue = 0;

    assets.forEach((asset,index)=>{

        totalAssets++;

        totalValue += Number(asset.purchasePrice || 0);

        const statusBadge =

        asset.status==="Active"

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

<h3>📦 ${asset.name}</h3>

<div class="list-item">

<span class="list-label">

🆔 Asset ID

</span>

<span class="list-value">

${asset.assetId}

</span>

</div>

<div class="list-item">

<span class="list-label">

📂 Category

</span>

<span class="list-value">

${asset.category}

</span>

</div>

<div class="list-item">

<span class="list-label">

💰 Value

</span>

<span class="list-value">

₹${Number(asset.purchasePrice).toFixed(2)}

</span>

</div>

<div class="list-item">

<span class="list-label">

👤 Employee

</span>

<span class="list-value">

${asset.employee || "-"}

</span>

</div>

<div class="list-item">

<span class="list-label">

📌 Status

</span>

<span class="list-value">

${statusBadge}

</span>

</div>

<div class="card-actions">

<button
class="view-btn"
onclick="viewAsset(${index})">

👁️ View

</button>

<button
class="edit-btn"
onclick="editAsset(${index})">

✏️ Edit

</button>

<button
class="delete-btn"
onclick="deleteAsset(${index})">

🗑️ Delete

</button>

</div>

</div>

`;

    });

    document.getElementById("totalAssets").textContent =
    totalAssets;

    document.getElementById("totalAssetValue").textContent =
    "₹" + totalValue.toFixed(2);

}

// =====================================
// Search Asset
// =====================================

function searchAsset(){

    const value =
    document
    .getElementById("searchAsset")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#assetTable .list-card")
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
// Assets Module
// Part 3
// View + Edit + Delete
// =====================================

// View Asset
function viewAsset(index){

    const asset = assets[index];

    alert(

`📦 Asset : ${asset.name}

🆔 Asset ID : ${asset.assetId}

📂 Category : ${asset.category}

📅 Purchase Date : ${asset.purchaseDate}

💰 Purchase Price : ₹${Number(asset.purchasePrice).toFixed(2)}

📍 Location : ${asset.location || "-"}

👤 Assigned Employee : ${asset.employee || "-"}

🔧 Condition : ${asset.condition}

📌 Status : ${asset.status}`

    );

}

// =====================================
// Edit Asset
// =====================================

function editAsset(index){

    const asset = assets[index];

    document.getElementById("assetName").value =
    asset.name;

    document.getElementById("assetCategory").value =
    asset.category;

    document.getElementById("purchaseDate").value =
    asset.purchaseDate;

    document.getElementById("purchasePrice").value =
    asset.purchasePrice;

    document.getElementById("assetLocation").value =
    asset.location;

    document.getElementById("assetEmployee").value =
    asset.employeeIndex;

    document.getElementById("assetCondition").value =
    asset.condition;

    document.getElementById("assetStatus").value =
    asset.status;

    editIndex = index;

    document.querySelector("#assetForm button[type='submit']").textContent =
    "✏️ Update Asset";

    showToast(
        "Edit Mode Enabled",
        "info"
    );

}

// =====================================
// Delete Asset
// =====================================

function deleteAsset(index){

    if(!confirm(
        "Delete this asset?"
    )){

        return;

    }

    assets.splice(index,1);

    localStorage.setItem(
        "assets",
        JSON.stringify(assets)
    );

    loadAssets();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    editIndex = -1;

    document.querySelector("#assetForm button[type='submit']").textContent =
    "💾 Save Asset";

    showToast(
        "Asset Deleted Successfully",
        "success"
    );

}
// =====================================
// BUSINESSOS V11
// Assets Module
// Part 4
// Refresh + Dashboard
// =====================================

// Refresh Assets
function refreshAssets(){

    assets =
    JSON.parse(localStorage.getItem("assets")) || [];

    loadAssets();

}

// =====================================
// Refresh Window Focus
// =====================================

window.addEventListener("focus",function(){

    refreshAssets();

});

// =====================================
// Refresh Storage Change
// =====================================

window.addEventListener("storage",function(){

    refreshAssets();

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
// Asset Form Submit
// =====================================

document
.getElementById("assetForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    saveAsset();

    updateDashboard();

});

// =====================================
// Initial Refresh
// =====================================

refreshAssets();

console.log(
"BusinessOS Assets Module Loaded"
);