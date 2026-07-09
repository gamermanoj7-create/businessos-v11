// =====================================
// BUSINESSOS V11
// Profit & Loss Module
// Part 1
// Calculate Profit & Loss
// =====================================

// Sales
let salesOrders =
JSON.parse(localStorage.getItem("salesOrders")) || [];

// Purchases
let purchaseOrders =
JSON.parse(localStorage.getItem("purchaseOrders")) || [];

// Expenses
let expenses =
JSON.parse(localStorage.getItem("expenses")) || [];

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

    calculateProfitLoss();

};

// =====================================
// Calculate Profit & Loss
// =====================================

function calculateProfitLoss(){

    let totalSales = 0;
    let totalPurchase = 0;
    let totalExpense = 0;
    let totalCash = 0;
    let totalBank = 0;

    // Sales
    salesOrders.forEach(order=>{

        totalSales +=
        Number(order.total || 0);

    });

    // Purchase
    purchaseOrders.forEach(order=>{

        totalPurchase +=
        Number(order.total || 0);

    });

    // Expenses
    expenses.forEach(expense=>{

        totalExpense +=
        Number(expense.amount || 0);

    });

    // Cash
    cashBook.forEach(item=>{

        totalCash +=
        Number(item.amount || 0);

    });

    // Bank
    bankTransactions.forEach(item=>{

        totalBank +=
        Number(item.amount || 0);

    });

    const grossProfit =
    totalSales - totalPurchase;

    const netProfit =
    grossProfit - totalExpense;

    document.getElementById("totalSales").textContent =
    "₹" + totalSales.toFixed(2);

    document.getElementById("totalPurchase").textContent =
    "₹" + totalPurchase.toFixed(2);

    document.getElementById("totalExpense").textContent =
    "₹" + totalExpense.toFixed(2);

    document.getElementById("grossProfit").textContent =
    "₹" + grossProfit.toFixed(2);

    document.getElementById("netProfit").textContent =
    "₹" + netProfit.toFixed(2);

    document.getElementById("cashBalance").textContent =
    "₹" + totalCash.toFixed(2);

    document.getElementById("bankBalance").textContent =
    "₹" + totalBank.toFixed(2);

}
// =====================================
// BUSINESSOS V11
// Profit & Loss Module
// Part 2
// Summary + Reports
// =====================================

// Show Summary
function showProfitSummary(){

    const sales =
    Number(
    document.getElementById("totalSales")
    .textContent.replace("₹","")
    ) || 0;

    const purchase =
    Number(
    document.getElementById("totalPurchase")
    .textContent.replace("₹","")
    ) || 0;

    const expense =
    Number(
    document.getElementById("totalExpense")
    .textContent.replace("₹","")
    ) || 0;

    const net =
    Number(
    document.getElementById("netProfit")
    .textContent.replace("₹","")
    ) || 0;

    let message="";

    if(net>0){

        message =
        "✅ Business is in Profit";

    }else if(net<0){

        message =
        "❌ Business is in Loss";

    }else{

        message =
        "⚖️ No Profit No Loss";

    }

    alert(

`📊 Profit & Loss Summary

💰 Sales : ₹${sales.toFixed(2)}

🛒 Purchase : ₹${purchase.toFixed(2)}

💸 Expense : ₹${expense.toFixed(2)}

📈 Net Profit : ₹${net.toFixed(2)}

${message}`

    );

}

// =====================================
// Monthly Report
// =====================================

function monthlyReport(){

    const month =
    new Date().toLocaleString(
        "default",
        {month:"long"}
    );

    showToast(

        month +
        " Report Generated",

        "success"

    );

    showProfitSummary();

}

// =====================================
// Yearly Report
// =====================================

function yearlyReport(){

    const year =
    new Date().getFullYear();

    showToast(

        year +
        " Report Generated",

        "success"

    );

    showProfitSummary();

}

// =====================================
// Date Range Filter
// =====================================

function filterReport(){

    const from =
    document.getElementById("fromDate").value;

    const to =
    document.getElementById("toDate").value;

    if(from==="" || to===""){

        showToast(
            "Select Date Range",
            "warning"
        );

        return;

    }

    showToast(

        "Filtered Report Ready",

        "success"

    );

}
// =====================================
// BUSINESSOS V11
// Profit & Loss Module
// Part 3
// Print + Export
// =====================================

// Print Report
function printProfitLoss(){

    const report =

`******** PROFIT & LOSS REPORT ********

Total Sales :
${document.getElementById("totalSales").textContent}

Total Purchase :
${document.getElementById("totalPurchase").textContent}

Total Expenses :
${document.getElementById("totalExpense").textContent}

Gross Profit :
${document.getElementById("grossProfit").textContent}

Net Profit :
${document.getElementById("netProfit").textContent}

Cash Balance :
${document.getElementById("cashBalance").textContent}

Bank Balance :
${document.getElementById("bankBalance").textContent}

*************************************`;

    alert(report);

}

// =====================================
// Export PDF
// =====================================

function exportPDF(){

    showToast(
        "PDF Export Coming Soon",
        "info"
    );

    console.log(
        "Export PDF"
    );

}

// =====================================
// Export Excel
// =====================================

function exportExcel(){

    showToast(
        "Excel Export Coming Soon",
        "info"
    );

    console.log(
        "Export Excel"
    );

}

// =====================================
// Financial Summary
// =====================================

function financialSummary(){

    const sales =
    document.getElementById("totalSales").textContent;

    const purchase =
    document.getElementById("totalPurchase").textContent;

    const expense =
    document.getElementById("totalExpense").textContent;

    const gross =
    document.getElementById("grossProfit").textContent;

    const net =
    document.getElementById("netProfit").textContent;

    alert(

`📊 Financial Summary

💰 Sales : ${sales}

🛒 Purchase : ${purchase}

💸 Expenses : ${expense}

📈 Gross Profit : ${gross}

🏆 Net Profit : ${net}`

    );

}

// =====================================
// Business Performance
// =====================================

function businessPerformance(){

    const net = parseFloat(

        document
        .getElementById("netProfit")
        .textContent
        .replace("₹","")

    );

    if(net > 0){

        showToast(
            "Business Running in Profit",
            "success"
        );

    }else if(net < 0){

        showToast(
            "Business Running in Loss",
            "error"
        );

    }else{

        showToast(
            "No Profit No Loss",
            "info"
        );

    }

}
// =====================================
// BUSINESSOS V11
// Profit & Loss Module
// Part 4
// Refresh + Dashboard
// =====================================

// Refresh Profit & Loss
function refreshProfitLoss(){

    salesOrders =
    JSON.parse(localStorage.getItem("salesOrders")) || [];

    purchaseOrders =
    JSON.parse(localStorage.getItem("purchaseOrders")) || [];

    expenses =
    JSON.parse(localStorage.getItem("expenses")) || [];

    cashBook =
    JSON.parse(localStorage.getItem("cashBook")) || [];

    bankTransactions =
    JSON.parse(localStorage.getItem("bankTransactions")) || [];

    calculateProfitLoss();

}

// =====================================
// Refresh Window Focus
// =====================================

window.addEventListener("focus",function(){

    refreshProfitLoss();

});

// =====================================
// Refresh Storage Change
// =====================================

window.addEventListener("storage",function(){

    refreshProfitLoss();

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

    calculateProfitLoss();

},5000);

// =====================================
// Initial Load
// =====================================

refreshProfitLoss();


console.log(
"BusinessOS Profit & Loss Module Loaded"
);