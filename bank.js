// =====================================
// BUSINESSOS V11
// Bank Module
// Part 1
// Setup + Save Bank Account
// =====================================

// Bank Accounts
let bankAccounts =
JSON.parse(localStorage.getItem("bankAccounts")) || [];

// Edit Mode
let editIndex = -1;

// =====================================
// Start
// =====================================

window.onload = function(){

    loadBankAccounts();

    updateTotalBankBalance();

};

// =====================================
// Save Bank Account
// =====================================

function saveBankAccount(){

    const account = {

        id: Date.now(),

        accountId:
        "BANK-" + Date.now(),

        bankName:
        document.getElementById("bankName").value.trim(),

        accountHolder:
        document.getElementById("accountHolder").value.trim(),

        accountNumber:
        document.getElementById("accountNumber").value.trim(),

        ifsc:
        document.getElementById("ifscCode").value.trim(),

        openingBalance:
        Number(
        document.getElementById("openingBalance").value || 0
        ),

        currentBalance:
        Number(
        document.getElementById("openingBalance").value || 0
        )

    };

    if(account.bankName===""){

        showToast(
            "Enter Bank Name",
            "warning"
        );

        return;

    }

    if(account.accountHolder===""){

        showToast(
            "Enter Account Holder",
            "warning"
        );

        return;

    }

    if(account.accountNumber===""){

        showToast(
            "Enter Account Number",
            "warning"
        );

        return;

    }

    if(editIndex===-1){

        bankAccounts.push(account);

        showToast(
            "Bank Account Added",
            "success"
        );

    }else{

        account.id =
        bankAccounts[editIndex].id;

        account.accountId =
        bankAccounts[editIndex].accountId;

        account.currentBalance =
        bankAccounts[editIndex].currentBalance;

        bankAccounts[editIndex] =
        account;

        editIndex = -1;

        showToast(
            "Bank Account Updated",
            "success"
        );

    }

    localStorage.setItem(
        "bankAccounts",
        JSON.stringify(bankAccounts)
    );

    document
    .getElementById("bankForm")
    .reset();

    loadBankAccounts();

    updateTotalBankBalance();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    document.querySelector(
        "#bankForm button[type='submit']"
    ).textContent =
    "💾 Save Account";

}

// =====================================
// Total Balance
// =====================================

function updateTotalBankBalance(){

    let total = 0;

    bankAccounts.forEach(account=>{

        total +=
        Number(account.currentBalance || 0);

    });

    const balance =
    document.getElementById("totalBankBalance");

    if(balance){

        balance.textContent =
        "₹" + total.toFixed(2);

    }

}
// =====================================
// BUSINESSOS V11
// Bank Module
// Part 2
// Account List + Search
// =====================================

// Load Bank Accounts
function loadBankAccounts(){

    const list =
    document.getElementById("bankTable");

    if(!list) return;

    list.innerHTML = "";

    if(bankAccounts.length===0){

        list.innerHTML = `

<div class="list-card">

<h3>🏦 No Bank Account Found</h3>

<p>Add your first bank account.</p>

</div>

`;

        document.getElementById("totalAccounts").textContent = "0";

        return;

    }

    let total = 0;

    bankAccounts.forEach((account,index)=>{

        total++;

        list.innerHTML += `

<div class="list-card">

<h3>🏦 ${account.bankName}</h3>

<div class="list-item">

<span class="list-label">

👤 Holder

</span>

<span class="list-value">

${account.accountHolder}

</span>

</div>

<div class="list-item">

<span class="list-label">

🔢 Account No

</span>

<span class="list-value">

${account.accountNumber}

</span>

</div>

<div class="list-item">

<span class="list-label">

🌿 IFSC

</span>

<span class="list-value">

${account.ifsc}

</span>

</div>

<div class="list-item">

<span class="list-label">

💰 Balance

</span>

<span class="list-value">

₹${Number(account.currentBalance).toFixed(2)}

</span>

</div>

<div class="card-actions">

<button
class="view-btn"
onclick="viewBankAccount(${index})">

👁️ View

</button>

<button
class="edit-btn"
onclick="editBankAccount(${index})">

✏️ Edit

</button>

<button
class="delete-btn"
onclick="deleteBankAccount(${index})">

🗑️ Delete

</button>

</div>

</div>

`;

    });

    document.getElementById("totalAccounts").textContent =
    total;

}

// =====================================
// Search Bank Account
// =====================================

function searchBankAccount(){

    const value =
    document
    .getElementById("searchBank")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#bankTable .list-card")
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
// Bank Module
// Part 3
// View + Edit + Delete
// =====================================

// View Account
function viewBankAccount(index){

    const account = bankAccounts[index];

    alert(

`🏦 Bank : ${account.bankName}

👤 Holder : ${account.accountHolder}

🔢 Account No : ${account.accountNumber}

🌿 IFSC : ${account.ifsc}

💰 Opening Balance : ₹${Number(account.openingBalance).toFixed(2)}

💵 Current Balance : ₹${Number(account.currentBalance).toFixed(2)}`

    );

}

// =====================================
// Edit Account
// =====================================

function editBankAccount(index){

    const account = bankAccounts[index];

    document.getElementById("bankName").value =
    account.bankName;

    document.getElementById("accountHolder").value =
    account.accountHolder;

    document.getElementById("accountNumber").value =
    account.accountNumber;

    document.getElementById("ifscCode").value =
    account.ifsc;

    document.getElementById("openingBalance").value =
    account.openingBalance;

    editIndex = index;

    document.querySelector("#bankForm button[type='submit']").textContent =
    "✏️ Update Account";

    showToast(
        "Edit Mode Enabled",
        "info"
    );

}

// =====================================
// Delete Account
// =====================================

function deleteBankAccount(index){

    if(!confirm("Delete this bank account?")){

        return;

    }

    bankAccounts.splice(index,1);

    localStorage.setItem(
        "bankAccounts",
        JSON.stringify(bankAccounts)
    );

    loadBankAccounts();

    updateTotalBankBalance();

    editIndex = -1;

    document.querySelector("#bankForm button[type='submit']").textContent =
    "💾 Save Account";

    showToast(
        "Bank Account Deleted",
        "success"
    );

}

// =====================================
// Deposit Money
// =====================================

function depositMoney(index){

    const amount =
    Number(prompt("Enter Deposit Amount"));

    if(amount<=0 || isNaN(amount)){

        return;

    }

    bankAccounts[index].currentBalance += amount;

    localStorage.setItem(
        "bankAccounts",
        JSON.stringify(bankAccounts)
    );

    loadBankAccounts();

    updateTotalBankBalance();

    showToast(
        "Money Deposited",
        "success"
    );

}

// =====================================
// Withdraw Money
// =====================================

function withdrawMoney(index){

    const amount =
    Number(prompt("Enter Withdraw Amount"));

    if(amount<=0 || isNaN(amount)){

        return;

    }

    if(amount > bankAccounts[index].currentBalance){

        showToast(
            "Insufficient Balance",
            "error"
        );

        return;

    }

    bankAccounts[index].currentBalance -= amount;

    localStorage.setItem(
        "bankAccounts",
        JSON.stringify(bankAccounts)
    );

    loadBankAccounts();

    updateTotalBankBalance();

    showToast(
        "Money Withdrawn",
        "success"
    );

}
// =====================================
// BUSINESSOS V11
// Bank Module
// Part 4
// Refresh + Dashboard
// =====================================

// Refresh Bank Accounts
function refreshBankAccounts(){

    bankAccounts =
    JSON.parse(localStorage.getItem("bankAccounts")) || [];

    loadBankAccounts();

    updateTotalBankBalance();

}

// =====================================
// Refresh Window Focus
// =====================================

window.addEventListener("focus",function(){

    refreshBankAccounts();

});

// =====================================
// Refresh Storage Change
// =====================================

window.addEventListener("storage",function(){

    refreshBankAccounts();

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
// Bank Form Submit
// =====================================

document
.getElementById("bankForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    saveBankAccount();

    updateDashboard();

});

// =====================================
// Initial Refresh
// =====================================

refreshBankAccounts();

console.log(
"BusinessOS Bank Module Loaded"
);