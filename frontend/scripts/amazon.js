async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:5000/api/products');
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

function displayProducts(products) {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productCard = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productsContainer.innerHTML += productCard;
    });
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function searchProducts(query) {
    fetch(`http://localhost:5000/api/products/search?q=${query.toLowerCase()}`)
        .then(response => response.json())
        .then(products => displayProducts(products))
        .catch(error => console.error('Error searching products:', error));
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartCount();
    
    // Update search listener to pass the input value
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const debounceSearch = debounce((value) => searchProducts(value), 300);
            debounceSearch(e.target.value);
        });
    }
});

// Utility function for debouncing search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
} 