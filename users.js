// =====================================
// BUSINESSOS V11
// Users Module
// Part 1
// Load Users
// =====================================

// Users Array
let users = [];

// =====================================
// Initialize
// =====================================

// =====================================
// Load Users
// =====================================

function loadUsers(){

    db.collection("users")
    .orderBy("createdAt","desc")
    .onSnapshot((snapshot)=>{

        users=[];

        snapshot.forEach((doc)=>{

            users.push({

                id:doc.id,

                ...doc.data()

            });

        });

        renderUsers();

        updateUserStats();

    },(error)=>{

        console.error(error);

        showToast(
            "Failed to load users",
            "error"
        );

    });

}

// =====================================
// Render Users
// =====================================

function renderUsers(){

    const table=
    document.getElementById("usersTable");

    if(!table) return;

    table.innerHTML="";

    if(users.length===0){

        table.innerHTML=`

<div class="list-card">

<h3>👥 No Users Found</h3>

<p>No registered users available.</p>

</div>

`;

        return;

    }

    users.forEach((user,index)=>{

        table.innerHTML+=`

<div class="list-card">

<h3>

👤 ${user.fullName || "Not Set"}

</h3>

<div class="list-item">

<span>Email</span>

<span>${user.email || "-"}</span>

</div>

<div class="list-item">

<span>Business</span>

<span>${user.businessName || "-"}</span>

</div>

<div class="list-item">

<span>Phone</span>

<span>${user.phone || "-"}</span>

</div>

<div class="list-item">

<span>Role</span>

<span>${user.role || "Staff"}</span>

</div>

<div class="list-item">

<span>Status</span>

<span>${user.status || "Active"}</span>

</div>

<div class="card-actions">

<button
class="view-btn"
onclick="viewUser(${index})">

👁 View

</button>

<button
class="edit-btn"
onclick="editUser(${index})">

✏ Edit

</button>

<button
class="delete-btn"
onclick="deleteUser('${user.id}')">

🗑 Delete

</button>

</div>

</div>

`;

    });

}

// =====================================
// Search Users
// =====================================

function searchUsers(){

    const value=

    document
    .getElementById("searchUser")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#usersTable .list-card")
    .forEach(card=>{

        card.style.display=

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
// Statistics
// =====================================

function updateUserStats(){

    let active=0;

    let inactive=0;

    users.forEach(user=>{

        if(user.status==="Active"){

            active++;

        }else{

            inactive++;

        }

    });

    document.getElementById("totalUsers").textContent=
    users.length;

    document.getElementById("activeUsers").textContent=
    active;

    document.getElementById("inactiveUsers").textContent=
    inactive;

}
// =====================================
// BUSINESSOS V11
// Users Module
// Part 2
// View + Edit + Role Management
// =====================================

// View User
function viewUser(index){

    const user = users[index];

    if(!user){

        showToast(
            "User Not Found",
            "error"
        );

        return;

    }

    alert(

`👤 USER DETAILS

Full Name : ${user.fullName || "Not Set"}

Business : ${user.businessName || "Not Set"}

Phone : ${user.phone || "Not Set"}

Email : ${user.email || "Not Set"}

Role : ${user.role || "Staff"}

Status : ${user.status || "Active"}

Created :

${user.createdAt
? user.createdAt.toDate().toLocaleString()
: "Not Available"}

Last Login :

${user.lastLogin
? user.lastLogin.toDate
? user.lastLogin.toDate().toLocaleString()
: new Date(user.lastLogin).toLocaleString()
: "Never"}

`);

}

// =====================================
// Edit User Role
// =====================================

function editUser(index){

    const user = users[index];

    if(!user){

        showToast(
            "User Not Found",
            "error"
        );

        return;

    }

    const role = prompt(

`Select Role

Admin
Manager
Staff`,

        user.role || "Staff"

    );

    if(!role) return;

    const newRole =
    role.trim();

    if(
        newRole!=="Admin" &&
        newRole!=="Manager" &&
        newRole!=="Staff"
    ){

        showToast(
            "Invalid Role",
            "warning"
        );

        return;

    }

    db.collection("users")
    .doc(user.id)
    .update({

        role:newRole,

        updatedAt:
        firebase.firestore.FieldValue.serverTimestamp()

    })

    .then(()=>{

        showToast(
            "Role Updated Successfully",
            "success"
        );

    })

    .catch((error)=>{

        console.error(error);

        showToast(
            error.message,
            "error"
        );

    });

}

// =====================================
// Activate User
// =====================================

function activateUser(index){

    const user = users[index];

    db.collection("users")
    .doc(user.id)
    .update({

        status:"Active"

    })

    .then(()=>{

        showToast(
            "User Activated",
            "success"
        );

    })

    .catch((error)=>{

        console.error(error);

        showToast(
            error.message,
            "error"
        );

    });

}

// =====================================
// Deactivate User
// =====================================

function deactivateUser(index){

    const user = users[index];

    db.collection("users")
    .doc(user.id)
    .update({

        status:"Inactive"

    })

    .then(()=>{

        showToast(
            "User Deactivated",
            "warning"
        );

    })

    .catch((error)=>{

        console.error(error);

        showToast(
            error.message,
            "error"
        );

    });

}

// =====================================
// Change User Role
// =====================================

function changeUserRole(index){

    editUser(index);

}
// =====================================
// BUSINESSOS V11
// Users Module
// Part 3
// Delete + Reset Password + Export
// =====================================

// Delete User
async function deleteUser(userId){

    if(!confirm(
        "Delete this user?"
    )){

        return;

    }

    try{

        await db
        .collection("users")
        .doc(userId)
        .delete();

        showToast(
            "User Deleted Successfully",
            "success"
        );

    }

    catch(error){

        console.error(error);

        showToast(
            error.message,
            "error"
        );

    }

}

// =====================================
// Password Reset
// =====================================

async function sendPasswordReset(index){

    const user = users[index];

    if(!user){

        showToast(
            "User Not Found",
            "error"
        );

        return;

    }

    try{

        await auth.sendPasswordResetEmail(
            user.email
        );

        showToast(
            "Password Reset Email Sent",
            "success"
        );

    }

    catch(error){

        console.error(error);

        showToast(
            error.message,
            "error"
        );

    }

}

// =====================================
// Export User
// =====================================

function exportUser(index){

    const user = users[index];

    if(!user){

        showToast(
            "User Not Found",
            "error"
        );

        return;

    }

    const json = JSON.stringify(

        user,

        null,

        2

    );

    const blob = new Blob(

        [json],

        {

            type:"application/json"

        }

    );

    const url =
    URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href = url;

    a.download =

    (user.fullName || "user") +

    ".json";

    a.click();

    URL.revokeObjectURL(url);

    showToast(
        "User Exported Successfully",
        "success"
    );

}

// =====================================
// User Summary
// =====================================

function userSummary(index){

    const user = users[index];

    if(!user){

        showToast(
            "User Not Found",
            "error"
        );

        return;

    }

    alert(

`👤 USER SUMMARY

Name :
${user.fullName || "Not Set"}

Business :
${user.businessName || "Not Set"}

Email :
${user.email || "Not Set"}

Phone :
${user.phone || "Not Set"}

Role :
${user.role || "Staff"}

Status :
${user.status || "Active"}

Created :
${user.createdAt
? user.createdAt.toDate().toLocaleString()
: "Not Available"}

Last Login :
${user.lastLogin
? user.lastLogin.toDate
? user.lastLogin.toDate().toLocaleString()
: new Date(user.lastLogin).toLocaleString()
: "Never"}

`);

}
// =====================================
// BUSINESSOS V11
// Users Module
// Part 4
// Security + Network + Initialize
// =====================================

// Refresh Users

// =====================================
// Dashboard Refresh
// =====================================



// =====================================
// Check Admin Access
// =====================================

function checkAdminAccess(){

    auth.onAuthStateChanged(async(user)=>{

        if(!user){

            window.location.href="login.html";

            return;

        }

        try{

            const doc = await db
            .collection("users")
            .doc(user.uid)
            .get();

            if(!doc.exists){

                showToast(
                    "User Profile Not Found",
                    "error"
                );

                await auth.signOut();

                window.location.href="login.html";

                return;

            }

            const data = doc.data();
if(data.role==="Admin"){

    showToast(
        "Admin Access Verified",
        "success"
    );

    return;

}
            if(data.role!=="Admin"){

                showToast(
                    "Admin Access Required",
                    "error"
                );

                setTimeout(function(){

                    window.location.href="index.html";

                },1500);

            }

        }

        catch(error){

            console.error(error);

            showToast(
                error.message,
                "error"
            );

        }

    });

}

// =====================================
// Network Status
// =====================================

function updateNetworkStatus(){

    const status =
    document.getElementById("networkStatus");

    if(!status) return;

    if(navigator.onLine){

        status.textContent =
        "🟢 Online";

    }else{

        status.textContent =
        "🔴 Offline";

    }

}

// =====================================
// Network Events
// =====================================

window.addEventListener(
    "online",
    function(){

        updateNetworkStatus();

        showToast(
            "Internet Connected",
            "success"
        );

    }
);

window.addEventListener(
    "offline",
    function(){

        updateNetworkStatus();

        showToast(
            "Internet Disconnected",
            "warning"
        );

    }
);

// =====================================
// Auto Refresh
// =====================================

setInterval(function(){

 loadUsers();

},30000);

// Refresh when page becomes active
window.addEventListener(
    "focus",
    function(){

        loadUsers();

    }
);

// =====================================
// Initialize Module
// =====================================

function initUsersModule(){

    checkAdminAccess();

    updateNetworkStatus();

  loadUsers();

    console.log(
        "✅ BusinessOS V11 Users Module Ready"
    );

}

// =====================================
// Start Module
// =====================================

initUsersModule();