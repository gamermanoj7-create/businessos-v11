// =====================================
// BUSINESSOS V11
// Reports Module
// Part 1
// Firebase Setup + Summary
// =====================================

// Firestore Collections
const salesRef = db.collection("sales");
const purchaseRef = db.collection("purchases");
const expenseRef = db.collection("expenses");
const productRef = db.collection("products");
const customerRef = db.collection("customers");

// Variables
let sales = [];
let purchases = [];
let expenses = [];
let products = [];
let customers = [];

// =====================================
// Initialize
// =====================================

window.onload = function(){

    initializeReports();

};

function initializeReports(){

    loadReportSummary();

    loadReports();

    console.log(
        "✅ Reports Module Loaded"
    );

}

// =====================================
// Load Summary
// =====================================

async function loadReportSummary(){

    try{

        const [

            salesSnap,

            purchaseSnap,

            expenseSnap,

            productSnap,

            customerSnap

        ] = await Promise.all([

            salesRef.get(),

            purchaseRef.get(),

            expenseRef.get(),

            productRef.get(),

            customerRef.get()

        ]);

        sales = [];
        purchases = [];
        expenses = [];
        products = [];
        customers = [];

        salesSnap.forEach(doc=>{

            sales.push(doc.data());

        });

        purchaseSnap.forEach(doc=>{

            purchases.push(doc.data());

        });

        expenseSnap.forEach(doc=>{

            expenses.push(doc.data());

        });

        productSnap.forEach(doc=>{

            products.push(doc.data());

        });

        customerSnap.forEach(doc=>{

            customers.push(doc.data());

        });

        calculateSummary();

    }

    catch(error){

        console.error(error);

        showToast(
            "Failed to Load Reports",
            "error"
        );

    }

}

// =====================================
// Calculate Summary
// =====================================

function calculateSummary(){

    let totalSales = 0;
    let totalPurchase = 0;
    let totalExpense = 0;
    let totalStock = 0;
    let totalDue = 0;

    sales.forEach(item=>{

        totalSales +=
        Number(item.grandTotal || 0);

    });

    purchases.forEach(item=>{

        totalPurchase +=
        Number(item.grandTotal || 0);

    });

    expenses.forEach(item=>{

        totalExpense +=
        Number(item.amount || 0);

    });

    products.forEach(item=>{

        totalStock +=
        Number(item.stock || 0);

    });

    customers.forEach(item=>{

        totalDue +=
        Number(item.due || 0);

    });

    const profit =

    totalSales -

    totalPurchase -

    totalExpense;

    document.getElementById("reportSales").textContent =
    "₹" + totalSales.toFixed(2);

    document.getElementById("reportPurchase").textContent =
    "₹" + totalPurchase.toFixed(2);

    document.getElementById("reportExpense").textContent =
    "₹" + totalExpense.toFixed(2);

    document.getElementById("reportProfit").textContent =
    "₹" + profit.toFixed(2);

    document.getElementById("reportStock").textContent =
    totalStock;

    document.getElementById("reportDue").textContent =
    "₹" + totalDue.toFixed(2);

}
// =====================================
// BUSINESSOS V11
// Reports Module
// Part 2
// Report List + Search
// =====================================

// Load Reports
function loadReports(){

    const report =
    document.getElementById("reportTable");

    if(!report) return;

    report.innerHTML = "";

    // Low Stock Report
    products.forEach(product=>{

        if(Number(product.stock || 0) <= 5){

            report.innerHTML += `

<div class="list-card">

<h3>⚠️ Low Stock</h3>

<div class="list-item">
<span>📦 Product</span>
<span>${product.name}</span>
</div>

<div class="list-item">
<span>Stock</span>
<span>${product.stock}</span>
</div>

</div>

`;

        }

    });

    // Customer Due Report
    customers.forEach(customer=>{

        const due =
        Number(customer.due || 0);

        if(due > 0){

            report.innerHTML += `

<div class="list-card">

<h3>💰 Customer Due</h3>

<div class="list-item">
<span>👤 Customer</span>
<span>${customer.name}</span>
</div>

<div class="list-item">
<span>Due</span>
<span>₹${due.toFixed(2)}</span>
</div>

</div>

`;

        }

    });

    // No Report
    if(report.innerHTML===""){

        report.innerHTML = `

<div class="list-card">

<h3>✅ No Reports Found</h3>

<p>Everything looks good.</p>

</div>

`;

    }

}

// =====================================
// Search Report
// =====================================

function searchReport(){

    const value =
    document
    .getElementById("searchReport")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#reportTable .list-card")
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
// Live Firestore Update
// =====================================

salesRef.onSnapshot(()=>{

    loadReportSummary();

});

purchaseRef.onSnapshot(()=>{

    loadReportSummary();

});

expenseRef.onSnapshot(()=>{

    loadReportSummary();

});

productRef.onSnapshot(()=>{

    loadReportSummary();

    loadReports();

});

customerRef.onSnapshot(()=>{

    loadReportSummary();

    loadReports();

});
// =====================================
// BUSINESSOS V11
// Reports Module
// Part 3
// Print + Preview + Export
// =====================================

// Print Report
function printReport(){

    window.print();

    showToast(
        "Print Started",
        "info"
    );

}

// =====================================
// Preview Report
// =====================================

function previewReport(){

    const sales =
    document.getElementById("reportSales").textContent;

    const purchase =
    document.getElementById("reportPurchase").textContent;

    const expense =
    document.getElementById("reportExpense").textContent;

    const profit =
    document.getElementById("reportProfit").textContent;

    const stock =
    document.getElementById("reportStock").textContent;

    const due =
    document.getElementById("reportDue").textContent;

    showToast(
        "Report Preview Ready",
        "success"
    );

    console.log(

`BusinessOS Report

Sales : ${sales}

Purchase : ${purchase}

Expense : ${expense}

Profit : ${profit}

Stock : ${stock}

Customer Due : ${due}`

    );

}

// =====================================
// Export CSV
// =====================================

function exportCSV(){

    let csv =

`Report,Value
Total Sales,${document.getElementById("reportSales").textContent}
Total Purchase,${document.getElementById("reportPurchase").textContent}
Total Expense,${document.getElementById("reportExpense").textContent}
Net Profit,${document.getElementById("reportProfit").textContent}
Total Stock,${document.getElementById("reportStock").textContent}
Customer Due,${document.getElementById("reportDue").textContent}
`;

    const blob = new Blob(

        [csv],

        {

            type:"text/csv"

        }

    );

    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "BusinessOS_Report.csv";

    link.click();

    showToast(
        "CSV Exported",
        "success"
    );

}

// =====================================
// Export PDF
// =====================================

async function exportPDF(){

    const { jsPDF } = window.jspdf;

    const report =
    document.getElementById("reportSection");

    const canvas =
    await html2canvas(report);

    const img =
    canvas.toDataURL("image/png");

    const pdf =
    new jsPDF();

    pdf.addImage(

        img,

        "PNG",

        10,

        10,

        190,

        0

    );

    pdf.save(
        "BusinessOS_Report.pdf"
    );

    showToast(
        "PDF Exported",
        "success"
    );

}
// =====================================
// BUSINESSOS V11
// Reports Module
// Part 4
// Auto Refresh + Live Sync
// =====================================

// Refresh Reports
async function refreshReports(){

    await loadReportSummary();

    loadReports();

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

window.addEventListener(
"focus",
function(){

    refreshReports();

});

// =====================================
// Network Status
// =====================================

window.addEventListener(
"online",
function(){

    showToast(
        "Internet Connected",
        "success"
    );

    refreshReports();

});

window.addEventListener(
"offline",
function(){

    showToast(
        "Internet Disconnected",
        "warning"
    );

});

// =====================================
// Auto Refresh Every 30 Seconds
// =====================================

setInterval(function(){

    refreshReports();

},30000);

// =====================================
// Firestore Live Sync
// =====================================

salesRef.onSnapshot(refreshReports);

purchaseRef.onSnapshot(refreshReports);

expenseRef.onSnapshot(refreshReports);

productRef.onSnapshot(refreshReports);

customerRef.onSnapshot(refreshReports);

// =====================================
// Initialize Module
// =====================================

refreshReports();

console.log(
"✅ BusinessOS V11 Reports Module Ready"
);