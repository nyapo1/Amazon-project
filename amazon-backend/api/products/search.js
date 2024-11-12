import cors from '../cors';
import { products } from '../../data/products.js';

export default async function handler(req, res) {
  // Apply CORS
  if (await cors(req, res)) return;

  if (req.method === 'GET') {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchResults = products.filter(product => 
      product.name.toLowerCase().includes(q.toLowerCase()) ||
      product.keywords.some(keyword => keyword.toLowerCase().includes(q.toLowerCase()))
    );

    return res.status(200).json(searchResults);
  }

  res.status(405).json({ message: 'Method not allowed' });
}
