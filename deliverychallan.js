// =====================================
// BUSINESSOS V11
// Delivery Challan Module
// Part 1
// Setup + Save Delivery Challan
// =====================================

// Customers
let customers =
JSON.parse(localStorage.getItem("customers")) || [];

// Delivery Challans
let deliveryChallans =
JSON.parse(localStorage.getItem("deliveryChallans")) || [];

// Edit Mode
let editIndex = -1;

// =====================================
// Start
// =====================================

window.onload = function(){

    loadCustomers();

    loadDeliveryChallans();

};

// =====================================
// Load Customers
// =====================================

function loadCustomers(){

    const customer =
    document.getElementById("dcCustomer");

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
// Save Delivery Challan
// =====================================

function saveDeliveryChallan(){

    const customerIndex =
    document.getElementById("dcCustomer").value;

    if(customerIndex===""){

        showToast(
            "Select Customer",
            "warning"
        );

        return;

    }

    const customer =
    customers[customerIndex];

    const challan = {

        id:Date.now(),

        challanNumber:
        "DC-"+Date.now(),

        customer:
        customer.name,

        customerIndex,

        date:
        document.getElementById("dcDate").value,

        product:
        document.getElementById("dcProduct").value.trim(),

        quantity:
        Number(
        document.getElementById("dcQuantity").value || 0
        ),

        vehicle:
        document.getElementById("dcVehicle").value.trim(),

        driver:
        document.getElementById("dcDriver").value.trim(),

        address:
        document.getElementById("dcAddress").value.trim(),

        deliveryDate:
        document.getElementById("dcDeliveryDate").value,

        status:
        document.getElementById("dcStatus").value,

        notes:
        document.getElementById("dcNotes").value.trim()

    };

    if(challan.product===""){

        showToast(
            "Enter Product Name",
            "warning"
        );

        return;

    }

    if(challan.quantity<=0){

        showToast(
            "Enter Quantity",
            "warning"
        );

        return;

    }

    if(editIndex===-1){

        deliveryChallans.push(challan);

        showToast(
            "Delivery Challan Saved",
            "success"
        );

    }else{

        challan.id =
        deliveryChallans[editIndex].id;

        challan.challanNumber =
        deliveryChallans[editIndex].challanNumber;

        deliveryChallans[editIndex] =
        challan;

        editIndex = -1;

        showToast(
            "Delivery Challan Updated",
            "success"
        );

    }

    localStorage.setItem(
        "deliveryChallans",
        JSON.stringify(deliveryChallans)
    );

    document
    .getElementById("deliveryChallanForm")
    .reset();

    loadDeliveryChallans();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    document.querySelector(
        "#deliveryChallanForm button[type='submit']"
    ).textContent =
    "💾 Save Challan";

}
// =====================================
// BUSINESSOS V11
// Delivery Challan Module
// Part 2
// Challan List + Search
// =====================================

// Load Delivery Challans
function loadDeliveryChallans(){

    const list =
    document.getElementById("deliveryChallanTable");

    if(!list) return;

    list.innerHTML = "";

    if(deliveryChallans.length===0){

        list.innerHTML = `

<div class="list-card">

<h3>🚚 No Delivery Challan Found</h3>

<p>Create your first Delivery Challan.</p>

</div>

`;

        document.getElementById("totalDeliveryChallans").textContent="0";

        return;

    }

    let total = 0;

    deliveryChallans.forEach((challan,index)=>{

        total++;

        let badge="";

        switch(challan.status){

            case "Pending":

                badge =
                `<span class="warning-badge">
                🟡 Pending
                </span>`;
                break;

            case "Out for Delivery":

                badge =
                `<span class="primary-badge">
                🚚 Out for Delivery
                </span>`;
                break;

            case "Delivered":

                badge =
                `<span class="success-badge">
                ✅ Delivered
                </span>`;
                break;

            case "Returned":

                badge =
                `<span class="danger-badge">
                ↩️ Returned
                </span>`;
                break;

            default:

                badge =
                `<span>${challan.status}</span>`;

        }

        list.innerHTML += `

<div class="list-card">

<h3>🚚 ${challan.challanNumber}</h3>

<div class="list-item">

<span class="list-label">

👤 Customer

</span>

<span class="list-value">

${challan.customer}

</span>

</div>

<div class="list-item">

<span class="list-label">

📦 Product

</span>

<span class="list-value">

${challan.product}

</span>

</div>

<div class="list-item">

<span class="list-label">

🔢 Quantity

</span>

<span class="list-value">

${challan.quantity}

</span>

</div>

<div class="list-item">

<span class="list-label">

📅 Date

</span>

<span class="list-value">

${challan.date}

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
onclick="viewDeliveryChallan(${index})">

👁️ View

</button>

<button
class="edit-btn"
onclick="editDeliveryChallan(${index})">

✏️ Edit

</button>

<button
class="delete-btn"
onclick="deleteDeliveryChallan(${index})">

🗑️ Delete

</button>

<button
class="primary-btn"
onclick="printDeliveryChallan(${index})">

🖨️ Print

</button>

</div>

</div>

`;

    });

    document.getElementById("totalDeliveryChallans").textContent =
    total;

}

// =====================================
// Search Delivery Challan
// =====================================

function searchDeliveryChallan(){

    const value =
    document
    .getElementById("searchDeliveryChallan")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#deliveryChallanTable .list-card")
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
// Delivery Challan Module
// Part 3
// View + Edit + Delete
// =====================================

// View Delivery Challan
function viewDeliveryChallan(index){

    const challan = deliveryChallans[index];

    alert(

`🚚 Delivery Challan

Challan No : ${challan.challanNumber}

👤 Customer : ${challan.customer}

📦 Product : ${challan.product}

🔢 Quantity : ${challan.quantity}

🚛 Vehicle : ${challan.vehicle || "-"}

👨 Driver : ${challan.driver || "-"}

📍 Address :

${challan.address || "-"}

📅 Challan Date : ${challan.date}

🚚 Delivery Date : ${challan.deliveryDate}

📌 Status : ${challan.status}

📝 Notes :

${challan.notes || "-"}`

    );

}

// =====================================
// Edit Delivery Challan
// =====================================

function editDeliveryChallan(index){

    const challan = deliveryChallans[index];

    document.getElementById("dcCustomer").value =
    challan.customerIndex;

    document.getElementById("dcDate").value =
    challan.date;

    document.getElementById("dcProduct").value =
    challan.product;

    document.getElementById("dcQuantity").value =
    challan.quantity;

    document.getElementById("dcVehicle").value =
    challan.vehicle;

    document.getElementById("dcDriver").value =
    challan.driver;

    document.getElementById("dcAddress").value =
    challan.address;

    document.getElementById("dcDeliveryDate").value =
    challan.deliveryDate;

    document.getElementById("dcStatus").value =
    challan.status;

    document.getElementById("dcNotes").value =
    challan.notes;

    editIndex = index;

    document.querySelector(
    "#deliveryChallanForm button[type='submit']"
    ).textContent =
    "✏️ Update Challan";

    showToast(
        "Edit Mode Enabled",
        "info"
    );

}

// =====================================
// Delete Delivery Challan
// =====================================

function deleteDeliveryChallan(index){

    if(!confirm(
        "Delete this Delivery Challan?"
    )){

        return;

    }

    deliveryChallans.splice(index,1);

    localStorage.setItem(
        "deliveryChallans",
        JSON.stringify(deliveryChallans)
    );

    loadDeliveryChallans();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    editIndex = -1;

    document.querySelector(
    "#deliveryChallanForm button[type='submit']"
    ).textContent =
    "💾 Save Challan";

    showToast(
        "Delivery Challan Deleted",
        "success"
    );

}

// =====================================
// Print Delivery Challan
// =====================================

function printDeliveryChallan(index){

    const challan = deliveryChallans[index];

    const printData =

`******** DELIVERY CHALLAN ********

Challan No : ${challan.challanNumber}

Customer : ${challan.customer}

--------------------------------

Product : ${challan.product}

Quantity : ${challan.quantity}

Vehicle : ${challan.vehicle}

Driver : ${challan.driver}

--------------------------------

Delivery Date : ${challan.deliveryDate}

Status : ${challan.status}

Notes :

${challan.notes || "-"}

********************************`;

    alert(printData);

}

// =====================================
// Convert To Invoice
// =====================================

function convertToInvoice(index){

    const challan =
    deliveryChallans[index];

    let invoices =
    JSON.parse(localStorage.getItem("invoices")) || [];

    invoices.push({

        id:Date.now(),

        invoiceNumber:
        "INV-"+Date.now(),

        customer:
        challan.customer,

        customerIndex:
        challan.customerIndex,

        date:
        new Date().toISOString().split("T")[0],

        product:
        challan.product,

        quantity:
        challan.quantity,

        total:0,

        status:"Pending",

        notes:
        "Converted From " +
        challan.challanNumber

    });

    localStorage.setItem(
        "invoices",
        JSON.stringify(invoices)
    );

    showToast(
        "Converted To Invoice",
        "success"
    );

}
// =====================================
// BUSINESSOS V11
// Delivery Challan Module
// Part 4
// Refresh + Dashboard
// =====================================

// Refresh Delivery Challans
function refreshDeliveryChallans(){

    deliveryChallans =
    JSON.parse(localStorage.getItem("deliveryChallans")) || [];

    loadDeliveryChallans();

}

// =====================================
// Refresh Window Focus
// =====================================

window.addEventListener("focus",function(){

    refreshDeliveryChallans();

});

// =====================================
// Refresh Storage Change
// =====================================

window.addEventListener("storage",function(){

    refreshDeliveryChallans();

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
// Delivery Challan Form Submit
// =====================================

document
.getElementById("deliveryChallanForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    saveDeliveryChallan();

    updateDashboard();

});

// =====================================
// Set Today's Date
// =====================================

const dcDate =
document.getElementById("dcDate");

if(dcDate){

    dcDate.value =
    new Date().toISOString().split("T")[0];

}

// =====================================
// Initial Refresh
// =====================================

refreshDeliveryChallans();

console.log(
"BusinessOS Delivery Challan Module Loaded"
);