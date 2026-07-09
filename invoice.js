// =====================================
// BUSINESSOS V11
// Invoice Module
// Part 1
// Firebase Setup + Initialize
// =====================================

// Firestore Collections
const invoiceRef = db.collection("invoices");
const customerRef = db.collection("customers");
const productRef = db.collection("products");

// Variables
let invoiceItems = [];
let customers = [];
let products = [];
let editInvoiceId = null;

// =====================================
// Initialize
// =====================================

window.onload = function(){

    initializeInvoice();

};

function initializeInvoice(){

    generateInvoiceNumber();

    setCurrentDate();

    loadCustomers();

    loadProducts();

    loadInvoices();

    console.log(
        "✅ Invoice Module Loaded"
    );

}

// =====================================
// Generate Invoice Number
// =====================================

function generateInvoiceNumber(){

    document.getElementById("invoiceNo").value =
    "INV-" + Date.now();

}

// =====================================
// Current Date
// =====================================

function setCurrentDate(){

    const today = new Date();

    const date =

    today.getFullYear()+"-"+
    String(today.getMonth()+1).padStart(2,"0")+"-"+
    String(today.getDate()).padStart(2,"0");

    document.getElementById("invoiceDate").value =
    date;

}

// =====================================
// Load Customers
// =====================================

async function loadCustomers(){

    const select =
    document.getElementById("invoiceCustomer");

    if(!select) return;

    select.innerHTML = `
<option value="">
👤 Select Customer
</option>`;

    customers=[];

    try{

        const snapshot =
        await customerRef
        .orderBy("name")
        .get();

        snapshot.forEach((doc)=>{

            const customer={

                id:doc.id,

                ...doc.data()

            };

            customers.push(customer);

            select.innerHTML += `

<option value="${customer.name}">
${customer.name}
</option>

`;

        });

    }

    catch(error){

        console.error(error);

        showToast(
            "Failed to load customers",
            "error"
        );

    }

}

// =====================================
// Load Products
// =====================================

async function loadProducts(){

    const select =
    document.getElementById("invoiceProduct");

    if(!select) return;

    select.innerHTML = `
<option value="">
📦 Select Product
</option>`;

    products=[];

    try{

        const snapshot =
        await productRef
        .orderBy("name")
        .get();

        snapshot.forEach((doc)=>{

            const product={

                id:doc.id,

                ...doc.data()

            };

            products.push(product);

            select.innerHTML += `

<option value="${product.id}">
${product.name}
</option>

`;

        });

    }

    catch(error){

        console.error(error);

        showToast(
            "Failed to load products",
            "error"
        );

    }

}

// =====================================
// Product Change
// =====================================

document
.getElementById("invoiceProduct")
.addEventListener(
"change",
function(){

    const id=this.value;

    const product=
    products.find(p=>p.id===id);

    if(!product) return;

    document.getElementById("invoicePrice").value =
    Number(product.sell||0).toFixed(2);

});
// =====================================
// BUSINESSOS V11
// Invoice Module
// Part 2
// Add Product + Invoice Items
// =====================================

// Add Product
function addProduct(){

    const productId =
    document.getElementById("invoiceProduct").value;

    if(productId===""){

        showToast(
            "Select Product",
            "warning"
        );

        return;

    }

    const product =
    products.find(p=>p.id===productId);

    if(!product){

        showToast(
            "Product Not Found",
            "error"
        );

        return;

    }

    const qty =
    Number(
    document.getElementById("invoiceQty").value
    );

    if(qty<=0){

        showToast(
            "Enter Valid Quantity",
            "warning"
        );

        return;

    }

    if(qty>Number(product.stock||0)){

        showToast(
            "Not Enough Stock",
            "error"
        );

        return;

    }

    const price =
    Number(
    document.getElementById("invoicePrice").value
    );

    const total =
    qty*price;

    invoiceItems.push({

        productId:product.id,

        product:product.name,

        qty:qty,

        price:price,

        total:total

    });

    renderInvoiceItems();

    calculateGrandTotal();

    updatePreview();

    clearProductFields();

    showToast(
        "Product Added",
        "success"
    );

}

// =====================================
// Render Invoice Items
// =====================================

function renderInvoiceItems(){

    const tbody =
    document.getElementById("invoiceItems");

    tbody.innerHTML="";

    if(invoiceItems.length===0){

        tbody.innerHTML=`

<tr>

<td colspan="5">

No Product Added

</td>

</tr>

`;

        return;

    }

    invoiceItems.forEach((item,index)=>{

        tbody.innerHTML+=`

<tr>

<td>${item.product}</td>

<td>${item.qty}</td>

<td>₹${item.price.toFixed(2)}</td>

<td>₹${item.total.toFixed(2)}</td>

<td>

<button
class="delete-btn"
onclick="removeProduct(${index})">

🗑

</button>

</td>

</tr>

`;

    });

}

// =====================================
// Remove Product
// =====================================

function removeProduct(index){

    invoiceItems.splice(index,1);

    renderInvoiceItems();

    calculateGrandTotal();

    updatePreview();

}

// =====================================
// Grand Total
// =====================================

function calculateGrandTotal(){

    let subtotal=0;

    invoiceItems.forEach(item=>{

        subtotal+=item.total;

    });

    const discount=
    Number(
    document.getElementById("discount").value||0
    );

    const grandTotal=

    subtotal-

    ((subtotal*discount)/100);

    document.getElementById("invoiceTotal").value=

    grandTotal.toFixed(2);

}

// =====================================
// Discount Change
// =====================================

document
.getElementById("discount")
.addEventListener(
"input",
function(){

    calculateGrandTotal();

    updatePreview();

});

// =====================================
// Clear Fields
// =====================================

function clearProductFields(){

    document.getElementById("invoiceProduct").value="";

    document.getElementById("invoiceQty").value="";

    document.getElementById("invoicePrice").value="";

}
// =====================================
// BUSINESSOS V11
// Invoice Module
// Part 3
// Save Invoice + Preview + Reset
// =====================================

// Save Invoice
async function saveInvoice(){

    if(invoiceItems.length===0){

        showToast(
            "Add Product First",
            "warning"
        );

        return;

    }

    const customer =
    document.getElementById("invoiceCustomer").value;

    if(customer===""){

        showToast(
            "Select Customer",
            "warning"
        );

        return;

    }

    const invoice={

        invoiceNo:
        document.getElementById("invoiceNo").value,

        customer:customer,

        date:
        document.getElementById("invoiceDate").value,

        items:invoiceItems,

        discount:Number(
        document.getElementById("discount").value||0
        ),

        grandTotal:Number(
        document.getElementById("invoiceTotal").value||0
        ),

        paymentStatus:
        document.getElementById("paymentStatus").value,

        notes:
        document.getElementById("invoiceNotes").value.trim(),

        createdBy:
        auth.currentUser
        ? auth.currentUser.uid
        : "",

        createdAt:
        firebase.firestore.FieldValue.serverTimestamp()

    };

    try{

        await invoiceRef.add(invoice);

        showToast(
            "Invoice Saved Successfully",
            "success"
        );

        resetInvoice();

        loadInvoices();

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
// Invoice Preview
// =====================================

function updatePreview(){

    document.getElementById("showInvoiceNo").textContent =
    document.getElementById("invoiceNo").value;

    document.getElementById("showDate").textContent =
    document.getElementById("invoiceDate").value;

    document.getElementById("showCustomer").textContent =
    document.getElementById("invoiceCustomer").value;

    document.getElementById("showPhone").textContent =
    document.getElementById("customerPhone").value;

    document.getElementById("showAddress").textContent =
    document.getElementById("customerAddress").value;

    document.getElementById("showStatus").textContent =
    document.getElementById("paymentStatus").value;

    document.getElementById("showTotal").textContent =
    document.getElementById("invoiceTotal").value;

    const preview =
    document.getElementById("previewItems");

    preview.innerHTML="";

    if(invoiceItems.length===0){

        preview.innerHTML="No Items";

        return;

    }

    invoiceItems.forEach(item=>{

        preview.innerHTML+=`

<div class="list-item">

<span>

${item.product}

x ${item.qty}

</span>

<span>

₹${item.total.toFixed(2)}

</span>

</div>

`;

    });

}

// =====================================
// Reset Invoice
// =====================================

function resetInvoice(){

    document
    .getElementById("invoiceForm")
    .reset();

    invoiceItems=[];

    renderInvoiceItems();

    generateInvoiceNumber();

    setCurrentDate();

    calculateGrandTotal();

    updatePreview();

}

// =====================================
// New Invoice
// =====================================

function newInvoice(){

    resetInvoice();

    showToast(
        "New Invoice Ready",
        "info"
    );

}

// =====================================
// Form Submit
// =====================================

document
.getElementById("invoiceForm")
.addEventListener(
"submit",
function(e){

    e.preventDefault();

    saveInvoice();

});
// =====================================
// BUSINESSOS V11
// Invoice Module
// Part 4
// History + View + Delete + Print + PDF
// =====================================

// Load Invoice History
async function loadInvoices(){

    const table =
    document.getElementById("invoiceHistory");

    if(!table) return;

    table.innerHTML="";

    try{

        const snapshot =
        await invoiceRef
        .orderBy("createdAt","desc")
        .get();

        if(snapshot.empty){

            table.innerHTML=`

<tr>

<td colspan="6">

No Invoice Found

</td>

</tr>

`;

            return;

        }

        snapshot.forEach(doc=>{

            const invoice=doc.data();

            table.innerHTML+=`

<tr>

<td>${invoice.invoiceNo}</td>

<td>${invoice.date}</td>

<td>${invoice.customer}</td>

<td>${invoice.paymentStatus}</td>

<td>₹${Number(invoice.grandTotal).toFixed(2)}</td>

<td>

<button
class="view-btn"
onclick="viewInvoice('${doc.id}')">

👁

</button>

<button
class="delete-btn"
onclick="deleteInvoice('${doc.id}')">

🗑

</button>

</td>

</tr>

`;

        });

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
// Search Invoice
// =====================================

function searchInvoice(){

    const value=
    document
    .getElementById("searchInvoice")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#invoiceHistory tr")
    .forEach((row,index)=>{

        if(index===0) return;

        row.style.display=

        row.innerText
        .toLowerCase()
        .includes(value)

        ?

        ""

        :

        "none";

    });

}

// =====================================
// View Invoice
// =====================================

async function viewInvoice(id){

    const doc=
    await invoiceRef.doc(id).get();

    if(!doc.exists){

        showToast(
            "Invoice Not Found",
            "error"
        );

        return;

    }

    const invoice=doc.data();

    let items="";

    invoice.items.forEach(item=>{

        items+=

`${item.product}

Qty : ${item.qty}

₹${item.total}

`;

    });

    alert(

`Invoice : ${invoice.invoiceNo}

Customer : ${invoice.customer}

${items}

Grand Total : ₹${invoice.grandTotal}

Payment : ${invoice.paymentStatus}`

    );

}

// =====================================
// Delete Invoice
// =====================================

async function deleteInvoice(id){

    if(!confirm(
        "Delete this invoice?"
    )) return;

    try{

        await invoiceRef
        .doc(id)
        .delete();

        showToast(
            "Invoice Deleted",
            "success"
        );

        loadInvoices();

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
// Print Invoice
// =====================================

function printInvoice(){

    window.print();

}

// =====================================
// Download PDF
// =====================================

async function downloadPDF(){

    const invoice=
    document.getElementById("invoicePreview");

    const canvas=
    await html2canvas(invoice);

    const img=
    canvas.toDataURL("image/png");

    const pdf=
    new jspdf.jsPDF();

    pdf.addImage(

        img,

        "PNG",

        10,

        10,

        190,

        0

    );

    pdf.save(

        document.getElementById("invoiceNo").value+

        ".pdf"

    );

}

// =====================================
// Live Update
// =====================================

invoiceRef.onSnapshot(function(){

    loadInvoices();

});

// =====================================
// Module Ready
// =====================================

console.log(
"✅ BusinessOS V11 Invoice Module Ready"
);