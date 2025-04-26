import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';

import Login     from './pages/Login';
import Register  from './pages/Register';
import Secure    from './pages/Secure';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
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
