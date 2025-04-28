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
    username : yup.string().required(),
    email    : yup.string().email().required(),
    password : yup.string().min(8).required()
});

export default function Register() {
    const { register: signup } = useAuth();           // rename to avoid shadow
    const nav = useNavigate();
    const { register, handleSubmit,
        formState:{ errors, isSubmitting } } =
        useForm({ resolver: yupResolver(schema) });
    const [err, setErr] = React.useState('');

    const onSubmit = async data => {
        try {
            await signup(data.email, data.password, data.username);
            nav('/profile');
        } catch (e) {
            setErr(e.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt:8, display:'flex', flexDirection:'column', alignItems:'center' }}>
                <Typography component="h1" variant="h5">Register</Typography>

                {err && <Alert severity="error" sx={{ mt:2, width:'100%' }}>{err}</Alert>}

                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt:1, width:'100%' }}>
                    <TextField label="Username" margin="normal" fullWidth {...register('username')}
                               error={!!errors.username} />
                    <TextField label="Email"    margin="normal" fullWidth {...register('email')}
                               error={!!errors.email} />
                    <TextField label="Password" type="password" margin="normal" fullWidth
                               {...register('password')} error={!!errors.password} />

                    <Button variant="contained" fullWidth sx={{ mt:3 }} disabled={isSubmitting}>
                        Register
                    </Button>

                    <Box textAlign="center" sx={{ mt:2 }}>
                        <Link component={RouterLink} to="/login" variant="body2">
                            Already have an account? Sign in
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
