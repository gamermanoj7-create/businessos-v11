// =====================================
// BUSINESSOS V11
// Forgot Password Module
// Part 1
// Reset Password
// =====================================

// Firebase
const auth = firebase.auth();

// =====================================
// Send Reset Email
// =====================================

function resetPassword(){

    const email =
    document
    .getElementById("resetEmail")
    .value
    .trim();

    if(email===""){

        showToast(
            "Enter Email Address",
            "warning"
        );

        return;

    }

    auth.sendPasswordResetEmail(email)

    .then(()=>{

        showToast(
            "Password Reset Email Sent",
            "success"
        );

        document
        .getElementById("resetStatus")
        .textContent =
        "Email Sent ✅";

    })

    .catch((error)=>{

        showToast(
            error.message,
            "error"
        );

        document
        .getElementById("resetStatus")
        .textContent =
        "Failed ❌";

    });

}

// =====================================
// Submit Form
// =====================================

document
.getElementById("forgotPasswordForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    resetPassword();

});
// =====================================
// BUSINESSOS V11
// Forgot Password Module
// Part 2
// Validation + Loading
// =====================================

// Validate Email
function validateEmail(email){

    const pattern =

    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(email);

}

// =====================================
// Loading Button
// =====================================

function setLoading(state){

    const btn =
    document.getElementById(
    "resetButton"
    );

    if(!btn) return;

    if(state){

        btn.disabled = true;

        btn.innerHTML =
        "⏳ Sending...";

    }else{

        btn.disabled = false;

        btn.innerHTML =
        "📧 Send Reset Link";

    }

}

// =====================================
// Retry Reset
// =====================================

function retryReset(){

    document
    .getElementById("resetEmail")
    .value = "";

    document
    .getElementById("resetStatus")
    .textContent =
    "Ready";

    showToast(
        "Try Again",
        "info"
    );

}

// =====================================
// Improved Reset
// =====================================

function sendResetLink(){

    const email =
    document
    .getElementById("resetEmail")
    .value
    .trim();

    if(email===""){

        showToast(
            "Enter Email",
            "warning"
        );

        return;

    }

    if(!validateEmail(email)){

        showToast(
            "Invalid Email Address",
            "error"
        );

        return;

    }

    setLoading(true);

    auth.sendPasswordResetEmail(email)

    .then(()=>{

        setLoading(false);

        document
        .getElementById("resetStatus")
        .textContent =
        "Email Sent ✅";

        showToast(
            "Reset Link Sent",
            "success"
        );

    })

    .catch((error)=>{

        setLoading(false);

        document
        .getElementById("resetStatus")
        .textContent =
        "Failed ❌";

        showToast(
            error.message,
            "error"
        );

    });

}

// =====================================
// Enter Key Support
// =====================================

document.addEventListener(
"keydown",
function(e){

    if(e.key==="Enter"){

        sendResetLink();

    }

});
// =====================================
// BUSINESSOS V11
// Forgot Password Module
// Part 3
// Countdown + Resend
// =====================================

let countdown = 60;

let timer = null;

// =====================================
// Start Countdown
// =====================================

function startCountdown(){

    countdown = 60;

    const text =
    document.getElementById(
    "countdownText"
    );

    if(!text) return;

    text.textContent =
    "Resend in 60s";

    timer = setInterval(function(){

        countdown--;

        text.textContent =
        "Resend in " +
        countdown +
        "s";

        if(countdown<=0){

            clearInterval(timer);

            text.textContent =
            "You can resend now";

        }

    },1000);

}

// =====================================
// Resend Reset Email
// =====================================

function resendResetLink(){

    if(countdown>0){

        showToast(
            "Please Wait",
            "warning"
        );

        return;

    }

    sendResetLink();

    startCountdown();

}

// =====================================
// Check Login
// =====================================

function checkLoggedUser(){

    auth.onAuthStateChanged(function(user){

        if(user){

            window.location.href =
            "index.html";

        }

    });

}

// =====================================
// Success Redirect
// =====================================

function redirectToLogin(){

    setTimeout(function(){

        window.location.href =
        "login.html";

    },3000);

}

// =====================================
// Status Update
// =====================================

function updateResetStatus(message){

    const status =
    document.getElementById(
    "resetStatus"
    );

    if(status){

        status.textContent =
        message;

    }

}

// =====================================
// Initialize
// =====================================

checkLoggedUser();

startCountdown();

console.log(
"Forgot Password Module Part 3 Loaded"
);
// =====================================
// BUSINESSOS V11
// Forgot Password Module
// Part 4
// Final
// =====================================

// Refresh Page Data
function refreshForgotPassword(){

    const status =
    document.getElementById(
    "resetStatus"
    );

    if(status){

        status.textContent =
        "Ready";

    }

}

// =====================================
// Online Status
// =====================================

function updateNetworkStatus(){

    const status =
    document.getElementById(
    "networkStatus"
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
updateNetworkStatus
);

window.addEventListener(
"offline",
updateNetworkStatus
);

// =====================================
// Session Validation
// =====================================

function validateForgotSession(){

    auth.onAuthStateChanged(function(user){

        if(user){

            console.log(
                "User Already Logged In"
            );

        }

    });

}

// =====================================
// Auto Refresh
// =====================================

setInterval(function(){

    refreshForgotPassword();

},30000);

// =====================================
// Window Focus Refresh
// =====================================

window.addEventListener(
"focus",
function(){

    refreshForgotPassword();

});

// =====================================
// Module Initialize
// =====================================

function initForgotPassword(){

    updateNetworkStatus();

    validateForgotSession();

    console.log(
        "Forgot Password Module Loaded"
    );

}

// =====================================
// Start
// =====================================

initForgotPassword();