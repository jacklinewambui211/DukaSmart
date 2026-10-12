const STORAGE_KEY = "dukaSmartProducts";

let products = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const productForm = document.getElementById("productForm");
const productName = document.getElementById("productName");
const productQuantity = document.getElementById("productQuantity");
const productPrice = document.getElementById("productPrice");
const productTable = document.getElementById("productList");
const searchInput = document.getElementById("searchProduct");
// Save products in the browser
function saveProducts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Display products in the inventory table
function displayProducts(list = products) {
    productTable.innerHTML = "";

    list.forEach((product) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(product.name)}</td>
            <td>${product.quantity}</td>
            <td>${Number(product.price).toFixed(2)}</td>
            <td>
                <button type="button" data-delete="${product.id}">
                    Delete
                </button>
            </td>
        `;

        productTable.appendChild(row);
    });
totalProducts.textContent = products.length;

const lowStock = document.getElementById("lowStock");

lowStock.textContent = products.filter(
    product => Number(product.quantity) <= 5
).length;
    
}

// Prevent product names from being treated as HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Add a new product
productForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = productName.value.trim();
    const quantity = Number(productQuantity.value);
    const price = Number(productPrice.value);

    if (
        !name ||
        productQuantity.value === "" ||
        productPrice.value === "" ||
        !Number.isFinite(quantity) ||
        !Number.isFinite(price) ||
        quantity < 0 ||
        price < 0
    ) {
        alert("Please enter valid product details.");
        return;
    }

    const product = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        name: name,
        quantity: quantity,
        price: price
    };

    products.push(product);
    saveProducts();
    displayProducts();

    productForm.reset();
});

// Search products by name
searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm)
    );

    displayProducts(filteredProducts);
});

// Delete a product and save the updated inventory
productTable.addEventListener("click", function (event) {
    const deleteButton = event.target.closest("[data-delete]");

    if (!deleteButton) return;

    const productId = deleteButton.dataset.delete;

    products = products.filter(
        (product) => product.id !== productId
    );

    saveProducts();

    const searchTerm = searchInput.value.trim().toLowerCase();

    displayProducts(
        products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm)
        )
    );
});

// Load saved products when the page opens
displayProducts();
const saleForm = document.getElementById("saleForm");
const saleProduct = document.getElementById("saleProduct");
const saleQuantity = document.getElementById("saleQuantity");
const saleTotal = document.getElementById("saleTotal");
const totalSalesDisplay = document.getElementById("totalSales");

let todaySales = Number(localStorage.getItem("dukaSmartTodaySales")) || 0;

function updateSalesDisplay() {
    totalSalesDisplay.textContent = "KSh " + todaySales.toFixed(2);
}

function populateSaleProducts() {
    const selectedValue = saleProduct.value;

    saleProduct.innerHTML = '<option value="">Choose a product</option>';

    products.forEach(product => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent =
            product.name + " (Stock: " + product.quantity + ")";
        saleProduct.appendChild(option);
    });

    saleProduct.value = selectedValue;
}

function updateSaleTotal() {
    const product = products.find(
        item => item.id === saleProduct.value
    );

    const quantity = Number(saleQuantity.value);

    if (product && quantity > 0) {
        saleTotal.textContent =
            "KSh " + (product.price * quantity).toFixed(2);
    } else {
        saleTotal.textContent = "KSh 0.00";
    }
}

saleProduct.addEventListener("change", updateSaleTotal);
saleQuantity.addEventListener("input", updateSaleTotal);

saleForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const product = products.find(
        item => item.id === saleProduct.value
    );

    const quantity = Number(saleQuantity.value);

    if (!product) {
        alert("Please select a product.");
        return;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
        alert("Enter a valid quantity.");
        return;
    }

    if (quantity > Number(product.quantity)) {
        alert("Not enough stock available.");
        return;
    }

    const amount = Number(product.price) * quantity;

    product.quantity = Number(product.quantity) - quantity;

    todaySales += amount;

    localStorage.setItem(
        "dukaSmartTodaySales",
        String(todaySales)
    );

    saveProducts();
    displayProducts();
    populateSaleProducts();
    updateSalesDisplay();

    saleForm.reset();
    updateSaleTotal();

    alert("Sale recorded successfully!");
});

populateSaleProducts();
updateSalesDisplay();