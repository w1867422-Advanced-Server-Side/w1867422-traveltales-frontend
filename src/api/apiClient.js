/**
 * Axios instance that:
 *  – reads accessToken from sessionStorage
 *  – reads CSRF token from the XSRF-TOKEN cookie
 *  – transparently refreshes a 401’d access token once
 */
import axios from 'axios';

const apiClient = axios.create({
    baseURL        : process.env.REACT_APP_API_URL || 'http://localhost:3000',
    withCredentials: true   // send refresh-token cookie
});

// Attach access token & CSRF header
apiClient.interceptors.request.use(config => {
    // 1) Bearer token from sessionStorage
    const token = sessionStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // 2) CSRF from cookie (backend sets XSRF-TOKEN on /csrf-token)
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (match && config.method !== 'get') {
        config.headers['X-CSRF-Token'] = match[1];
    }

    return config;
});

// Silent refresh on 401
let refreshing = null;

apiClient.interceptors.response.use(
    res => res,
    async err => {
        const orig = err.config;
        if (err.response?.status === 401 && !orig._retry) {
            orig._retry = true;

            // single-flight: reuse the same refresh request if it’s in-flight
            refreshing = refreshing
                ?? axios.post('/auth/refresh', null, { withCredentials: true });

            try {
                const { data } = await refreshing;
                refreshing = null;

                sessionStorage.setItem('accessToken', data.token);
                orig.headers.Authorization = `Bearer ${data.token}`;
                return apiClient(orig);   // retry original request
            } catch {
                refreshing = null;
                sessionStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }
        return Promise.reject(err);
    }
);

export default apiClient;