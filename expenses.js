// =====================================
// BUSINESSOS V11
// Expenses Module (Firebase)
// Part 1
// Setup + Load Expenses
// =====================================

// Firestore Collection
const expensesRef = db.collection("expenses");

// Expense List
let expenses = [];

// Edit Expense ID
let editId = null;

// =====================================
// Start
// =====================================

window.onload = function () {

    loadExpenses();

};

// =====================================
// Load Expenses From Firestore
// =====================================

async function loadExpenses() {

    const list =
    document.getElementById("expenseTable");

    if (!list) return;

    list.innerHTML = "";

    expenses = [];

    try {

        const snapshot =
        await expensesRef
        .orderBy("createdAt", "desc")
        .get();

        snapshot.forEach((doc) => {

            expenses.push({

                id: doc.id,

                ...doc.data()

            });

        });

        if (expenses.length === 0) {

            list.innerHTML = `

<div class="list-card">

<h3>💸 No Expense Found</h3>

<p>Add your first expense.</p>

</div>

`;

            return;

        }

        expenses.forEach((expense, index) => {

            list.innerHTML += `

<div class="list-card">

<h3>💸 ${expense.category}</h3>

<div class="list-item">

<span class="list-label">

📝 Description

</span>

<span class="list-value">

${expense.description || "-"}

</span>

</div>

<div class="list-item">

<span class="list-label">

💰 Amount

</span>

<span class="list-value">

₹${Number(expense.amount).toFixed(2)}

</span>

</div>

<div class="list-item">

<span class="list-label">

📅 Date

</span>

<span class="list-value">

${expense.date || "-"}

</span>

</div>

<div class="card-actions">

<button
class="view-btn"
onclick="viewExpense(${index})">

👁️ View

</button>

<button
class="edit-btn"
onclick="editExpense(${index})">

✏️ Edit

</button>

<button
class="delete-btn"
onclick="deleteExpense('${expense.id}')">

🗑️ Delete

</button>

</div>

</div>

`;

        });

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}

console.log(
"✅ Expenses Firebase Part 1 Loaded"
);
// =====================================
// BUSINESSOS V11
// Expenses Module (Firebase)
// Part 2
// Save + Update Expense
// =====================================

async function saveExpense() {

    const expense = {

        category:
        document.getElementById("expenseCategory").value,

        description:
        document.getElementById("expenseDescription").value.trim(),

        amount: Number(
        document.getElementById("expenseAmount").value || 0
        ),

        date:
        document.getElementById("expenseDate").value,

        createdAt:
        firebase.firestore.FieldValue.serverTimestamp()

    };

    if(expense.category===""){

        alert("Select Expense Category");

        return;

    }

    if(expense.amount<=0){

        alert("Enter Expense Amount");

        return;

    }

    try{

        if(editId===null){

            await expensesRef.add(expense);

            alert("✅ Expense Saved Successfully");

        }else{

            await expensesRef.doc(editId).update({

                category: expense.category,

                description: expense.description,

                amount: expense.amount,

                date: expense.date

            });

            alert("✅ Expense Updated Successfully");

            editId = null;

        }

        document
        .getElementById("expenseForm")
        .reset();

        loadExpenses();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}

// =====================================
// Expense Form Submit
// =====================================

document
.getElementById("expenseForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    saveExpense();

});

console.log(
"✅ Expenses Firebase Part 2 Loaded"
);
// =====================================
// BUSINESSOS V11
// Expenses Module (Firebase)
// Part 3
// View + Edit + Delete Expense
// =====================================

// View Expense
function viewExpense(index){

    const expense = expenses[index];

    alert(

`💸 Category : ${expense.category}

📝 Description : ${expense.description || "-"}

💰 Amount : ₹${Number(expense.amount).toFixed(2)}

📅 Date : ${expense.date || "-"}`

    );

}

// =====================================
// Edit Expense
// =====================================

function editExpense(index){

    const expense = expenses[index];

    document.getElementById("expenseCategory").value =
    expense.category;

    document.getElementById("expenseDescription").value =
    expense.description || "";

    document.getElementById("expenseAmount").value =
    expense.amount;

    document.getElementById("expenseDate").value =
    expense.date;

    editId = expense.id;

    document.querySelector("#expenseForm button[type='submit']").textContent =
    "✏️ Update Expense";

    alert("✏️ Edit Mode Enabled");

}

// =====================================
// Delete Expense
// =====================================

async function deleteExpense(id){

    if(!confirm("Delete this Expense?")){

        return;

    }

    try{

        await expensesRef.doc(id).delete();

        alert("🗑️ Expense Deleted Successfully");

        loadExpenses();

        editId = null;

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}

console.log(
"✅ Expenses Firebase Part 3 Loaded"
);
// =====================================
// BUSINESSOS V11
// Expenses Module (Firebase)
// Part 4
// Search + Refresh + Live Update
// =====================================

// Search Expense
function searchExpense(){

    const value =
    document
    .getElementById("searchExpense")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#expenseTable .list-card")
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
// Refresh Expenses
// =====================================

function refreshExpenses(){

    loadExpenses();

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

    refreshExpenses();

});

// =====================================
// Firestore Live Update
// =====================================

expensesRef.onSnapshot(function(){

    loadExpenses();

});

// =====================================
// Auto Refresh Every 10 Seconds
// =====================================

setInterval(function(){

    refreshExpenses();

},10000);

// =====================================
// Initial Load
// =====================================

refreshExpenses();

console.log(
"✅ Expenses Firebase Module Completed"
);