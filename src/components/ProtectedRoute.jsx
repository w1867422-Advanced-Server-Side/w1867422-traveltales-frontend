import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth }   from '../features/auth/hooks';

/**
 * Only render children if user is authenticated.
 * While AuthProvider is still booting, render nothing to avoid UI flash.
 * Otherwise redirect to /login when not logged in.
 */
export default function ProtectedRoute({ children }) {
    const { user, bootDone } = useAuth();

    // wait for auth hydration
    if (!bootDone) return null;

    // not logged in → send to login
    if (!user) return <Navigate to="/login" replace />;

    // logged in → render the protected content
    return children;
}