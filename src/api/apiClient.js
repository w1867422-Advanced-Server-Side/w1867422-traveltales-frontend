import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
    withCredentials: true, // sends cookies for CSRF
    headers: {
        'Content-Type': 'application/json'
    }
});

// attach JWT & CSRF header automatically
apiClient.interceptors.request.use(cfg => {
    const token = localStorage.getItem('accessToken');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;

    const csrf = localStorage.getItem('csrfToken');
    if (csrf && cfg.method !== 'get') {
        cfg.headers['X-CSRF-Token'] = csrf;
    }
    return cfg;
});

export default apiClient;
