// api/products.js
import Product from '../models/Product.js';
import { getProducts } from '../controllers/productController.js';

let productsCache = null;
let lastFetched = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Handle preflight request
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      // Check if we have valid cached data
      if (productsCache && lastFetched && (Date.now() - lastFetched) < CACHE_DURATION) {
        return res.status(200).json(productsCache);
      }

      // If no cache or expired, fetch from database using controller
      const products = await getProducts();

      // Update cache
      productsCache = products;
      lastFetched = Date.now();
      
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Error fetching products' });
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
