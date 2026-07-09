// =====================================
// BUSINESSOS V11
// Sales Order Module
// Part 1
// Setup + Save Sales Order
// =====================================

// Customers
let customers =
JSON.parse(localStorage.getItem("customers")) || [];

// Sales Orders
let salesOrders =
JSON.parse(localStorage.getItem("salesOrders")) || [];

// Edit Mode
let editIndex = -1;

// =====================================
// Start
// =====================================

window.onload = function(){

    loadCustomers();

    loadSalesOrders();

};

// =====================================
// Load Customers
// =====================================

function loadCustomers(){

    const customer =
    document.getElementById("soCustomer");

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
// Auto Total
// =====================================

document
.getElementById("soQuantity")
.addEventListener("input",calculateSO);

document
.getElementById("soUnitPrice")
.addEventListener("input",calculateSO);

function calculateSO(){

    const qty =
    Number(
    document.getElementById("soQuantity").value || 0
    );

    const price =
    Number(
    document.getElementById("soUnitPrice").value || 0
    );

    document.getElementById("soTotal").value =
    (qty * price).toFixed(2);

}

// =====================================
// Save Sales Order
// =====================================

function saveSalesOrder(){

    const customerIndex =
    document.getElementById("soCustomer").value;

    if(customerIndex===""){

        showToast(
            "Select Customer",
            "warning"
        );

        return;

    }

    const customer =
    customers[customerIndex];

    const order={

        id:Date.now(),

        soNumber:
        "SO-"+Date.now(),

        customer:
        customer.name,

        customerIndex,

        date:
        document.getElementById("soDate").value,

        product:
        document.getElementById("soProduct").value.trim(),

        quantity:
        Number(
        document.getElementById("soQuantity").value || 0
        ),

        unitPrice:
        Number(
        document.getElementById("soUnitPrice").value || 0
        ),

        total:
        Number(
        document.getElementById("soTotal").value || 0
        ),

        deliveryDate:
        document.getElementById("soDeliveryDate").value,

        status:
        document.getElementById("soStatus").value,

        notes:
        document.getElementById("soNotes").value.trim()

    };

    if(order.product===""){

        showToast(
            "Enter Product Name",
            "warning"
        );

        return;

    }

    if(editIndex===-1){

        salesOrders.push(order);

        showToast(
            "Sales Order Saved",
            "success"
        );

    }else{

        order.id =
        salesOrders[editIndex].id;

        order.soNumber =
        salesOrders[editIndex].soNumber;

        salesOrders[editIndex] =
        order;

        editIndex = -1;

        showToast(
            "Sales Order Updated",
            "success"
        );

    }

    localStorage.setItem(
        "salesOrders",
        JSON.stringify(salesOrders)
    );

    document
    .getElementById("salesOrderForm")
    .reset();

    loadSalesOrders();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    document.querySelector(
        "#salesOrderForm button[type='submit']"
    ).textContent =
    "💾 Save Sales Order";

}
// =====================================
// BUSINESSOS V11
// Sales Order Module
// Part 2
// Sales Order List + Search
// =====================================

// Load Sales Orders
function loadSalesOrders(){

    const list =
    document.getElementById("salesOrderTable");

    if(!list) return;

    list.innerHTML = "";

    if(salesOrders.length===0){

        list.innerHTML = `

<div class="list-card">

<h3>📄 No Sales Order Found</h3>

<p>Create your first Sales Order.</p>

</div>

`;

        document.getElementById("totalSalesOrders").textContent="0";
        document.getElementById("totalSalesAmount").textContent="₹0.00";

        return;

    }

    let totalOrders = 0;
    let totalAmount = 0;

    salesOrders.forEach((order,index)=>{

        totalOrders++;
        totalAmount += Number(order.total);

        let badge="";

        switch(order.status){

            case "Pending":
                badge =
                `<span class="warning-badge">🟡 Pending</span>`;
                break;

            case "Confirmed":
                badge =
                `<span class="primary-badge">📦 Confirmed</span>`;
                break;

            case "Delivered":
                badge =
                `<span class="success-badge">✅ Delivered</span>`;
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

<h3>📄 ${order.soNumber}</h3>

<div class="list-item">

<span class="list-label">

👤 Customer

</span>

<span class="list-value">

${order.customer}

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

📅 Order Date

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
onclick="viewSalesOrder(${index})">

👁️ View

</button>

<button
class="edit-btn"
onclick="editSalesOrder(${index})">

✏️ Edit

</button>

<button
class="delete-btn"
onclick="deleteSalesOrder(${index})">

🗑️ Delete

</button>

<button
class="primary-btn"
onclick="printSalesOrder(${index})">

🖨️ Print

</button>

</div>

</div>

`;

    });

    document.getElementById("totalSalesOrders").textContent =
    totalOrders;

    document.getElementById("totalSalesAmount").textContent =
    "₹" + totalAmount.toFixed(2);

}

// =====================================
// Search Sales Order
// =====================================

function searchSalesOrder(){

    const value =
    document
    .getElementById("searchSalesOrder")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#salesOrderTable .list-card")
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
// Sales Order Module
// Part 3
// View + Edit + Delete
// =====================================

// View Sales Order
function viewSalesOrder(index){

    const order = salesOrders[index];

    alert(

`📄 Sales Order

SO No : ${order.soNumber}

👤 Customer : ${order.customer}

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
// Edit Sales Order
// =====================================

function editSalesOrder(index){

    const order = salesOrders[index];

    document.getElementById("soCustomer").value =
    order.customerIndex;

    document.getElementById("soDate").value =
    order.date;

    document.getElementById("soProduct").value =
    order.product;

    document.getElementById("soQuantity").value =
    order.quantity;

    document.getElementById("soUnitPrice").value =
    order.unitPrice;

    document.getElementById("soTotal").value =
    order.total;

    document.getElementById("soDeliveryDate").value =
    order.deliveryDate;

    document.getElementById("soStatus").value =
    order.status;

    document.getElementById("soNotes").value =
    order.notes;

    editIndex = index;

    document.querySelector(
    "#salesOrderForm button[type='submit']"
    ).textContent =
    "✏️ Update Sales Order";

    showToast(
        "Edit Mode Enabled",
        "info"
    );

}

// =====================================
// Delete Sales Order
// =====================================

function deleteSalesOrder(index){

    if(!confirm(
        "Delete this Sales Order?"
    )){

        return;

    }

    salesOrders.splice(index,1);

    localStorage.setItem(
        "salesOrders",
        JSON.stringify(salesOrders)
    );

    loadSalesOrders();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    editIndex = -1;

    document.querySelector(
    "#salesOrderForm button[type='submit']"
    ).textContent =
    "💾 Save Sales Order";

    showToast(
        "Sales Order Deleted",
        "success"
    );

}

// =====================================
// Print Sales Order
// =====================================

function printSalesOrder(index){

    const order = salesOrders[index];

    const slip =

`SALES ORDER

SO Number : ${order.soNumber}

Customer : ${order.customer}

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
// Sales Order Module
// Part 4
// Refresh + Dashboard
// =====================================

// Refresh Sales Orders
function refreshSalesOrders(){

    salesOrders =
    JSON.parse(localStorage.getItem("salesOrders")) || [];

    loadSalesOrders();

}

// =====================================
// Refresh Window Focus
// =====================================

window.addEventListener("focus",function(){

    refreshSalesOrders();

});

// =====================================
// Refresh Storage Change
// =====================================

window.addEventListener("storage",function(){

    refreshSalesOrders();

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
// Sales Order Form Submit
// =====================================

document
.getElementById("salesOrderForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    saveSalesOrder();

    updateDashboard();

});

// =====================================
// Set Today's Date
// =====================================

const soDate =
document.getElementById("soDate");

if(soDate){

    soDate.value =
    new Date().toISOString().split("T")[0];

}

// =====================================
// Initial Refresh
// =====================================

refreshSalesOrders();

console.log(
"BusinessOS Sales Order Module Loaded"
);
