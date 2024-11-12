import { products } from '../../data/products.js';
import cors from '../cors';

export default async function handler(req, res) {
    // Apply CORS
    if (await cors(req, res)) return;

    if (req.method === 'GET') {
        try {
            return res.status(200).json(products);
        } catch (error) {
            console.error('Error loading products:', error);
            return res.status(500).json({ error: 'Failed to load products' });
        }
    }

    res.status(405).json({ message: 'Method not allowed' });
}
