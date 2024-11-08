document.addEventListener('DOMContentLoaded', function() {
    // Get the order ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    if (!orderId) {
        console.error('No order ID provided');
        document.getElementById('orderTracking').innerHTML = 
            '<p>No order ID provided. Please check your order confirmation email.</p>';
        return;
    }

    // Try to get the order data
    const orderData = JSON.parse(localStorage.getItem(`order_${orderId}`));
    
    if (!orderData) {
        console.error('Order not found:', orderId);
        document.getElementById('orderTracking').innerHTML = 
            '<p>Order not found. Please check your order ID.</p>';
        return;
    }

    // If we have the order data, update the page
    updateTrackingPage(orderData);
});

function updateTrackingPage(orderData) {
    // Get the first item from the order
    const item = orderData.items[0];

    // Update product details
    document.getElementById('productName').textContent = item.product.name;
    document.getElementById('productQuantity').textContent = `Quantity: ${item.quantity}`;
    document.getElementById('productImage').src = item.product.image;

    // Use the actual delivery date from the cart item
    const deliveryDate = new Date(item.deliveryDate);
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('deliveryDate').textContent = 
        `Arriving on ${deliveryDate.toLocaleDateString('en-US', options)}`;

    // First update the progress bar
    updateProgressBar(orderData.orderDate, item.deliveryDate);

    // Then determine and update the status based on progress
    const today = new Date();
    const orderDate = new Date(orderData.orderDate);
    const totalDuration = deliveryDate - orderDate;
    const elapsed = today - orderDate;
    const progress = (elapsed / totalDuration) * 100;

    let status = 'preparing';
    if (progress >= 100) {
        status = 'delivered';
    } else if (progress >= 60) {
        status = 'shipped';
    }

    updateTrackingStatus(status);
}

function updateTrackingStatus(status) {
    const statusElements = document.querySelectorAll('.progress-label');
    
    // Reset all statuses
    statusElements.forEach(element => {
        element.classList.remove('current-status');
    });

    // Highlight current status
    const currentStatus = document.querySelector(`[data-status="${status}"]`);
    if (currentStatus) {
        currentStatus.classList.add('current-status');
    }
}

function updateProgressBar(orderDate, deliveryDate) {
    const now = new Date();
    const order = new Date(orderDate);
    const delivery = new Date(deliveryDate);
    
    // Calculate total duration and time elapsed
    const totalDuration = delivery - order;
    const elapsed = now - order;
    
    // Calculate progress percentage
    let progressPercentage = (elapsed / totalDuration) * 100;
    
    // Apply the progress rules
    if (progressPercentage < 30) {
        progressPercentage = 30; // Minimum 30% - Preparing
    } else if (progressPercentage < 60) {
        progressPercentage = 60; // Between 30-60% - Shipped
    } else {
        progressPercentage = 100; // Over 60% - Delivered
    }
    
    // Update the progress bar width
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progressPercentage}%`;
    }
}

// Call this function when the page loads with your order and delivery dates
// Example:
// updateProgressBar('2024-03-10', '2024-03-20');