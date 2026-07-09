// =====================================
// BUSINESSOS V11
// Products Module (Firebase)
// Part 1
// Setup + Load Products
// =====================================

// Firestore Collection
const productsRef = db.collection("products");

// Product List
let products = [];

// Edit Product ID
let editId = null;

// =====================================
// Start
// =====================================

window.onload = function () {
    loadProducts();
};

// =====================================
// Load Products From Firestore
// =====================================

async function loadProducts() {

    const list = document.getElementById("productTable");

    if (!list) return;

    list.innerHTML = "";

    products = [];

    try {

        const snapshot = await productsRef.orderBy("name").get();

        snapshot.forEach((doc) => {

            products.push({
                id: doc.id,
                ...doc.data()
            });

        });

        if (products.length === 0) {

            list.innerHTML = `
            <div class="list-card">
                <h3>📦 No Product Found</h3>
                <p>Add your first product.</p>
            </div>`;

            return;
        }

        products.forEach((product, index) => {

            const stockBadge =
                product.stock <= 5
                ? `<span class="danger-badge">Low Stock</span>`
                : `<span class="success-badge">In Stock</span>`;

            list.innerHTML += `

            <div class="list-card">

                <h3>📦 ${product.name}</h3>

                <div class="list-item">
                    <span class="list-label">Category</span>
                    <span class="list-value">${product.category}</span>
                </div>

                <div class="list-item">
                    <span class="list-label">Buy Price</span>
                    <span class="list-value">₹${Number(product.buy).toFixed(2)}</span>
                </div>

                <div class="list-item">
                    <span class="list-label">Sell Price</span>
                    <span class="list-value">₹${Number(product.sell).toFixed(2)}</span>
                </div>

                <div class="list-item">
                    <span class="list-label">Stock</span>
                    <span class="list-value">
                        ${product.stock}
                        ${stockBadge}
                    </span>
                </div>

                <div class="card-actions">

                    <button class="view-btn"
                    onclick="viewProduct(${index})">
                    👁️ View
                    </button>

                    <button class="edit-btn"
                    onclick="editProduct(${index})">
                    ✏️ Edit
                    </button>

                    <button class="delete-btn"
                    onclick="deleteProduct('${product.id}')">
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

console.log("✅ Products Firebase Part 1 Loaded");
// =====================================
// BUSINESSOS V11
// Products Module (Firebase)
// Part 2
// Save + Update Product
// =====================================

async function saveProduct() {

    const product = {

        name: document.getElementById("productName").value.trim(),

        category: document.getElementById("category").value.trim(),

        buy: Number(document.getElementById("buyPrice").value || 0),

        sell: Number(document.getElementById("sellPrice").value || 0),

        stock: Number(document.getElementById("stock").value || 0),

        createdAt: firebase.firestore.FieldValue.serverTimestamp()

    };

    if (product.name === "") {

        alert("Enter Product Name");
        return;

    }

    try {

        if (editId === null) {

            await productsRef.add(product);

            alert("✅ Product Added Successfully");

        } else {

            await productsRef.doc(editId).update({

                name: product.name,

                category: product.category,

                buy: product.buy,

                sell: product.sell,

                stock: product.stock

            });

            alert("✅ Product Updated Successfully");

            editId = null;

        }

        document.getElementById("productForm").reset();

        loadProducts();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// =====================================
// Product Form Submit
// =====================================

document
.getElementById("productForm")
.addEventListener("submit", function(e){

    e.preventDefault();

    saveProduct();

});
// =====================================
// BUSINESSOS V11
// Products Module (Firebase)
// Part 3
// View + Edit + Delete Product
// =====================================

// View Product
function viewProduct(index){

    const product = products[index];

    alert(

`📦 Product : ${product.name}

📂 Category : ${product.category}

💰 Buy Price : ₹${Number(product.buy).toFixed(2)}

🏷️ Sell Price : ₹${Number(product.sell).toFixed(2)}

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

    editId = product.id;

    alert("✏️ Edit Mode Enabled");

}

// =====================================
// Delete Product
// =====================================

async function deleteProduct(id){

    if(!confirm("Delete this Product?")){

        return;

    }

    try{

        await productsRef.doc(id).delete();

        alert("🗑️ Product Deleted Successfully");

        loadProducts();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}
// =====================================
// BUSINESSOS V11
// Products Module (Firebase)
// Part 4
// Search + Refresh + Dashboard
// =====================================

// Search Product
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
// Refresh Products
// =====================================

function refreshProducts(){

    loadProducts();

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

    refreshProducts();

});

// =====================================
// Live Refresh Every 10 Seconds
// =====================================

setInterval(function(){

    refreshProducts();

},10000);

// =====================================
// Firestore Live Update
// =====================================

productsRef.onSnapshot(function(){

    loadProducts();

});

// =====================================
// Initial Load
// =====================================

refreshProducts();

console.log(
"✅ BusinessOS Products Firebase Module Loaded"
);