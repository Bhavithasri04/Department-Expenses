import axios from 'axios';

// 1. Create a central place for your server's address.
const apiClient = axios.create({
  // Use a relative path for production, which works with Vercel rewrites.
  // Use a full path for local development.
  baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:5000/api',
});

// 2. Automatically add the login token to every single request.
// This is called an "interceptor" - it runs before any request is sent.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // If a token exists, add it to the request headers.
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Send the request on its way.
  },
  (error) => {
    // Handle any errors that might happen during this process.
    return Promise.reject(error);
  }
);

export default apiClient;