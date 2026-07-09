// =====================================
// BUSINESSOS V11
// Sales Return Module
// Part 1
// Setup + Save Sales Return
// =====================================

// Sales Orders
let salesOrders =
JSON.parse(localStorage.getItem("salesOrders")) || [];

// Sales Returns
let salesReturns =
JSON.parse(localStorage.getItem("salesReturns")) || [];

// Edit Mode
let editIndex = -1;

// =====================================
// Start
// =====================================

window.onload = function(){

    loadSalesOrders();

    loadSalesReturns();

};

// =====================================
// Load Sales Orders
// =====================================

function loadSalesOrders(){

    const select =
    document.getElementById("srSalesOrder");

    if(!select) return;

    select.innerHTML =
    '<option value="">📄 Select Sales Order</option>';

    salesOrders.forEach((order,index)=>{

        select.innerHTML +=

        `<option value="${index}">
        ${order.soNumber} - ${order.product}
        </option>`;

    });

}

// =====================================
// Save Sales Return
// =====================================

function saveSalesReturn(){

    const orderIndex =
    document.getElementById("srSalesOrder").value;

    if(orderIndex===""){

        showToast(
            "Select Sales Order",
            "warning"
        );

        return;

    }

    const order =
    salesOrders[orderIndex];

    const salesReturn={

        id:Date.now(),

        returnNumber:
        "SR-"+Date.now(),

        soNumber:
        order.soNumber,

        customer:
        order.customer,

        product:
        order.product,

        quantity:
        Number(
        document.getElementById("srQuantity").value || 0
        ),

        reason:
        document.getElementById("srReason").value.trim(),

        refund:
        Number(
        document.getElementById("srRefund").value || 0
        ),

        date:
        document.getElementById("srDate").value,

        status:
        document.getElementById("srStatus").value,

        notes:
        document.getElementById("srNotes").value.trim()

    };

    if(salesReturn.quantity<=0){

        showToast(
            "Enter Return Quantity",
            "warning"
        );

        return;

    }

    if(editIndex===-1){

        salesReturns.push(
            salesReturn
        );

        showToast(
            "Sales Return Saved",
            "success"
        );

    }else{

        salesReturn.id =
        salesReturns[editIndex].id;

        salesReturn.returnNumber =
        salesReturns[editIndex].returnNumber;

        salesReturns[editIndex] =
        salesReturn;

        editIndex = -1;

        showToast(
            "Sales Return Updated",
            "success"
        );

    }

    localStorage.setItem(
        "salesReturns",
        JSON.stringify(salesReturns)
    );

    document
    .getElementById("salesReturnForm")
    .reset();

    loadSalesReturns();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    document.querySelector(
    "#salesReturnForm button[type='submit']"
    ).textContent =
    "💾 Save Sales Return";

}
// =====================================
// BUSINESSOS V11
// Sales Return Module
// Part 2
// Return List + Search
// =====================================

// Load Sales Returns
function loadSalesReturns(){

    const list =
    document.getElementById("salesReturnTable");

    if(!list) return;

    list.innerHTML = "";

    if(salesReturns.length===0){

        list.innerHTML = `

<div class="list-card">

<h3>📥 No Sales Return Found</h3>

<p>Create your first Sales Return.</p>

</div>

`;

        document.getElementById(
        "totalSalesReturns"
        ).textContent = "0";

        document.getElementById(
        "totalRefundAmount"
        ).textContent = "₹0.00";

        return;

    }

    let total = 0;
    let refundTotal = 0;

    salesReturns.forEach((item,index)=>{

        total++;

        refundTotal += Number(item.refund);

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

            case "Refunded":

                badge =
                `<span class="success-badge">
                💰 Refunded
                </span>`;
                break;

            default:

                badge =
                `<span>${item.status}</span>`;

        }

        list.innerHTML += `

<div class="list-card">

<h3>📥 ${item.returnNumber}</h3>

<div class="list-item">

<span class="list-label">

📄 Sales Order

</span>

<span class="list-value">

${item.soNumber}

</span>

</div>

<div class="list-item">

<span class="list-label">

👤 Customer

</span>

<span class="list-value">

${item.customer}

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

💰 Refund

</span>

<span class="list-value">

₹${Number(item.refund).toFixed(2)}

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
onclick="viewSalesReturn(${index})">

👁️ View

</button>

<button
class="edit-btn"
onclick="editSalesReturn(${index})">

✏️ Edit

</button>

<button
class="delete-btn"
onclick="deleteSalesReturn(${index})">

🗑️ Delete

</button>

<button
class="primary-btn"
onclick="printSalesReturn(${index})">

🖨️ Print

</button>

</div>

</div>

`;

    });

    document.getElementById(
    "totalSalesReturns"
    ).textContent = total;

    document.getElementById(
    "totalRefundAmount"
    ).textContent =
    "₹" + refundTotal.toFixed(2);

}

// =====================================
// Search Sales Return
// =====================================

function searchSalesReturn(){

    const value =
    document
    .getElementById("searchSalesReturn")
    .value
    .toLowerCase();

    document
    .querySelectorAll(
    "#salesReturnTable .list-card"
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
// Sales Return Module
// Part 3
// View + Edit + Delete
// =====================================

// View Sales Return
function viewSalesReturn(index){

    const item = salesReturns[index];

    alert(

`📥 Sales Return

Return No : ${item.returnNumber}

Sales Order : ${item.soNumber}

👤 Customer : ${item.customer}

📦 Product : ${item.product}

🔢 Return Qty : ${item.quantity}

💰 Refund : ₹${Number(item.refund).toFixed(2)}

❌ Reason : ${item.reason || "-"}

📅 Return Date : ${item.date}

📌 Status : ${item.status}

📝 Notes :

${item.notes || "-"}`

    );

}

// =====================================
// Edit Sales Return
// =====================================

function editSalesReturn(index){

    const item = salesReturns[index];

    const orderIndex =
    salesOrders.findIndex(order=>
        order.soNumber===item.soNumber
    );

    document.getElementById("srSalesOrder").value =
    orderIndex;

    document.getElementById("srQuantity").value =
    item.quantity;

    document.getElementById("srReason").value =
    item.reason;

    document.getElementById("srRefund").value =
    item.refund;

    document.getElementById("srDate").value =
    item.date;

    document.getElementById("srStatus").value =
    item.status;

    document.getElementById("srNotes").value =
    item.notes;

    editIndex = index;

    document.querySelector(
    "#salesReturnForm button[type='submit']"
    ).textContent =
    "✏️ Update Sales Return";

    showToast(
        "Edit Mode Enabled",
        "info"
    );

}

// =====================================
// Delete Sales Return
// =====================================

function deleteSalesReturn(index){

    if(!confirm(
        "Delete this Sales Return?"
    )){

        return;

    }

    salesReturns.splice(index,1);

    localStorage.setItem(
        "salesReturns",
        JSON.stringify(salesReturns)
    );

    loadSalesReturns();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    editIndex = -1;

    document.querySelector(
    "#salesReturnForm button[type='submit']"
    ).textContent =
    "💾 Save Sales Return";

    showToast(
        "Sales Return Deleted",
        "success"
    );

}

// =====================================
// Print Sales Return
// =====================================

function printSalesReturn(index){

    const item = salesReturns[index];

    const printData =

`******** SALES RETURN ********

Return No : ${item.returnNumber}

Sales Order : ${item.soNumber}

Customer : ${item.customer}

--------------------------------

Product : ${item.product}

Return Qty : ${item.quantity}

Refund : ₹${Number(item.refund).toFixed(2)}

Reason : ${item.reason}

--------------------------------

Return Date : ${item.date}

Status : ${item.status}

Notes :

${item.notes || "-"}

******************************`;

    alert(printData);

}

// =====================================
// Update Inventory
// =====================================

function updateInventoryAfterSalesReturn(index){

    let inventory =
    JSON.parse(localStorage.getItem("inventory")) || [];

    const item =
    salesReturns[index];

    inventory.push({

        id:Date.now(),

        product:item.product,

        quantity:item.quantity,

        source:item.returnNumber,

        type:"Sales Return",

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
// Sales Return Module
// Part 4
// Refresh + Dashboard
// =====================================

// Refresh Sales Returns
function refreshSalesReturns(){

    salesReturns =
    JSON.parse(localStorage.getItem("salesReturns")) || [];

    loadSalesReturns();

}

// =====================================
// Refresh Window Focus
// =====================================

window.addEventListener("focus",function(){

    refreshSalesReturns();

});

// =====================================
// Refresh Storage Change
// =====================================

window.addEventListener("storage",function(){

    refreshSalesReturns();

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
// Sales Return Form Submit
// =====================================

document
.getElementById("salesReturnForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    saveSalesReturn();

    updateDashboard();

});

// =====================================
// Set Today's Date
// =====================================

const srDate =
document.getElementById("srDate");

if(srDate){

    srDate.value =
    new Date().toISOString().split("T")[0];

}

// =====================================
// Initial Refresh
// =====================================

refreshSalesReturns();

console.log(
"BusinessOS Sales Return Module Loaded"
);