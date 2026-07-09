// =====================================
// BUSINESSOS V12
// Login Module
// Part 1
// Firebase Login
// =====================================

// Firebase


// Remember Me
let rememberUser = false;

// =====================================
// Initialize
// =====================================

window.onload = function(){

    initializeLogin();

};

function initializeLogin(){

    updateNetworkStatus();

    checkLoggedInUser();

    console.log(
        "✅ Login Module Initialized"
    );

}

// =====================================
// Remember Me
// =====================================

function toggleRemember(){

    const remember = document.getElementById("rememberMe");

    if(remember){

        rememberUser = remember.checked;

    }

}

// =====================================
// Login User
// =====================================

async function loginUser(){

    const email =
    document.getElementById("loginEmail")
    .value
    .trim();

    const password =
    document.getElementById("loginPassword")
    .value;

    if(email==="" || password===""){

        showToast(
            "Please enter Email & Password",
            "warning"
        );

        return;

    }

    try{

        showLoading();

        const persistence =

        rememberUser

        ?

        firebase.auth.Auth.Persistence.LOCAL

        :

        firebase.auth.Auth.Persistence.SESSION;

        await auth.setPersistence(
            persistence
        );

        const result =

        await auth.signInWithEmailAndPassword(

            email,

            password

        );

        showToast(

            "Login Successful",

            "success"

        );

        await loadUserProfile(

            result.user.uid

        );

    }

    catch(error){

        hideLoading();

        console.error(error);

        showToast(

            error.message,

            "error"

        );

    }

}

// =====================================
// Enter Key Login
// =====================================

document.addEventListener(

    "keydown",

    function(e){

        if(e.key==="Enter"){

            loginUser();

        }

    }

);
// =====================================
// BUSINESSOS V12
// Login Module
// Part 2
// User Profile + Redirect
// =====================================

// Load User Profile

async function loadUserProfile(uid){

    try{

        const doc = await db
        .collection("users")
        .doc(uid)
        .get();

        if(!doc.exists){

            hideLoading();

            showToast(
                "User Profile Not Found",
                "error"
            );

            await auth.signOut();

            return;

        }

        const user = doc.data();

        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );

        localStorage.setItem(
            "userRole",
            user.role || "Staff"
        );

        await updateLastLogin(uid);

        hideLoading();

        redirectByRole(
            user.role || "Staff"
        );

    }

    catch(error){

        hideLoading();

        console.error(error);

        showToast(
            error.message,
            "error"
        );

    }

}

// =====================================
// Update Last Login
// =====================================

async function updateLastLogin(uid){

    try{

        await db
        .collection("users")
        .doc(uid)
        .update({

            lastLogin:
            firebase.firestore.FieldValue.serverTimestamp(),

            updatedAt:
            firebase.firestore.FieldValue.serverTimestamp()

        });

    }

    catch(error){

        console.error(error);

    }

}

// =====================================
// Redirect By Role
// =====================================

function redirectByRole(role){

    switch(role){

        case "Admin":

        case "Manager":

        case "Staff":

            window.location.href =
            "index.html";

            break;

        default:

            showToast(
                "Invalid User Role",
                "error"
            );

            auth.signOut();

    }

}

// =====================================
// Get Current User
// =====================================

function getCurrentUser(){

    const user =
    localStorage.getItem(
        "currentUser"
    );

    return user

    ?

    JSON.parse(user)

    :

    null;

}
// =====================================
// BUSINESSOS V12
// Login Module
// Part 3
// Logout + Session + Security
// =====================================

// Logout User

async function logoutUser(){

    if(!confirm(
        "Are you sure you want to logout?"
    )){

        return;

    }

    try{

        showLoading();

        await auth.signOut();

        localStorage.removeItem(
            "currentUser"
        );

        localStorage.removeItem(
            "userRole"
        );

        localStorage.removeItem(
            "loginTime"
        );

        sessionStorage.clear();

        hideLoading();

        showToast(
            "Logout Successful",
            "success"
        );

        setTimeout(function(){

            window.location.href =
            "login.html";

        },1000);

    }

    catch(error){

        hideLoading();

        console.error(error);

        showToast(
            error.message,
            "error"
        );

    }

}

// =====================================
// Validate Session
// =====================================

function validateSession(){

    auth.onAuthStateChanged(

        function(user){

            if(!user){

                window.location.href =
                "login.html";

            }

        }

    );

}

// =====================================
// Protect Page
// =====================================

function protectPage(){

    const role =

    localStorage.getItem(
        "userRole"
    );

    if(!role){

        window.location.href =
        "login.html";

    }

}

// =====================================
// Admin Only
// =====================================

function adminOnly(){

    const role =
    localStorage.getItem(
        "userRole"
    );

    if(role!=="Admin"){

        showToast(
            "Admin Permission Required",
            "error"
        );

        window.location.href =
        "index.html";

    }

}

// =====================================
// Manager Access
// =====================================

function managerAccess(){

    const role =
    localStorage.getItem(
        "userRole"
    );

    if(

        role!=="Admin" &&

        role!=="Manager"

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
// Staff Access
// =====================================

function staffAccess(){

    const role =
    localStorage.getItem(
        "userRole"
    );

    if(

        role!=="Admin" &&
        role!=="Manager" &&
        role!=="Staff"

    ){

        showToast(
            "Unauthorized Access",
            "error"
        );

        window.location.href =
        "login.html";

    }

}
// =====================================
// BUSINESSOS V12
// Login Module
// Part 4
// Auto Login + User Info + Initialize
// =====================================

// Auto Login
function checkLoggedInUser(){

    auth.onAuthStateChanged(async(user)=>{

        if(!user){

            return;

        }

        try{

            await loadUserProfile(user.uid);

        }

        catch(error){

            console.error(error);

        }

    });

}

// =====================================
// Load Current User Info
// =====================================

function loadCurrentUser(){

    const user = getCurrentUser();

    if(!user){

        return;

    }

    const name =
    document.getElementById("userName");

    const email =
    document.getElementById("userEmail");

    const role =
    document.getElementById("userRole");

    if(name){

        name.textContent =
        user.fullName || "-";

    }

    if(email){

        email.textContent =
        user.email || "-";

    }

    if(role){

        role.textContent =
        user.role || "-";

    }

}

// =====================================
// Update Login Time
// =====================================

function updateLoginTime(){

    localStorage.setItem(

        "loginTime",

        new Date().toLocaleString()

    );

}

// =====================================
// Network Status
// =====================================

function updateNetworkStatus(){

    const status =

    document.getElementById(
        "onlineStatus"
    );

    if(!status){

        return;

    }

    status.textContent =

    navigator.onLine

    ?

    "🟢 Online"

    :

    "🔴 Offline";

}

window.addEventListener(

    "online",

    updateNetworkStatus

);

window.addEventListener(

    "offline",

    updateNetworkStatus

);

// =====================================
// Auto Session Check
// =====================================

setInterval(function(){

    auth.onAuthStateChanged(

        function(user){

            if(!user){

                window.location.href =
                "login.html";

            }

        }

    );

},60000);

// =====================================
// Initialize
// =====================================

function initializeLoginModule(){

    updateNetworkStatus();

    updateLoginTime();

    loadCurrentUser();

    checkLoggedInUser();

    console.log(

        "✅ BusinessOS V12 Login Module Ready"

    );

}

// =====================================
// Start Module
// =====================================

initializeLoginModule();