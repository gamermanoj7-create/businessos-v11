// =====================================
// BUSINESSOS V11
// Auth Module
// Part 1
// Authentication Setup
// =====================================

// Firebase
const auth = firebase.auth();
const db = firebase.firestore();

// =====================================
// Current User
// =====================================

let currentUser = null;

let currentRole = "";

// =====================================
// Initialize
// =====================================

window.onload = function(){

    checkAuth();

};

// =====================================
// Check Authentication
// =====================================

function checkAuth(){

    auth.onAuthStateChanged(function(user){

        if(user){

            currentUser = user;

            loadCurrentUser(user.uid);

        }else{

            window.location.href =
            "login.html";

        }

    });

}

// =====================================
// Load User Data
// =====================================

function loadCurrentUser(uid){

    db.collection("users")

    .doc(uid)

    .get()

    .then((doc)=>{

        if(!doc.exists){

            showToast(
                "User Not Found",
                "error"
            );

            auth.signOut();

            return;

        }

        const data =
        doc.data();

        currentRole =
        data.role;

        localStorage.setItem(
            "currentUser",
            JSON.stringify(data)
        );

        localStorage.setItem(
            "userRole",
            data.role
        );

        updateUserUI(data);

    })

    .catch((error)=>{

        showToast(
            error.message,
            "error"
        );

    });

}

// =====================================
// Update User UI
// =====================================

function updateUserUI(user){

    const name =
    document.getElementById("userName");

    const email =
    document.getElementById("userEmail");

    const role =
    document.getElementById("userRole");

    if(name){

  name.textContent =
user.fullName;

    }

    if(email){

        email.textContent =
        user.email;

    }

    if(role){

        role.textContent =
        user.role;

    }

}
// =====================================
// BUSINESSOS V11
// Auth Module
// Part 2
// Role Permission
// =====================================

// Get Current Role
function getUserRole(){

    return currentRole;

}

// =====================================
// Admin Access
// =====================================

function isAdmin(){

    return currentRole === "Admin";

}

// =====================================
// Manager Access
// =====================================

function isManager(){

    return currentRole === "Manager";

}

// =====================================
// Staff Access
// =====================================

function isStaff(){

    return currentRole === "Staff";

}

// =====================================
// Admin Only
// =====================================

function requireAdmin(){

    if(!isAdmin()){

        showToast(
            "Admin Access Required",
            "error"
        );

        window.location.href =
        "index.html";

    }

}

// =====================================
// Manager or Admin
// =====================================

function requireManager(){

    if(

        !isAdmin() &&

        !isManager()

    ){

        showToast(

            "Permission Denied",

            "error"

        );

        window.location.href =
        "index.html";

    }

}

// =====================================
// Logged In User
// =====================================

function requireLogin(){

    if(!currentUser){

        window.location.href =
        "login.html";

    }

}

// =====================================
// Protect Page
// =====================================

function protectPage(requiredRole){

    requireLogin();

    switch(requiredRole){

        case "Admin":

            requireAdmin();

            break;

        case "Manager":

            requireManager();

            break;

        case "Staff":

            if(

                !isAdmin() &&

                !isManager() &&

                !isStaff()

            ){

                showToast(
                    "Permission Denied",
                    "error"
                );

                window.location.href =
                "login.html";

            }

            break;

    }

}
// =====================================
// BUSINESSOS V11
// Auth Module
// Part 3
// Logout + Session
// =====================================

// Logout
function logout(){

    if(!confirm(
        "Are you sure you want to logout?"
    )){

        return;

    }

    auth.signOut()

    .then(()=>{

        localStorage.removeItem(
            "currentUser"
        );

        localStorage.removeItem(
            "userRole"
        );

        sessionStorage.clear();

        showToast(
            "Logged Out Successfully",
            "success"
        );

        window.location.href =
        "login.html";

    })

    .catch((error)=>{

        showToast(
            error.message,
            "error"
        );

    });

}

// =====================================
// Update Last Login
// =====================================

function updateLastLogin(){

    if(!currentUser) return;

    db.collection("users")

    .doc(currentUser.uid)

    .update({

        lastLogin:
        firebase.firestore.FieldValue.serverTimestamp()

    });

}

// =====================================
// Session Validation
// =====================================

function validateSession(){

    auth.onAuthStateChanged(function(user){

        if(!user){

            window.location.href =
            "login.html";

        }

    });

}

// =====================================
// Online Status
// =====================================

function updateOnlineStatus(){

    const status =
    document.getElementById(
        "onlineStatus"
    );

    if(!status) return;

    if(navigator.onLine){

        status.textContent =
        "🟢 Online";

    }else{

        status.textContent =
        "🔴 Offline";

    }

}

window.addEventListener(
    "online",
    updateOnlineStatus
);

window.addEventListener(
    "offline",
    updateOnlineStatus
);

// =====================================
// Auto Session Refresh
// =====================================

setInterval(function(){

    validateSession();

},60000);

// =====================================
// Initialize
// =====================================

updateOnlineStatus();

updateLastLogin();

validateSession();
// =====================================
// BUSINESSOS V11
// Auth Module
// Part 4
// Auto Login + Dashboard Sync
// =====================================

// Auto Login
function autoLogin(){

    auth.onAuthStateChanged(function(user){

        if(user){

            currentUser = user;

            loadCurrentUser(user.uid);

        }

    });

}

// =====================================
// Reload User Profile
// =====================================

function refreshUserProfile(){

    if(!currentUser) return;

    loadCurrentUser(currentUser.uid);

}

// =====================================
// Auto Role Check
// =====================================

function refreshRole(){

    const role =
    localStorage.getItem("userRole");

    if(role){

        currentRole = role;

    }

}

// =====================================
// Dashboard Sync
// =====================================

function syncDashboard(){

    if(typeof refreshDashboard === "function"){

        refreshDashboard();

    }

}

// =====================================
// Refresh Auth
// =====================================

function refreshAuth(){

    refreshRole();

    refreshUserProfile();

    syncDashboard();

}

// =====================================
// Window Focus
// =====================================

window.addEventListener("focus",function(){

    refreshAuth();

});

// =====================================
// Storage Change
// =====================================

window.addEventListener("storage",function(){

    refreshAuth();

});

// =====================================
// Live Refresh
// =====================================

setInterval(function(){

    refreshAuth();

},30000);

// =====================================
// User Details
// =====================================

function getLoggedInUser(){

    return JSON.parse(

        localStorage.getItem(
            "currentUser"
        )

    );

}

// =====================================
// Module Ready
// =====================================

autoLogin();

refreshAuth();

console.log(
"BusinessOS Auth Module Loaded"
);