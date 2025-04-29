import apiClient from '../../api/apiClient';

export const register = (e,p,u) =>
    apiClient.post('/auth/register', { email:e, password:p, username:u }).then(r=>r.data);

export const login = (e,p) =>
    apiClient.post('/auth/login', { email:e, password:p }).then(r=>r.data);

export const profile = () =>
    apiClient.get('/auth/profile').then(r=>r.data);

export const logout = () =>
    apiClient.post('/auth/logout').then(r=>r.data);