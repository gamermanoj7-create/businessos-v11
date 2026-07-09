// =====================================
// BUSINESSOS V11
// CRM Module
// Part 1
// Setup + Save Lead
// =====================================

// Leads
let leads =
JSON.parse(localStorage.getItem("leads")) || [];

// Edit Mode
let editIndex = -1;

// =====================================
// Start
// =====================================

window.onload = function(){

    loadLeads();

};

// =====================================
// Save Lead
// =====================================

function saveLead(){

    const lead={

        id:Date.now(),

        name:
        document.getElementById("leadName").value.trim(),

        company:
        document.getElementById("leadCompany").value.trim(),

        phone:
        document.getElementById("leadPhone").value.trim(),

        email:
        document.getElementById("leadEmail").value.trim(),

        whatsapp:
        document.getElementById("leadWhatsapp").value.trim(),

        followUp:
        document.getElementById("followUpDate").value,

        rating:
        document.getElementById("leadRating").value,

        status:
        document.getElementById("leadStatus").value,

        notes:
        document.getElementById("leadNotes").value.trim(),

        createdAt:
        new Date().toLocaleString()

    };

    if(lead.name===""){

        showToast(
            "Enter Customer Name",
            "warning"
        );

        return;

    }

    if(lead.phone===""){

        showToast(
            "Enter Phone Number",
            "warning"
        );

        return;

    }

    if(editIndex===-1){

        leads.push(lead);

        showToast(
            "Lead Added Successfully",
            "success"
        );

    }else{

        lead.id =
        leads[editIndex].id;

        lead.createdAt =
        leads[editIndex].createdAt;

        leads[editIndex] =
        lead;

        editIndex = -1;

        showToast(
            "Lead Updated Successfully",
            "success"
        );

    }

    localStorage.setItem(
        "leads",
        JSON.stringify(leads)
    );

    document
    .getElementById("crmForm")
    .reset();

    loadLeads();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    document.querySelector(
        "#crmForm button[type='submit']"
    ).textContent =
    "💾 Save Lead";

}
// =====================================
// BUSINESSOS V11
// CRM Module
// Part 2
// Lead List + Search
// =====================================

// Load Leads
function loadLeads(){

    const list =
    document.getElementById("leadTable");

    if(!list) return;

    list.innerHTML = "";

    if(leads.length===0){

        list.innerHTML = `

<div class="list-card">

<h3>👥 No Lead Found</h3>

<p>Add your first lead.</p>

</div>

`;

        document.getElementById("totalLeads").textContent = "0";

        return;

    }

    let total = 0;

    leads.forEach((lead,index)=>{

        total++;

        let badge = "";

        switch(lead.status){

            case "New":
                badge = `<span class="info-badge">🆕 New</span>`;
                break;

            case "Contacted":
                badge = `<span class="warning-badge">📞 Contacted</span>`;
                break;

            case "Qualified":
                badge = `<span class="primary-badge">⭐ Qualified</span>`;
                break;

            case "Won":
                badge = `<span class="success-badge">✅ Won</span>`;
                break;

            case "Lost":
                badge = `<span class="danger-badge">❌ Lost</span>`;
                break;

            default:
                badge = `<span>${lead.status}</span>`;
        }

        list.innerHTML += `

<div class="list-card">

<h3>👤 ${lead.name}</h3>

<div class="list-item">

<span class="list-label">
🏢 Company
</span>

<span class="list-value">
${lead.company || "-"}
</span>

</div>

<div class="list-item">

<span class="list-label">
📞 Phone
</span>

<span class="list-value">
${lead.phone}
</span>

</div>

<div class="list-item">

<span class="list-label">
⭐ Rating
</span>

<span class="list-value">
${lead.rating}
</span>

</div>

<div class="list-item">

<span class="list-label">
🎯 Status
</span>

<span class="list-value">
${badge}
</span>

</div>

<div class="card-actions">

<button
class="view-btn"
onclick="viewLead(${index})">

👁️ View

</button>

<button
class="edit-btn"
onclick="editLead(${index})">

✏️ Edit

</button>

<button
class="delete-btn"
onclick="deleteLead(${index})">

🗑️ Delete

</button>

<button
class="success-btn"
onclick="window.open('https://wa.me/${lead.whatsapp}','_blank')">

💬 WhatsApp

</button>

</div>

</div>

`;

    });

    document.getElementById("totalLeads").textContent =
    total;

}

// =====================================
// Search Lead
// =====================================

function searchLead(){

    const value =
    document
    .getElementById("searchLead")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#leadTable .list-card")
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
// CRM Module
// Part 3
// View + Edit + Delete
// =====================================

// View Lead
function viewLead(index){

    const lead = leads[index];

    alert(

`👤 Customer : ${lead.name}

🏢 Company : ${lead.company || "-"}

📞 Phone : ${lead.phone}

📧 Email : ${lead.email || "-"}

💬 WhatsApp : ${lead.whatsapp || "-"}

📅 Follow Up : ${lead.followUp || "-"}

⭐ Rating : ${lead.rating}

🎯 Status : ${lead.status}

📝 Notes : ${lead.notes || "-"}

🕒 Created : ${lead.createdAt}`

    );

}

// =====================================
// Edit Lead
// =====================================

function editLead(index){

    const lead = leads[index];

    document.getElementById("leadName").value =
    lead.name;

    document.getElementById("leadCompany").value =
    lead.company;

    document.getElementById("leadPhone").value =
    lead.phone;

    document.getElementById("leadEmail").value =
    lead.email;

    document.getElementById("leadWhatsapp").value =
    lead.whatsapp;

    document.getElementById("followUpDate").value =
    lead.followUp;

    document.getElementById("leadRating").value =
    lead.rating;

    document.getElementById("leadStatus").value =
    lead.status;

    document.getElementById("leadNotes").value =
    lead.notes;

    editIndex = index;

    document.querySelector("#crmForm button[type='submit']").textContent =
    "✏️ Update Lead";

    showToast(
        "Edit Mode Enabled",
        "info"
    );

}

// =====================================
// Delete Lead
// =====================================

function deleteLead(index){

    if(!confirm(
        "Delete this lead?"
    )){

        return;

    }

    leads.splice(index,1);

    localStorage.setItem(
        "leads",
        JSON.stringify(leads)
    );

    loadLeads();

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    editIndex = -1;

    document.querySelector("#crmForm button[type='submit']").textContent =
    "💾 Save Lead";

    showToast(
        "Lead Deleted Successfully",
        "success"
    );

}

// =====================================
// Follow-up Reminder
// =====================================

function checkFollowUps(){

    const today =
    new Date().toISOString().split("T")[0];

    leads.forEach(lead=>{

        if(
            lead.followUp===today &&
            lead.status!=="Won" &&
            lead.status!=="Lost"
        ){

            showToast(
                "Follow-up Today: " + lead.name,
                "warning"
            );

        }

    });

}
// =====================================
// BUSINESSOS V11
// CRM Module
// Part 4
// Refresh + Dashboard
// =====================================

// Refresh Leads
function refreshLeads(){

    leads =
    JSON.parse(localStorage.getItem("leads")) || [];

    loadLeads();

    checkFollowUps();

}

// =====================================
// Refresh Window Focus
// =====================================

window.addEventListener("focus",function(){

    refreshLeads();

});

// =====================================
// Refresh Storage Change
// =====================================

window.addEventListener("storage",function(){

    refreshLeads();

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
// CRM Form Submit
// =====================================

document
.getElementById("crmForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    saveLead();

    updateDashboard();

});

// =====================================
// Check Follow-up Every Minute
// =====================================

setInterval(function(){

    checkFollowUps();

},60000);

// =====================================
// Initial Refresh
// =====================================

refreshLeads();

console.log(
"BusinessOS CRM Module Loaded"
);