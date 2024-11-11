const Product = require('../models/Product.js');

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).lean(); // Ensure data is fetched as plain JavaScript objects
    console.log(`Found ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error); // Log error for debugging
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Get single product
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Search products
const searchProducts = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const products = await Product.find({
      name: { $regex: searchTerm, $options: 'i' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  searchProducts
}; 