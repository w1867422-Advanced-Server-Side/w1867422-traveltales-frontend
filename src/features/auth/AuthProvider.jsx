/**
 * <AuthProvider>
 *  – hydrates user on first mount
 *  – exposes { user, login, register, logout, bootDone } via context
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import * as api  from './api';

export const AuthContext = createContext(null);
export const useAuth     = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
    const [user, setUser]     = useState(null);
    const [bootDone, setBoot] = useState(false);

    /* ---------- initial hydration ---------- */
    useEffect(() => {
        api.csrf();                                       // sets XSRF-TOKEN cookie
        const token = sessionStorage.getItem('accessToken');
        if (!token) return setBoot(true);

        try { jwtDecode(token); }                         // simple integrity check
        catch { sessionStorage.removeItem('accessToken'); return setBoot(true); }

        api.profile()
            .then(setUser)
            .finally(() => setBoot(true));
    }, []);

    /* ---------- auth actions ---------- */
    const login = async (email, password) => {
        const { token } = await api.login(email, password);
        sessionStorage.setItem('accessToken', token);
        setUser(await api.profile());
    };

    const register = async (email, password, username) => {
        const { token } = await api.register(email, password, username);
        sessionStorage.setItem('accessToken', token);
        setUser(await api.profile());
    };

    const logout = async () => {
        await api.logout();
        sessionStorage.removeItem('accessToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, bootDone }}>
            {children}
        </AuthContext.Provider>
    );
}
