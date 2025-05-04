import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Alert
} from '@mui/material';
import { useAddComment } from '../hooks';

export default function CommentForm({ postId }) {
    const [content, setContent] = useState('');
    const [error, setError]     = useState('');
    const addComment = useAddComment(postId);

    const handleSubmit = async e => {
        e.preventDefault();
        if (!content.trim()) {
            setError('Comment cannot be empty.');
            return;
        }
        setError('');
        try {
            await addComment.mutateAsync(content.trim());
            setContent('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to post comment.');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
            <TextField
                label="Add a comment"
                multiline
                minRows={2}
                fullWidth
                value={content}
                onChange={e => setContent(e.target.value)}
                disabled={addComment.isLoading}
            />
            <Box sx={{ textAlign: 'right', mt: 1 }}>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={addComment.isLoading}
                >
                    Post
                </Button>
            </Box>
        </Box>
    );
}