import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Button,
    IconButton, Avatar, Menu, MenuItem, Box, Snackbar, Alert
} from '@mui/material';
import { useAuth } from '../features/auth/hooks';

export default function NavBar() {
    const { user, logout, bootDone } = useAuth();
    const [anchor, setAnchor] = useState(null);
    const [err,    setErr]    = useState('');
    if (!bootDone) return null;

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/posts"
                        sx={{ flexGrow:1, color:'inherit', textDecoration:'none' }}
                    >
                        TravelTales
                    </Typography>

                    {user ? (
                        <Box>
                            <Button color="inherit" component={RouterLink} to="/posts/new">
                                New Post
                            </Button>

                            <IconButton color="inherit" onClick={e=>setAnchor(e.currentTarget)}>
                                <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
                            </IconButton>

                            <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={()=>setAnchor(null)}>
                                <MenuItem component={RouterLink} to="/profile" onClick={()=>setAnchor(null)}>
                                    Profile
                                </MenuItem>
                                <MenuItem
                                    onClick={async ()=>{ setAnchor(null); try{await logout();}catch{setErr('Logout failed');} }}
                                >
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <Box>
                            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
                            <Button color="inherit" component={RouterLink} to="/register">Register</Button>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            <Snackbar open={!!err} autoHideDuration={4000} onClose={()=>setErr('')}>
                <Alert severity="error" onClose={()=>setErr('')}>{err}</Alert>
            </Snackbar>
        </>
    );
}
