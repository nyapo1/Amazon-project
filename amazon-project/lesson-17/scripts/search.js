import { API_URL } from './config.js';

export function handleSearch(event) {
    // If enter key is pressed or function called from button click
    if (!event || event.keyCode === 13) {
        const searchInput = document.getElementById('search-input');
        const searchTerm = searchInput.value.toLowerCase();
        
        fetch(`${API_URL}/products/search?q=${encodeURIComponent(searchTerm)}`)
            .then(response => response.json())
            .then(products => {
                renderProducts(products);
            })
            .catch(error => {
                console.error('Search error:', error);
            });
    }
} 