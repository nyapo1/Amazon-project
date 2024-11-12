import { API_URL } from './config.js';
import { handleSearch } from './search.js';
import { addToCart, cart } from '../data/cart.js';

// Make handleSearch available to HTML
window.handleSearch = handleSearch;

// Load products when page loads
document.addEventListener('DOMContentLoaded', () => {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const productsGrid = document.querySelector('.js-products-grid');
    
    loadingSpinner.style.display = 'flex';
    productsGrid.innerHTML = ''; // Clear any existing content
    
    console.log('Fetching products from:', `${API_URL}/products`); // Log the URL being fetched

    fetch(`${API_URL}/products`)
        .then(response => {
            console.log('Response status:', response.status); // Log the response status
            console.log('Response headers:', response.headers); // Log headers to check CORS
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            console.log('Products received:', products); // Log the products data
            
            if (!products) {
                throw new Error('No data received from server');
            }
            
            renderProducts(products);
        })
        .catch(error => {
            console.error('Detailed error information:', {
                message: error.message,
                stack: error.stack,
                url: `${API_URL}/products`
            });
            
            // Display error message to user
            productsGrid.innerHTML = `
                <div class="error-message" style="
                    text-align: center;
                    width: 100%;
                    padding: 20px;
                    color: red;
                    font-size: 18px;">
                    <p>Sorry, there was a problem loading the products.</p>
                    <p>Error details: ${error.message}</p>
                    <p>Please try refreshing the page or try again later.</p>
                    <p>If the problem persists, check the console for more details.</p>
                </div>
            `;
        })
        .finally(() => {
            loadingSpinner.style.display = 'none';
        });

    // Update cart quantity display
    updateCartQuantity();
});

function renderProducts(products) {
    const productsGrid = document.querySelector('.js-products-grid');
    
    if (!products || products.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products-message">
                No products found.
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = products.map(product => `
        <div class="product-container">
            <div class="product-image-container">
                <img class="product-image" src="${product.image}">
            </div>
            
            <div class="product-name limit-text-to-2-lines">
                ${product.name}
            </div>

            <div class="product-rating-container">
                <img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars * 10}.png">
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

            <div class="added-to-cart js-added-to-cart-${product.id}">
                <img src="images/icons/checkmark.png">
                Added
            </div>

            <button class="add-to-cart-button button-primary js-add-to-cart"
                data-product-id="${product.id}">
                Add to Cart
            </button>
        </div>
    `).join('');

    // Add click event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.js-add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
            const quantity = Number(quantitySelector.value);

            // Add to cart multiple times based on quantity
            for (let i = 0; i < quantity; i++) {
                addToCart(productId);
            }

            // Update cart quantity display
            updateCartQuantity();

            // Show the "Added" message
            const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);
            addedMessage.style.opacity = '1';

            // Hide the "Added" message after 2 seconds
            setTimeout(() => {
                addedMessage.style.opacity = '0';
            }, 2000);
        });
    });
}

// Add this function to update cart quantity
function updateCartQuantity() {
    let  cartQuantityElement = document.querySelector('.js-cart-quantity');

    
    
    // Calculate total quantity across all items
    const totalQuantity = cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);
    
    // Update the cart quantity display
    cartQuantityElement.textContent = totalQuantity;
    
    // Optionally hide the badge if cart is empty
    if (totalQuantity === 0) {
        cartQuantityElement.style.display = 'none';
    } else {
        cartQuantityElement.style.display = 'flex';
    }
}