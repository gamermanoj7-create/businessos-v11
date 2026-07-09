// =====================================
// BUSINESSOS V11
// GRN Module
// Part 1
// Setup + Save GRN
// =====================================

// Purchase Orders
let purchaseOrders =
JSON.parse(localStorage.getItem("purchaseOrders")) || [];

// GRN Records
let grnRecords =
JSON.parse(localStorage.getItem("grnRecords")) || [];

// Edit Mode
let editIndex = -1;

// =====================================
// Start
// =====================================

window.onload = function(){

    loadPurchaseOrders();

    loadGRN();

};

// =====================================
// Load Purchase Orders
// =====================================

function loadPurchaseOrders(){

    const po =
    document.getElementById("grnPurchaseOrder");

    if(!po) return;

    po.innerHTML =
    '<option value="">📦 Select Purchase Order</option>';

    purchaseOrders.forEach((order,index)=>{

        po.innerHTML +=
        `<option value="${index}">
        ${order.poNumber} - ${order.product}
        </option>`;

    });

}

// =====================================
// Save GRN
// =====================================

function saveGRN(){

    const poIndex =
    document.getElementById("grnPurchaseOrder").value;

    if(poIndex===""){

        showToast(
            "Select Purchase Order",
            "warning"
        );

        return;

    }

    const order =
    purchaseOrders[poIndex];

    const grn = {

        id:Date.now(),

        grnNumber:
        "GRN-"+Date.now(),

        poNumber:
        order.poNumber,

        supplier:
        order.supplier,

        product:
        order.product,

        orderedQty:
        order.quantity,

        receivedQty:
        Number(
        document.getElementById("receivedQty").value || 0
        ),

        damagedQty:
        Number(
        document.getElementById("damagedQty").value || 0
        ),

        date:
        document.getElementById("grnDate").value,

        remarks:
        document.getElementById("grnRemarks").value.trim(),

        status:
        document.getElementById("grnStatus").value

    };

    if(grn.receivedQty<=0){

        showToast(
            "Enter Received Quantity",
            "warning"
        );

        return;

    }

    if(editIndex===-1){

        grnRecords.push(grn);

        showToast(
            "GRN Saved Successfully",
            "success"
        );

    }else{

        grn.id =
        grnRecords[editIndex].id;

        grn.grnNumber =
        grnRecords[editIndex].grnNumber;

        grnRecords[editIndex] =
        grn;

        editIndex = -1;

        showToast(
            "GRN Updated Successfully",
            "success"
        );

    }

    localStorage.setItem(
        "grnRecords",
        JSON.stringify(grnRecords)
    );

    document
    .getElementById("grnForm")
    .reset();

    loadGRN();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    document.querySelector(
    "#grnForm button[type='submit']"
    ).textContent =
    "💾 Save GRN";

}
// =====================================
// BUSINESSOS V11
// GRN Module
// Part 2
// GRN List + Search
// =====================================

// Load GRN
function loadGRN(){

    const list =
    document.getElementById("grnTable");

    if(!list) return;

    list.innerHTML = "";

    if(grnRecords.length===0){

        list.innerHTML = `

<div class="list-card">

<h3>📥 No GRN Found</h3>

<p>Create your first GRN.</p>

</div>

`;

        document.getElementById("totalGRN").textContent =
        "0";

        return;

    }

    let total = 0;

    grnRecords.forEach((grn,index)=>{

        total++;

        let badge = "";

        switch(grn.status){

            case "Pending":

                badge =
                `<span class="warning-badge">
                🟡 Pending
                </span>`;
                break;

            case "Partial":

                badge =
                `<span class="primary-badge">
                📦 Partial
                </span>`;
                break;

            case "Completed":

                badge =
                `<span class="success-badge">
                ✅ Completed
                </span>`;
                break;

            default:

                badge =
                `<span>${grn.status}</span>`;

        }

        list.innerHTML += `

<div class="list-card">

<h3>📥 ${grn.grnNumber}</h3>

<div class="list-item">

<span class="list-label">

📄 PO No

</span>

<span class="list-value">

${grn.poNumber}

</span>

</div>

<div class="list-item">

<span class="list-label">

🏢 Supplier

</span>

<span class="list-value">

${grn.supplier}

</span>

</div>

<div class="list-item">

<span class="list-label">

📦 Product

</span>

<span class="list-value">

${grn.product}

</span>

</div>

<div class="list-item">

<span class="list-label">

✅ Received

</span>

<span class="list-value">

${grn.receivedQty}

</span>

</div>

<div class="list-item">

<span class="list-label">

❌ Damaged

</span>

<span class="list-value">

${grn.damagedQty}

</span>

</div>

<div class="list-item">

<span class="list-label">

📌 Status

</span>

<span class="list-value">

${badge}

</span>

</div>

<div class="card-actions">

<button
class="view-btn"
onclick="viewGRN(${index})">

👁️ View

</button>

<button
class="edit-btn"
onclick="editGRN(${index})">

✏️ Edit

</button>

<button
class="delete-btn"
onclick="deleteGRN(${index})">

🗑️ Delete

</button>

<button
class="primary-btn"
onclick="printGRN(${index})">

🖨️ Print

</button>

</div>

</div>

`;

    });

    document.getElementById("totalGRN").textContent =
    total;

}

// =====================================
// Search GRN
// =====================================

function searchGRN(){

    const value =
    document
    .getElementById("searchGRN")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#grnTable .list-card")
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
// GRN Module
// Part 3
// View + Edit + Delete
// =====================================

// View GRN
function viewGRN(index){

    const grn = grnRecords[index];

    alert(

`📥 Goods Receipt Note

GRN No : ${grn.grnNumber}

PO No : ${grn.poNumber}

🏢 Supplier : ${grn.supplier}

📦 Product : ${grn.product}

📦 Ordered Qty : ${grn.orderedQty}

✅ Received Qty : ${grn.receivedQty}

❌ Damaged Qty : ${grn.damagedQty}

📅 GRN Date : ${grn.date}

📌 Status : ${grn.status}

📝 Remarks :

${grn.remarks || "-"}`

    );

}

// =====================================
// Edit GRN
// =====================================

function editGRN(index){

    const grn = grnRecords[index];

    const po =
    purchaseOrders.findIndex(item=>
        item.poNumber===grn.poNumber
    );

    document.getElementById("grnPurchaseOrder").value =
    po;

    document.getElementById("receivedQty").value =
    grn.receivedQty;

    document.getElementById("damagedQty").value =
    grn.damagedQty;

    document.getElementById("grnDate").value =
    grn.date;

    document.getElementById("grnRemarks").value =
    grn.remarks;

    document.getElementById("grnStatus").value =
    grn.status;

    editIndex = index;

    document.querySelector(
    "#grnForm button[type='submit']"
    ).textContent =
    "✏️ Update GRN";

    showToast(
        "Edit Mode Enabled",
        "info"
    );

}

// =====================================
// Delete GRN
// =====================================

function deleteGRN(index){

    if(!confirm(
        "Delete this GRN?"
    )){

        return;

    }

    grnRecords.splice(index,1);

    localStorage.setItem(
        "grnRecords",
        JSON.stringify(grnRecords)
    );

    loadGRN();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    editIndex = -1;

    document.querySelector(
    "#grnForm button[type='submit']"
    ).textContent =
    "💾 Save GRN";

    showToast(
        "GRN Deleted Successfully",
        "success"
    );

}

// =====================================
// Print GRN
// =====================================

function printGRN(index){

    const grn = grnRecords[index];

    const printData =

`******** GOODS RECEIPT NOTE ********

GRN No : ${grn.grnNumber}

PO No : ${grn.poNumber}

Supplier : ${grn.supplier}

--------------------------------

Product : ${grn.product}

Ordered Qty : ${grn.orderedQty}

Received Qty : ${grn.receivedQty}

Damaged Qty : ${grn.damagedQty}

--------------------------------

Date : ${grn.date}

Status : ${grn.status}

Remarks :

${grn.remarks || "-"}

***********************************`;

    alert(printData);

}

// =====================================
// Update Inventory
// =====================================

function updateInventoryFromGRN(index){

    const inventory =
    JSON.parse(localStorage.getItem("inventory")) || [];

    const grn =
    grnRecords[index];

    inventory.push({

        id:Date.now(),

        product:grn.product,

        quantity:grn.receivedQty,

        source:grn.grnNumber,

        date:grn.date

    });

    localStorage.setItem(
        "inventory",
        JSON.stringify(inventory)
    );

    showToast(
        "Inventory Updated Successfully",
        "success"
    );

}
// =====================================
// BUSINESSOS V11
// GRN Module
// Part 4
// Refresh + Dashboard
// =====================================

// Refresh GRN
function refreshGRN(){

    grnRecords =
    JSON.parse(localStorage.getItem("grnRecords")) || [];

    loadGRN();

}

// =====================================
// Refresh Window Focus
// =====================================

window.addEventListener("focus",function(){

    refreshGRN();

});

// =====================================
// Refresh Storage Change
// =====================================

window.addEventListener("storage",function(){

    refreshGRN();

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
// GRN Form Submit
// =====================================

document
.getElementById("grnForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    saveGRN();

    updateDashboard();

});

// =====================================
// Set Today's Date
// =====================================

const grnDate =
document.getElementById("grnDate");

if(grnDate){

    grnDate.value =
    new Date().toISOString().split("T")[0];

}

// =====================================
// Initial Refresh
// =====================================

refreshGRN();

console.log(
"BusinessOS GRN Module Loaded"
);