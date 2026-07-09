// =====================================
// BUSINESSOS V11
// Inventory Module
// Part 1
// Firebase Setup + Load Inventory
// =====================================

// Firestore
const inventoryRef = db.collection("inventory");

// Variables
let inventory = [];
let editInventoryId = null;

// =====================================
// Initialize
// =====================================

window.onload = function(){

    initializeInventory();

};

function initializeInventory(){

    loadInventory();

    console.log(
        "✅ Inventory Module Loaded"
    );

}

// =====================================
// Load Inventory
// =====================================

async function loadInventory(){

    const table =
    document.getElementById("inventoryTable");

    if(!table) return;

    table.innerHTML = "";

    inventory = [];

    try{

        const snapshot =
        await inventoryRef
        .orderBy("product")
        .get();

        snapshot.forEach((doc)=>{

            inventory.push({

                id:doc.id,

                ...doc.data()

            });

        });

        updateSummaryCards();

        renderInventory();

    }

    catch(error){

        console.error(error);

        showToast(
            "Failed to load inventory",
            "error"
        );

    }

}

// =====================================
// Render Inventory
// =====================================

function renderInventory(){

    const table =
    document.getElementById("inventoryTable");

    if(!table) return;

    table.innerHTML = "";

    if(inventory.length===0){

        table.innerHTML = `

<div class="list-card">

<h3>📦 No Inventory Found</h3>

<p>Add your first product.</p>

</div>

`;

        return;

    }

    inventory.forEach((item,index)=>{

        const badge =

        Number(item.quantity)<=5

        ?

        `<span class="danger-badge">
        Low Stock
        </span>`

        :

        `<span class="success-badge">
        In Stock
        </span>`;

        table.innerHTML += `

<div class="list-card">

<h3>${item.product}</h3>

<div class="list-item">

<span>Category</span>

<span>${item.category || "-"}</span>

</div>

<div class="list-item">

<span>Quantity</span>

<span>

${item.quantity}

${badge}

</span>

</div>

<div class="list-item">

<span>Location</span>

<span>${item.location || "-"}</span>

</div>

<div class="card-actions">

<button
class="view-btn"
onclick="viewInventory(${index})">

👁 View

</button>

<button
class="edit-btn"
onclick="editInventory(${index})">

✏ Edit

</button>

<button
class="delete-btn"
onclick="deleteInventory('${item.id}')">

🗑 Delete

</button>

</div>

</div>

`;

    });

}
// =====================================
// BUSINESSOS V11
// Inventory Module
// Part 2
// Save + Update Inventory
// =====================================

// Save Inventory
async function saveInventory(){

    const product =
    document.getElementById("productName").value.trim();

    const category =
    document.getElementById("category").value.trim();

    const quantity =
    Number(
    document.getElementById("quantity").value
    );

    const location =
    document.getElementById("location").value.trim();

    if(product===""){

        showToast(
            "Enter Product Name",
            "warning"
        );

        return;

    }

    if(quantity<0){

        showToast(
            "Enter Valid Quantity",
            "warning"
        );

        return;

    }

    const item={

        product:product,

        category:category,

        quantity:quantity,

        location:location,

        updatedAt:
        firebase.firestore.FieldValue.serverTimestamp()

    };

    try{

        if(editInventoryId===null){

            item.createdAt =
            firebase.firestore.FieldValue.serverTimestamp();

            await inventoryRef.add(item);

            showToast(
                "Inventory Added Successfully",
                "success"
            );

        }else{

            await inventoryRef
            .doc(editInventoryId)
            .update(item);

            showToast(
                "Inventory Updated Successfully",
                "success"
            );

            editInventoryId=null;

        }

        resetInventoryForm();

        loadInventory();

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

function resetInventoryForm(){

    document
    .getElementById("inventoryForm")
    .reset();

    editInventoryId=null;

    const button =
    document.querySelector(
    "#inventoryForm button[type='submit']"
    );

    if(button){

        button.textContent =
        "💾 Save Inventory";

    }

}

// =====================================
// Submit Form
// =====================================

document
.getElementById("inventoryForm")
.addEventListener(
"submit",
function(e){

    e.preventDefault();

    saveInventory();

});
// =====================================
// BUSINESSOS V11
// Inventory Module
// Part 3
// View + Edit + Delete
// =====================================

// View Inventory
function viewInventory(index){

    const item = inventory[index];

    if(!item){

        showToast(
            "Inventory Not Found",
            "error"
        );

        return;

    }

    alert(

`📦 Product : ${item.product}

📂 Category : ${item.category || "-"}

📦 Quantity : ${item.quantity}

📍 Location : ${item.location || "-"}`

    );

}

// =====================================
// Edit Inventory
// =====================================

function editInventory(index){

    const item = inventory[index];

    if(!item){

        showToast(
            "Inventory Not Found",
            "error"
        );

        return;

    }

    document.getElementById("productName").value =
    item.product;

    document.getElementById("category").value =
    item.category || "";

    document.getElementById("quantity").value =
    item.quantity;

    document.getElementById("location").value =
    item.location || "";

    editInventoryId = item.id;

    const button =
    document.querySelector(
    "#inventoryForm button[type='submit']"
    );

    if(button){

        button.textContent =
        "✏️ Update Inventory";

    }

    showToast(
        "Edit Mode Enabled",
        "info"
    );

}

// =====================================
// Delete Inventory
// =====================================

async function deleteInventory(id){

    if(!confirm(
        "Delete this inventory item?"
    )){

        return;

    }

    try{

        await inventoryRef
        .doc(id)
        .delete();

        showToast(
            "Inventory Deleted Successfully",
            "success"
        );

        editInventoryId = null;

        resetInventoryForm();

        loadInventory();

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
// BUSINESSOS V11
// Inventory Module
// Part 4
// Search + Summary + Live Update
// =====================================

// Search Inventory
function searchInventory(){

    const value =
    document
    .getElementById("searchInventory")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#inventoryTable .list-card")
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
// Summary Cards
// =====================================

function updateSummaryCards(){

    let totalProducts = inventory.length;

    let totalStock = 0;

    let lowStock = 0;

    let inventoryValue = 0;

    inventory.forEach(item=>{

        const qty =
        Number(item.quantity || 0);

        const price =
        Number(item.buyPrice || item.price || 0);

        totalStock += qty;

        inventoryValue += qty * price;

        if(qty<=5){

            lowStock++;

        }

    });

    document.getElementById("inventoryProducts").textContent =
    totalProducts;

    document.getElementById("inventoryStock").textContent =
    totalStock;

    document.getElementById("inventoryLowStock").textContent =
    lowStock;

    document.getElementById("inventoryValue").textContent =
    "₹" + inventoryValue.toFixed(2);

}

// =====================================
// Check Low Stock
// =====================================

function checkLowStock(){

    const lowItems =
    inventory.filter(item=>

        Number(item.quantity)<=5

    );

    if(lowItems.length===0){

        showToast(
            "No Low Stock Items",
            "success"
        );

        return;

    }

    showToast(
        lowItems.length +
        " Low Stock Item(s) Found",
        "warning"
    );

}

// =====================================
// Refresh Inventory
// =====================================

function refreshInventory(){

    loadInventory();

}

// =====================================
// Live Firestore Update
// =====================================

inventoryRef.onSnapshot(function(){

    loadInventory();

});

// =====================================
// Window Focus Refresh
// =====================================

window.addEventListener(
"focus",
refreshInventory
);

// =====================================
// Module Ready
// =====================================

console.log(
"✅ BusinessOS V11 Inventory Module Ready"
);