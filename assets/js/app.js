/****************************
 NAVBAR LOGIN STATUS
*****************************/
const logged = localStorage.getItem("loggedInUser");
const nav = document.getElementById("navLinks");

if (nav) {
    let isAdmin = logged === "admin@gmail.com";

    nav.innerHTML = `
        <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="shop.html">Shop</a></li>
        <li class="nav-item"><a class="nav-link" href="cart.html">Cart</a></li>
        ${isAdmin ? `<li class="nav-item"><a class="nav-link" href="add-product.html">Add Product</a></li>` : ""}
        <li class="nav-item"><a class="nav-link" id="logoutBtn" href="#">Logout</a></li>
    `;

    document.getElementById("logoutBtn")?.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        location.href = "login.html";
    });
}

/****************************
 PRODUCT DATABASE
*****************************/
let products = JSON.parse(localStorage.getItem("products") || "[]");

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

/****************************
 SHOP PAGE — RENDER CARDS
*****************************/
const productList = document.getElementById("productList");

if (productList) {
    renderProducts();
}

function renderProducts() {
    productList.innerHTML = "";

    let isAdmin = logged === "admin@gmail.com";

    products.forEach(p => {
        productList.innerHTML += `
            <div class="col-md-4">
                <div class="card product-card shadow">
                    <img src="${p.image}" class="card-img-top">
                    <div class="card-body">
                        <h5>${p.name}</h5>
                        <p>${p.description}</p>
                        <h6>$${p.price}</h6>

                        <button class="btn btn-primary w-100 mb-2"
                                onclick="addToCart(${p.id})">
                            Add to Cart
                        </button>

                        ${isAdmin ? `
                            <a href="edit-product.html?id=${p.id}" class="btn btn-warning w-100 mb-2">Edit</a>
                            <button class="btn btn-danger w-100" onclick="deleteProduct(${p.id})">Delete</button>
                        ` : ""}
                    </div>
                </div>
            </div>
        `;
    });
}

/****************************
 ADD PRODUCT
*****************************/
// ...existing code...

const addForm = document.getElementById("addProductForm");

if (addForm) {
    addForm.addEventListener("submit", e => {
        e.preventDefault();

        // Correctly get values from input fields by ID
        let p = {
            id: Date.now(),
            name: document.getElementById("name").value,
            price: document.getElementById("price").value,
            image: document.getElementById("image").value,
            description: document.getElementById("description").value
        };

        products.push(p);
        saveProducts();
        location.href = "shop.html";
    });
}

// ...existing code...

/****************************
 DELETE PRODUCT
*****************************/
function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    saveProducts();
    location.reload();
}

/****************************
 LOAD PRODUCT TO EDIT PAGE
*****************************/
// ...existing code...

const editForm = document.getElementById("editProductForm");

if (editForm) {
    let params = new URLSearchParams(location.search);
    let pid = Number(params.get("id"));

    let product = products.find(p => p.id === pid);

    // Use getElementById to set values
    document.getElementById("name").value = product.name;
    document.getElementById("price").value = product.price;
    document.getElementById("image").value = product.image;
    document.getElementById("description").value = product.description;

    editForm.addEventListener("submit", e => {
        e.preventDefault();

        product.name = document.getElementById("name").value;
        product.price = document.getElementById("price").value;
        product.image = document.getElementById("image").value;
        product.description = document.getElementById("description").value;

        saveProducts();
        location.href = "shop.html";
    });
}

// ...existing code...
/****************************
 CART FUNCTIONS
*****************************/
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(id) {
    let item = cart.find(i => i.id === id);

    if (item) item.qty++;
    else cart.push({ id, qty: 1 });

    saveCart();
    showSnackbar("Added to cart!");
}

/****************************
 CART PAGE RENDER
*****************************/
const cartTable = document.getElementById("cartTable");

if (cartTable) renderCart();

function renderCart() {
    cartTable.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        let p = products.find(x => x.id === item.id);

        let itemTotal = p.price * item.qty;
        total += itemTotal;

        cartTable.innerHTML += `
            <tr>
                <td>${p.name}</td>
                <td>$${p.price}</td>
                <td>
                    <input type="number" min="1" value="${item.qty}" 
                           onchange="updateQty(${item.id}, this.value)"
                           class="form-control">
                </td>
                <td>$${itemTotal}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">X</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("grandTotal").innerText = total;
}

function updateQty(id, qty) {
    let item = cart.find(x => x.id === id);
    item.qty = Number(qty);
    saveCart();
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
}

/****************************
 SNACKBAR
*****************************/
function showSnackbar(msg) {
    let bar = document.getElementById("snackbar");
    if (!bar) return;

    bar.innerText = msg;
    bar.classList.add("show");
    setTimeout(() => bar.classList.remove("show"), 3000);
}
