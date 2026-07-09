// =====================================
// BUSINESSOS V12
// Register Module
// Part 1
// Firebase Register
// =====================================

// Firebase


// =====================================
// Register User
// =====================================

async function registerUser(){

    const fullName =
    document.getElementById("fullName").value.trim();

    const businessName =
    document.getElementById("businessName").value.trim();

    const phone =
    document.getElementById("phone").value.trim();

    const email =
    document.getElementById("email").value.trim();

    const password =
    document.getElementById("password").value;

    const confirmPassword =
    document.getElementById("confirmPassword").value;

    const role =
    document.getElementById("role").value;

    // Validation

    if(
        fullName==="" ||
        businessName==="" ||
        phone==="" ||
        email==="" ||
        password==="" ||
        confirmPassword==="" ||
        role===""
    ){

        showToast(
            "Please fill all required fields",
            "warning"
        );

        return;

    }

    if(password!==confirmPassword){

        showToast(
            "Passwords do not match",
            "error"
        );

        return;

    }

    if(password.length<6){

        showToast(
            "Password must be at least 6 characters",
            "warning"
        );

        return;

    }

    try{

        showLoading();

        const result =
        await auth.createUserWithEmailAndPassword(
            email,
            password
        );

        const user =
        result.user;

        await saveUserData(

            user,

            fullName,

            businessName,

            phone,

            role

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
// BUSINESSOS V12
// Register Module
// Part 2
// Save User Data
// =====================================

async function saveUserData(

    user,

    fullName,

    businessName,

    phone,

    role

){

    try{

        const userData = {

            uid: user.uid,

            fullName: fullName,

            businessName: businessName,

            phone: phone,

            email: user.email,

            role: role,

            status: "Active",

            photoURL: "",

            emailVerified: false,

            createdAt:
            firebase.firestore.FieldValue.serverTimestamp(),

            lastLogin:
            firebase.firestore.FieldValue.serverTimestamp(),

            updatedAt:
            firebase.firestore.FieldValue.serverTimestamp()

        };

        await db
        .collection("users")
        .doc(user.uid)
        .set(userData);

        await user.updateProfile({

            displayName: fullName

        });

        await user.sendEmailVerification();

        hideLoading();

        showToast(

            "Registration Successful",

            "success"

        );

        resetRegisterForm();

        setTimeout(function(){

            window.location.href =
            "login.html";

        },1500);

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
// BUSINESSOS V12
// Register Module
// Part 3
// Validation + Reset + Error Handling
// =====================================

// Validate Email

function validateEmail(email){

    const pattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(email);

}

// =====================================
// Validate Phone
// =====================================

function validatePhone(phone){

    const pattern =
    /^[6-9][0-9]{9}$/;

    return pattern.test(phone);

}

// =====================================
// Password Strength
// =====================================

function checkPasswordStrength(password){

    return password.length >= 6;

}

// =====================================
// Reset Form
// =====================================

function resetRegisterForm(){

    document
    .getElementById("registerForm")
    .reset();

}

// =====================================
// Register Error
// =====================================

function registerError(error){

    hideLoading();

    let message =
    "Registration Failed";

    switch(error.code){

        case "auth/email-already-in-use":

            message =
            "Email already exists.";

            break;

        case "auth/invalid-email":

            message =
            "Invalid Email Address.";

            break;

        case "auth/weak-password":

            message =
            "Weak Password.";

            break;

        case "auth/network-request-failed":

            message =
            "No Internet Connection.";

            break;

        default:

            message =
            error.message;

    }

    showToast(
        message,
        "error"
    );

    console.error(error);

}

// =====================================
// Check Current Session
// =====================================

function checkRegisterSession(){

    auth.onAuthStateChanged(function(user){

        if(user){

            console.log(
                "Current User:",
                user.email
            );

        }

    });

}
// =====================================
// BUSINESSOS V12
// Register Module
// Part 4
// Initialize + Events
// =====================================

// Form Submit

const registerForm =
document.getElementById("registerForm");

if(registerForm){

    registerForm.addEventListener(

        "submit",

        function(e){

            e.preventDefault();

            registerUser();

        }

    );

}

// =====================================
// Enter Key Support
// =====================================

document.addEventListener(

    "keydown",

    function(e){

        if(e.key==="Enter"){

            const form =
            document.getElementById("registerForm");

            if(form){

                registerUser();

            }

        }

    }

);

// =====================================
// Check Email Verification
// =====================================

async function checkEmailVerification(){

    const user = auth.currentUser;

    if(!user){

        return;

    }

    try{

        await user.reload();

        if(user.emailVerified){

            await db
            .collection("users")
            .doc(user.uid)
            .update({

                emailVerified:true,

                updatedAt:
                firebase.firestore.FieldValue.serverTimestamp()

            });

        }

    }

    catch(error){

        console.error(error);

    }

}

// =====================================
// Initialize
// =====================================

function initializeRegister(){

    checkRegisterSession();

    checkEmailVerification();

    console.log(

        "✅ BusinessOS V12 Register Module Ready"

    );

}

// =====================================
// Start Module
// =====================================

initializeRegister();