// =====================================
// BUSINESSOS V11
// Buy Module
// Part 1
// Firebase Setup + Load Data
// =====================================

// Firestore Collections
const purchaseRef = db.collection("purchases");
const suppliersRef = db.collection("suppliers");
const productsRef = db.collection("products");

// Variables
let purchaseItems = [];
let suppliers = [];
let products = [];
let editPurchaseId = null;

// =====================================
// Initialize
// =====================================

window.onload = function(){

    initializeBuyModule();

};

function initializeBuyModule(){

    loadSuppliers();

    loadProducts();

    loadPurchaseHistory();

    console.log("✅ Buy Module Loaded");

}

// =====================================
// Load Suppliers
// =====================================

async function loadSuppliers(){

    const supplierSelect =
    document.getElementById("buySupplier");

    if(!supplierSelect) return;

    supplierSelect.innerHTML = `
<option value="">
🏢 Select Supplier
</option>`;

    suppliers = [];

    try{

        const snapshot =
        await suppliersRef
        .orderBy("name")
        .get();

        snapshot.forEach((doc)=>{

            const supplier={

                id:doc.id,

                ...doc.data()

            };

            suppliers.push(supplier);

            supplierSelect.innerHTML += `

<option value="${supplier.name}">
${supplier.name}
</option>

`;

        });

    }

    catch(error){

        console.error(error);

        showToast(
            "Failed to load suppliers",
            "error"
        );

    }

}

// =====================================
// Load Products
// =====================================

async function loadProducts(){

    const productSelect =
    document.getElementById("buyProduct");

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
.getElementById("buyProduct")
.addEventListener("change",function(){

    const id=this.value;

    const product=
    products.find(p=>p.id===id);

    if(!product) return;

    document.getElementById("buyPrice").value =
    Number(product.buy || 0).toFixed(2);

    calculateBuyTotal();

});

// =====================================
// Quantity Change
// =====================================

document
.getElementById("buyQty")
.addEventListener(
"input",
calculateBuyTotal
);

// =====================================
// Calculate Total
// =====================================

function calculateBuyTotal(){

    const qty =
    Number(
        document.getElementById("buyQty").value || 0
    );

    const price =
    Number(
        document.getElementById("buyPrice").value || 0
    );

    document.getElementById("buyTotal").value =
    (qty*price).toFixed(2);

}
// =====================================
// BUSINESSOS V11
// Buy Module
// Part 2
// Add Purchase Item + Grand Total
// =====================================

// Add Product
function addBuyItem(){

    const productId =
    document.getElementById("buyProduct").value;

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
    document.getElementById("buyQty").value
    );

    if(qty<=0){

        showToast(
            "Enter Valid Quantity",
            "warning"
        );

        return;

    }

    const price =
    Number(
    document.getElementById("buyPrice").value
    );

    const total =
    qty*price;

    purchaseItems.push({

        productId:product.id,

        product:product.name,

        qty:qty,

        price:price,

        total:total

    });

    renderPurchaseItems();

    calculateGrandTotal();

    clearPurchaseFields();

    showToast(
        "Product Added",
        "success"
    );

}

// =====================================
// Render Purchase Items
// =====================================

function renderPurchaseItems(){

    const container =
    document.getElementById("buyItems");

    container.innerHTML="";

    if(purchaseItems.length===0){

        container.innerHTML=`

<div class="list-card">

<h3>📦 No Product Added</h3>

<p>Add products to continue.</p>

</div>

`;

        return;

    }

    purchaseItems.forEach((item,index)=>{

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
onclick="removePurchaseItem(${index})">

🗑 Remove

</button>

</div>

`;

    });

}

// =====================================
// Remove Item
// =====================================

function removePurchaseItem(index){

    purchaseItems.splice(index,1);

    renderPurchaseItems();

    calculateGrandTotal();

}

// =====================================
// Grand Total
// =====================================

function calculateGrandTotal(){

    let grandTotal=0;

    purchaseItems.forEach(item=>{

        grandTotal+=item.total;

    });

    document.getElementById("buyGrandTotal").value=

    grandTotal.toFixed(2);

}

// =====================================
// Clear Fields
// =====================================

function clearPurchaseFields(){

    document.getElementById("buyProduct").value="";

    document.getElementById("buyQty").value="";

    document.getElementById("buyPrice").value="";

    document.getElementById("buyTotal").value="";

}
// =====================================
// BUSINESSOS V11
// Buy Module
// Part 3
// Save Purchase + Update Stock
// =====================================

// Save Purchase
async function savePurchase(){

    if(purchaseItems.length===0){

        showToast(
            "Add Product First",
            "warning"
        );

        return;

    }

    const supplier =
    document.getElementById("buySupplier").value;

    if(supplier===""){

        showToast(
            "Select Supplier",
            "warning"
        );

        return;

    }

    const purchase={

        purchaseNumber:
        "PUR-"+Date.now(),

        supplier:supplier,

        items:purchaseItems,

        grandTotal:Number(
        document.getElementById("buyGrandTotal").value||0
        ),

        createdBy:
        auth.currentUser
        ? auth.currentUser.uid
        : "",

        createdAt:
        firebase.firestore.FieldValue.serverTimestamp()

    };

    try{

        await purchaseRef.add(purchase);

        // Increase Product Stock
        for(const item of purchaseItems){

            const ref=
            productsRef.doc(item.productId);

            const doc=
            await ref.get();

            if(doc.exists){

                const stock=
                Number(doc.data().stock||0);

                await ref.update({

                    stock:
                    stock+item.qty

                });

            }

        }

        showToast(
            "Purchase Saved Successfully",
            "success"
        );

        resetPurchaseForm();

        loadProducts();

        loadPurchaseHistory();

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

function resetPurchaseForm(){

    document
    .getElementById("buyForm")
    .reset();

    purchaseItems=[];

    renderPurchaseItems();

    calculateGrandTotal();

}

// =====================================
// Submit
// =====================================

document
.getElementById("buyForm")
.addEventListener(
"submit",
function(e){

    e.preventDefault();

    savePurchase();

});
// =====================================
// BUSINESSOS V11
// Buy Module
// Part 4
// Purchase History + Delete + Search
// =====================================

// Load Purchase History
async function loadPurchaseHistory(){

    const history =
    document.getElementById("purchaseHistory");

    if(!history) return;

    history.innerHTML = "";

    try{

        const snapshot =
        await purchaseRef
        .orderBy("createdAt","desc")
        .get();

        if(snapshot.empty){

            history.innerHTML = `

<div class="list-card">

<h3>🧾 No Purchase Found</h3>

<p>No purchase available.</p>

</div>

`;

            return;

        }

        snapshot.forEach((doc)=>{

            const purchase = doc.data();

            history.innerHTML += `

<div class="list-card">

<h3>${purchase.purchaseNumber || doc.id}</h3>

<div class="list-item">

<span>🏢 Supplier</span>

<span>${purchase.supplier}</span>

</div>

<div class="list-item">

<span>💰 Grand Total</span>

<span>₹${Number(purchase.grandTotal).toFixed(2)}</span>

</div>

<div class="list-item">

<span>📦 Products</span>

<span>${purchase.items.length}</span>

</div>

<div class="card-actions">

<button
class="view-btn"
onclick="viewPurchase('${doc.id}')">

👁 View

</button>

<button
class="delete-btn"
onclick="deletePurchase('${doc.id}')">

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
            "Failed to load purchase history",
            "error"
        );

    }

}

// =====================================
// Search Purchase
// =====================================

function searchPurchase(){

    const value =
    document
    .getElementById("searchPurchase")
    .value
    .toLowerCase();

    document
    .querySelectorAll("#purchaseHistory .list-card")
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
// View Purchase
// =====================================

async function viewPurchase(id){

    const doc =
    await purchaseRef.doc(id).get();

    if(!doc.exists){

        showToast(
            "Purchase Not Found",
            "error"
        );

        return;

    }

    const purchase = doc.data();

    let items="";

    purchase.items.forEach(item=>{

        items +=
`${item.product}
Qty : ${item.qty}
₹${item.total}

`;

    });

    alert(

`Purchase No : ${purchase.purchaseNumber}

Supplier : ${purchase.supplier}

${items}

Grand Total : ₹${purchase.grandTotal}`

    );

}

// =====================================
// Delete Purchase
// =====================================

async function deletePurchase(id){

    if(!confirm(
        "Delete this purchase?"
    )){

        return;

    }

    try{

        const doc =
        await purchaseRef.doc(id).get();

        if(doc.exists){

            const purchase =
            doc.data();

            // Restore Stock

            for(const item of purchase.items){

                const ref =
                productsRef.doc(item.productId);

                const product =
                await ref.get();

                if(product.exists){

                    const stock =
                    Number(product.data().stock || 0);

                    await ref.update({

                        stock:
                        stock-item.qty

                    });

                }

            }

        }

        await purchaseRef.doc(id).delete();

        loadPurchaseHistory();

        loadProducts();

        showToast(
            "Purchase Deleted Successfully",
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

purchaseRef.onSnapshot(function(){

    loadPurchaseHistory();

});

// =====================================
// Module Ready
// =====================================

console.log(
"✅ BusinessOS V11 Buy Module Ready"
);