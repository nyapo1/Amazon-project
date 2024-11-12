// Check if we're in production
const isProduction = window.location.hostname !== 'localhost';

// Set the API URL based on environment
export const API_URL = isProduction 
    ? 'https://serverlessbackend-j2u3wp7f1-felixs-projects-149b1fd9.vercel.app/api'
    : 'http://localhost:3000/api';

console.log('Current API URL:', API_URL); // For debugging