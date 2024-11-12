import cors from '../cors';
import { products } from '../../data/db.json';

export default async function handler(req, res) {
  // Handle CORS
  if (cors(req, res)) return;

  const { id } = req.query;

  if (req.method === 'GET') {
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    return res.status(200).json(product);
  }

  res.status(405).json({ message: 'Method not allowed' });
}
