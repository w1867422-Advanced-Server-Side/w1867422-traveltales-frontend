import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
    fetchCsrfToken,
    login as apiLogin,
    register as apiRegister,
    logout as apiLogout
} from '../api/authService';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch CSRF token once on mount
        (async () => {
            try {
                await fetchCsrfToken();
            } catch (err) {
                console.error('CSRF fetch failed', err);
            }
        })();

        // Rehydrate existing session
        const token = localStorage.getItem('accessToken');
        if (token) {
            const { userId, username } = jwtDecode(token);
            setUser({ userId, username, token });
        }
    }, []);

    async function login(email, password) {
        try {
            const res = await apiLogin(email, password);
            const { token } = res.data;
            localStorage.setItem('accessToken', token);
            const { userId, username } = jwtDecode(token);
            setUser({ userId, username, token });
        } catch (err) {
            throw err;
        }
    }

    async function register(email, password, username) {
        try {
            const res = await apiRegister(email, password, username);
            const { token } = res.data;
            localStorage.setItem('accessToken', token);
            const { userId } = jwtDecode(token);
            setUser({ userId, username, token });
        } catch (err) {
            throw err;
        }
    }

    async function logoutUser() {
        await apiLogout();
        localStorage.removeItem('accessToken');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout: logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
}