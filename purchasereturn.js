// =====================================
// BUSINESSOS V11
// Purchase Return Module
// Part 1
// Setup + Save Purchase Return
// =====================================

// GRN Records
let grnRecords =
JSON.parse(localStorage.getItem("grnRecords")) || [];

// Purchase Returns
let purchaseReturns =
JSON.parse(localStorage.getItem("purchaseReturns")) || [];

// Edit Mode
let editIndex = -1;

// =====================================
// Start
// =====================================

window.onload = function(){

    loadGRNRecords();

    loadPurchaseReturns();

};

// =====================================
// Load GRN
// =====================================

function loadGRNRecords(){

    const select =
    document.getElementById("prGRN");

    if(!select) return;

    select.innerHTML =
    '<option value="">📥 Select GRN</option>';

    grnRecords.forEach((grn,index)=>{

        select.innerHTML +=

        `<option value="${index}">
        ${grn.grnNumber} - ${grn.product}
        </option>`;

    });

}

// =====================================
// Save Purchase Return
// =====================================

function savePurchaseReturn(){

    const grnIndex =
    document.getElementById("prGRN").value;

    if(grnIndex===""){

        showToast(
            "Select GRN",
            "warning"
        );

        return;

    }

    const grn =
    grnRecords[grnIndex];

    const purchaseReturn={

        id:Date.now(),

        returnNumber:
        "PR-"+Date.now(),

        grnNumber:
        grn.grnNumber,

        supplier:
        grn.supplier,

        product:
        grn.product,

        quantity:
        Number(
        document.getElementById("prQuantity").value || 0
        ),

        reason:
        document.getElementById("prReason").value.trim(),

        date:
        document.getElementById("prDate").value,

        status:
        document.getElementById("prStatus").value,

        notes:
        document.getElementById("prNotes").value.trim()

    };

    if(purchaseReturn.quantity<=0){

        showToast(
            "Enter Return Quantity",
            "warning"
        );

        return;

    }

    if(editIndex===-1){

        purchaseReturns.push(
            purchaseReturn
        );

        showToast(
            "Purchase Return Saved",
            "success"
        );

    }else{

        purchaseReturn.id =
        purchaseReturns[editIndex].id;

        purchaseReturn.returnNumber =
        purchaseReturns[editIndex].returnNumber;

        purchaseReturns[editIndex] =
        purchaseReturn;

        editIndex = -1;

        showToast(
            "Purchase Return Updated",
            "success"
        );

    }

    localStorage.setItem(
        "purchaseReturns",
        JSON.stringify(purchaseReturns)
    );

    document
    .getElementById("purchaseReturnForm")
    .reset();

    loadPurchaseReturns();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    document.querySelector(
    "#purchaseReturnForm button[type='submit']"
    ).textContent =
    "💾 Save Purchase Return";

}
// =====================================
// BUSINESSOS V11
// Purchase Return Module
// Part 2
// Return List + Search
// =====================================

// Load Purchase Returns
function loadPurchaseReturns(){

    const list =
    document.getElementById("purchaseReturnTable");

    if(!list) return;

    list.innerHTML = "";

    if(purchaseReturns.length===0){

        list.innerHTML = `

<div class="list-card">

<h3>📤 No Purchase Return Found</h3>

<p>Create your first Purchase Return.</p>

</div>

`;

        document.getElementById(
        "totalPurchaseReturns"
        ).textContent = "0";

        return;

    }

    let total = 0;

    purchaseReturns.forEach((item,index)=>{

        total++;

        let badge = "";

        switch(item.status){

            case "Pending":

                badge =
                `<span class="warning-badge">
                🟡 Pending
                </span>`;
                break;

            case "Approved":

                badge =
                `<span class="primary-badge">
                📋 Approved
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
                `<span>${item.status}</span>`;

        }

        list.innerHTML += `

<div class="list-card">

<h3>📤 ${item.returnNumber}</h3>

<div class="list-item">

<span class="list-label">

📥 GRN

</span>

<span class="list-value">

${item.grnNumber}

</span>

</div>

<div class="list-item">

<span class="list-label">

🏢 Supplier

</span>

<span class="list-value">

${item.supplier}

</span>

</div>

<div class="list-item">

<span class="list-label">

📦 Product

</span>

<span class="list-value">

${item.product}

</span>

</div>

<div class="list-item">

<span class="list-label">

🔢 Quantity

</span>

<span class="list-value">

${item.quantity}

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
onclick="viewPurchaseReturn(${index})">

👁️ View

</button>

<button
class="edit-btn"
onclick="editPurchaseReturn(${index})">

✏️ Edit

</button>

<button
class="delete-btn"
onclick="deletePurchaseReturn(${index})">

🗑️ Delete

</button>

<button
class="primary-btn"
onclick="printPurchaseReturn(${index})">

🖨️ Print

</button>

</div>

</div>

`;

    });

    document.getElementById(
    "totalPurchaseReturns"
    ).textContent = total;

}

// =====================================
// Search Purchase Return
// =====================================

function searchPurchaseReturn(){

    const value =
    document
    .getElementById("searchPurchaseReturn")
    .value
    .toLowerCase();

    document
    .querySelectorAll(
    "#purchaseReturnTable .list-card"
    )
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
// Purchase Return Module
// Part 3
// View + Edit + Delete
// =====================================

// View Purchase Return
function viewPurchaseReturn(index){

    const item = purchaseReturns[index];

    alert(

`📤 Purchase Return

Return No : ${item.returnNumber}

📥 GRN : ${item.grnNumber}

🏢 Supplier : ${item.supplier}

📦 Product : ${item.product}

🔢 Return Qty : ${item.quantity}

❌ Reason : ${item.reason || "-"}

📅 Return Date : ${item.date}

📌 Status : ${item.status}

📝 Notes :

${item.notes || "-"}`

    );

}

// =====================================
// Edit Purchase Return
// =====================================

function editPurchaseReturn(index){

    const item = purchaseReturns[index];

    const grnIndex =
    grnRecords.findIndex(grn=>
        grn.grnNumber===item.grnNumber
    );

    document.getElementById("prGRN").value =
    grnIndex;

    document.getElementById("prQuantity").value =
    item.quantity;

    document.getElementById("prReason").value =
    item.reason;

    document.getElementById("prDate").value =
    item.date;

    document.getElementById("prStatus").value =
    item.status;

    document.getElementById("prNotes").value =
    item.notes;

    editIndex = index;

    document.querySelector(
    "#purchaseReturnForm button[type='submit']"
    ).textContent =
    "✏️ Update Purchase Return";

    showToast(
        "Edit Mode Enabled",
        "info"
    );

}

// =====================================
// Delete Purchase Return
// =====================================

function deletePurchaseReturn(index){

    if(!confirm(
        "Delete this Purchase Return?"
    )){

        return;

    }

    purchaseReturns.splice(index,1);

    localStorage.setItem(
        "purchaseReturns",
        JSON.stringify(purchaseReturns)
    );

    loadPurchaseReturns();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    editIndex = -1;

    document.querySelector(
    "#purchaseReturnForm button[type='submit']"
    ).textContent =
    "💾 Save Purchase Return";

    showToast(
        "Purchase Return Deleted",
        "success"
    );

}

// =====================================
// Print Purchase Return
// =====================================

function printPurchaseReturn(index){

    const item = purchaseReturns[index];

    const printData =

`******** PURCHASE RETURN ********

Return No : ${item.returnNumber}

GRN No : ${item.grnNumber}

Supplier : ${item.supplier}

--------------------------------

Product : ${item.product}

Return Qty : ${item.quantity}

Reason : ${item.reason}

--------------------------------

Return Date : ${item.date}

Status : ${item.status}

Notes :

${item.notes || "-"}

********************************`;

    alert(printData);

}

// =====================================
// Update Inventory
// =====================================

function updateInventoryAfterReturn(index){

    let inventory =
    JSON.parse(localStorage.getItem("inventory")) || [];

    const item =
    purchaseReturns[index];

    inventory.push({

        id:Date.now(),

        product:item.product,

        quantity:-item.quantity,

        source:item.returnNumber,

        type:"Purchase Return",

        date:item.date

    });

    localStorage.setItem(
        "inventory",
        JSON.stringify(inventory)
    );

    showToast(
        "Inventory Updated",
        "success"
    );

}
// =====================================
// BUSINESSOS V11
// Purchase Return Module
// Part 4
// Refresh + Dashboard
// =====================================

// Refresh Purchase Returns
function refreshPurchaseReturns(){

    purchaseReturns =
    JSON.parse(localStorage.getItem("purchaseReturns")) || [];

    loadPurchaseReturns();

}

// =====================================
// Refresh Window Focus
// =====================================

window.addEventListener("focus",function(){

    refreshPurchaseReturns();

});

// =====================================
// Refresh Storage Change
// =====================================

window.addEventListener("storage",function(){

    refreshPurchaseReturns();

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
// Purchase Return Form Submit
// =====================================

document
.getElementById("purchaseReturnForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    savePurchaseReturn();

    updateDashboard();

});

// =====================================
// Set Today's Date
// =====================================

const prDate =
document.getElementById("prDate");

if(prDate){

    prDate.value =
    new Date().toISOString().split("T")[0];

}

// =====================================
// Initial Refresh
// =====================================

refreshPurchaseReturns();

console.log(
"BusinessOS Purchase Return Module Loaded"
);