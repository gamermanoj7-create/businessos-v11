// =====================================
// BUSINESSOS V11
// Cash Flow Module
// Part 1
// Calculate Cash Flow
// =====================================

// Cash Book
let cashBook =
JSON.parse(localStorage.getItem("cashBook")) || [];

// Bank Transactions
let bankTransactions =
JSON.parse(localStorage.getItem("bankTransactions")) || [];

// Expenses
let expenses =
JSON.parse(localStorage.getItem("expenses")) || [];

// Sales Orders
let salesOrders =
JSON.parse(localStorage.getItem("salesOrders")) || [];

// Purchase Orders
let purchaseOrders =
JSON.parse(localStorage.getItem("purchaseOrders")) || [];

// =====================================
// Start
// =====================================

window.onload = function(){

    calculateCashFlow();

};

// =====================================
// Calculate Cash Flow
// =====================================

function calculateCashFlow(){

    let openingCash = 0;

    let cashIn = 0;

    let cashOut = 0;

    let bankIn = 0;

    let bankOut = 0;

    // Cash Book
    cashBook.forEach(item=>{

        const amount =
        Number(item.amount || 0);

        openingCash += amount;

        if(amount >= 0){

            cashIn += amount;

        }else{

            cashOut += Math.abs(amount);

        }

    });

    // Bank
    bankTransactions.forEach(item=>{

        const amount =
        Number(item.amount || 0);

        if(amount >= 0){

            bankIn += amount;

        }else{

            bankOut += Math.abs(amount);

        }

    });

    // Sales (Cash In)
    salesOrders.forEach(order=>{

        cashIn +=
        Number(order.total || 0);

    });

    // Purchase (Cash Out)
    purchaseOrders.forEach(order=>{

        cashOut +=
        Number(order.total || 0);

    });

    // Expenses (Cash Out)
    expenses.forEach(expense=>{

        cashOut +=
        Number(expense.amount || 0);

    });

    const netCashFlow =

    (cashIn + bankIn) -

    (cashOut + bankOut);

    const closingCash =

    openingCash +

    netCashFlow;

    document.getElementById(
    "openingCash").textContent =
    "₹" + openingCash.toFixed(2);

    document.getElementById(
    "cashIn").textContent =
    "₹" + cashIn.toFixed(2);

    document.getElementById(
    "cashOut").textContent =
    "₹" + cashOut.toFixed(2);

    document.getElementById(
    "bankIn").textContent =
    "₹" + bankIn.toFixed(2);

    document.getElementById(
    "bankOut").textContent =
    "₹" + bankOut.toFixed(2);

    document.getElementById(
    "netCashFlow").textContent =
    "₹" + netCashFlow.toFixed(2);

    document.getElementById(
    "closingCash").textContent =
    "₹" + closingCash.toFixed(2);

}
// =====================================
// BUSINESSOS V11
// Cash Flow Module
// Part 2
// Summary + Activities
// =====================================

// =====================================
// Cash Flow Summary
// =====================================

function showCashFlowSummary(){

    const opening =
    document.getElementById(
    "openingCash").textContent;

    const inflow =
    document.getElementById(
    "cashIn").textContent;

    const outflow =
    document.getElementById(
    "cashOut").textContent;

    const net =
    document.getElementById(
    "netCashFlow").textContent;

    const closing =
    document.getElementById(
    "closingCash").textContent;

    alert(

`📊 Cash Flow Summary

💵 Opening Cash : ${opening}

💰 Cash In : ${inflow}

💸 Cash Out : ${outflow}

📈 Net Cash Flow : ${net}

💼 Closing Cash : ${closing}`

    );

}

// =====================================
// Operating Activities
// =====================================

function operatingActivities(){

    showToast(
        "Operating Activities Report Ready",
        "success"
    );

    showCashFlowSummary();

}

// =====================================
// Investing Activities
// =====================================

function investingActivities(){

    showToast(
        "Investing Activities Report Ready",
        "success"
    );

}

// =====================================
// Financing Activities
// =====================================

function financingActivities(){

    showToast(
        "Financing Activities Report Ready",
        "success"
    );

}

// =====================================
// Date Filter
// =====================================

function filterCashFlow(){

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
        "Cash Flow Filter Applied",
        "success"
    );

}

// =====================================
// Financial Status
// =====================================

function cashFlowStatus(){

    const net =
    parseFloat(

        document
        .getElementById("netCashFlow")
        .textContent
        .replace("₹","")

    );

    if(net>0){

        showToast(
            "Positive Cash Flow",
            "success"
        );

    }else if(net<0){

        showToast(
            "Negative Cash Flow",
            "error"
        );

    }else{

        showToast(
            "Neutral Cash Flow",
            "info"
        );

    }

}
// =====================================
// BUSINESSOS V11
// Cash Flow Module
// Part 3
// Print + Export
// =====================================

// Print Cash Flow
function printCashFlow(){

    const report =

`******** CASH FLOW REPORT ********

Opening Cash :
${document.getElementById("openingCash").textContent}

Cash In :
${document.getElementById("cashIn").textContent}

Cash Out :
${document.getElementById("cashOut").textContent}

Bank In :
${document.getElementById("bankIn").textContent}

Bank Out :
${document.getElementById("bankOut").textContent}

--------------------------------

Net Cash Flow :
${document.getElementById("netCashFlow").textContent}

Closing Cash :
${document.getElementById("closingCash").textContent}

********************************`;

    alert(report);

}

// =====================================
// Export PDF
// =====================================

function exportCashFlowPDF(){

    showToast(
        "PDF Export Coming Soon",
        "info"
    );

    console.log(
        "Export Cash Flow PDF"
    );

}

// =====================================
// Export Excel
// =====================================

function exportCashFlowExcel(){

    showToast(
        "Excel Export Coming Soon",
        "info"
    );

    console.log(
        "Export Cash Flow Excel"
    );

}

// =====================================
// Financial Report
// =====================================

function cashFlowReport(){

    alert(

`📊 Cash Flow Financial Report

💵 Opening Cash :
${document.getElementById("openingCash").textContent}

💰 Cash In :
${document.getElementById("cashIn").textContent}

💸 Cash Out :
${document.getElementById("cashOut").textContent}

🏦 Bank In :
${document.getElementById("bankIn").textContent}

🏦 Bank Out :
${document.getElementById("bankOut").textContent}

📈 Net Cash Flow :
${document.getElementById("netCashFlow").textContent}

💼 Closing Cash :
${document.getElementById("closingCash").textContent}`

    );

}

// =====================================
// Cash Flow Performance
// =====================================

function cashFlowPerformance(){

    const net = parseFloat(

        document
        .getElementById("netCashFlow")
        .textContent
        .replace("₹","")

    );

    if(net > 0){

        showToast(
            "Excellent Cash Flow",
            "success"
        );

    }else if(net < 0){

        showToast(
            "Negative Cash Flow",
            "error"
        );

    }else{

        showToast(
            "Stable Cash Flow",
            "info"
        );

    }

}
// =====================================
// BUSINESSOS V11
// Cash Flow Module
// Part 4
// Refresh + Dashboard
// =====================================

// Refresh Cash Flow
function refreshCashFlow(){

    cashBook =
    JSON.parse(localStorage.getItem("cashBook")) || [];

    bankTransactions =
    JSON.parse(localStorage.getItem("bankTransactions")) || [];

    expenses =
    JSON.parse(localStorage.getItem("expenses")) || [];

    salesOrders =
    JSON.parse(localStorage.getItem("salesOrders")) || [];

    purchaseOrders =
    JSON.parse(localStorage.getItem("purchaseOrders")) || [];

    calculateCashFlow();

}

// =====================================
// Refresh Window Focus
// =====================================

window.addEventListener("focus",function(){

    refreshCashFlow();

});

// =====================================
// Refresh Storage Change
// =====================================

window.addEventListener("storage",function(){

    refreshCashFlow();

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

    calculateCashFlow();

},5000);

// =====================================
// Initial Load
// =====================================

refreshCashFlow();

// cashFlowPerformance();

console.log(
"BusinessOS Cash Flow Module Loaded"
);