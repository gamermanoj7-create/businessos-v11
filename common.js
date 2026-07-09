// =====================================
// BUSINESSOS V12
// Common Module
// Fresh Professional Version
// =====================================

// =====================================
// Toast Notification
// =====================================

let toastTimer = null;

function showToast(message,type="success"){

    let toast =
    document.getElementById("toast");

    if(!toast){

        toast =
        document.createElement("div");

        toast.id = "toast";

        document.body.appendChild(toast);

    }

    toast.innerHTML = message;

    toast.className =
    "toast " + type;

    toast.style.position = "fixed";
    toast.style.top = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.zIndex = "999999";
    toast.style.padding = "15px 25px";
    toast.style.borderRadius = "10px";
    toast.style.fontWeight = "600";
    toast.style.maxWidth = "420px";
    toast.style.width = "90%";
    toast.style.textAlign = "center";
    toast.style.boxShadow =
    "0 10px 25px rgba(0,0,0,.25)";

    switch(type){

        case "success":

            toast.style.background =
            "#16a34a";

            toast.style.color =
            "#fff";

            break;

        case "error":

            toast.style.background =
            "#dc2626";

            toast.style.color =
            "#fff";

            break;

        case "warning":

            toast.style.background =
            "#f59e0b";

            toast.style.color =
            "#000";

            break;

        default:

            toast.style.background =
            "#2563eb";

            toast.style.color =
            "#fff";

    }

    toast.style.display = "block";

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function(){

        toast.style.display = "none";

    },3000);

}

// =====================================
// Loader
// =====================================

function showLoading(){

    document.body.style.cursor = "wait";

}

function hideLoading(){

    document.body.style.cursor = "default";

}

// Compatibility

function showLoader(){

    showLoading();

}

function hideLoader(){

    hideLoading();

}

// =====================================
// Confirm Dialog
// =====================================

function confirmAction(message){

    return confirm(message);

}

// =====================================
// Currency
// =====================================

function formatCurrency(amount){

    return "₹" +

    Number(amount || 0)
    .toLocaleString("en-IN");

}

// =====================================
// Date
// =====================================

function formatDate(date){

    if(!date){

        return "-";

    }

    if(date.toDate){

        return date
        .toDate()
        .toLocaleString();

    }

    return new Date(date)
    .toLocaleString();

}

// =====================================
// Generate ID
// =====================================

function generateId(prefix){

    return (

        prefix +

        "-" +

        Date.now()

    );

}

// =====================================
// Internet Status
// =====================================

function isOnline(){

    return navigator.onLine;

}

// =====================================
// Logout
// =====================================

async function logoutUser(){

    try{

        await firebase
        .auth()
        .signOut();

        localStorage.clear();

        sessionStorage.clear();

        window.location.href =
        "login.html";

    }

    catch(error){

        console.log(error);

        showToast(

            error.message,

            "error"

        );

    }

}

// =====================================
// Console
// =====================================

console.log(

    "✅ BusinessOS V12 Common Module Ready"

);