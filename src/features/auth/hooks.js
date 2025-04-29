import { useContext } from 'react';
import { AuthContext } from './AuthProvider.jsx';
export const useAuth = () => useContext(AuthContext);