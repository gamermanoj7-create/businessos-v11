// =====================================
// BUSINESSOS V11
// Settings Module
// Part 1
// Load + Save Settings
// =====================================

// Settings
let settings =
JSON.parse(localStorage.getItem("settings")) || {

    businessName:"",
    ownerName:"",
    phone:"",
    email:"",
    address:"",
    website:"",
    gst:"",
    currency:"₹",
    theme:"light"

};

// =====================================
// Start
// =====================================

window.onload = function(){

    loadSettings();

};

// =====================================
// Load Settings
// =====================================

function loadSettings(){

    document.getElementById("businessName").value =
    settings.businessName;

    document.getElementById("ownerName").value =
    settings.ownerName;

    document.getElementById("phone").value =
    settings.phone;

    document.getElementById("email").value =
    settings.email;

    document.getElementById("address").value =
    settings.address;

    document.getElementById("website").value =
    settings.website;

    document.getElementById("gst").value =
    settings.gst;

    document.getElementById("currency").value =
    settings.currency;

    document.getElementById("theme").value =
    settings.theme;

}

// =====================================
// Save Settings
// =====================================

function saveSettings(){

    settings = {

        businessName:
        document.getElementById("businessName").value.trim(),

        ownerName:
        document.getElementById("ownerName").value.trim(),

        phone:
        document.getElementById("phone").value.trim(),

        email:
        document.getElementById("email").value.trim(),

        address:
        document.getElementById("address").value.trim(),

        website:
        document.getElementById("website").value.trim(),

        gst:
        document.getElementById("gst").value.trim(),

        currency:
        document.getElementById("currency").value,

        theme:
        document.getElementById("theme").value

    };

    localStorage.setItem(
        "settings",
        JSON.stringify(settings)
    );

    if(typeof refreshDashboard==="function"){

        refreshDashboard();

    }

    showToast(
        "Settings Saved Successfully",
        "success"
    );

}
// =====================================
// BUSINESSOS V11
// Settings Module
// Part 2
// Theme + Preview
// =====================================

// Apply Theme
function applyTheme(){

    const theme =
    document.getElementById("theme").value;

    if(theme==="dark"){

        document.body.classList.add("dark-mode");

    }else{

        document.body.classList.remove("dark-mode");

    }

}

// =====================================
// Apply Currency
// =====================================

function applyCurrency(){

    const currency =
    document.getElementById("currency").value;

    document
    .querySelectorAll(".currencySymbol")
    .forEach(item=>{

        item.textContent =
        currency;

    });

}

// =====================================
// Business Preview
// =====================================

function updateBusinessPreview(){

    document.getElementById("previewBusinessName").textContent =
    document.getElementById("businessName").value || "-";

    document.getElementById("previewOwner").textContent =
    document.getElementById("ownerName").value || "-";

    document.getElementById("previewPhone").textContent =
    document.getElementById("phone").value || "-";

    document.getElementById("previewEmail").textContent =
    document.getElementById("email").value || "-";

    document.getElementById("previewAddress").textContent =
    document.getElementById("address").value || "-";

    document.getElementById("previewWebsite").textContent =
    document.getElementById("website").value || "-";

    document.getElementById("previewGST").textContent =
    document.getElementById("gst").value || "-";

}

// =====================================
// Logo Preview
// =====================================

function previewLogo(event){

    const file =
    event.target.files[0];

    if(!file){

        return;

    }

    const reader =
    new FileReader();

    reader.onload=function(e){

        document.getElementById("logoPreview").src =
        e.target.result;

        localStorage.setItem(
            "businessLogo",
            e.target.result
        );

    };

    reader.readAsDataURL(file);

}

// =====================================
// Load Logo
// =====================================

const savedLogo =
localStorage.getItem("businessLogo");

if(savedLogo){

    document.getElementById("logoPreview").src =
    savedLogo;

}

// =====================================
// Theme Change
// =====================================

document
.getElementById("theme")
.addEventListener("change",function(){

    applyTheme();

});

// =====================================
// Currency Change
// =====================================

document
.getElementById("currency")
.addEventListener("change",function(){

    applyCurrency();

});
// =====================================
// BUSINESSOS V11
// Settings Module
// Part 3
// Backup + Restore + Reset
// =====================================

// Backup Data
function backupData(){

    const data = {

        settings,
        products:
        JSON.parse(localStorage.getItem("products")) || [],

        customers:
        JSON.parse(localStorage.getItem("customers")) || [],

        suppliers:
        JSON.parse(localStorage.getItem("suppliers")) || [],

        purchases:
        JSON.parse(localStorage.getItem("purchases")) || [],

        sales:
        JSON.parse(localStorage.getItem("sales")) || [],

        expenses:
        JSON.parse(localStorage.getItem("expenses")) || [],

        invoices:
        JSON.parse(localStorage.getItem("invoices")) || []

    };

    const blob =
    new Blob(

        [JSON.stringify(data,null,2)],

        {type:"application/json"}

    );

    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "BusinessOS_Backup.json";

    link.click();

    showToast(
        "Backup Downloaded",
        "success"
    );

}

// =====================================
// Restore Data
// =====================================

function restoreData(event){

    const file =
    event.target.files[0];

    if(!file){

        return;

    }

    const reader =
    new FileReader();

    reader.onload=function(e){

        try{

            const data =
            JSON.parse(e.target.result);

            Object.keys(data).forEach(key=>{

                localStorage.setItem(

                    key,

                    JSON.stringify(data[key])

                );

            });

            showToast(

                "Data Restored Successfully",

                "success"

            );

            location.reload();

        }catch(error){

            showToast(

                "Invalid Backup File",

                "error"

            );

        }

    };

    reader.readAsText(file);

}

// =====================================
// Clear All Data
// =====================================

function clearAllData(){

    if(!confirm(

        "Delete all Business Data?"

    )){

        return;

    }

    localStorage.clear();

    showToast(

        "All Data Deleted",

        "success"

    );

    setTimeout(function(){

        location.reload();

    },1000);

}

// =====================================
// Reset Settings
// =====================================

function resetSettings(){

    if(!confirm(

        "Reset Business Settings?"

    )){

        return;

    }

    localStorage.removeItem("settings");

    localStorage.removeItem("businessLogo");

    settings = {

        businessName:"",
        ownerName:"",
        phone:"",
        email:"",
        address:"",
        website:"",
        gst:"",
        currency:"₹",
        theme:"light"

    };

    loadSettings();

    applyTheme();

    updateBusinessPreview();

    document.getElementById("logoPreview").src="";

    showToast(

        "Settings Reset Successfully",

        "success"

    );

}
// =====================================
// BUSINESSOS V11
// Settings Module
// Part 4
// Auto Load + Dashboard
// =====================================

// Auto Apply Settings
function initializeSettings(){

    loadSettings();

    applyTheme();

    applyCurrency();

    updateBusinessPreview();

    const logo =
    localStorage.getItem("businessLogo");

    if(logo){

        document.getElementById("logoPreview").src =
        logo;

    }

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
// Save Form
// =====================================

document
.getElementById("settingsForm")
.addEventListener("submit",function(e){

    e.preventDefault();

    saveSettings();

    applyTheme();

    applyCurrency();

    updateBusinessPreview();

    updateDashboard();

});

// =====================================
// Live Preview
// =====================================

[
"businessName",
"ownerName",
"phone",
"email",
"address",
"website",
"gst"
].forEach(id=>{

    document
    .getElementById(id)
    .addEventListener("input",function(){

        updateBusinessPreview();

    });

});

// =====================================
// Initial Load
// =====================================

initializeSettings();

console.log(
"BusinessOS Settings Module Loaded"
);