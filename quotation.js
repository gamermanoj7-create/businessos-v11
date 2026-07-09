// =====================================
// BUSINESSOS V11
// Quotation Module
// Part 1
// Setup + Save Quotation
// =====================================

// Customers
let customers =
JSON.parse(localStorage.getItem("customers")) || [];

// Quotations
let quotations =
JSON.parse(localStorage.getItem("quotations")) || [];

// Edit Mode
let editIndex = -1;

// =====================================
// Start
// =====================================

window.onload = function(){

    loadCustomers();

    loadQuotations();

};

// =====================================
// Load Customers
// =====================================

function loadCustomers(){

    const customer =
    document.getElementById("quotationCustomer");

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
// Auto Calculate
// =====================================

document
.getElementById("quotationQuantity")
.addEventListener("input",calculateQuotation);

document
.getElementById("quotationUnitPrice")
.addEventListener("input",calculateQuotation);

document
.getElementById("quotationDiscount")
.addEventListener("input",calculateQuotation);

document
.getElementById("quotationTax")
.addEventListener("input",calculateQuotation);

function calculateQuotation(){

    const qty =
    Number(
    document.getElementById("quotationQuantity").value || 0
    );

    const price =
    Number(
    document.getElementById("quotationUnitPrice").value || 0
    );

    const discount =
    Number(
    document.getElementById("quotationDiscount").value || 0
    );

    const tax =
    Number(
    document.getElementById("quotationTax").value || 0
    );

    const subtotal =
    qty * price;

    const grandTotal =
    subtotal - discount + tax;

    document.getElementById("quotationTotal").value =
    grandTotal.toFixed(2);

}

// =====================================
// Save Quotation
// =====================================

function saveQuotation(){

    const customerIndex =
    document.getElementById("quotationCustomer").value;

    if(customerIndex===""){

        showToast(
            "Select Customer",
            "warning"
        );

        return;

    }

    const customer =
    customers[customerIndex];

    const quotation={

        id:Date.now(),

        quotationNumber:
        "QT-"+Date.now(),

        customer:
        customer.name,

        customerIndex,

        date:
        document.getElementById("quotationDate").value,

        product:
        document.getElementById("quotationProduct").value.trim(),

        quantity:
        Number(
        document.getElementById("quotationQuantity").value || 0
        ),

        unitPrice:
        Number(
        document.getElementById("quotationUnitPrice").value || 0
        ),

        discount:
        Number(
        document.getElementById("quotationDiscount").value || 0
        ),

        tax:
        Number(
        document.getElementById("quotationTax").value || 0
        ),

        total:
        Number(
        document.getElementById("quotationTotal").value || 0
        ),

        validUntil:
        document.getElementById("validUntil").value,

        status:
        document.getElementById("quotationStatus").value,

        terms:
        document.getElementById("quotationTerms").value.trim()

    };

    if(quotation.product===""){

        showToast(
            "Enter Product Name",
            "warning"
        );

        return;

    }

    if(editIndex===-1){

        quotations.push(quotation);

        showToast(
            "Quotation Saved Successfully",
            "success"
        );

    }else{

        quotation.id =
        quotations[editIndex].id;

        quotation.quotationNumber =
        quotations[editIndex].quotationNumber;

        quotations[editIndex] =
        quotation;

        editIndex = -1;

        showToast(
            "Quotation Updated Successfully",
            "success"
        );

    }

    localStorage.setItem(
        "quotations",
        JSON.stringify(quotations)
    );

    document
    .getElementById("quotationForm")
    .reset();

    loadQuotations();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    document.querySelector(
        "#quotationForm button[type='submit']"
    ).textContent =
    "💾 Save Quotation";

}
// =====================================
// BUSINESSOS V11
// Quotation Module
// Part 2
// Quotation List + Search
// =====================================

// Load Quotations
function loadQuotations(){

    const list =
    document.getElementById("quotationTable");

    if(!list) return;

    list.innerHTML = "";

    if(quotations.length===0){

        list.innerHTML = `

<div class="list-card">

<h3>📄 No Quotation Found</h3>

<p>Create your first quotation.</p>

</div>

`;

        document.getElementById("totalQuotations").textContent = "0";
        document.getElementById("totalQuotationValue").textContent = "₹0.00";

        return;

    }

    let total = 0;
    let totalValue = 0;

    quotations.forEach((quotation,index)=>{

        total++;
        totalValue += Number(quotation.total);

        let badge="";

        switch(quotation.status){

            case "Draft":

                badge =
                `<span class="warning-badge">
                📝 Draft
                </span>`;
                break;

            case "Sent":

                badge =
                `<span class="primary-badge">
                📤 Sent
                </span>`;
                break;

            case "Accepted":

                badge =
                `<span class="success-badge">
                ✅ Accepted
                </span>`;
                break;

            case "Rejected":

                badge =
                `<span class="danger-badge">
                ❌ Rejected
                </span>`;
                break;

            default:

                badge =
                `<span>${quotation.status}</span>`;

        }

        list.innerHTML += `

<div class="list-card">

<h3>📄 ${quotation.quotationNumber}</h3>

<div class="list-item">

<span class="list-label">

👤 Customer

</span>

<span class="list-value">

${quotation.customer}

</span>

</div>

<div class="list-item">

<span class="list-label">

📦 Product

</span>

<span class="list-value">

${quotation.product}

</span>

</div>

<div class="list-item">

<span class="list-label">

📅 Date

</span>

<span class="list-value">

${quotation.date}

</span>

</div>

<div class="list-item">

<span class="list-label">

💰 Total

</span>

<span class="list-value">

₹${Number(quotation.total).toFixed(2)}

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
onclick="viewQuotation(${index})">

👁️ View

</button>

<button
class="edit-btn"
onclick="editQuotation(${index})">

✏️ Edit

</button>

<button
class="delete-btn"
onclick="deleteQuotation(${index})">

🗑️ Delete

</button>

<button
class="primary-btn"
onclick="printQuotation(${index})">

🖨️ Print

</button>

</div>

</div>

`;

    });

    document.getElementById("totalQuotations").textContent =
    total;

    document.getElementById("totalQuotationValue").textContent =
    "₹" + totalValue.toFixed(2);

}

// =====================================
// Search Quotation
// =====================================

function searchQuotation(){

    const value =
    document
    .getElementById("searchQuotation")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#quotationTable .list-card")
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
// Quotation Module
// Part 3
// View + Edit + Delete
// =====================================

// View Quotation
function viewQuotation(index){

    const quotation = quotations[index];

    alert(

`📄 Quotation

Quotation No : ${quotation.quotationNumber}

👤 Customer : ${quotation.customer}

📦 Product : ${quotation.product}

🔢 Quantity : ${quotation.quantity}

💰 Unit Price : ₹${Number(quotation.unitPrice).toFixed(2)}

🎁 Discount : ₹${Number(quotation.discount).toFixed(2)}

🧾 Tax : ₹${Number(quotation.tax).toFixed(2)}

💵 Grand Total : ₹${Number(quotation.total).toFixed(2)}

📅 Date : ${quotation.date}

⏳ Valid Until : ${quotation.validUntil}

📌 Status : ${quotation.status}

📝 Terms :

${quotation.terms || "-"}`

    );

}

// =====================================
// Edit Quotation
// =====================================

function editQuotation(index){

    const quotation = quotations[index];

    document.getElementById("quotationCustomer").value =
    quotation.customerIndex;

    document.getElementById("quotationDate").value =
    quotation.date;

    document.getElementById("quotationProduct").value =
    quotation.product;

    document.getElementById("quotationQuantity").value =
    quotation.quantity;

    document.getElementById("quotationUnitPrice").value =
    quotation.unitPrice;

    document.getElementById("quotationDiscount").value =
    quotation.discount;

    document.getElementById("quotationTax").value =
    quotation.tax;

    document.getElementById("quotationTotal").value =
    quotation.total;

    document.getElementById("validUntil").value =
    quotation.validUntil;

    document.getElementById("quotationStatus").value =
    quotation.status;

    document.getElementById("quotationTerms").value =
    quotation.terms;

    editIndex = index;

    document.querySelector(
    "#quotationForm button[type='submit']"
    ).textContent =
    "✏️ Update Quotation";

    showToast(
        "Edit Mode Enabled",
        "info"
    );

}

// =====================================
// Delete Quotation
// =====================================

function deleteQuotation(index){

    if(!confirm(
        "Delete this quotation?"
    )){

        return;

    }

    quotations.splice(index,1);

    localStorage.setItem(
        "quotations",
        JSON.stringify(quotations)
    );

    loadQuotations();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    editIndex = -1;

    document.querySelector(
    "#quotationForm button[type='submit']"
    ).textContent =
    "💾 Save Quotation";

    showToast(
        "Quotation Deleted Successfully",
        "success"
    );

}

// =====================================
// Print Quotation
// =====================================

function printQuotation(index){

    const quotation = quotations[index];

    const printData =

`******** QUOTATION ********

Quotation No : ${quotation.quotationNumber}

Customer : ${quotation.customer}

----------------------------

Product : ${quotation.product}

Quantity : ${quotation.quantity}

Unit Price : ₹${Number(quotation.unitPrice).toFixed(2)}

Discount : ₹${Number(quotation.discount).toFixed(2)}

Tax : ₹${Number(quotation.tax).toFixed(2)}

----------------------------

Grand Total : ₹${Number(quotation.total).toFixed(2)}

Date : ${quotation.date}

Valid Until : ${quotation.validUntil}

Status : ${quotation.status}

Terms :

${quotation.terms || "-"}

****************************`;

    alert(printData);

}

// =====================================
// Convert to Sales Order
// =====================================

function convertToSalesOrder(index){

    const quotation = quotations[index];

    let salesOrders =
    JSON.parse(localStorage.getItem("salesOrders")) || [];

    salesOrders.push({

        id:Date.now(),

        soNumber:"SO-"+Date.now(),

        customer:quotation.customer,

        customerIndex:quotation.customerIndex,

        date:new Date().toISOString().split("T")[0],

        product:quotation.product,

        quantity:quotation.quantity,

        unitPrice:quotation.unitPrice,

        total:quotation.total,

        deliveryDate:"",

        status:"Pending",

        notes:"Converted From "+quotation.quotationNumber

    });

    localStorage.setItem(
        "salesOrders",
        JSON.stringify(salesOrders)
    );

    showToast(
        "Converted To Sales Order",
        "success"
    );

}
// =====================================
// BUSINESSOS V11
// Quotation Module
// Part 4
// Refresh + Dashboard
// =====================================

// Refresh Quotations
function refreshQuotations(){

    quotations =
    JSON.parse(localStorage.getItem("quotations")) || [];

    loadQuotations();

}

// =====================================
// Refresh Window Focus
// =====================================

window.addEventListener("focus",function(){

    refreshQuotations();

});

// =====================================
// Refresh Storage Change
// =====================================

window.addEventListener("storage",function(){

    refreshQuotations();

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
// Quotation Form Submit
// =====================================

document
.getElementById("quotationForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    saveQuotation();

    updateDashboard();

});

// =====================================
// Set Today's Date
// =====================================

const quotationDate =
document.getElementById("quotationDate");

if(quotationDate){

    quotationDate.value =
    new Date().toISOString().split("T")[0];

}

// =====================================
// Initial Refresh
// =====================================

refreshQuotations();

console.log(
"BusinessOS Quotation Module Loaded"
);