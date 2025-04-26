import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Link,
    Alert
} from '@mui/material';

export default function Login() {
    const { login } = useContext(AuthContext);
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/secure');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                <Typography component="h1" variant="h5">Login</Typography>
                {error && (
                    <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        type="password"
                        label="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
                        Sign In
                    </Button>
                    <Box textAlign="center" sx={{ mt: 2 }}>
                        <Link component={RouterLink} to="/register" variant="body2">
                            {"Don't have an account? Register"}
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
