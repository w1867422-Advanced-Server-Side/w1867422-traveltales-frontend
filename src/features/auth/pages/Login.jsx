import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Alert, Link } from '@mui/material';
import { useAuth } from '../hooks';

export default function Login() {
    const { login } = useAuth();
    const navigate  = useNavigate();
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr]           = useState('');

    const handle = async e => {
        e.preventDefault();
        try {
            await login(email,password);
            navigate('/feed');
        } catch (e) {
            setErr(e.response?.data?.error || 'Login failed');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt:8, display:'flex', flexDirection:'column', alignItems:'center' }}>
                <Typography variant="h5">Login</Typography>
                {err && <Alert severity="error" sx={{ mt:2, width:'100%' }}>{err}</Alert>}
                <Box component="form" onSubmit={handle} sx={{ mt:1, width:'100%' }}>
                    <TextField fullWidth margin="normal" label="Email" value={email}
                               onChange={e=>setEmail(e.target.value)} required/>
                    <TextField fullWidth margin="normal" label="Password" type="password"
                               value={password} onChange={e=>setPassword(e.target.value)} required/>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt:3 }}>
                        Sign In
                    </Button>
                    <Box sx={{ mt:2, textAlign:'center' }}>
                        <Link component={RouterLink} to="/register">Don&apos;t have an account? Register</Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
