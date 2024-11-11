// api/products.js
import Cors from 'cors';
import { getProducts } from '../controllers/productController.js';

// Initialize CORS middleware
const cors = Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
    origin: '*', // Change this for production
});

// Helper function to run middleware
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

export default async function handler(req, res) {
    await runMiddleware(req, res, cors);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        try {
            const products = await getProducts(); // Ensure this function is defined correctly
            res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ message: 'Error fetching products' });
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
}