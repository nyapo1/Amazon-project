document.addEventListener('DOMContentLoaded', function() {
    const loadingState = document.getElementById('loadingState');
    const productList = document.getElementById('productList');
    const productImage = document.getElementById('productImage');
    const productImageUrl = document.getElementById('productImageUrl');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const removeImage = document.getElementById('removeImage');
    const urlError = document.getElementById('urlError');
    const errorState = document.getElementById('errorState');
    let editingProductId = null;

    document.getElementById('productForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const productName = document.getElementById('productName').value;
        const productImage = document.getElementById('productImage').files[0];
        const productImageUrl = document.getElementById('productImageUrl').value;
        const productPrice = parseFloat(document.getElementById('productPrice').value);
        const productKeywords = document.getElementById('productKeywords').value.split(',').map(keyword => keyword.trim());
        const productRatingStars = parseFloat(document.getElementById('productRatingStars').value);
        const productRatingCount = parseInt(document.getElementById('productRatingCount').value, 10);

        // Create a new product object
        const newProduct = {
            name: productName,
            image: productImage ? URL.createObjectURL(productImage) : productImageUrl,
            priceCents: Math.round(productPrice * 100),
            keywords: productKeywords,
            rating: {
                stars: productRatingStars,
                count: productRatingCount
            }
        };

        // Function to handle adding the product (e.g., sending to a server or updating UI)
        addProduct(newProduct);
    });

    function addProduct(product) {
        // Logic to add the product, e.g., sending it to a server or updating the UI
        console.log('Product added:', product);
        // Reset the form after submission
        document.getElementById('productForm').reset();
    }

    productImage.addEventListener('change', handleImageChange);
    productImageUrl.addEventListener('input', handleImageUrlInput);
    removeImage.addEventListener('click', removeImagePreview);

    async function loadProducts() {
        try {
            loadingState.style.display = 'flex';
            errorState.style.display = 'none';
            

            const response = await fetch('http://localhost:5000/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            
            const products = await response.json();
            
            productList.innerHTML = products.map(product => `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-details">
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-info">
                            <div class="info-item">
                                <span>Price:</span>
                                <span>$${(product.priceCents / 100).toFixed(2)}</span>
                            </div>
                        </div>
                        <div class="product-actions">
                            <button class="btn btn-edit" onclick="editProduct('${product.id}')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-delete" onclick="deleteProduct('${product.id}')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');

            loadingState.style.display = 'none';

        } catch (error) {
            loadingState.style.display = 'none';
            errorState.style.display = 'block';
            console.error('Error loading products:', error);
        }
    }

    loadProducts();

    window.editProduct = async function(productId) {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${productId}`);
            const product = await response.json();
            
            const fields = ['Name', 'Price', 'Keywords'];
            fields.forEach(field => {
                const element = document.getElementById(`product${field}`);
                if (element) {
                    element.value = product[field.toLowerCase()];
                }
            });

            editingProductId = productId;
            document.querySelector('.btn-primary').textContent = 'Update Product';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            showMessage('Error loading product details', 'error');
        }
    };

    window.deleteProduct = async function(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) throw new Error('Failed to delete product');

                showMessage('Product deleted successfully', 'success');
                loadProducts();
            } catch (error) {
                showMessage('Error deleting product', 'error');
            }
        }
    };

    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        const container = document.querySelector('.admin-container');
        container.insertBefore(messageDiv, container.firstChild);
        
        setTimeout(() => messageDiv.remove(), 3000);
    }

    function handleImageChange() {
        const file = productImage.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
            urlError.style.display = 'none';
        }
    }

    function handleImageUrlInput() {
        const url = productImageUrl.value;
        if (isValidUrl(url)) {
            previewImg.src = url;
            imagePreview.style.display = 'block';
            urlError.style.display = 'none';
        } else if (url) {
            urlError.style.display = 'block';
        } else {
            imagePreview.style.display = 'none';
            urlError.style.display = 'none';
        }
    }

    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    function removeImagePreview() {
        previewImg.src = '';
        imagePreview.style.display = 'none';
        productImage.value = '';
        productImageUrl.value = '';
        urlError.style.display = 'none';
    }
});