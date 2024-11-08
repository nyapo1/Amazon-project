import {cart, saveToStorage} from '../../data/cart.js';
import {getProduct} from '../../data/products.js';
import {getDeliveryOption} from '../../data/deliveryOptions.js';
import {formatCurrency} from '../utils/money.js';

function saveOrder(orderItems) {
 

  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  
  const order = {
    id: generateOrderId(),
    items: orderItems.map(item => {
    
      
      return {
        productId: item.productId,
        quantity: item.quantity,
        deliveryOptionId: item.deliveryOptionId,
        deliveryDate: item.deliveryDate,
        product: getProduct(item.productId)
      };
    }),
    orderDate: new Date().toLocaleDateString(),
    total: Number(calculateTotal(orderItems).toFixed(2))
  };
  
  
  
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
}

function generateOrderId() {
  return Math.random().toString(36).substr(2, 9);
}

function calculateDeliveryDate(deliveryOptionId) {
  const deliveryDays = 7; // default 7 days
  const date = new Date();
  date.setDate(date.getDate() + deliveryDays);
  return date.toLocaleDateString();
}

function calculateTotal(orderItems) {
  let total = 0;
  
  orderItems.forEach((item) => {
    const product = getProduct(item.productId);
    // Add product price * quantity
    total += product.priceCents * item.quantity;
    
    // Add delivery price
    const deliveryOption = getDeliveryOption(item.deliveryOptionId);
    total += deliveryOption.priceCents;
  });

  // Add 10% tax
  const tax = total * 0.1;
  total += tax;

  return total / 100; // Convert cents to dollars
}

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let items = 0;

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    items += cartItem.quantity;
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  document.querySelector('.display-items-no').innerHTML=`${items} items`

  const paymentSummaryHTML = `
<div class="order-message js-order-message"></div>
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${items}):</div>
      <div class="payment-summary-money">
        $${formatCurrency(productPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">
        $${formatCurrency(shippingPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">
        $${formatCurrency(totalBeforeTaxCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">
        $${formatCurrency(taxCents)}
      </div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">
        $${formatCurrency(totalCents)}
      </div>
    </div>

    <button class="place-order-button js-place-order-button  button-primary">
      Place your order
    </button>
    <button class="place-order-button js-view-order-button button-primary" onclick="window.location.href='orders.html'">
      View your Order
    </button>
  `;

  document.querySelector('.js-payment-summary')
    .innerHTML = paymentSummaryHTML;

  // Add event listener for place order button
  document.querySelector('.js-place-order-button')
    .addEventListener('click', () => {
      if (cart.length === 0) {
        const messageElement = document.querySelector('.js-order-message');
        messageElement.innerHTML = 'Cart Empty!!';
        messageElement.style.color = 'red';
        return;
      }

      // Save the order before clearing cart
      saveOrder([...cart]);
      
      // Clear the cart
      cart.length = 0;
      saveToStorage();
      
      // Show success message
      const messageElement = document.querySelector('.js-order-message');
      messageElement.innerHTML = 'Order placed successfully!';
      messageElement.style.color = 'green';
      messageElement.classList.add('success');
      
      // Hide message after 3 seconds and redirect
      setTimeout(() => {
        messageElement.classList.remove('success');
        window.location.href = '/amazon-project/lesson-17/orders.html';
      }, 1000);
    });
}