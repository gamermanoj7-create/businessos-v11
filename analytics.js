// =====================================
// BUSINESSOS V11
// Analytics Dashboard
// Part 1
// Load Dashboard Data
// =====================================

// Products
let products =
JSON.parse(localStorage.getItem("products")) || [];

// Customers
let customers =
JSON.parse(localStorage.getItem("customers")) || [];

// Suppliers
let suppliers =
JSON.parse(localStorage.getItem("suppliers")) || [];

// Sales Orders
let salesOrders =
JSON.parse(localStorage.getItem("salesOrders")) || [];

// Purchase Orders
let purchaseOrders =
JSON.parse(localStorage.getItem("purchaseOrders")) || [];

// Expenses
let expenses =
JSON.parse(localStorage.getItem("expenses")) || [];

// Inventory
let inventory =
JSON.parse(localStorage.getItem("inventory")) || [];

// Cash Book
let cashBook =
JSON.parse(localStorage.getItem("cashBook")) || [];

// Bank
let bankTransactions =
JSON.parse(localStorage.getItem("bankTransactions")) || [];

// =====================================
// Start
// =====================================

window.onload = function(){

    loadAnalytics();

};

// =====================================
// Load Dashboard
// =====================================

function loadAnalytics(){

    let totalSales = 0;
    let totalPurchase = 0;
    let totalExpense = 0;
    let cashBalance = 0;
    let bankBalance = 0;
    let inventoryValue = 0;

    salesOrders.forEach(item=>{

        totalSales +=
        Number(item.total || 0);

    });

    purchaseOrders.forEach(item=>{

        totalPurchase +=
        Number(item.total || 0);

    });

    expenses.forEach(item=>{

        totalExpense +=
        Number(item.amount || 0);

    });

    cashBook.forEach(item=>{

        cashBalance +=
        Number(item.amount || 0);

    });

    bankTransactions.forEach(item=>{

        bankBalance +=
        Number(item.amount || 0);

    });

    inventory.forEach(item=>{

        inventoryValue +=
        Number(item.quantity || 0);

    });

    const netProfit =

    totalSales -

    totalPurchase -

    totalExpense;

    document.getElementById("analyticsSales").textContent =
    "₹" + totalSales.toFixed(2);

    document.getElementById("analyticsPurchase").textContent =
    "₹" + totalPurchase.toFixed(2);

    document.getElementById("analyticsExpense").textContent =
    "₹" + totalExpense.toFixed(2);

    document.getElementById("analyticsProfit").textContent =
    "₹" + netProfit.toFixed(2);

    document.getElementById("analyticsCash").textContent =
    "₹" + cashBalance.toFixed(2);

    document.getElementById("analyticsBank").textContent =
    "₹" + bankBalance.toFixed(2);

    document.getElementById("analyticsInventory").textContent =
    inventoryValue;

    document.getElementById("analyticsProducts").textContent =
    products.length;

    document.getElementById("analyticsCustomers").textContent =
    customers.length;

    document.getElementById("analyticsSuppliers").textContent =
    suppliers.length;

}
// =====================================
// BUSINESSOS V11
// Analytics Dashboard
// Part 2
// Sales Analytics + Alerts
// =====================================

// Today's Sales
function calculateTodaySales(){

    const today =
    new Date().toISOString().split("T")[0];

    let total = 0;

    salesOrders.forEach(order=>{

        if(order.date===today){

            total +=
            Number(order.total || 0);

        }

    });

    document.getElementById(
    "todaySales").textContent =
    "₹" + total.toFixed(2);

}

// =====================================
// Monthly Sales
// =====================================

function calculateMonthlySales(){

    const month =
    new Date().getMonth();

    const year =
    new Date().getFullYear();

    let total = 0;

    salesOrders.forEach(order=>{

        if(!order.date) return;

        const d = new Date(order.date);

        if(
            d.getMonth()===month &&
            d.getFullYear()===year
        ){

            total +=
            Number(order.total || 0);

        }

    });

    document.getElementById(
    "monthlySales").textContent =
    "₹" + total.toFixed(2);

}

// =====================================
// Yearly Sales
// =====================================

function calculateYearlySales(){

    const year =
    new Date().getFullYear();

    let total = 0;

    salesOrders.forEach(order=>{

        if(!order.date) return;

        const d = new Date(order.date);

        if(d.getFullYear()===year){

            total +=
            Number(order.total || 0);

        }

    });

    document.getElementById(
    "yearlySales").textContent =
    "₹" + total.toFixed(2);

}

// =====================================
// Low Stock Products
// =====================================

function calculateLowStock(){

    let lowStock = 0;

    inventory.forEach(item=>{

        if(Number(item.quantity)<=5){

            lowStock++;

        }

    });

    document.getElementById(
    "lowStock").textContent =
    lowStock;

}

// =====================================
// Pending Purchase Orders
// =====================================

function calculatePendingPO(){

    let pending = 0;

    purchaseOrders.forEach(order=>{

        if(order.status==="Pending"){

            pending++;

        }

    });

    document.getElementById(
    "pendingPO").textContent =
    pending;

}

// =====================================
// Business Performance
// =====================================

function analyticsPerformance(){

    const profit =
    parseFloat(

        document
        .getElementById("analyticsProfit")
        .textContent
        .replace("₹","")

    );

    let status = "";

    if(profit > 0){

        status =
        "🟢 Excellent";

    }else if(profit < 0){

        status =
        "🔴 Loss";

    }else{

        status =
        "🟡 Average";

    }

    document.getElementById(
    "businessStatus").textContent =
    status;

}

// =====================================
// Refresh Analytics
// =====================================

function refreshAnalyticsData(){

    calculateTodaySales();

    calculateMonthlySales();

    calculateYearlySales();

    calculateLowStock();

    calculatePendingPO();

    analyticsPerformance();

}
// =====================================
// BUSINESSOS V11
// Analytics Dashboard
// Part 3
// Top Lists + Summary
// =====================================

// Top Selling Products
function topSellingProducts(){

    const list =
    document.getElementById("topProducts");

    if(!list) return;

    list.innerHTML = "";

    if(salesOrders.length===0){

        list.innerHTML =
        "<li>No Sales Data</li>";

        return;

    }

    salesOrders
    .slice(0,5)
    .forEach(order=>{

        list.innerHTML +=

        `<li>

        📦 ${order.product}

        (${order.quantity})

        </li>`;

    });

}

// =====================================
// Top Customers
// =====================================

function topCustomers(){

    const list =
    document.getElementById("topCustomers");

    if(!list) return;

    list.innerHTML = "";

    if(customers.length===0){

        list.innerHTML =
        "<li>No Customers</li>";

        return;

    }

    customers
    .slice(0,5)
    .forEach(customer=>{

        list.innerHTML +=

        `<li>

        👤 ${customer.name}

        </li>`;

    });

}

// =====================================
// Top Suppliers
// =====================================

function topSuppliers(){

    const list =
    document.getElementById("topSuppliers");

    if(!list) return;

    list.innerHTML = "";

    if(suppliers.length===0){

        list.innerHTML =
        "<li>No Suppliers</li>";

        return;

    }

    suppliers
    .slice(0,5)
    .forEach(supplier=>{

        list.innerHTML +=

        `<li>

        🏢 ${supplier.name}

        </li>`;

    });

}

// =====================================
// Inventory Status
// =====================================

function inventoryAnalytics(){

    let stock = 0;

    inventory.forEach(item=>{

        stock +=
        Number(item.quantity || 0);

    });

    document.getElementById(
    "inventoryStock"
    ).textContent = stock;

}

// =====================================
// Business Summary
// =====================================

function businessSummary(){

    const sales =
    document.getElementById(
    "analyticsSales"
    ).textContent;

    const purchase =
    document.getElementById(
    "analyticsPurchase"
    ).textContent;

    const profit =
    document.getElementById(
    "analyticsProfit"
    ).textContent;

    alert(

`📊 Business Summary

💰 Total Sales : ${sales}

🛒 Total Purchase : ${purchase}

📈 Net Profit : ${profit}

📦 Products : ${products.length}

👥 Customers : ${customers.length}

🏢 Suppliers : ${suppliers.length}`

    );

}

// =====================================
// Load All Analytics
// =====================================

function loadAnalyticsLists(){

    topSellingProducts();

    topCustomers();

    topSuppliers();

    inventoryAnalytics();

}
// =====================================
// BUSINESSOS V11
// Analytics Dashboard
// Part 4
// Refresh + Dashboard
// =====================================

// Refresh Analytics
function refreshAnalytics(){

    products =
    JSON.parse(localStorage.getItem("products")) || [];

    customers =
    JSON.parse(localStorage.getItem("customers")) || [];

    suppliers =
    JSON.parse(localStorage.getItem("suppliers")) || [];

    salesOrders =
    JSON.parse(localStorage.getItem("salesOrders")) || [];

    purchaseOrders =
    JSON.parse(localStorage.getItem("purchaseOrders")) || [];

    expenses =
    JSON.parse(localStorage.getItem("expenses")) || [];

    inventory =
    JSON.parse(localStorage.getItem("inventory")) || [];

    cashBook =
    JSON.parse(localStorage.getItem("cashBook")) || [];

    bankTransactions =
    JSON.parse(localStorage.getItem("bankTransactions")) || [];

    loadAnalytics();

    refreshAnalyticsData();

    loadAnalyticsLists();

}

// =====================================
// Window Focus Refresh
// =====================================

window.addEventListener("focus",function(){

    refreshAnalytics();

});

// =====================================
// Storage Refresh
// =====================================

window.addEventListener("storage",function(){

    refreshAnalytics();

});

// =====================================
// Dashboard Sync
// =====================================

function updateDashboard(){

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

}

// =====================================
// Live Update
// =====================================

setInterval(function(){

    refreshAnalytics();

},5000);

// =====================================
// Initial Load
// =====================================

refreshAnalytics();

console.log(
"BusinessOS Analytics Dashboard Loaded"
);