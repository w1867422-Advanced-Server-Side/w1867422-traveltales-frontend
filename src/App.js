import React                                   from 'react';
import { BrowserRouter, Routes, Route, Navigate }
    from 'react-router-dom';

import AuthProvider        from './features/auth/AuthProvider.jsx';
import ProtectedRoute      from './components/ProtectedRoute.jsx';
import NavBar              from './components/NavBar.jsx';

/* Auth pages */
import Login    from './features/auth/pages/Login.jsx';
import Register from './features/auth/pages/Register.jsx';

/* Post pages */
import PostList   from './features/posts/pages/PostList.jsx';
import PostDetail from './features/posts/pages/PostDetail.jsx';
import CreatePost from './features/posts/pages/CreatePost.jsx';
import EditPost   from './features/posts/pages/EditPost.jsx';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <NavBar />

                <Routes>
                    <Route path="/" element={<Navigate to="/posts" replace />} />

                    {/* Public blog routes */}
                    <Route path="/posts"         element={<PostList   />} />
                    <Route path="/posts/:id"     element={<PostDetail />} />

                    {/* Auth-protected CRUD */}
                    <Route path="/posts/new"      element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
                    <Route path="/posts/:id/edit" element={<ProtectedRoute><EditPost   /></ProtectedRoute>} />

                    {/* Auth pages */}
                    <Route path="/login"    element={<Login    />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}