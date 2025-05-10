// src/components/NavBar.jsx
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Box,
    Snackbar,
    Alert
} from '@mui/material';
import { useAuth } from '../features/auth/hooks';

export default function NavBar() {
    const { user, logout, bootDone } = useAuth();
    const [anchorEl, setAnchorEl]    = useState(null);
    const [error, setError]          = useState('');

    // Wait until auth state is known to avoid flashing wrong UI
    if (!bootDone) return null;

    const handleMenuOpen  = e => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = async () => {
        handleMenuClose();
        try {
            await logout();
        } catch {
            setError('Logout failed. Please try again.');
        }
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    {/* Logo / Home */}
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/posts"
                        sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
                    >
                        TravelTales
                    </Typography>

                    {user ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {/* Always-visible when logged in */}
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/posts"
                            >
                                Posts
                            </Button>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/posts"
                            >
                                Search
                            </Button>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/feed"
                            >
                                My Feed
                            </Button>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/posts/new"
                            >
                                New Post
                            </Button>

                            {/* Avatar / Dropdown */}
                            <IconButton color="inherit" onClick={handleMenuOpen}>
                                <Avatar>
                                    {user.username.charAt(0).toUpperCase()}
                                </Avatar>
                            </IconButton>

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem
                                    component={RouterLink}
                                    to="/profile"
                                    onClick={handleMenuClose}
                                >
                                    Profile
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {/* Only when not logged in */}
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/login"
                            >
                                Login
                            </Button>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/register"
                            >
                                Register
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            {/* Global error snackbar */}
            <Snackbar
                open={!!error}
                autoHideDuration={4000}
                onClose={() => setError('')}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setError('')}
                    severity="error"
                    sx={{ width: '100%' }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
}
