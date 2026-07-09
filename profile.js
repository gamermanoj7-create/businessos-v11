// =====================================
// BUSINESSOS V13
// Profile Module
// Part 1
// Initialize + Load Profile
// =====================================

// Current User
let currentUser = null;

// Start
firebase.auth().onAuthStateChanged(async function(user){

    if(!user){

        window.location.href = "login.html";
        return;

    }

    currentUser = user;

    await loadProfile();

});

// Load Profile
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

        document.getElementById("profileName").value =
        data.fullName || "";

        document.getElementById("profileBusiness").value =
        data.businessName || "";

        document.getElementById("profilePhone").value =
        data.phone || "";

        document.getElementById("profileEmail").value =
        data.email || currentUser.email;

        document.getElementById("profileRole").value =
        data.role || "User";

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

        document.getElementById("profileImage").src =

        data.photoURL ||

        "images/default-user.png";

        document.getElementById("emailStatus").textContent =

        currentUser.emailVerified

        ?

        "✅ Verified"

        :

        "❌ Not Verified";

        updateOnlineStatus();

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
// BUSINESSOS V13
// Profile Module
// Part 3
// Edit + Save + Reset
// =====================================

// Enable Edit
function enableEdit(){

    document.getElementById("profileName").readOnly = false;
    document.getElementById("profileBusiness").readOnly = false;
    document.getElementById("profilePhone").readOnly = false;
    document.getElementById("profilePhoto").readOnly = false;

    showToast(
        "Edit Mode Enabled",
        "success"
    );

}

// Save Profile
async function saveProfile(){

    try{

        showLoading();

        const fullName =
        document.getElementById("profileName").value.trim();

        const businessName =
        document.getElementById("profileBusiness").value.trim();

        const phone =
        document.getElementById("profilePhone").value.trim();

        const photoURL =
        document.getElementById("profilePhoto").value.trim();

        await db
        .collection("users")
        .doc(currentUser.uid)
        .update({

            fullName: fullName,
            businessName: businessName,
            phone: phone,
            photoURL: photoURL,
            updatedAt:
            firebase.firestore.FieldValue.serverTimestamp()

        });

        if(photoURL!=""){

            document.getElementById(
                "profileImage"
            ).src = photoURL;

        }

        showToast(
            "Profile Updated Successfully",
            "success"
        );

        hideLoading();

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

// Reset Profile
function resetProfile(){

    loadProfile();

    showToast(
        "Profile Reloaded",
        "success"
    );

}
// =====================================
// BUSINESSOS V13
// Profile Module
// Part 4
// Photo + Password + Verify + Logout
// =====================================

// Update Profile Photo
function updateProfilePhoto(){

    saveProfile();

}

// Change Password
async function changePassword(){

    const password =
    document.getElementById("newPassword").value.trim();

    if(password.length < 6){

        showToast(
            "Password must be at least 6 characters",
            "warning"
        );

        return;

    }

    try{

        showLoading();

        await currentUser.updatePassword(password);

        hideLoading();

        document.getElementById("newPassword").value = "";

        showToast(
            "Password Changed Successfully",
            "success"
        );

    }

    catch(error){

        hideLoading();

        showToast(
            error.message,
            "error"
        );

    }

}

// Verify Email
async function verifyEmail(){

    try{

        await currentUser.sendEmailVerification();

        showToast(
            "Verification Email Sent",
            "success"
        );

    }

    catch(error){

        showToast(
            error.message,
            "error"
        );

    }

}

// Refresh Profile
function refreshProfile(){

    loadProfile();

}

// Online Status
function updateOnlineStatus(){

    document.getElementById("onlineStatus").textContent =

    navigator.onLine

    ?

    "🟢 Online"

    :

    "🔴 Offline";

}

window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

// Logout
async function logoutUser(){

    try{

        await firebase.auth().signOut();

        localStorage.clear();
        sessionStorage.clear();

        window.location.href = "login.html";

    }

    catch(error){

        showToast(
            error.message,
            "error"
        );

    }

}

console.log("✅ BusinessOS V13 Profile Ready");
// =====================================
// BUSINESSOS V13
// Profile Photo Upload
// Part 2
// Select + Preview
// =====================================

let selectedProfileFile = null;

// Preview Selected Image
document
.getElementById("profilePhotoFile")
.addEventListener("change", function(event){

    const file = event.target.files[0];

    if(!file){

        return;

    }

    selectedProfileFile = file;

    const reader = new FileReader();

    reader.onload = function(e){

        document
        .getElementById("profileImage")
        .src = e.target.result;

    };

    reader.readAsDataURL(file);

});
// =====================================
// BUSINESSOS V13
// Profile Photo Upload
// Part 3
// Upload to Firebase Storage
// =====================================

// =====================================
// BUSINESSOS V13
// Profile Photo Upload
// Part 4A
// Cloudinary Upload
// =====================================

async function uploadProfilePhoto(){

    if(!selectedProfileFile){

        showToast(
            "Please select a profile photo",
            "warning"
        );

        return;

    }

    try{

        showLoading();

        const formData = new FormData();

        formData.append(
            "file",
            selectedProfileFile
        );

        formData.append(
            "upload_preset",
            "businessos_profile"
        );

        const response = await fetch(

            "https://api.cloudinary.com/v1_1/nx1dc1j1/image/upload",

            {

                method: "POST",

                body: formData

            }

        );

        const result = await response.json();

        if(!result.secure_url){

            throw new Error(
                "Upload Failed"
            );

        }

        const photoURL =
        result.secure_url;
        // =====================================
// BUSINESSOS V13
// Profile Photo Upload
// Part 4B
// Save Photo URL
// =====================================

        await db
        .collection("users")
        .doc(currentUser.uid)
        .update({

            photoURL: photoURL,

            updatedAt:
            firebase.firestore
            .FieldValue.serverTimestamp()

        });

        document
        .getElementById("profileImage")
        .src = photoURL;

        document
        .getElementById("photoURL")
        .value = photoURL;
        // =====================================
// BUSINESSOS V13
// Profile Photo Upload
// Part 4C
// Success
// =====================================

        hideLoading();

        showToast(
            "Profile Photo Updated Successfully",
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
