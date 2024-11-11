import {formatCurrency} from './utils/money.js';

let productsHTML = '';
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];

async function fetchProducts() {
  const loadingSpinner = document.getElementById('loadingSpinner');
  const productsGrid = document.querySelector('.js-products-grid');
  
  try {
    // Show loading spinner, hide products grid
    loadingSpinner.style.display = 'flex';
    productsGrid.style.display = 'none';

    const response = await fetch('http://192.168.1.5:5000/api/products');
    // const response = await fetch('http://localhost:5000/api/products');
    const data = await response.json();
    
    if (data.length === 0) {
      console.log('No products returned from API');
    }
    
    renderProducts(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    productsGrid.innerHTML = '<p class="error-message">Error loading products. Please try again later.</p>';
  } finally {
    // Hide loading spinner, show products grid
    loadingSpinner.style.display = 'none';
    productsGrid.style.display = 'grid';
  }
}

function renderProducts(products) {
  
  let productsHTML = '';
  
  products.forEach((product) => {
    productsHTML += renderProduct(product);
  });

  document.querySelector('.js-products-grid').innerHTML = productsHTML;
}

function renderProduct(product) {
  const starNumber = Math.round(product.rating.stars * 10);
  
  return `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image" src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${starNumber}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        $${(product.priceCents / 100).toFixed(2)}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart"
        data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;
}

async function handleSearch(event) {
  const searchInput = document.querySelector('.search-bar');
  const searchTerm = searchInput.value.toLowerCase();
  
  if (searchTerm.trim() === '') {
    renderProducts(products);
    return;
  }
  
  try {
    const response = await fetch(`http://localhost:5000/api/products/search?q=${searchTerm}`);
    const filteredProducts = await response.json();
    renderProducts(filteredProducts);
  } catch (error) {
    console.error('Error searching products:', error);
    // Fallback to client-side filtering if API fails
    const filteredProducts = products.filter((product) => 
      product.name.toLowerCase().includes(searchTerm)
    );
    renderProducts(filteredProducts);
  }
}

function showAllProducts() {
  const searchInput = document.querySelector('.search-bar');
  searchInput.value = '';
  renderProducts(products);
}

document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  
  const searchInput = document.querySelector('.search-bar');
  searchInput.addEventListener('input', debounce(handleSearch, 300));
  
  const showAllButton = document.querySelector('.js-show-all-products');
  showAllButton.addEventListener('click', showAllProducts);
  
  updateCartQuantity();
  
  document.querySelector('.js-products-grid').addEventListener('click', (event) => {
    if (event.target.classList.contains('js-add-to-cart')) {
      const productId = event.target.dataset.productId;
      addToCart(productId);
    }
  });
});

function updateCartQuantity() {
  const cartQuantity = document.querySelector('.js-cart-quantity');
  
  const totalQuantity = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  cartQuantity.innerHTML = totalQuantity;
}

function addToCart(productId) {
  let matchingItem;

  cart.forEach((item) => {
    if (productId === item.productId) {
      matchingItem = item;
    }
  });

  const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
  
  // Add error handling
  if (!quantitySelector) {
    console.error(`Quantity selector not found for product ${productId}`);
    return;
  }
  
  const quantity = Number(quantitySelector.value);

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId: productId,
      quantity: quantity
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartQuantity();

  // Show the "Added" message
  const addedMessage = document.querySelector(
    `[data-product-id="${productId}"]`)
    .previousElementSibling;
  addedMessage.classList.add('added-to-cart-visible');

  setTimeout(() => {
    addedMessage.classList.remove('added-to-cart-visible');
  }, 2000);
}

// Add debounce utility function
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