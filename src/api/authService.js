import apiClient from './apiClient';

export function fetchCsrfToken() {
    return apiClient
        .get('/csrf-token')
        .then(res => {
            const { csrfToken } = res.data;
            localStorage.setItem('csrfToken', csrfToken);
            return csrfToken;
        });
}

export function fetchProfile() {
    return apiClient.get('/auth/profile').then(r => r.data);
}

export function register(email, password, username) {
    return apiClient.post('/auth/register', { email, password, username });
}

export function login(email, password) {
    return apiClient.post('/auth/login', { email, password });
}

export function logout() {
    return apiClient.post('/auth/logout');
}
