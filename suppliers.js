// =====================================
// BUSINESSOS V13
// Suppliers Module
// Part 1
// Initialize + Load Suppliers
// =====================================

// Firestore Collection
const suppliersRef = db.collection("suppliers");

// Supplier Array
let suppliers = [];

// Edit Supplier ID
let editId = null;

// =====================================
// Initialize Module
// =====================================

window.addEventListener("load", function(){

    loadSuppliers();

});

// =====================================
// Load Suppliers
// =====================================

async function loadSuppliers(){

    const table =
    document.getElementById("supplierTable");

    if(!table) return;

    table.innerHTML = "";

    suppliers = [];

    try{

        const snapshot =
        await suppliersRef
        .orderBy("name")
        .get();

        snapshot.forEach((doc)=>{

            suppliers.push({

                id: doc.id,

                ...doc.data()

            });

        });

        updateSupplierStats();

        if(suppliers.length===0){

            table.innerHTML = `

<div class="list-card">

<h3>🏭 No Supplier Found</h3>

<p>Add your first supplier.</p>

</div>

`;

            return;

        }

        suppliers.forEach((supplier,index)=>{

            const badge =

            supplier.status==="Active"

            ?

            "🟢 Active"

            :

            "🔴 Inactive";

            table.innerHTML += `

<div class="list-card">

<h3>🏭 ${supplier.name}</h3>

<div class="list-item">

<span>📞 Phone</span>

<span>${supplier.phone || "-"}</span>

</div>

<div class="list-item">

<span>📧 Email</span>

<span>${supplier.email || "-"}</span>

</div>

<div class="list-item">

<span>🧾 GST</span>

<span>${supplier.gst || "-"}</span>

</div>

<div class="list-item">

<span>📍 Address</span>

<span>${supplier.address || "-"}</span>

</div>

<div class="list-item">

<span>Status</span>

<span>${badge}</span>

</div>

<div class="card-actions">

<button
class="view-btn"
onclick="viewSupplier(${index})">

👁 View

</button>

<button
class="edit-btn"
onclick="editSupplier(${index})">

✏ Edit

</button>

<button
class="delete-btn"
onclick="deleteSupplier('${supplier.id}')">

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
// Suppliers Module
// Part 2
// Save + Update Supplier
// =====================================

async function saveSupplier(){

    const supplier = {

        name:
        document
        .getElementById("supplierName")
        .value
        .trim(),

        phone:
        document
        .getElementById("supplierPhone")
        .value
        .trim(),

        email:
        document
        .getElementById("supplierEmail")
        .value
        .trim(),

        address:
        document
        .getElementById("supplierAddress")
        .value
        .trim(),

        gst:
        document
        .getElementById("supplierGST")
        .value
        .trim(),

        status:
        document
        .getElementById("supplierStatus")
        .value,

        updatedAt:
        firebase.firestore
        .FieldValue
        .serverTimestamp()

    };

    if(supplier.name===""){

        showToast(
            "Supplier Name Required",
            "warning"
        );

        return;

    }

    try{

        showLoading();

        if(editId===null){

            supplier.createdAt =
            firebase.firestore
            .FieldValue
            .serverTimestamp();

            await suppliersRef.add(supplier);

            showToast(
                "Supplier Added Successfully",
                "success"
            );

        }else{

            await suppliersRef
            .doc(editId)
            .update(supplier);

            showToast(
                "Supplier Updated Successfully",
                "success"
            );

            editId = null;

            document
            .querySelector(
            "#supplierForm button[type='submit']"
            )
            .textContent =
            "💾 Save Supplier";

        }

        document
        .getElementById("supplierForm")
        .reset();

        hideLoading();

        loadSuppliers();

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
// Supplier Form Submit
// =====================================

document
.getElementById("supplierForm")
.addEventListener(
"submit",
function(e){

    e.preventDefault();

    saveSupplier();

});
// =====================================
// BUSINESSOS V13
// Suppliers Module
// Part 3
// View + Edit + Delete + Reset
// =====================================

// View Supplier
function viewSupplier(index){

    const supplier = suppliers[index];

    if(!supplier){

        showToast(
            "Supplier Not Found",
            "error"
        );

        return;

    }

    alert(

`🏭 Supplier Details

Name : ${supplier.name}

Phone : ${supplier.phone || "-"}

Email : ${supplier.email || "-"}

GST : ${supplier.gst || "-"}

Address : ${supplier.address || "-"}

Status : ${supplier.status}

`

    );

}

// =====================================
// Edit Supplier
// =====================================

function editSupplier(index){

    const supplier = suppliers[index];

    if(!supplier){

        showToast(
            "Supplier Not Found",
            "error"
        );

        return;

    }

    document.getElementById("supplierName").value =
    supplier.name || "";

    document.getElementById("supplierPhone").value =
    supplier.phone || "";

    document.getElementById("supplierEmail").value =
    supplier.email || "";

    document.getElementById("supplierAddress").value =
    supplier.address || "";

    document.getElementById("supplierGST").value =
    supplier.gst || "";

    document.getElementById("supplierStatus").value =
    supplier.status || "Active";

    editId = supplier.id;

    document
    .querySelector("#supplierForm button[type='submit']")
    .textContent =
    "✏️ Update Supplier";

    showToast(
        "Edit Mode Enabled",
        "success"
    );

}

// =====================================
// Delete Supplier
// =====================================

async function deleteSupplier(id){

    if(!confirm(
        "Delete this supplier?"
    )){

        return;

    }

    try{

        await suppliersRef
        .doc(id)
        .delete();

        showToast(
            "Supplier Deleted Successfully",
            "success"
        );

        loadSuppliers();

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

function resetSupplierForm(){

    editId = null;

    document
    .getElementById("supplierForm")
    .reset();

    document
    .querySelector("#supplierForm button[type='submit']")
    .textContent =
    "💾 Save Supplier";

    showToast(
        "Form Reset",
        "success"
    );

}
// =====================================
// BUSINESSOS V13
// Suppliers Module
// Part 4
// Search + Statistics + Live Update
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

        ?

        ""

        :

        "none";

    });

}

// =====================================
// Supplier Statistics
// =====================================

function updateSupplierStats(){

    let active = 0;

    let inactive = 0;

    suppliers.forEach(supplier=>{

        if(supplier.status==="Active"){

            active++;

        }else{

            inactive++;

        }

    });

    const total =
    document.getElementById("totalSuppliers");

    if(total){

        total.textContent =
        suppliers.length;

    }

}

// =====================================
// Refresh Suppliers
// =====================================

function refreshSuppliers(){

    loadSuppliers();

}

// =====================================
// Firestore Live Update
// =====================================

suppliersRef.onSnapshot(function(){

    loadSuppliers();

});

// =====================================
// Window Focus Refresh
// =====================================

window.addEventListener(

"focus",

function(){

    loadSuppliers();

});

// =====================================
// Initialize Module
// =====================================

function initSuppliersModule(){

    loadSuppliers();

    console.log(

        "✅ BusinessOS V13 Suppliers Module Ready"

    );

}

// =====================================
// Start Module
// =====================================

initSuppliersModule();