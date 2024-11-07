import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';

let productsHTML = '';
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderProducts(productsToRender) {
  productsHTML = '';
  
  const showAllButton = document.querySelector('.js-show-all-products');
  if (productsToRender.length < products.length) {
    showAllButton.style.display = 'block';
  } else {
    showAllButton.style.display = 'none';
  }

  productsToRender.forEach((product) => {
    productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars * 10}.png">
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
  });

  document.querySelector('.js-products-grid').innerHTML = productsHTML;
}

function loadProducts() {
  renderProducts(products);
}

function handleSearch(event) {
  const searchInput = document.querySelector('.search-bar');
  const searchTerm = searchInput.value.toLowerCase();
  
  if (searchTerm.trim() === '') {
    renderProducts(products);
    return;
  }
  
  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchTerm)
  );
  
  renderProducts(filteredProducts);
}

function showAllProducts() {
  const searchInput = document.querySelector('.search-bar');
  searchInput.value = '';
  renderProducts(products);
}

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  
  const searchInput = document.querySelector('.search-bar');
  searchInput.addEventListener('input', handleSearch);
  
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

  const quantitySelect = document.querySelector(`.js-quantity-selector-${productId}`);
  const quantity = Number(quantitySelect.value);

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