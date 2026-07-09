// =====================================
// BUSINESSOS V11
// Sell Module
// Part 1
// Firebase Setup + Load Data
// =====================================

// Firestore Collections
const salesRef = db.collection("sales");
const customersRef = db.collection("customers");
const productsRef = db.collection("products");

// Variables
let saleItems = [];
let customers = [];
let products = [];
let editSaleId = null;

// =====================================
// Initialize
// =====================================

window.onload = function () {

    initializeSellModule();

};

function initializeSellModule(){

    loadCustomers();

    loadProducts();

    loadSalesHistory();

    console.log("✅ Sell Module Loaded");

}

// =====================================
// Load Customers
// =====================================

async function loadCustomers(){

    const customerSelect =
    document.getElementById("sellCustomer");

    if(!customerSelect) return;

    customerSelect.innerHTML = `
<option value="">
👤 Select Customer
</option>`;

    customers = [];

    try{

        const snapshot =
        await customersRef
        .orderBy("name")
        .get();

        snapshot.forEach((doc)=>{

            const customer = {

                id:doc.id,

                ...doc.data()

            };

            customers.push(customer);

            customerSelect.innerHTML += `

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

    const productSelect =
    document.getElementById("sellProduct");

    if(!productSelect) return;

    productSelect.innerHTML = `
<option value="">
📦 Select Product
</option>`;

    products = [];

    try{

        const snapshot =
        await productsRef
        .orderBy("name")
        .get();

        snapshot.forEach((doc)=>{

            const product={

                id:doc.id,

                ...doc.data()

            };

            products.push(product);

            productSelect.innerHTML += `

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
.getElementById("sellProduct")
.addEventListener("change",function(){

    const id=this.value;

    const product=
    products.find(p=>p.id===id);

    if(!product) return;

    document.getElementById("sellPrice").value =
    Number(product.sell || 0).toFixed(2);

    calculateTotal();

});

// =====================================
// Quantity Change
// =====================================

document
.getElementById("sellQty")
.addEventListener(
"input",
calculateTotal
);

// =====================================
// Calculate Total
// =====================================

function calculateTotal(){

    const qty =
    Number(
        document.getElementById("sellQty").value || 0
    );

    const price =
    Number(
        document.getElementById("sellPrice").value || 0
    );

    document.getElementById("sellTotal").value =
    (qty*price).toFixed(2);

}
// =====================================
// BUSINESSOS V11
// Sell Module
// Part 2
// Add Product + Sale Items + Grand Total
// =====================================

// Add Product
function addSaleItem(){

    const productId =
    document.getElementById("sellProduct").value;

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
    document.getElementById("sellQty").value
    );

    if(qty<=0){

        showToast(
            "Enter Valid Quantity",
            "warning"
        );

        return;

    }

    if(qty>Number(product.stock)){

        showToast(
            "Not Enough Stock",
            "error"
        );

        return;

    }

    const price =
    Number(
    document.getElementById("sellPrice").value
    );

    const total =
    qty*price;

    saleItems.push({

        productId:product.id,

        product:product.name,

        qty:qty,

        price:price,

        total:total

    });

    renderSaleItems();

    calculateGrandTotal();

    clearProductFields();

    showToast(
        "Product Added",
        "success"
    );

}

// =====================================
// Render Sale Items
// =====================================

function renderSaleItems(){

    const container =
    document.getElementById("saleItems");

    container.innerHTML="";

    if(saleItems.length===0){

        container.innerHTML=`

<div class="list-card">

<h3>📦 No Product Added</h3>

<p>Add products to continue.</p>

</div>

`;

        return;

    }

    saleItems.forEach((item,index)=>{

        container.innerHTML+=`

<div class="list-card">

<h3>${item.product}</h3>

<div class="list-item">

<span>Quantity</span>

<span>${item.qty}</span>

</div>

<div class="list-item">

<span>Price</span>

<span>₹${item.price.toFixed(2)}</span>

</div>

<div class="list-item">

<span>Total</span>

<span>₹${item.total.toFixed(2)}</span>

</div>

<button
class="delete-btn"
onclick="removeSaleItem(${index})">

🗑 Remove

</button>

</div>

`;

    });

}

// =====================================
// Remove Item
// =====================================

function removeSaleItem(index){

    saleItems.splice(index,1);

    renderSaleItems();

    calculateGrandTotal();

}

// =====================================
// Grand Total
// =====================================

function calculateGrandTotal(){

    let subtotal=0;

    saleItems.forEach(item=>{

        subtotal+=item.total;

    });

    const discount=
    Number(
    document.getElementById("discount").value||0
    );

    const grandTotal=

    subtotal-

    ((subtotal*discount)/100);

    document.getElementById("grandTotal").value=

    grandTotal.toFixed(2);

}

// =====================================
// Discount Change
// =====================================

document
.getElementById("discount")
.addEventListener(
"input",
calculateGrandTotal
);

// =====================================
// Clear Product Fields
// =====================================

function clearProductFields(){

    document.getElementById("sellProduct").value="";

    document.getElementById("sellQty").value="";

    document.getElementById("sellPrice").value="";

    document.getElementById("sellTotal").value="";

}
// =====================================
// BUSINESSOS V11
// Sell Module
// Part 3
// Save Sale + Update Stock
// =====================================

// Save Sale
async function saveSale(){

    if(saleItems.length===0){

        showToast(
            "Add Product First",
            "warning"
        );

        return;

    }

    const customer =
    document.getElementById("sellCustomer").value;

    if(customer===""){

        showToast(
            "Select Customer",
            "warning"
        );

        return;

    }

    const sale={

        saleNumber:
        "SALE-"+Date.now(),

        customer:customer,

        items:saleItems,

        discount:Number(
        document.getElementById("discount").value||0
        ),

        grandTotal:Number(
        document.getElementById("grandTotal").value||0
        ),

        paymentStatus:
        document.getElementById("paymentStatus").value,

        createdBy:
        auth.currentUser
        ? auth.currentUser.uid
        : "",

        createdAt:
        firebase.firestore.FieldValue.serverTimestamp()

    };

    try{

        await salesRef.add(sale);

        // Update Stock
        for(const item of saleItems){

            const ref=
            productsRef.doc(item.productId);

            const doc=
            await ref.get();

            if(doc.exists){

                const stock=
                Number(doc.data().stock||0);

                await ref.update({

                    stock:
                    stock-item.qty

                });

            }

        }

        showToast(
            "Sale Saved Successfully",
            "success"
        );

        resetSellForm();

        loadProducts();

        loadSalesHistory();

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
// Reset Form
// =====================================

function resetSellForm(){

    document
    .getElementById("sellForm")
    .reset();

    saleItems=[];

    renderSaleItems();

    calculateGrandTotal();

}

// =====================================
// Submit
// =====================================

document
.getElementById("sellForm")
.addEventListener(
"submit",
function(e){

    e.preventDefault();

    saveSale();

});
// =====================================
// BUSINESSOS V11
// Sell Module
// Part 4
// Sales History + Delete + Search
// =====================================

// Load Sales History
async function loadSalesHistory(){

    const history =
    document.getElementById("saleHistory");

    if(!history) return;

    history.innerHTML = "";

    try{

        const snapshot =
        await salesRef
        .orderBy("createdAt","desc")
        .get();

        if(snapshot.empty){

            history.innerHTML = `
<div class="list-card">

<h3>🧾 No Sales Found</h3>

<p>No sales available.</p>

</div>
`;

            return;

        }

        snapshot.forEach((doc)=>{

            const sale = doc.data();

            history.innerHTML += `

<div class="list-card">

<h3>${sale.saleNumber || doc.id}</h3>

<div class="list-item">

<span>👤 Customer</span>

<span>${sale.customer}</span>

</div>

<div class="list-item">

<span>💰 Grand Total</span>

<span>₹${Number(sale.grandTotal).toFixed(2)}</span>

</div>

<div class="list-item">

<span>💳 Payment</span>

<span>${sale.paymentStatus}</span>

</div>

<div class="card-actions">

<button
class="view-btn"
onclick="viewSale('${doc.id}')">

👁 View

</button>

<button
class="delete-btn"
onclick="deleteSale('${doc.id}')">

🗑 Delete

</button>

</div>

</div>

`;

        });

    }

    catch(error){

        console.error(error);

        showToast(
            "Failed to load sales",
            "error"
        );

    }

}

// =====================================
// Search Sale
// =====================================

function searchSale(){

    const value =
    document
    .getElementById("searchSale")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#saleHistory .list-card")
    .forEach(card=>{

        card.style.display =

        card.innerText
        .toLowerCase()
        .includes(value)

        ? ""

        : "none";

    });

}

// =====================================
// View Sale
// =====================================

async function viewSale(id){

    const doc =
    await salesRef.doc(id).get();

    if(!doc.exists){

        showToast(
            "Sale Not Found",
            "error"
        );

        return;

    }

    const sale = doc.data();

    let items = "";

    sale.items.forEach(item=>{

        items +=
`${item.product}
Qty : ${item.qty}
₹${item.total}

`;

    });

    alert(

`Invoice : ${sale.saleNumber}

Customer : ${sale.customer}

${items}

Grand Total : ₹${sale.grandTotal}

Payment : ${sale.paymentStatus}`

    );

}

// =====================================
// Delete Sale
// =====================================

async function deleteSale(id){

    if(!confirm(
        "Delete this sale?"
    )){

        return;

    }

    try{

        const doc =
        await salesRef.doc(id).get();

        if(doc.exists){

            const sale =
            doc.data();

            // Restore Stock

            for(const item of sale.items){

                const ref =
                productsRef.doc(item.productId);

                const product =
                await ref.get();

                if(product.exists){

                    const stock =
                    Number(product.data().stock || 0);

                    await ref.update({

                        stock:
                        stock + item.qty

                    });

                }

            }

        }

        await salesRef.doc(id).delete();

        loadSalesHistory();

        loadProducts();

        showToast(
            "Sale Deleted Successfully",
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
// Live Update
// =====================================

salesRef.onSnapshot(function(){

    loadSalesHistory();

});

// =====================================
// Module Ready
// =====================================

console.log(
"✅ BusinessOS V11 Sell Module Ready"
);