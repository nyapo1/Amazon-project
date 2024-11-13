import { products } from '../../data/products.js';
import cors from '../cors';

export default async function handler(req, res) {
    // Apply CORS
    if (await cors(req, res)) return;

    try {
        if (req.method === 'GET') {
            return res.status(200).json(products);
        }

        return res.status(405).json({ message: 'Method not allowed' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
