import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { Container, Box, Typography, Alert } from '@mui/material';

export default function Secure() {
    const [msg, setMsg] = useState('');

    useEffect(() => {
        apiClient
            .get('/secure')
            .then(res => setMsg(res.data.message))
            .catch(() => setMsg('Not authorized'));
    }, []);

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>Secure Area</Typography>
                <Alert severity={msg.startsWith('Hello') ? 'success' : 'error'}>
                    {msg}
                </Alert>
            </Box>
        </Container>
    );
}
