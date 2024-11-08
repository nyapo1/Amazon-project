function cleanupStorage() {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const validOrders = orders.filter(order => 
    order && 
    order.items && 
    order.items.length > 0 && 
    order.total > 0
  );
  localStorage.setItem('orders', JSON.stringify(validOrders));
}

cleanupStorage();

function addToOrders(cart) {
  console.log('Cart data when creating order:', cart);

  const orders = JSON.parse(localStorage.getItem('orders')) || [];

  const order = {
    id: generateOrderId(),
    items: cart.map(item => {
      console.log('Item being added to order:', {
        productId: item.productId,
        deliveryDate: item.deliveryDate
      });
      
      return {
        ...item,
        product: getProduct(item.productId)
      };
    }),
    orderDate: new Date().toISOString(),
    total: calculateTotal(cart)
  };

  console.log('Final order data:', order);
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
  return order;
}

function renderOrders() {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const ordersGrid = document.querySelector('.orders-grid');
  
  const validOrders = orders.filter(order => order.items && order.items.length > 0);
  
  if (validOrders.length === 0) {
    ordersGrid.innerHTML = '<h2 style="color: green;">No orders found</h2>';
    return;
  }

  ordersGrid.innerHTML = validOrders.reverse().map(order => {
    return `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${order.orderDate || 'N/A'}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${(order.total || 0).toFixed(2)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id || 'N/A'}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${order.items.map(item => {
            if (!item || !item.product) return '';
            return `
              <div class="product-image-container">
                <img src="${item.product.image}">
              </div>

              <div class="product-details">
                <div class="product-name">
                  ${item.product.name}
                </div>
                <div class="product-delivery-date">
                  Arriving on: ${item.deliveryDate || 'Date not available'}
                </div>
                <div class="product-quantity">
                  Quantity: ${item.quantity || 1}
                </div>
                <button class="buy-again-button button-primary" data-product-id="${item.product.id}">
                  <img class="buy-again-icon" src="images/icons/buy-again.png">
                  <span class="buy-again-message">Buy it again</span>
                </button>
              </div>

              <div class="product-actions">
                <a href="tracking.html?orderId=${order.id}" class="track-package-button button-secondary" data-order-id="${order.id}">
                  Track package
                </a>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

renderOrders();

// Add this function at the top of the file
function showAddedToCartMessage() {
  // Create message element if it doesn't exist
  let messageElement = document.querySelector('.added-to-cart-message');
  if (!messageElement) {
    messageElement = document.createElement('div');
    messageElement.className = 'added-to-cart-message';
    messageElement.textContent = 'Item added to cart';
    document.body.appendChild(messageElement);
  }

  // Show the message
  setTimeout(() => {
    messageElement.classList.add('show');
  }, 100);

  // Hide the message after 2 seconds
  setTimeout(() => {
    messageElement.classList.remove('show');
  }, 2000);
}

// Then in your click handler, replace the alert with:
document.querySelector('.orders-grid').addEventListener('click', (event) => {
  const trackButton = event.target.closest('.track-package-button');
  if (trackButton) {
    const orderId = trackButton.dataset.orderId;
    // Store the order data in localStorage for tracking page
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderData = orders.find(order => order.id === orderId);
    localStorage.setItem('trackingOrder', JSON.stringify(orderData));
    window.location.href = `tracking.html?orderId=${orderId}`;
  }

  const buyAgainButton = event.target.closest('.buy-again-button');
  if (buyAgainButton) {
    const productId = buyAgainButton.dataset.productId;
    
    // Get the cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Add the item to cart with quantity 1
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        productId,
        quantity: 1,
        deliveryOptionId: '1' // Default delivery option
      });
    }
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show the toast message
    showAddedToCartMessage();
  }
}); 