// =====================================
// BUSINESSOS V11
// Suppliers Module (Firebase)
// Part 1
// Setup + Load Suppliers
// =====================================

// Firestore Collection
const suppliersRef = db.collection("suppliers");

// Supplier List
let suppliers = [];

// Edit Supplier ID
let editId = null;

// =====================================
// Start
// =====================================

window.onload = function () {

    loadSuppliers();

};

// =====================================
// Load Suppliers From Firestore
// =====================================

async function loadSuppliers() {

    const list = document.getElementById("supplierTable");

    if (!list) return;

    list.innerHTML = "";

    suppliers = [];

    try {

        const snapshot = await suppliersRef
            .orderBy("name")
            .get();

        snapshot.forEach((doc) => {

            suppliers.push({

                id: doc.id,

                ...doc.data()

            });

        });

        if (suppliers.length === 0) {

            list.innerHTML = `

<div class="list-card">

<h3>🏭 No Supplier Found</h3>

<p>Add your first supplier.</p>

</div>

`;

            return;

        }

        suppliers.forEach((supplier, index) => {

            const statusBadge =

            supplier.status === "Active"

            ? `<span class="success-badge">🟢 Active</span>`

            : `<span class="danger-badge">🔴 Inactive</span>`;

            list.innerHTML += `

<div class="list-card">

<h3>🏭 ${supplier.name}</h3>

<div class="list-item">

<span class="list-label">

📞 Phone

</span>

<span class="list-value">

${supplier.phone || "-"}

</span>

</div>

<div class="list-item">

<span class="list-label">

📧 Email

</span>

<span class="list-value">

${supplier.email || "-"}

</span>

</div>

<div class="list-item">

<span class="list-label">

📍 Address

</span>

<span class="list-value">

${supplier.address || "-"}

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
onclick="viewSupplier(${index})">

👁️ View

</button>

<button
class="edit-btn"
onclick="editSupplier(${index})">

✏️ Edit

</button>

<button
class="delete-btn"
onclick="deleteSupplier('${supplier.id}')">

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

console.log("✅ Suppliers Firebase Part 1 Loaded");
// =====================================
// BUSINESSOS V11
// Suppliers Module (Firebase)
// Part 2
// Save + Update Supplier
// =====================================

async function saveSupplier() {

    const supplier = {

        name: document.getElementById("supplierName").value.trim(),

        phone: document.getElementById("supplierPhone").value.trim(),

        email: document.getElementById("supplierEmail").value.trim(),

        address: document.getElementById("supplierAddress").value.trim(),

        status: document.getElementById("supplierStatus").value,

        createdAt: firebase.firestore.FieldValue.serverTimestamp()

    };

    if (supplier.name === "") {

        alert("Enter Supplier Name");

        return;

    }

    try {

        if (editId === null) {

            await suppliersRef.add(supplier);

            alert("✅ Supplier Added Successfully");

        } else {

            await suppliersRef.doc(editId).update({

                name: supplier.name,

                phone: supplier.phone,

                email: supplier.email,

                address: supplier.address,

                status: supplier.status

            });

            alert("✅ Supplier Updated Successfully");

            editId = null;

        }

        document.getElementById("supplierForm").reset();

        loadSuppliers();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// =====================================
// Supplier Form Submit
// =====================================

document
.getElementById("supplierForm")
.addEventListener("submit", function (e) {

    e.preventDefault();

    saveSupplier();

});
// =====================================
// BUSINESSOS V11
// Suppliers Module (Firebase)
// Part 3
// View + Edit + Delete Supplier
// =====================================

// View Supplier
function viewSupplier(index){

    const supplier = suppliers[index];

    alert(

`🏭 Supplier : ${supplier.name}

📞 Phone : ${supplier.phone || "-"}

📧 Email : ${supplier.email || "-"}

📍 Address : ${supplier.address || "-"}

📌 Status : ${supplier.status}`

    );

}

// =====================================
// Edit Supplier
// =====================================

function editSupplier(index){

    const supplier = suppliers[index];

    document.getElementById("supplierName").value =
    supplier.name;

    document.getElementById("supplierPhone").value =
    supplier.phone;

    document.getElementById("supplierEmail").value =
    supplier.email;

    document.getElementById("supplierAddress").value =
    supplier.address;

    document.getElementById("supplierStatus").value =
    supplier.status;

    editId = supplier.id;

    document.querySelector("#supplierForm button[type='submit']").textContent =
    "✏️ Update Supplier";

    alert("✏️ Edit Mode Enabled");

}

// =====================================
// Delete Supplier
// =====================================

async function deleteSupplier(id){

    if(!confirm("Delete this Supplier?")){

        return;

    }

    try{

        await suppliersRef.doc(id).delete();

        alert("🗑️ Supplier Deleted Successfully");

        loadSuppliers();

        editId = null;

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}
// =====================================
// BUSINESSOS V11
// Suppliers Module (Firebase)
// Part 4
// Search + Refresh + Live Update
// =====================================

// Search Supplier
function searchSupplier(){

    const value =
    document
    .getElementById("searchSupplier")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#supplierTable .list-card")
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
// Refresh Suppliers
// =====================================

function refreshSuppliers(){

    loadSuppliers();

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

    refreshSuppliers();

});

// =====================================
// Firestore Live Update
// =====================================

suppliersRef.onSnapshot(function(){

    loadSuppliers();

});

// =====================================
// Auto Refresh Every 10 Seconds
// =====================================

setInterval(function(){

    refreshSuppliers();

},10000);

// =====================================
// Initial Load
// =====================================

refreshSuppliers();

console.log(
"✅ BusinessOS Suppliers Firebase Module Loaded"
);