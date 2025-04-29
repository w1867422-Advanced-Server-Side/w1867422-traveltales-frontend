import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks';
import { usePosts, useDeletePost } from '../../posts/hooks';
import {
    Container,
    Box,
    Avatar,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Profile() {
    const { user, bootDone } = useAuth();
    const { data, status, error } = usePosts({ limit: 1000, offset: 0 });
    const navigate = useNavigate();

    // Mutation to delete a post
    const deletePost = useDeletePost();

    // Handler
    const handleDelete = id => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            deletePost.mutate(id, {
                onSuccess: () => navigate('/profile', { replace: true }),
            });
        }
    };

    if (!bootDone || status === 'loading') {
        return (
            <Box sx={{ display:'flex', justifyContent:'center', mt:4 }}>
                <CircularProgress />
            </Box>
        );
    }
    if (status === 'error') {
        return <Alert severity="error" sx={{ mt:4 }}>Failed to load posts</Alert>;
    }

    const allPosts = (data?.pages ?? []).flat();
    const myPosts = allPosts.filter(p => p.author_id === user.id);

    return (
        <Container sx={{ mt:4 }}>
            {/* User info */}
            <Box display="flex" alignItems="center" mb={4} gap={2}>
                <Avatar sx={{ width:64, height:64 }}>
                    {user.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                    <Typography variant="h5">{user.username}</Typography>
                    <Typography variant="body1">{user.email}</Typography>
                </Box>
            </Box>

            {/* My posts */}
            <Typography variant="h6" gutterBottom>My Posts</Typography>

            {myPosts.length === 0 ? (
                <Typography>No posts yet.</Typography>
            ) : (
                <List>
                    {myPosts.map(post => (
                        <ListItem
                            key={post.id}
                            secondaryAction={
                                <>
                                    <IconButton
                                        edge="end"
                                        component={RouterLink}
                                        to={`/posts/${post.id}/edit`}
                                        aria-label="edit"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        onClick={() => handleDelete(post.id)}
                                        aria-label="delete"
                                        disabled={deletePost.isLoading}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }
                        >
                            <ListItemText
                                primary={post.title}
                                secondary={new Date(post.visit_date).toLocaleDateString()}
                            />
                        </ListItem>
                    ))}
                </List>
            )}

            {deletePost.isError && (
                <Alert severity="error" sx={{ mt:2 }}>
                    {deletePost.error.message || 'Failed to delete post'}
                </Alert>
            )}
        </Container>
    );
}
