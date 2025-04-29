// src/features/auth/api.js
import apiClient from '../../api/apiClient';

/* ---- /auth endpoints ------------------------------------------------ */

export const register = (email, password, username) =>
    apiClient.post('/auth/register', { email, password, username })
        .then(r => r.data);

export const login = (email, password) =>
    apiClient.post('/auth/login', { email, password })
        .then(r => r.data);

export const profile = () =>
    apiClient.get('/auth/profile').then(r => r.data);

export const logout = () =>
    apiClient.post('/auth/logout').then(r => r.data);
