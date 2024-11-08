import {renderOrderSummary} from './checkout/orderSummary.js';
import {renderPaymentSummary} from './checkout/paymentSummary.js';
// import '../data/cart-class.js';

renderOrderSummary();
renderPaymentSummary();

function placeOrder() {
  const orderDetails = {
    name: document.getElementById('fullName').value,
    email: document.getElementById('email').value,
    address: document.getElementById('address').value,
    // Add other necessary fields
  };

  try {
    // Submit the order and get the order ID
    const orderId = submitOrder(orderDetails);

    // Clear the cart
    clearCart();

    // Use relative path that works both locally and on Vercel
    const baseUrl = window.location.href.includes('vercel.app') 
      ? '/amazon-project/lesson-17'  // Path for Vercel
      : '';  // Empty for local development

    window.location.href = `${baseUrl}/orders.html?orderId=${orderId}`;
  } catch (error) {
    console.error('Error placing order:', error);
    alert('There was an error placing your order. Please try again.');
  }
}