import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000'
});

apiClient.interceptors.request.use(cfg => {
    const token = sessionStorage.getItem('accessToken');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

export default apiClient;