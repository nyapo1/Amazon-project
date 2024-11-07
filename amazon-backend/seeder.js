require('dotenv').config();
const connectDB = require('./config/db');
const Product = require('./models/Product');
const productsData = require('./data/products.json'); // Ensure this path is correct

const importData = async () => {
  try {
    await connectDB();

    // Clear the existing data
    await Product.deleteMany();
    
    // Import fresh data
    await Product.insertMany(productsData);
    
    console.log('Data imported successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();