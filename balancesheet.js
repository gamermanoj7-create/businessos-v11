// =====================================
// BUSINESSOS V11
// Balance Sheet Module
// Part 1
// Calculate Balance Sheet
// =====================================

// Cash Book
let cashBook =
JSON.parse(localStorage.getItem("cashBook")) || [];

// Bank Transactions
let bankTransactions =
JSON.parse(localStorage.getItem("bankTransactions")) || [];

// Inventory
let inventory =
JSON.parse(localStorage.getItem("inventory")) || [];

// Assets
let assets =
JSON.parse(localStorage.getItem("assets")) || [];

// Customers
let customers =
JSON.parse(localStorage.getItem("customers")) || [];

// Suppliers
let suppliers =
JSON.parse(localStorage.getItem("suppliers")) || [];

// =====================================
// Start
// =====================================

window.onload = function(){

    calculateBalanceSheet();

};

// =====================================
// Calculate Balance Sheet
// =====================================

function calculateBalanceSheet(){

    let cashBalance = 0;

    let bankBalance = 0;

    let inventoryValue = 0;

    let fixedAssets = 0;

    let receivable = 0;

    let payable = 0;

    // Cash
    cashBook.forEach(item=>{

        cashBalance +=
        Number(item.amount || 0);

    });

    // Bank
    bankTransactions.forEach(item=>{

        bankBalance +=
        Number(item.amount || 0);

    });

    // Inventory
    inventory.forEach(item=>{

        inventoryValue +=
        Number(item.quantity || 0);

    });

    // Fixed Assets
    assets.forEach(item=>{

        fixedAssets +=
        Number(item.value || 0);

    });

    // Customer Receivable
    customers.forEach(item=>{

        receivable +=
        Number(item.balance || 0);

    });

    // Supplier Payable
    suppliers.forEach(item=>{

        payable +=
        Number(item.balance || 0);

    });

    const totalAssets =

    cashBalance +
    bankBalance +
    inventoryValue +
    fixedAssets +
    receivable;

    const totalLiabilities =
    payable;

    const netWorth =

    totalAssets -
    totalLiabilities;

    document.getElementById(
    "cashBalance").textContent =
    "₹" + cashBalance.toFixed(2);

    document.getElementById(
    "bankBalance").textContent =
    "₹" + bankBalance.toFixed(2);

    document.getElementById(
    "inventoryValue").textContent =
    "₹" + inventoryValue.toFixed(2);

    document.getElementById(
    "accountsReceivable").textContent =
    "₹" + receivable.toFixed(2);

    document.getElementById(
    "accountsPayable").textContent =
    "₹" + payable.toFixed(2);

    document.getElementById(
    "fixedAssets").textContent =
    "₹" + fixedAssets.toFixed(2);

    document.getElementById(
    "totalAssets").textContent =
    "₹" + totalAssets.toFixed(2);

    document.getElementById(
    "totalLiabilities").textContent =
    "₹" + totalLiabilities.toFixed(2);

    document.getElementById(
    "netWorth").textContent =
    "₹" + netWorth.toFixed(2);

}
// =====================================
// BUSINESSOS V11
// Balance Sheet Module
// Part 2
// Assets + Liabilities Summary
// =====================================

// =====================================
// Assets Summary
// =====================================

function showAssetsSummary(){

    const cash =
    document.getElementById(
    "cashBalance").textContent;

    const bank =
    document.getElementById(
    "bankBalance").textContent;

    const inventory =
    document.getElementById(
    "inventoryValue").textContent;

    const receivable =
    document.getElementById(
    "accountsReceivable").textContent;

    const assets =
    document.getElementById(
    "fixedAssets").textContent;

    const total =
    document.getElementById(
    "totalAssets").textContent;

    alert(

`📊 Assets Summary

💵 Cash : ${cash}

🏦 Bank : ${bank}

📦 Inventory : ${inventory}

👥 Receivable : ${receivable}

🏢 Fixed Assets : ${assets}

----------------------------

💰 Total Assets : ${total}`

    );

}

// =====================================
// Liabilities Summary
// =====================================

function showLiabilitiesSummary(){

    const payable =
    document.getElementById(
    "accountsPayable").textContent;

    const total =
    document.getElementById(
    "totalLiabilities").textContent;

    alert(

`📉 Liabilities Summary

🏢 Accounts Payable : ${payable}

----------------------------

💳 Total Liabilities : ${total}`

    );

}

// =====================================
// Net Worth Summary
// =====================================

function showNetWorth(){

    const assets =
    parseFloat(

        document
        .getElementById("totalAssets")
        .textContent
        .replace("₹","")

    );

    const liabilities =
    parseFloat(

        document
        .getElementById("totalLiabilities")
        .textContent
        .replace("₹","")

    );

    const worth =
    parseFloat(

        document
        .getElementById("netWorth")
        .textContent
        .replace("₹","")

    );

    let status="";

    if(worth>0){

        status =
        "✅ Healthy Business";

    }else if(worth<0){

        status =
        "❌ Financial Risk";

    }else{

        status =
        "⚖️ Balanced Position";

    }

    alert(

`💼 Balance Sheet Summary

📊 Total Assets : ₹${assets.toFixed(2)}

📉 Total Liabilities : ₹${liabilities.toFixed(2)}

💰 Net Worth : ₹${worth.toFixed(2)}

${status}`

    );

}

// =====================================
// Date Filter
// =====================================

function filterBalanceSheet(){

    const from =
    document.getElementById(
    "fromDate").value;

    const to =
    document.getElementById(
    "toDate").value;

    if(from==="" || to===""){

        showToast(
            "Select Date Range",
            "warning"
        );

        return;

    }

    showToast(
        "Balance Sheet Filter Applied",
        "success"
    );

}
// =====================================
// BUSINESSOS V11
// Balance Sheet Module
// Part 3
// Print + Export
// =====================================

// Print Balance Sheet
function printBalanceSheet(){

    const report =

`******** BALANCE SHEET ********

Cash Balance :
${document.getElementById("cashBalance").textContent}

Bank Balance :
${document.getElementById("bankBalance").textContent}

Inventory Value :
${document.getElementById("inventoryValue").textContent}

Accounts Receivable :
${document.getElementById("accountsReceivable").textContent}

Accounts Payable :
${document.getElementById("accountsPayable").textContent}

Fixed Assets :
${document.getElementById("fixedAssets").textContent}

--------------------------------

Total Assets :
${document.getElementById("totalAssets").textContent}

Total Liabilities :
${document.getElementById("totalLiabilities").textContent}

Net Worth :
${document.getElementById("netWorth").textContent}

********************************`;

    alert(report);

}

// =====================================
// Export PDF
// =====================================

function exportBalancePDF(){

    showToast(
        "PDF Export Coming Soon",
        "info"
    );

    console.log(
        "Export Balance Sheet PDF"
    );

}

// =====================================
// Export Excel
// =====================================

function exportBalanceExcel(){

    showToast(
        "Excel Export Coming Soon",
        "info"
    );

    console.log(
        "Export Balance Sheet Excel"
    );

}

// =====================================
// Financial Report
// =====================================

function financialReport(){

    alert(

`📑 Financial Report

💵 Cash :
${document.getElementById("cashBalance").textContent}

🏦 Bank :
${document.getElementById("bankBalance").textContent}

📦 Inventory :
${document.getElementById("inventoryValue").textContent}

💰 Net Worth :
${document.getElementById("netWorth").textContent}`

    );

}

// =====================================
// Business Position
// =====================================

function businessPosition(){

    const worth =
    parseFloat(

        document
        .getElementById("netWorth")
        .textContent
        .replace("₹","")

    );

    if(worth>0){

        showToast(
            "Business Financial Position is Strong",
            "success"
        );

    }else if(worth<0){

        showToast(
            "Business Financial Position is Weak",
            "error"
        );

    }else{

        showToast(
            "Business Position is Neutral",
            "info"
        );

    }

}
// =====================================
// BUSINESSOS V11
// Balance Sheet Module
// Part 4
// Refresh + Dashboard
// =====================================

// Refresh Balance Sheet
function refreshBalanceSheet(){

    cashBook =
    JSON.parse(localStorage.getItem("cashBook")) || [];

    bankTransactions =
    JSON.parse(localStorage.getItem("bankTransactions")) || [];

    inventory =
    JSON.parse(localStorage.getItem("inventory")) || [];

    assets =
    JSON.parse(localStorage.getItem("assets")) || [];

    customers =
    JSON.parse(localStorage.getItem("customers")) || [];

    suppliers =
    JSON.parse(localStorage.getItem("suppliers")) || [];

    calculateBalanceSheet();

}

// =====================================
// Refresh Window Focus
// =====================================

window.addEventListener("focus",function(){

    refreshBalanceSheet();

});

// =====================================
// Refresh Storage Change
// =====================================

window.addEventListener("storage",function(){

    refreshBalanceSheet();

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
// Auto Calculation
// =====================================

setInterval(function(){

    calculateBalanceSheet();

},5000);

// =====================================
// Initial Load
// =====================================

refreshBalanceSheet();

// businessPosition();

console.log(
"BusinessOS Balance Sheet Module Loaded"
);