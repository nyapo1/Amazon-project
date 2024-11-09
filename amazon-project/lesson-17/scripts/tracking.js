document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    
    const trackingContent = document.getElementById('trackingContent');
    const noOrderMessage = document.getElementById('noOrderMessage');
    const productInfo = document.getElementById('productName');

    // Get the tracking order from localStorage
    const orderData = JSON.parse(localStorage.getItem('trackingOrder'));
    console.log('Order data:', orderData);

    if (!orderData || !orderData.items || orderData.items.length === 0) {
        console.error('No order data found');
        trackingContent.style.display = 'none';
        noOrderMessage.style.display = 'block';
        return;
    }

    // Show tracking content
    trackingContent.style.display = 'block';
    noOrderMessage.style.display = 'none';

    // Get the single item
    const item = orderData.items[0];

    // Create HTML for the item
    const itemHTML = `
        <div class="product-tracking-container">
            <img class="product-image" src="${item.product.image}" alt="${item.product.name}">
            <div class="product-info">
                <div class="product-name">${item.product.name}</div>
                <div class="product-quantity">Quantity: ${item.quantity}</div>
                <div class="delivery-date">
                    Arriving on ${new Date(item.deliveryDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>
        </div>
    `;

    // Insert the item HTML
    productInfo.innerHTML = itemHTML;

    // Calculate the current status and update progress bar
    calculateAndUpdateProgress(orderData.orderDate, item.deliveryDate);
});

function calculateAndUpdateProgress(orderDate, deliveryDate) {
    const now = new Date();
    const start = new Date(orderDate);
    const end = new Date(deliveryDate);
    
    // Start with 33% when order is placed
    let baseProgress = 33;

    // Calculate additional progress based on time elapsed
    const totalDuration = end - start;
    const elapsed = now - start;
    let timeProgress = (elapsed / totalDuration) * 67; // Remaining 67%

    // Combine base progress with time-based progress
    let totalProgress = baseProgress + timeProgress;

    // Ensure progress stays between 33% and 100%
    totalProgress = Math.min(Math.max(totalProgress, 33), 100);

    // Update progress bar width
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = `${totalProgress}%`;

    // Determine current status
    let currentStatus;
    if (totalProgress >= 100) {
        currentStatus = 'delivered';
    } else if (totalProgress >= 66) {
        currentStatus = 'shipped';
    } else {
        currentStatus = 'preparing';
    }

    // Update status labels
    const labels = document.querySelectorAll('.progress-label');
    labels.forEach(label => {
        const status = label.dataset.status;
        label.classList.remove('active', 'current-status');
        
        // Add active class based on current progress
        if (
            (status === 'preparing' && totalProgress >= 33) ||
            (status === 'shipped' && totalProgress >= 66) ||
            (status === 'delivered' && totalProgress >= 100)
        ) {
            label.classList.add('active');
            if (status === currentStatus) {
                label.classList.add('current-status');
            }
        }
    });
}