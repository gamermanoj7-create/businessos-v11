// =====================================
// BUSINESSOS V11
// Customers Module (Firebase)
// Part 1
// Setup + Load Customers
// =====================================

// Firestore Collection
const customersRef = db.collection("customers");

// Customer List
let customers = [];

// Edit Customer ID
let editId = null;

// =====================================
// Start
// =====================================

window.onload = function () {

    loadCustomers();

};

// =====================================
// Load Customers From Firestore
// =====================================

async function loadCustomers() {

    const list = document.getElementById("customerTable");

    if (!list) return;

    list.innerHTML = "";

    customers = [];

    try {

        const snapshot = await customersRef
            .orderBy("name")
            .get();

        snapshot.forEach((doc) => {

            customers.push({

                id: doc.id,

                ...doc.data()

            });

        });

        if (customers.length === 0) {

            list.innerHTML = `

<div class="list-card">

<h3>👥 No Customer Found</h3>

<p>Add your first customer.</p>

</div>

`;

            return;

        }

        customers.forEach((customer, index) => {

            const statusBadge =

            customer.status === "Active"

            ? `<span class="success-badge">🟢 Active</span>`

            : `<span class="danger-badge">🔴 Inactive</span>`;

            list.innerHTML += `

<div class="list-card">

<h3>👤 ${customer.name}</h3>

<div class="list-item">

<span class="list-label">

📞 Phone

</span>

<span class="list-value">

${customer.phone || "-"}

</span>

</div>

<div class="list-item">

<span class="list-label">

📧 Email

</span>

<span class="list-value">

${customer.email || "-"}

</span>

</div>

<div class="list-item">

<span class="list-label">

📍 Address

</span>

<span class="list-value">

${customer.address || "-"}

</span>

</div>

<div class="list-item">

<span class="list-label">

Status

</span>

<span class="list-value">

${statusBadge}

</span>

</div>

<div class="card-actions">

<button
class="view-btn"
onclick="viewCustomer(${index})">

👁️ View

</button>

<button
class="edit-btn"
onclick="editCustomer(${index})">

✏️ Edit

</button>

<button
class="delete-btn"
onclick="deleteCustomer('${customer.id}')">

🗑️ Delete

</button>

</div>

</div>

`;

        });

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

console.log("✅ Customers Firebase Part 1 Loaded");
// =====================================
// BUSINESSOS V11
// Customers Module (Firebase)
// Part 2
// Save + Update Customer
// =====================================

async function saveCustomer() {

    const customer = {

        name: document.getElementById("customerName").value.trim(),

        phone: document.getElementById("customerPhone").value.trim(),

        email: document.getElementById("customerEmail").value.trim(),

        address: document.getElementById("customerAddress").value.trim(),

        status: document.getElementById("customerStatus").value,

        createdAt: firebase.firestore.FieldValue.serverTimestamp()

    };

    if (customer.name === "") {

        alert("Enter Customer Name");

        return;

    }

    try {

        if (editId === null) {

            await customersRef.add(customer);

            alert("✅ Customer Added Successfully");

        } else {

            await customersRef.doc(editId).update({

                name: customer.name,

                phone: customer.phone,

                email: customer.email,

                address: customer.address,

                status: customer.status

            });

            alert("✅ Customer Updated Successfully");

            editId = null;

        }

        document.getElementById("customerForm").reset();

        loadCustomers();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// =====================================
// Customer Form Submit
// =====================================

document
.getElementById("customerForm")
.addEventListener("submit", function (e) {

    e.preventDefault();

    saveCustomer();

});
// =====================================
// BUSINESSOS V11
// Customers Module (Firebase)
// Part 3
// View + Edit + Delete Customer
// =====================================

// View Customer
function viewCustomer(index){

    const customer = customers[index];

    alert(

`👤 Customer : ${customer.name}

📞 Phone : ${customer.phone || "-"}

📧 Email : ${customer.email || "-"}

📍 Address : ${customer.address || "-"}

📌 Status : ${customer.status}`

    );

}

// =====================================
// Edit Customer
// =====================================

function editCustomer(index){

    const customer = customers[index];

    document.getElementById("customerName").value =
    customer.name;

    document.getElementById("customerPhone").value =
    customer.phone;

    document.getElementById("customerEmail").value =
    customer.email;

    document.getElementById("customerAddress").value =
    customer.address;

    document.getElementById("customerStatus").value =
    customer.status;

    editId = customer.id;

    document.querySelector("#customerForm button[type='submit']").textContent =
    "✏️ Update Customer";

    alert("✏️ Edit Mode Enabled");

}

// =====================================
// Delete Customer
// =====================================

async function deleteCustomer(id){

    if(!confirm("Delete this Customer?")){

        return;

    }

    try{

        await customersRef.doc(id).delete();

        alert("🗑️ Customer Deleted Successfully");

        loadCustomers();

        editId = null;

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}
// =====================================
// BUSINESSOS V11
// Customers Module (Firebase)
// Part 4
// Search + Refresh + Live Update
// =====================================

// Search Customer
function searchCustomer(){

    const value =
    document
    .getElementById("searchCustomer")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#customerTable .list-card")
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
// Refresh Customers
// =====================================

function refreshCustomers(){

    loadCustomers();

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

    refreshCustomers();

});

// =====================================
// Firestore Live Update
// =====================================

customersRef.onSnapshot(function(){

    loadCustomers();

});

// =====================================
// Auto Refresh Every 10 Seconds
// =====================================

setInterval(function(){

    refreshCustomers();

},10000);

// =====================================
// Initial Load
// =====================================

refreshCustomers();

console.log(
"✅ BusinessOS Customers Firebase Module Loaded"
);