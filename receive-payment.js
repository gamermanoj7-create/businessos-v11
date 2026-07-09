// =====================================
// BUSINESSOS V11
// Receive Payment Module (Firebase)
// Part 1
// Setup + Load Payments
// =====================================

// Firestore Collection
const paymentRef = db.collection("payments");

// Data
let payments = [];
let customers = [];
let editId = null;

// =====================================
// Start
// =====================================

window.onload = function () {

    loadCustomers();

    loadPayments();

};

// =====================================
// Load Customers
// =====================================

async function loadCustomers() {

    const select =
    document.getElementById("paymentCustomer");

    if (!select) return;

    select.innerHTML =
    `<option value="">👤 Select Customer</option>`;

    customers = [];

    try {

        const snapshot =
        await db.collection("customers")
        .orderBy("name")
        .get();

        snapshot.forEach((doc) => {

            const customer = {

                id: doc.id,

                ...doc.data()

            };

            customers.push(customer);

            select.innerHTML +=

            `<option value="${customer.name}">
            ${customer.name}
            </option>`;

        });

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// =====================================
// Load Payments
// =====================================

async function loadPayments() {

    const list =
    document.getElementById("paymentTable");

    if (!list) return;

    list.innerHTML = "";

    payments = [];

    try {

        const snapshot =
        await paymentRef
        .orderBy("createdAt", "desc")
        .get();

        snapshot.forEach((doc) => {

            payments.push({

                id: doc.id,

                ...doc.data()

            });

        });

        if (payments.length === 0) {

            list.innerHTML = `

<div class="list-card">

<h3>💳 No Payment Found</h3>

<p>Receive your first payment.</p>

</div>

`;

            return;

        }

        payments.forEach((payment, index) => {

            list.innerHTML += `

<div class="list-card">

<h3>👤 ${payment.customer}</h3>

<div class="list-item">

<span class="list-label">

💰 Amount

</span>

<span class="list-value">

₹${Number(payment.amount).toFixed(2)}

</span>

</div>

<div class="list-item">

<span class="list-label">

📅 Date

</span>

<span class="list-value">

${payment.date || "-"}

</span>

</div>

<div class="list-item">

<span class="list-label">

💳 Method

</span>

<span class="list-value">

${payment.method}

</span>

</div>

<div class="card-actions">

<button
class="view-btn"
onclick="viewPayment(${index})">

👁️ View

</button>

<button
class="edit-btn"
onclick="editPayment(${index})">

✏️ Edit

</button>

<button
class="delete-btn"
onclick="deletePayment('${payment.id}')">

🗑️ Delete

</button>

</div>

</div>

`;

        });

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}

console.log("✅ Receive Payment Firebase Part 1 Loaded");
// =====================================
// BUSINESSOS V11
// Receive Payment Module (Firebase)
// Part 2
// Save + Update Payment
// =====================================

async function savePayment() {

    const payment = {

        customer:
        document.getElementById("paymentCustomer").value,

        amount: Number(
        document.getElementById("paymentAmount").value || 0
        ),

        date:
        document.getElementById("paymentDate").value,

        method:
        document.getElementById("paymentMethod").value,

        reference:
        document.getElementById("paymentReference").value.trim(),

        notes:
        document.getElementById("paymentNotes").value.trim(),

        createdAt:
        firebase.firestore.FieldValue.serverTimestamp()

    };

    if(payment.customer===""){

        alert("Select Customer");

        return;

    }

    if(payment.amount<=0){

        alert("Enter Payment Amount");

        return;

    }

    try{

        if(editId===null){

            await paymentRef.add(payment);

            alert("✅ Payment Received Successfully");

        }else{

            await paymentRef.doc(editId).update({

                customer: payment.customer,

                amount: payment.amount,

                date: payment.date,

                method: payment.method,

                reference: payment.reference,

                notes: payment.notes

            });

            alert("✅ Payment Updated Successfully");

            editId = null;

        }

        document
        .getElementById("paymentForm")
        .reset();

        loadPayments();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}

// =====================================
// Payment Form Submit
// =====================================

document
.getElementById("paymentForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    savePayment();

});

console.log("✅ Receive Payment Firebase Part 2 Loaded");
// =====================================
// BUSINESSOS V11
// Receive Payment Module (Firebase)
// Part 3
// View + Edit + Delete Payment
// =====================================

// View Payment
function viewPayment(index){

    const payment = payments[index];

    alert(

`👤 Customer : ${payment.customer}

💰 Amount : ₹${Number(payment.amount).toFixed(2)}

📅 Date : ${payment.date || "-"}

💳 Method : ${payment.method}

🔖 Reference : ${payment.reference || "-"}

📝 Notes : ${payment.notes || "-"}`

    );

}

// =====================================
// Edit Payment
// =====================================

function editPayment(index){

    const payment = payments[index];

    document.getElementById("paymentCustomer").value =
    payment.customer;

    document.getElementById("paymentAmount").value =
    payment.amount;

    document.getElementById("paymentDate").value =
    payment.date;

    document.getElementById("paymentMethod").value =
    payment.method;

    document.getElementById("paymentReference").value =
    payment.reference || "";

    document.getElementById("paymentNotes").value =
    payment.notes || "";

    editId = payment.id;

    document.querySelector("#paymentForm button[type='submit']").textContent =
    "✏️ Update Payment";

    alert("✏️ Edit Mode Enabled");

}

// =====================================
// Delete Payment
// =====================================

async function deletePayment(id){

    if(!confirm("Delete this Payment?")){

        return;

    }

    try{

        await paymentRef.doc(id).delete();

        alert("🗑️ Payment Deleted Successfully");

        loadPayments();

        editId = null;

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}

console.log("✅ Receive Payment Firebase Part 3 Loaded");
// =====================================
// BUSINESSOS V11
// Receive Payment Module (Firebase)
// Part 4
// Search + Refresh + Live Update
// =====================================

// Search Payment
function searchPayment(){

    const value =
    document
    .getElementById("searchPayment")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#paymentTable .list-card")
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
// Refresh Payments
// =====================================

function refreshPayments(){

    loadPayments();

}

// =====================================
// Dashboard Refresh
// =====================================

function updateDashboard(){

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

}

// =====================================
// Window Focus Refresh
// =====================================

window.addEventListener("focus",function(){

    refreshPayments();

});

// =====================================
// Firestore Live Update
// =====================================

paymentRef.onSnapshot(function(){

    loadPayments();

});

// =====================================
// Auto Refresh Every 10 Seconds
// =====================================

setInterval(function(){

    refreshPayments();

},10000);

// =====================================
// Initial Load
// =====================================

refreshPayments();

console.log(
"✅ Receive Payment Firebase Module Completed"
);