const config = {
  apiBaseUrl: process.env.NODE_ENV === 'production'
    ? 'https://serverlessbackend-24ptsg9w1-felixs-projects-149b1fd9.vercel.app'
    : 'http://localhost:3001',
  allowedOrigins: [
    // 'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://localhost:3000',
    'http://localhost:3001',
    'https://online-shop-six-beige.vercel.app'
  ]
};

export default config;