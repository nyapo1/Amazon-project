const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Simple in-memory cache
let productsCache = null;
let lastFetched = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Routes
router.get('/', productController.getProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProduct);
router.post('/', productController.createProduct);

router.get('/api/products', async (req, res) => {
  try {
    // Check if we have valid cached data
    if (productsCache && lastFetched && (Date.now() - lastFetched) < CACHE_DURATION) {
      return res.json(productsCache);
    }

    // If no cache or expired, fetch from database
    const products = await Product.find({})
      .select('id name image rating priceCents') // Only select fields we need
      .lean(); // Convert to plain JavaScript objects

    // Update cache
    productsCache = products;
    lastFetched = Date.now();
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

module.exports = router; 