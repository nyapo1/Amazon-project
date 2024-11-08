import {cart, removeFromCart, updateDeliveryOption, updateQuantity} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import {renderPaymentSummary} from './paymentSummary.js';

export function renderOrderSummary() {
  if (!cart.length) {
    document.querySelector('.js-order-summary')
      .innerHTML = '<h2 style="color: green;">There are no items in your cart</h2>';
    return;
  }

  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    // If no delivery option is set, find the option closest to 7 days
    if (!cartItem.deliveryOptionId) {
      const defaultOption = deliveryOptions.reduce((closest, option) => {
        const currentDiff = Math.abs(option.deliveryDays - 7);
        const closestDiff = Math.abs(closest.deliveryDays - 7);
        return currentDiff < closestDiff ? option : closest;
      }, deliveryOptions[0]);
      
      cartItem.deliveryOptionId = defaultOption.id;
    }

    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    // Only calculate a new delivery date if one isn't already stored
    if (!cartItem.deliveryDate) {
      const today = dayjs();
      const deliveryDate = today.add(
        deliveryOption.deliveryDays,
        'days'
      );
      
      // Store the delivery date
      cartItem.deliveryDate = deliveryDate.format('dddd, MMMM D');
    }
    
    const dateString = cartItem.deliveryDate;

    cartSummaryHTML += `
      <div class="cart-item-container
        js-cart-item-container
        js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              ${matchingProduct.getPrice()}
            </div>
            <div class="product-quantity js-product-quantity-${matchingProduct.id}">
              <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-link" 
                data-product-id="${matchingProduct.id}">
                Update
              </span>
              <div class="quantity-input-container js-quantity-input-${matchingProduct.id}" style="display: none;">
                <input type="number" class="quantity-input js-quantity-input" 
                  value="${cartItem.quantity}" min="1" max="999">
                <span class="save-quantity-link js-save-quantity" 
                  data-product-id="${matchingProduct.id}">Save</span>
                <span class="cancel-quantity-link js-cancel-quantity"
                  data-product-id="${matchingProduct.id}">Cancel</span>
              </div>
              <span class="delete-quantity-link link-primary js-delete-link"
                data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(
        deliveryOption.deliveryDays,
        'days'
      );
      const dateString = deliveryDate.format(
        'dddd, MMMM D'
      );

      const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option js-delivery-option"
          data-product-id="${matchingProduct.id}"
          data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      `
    });

    return html;
  }

  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.remove();

        renderPaymentSummary();
      });
    });

  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;
      
        
        const deliveryOption = getDeliveryOption(deliveryOptionId);
        const today = dayjs();
        const deliveryDate = today.add(
          deliveryOption.deliveryDays,
          'days'
        );
        
        const cartItem = cart.find(item => item.productId === productId);
        if (cartItem) {
          cartItem.deliveryOptionId = deliveryOptionId;
          cartItem.deliveryDate = deliveryDate.format('dddd, MMMM D');
          
          localStorage.setItem('cart', JSON.stringify(cart));
        }
        
        renderOrderSummary();
        renderPaymentSummary();
      });
    });

  document.querySelectorAll('.js-update-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        const container = document.querySelector(`.quantity-input-container.js-quantity-input-${productId}`);
        container.style.display = 'inline-block';
      });
    });

  document.querySelectorAll('.js-save-quantity')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        const quantityInput = document.querySelector(`.js-quantity-input-${productId} .js-quantity-input`);
        const newQuantity = Number(quantityInput.value);
        
        if (newQuantity > 0 && newQuantity <= 999) {
          updateQuantity(productId, newQuantity);
          const container = document.querySelector(`.quantity-input-container.js-quantity-input-${productId}`);
          container.style.display = 'none';
          renderOrderSummary();
          renderPaymentSummary();
        }
      });
    });

  document.querySelectorAll('.js-cancel-quantity')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        const container = document.querySelector(`.quantity-input-container.js-quantity-input-${productId}`);
        container.style.display = 'none';
      });
    });
}