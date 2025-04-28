// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
    fetchCsrfToken,
    login   as apiLogin,
    register as apiRegister,
    logout  as apiLogout,
    fetchProfile
} from '../api/authService';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // On mount: grab CSRF token, then rehydrate any saved JWT
    useEffect(() => {
        fetchCsrfToken().catch(console.error);

        const token = localStorage.getItem('accessToken');
        if (!token) return;

        // 1) quick sanity check of JWT shape
        try {
            jwtDecode(token);
        } catch (err) {
            console.warn('Invalid token, clearing it', err);
            localStorage.removeItem('accessToken');
            return;
        }

        // 2) fetch the full user profile
        fetchProfile()
            .then(profile => {
                // profile has { id, username, email, created_at, ... }
                setUser({ ...profile, token });
            })
            .catch(err => {
                console.error('Failed to fetch profile; logging out', err);
                localStorage.removeItem('accessToken');
            });
    }, []);

    // login flow
    async function login(email, password) {
        const { data } = await apiLogin(email, password);
        const { token } = data;
        localStorage.setItem('accessToken', token);

        try {
            jwtDecode(token);
        } catch {
            throw new Error('Received invalid token');
        }

        const profile = await fetchProfile();
        setUser({ ...profile, token });
    }

    // register flow
    async function register(email, password, username) {
        const { data } = await apiRegister(email, password, username);
        const { token } = data;
        localStorage.setItem('accessToken', token);

        try {
            jwtDecode(token);
        } catch {
            throw new Error('Received invalid token');
        }

        const profile = await fetchProfile();
        setUser({ ...profile, token });
    }

    // logout
    async function logoutUser() {
        await apiLogout();
        localStorage.removeItem('accessToken');
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{ user, login, register, logout: logoutUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}
