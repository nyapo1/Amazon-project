// Check if we're in production or development
const isProduction = window.location.hostname !== 'localhost' && 
                    window.location.hostname !== '127.0.0.1';

// Set the API URL based on environment
export const API_URL = 'https://serverlessbackend-gamma.vercel.app/api';

console.log('Environment:', isProduction ? 'production' : 'development');
console.log('Current API URL:', API_URL);