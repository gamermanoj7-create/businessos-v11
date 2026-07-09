// =====================================
// BUSINESSOS V11
// Barcode & QR Module
// Part 1
// Setup + Generate Barcode
// =====================================

// Products
let products =
JSON.parse(localStorage.getItem("products")) || [];

// Barcode Records
let barcodes =
JSON.parse(localStorage.getItem("barcodes")) || [];

// Edit Mode
let editIndex = -1;

// =====================================
// Start
// =====================================

window.onload = function(){

    loadProducts();

    loadBarcodes();

};

// =====================================
// Load Products
// =====================================

function loadProducts(){

    const select =
    document.getElementById("barcodeProduct");

    if(!select) return;

    select.innerHTML =
    '<option value="">📦 Select Product</option>';

    products.forEach((product,index)=>{

        select.innerHTML +=

        `<option value="${index}">
        ${product.name}
        </option>`;

    });

}

// =====================================
// Generate Barcode
// =====================================

function generateBarcode(){

    const productIndex =
    document.getElementById("barcodeProduct").value;

    if(productIndex===""){

        showToast(
            "Select Product",
            "warning"
        );

        return;

    }

    const product =
    products[productIndex];

    const barcode = {

        id:Date.now(),

        barcodeNumber:
        "BC"+Date.now(),

        product:
        product.name,

        productIndex,

        qrCode:
        "QR"+Date.now(),

        labelSize:
        document.getElementById("labelSize").value,

        createdDate:
        new Date().toISOString().split("T")[0]

    };

    if(editIndex===-1){

        barcodes.push(barcode);

        showToast(
            "Barcode Generated",
            "success"
        );

    }else{

        barcode.id =
        barcodes[editIndex].id;

        barcode.barcodeNumber =
        barcodes[editIndex].barcodeNumber;

        barcode.qrCode =
        barcodes[editIndex].qrCode;

        barcodes[editIndex] =
        barcode;

        editIndex = -1;

        showToast(
            "Barcode Updated",
            "success"
        );

    }

    localStorage.setItem(
        "barcodes",
        JSON.stringify(barcodes)
    );

    document
    .getElementById("barcodeForm")
    .reset();

    loadBarcodes();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    document.querySelector(
    "#barcodeForm button[type='submit']"
    ).textContent =
    "📦 Generate Barcode";

}
// =====================================
// BUSINESSOS V11
// Barcode & QR Module
// Part 2
// Barcode List + Search
// =====================================

// Load Barcodes
function loadBarcodes(){

    const list =
    document.getElementById("barcodeTable");

    if(!list) return;

    list.innerHTML = "";

    if(barcodes.length===0){

        list.innerHTML = `

<div class="list-card">

<h3>📦 No Barcode Found</h3>

<p>Generate your first Barcode.</p>

</div>

`;

        document.getElementById(
        "totalBarcodes"
        ).textContent = "0";

        return;

    }

    let total = 0;

    barcodes.forEach((item,index)=>{

        total++;

        list.innerHTML += `

<div class="list-card">

<h3>📦 ${item.barcodeNumber}</h3>

<div class="list-item">

<span class="list-label">

📦 Product

</span>

<span class="list-value">

${item.product}

</span>

</div>

<div class="list-item">

<span class="list-label">

📱 QR Code

</span>

<span class="list-value">

${item.qrCode}

</span>

</div>

<div class="list-item">

<span class="list-label">

🏷️ Label Size

</span>

<span class="list-value">

${item.labelSize}

</span>

</div>

<div class="list-item">

<span class="list-label">

📅 Created

</span>

<span class="list-value">

${item.createdDate}

</span>

</div>

<div class="card-actions">

<button
class="view-btn"
onclick="viewBarcode(${index})">

👁️ View

</button>

<button
class="edit-btn"
onclick="editBarcode(${index})">

✏️ Edit

</button>

<button
class="delete-btn"
onclick="deleteBarcode(${index})">

🗑️ Delete

</button>

<button
class="primary-btn"
onclick="printBarcode(${index})">

🖨️ Print

</button>

</div>

</div>

`;

    });

    document.getElementById(
    "totalBarcodes"
    ).textContent = total;

}

// =====================================
// Search Barcode
// =====================================

function searchBarcode(){

    const value =
    document
    .getElementById("searchBarcode")
    .value
    .toLowerCase();

    document
    .querySelectorAll(
    "#barcodeTable .list-card"
    )
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
// Barcode & QR Module
// Part 3
// View + Edit + Delete
// =====================================

// View Barcode
function viewBarcode(index){

    const item = barcodes[index];

    alert(

`📦 Barcode Details

Barcode No : ${item.barcodeNumber}

📦 Product : ${item.product}

📱 QR Code : ${item.qrCode}

🏷️ Label Size : ${item.labelSize}

📅 Created : ${item.createdDate}`

    );

}

// =====================================
// Edit Barcode
// =====================================

function editBarcode(index){

    const item = barcodes[index];

    document.getElementById("barcodeProduct").value =
    item.productIndex;

    document.getElementById("labelSize").value =
    item.labelSize;

    editIndex = index;

    document.querySelector(
    "#barcodeForm button[type='submit']"
    ).textContent =
    "✏️ Update Barcode";

    showToast(
        "Edit Mode Enabled",
        "info"
    );

}

// =====================================
// Delete Barcode
// =====================================

function deleteBarcode(index){

    if(!confirm(
        "Delete this Barcode?"
    )){

        return;

    }

    barcodes.splice(index,1);

    localStorage.setItem(
        "barcodes",
        JSON.stringify(barcodes)
    );

    loadBarcodes();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    editIndex = -1;

    document.querySelector(
    "#barcodeForm button[type='submit']"
    ).textContent =
    "📦 Generate Barcode";

    showToast(
        "Barcode Deleted",
        "success"
    );

}

// =====================================
// Print Barcode
// =====================================

function printBarcode(index){

    const item = barcodes[index];

    const printData =

`******** BARCODE LABEL ********

Barcode : ${item.barcodeNumber}

Product : ${item.product}

QR Code : ${item.qrCode}

Label Size : ${item.labelSize}

Created : ${item.createdDate}

*******************************`;

    alert(printData);

}

// =====================================
// Export Barcode
// =====================================

function exportBarcode(index){

    const item = barcodes[index];

    const data = JSON.stringify(
        item,
        null,
        2
    );

    const blob = new Blob(
        [data],
        {type:"application/json"}
    );

    const url =
    URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href = url;

    a.download =
    item.barcodeNumber + ".json";

    a.click();

    URL.revokeObjectURL(url);

    showToast(
        "Barcode Exported",
        "success"
    );

}
// =====================================
// BUSINESSOS V11
// Barcode & QR Module
// Part 4
// Refresh + Dashboard
// =====================================

// Refresh Barcodes
function refreshBarcodes(){

    barcodes =
    JSON.parse(localStorage.getItem("barcodes")) || [];

    loadBarcodes();

}

// =====================================
// Refresh Window Focus
// =====================================

window.addEventListener("focus",function(){

    refreshBarcodes();

});

// =====================================
// Refresh Storage Change
// =====================================

window.addEventListener("storage",function(){

    refreshBarcodes();

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
// Barcode Form Submit
// =====================================

document
.getElementById("barcodeForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    generateBarcode();

    updateDashboard();

});

// =====================================
// Initial Refresh
// =====================================

refreshBarcodes();

console.log(
"BusinessOS Barcode Module Loaded"
);