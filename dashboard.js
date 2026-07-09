// =====================================
// BUSINESSOS V11
// Dashboard Module (Firebase)
// Part 1
// Setup + Load Dashboard
// =====================================

// Firestore Collections
const productsRef = db.collection("products");
const customersRef = db.collection("customers");
const suppliersRef = db.collection("suppliers");
const salesRef = db.collection("sales");
const purchaseRef = db.collection("purchases");
const paymentRef = db.collection("payments");

// Dashboard Data
let totalProducts = 0;
let totalCustomers = 0;
let totalSuppliers = 0;
let totalSales = 0;
let totalPurchase = 0;
let totalPayment = 0;
let totalStock = 0;

// =====================================
// Start
// =====================================

window.onload = function () {

    refreshDashboard();

};

// =====================================
// Load Dashboard
// =====================================

async function loadDashboard() {

    try {

        // Products
        const productSnapshot =
        await productsRef.get();

        totalProducts = productSnapshot.size;

        totalStock = 0;

        productSnapshot.forEach((doc)=>{

            const product = doc.data();

            totalStock +=
            Number(product.stock || 0);

        });

        // Customers
        const customerSnapshot =
        await customersRef.get();

        totalCustomers =
        customerSnapshot.size;

        // Suppliers
        const supplierSnapshot =
        await suppliersRef.get();

        totalSuppliers =
        supplierSnapshot.size;

        // Sales
        const salesSnapshot =
        await salesRef.get();

        totalSales = 0;

        salesSnapshot.forEach((doc)=>{

            totalSales +=
            Number(
            doc.data().grandTotal || 0
            );

        });

        // Purchase
        const purchaseSnapshot =
        await purchaseRef.get();

        totalPurchase = 0;

        purchaseSnapshot.forEach((doc)=>{

            totalPurchase +=
            Number(
            doc.data().grandTotal || 0
            );

        });

        // Payments
        const paymentSnapshot =
        await paymentRef.get();

        totalPayment = 0;

        paymentSnapshot.forEach((doc)=>{

            totalPayment +=
            Number(
            doc.data().amount || 0
            );

        });

        updateDashboard();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}

console.log(
"✅ Dashboard Firebase Part 1 Loaded"
);
// =====================================
// BUSINESSOS V11
// Dashboard Module (Firebase)
// Part 2
// Update Dashboard Cards
// =====================================

function updateDashboard() {

    // Total Products
    const productCard =
    document.getElementById("totalProducts");

    if(productCard){

        productCard.textContent =
        totalProducts;

    }

    // Total Customers
    const customerCard =
    document.getElementById("totalCustomers");

    if(customerCard){

        customerCard.textContent =
        totalCustomers;

    }

    // Total Suppliers
    const supplierCard =
    document.getElementById("totalSuppliers");

    if(supplierCard){

        supplierCard.textContent =
        totalSuppliers;

    }

    // Total Stock
    const stockCard =
    document.getElementById("totalStock");

    if(stockCard){

        stockCard.textContent =
        totalStock;

    }

    // Total Sales
    const salesCard =
    document.getElementById("totalSales");

    if(salesCard){

        salesCard.textContent =
        "₹" + totalSales.toFixed(2);

    }

    // Total Purchase
    const purchaseCard =
    document.getElementById("totalPurchase");

    if(purchaseCard){

        purchaseCard.textContent =
        "₹" + totalPurchase.toFixed(2);

    }

    // Total Payments
    const paymentCard =
    document.getElementById("totalPayment");

    if(paymentCard){

        paymentCard.textContent =
        "₹" + totalPayment.toFixed(2);

    }

    // Net Profit
    const profitCard =
    document.getElementById("netProfit");

    if(profitCard){

        const profit =
        totalSales - totalPurchase;

        profitCard.textContent =
        "₹" + profit.toFixed(2);

    }

}

console.log(
"✅ Dashboard Firebase Part 2 Loaded"
);
// =====================================
// BUSINESSOS V11
// Dashboard Module (Firebase)
// Part 3
// Low Stock + Recent Activity
// =====================================

// Load Low Stock Products
async function loadLowStock() {

    const list =
    document.getElementById("lowStockList");

    if (!list) return;

    list.innerHTML = "";

    try {

        const snapshot =
        await productsRef
        .where("stock", "<=", 5)
        .get();

        if (snapshot.empty) {

            list.innerHTML = `

<div class="list-card">

<h3>✅ No Low Stock Product</h3>

<p>Inventory looks good.</p>

</div>

`;

            return;

        }

        snapshot.forEach((doc) => {

            const product = doc.data();

            list.innerHTML += `

<div class="list-card">

<h3>📦 ${product.name}</h3>

<div class="list-item">

<span class="list-label">

Current Stock

</span>

<span class="list-value">

${product.stock}

</span>

</div>

</div>

`;

        });

    }

    catch(error){

        console.error(error);

    }

}

// =====================================
// Load Recent Sales
// =====================================

async function loadRecentSales(){

    const list =
    document.getElementById("recentSales");

    if(!list) return;

    list.innerHTML = "";

    try{

        const snapshot =
        await salesRef
        .orderBy("createdAt","desc")
        .limit(5)
        .get();

        if(snapshot.empty){

            list.innerHTML = `

<div class="list-card">

<h3>🧾 No Recent Sales</h3>

</div>

`;

            return;

        }

        snapshot.forEach((doc)=>{

            const sale = doc.data();

            list.innerHTML += `

<div class="list-card">

<h3>👤 ${sale.customer}</h3>

<div class="list-item">

<span>₹${Number(sale.grandTotal).toFixed(2)}</span>

</div>

</div>

`;

        });

    }

    catch(error){

        console.error(error);

    }

}

// =====================================
// Refresh Dashboard
// =====================================

function refreshDashboard(){

    loadDashboard();

    loadLowStock();

    loadRecentSales();

}

console.log(
"✅ Dashboard Firebase Part 3 Loaded"
);
// =====================================
// BUSINESSOS V11
// Dashboard Module (Firebase)
// Part 4
// Live Update + Auto Refresh
// =====================================

// Live Products
productsRef.onSnapshot(function(){

    refreshDashboard();

});

// Live Customers
customersRef.onSnapshot(function(){

    refreshDashboard();

});

// Live Suppliers
suppliersRef.onSnapshot(function(){

    refreshDashboard();

});

// Live Sales
salesRef.onSnapshot(function(){

    refreshDashboard();

});

// Live Purchase
purchaseRef.onSnapshot(function(){

    refreshDashboard();

});

// Live Payments
paymentRef.onSnapshot(function(){

    refreshDashboard();

});

// Window Focus Refresh
window.addEventListener("focus", function(){

    refreshDashboard();

});

// Auto Refresh Every 10 Seconds
setInterval(function(){

    refreshDashboard();

},10000);

// Initial Load

console.log(
"✅ BusinessOS Dashboard Firebase Module Completed"
);