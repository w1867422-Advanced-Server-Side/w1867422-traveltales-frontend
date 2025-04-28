import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AuthProvider from '../features/auth/AuthProvider.jsx';
import Login    from '../features/auth/pages/Login.jsx';
import Register from '../features/auth/pages/Register.jsx';

import Secure          from '../pages/Secure.jsx';
import ProtectedRoute  from '../components/ProtectedRoute.jsx';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* Public auth pages */}
                    <Route path="/login"    element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected page */}
                    <Route
                        path="/secure"
                        element={
                            <ProtectedRoute>
                                <Secure />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
