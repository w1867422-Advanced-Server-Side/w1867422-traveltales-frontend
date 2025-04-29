import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './features/auth/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar       from './components/NavBar';

import PostList     from './features/posts/pages/PostList';
import PostDetail   from './features/posts/pages/PostDetail';
import CreatePost   from './features/posts/pages/CreatePost';
import EditPost     from './features/posts/pages/EditPost';
import Profile      from './features/auth/pages/Profile';

import Login        from './features/auth/pages/Login';
import Register     from './features/auth/pages/Register';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <NavBar />

                <Routes>
                    {/* root → list posts */}
                    <Route path="/" element={<Navigate to="/posts" replace />} />

                    {/* PUBLIC */}
                    <Route path="/posts"       element={<PostList />} />
                    <Route path="/posts/:id"   element={<PostDetail />} />

                    {/* PROTECTED */}
                    <Route
                        path="/posts/new"
                        element={
                            <ProtectedRoute>
                                <CreatePost />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/posts/:id/edit"
                        element={
                            <ProtectedRoute>
                                <EditPost />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    {/* AUTH PAGES */}
                    <Route path="/login"    element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* catch-all back to posts */}
                    <Route path="*" element={<Navigate to="/posts" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
