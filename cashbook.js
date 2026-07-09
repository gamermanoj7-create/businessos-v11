// =====================================
// BUSINESSOS V11
// Cash Book Module
// Part 1
// Setup + Save Transaction
// =====================================

// Transactions
let cashbook =
JSON.parse(localStorage.getItem("cashbook")) || [];

// Edit Mode
let editIndex = -1;

// =====================================
// Start
// =====================================

window.onload = function(){

    loadCashbook();

    updateCashBalance();

};

// =====================================
// Save Transaction
// =====================================

function saveTransaction(){

    const transaction={

        id:Date.now(),

        type:
        document.getElementById("transactionType").value,

        date:
        document.getElementById("transactionDate").value,

        category:
        document.getElementById("transactionCategory").value,

        description:
        document.getElementById("transactionDescription").value.trim(),

        amount:
        Number(
        document.getElementById("transactionAmount").value || 0
        ),

        paymentMethod:
        document.getElementById("paymentMethod").value

    };

    if(transaction.amount<=0){

        showToast(
            "Enter Valid Amount",
            "warning"
        );

        return;

    }

    if(editIndex===-1){

        cashbook.push(transaction);

        showToast(
            "Transaction Saved Successfully",
            "success"
        );

    }else{

        transaction.id =
        cashbook[editIndex].id;

        cashbook[editIndex] =
        transaction;

        editIndex = -1;

        showToast(
            "Transaction Updated Successfully",
            "success"
        );

    }

    localStorage.setItem(
        "cashbook",
        JSON.stringify(cashbook)
    );

    document
    .getElementById("cashbookForm")
    .reset();

    document.getElementById("transactionDate").value =
    new Date().toISOString().split("T")[0];

    loadCashbook();

    updateCashBalance();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    document.querySelector("#cashbookForm button").textContent =
    "💾 Save Transaction";

}

// =====================================
// Cash Balance
// =====================================

function updateCashBalance(){

    let balance = 0;

    cashbook.forEach(item=>{

        if(item.type==="Cash In"){

            balance += Number(item.amount);

        }else{

            balance -= Number(item.amount);

        }

    });

    const balanceElement =
    document.getElementById("cashBalance");

    if(balanceElement){

        balanceElement.textContent =
        "₹" + balance.toFixed(2);

    }

}
// =====================================
// BUSINESSOS V11
// Cash Book Module
// Part 2
// Transaction List + Search
// =====================================

// Load Cashbook
function loadCashbook(){

    const list =
    document.getElementById("cashbookTable");

    if(!list) return;

    list.innerHTML = "";

    if(cashbook.length===0){

        list.innerHTML = `

<div class="list-card">

<h3>💰 No Transaction Found</h3>

<p>Add your first transaction.</p>

</div>

`;

        document.getElementById("totalTransactions").textContent = "0";

        return;

    }

    let total = 0;

    cashbook.forEach((item,index)=>{

        total++;

        const badge =

        item.type==="Cash In"

        ?

        `<span class="success-badge">
        💰 Cash In
        </span>`

        :

        `<span class="danger-badge">
        💸 Cash Out
        </span>`;

        list.innerHTML += `

<div class="list-card">

<h3>${item.description || "Transaction"}</h3>

<div class="list-item">

<span class="list-label">

📅 Date

</span>

<span class="list-value">

${item.date}

</span>

</div>

<div class="list-item">

<span class="list-label">

📂 Category

</span>

<span class="list-value">

${item.category}

</span>

</div>

<div class="list-item">

<span class="list-label">

💰 Amount

</span>

<span class="list-value">

₹${item.amount.toFixed(2)}

</span>

</div>

<div class="list-item">

<span class="list-label">

💳 Payment

</span>

<span class="list-value">

${item.paymentMethod}

</span>

</div>

<div class="list-item">

<span class="list-label">

Type

</span>

<span class="list-value">

${badge}

</span>

</div>

<div class="card-actions">

<button
class="view-btn"
onclick="viewTransaction(${index})">

👁️ View

</button>

<button
class="edit-btn"
onclick="editTransaction(${index})">

✏️ Edit

</button>

<button
class="delete-btn"
onclick="deleteTransaction(${index})">

🗑️ Delete

</button>

</div>

</div>

`;

    });

    document.getElementById("totalTransactions").textContent =
    total;

}

// =====================================
// Search Transaction
// =====================================

function searchTransaction(){

    const value =
    document
    .getElementById("searchTransaction")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#cashbookTable .list-card")
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
// Cash Book Module
// Part 3
// View + Edit + Delete
// =====================================

// View Transaction
function viewTransaction(index){

    const item = cashbook[index];

    alert(

`💵 Transaction Details

📅 Date : ${item.date}

📂 Category : ${item.category}

📝 Description : ${item.description || "-"}

💰 Amount : ₹${Number(item.amount).toFixed(2)}

💳 Payment : ${item.paymentMethod}

📌 Type : ${item.type}`

    );

}

// =====================================
// Edit Transaction
// =====================================

function editTransaction(index){

    const item = cashbook[index];

    document.getElementById("transactionType").value =
    item.type;

    document.getElementById("transactionDate").value =
    item.date;

    document.getElementById("transactionCategory").value =
    item.category;

    document.getElementById("transactionDescription").value =
    item.description;

    document.getElementById("transactionAmount").value =
    item.amount;

    document.getElementById("paymentMethod").value =
    item.paymentMethod;

    editIndex = index;

    document.querySelector("#cashbookForm button[type='submit']").textContent =
    "✏️ Update Transaction";

    showToast(
        "Edit Mode Enabled",
        "info"
    );

}

// =====================================
// Delete Transaction
// =====================================

function deleteTransaction(index){

    if(!confirm(
        "Delete this transaction?"
    )){

        return;

    }

    cashbook.splice(index,1);

    localStorage.setItem(
        "cashbook",
        JSON.stringify(cashbook)
    );

    loadCashbook();

    updateCashBalance();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    editIndex = -1;

    document.querySelector("#cashbookForm button[type='submit']").textContent =
    "💾 Save Transaction";

    showToast(
        "Transaction Deleted Successfully",
        "success"
    );

}
// =====================================
// BUSINESSOS V11
// Cash Book Module
// Part 4
// Refresh + Dashboard
// =====================================

// Refresh Cash Book
function refreshCashbook(){

    cashbook =
    JSON.parse(localStorage.getItem("cashbook")) || [];

    loadCashbook();

    updateCashBalance();

}

// =====================================
// Refresh Window Focus
// =====================================

window.addEventListener("focus",function(){

    refreshCashbook();

});

// =====================================
// Refresh Storage Change
// =====================================

window.addEventListener("storage",function(){

    refreshCashbook();

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
// Cash Book Form Submit
// =====================================

document
.getElementById("cashbookForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    saveTransaction();

    updateDashboard();

});

// =====================================
// Set Today's Date
// =====================================

const transactionDate =
document.getElementById("transactionDate");

if(transactionDate){

    transactionDate.value =
    new Date().toISOString().split("T")[0];

}

// =====================================
// Initial Refresh
// =====================================

refreshCashbook();

console.log(
"BusinessOS Cash Book Module Loaded"
);