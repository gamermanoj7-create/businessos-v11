// =====================================
// BUSINESSOS V11
// Purchase Order Module
// Part 1
// Setup + Save Purchase Order
// =====================================

// Suppliers
let suppliers =
JSON.parse(localStorage.getItem("suppliers")) || [];

// Purchase Orders
let purchaseOrders =
JSON.parse(localStorage.getItem("purchaseOrders")) || [];

// Edit Mode
let editIndex = -1;

// =====================================
// Start
// =====================================

window.onload = function(){

    loadSuppliers();

    loadPurchaseOrders();

};

// =====================================
// Load Suppliers
// =====================================

function loadSuppliers(){

    const supplier =
    document.getElementById("poSupplier");

    if(!supplier) return;

    supplier.innerHTML =
    '<option value="">🏢 Select Supplier</option>';

    suppliers.forEach((item,index)=>{

        supplier.innerHTML +=

        `<option value="${index}">
            ${item.name}
        </option>`;

    });

}

// =====================================
// Auto Total
// =====================================

document
.getElementById("poQuantity")
.addEventListener("input",calculatePO);

document
.getElementById("poUnitPrice")
.addEventListener("input",calculatePO);

function calculatePO(){

    const qty =
    Number(
    document.getElementById("poQuantity").value || 0
    );

    const price =
    Number(
    document.getElementById("poUnitPrice").value || 0
    );

    document.getElementById("poTotal").value =
    (qty * price).toFixed(2);

}

// =====================================
// Save Purchase Order
// =====================================

function savePurchaseOrder(){

    const supplierIndex =
    document.getElementById("poSupplier").value;

    if(supplierIndex===""){

        showToast(
            "Select Supplier",
            "warning"
        );

        return;

    }

    const supplier =
    suppliers[supplierIndex];

    const order={

        id:Date.now(),

        poNumber:
        "PO-"+Date.now(),

        supplier:
        supplier.name,

        supplierIndex,

        date:
        document.getElementById("poDate").value,

        product:
        document.getElementById("poProduct").value.trim(),

        quantity:
        Number(
        document.getElementById("poQuantity").value || 0
        ),

        unitPrice:
        Number(
        document.getElementById("poUnitPrice").value || 0
        ),

        total:
        Number(
        document.getElementById("poTotal").value || 0
        ),

        deliveryDate:
        document.getElementById("deliveryDate").value,

        status:
        document.getElementById("poStatus").value,

        notes:
        document.getElementById("poNotes").value.trim()

    };

    if(order.product===""){

        showToast(
            "Enter Product Name",
            "warning"
        );

        return;

    }

    if(editIndex===-1){

        purchaseOrders.push(order);

        showToast(
            "Purchase Order Saved",
            "success"
        );

    }else{

        order.id =
        purchaseOrders[editIndex].id;

        order.poNumber =
        purchaseOrders[editIndex].poNumber;

        purchaseOrders[editIndex] =
        order;

        editIndex = -1;

        showToast(
            "Purchase Order Updated",
            "success"
        );

    }

    localStorage.setItem(
        "purchaseOrders",
        JSON.stringify(purchaseOrders)
    );

    document
    .getElementById("purchaseOrderForm")
    .reset();

    loadPurchaseOrders();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    document.querySelector(
        "#purchaseOrderForm button[type='submit']"
    ).textContent =
    "💾 Save Purchase Order";

}
// =====================================
// BUSINESSOS V11
// Purchase Order Module
// Part 2
// Purchase Order List + Search
// =====================================

// Load Purchase Orders
function loadPurchaseOrders(){

    const list =
    document.getElementById("purchaseOrderTable");

    if(!list) return;

    list.innerHTML = "";

    if(purchaseOrders.length===0){

        list.innerHTML = `

<div class="list-card">

<h3>📦 No Purchase Order Found</h3>

<p>Create your first Purchase Order.</p>

</div>

`;

        document.getElementById("totalPurchaseOrders").textContent="0";
        document.getElementById("totalPurchaseAmount").textContent="₹0.00";

        return;

    }

    let totalOrders = 0;
    let totalAmount = 0;

    purchaseOrders.forEach((order,index)=>{

        totalOrders++;
        totalAmount += Number(order.total);

        let badge="";

        switch(order.status){

            case "Pending":
                badge =
                `<span class="warning-badge">🟡 Pending</span>`;
                break;

            case "Ordered":
                badge =
                `<span class="primary-badge">📦 Ordered</span>`;
                break;

            case "Received":
                badge =
                `<span class="success-badge">✅ Received</span>`;
                break;

            case "Cancelled":
                badge =
                `<span class="danger-badge">❌ Cancelled</span>`;
                break;

            default:
                badge =
                `<span>${order.status}</span>`;
        }

        list.innerHTML += `

<div class="list-card">

<h3>📄 ${order.poNumber}</h3>

<div class="list-item">

<span class="list-label">

🏢 Supplier

</span>

<span class="list-value">

${order.supplier}

</span>

</div>

<div class="list-item">

<span class="list-label">

📦 Product

</span>

<span class="list-value">

${order.product}

</span>

</div>

<div class="list-item">

<span class="list-label">

📅 Date

</span>

<span class="list-value">

${order.date}

</span>

</div>

<div class="list-item">

<span class="list-label">

💰 Total

</span>

<span class="list-value">

₹${Number(order.total).toFixed(2)}

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
onclick="viewPurchaseOrder(${index})">

👁️ View

</button>

<button
class="edit-btn"
onclick="editPurchaseOrder(${index})">

✏️ Edit

</button>

<button
class="delete-btn"
onclick="deletePurchaseOrder(${index})">

🗑️ Delete

</button>

<button
class="primary-btn"
onclick="printPurchaseOrder(${index})">

🖨️ Print

</button>

</div>

</div>

`;

    });

    document.getElementById("totalPurchaseOrders").textContent =
    totalOrders;

    document.getElementById("totalPurchaseAmount").textContent =
    "₹" + totalAmount.toFixed(2);

}

// =====================================
// Search Purchase Order
// =====================================

function searchPurchaseOrder(){

    const value =
    document
    .getElementById("searchPurchaseOrder")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#purchaseOrderTable .list-card")
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
// Purchase Order Module
// Part 3
// View + Edit + Delete
// =====================================

// View Purchase Order
function viewPurchaseOrder(index){

    const order = purchaseOrders[index];

    alert(

`📄 Purchase Order

PO No : ${order.poNumber}

🏢 Supplier : ${order.supplier}

📦 Product : ${order.product}

🔢 Quantity : ${order.quantity}

💰 Unit Price : ₹${Number(order.unitPrice).toFixed(2)}

💵 Total : ₹${Number(order.total).toFixed(2)}

📅 Order Date : ${order.date}

🚚 Delivery Date : ${order.deliveryDate}

📌 Status : ${order.status}

📝 Notes : ${order.notes || "-"}`

    );

}

// =====================================
// Edit Purchase Order
// =====================================

function editPurchaseOrder(index){

    const order = purchaseOrders[index];

    document.getElementById("poSupplier").value =
    order.supplierIndex;

    document.getElementById("poDate").value =
    order.date;

    document.getElementById("poProduct").value =
    order.product;

    document.getElementById("poQuantity").value =
    order.quantity;

    document.getElementById("poUnitPrice").value =
    order.unitPrice;

    document.getElementById("poTotal").value =
    order.total;

    document.getElementById("deliveryDate").value =
    order.deliveryDate;

    document.getElementById("poStatus").value =
    order.status;

    document.getElementById("poNotes").value =
    order.notes;

    editIndex = index;

    document.querySelector(
    "#purchaseOrderForm button[type='submit']"
    ).textContent =
    "✏️ Update Purchase Order";

    showToast(
        "Edit Mode Enabled",
        "info"
    );

}

// =====================================
// Delete Purchase Order
// =====================================

function deletePurchaseOrder(index){

    if(!confirm(
        "Delete this Purchase Order?"
    )){

        return;

    }

    purchaseOrders.splice(index,1);

    localStorage.setItem(
        "purchaseOrders",
        JSON.stringify(purchaseOrders)
    );

    loadPurchaseOrders();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    editIndex = -1;

    document.querySelector(
    "#purchaseOrderForm button[type='submit']"
    ).textContent =
    "💾 Save Purchase Order";

    showToast(
        "Purchase Order Deleted",
        "success"
    );

}

// =====================================
// Print Purchase Order
// =====================================

function printPurchaseOrder(index){

    const order = purchaseOrders[index];

    const slip =

`PURCHASE ORDER

PO Number : ${order.poNumber}

Supplier : ${order.supplier}

----------------------------

Product : ${order.product}

Quantity : ${order.quantity}

Unit Price : ₹${Number(order.unitPrice).toFixed(2)}

----------------------------

Total : ₹${Number(order.total).toFixed(2)}

Order Date : ${order.date}

Delivery : ${order.deliveryDate}

Status : ${order.status}

Notes : ${order.notes || "-"}`;

    alert(slip);

}
// =====================================
// BUSINESSOS V11
// Purchase Order Module
// Part 4
// Refresh + Dashboard
// =====================================

// Refresh Purchase Orders
function refreshPurchaseOrders(){

    purchaseOrders =
    JSON.parse(localStorage.getItem("purchaseOrders")) || [];

    loadPurchaseOrders();

}

// =====================================
// Refresh Window Focus
// =====================================

window.addEventListener("focus",function(){

    refreshPurchaseOrders();

});

// =====================================
// Refresh Storage Change
// =====================================

window.addEventListener("storage",function(){

    refreshPurchaseOrders();

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
// Purchase Order Form Submit
// =====================================

document
.getElementById("purchaseOrderForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    savePurchaseOrder();

    updateDashboard();

});

// =====================================
// Set Today's Date
// =====================================

const poDate =
document.getElementById("poDate");

if(poDate){

    poDate.value =
    new Date().toISOString().split("T")[0];

}

// =====================================
// Initial Refresh
// =====================================

refreshPurchaseOrders();

console.log(
"BusinessOS Purchase Order Module Loaded"
);