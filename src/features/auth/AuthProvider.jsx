import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import * as api from './api';

export const AuthContext = createContext(null);
export const useAuth     = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
    const [user, setUser]     = useState(null);
    const [bootDone, setBoot] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('accessToken');
        if (!token) return setBoot(true);

        try { jwtDecode(token); }
        catch { sessionStorage.removeItem('accessToken'); return setBoot(true); }

        api.profile()
            .then(setUser)
            .catch(() => sessionStorage.removeItem('accessToken'))
            .finally(() => setBoot(true));
    }, []);

    const login = async (e,p) => {
        const { token, user } = await api.login(e,p);
        sessionStorage.setItem('accessToken', token);
        setUser(user);
    };

    const register = async (e,p,u) => {
        const { token, user } = await api.register(e,p,u);
        sessionStorage.setItem('accessToken', token);
        setUser(user);
    };

    const logout = async () => {
        await api.logout();
        sessionStorage.removeItem('accessToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, bootDone, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}