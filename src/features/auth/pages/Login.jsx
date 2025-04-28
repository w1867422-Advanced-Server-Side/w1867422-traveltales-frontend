import React                       from 'react';
import { useNavigate,
    Link as RouterLink }      from 'react-router-dom';
import { useForm }                 from 'react-hook-form';
import { yupResolver }             from '@hookform/resolvers/yup';
import * as yup                    from 'yup';
import {
    Container, Box, TextField, Typography,
    Button, Link, Alert
}                                   from '@mui/material';
import { useAuth }                 from '../hooks';

const schema = yup.object({
    email   : yup.string().email().required(),
    password: yup.string().required()
});

export default function Login() {
    const { login } = useAuth();
    const nav       = useNavigate();
    const { register, handleSubmit,
        formState:{ errors, isSubmitting } } =
        useForm({ resolver: yupResolver(schema) });
    const [err, setErr] = React.useState('');

    const onSubmit = async data => {
        try {
            await login(data.email, data.password);
            nav('/profile');
        } catch (e) {
            setErr(e.response?.data?.error || 'Login failed');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt:8, display:'flex', flexDirection:'column', alignItems:'center' }}>
                <Typography component="h1" variant="h5">Sign in</Typography>

                {err && <Alert severity="error" sx={{ mt:2, width:'100%' }}>{err}</Alert>}

                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt:1, width:'100%' }}>
                    <TextField label="Email"    margin="normal" fullWidth {...register('email')}
                               error={!!errors.email} />
                    <TextField label="Password" type="password" margin="normal" fullWidth
                               {...register('password')} error={!!errors.password} />

                    <Button variant="contained" fullWidth sx={{ mt:3 }} disabled={isSubmitting}>
                        Sign In
                    </Button>

                    <Box textAlign="center" sx={{ mt:2 }}>
                        <Link component={RouterLink} to="/register" variant="body2">
                            {"Don't have an account? Register"}
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
