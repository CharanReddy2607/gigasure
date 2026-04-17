import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
// Ensure the base URL doesn't end with a slash, then append /api/
const baseURL = `${rawBaseUrl.replace(/\/+$/, '')}/api/`;

console.log('>>> GIGASURE API BASE URL:', baseURL);

const api = axios.create({
    baseURL: baseURL,
});

export default api;
