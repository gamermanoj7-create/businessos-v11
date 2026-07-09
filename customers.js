// =====================================
// BUSINESSOS V13
// Customers Module
// Part 1
// Initialize + Load Customers
// =====================================

// Firestore Collection
const customersRef = db.collection("customers");

// Customers Array
let customers = [];

// Edit Customer ID
let editId = null;

// =====================================
// Start Module
// =====================================

window.addEventListener("load", function(){

    loadCustomers();

});

// =====================================
// Load Customers
// =====================================

async function loadCustomers(){

    const table =
    document.getElementById("customerTable");

    if(!table) return;

    table.innerHTML = "";

    customers = [];

    try{

        const snapshot =
        await customersRef
        .orderBy("name")
        .get();

        snapshot.forEach((doc)=>{

            customers.push({

                id: doc.id,

                ...doc.data()

            });

        });

        updateCustomerStats();

        if(customers.length===0){

            table.innerHTML = `

<div class="list-card">

<h3>👥 No Customer Found</h3>

<p>Add your first customer.</p>

</div>

`;

            return;

        }

        customers.forEach((customer,index)=>{

            const badge =

            customer.status==="Active"

            ?

            "🟢 Active"

            :

            "🔴 Inactive";

            table.innerHTML += `

<div class="list-card">

<h3>👤 ${customer.name}</h3>

<div class="list-item">

<span>📞 Phone</span>

<span>${customer.phone || "-"}</span>

</div>

<div class="list-item">

<span>📧 Email</span>

<span>${customer.email || "-"}</span>

</div>

<div class="list-item">

<span>💰 Due</span>

<span>₹${Number(customer.due || 0).toFixed(2)}</span>

</div>

<div class="list-item">

<span>✅ Paid</span>

<span>₹${Number(customer.paid || 0).toFixed(2)}</span>

</div>

<div class="list-item">

<span>Status</span>

<span>${badge}</span>

</div>

<div class="card-actions">

<button
class="view-btn"
onclick="viewCustomer(${index})">

👁 View

</button>

<button
class="edit-btn"
onclick="editCustomer(${index})">

✏ Edit

</button>

<button
class="delete-btn"
onclick="deleteCustomer('${customer.id}')">

🗑 Delete

</button>

</div>

</div>

`;

        });

    }

    catch(error){

        console.error(error);

        showToast(
            error.message,
            "error"
        );

    }

}
// =====================================
// BUSINESSOS V13
// Customers Module
// Part 2
// Save + Update Customer
// =====================================

async function saveCustomer(){

    const customer = {

        name:
        document
        .getElementById("customerName")
        .value
        .trim(),

        phone:
        document
        .getElementById("customerPhone")
        .value
        .trim(),

        email:
        document
        .getElementById("customerEmail")
        .value
        .trim(),

        address:
        document
        .getElementById("customerAddress")
        .value
        .trim(),

        due:
        Number(
        document
        .getElementById("customerDue")
        .value || 0
        ),

        paid:
        Number(
        document
        .getElementById("customerPaid")
        .value || 0
        ),

        status:
        document
        .getElementById("customerStatus")
        .value,

        updatedAt:
        firebase.firestore
        .FieldValue
        .serverTimestamp()

    };

    if(customer.name===""){

        showToast(
            "Customer Name Required",
            "warning"
        );

        return;

    }

    try{

        showLoading();

        if(editId===null){

            customer.createdAt =
            firebase.firestore
            .FieldValue
            .serverTimestamp();

            await customersRef.add(customer);

            showToast(
                "Customer Added Successfully",
                "success"
            );

        }else{

            await customersRef
            .doc(editId)
            .update(customer);

            showToast(
                "Customer Updated Successfully",
                "success"
            );

            editId = null;

            document
            .querySelector(
            "#customerForm button[type='submit']"
            )
            .textContent =
            "💾 Save Customer";

        }

        document
        .getElementById("customerForm")
        .reset();

        hideLoading();

        loadCustomers();

    }

    catch(error){

        hideLoading();

        console.error(error);

        showToast(
            error.message,
            "error"
        );

    }

}

// =====================================
// Form Submit
// =====================================

document
.getElementById("customerForm")
.addEventListener(
"submit",
function(e){

    e.preventDefault();

    saveCustomer();

});
// =====================================
// BUSINESSOS V13
// Customers Module
// Part 3
// View + Edit + Delete + Reset
// =====================================

// View Customer
function viewCustomer(index){

    const customer = customers[index];

    if(!customer){

        showToast(
            "Customer Not Found",
            "error"
        );

        return;

    }

    alert(

`👤 Customer Details

Name : ${customer.name}

Phone : ${customer.phone || "-"}

Email : ${customer.email || "-"}

Address : ${customer.address || "-"}

Due : ₹${Number(customer.due || 0).toFixed(2)}

Paid : ₹${Number(customer.paid || 0).toFixed(2)}

Status : ${customer.status}

`

    );

}

// =====================================
// Edit Customer
// =====================================

function editCustomer(index){

    const customer = customers[index];

    if(!customer){

        showToast(
            "Customer Not Found",
            "error"
        );

        return;

    }

    document.getElementById("customerName").value =
    customer.name || "";

    document.getElementById("customerPhone").value =
    customer.phone || "";

    document.getElementById("customerEmail").value =
    customer.email || "";

    document.getElementById("customerAddress").value =
    customer.address || "";

    document.getElementById("customerDue").value =
    customer.due || 0;

    document.getElementById("customerPaid").value =
    customer.paid || 0;

    document.getElementById("customerStatus").value =
    customer.status || "Active";

    editId = customer.id;

    document
    .querySelector("#customerForm button[type='submit']")
    .textContent =
    "✏️ Update Customer";

    showToast(
        "Edit Mode Enabled",
        "success"
    );

}

// =====================================
// Delete Customer
// =====================================

async function deleteCustomer(id){

    if(!confirm(
        "Delete this customer?"
    )){

        return;

    }

    try{

        await customersRef
        .doc(id)
        .delete();

        showToast(
            "Customer Deleted Successfully",
            "success"
        );

        loadCustomers();

    }

    catch(error){

        console.error(error);

        showToast(
            error.message,
            "error"
        );

    }

}

// =====================================
// Reset Form
// =====================================

function resetCustomerForm(){

    editId = null;

    document
    .getElementById("customerForm")
    .reset();

    document
    .querySelector("#customerForm button[type='submit']")
    .textContent =
    "💾 Save Customer";

    showToast(
        "Form Reset",
        "success"
    );

}
// =====================================
// BUSINESSOS V13
// Customers Module
// Part 4
// Search + Statistics + Live Update
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

        ?

        ""

        :

        "none";

    });

}

// =====================================
// Customer Statistics
// =====================================

function updateCustomerStats(){

    let active = 0;

    let inactive = 0;

    customers.forEach(customer=>{

        if(customer.status==="Active"){

            active++;

        }else{

            inactive++;

        }

    });

    document
    .getElementById("totalCustomers")
    .textContent =
    customers.length;

    document
    .getElementById("activeCustomers")
    .textContent =
    active;

    document
    .getElementById("inactiveCustomers")
    .textContent =
    inactive;

}

// =====================================
// Refresh Customers
// =====================================

function refreshCustomers(){

    loadCustomers();

}

// =====================================
// Firestore Live Update
// =====================================

customersRef.onSnapshot(function(){

    loadCustomers();

});

// =====================================
// Window Focus Refresh
// =====================================

window.addEventListener(

"focus",

function(){

    loadCustomers();

});

// =====================================
// Initialize Module
// =====================================

function initCustomersModule(){

    loadCustomers();

    console.log(

        "✅ BusinessOS V13 Customers Module Ready"

    );

}

// =====================================
// Start Module
// =====================================

initCustomersModule();