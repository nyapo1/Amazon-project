import cors from '../cors';

export default async function handler(req, res) {
  // Handle CORS
  if (cors(req, res)) return;

  if (req.method === 'GET') {
    try {
      const { products } = require('../../data/db.json');
      res.status(200).json(products);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error fetching products' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
