require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const compression = require('compression');
const jsonServer = require('json-server');

const app = express();

const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://localhost:3000'
];

// CORS Middleware - place this BEFORE any routes
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Connect to MongoDB
connectDB();

// Middleware for Express server
app.use(express.json());
app.use(compression());

// Routes for Express server
app.use('/api/products', productRoutes);

// Add a route for the root URL
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Express Server</h1>');
});

const EXPRESS_PORT = 8000; // Port for Express server
app.listen(EXPRESS_PORT, () => {
  console.log(`Express server running on port ${EXPRESS_PORT}`);
});

// Setup JSON Server
const jsonApp = jsonServer.create();
const router = jsonServer.router('db.json'); // Ensure 'db.json' is in the correct path
const middlewares = jsonServer.defaults();

jsonApp.use(cors()); // Enable CORS for JSON server
jsonApp.use(middlewares);
jsonApp.use(router);

const JSON_SERVER_PORT = process.env.JSON_SERVER_PORT || 3000; // Port for JSON server
jsonApp.listen(JSON_SERVER_PORT, () => {
  console.log(`JSON Server is running on port ${JSON_SERVER_PORT}`);
}); 