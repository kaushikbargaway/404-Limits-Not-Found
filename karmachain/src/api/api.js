import axios from 'axios';

// All requests go to /api which Vite proxies to http://localhost:5000
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
