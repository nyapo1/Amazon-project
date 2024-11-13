const config = {
  apiBaseUrl: process.env.NODE_ENV === 'production'
    ? 'https://serverlessbackend-q4trcl8r5-felixs-projects-149b1fd9.vercel.app'
    : 'http://localhost:3001',
  allowedOrigins: [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://localhost:3000',
    'http://localhost:3001',
    'https://online-shop-six-beige.vercel.app',
    'https://amazon-project-lesson-17.vercel.app',
    'https://your-frontend-domain.vercel.app'
  ]
};

export default config;