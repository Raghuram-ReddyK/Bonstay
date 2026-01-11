// API Configuration for different environments
const config = {
    // Development environment configuration
    development: {
        API_BASE_URL: 'http://localhost:3002', // Base URL for local JSON server
        BACKEND_API_BASE_URL: 'http://localhost:5000/api' // Base URL for backend API server
    },
    // Production environment configuration
    production: {
        API_BASE_URL: '/api', // Base URL for production API, typically a relative path
        BACKEND_API_BASE_URL: '/api' // Base URL for production backend API
    }
};

// Determine the current environment
// process.env.NODE_ENV is a special variable set by build tools (like Webpack, Create React App)
// It will be 'development' in development mode and 'production' in production builds.
const environment = process.env.NODE_ENV || 'development';

// Export the configuration object specific to the current environment
export const API_CONFIG = config[environment];

// Export the base API URL for the current environment for direct use
export const API_BASE_URL = API_CONFIG.API_BASE_URL;

// Export the backend API base URL for the current environment
export const BACKEND_API_BASE_URL = API_CONFIG.BACKEND_API_BASE_URL;

/**
 * Helper function to construct a full API URL for a given endpoint.
 * This abstracts away the base URL, making API calls cleaner.
 * @param {string} endpoint - The specific API endpoint (e.g., '/users', '/bookings').
 * @returns {string} The complete API URL.
 */
export const getApiUrl = (endpoint) => {
    return `${API_BASE_URL}${endpoint}`;
};

/**
 * Helper function to construct a full backend API URL for a given endpoint.
 * This abstracts away the backend base URL, making API calls cleaner.
 * @param {string} endpoint - The specific backend API endpoint (e.g., '/users/register', '/bookings').
 * @returns {string} The complete backend API URL.
 */
export const getBackendApiUrl = (endpoint) => {
    return `${BACKEND_API_BASE_URL}${endpoint}`;
};
