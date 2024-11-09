const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// GET all products
app.get('/api/products', (req, res) => {
  // Return your products data
  res.json(products);
});

// GET filtered products
app.get('/api/products/search', (req, res) => {
  const query = req.query.q.toLowerCase();
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(query)
  );
  res.json(filteredProducts);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 