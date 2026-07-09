// =====================================
// BUSINESSOS V12
// Profile Module
// Part 1
// Firebase + Load Profile
// =====================================

// Firebase
const auth = firebase.auth();
const db = firebase.firestore();

// Current User
let currentUser = null;

// =====================================
// Initialize
// =====================================

window.onload = function(){

    initializeProfile();

};

function initializeProfile(){

    updateOnlineStatus();

    auth.onAuthStateChanged(async(user)=>{

        if(!user){

            window.location.href =
            "login.html";

            return;

        }

        currentUser = user;

        await loadProfile();

    });

}

// =====================================
// Load Profile
// =====================================

async function loadProfile(){

    try{

        const doc = await db
        .collection("users")
        .doc(currentUser.uid)
        .get();

        if(!doc.exists){

            showToast(
                "Profile Not Found",
                "error"
            );

            return;

        }

        const data = doc.data();

        displayProfile(data);

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
// Display Profile
// =====================================

function displayProfile(data){

    document.getElementById("profileName").value =
    data.fullName || "";

    document.getElementById("profileBusiness").value =
    data.businessName || "";

    document.getElementById("profilePhone").value =
    data.phone || "";

    document.getElementById("profileEmail").value =
    data.email || "";

    document.getElementById("profileRole").value =
    data.role || "Staff";

    document.getElementById("profileStatus").value =
    data.status || "Active";

    document.getElementById("createdDate").textContent =

    data.createdAt && data.createdAt.toDate
    ?

    data.createdAt.toDate().toLocaleString()

    :

    "-";

    document.getElementById("lastLogin").textContent =

    data.lastLogin && data.lastLogin.toDate
    ?

    data.lastLogin.toDate().toLocaleString()

    :

    "-";

    console.log(
        "✅ Profile Loaded Successfully"
    );

}
// =====================================
// BUSINESSOS V12
// Profile Module
// Part 2
// Edit + Save + Reset
// =====================================

// Enable Edit

function enableEdit(){

    document
    .getElementById("profileName")
    .removeAttribute("readonly");

    document
    .getElementById("profileBusiness")
    .removeAttribute("readonly");

    document
    .getElementById("profilePhone")
    .removeAttribute("readonly");

    document
    .getElementById("profilePhoto")
    .removeAttribute("readonly");

    showToast(
        "Edit Mode Enabled",
        "success"
    );

}

// =====================================
// Save Profile
// =====================================

async function saveProfile(){

    if(!currentUser){

        showToast(
            "Please Login Again",
            "error"
        );

        return;

    }

    const fullName =
    document
    .getElementById("profileName")
    .value
    .trim();

    const businessName =
    document
    .getElementById("profileBusiness")
    .value
    .trim();

    const phone =
    document
    .getElementById("profilePhone")
    .value
    .trim();

    if(fullName===""){

        showToast(
            "Full Name Required",
            "warning"
        );

        return;

    }

    try{

        showLoading();

        await db
        .collection("users")
        .doc(currentUser.uid)
        .update({

            fullName:fullName,

            businessName:businessName,

            phone:phone,

            updatedAt:
            firebase.firestore.FieldValue.serverTimestamp()

        });

        await currentUser.updateProfile({

            displayName:fullName

        });

        hideLoading();

        showToast(
            "Profile Updated Successfully",
            "success"
        );

        await loadProfile();

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
// Reset Profile
// =====================================

function resetProfile(){

    if(!currentUser){

        return;

    }

    loadProfile();

    showToast(
        "Profile Reloaded",
        "info"
    );

}

// =====================================
// Disable Edit
// =====================================

function disableEdit(){

    document
    .getElementById("profileName")
    .setAttribute("readonly",true);

    document
    .getElementById("profileBusiness")
    .setAttribute("readonly",true);

    document
    .getElementById("profilePhone")
    .setAttribute("readonly",true);

    document
    .getElementById("profilePhoto")
    .setAttribute("readonly",true);

}
// =====================================
// BUSINESSOS V12
// Profile Module
// Part 3
// Photo + Password + Verification
// =====================================

// Update Profile Photo

async function updateProfilePhoto(){

    if(!currentUser){

        showToast(
            "Please Login Again",
            "error"
        );

        return;

    }

    const photoURL =
    document
    .getElementById("profilePhoto")
    .value
    .trim();

    if(photoURL===""){

        showToast(
            "Enter Profile Photo URL",
            "warning"
        );

        return;

    }

    try{

        showLoading();

        await currentUser.updateProfile({

            photoURL:photoURL

        });

        await db
        .collection("users")
        .doc(currentUser.uid)
        .update({

            photoURL:photoURL,

            updatedAt:
            firebase.firestore.FieldValue.serverTimestamp()

        });

        document
        .getElementById("profileImage")
        .src = photoURL;

        hideLoading();

        showToast(
            "Profile Photo Updated",
            "success"
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
// Change Password
// =====================================

async function changePassword(){

    if(!currentUser){

        showToast(
            "Please Login Again",
            "error"
        );

        return;

    }

    const password =
    document
    .getElementById("newPassword")
    .value
    .trim();

    if(password.length<6){

        showToast(
            "Password must be at least 6 characters",
            "warning"
        );

        return;

    }

    try{

        showLoading();

        await currentUser.updatePassword(
            password
        );

        document
        .getElementById("newPassword")
        .value = "";

        hideLoading();

        showToast(
            "Password Updated Successfully",
            "success"
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
// Verify Email
// =====================================

async function verifyEmail(){

    if(!currentUser){

        showToast(
            "Please Login Again",
            "error"
        );

        return;

    }

    try{

        await currentUser.sendEmailVerification();

        showToast(
            "Verification Email Sent",
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
// Check Verification
// =====================================

async function checkVerification(){

    if(!currentUser){

        return;

    }

    try{

        await currentUser.reload();

        document
        .getElementById("emailStatus")
        .textContent =

        currentUser.emailVerified

        ?

        "✅ Verified"

        :

        "❌ Not Verified";

    }

    catch(error){

        console.error(error);

    }

}

// =====================================
// Load Profile Image
// =====================================

function loadProfilePhoto(){

    const image =
    document.getElementById("profileImage");

    image.src =

    currentUser.photoURL ||

    "images/default-user.png";

    image.onerror = function(){

        this.src =
        "images/default-user.png";

    };

}
// =====================================
// BUSINESSOS V12
// Profile Module
// Part 4
// Logout + Refresh + Network + Initialize
// =====================================

// Logout

async function logoutUser(){

    if(!confirm(
        "Are you sure you want to logout?"
    )){

        return;

    }

    try{

        showLoading();

        await auth.signOut();

        localStorage.clear();

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
// Network Status
// =====================================

function updateOnlineStatus(){

    const status =
    document.getElementById("onlineStatus");

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

    function(){

        updateOnlineStatus();

        showToast(
            "Internet Connected",
            "success"
        );

    }

);

window.addEventListener(

    "offline",

    function(){

        updateOnlineStatus();

        showToast(
            "Internet Disconnected",
            "warning"
        );

    }

);

// =====================================
// Refresh Profile
// =====================================

async function refreshProfile(){

    if(!currentUser){

        return;

    }

    await loadProfile();

    loadProfilePhoto();

    await checkVerification();

    showToast(
        "Profile Refreshed",
        "success"
    );

}

// =====================================
// Auto Refresh
// =====================================

setInterval(function(){

    if(currentUser){

        refreshProfile();

    }

},30000);

// =====================================
// Window Focus
// =====================================

window.addEventListener(

    "focus",

    function(){

        if(currentUser){

            refreshProfile();

        }

    }

);

// =====================================
// Initialize Module
// =====================================

function initializeProfileModule(){

    updateOnlineStatus();

    console.log(

        "✅ BusinessOS V12 Profile Module Ready"

    );

}

// =====================================
// Start Module
// =====================================

initializeProfileModule();