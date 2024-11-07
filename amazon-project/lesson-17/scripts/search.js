function handleSearch(event) {
    // If enter key is pressed or function called from button click
    if (!event || event.keyCode === 13) {
        const searchInput = document.getElementById('search-input');
        const searchTerm = searchInput.value.toLowerCase();
        
        // Get all products
        const productsGrid = document.querySelector('.js-products-grid');
        const products = document.querySelectorAll('.product-container');
        
        products.forEach(product => {
            const productName = product.querySelector('.product-name').textContent.toLowerCase();
            // Show/hide products based on search term
            if (productName.includes(searchTerm)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }
} 