import cors from '../cors';
import { products } from '../../data/products.js';

export default async function handler(req, res) {
    // Apply CORS
    if (await cors(req, res)) return;

    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const product = products.find(p => p.id === id);
            
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            return res.status(200).json(product);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to load product' });
        }
    }

    res.status(405).json({ message: 'Method not allowed' });
}
