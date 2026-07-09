// =====================================
// BUSINESSOS V11
// Products Module
// Part 1
// Setup + Save Product
// =====================================

// Products
let products =
JSON.parse(localStorage.getItem("products")) || [];

// Edit Mode
let editIndex = -1;

// =====================================
// Start
// =====================================

window.onload = function(){

    loadProducts();

};

// =====================================
// Save Product
// =====================================

function saveProduct(){

    const product={

        id:Date.now(),

        name:
        document.getElementById("productName").value.trim(),

        category:
        document.getElementById("category").value.trim(),

        buy:Number(
        document.getElementById("buyPrice").value || 0
        ),

        sell:Number(
        document.getElementById("sellPrice").value || 0
        ),

        stock:Number(
        document.getElementById("stock").value || 0
        )

    };

    if(product.name===""){

        showToast(
            "Enter Product Name",
            "warning"
        );

        return;

    }

    if(product.buy<=0){

        showToast(
            "Enter Buy Price",
            "warning"
        );

        return;

    }

    if(product.sell<=0){

        showToast(
            "Enter Sell Price",
            "warning"
        );

        return;

    }

    if(editIndex===-1){

        products.push(product);

        showToast(
            "Product Added Successfully",
            "success"
        );

    }else{

        product.id = products[editIndex].id;

        products[editIndex] = product;

        editIndex = -1;

        showToast(
            "Product Updated Successfully",
            "success"
        );

    }

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

    document
    .getElementById("productForm")
    .reset();

    loadProducts();

}
// =====================================
// BUSINESSOS V11
// Products Module
// Part 2
// Product List + Search
// =====================================

// Load Products
function loadProducts(){

    const list =
    document.getElementById("productTable");

    if(!list) return;

    list.innerHTML = "";

    if(products.length===0){

        list.innerHTML = `

<div class="list-card">

<h3>📦 No Product Found</h3>

<p>Add your first product.</p>

</div>

`;

        return;

    }

    products.forEach((product,index)=>{

        let stockBadge =
        product.stock <= 5

        ? `<span class="danger-badge">Low Stock</span>`

        : `<span class="success-badge">In Stock</span>`;

        list.innerHTML += `

<div class="list-card">

<h3>📦 ${product.name}</h3>

<div class="list-item">

<span class="list-label">

Category

</span>

<span class="list-value">

${product.category}

</span>

</div>

<div class="list-item">

<span class="list-label">

Buy Price

</span>

<span class="list-value">

₹${product.buy}

</span>

</div>

<div class="list-item">

<span class="list-label">

Sell Price

</span>

<span class="list-value">

₹${product.sell}

</span>

</div>

<div class="list-item">

<span class="list-label">

Stock

</span>

<span class="list-value">

${product.stock}

${stockBadge}

</span>

</div>

<div class="card-actions">

<button
class="view-btn"
onclick="viewProduct(${index})">

👁️ View

</button>

<button
class="edit-btn"
onclick="editProduct(${index})">

✏️ Edit

</button>

<button
class="delete-btn"
onclick="deleteProduct(${index})">

🗑️ Delete

</button>

</div>

</div>

`;

    });

}

// =====================================
// Search Product
// =====================================

function searchProduct(){

    const value =
    document
    .getElementById("searchProduct")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#productTable .list-card")
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
// Products Module
// Part 3
// View + Edit + Delete
// =====================================

// View Product
function viewProduct(index){

    const product = products[index];

    alert(

`📦 Product : ${product.name}

📂 Category : ${product.category}

💰 Buy Price : ₹${product.buy}

🏷️ Sell Price : ₹${product.sell}

📦 Stock : ${product.stock}`

    );

}

// =====================================
// Edit Product
// =====================================

function editProduct(index){

    const product = products[index];

    document.getElementById("productName").value =
    product.name;

    document.getElementById("category").value =
    product.category;

    document.getElementById("buyPrice").value =
    product.buy;

    document.getElementById("sellPrice").value =
    product.sell;

    document.getElementById("stock").value =
    product.stock;

    editIndex = index;

    showToast(
        "Edit Mode Enabled",
        "info"
    );

}

// =====================================
// Delete Product
// =====================================

function deleteProduct(index){

    if(!confirm("Delete this Product?")){

        return;

    }

    products.splice(index,1);

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

    loadProducts();

    showToast(
        "Product Deleted Successfully",
        "success"
    );

}
// =====================================
// BUSINESSOS V11
// Products Module
// Part 4
// Refresh + Dashboard Update
// =====================================

// Refresh Products
function refreshProducts(){

    loadProducts();

}

// Refresh When Window Focus
window.addEventListener("focus",function(){

    refreshProducts();

});

// Refresh When LocalStorage Changes
window.addEventListener("storage",function(){

    refreshProducts();

});

// Dashboard Refresh
function updateDashboard(){

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

}

// Save Dashboard Update
document
.getElementById("productForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    saveProduct();

    updateDashboard();

});

// Initial Refresh
refreshProducts();

console.log(
"BusinessOS Products Module Loaded"
);