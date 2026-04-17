import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const api = axios.create({
    baseURL: rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`,
});

export default api;
