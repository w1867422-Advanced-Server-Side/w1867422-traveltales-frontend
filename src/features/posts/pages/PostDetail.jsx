import React, { useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Grid, CardMedia, Button, Alert } from '@mui/material';
import { usePost, useDeletePost } from '../hooks';
import Spinner from '../../../components/Spinner';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Fetch the single post
    const { data: post, status, error } = usePost(id);
    const delMutation = useDeletePost(id);

    // Redirect on successful delete
    useEffect(() => {
        if (delMutation.isSuccess) {
            navigate('/posts', { replace: true });
        }
    }, [delMutation.isSuccess, navigate]);

    // Delete button handler
    const handleDelete = () => {
        if (window.confirm('Delete this post?')) {
            delMutation.mutate();
        }
    };

    // 1) Loading state
    if (status === 'loading' || status === 'idle') {
        return <Spinner />;
    }

    // 2) Error state
    if (status === 'error') {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">Failed to load post: {error.message}</Alert>
            </Container>
        );
    }

    // 3) No post found
    if (!post) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="warning">Post not found.</Alert>
            </Container>
        );
    }

    // 4) Success – render post
    const isOwner = post.author_id === post.currentUserId;
    // (or compare against authContext if you inject the current user into the hook)

    return (
        <Container sx={{ mt: 4 }}>
            <Box sx={{ mb: 2 }}>
                <Button component={RouterLink} to="/posts">← Back</Button>
                {isOwner && (
                    <Box component="span" sx={{ float: 'right' }}>
                        <Button component={RouterLink} to={`/posts/${id}/edit`} sx={{ mr: 1 }}>
                            Edit
                        </Button>
                        <Button color="error" onClick={handleDelete} disabled={delMutation.isLoading}>
                            Delete
                        </Button>
                    </Box>
                )}
            </Box>

            <Typography variant="h3" gutterBottom>{post.title}</Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                by {post.author} on {new Date(post.visit_date).toLocaleDateString()}
            </Typography>

            <Box dangerouslySetInnerHTML={{ __html: post.content }} sx={{ mb: 3 }} />

            <Typography variant="subtitle2">Country: {post.country}</Typography>

            {post.images?.length > 0 && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {post.images.map(img => (
                        <Grid item xs={12} sm={6} md={4} key={img.id}>
                            <CardMedia component="img" image={img.url} alt="" />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Show deletion errors */}
            {delMutation.isError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {delMutation.error.message || 'Failed to delete post'}
                </Alert>
            )}
        </Container>
    );
}
