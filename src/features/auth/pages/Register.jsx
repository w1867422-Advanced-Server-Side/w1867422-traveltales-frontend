import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Alert, Link } from '@mui/material';
import { useAuth } from '../hooks';

export default function Register() {
    const { register } = useAuth();
    const navigate     = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr]           = useState('');

    const handle = async e => {
        e.preventDefault();
        try {
            await register(email,password,username);
            navigate('/posts');
        } catch (e) {
            setErr(e.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt:8, display:'flex', flexDirection:'column', alignItems:'center' }}>
                <Typography variant="h5">Register</Typography>
                {err && <Alert severity="error" sx={{ mt:2, width:'100%' }}>{err}</Alert>}
                <Box component="form" onSubmit={handle} sx={{ mt:1, width:'100%' }}>
                    <TextField fullWidth margin="normal" label="Username" value={username}
                               onChange={e=>setUsername(e.target.value)} required/>
                    <TextField fullWidth margin="normal" label="Email" value={email}
                               onChange={e=>setEmail(e.target.value)} required/>
                    <TextField fullWidth margin="normal" label="Password" type="password"
                               value={password} onChange={e=>setPassword(e.target.value)} required/>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt:3 }}>
                        Register
                    </Button>
                    <Box sx={{ mt:2, textAlign:'center' }}>
                        <Link component={RouterLink} to="/login">Have an account? Sign in</Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}

