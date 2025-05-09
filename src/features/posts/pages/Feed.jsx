import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useFeed } from '../hooks';
import PostCard from '../../../components/PostCard';

export default function Feed() {
    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetching
    } = useFeed({ limit: 10, sortBy: 'newest' });

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }
    if (isError) {
        return (
            <Typography color="error" sx={{ mt: 4, textAlign: 'center' }}>
                Error loading your feed.
            </Typography>
        );
    }

    const posts = data.pages.flat();

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
                My Feed
            </Typography>

            {posts.length === 0 && (
                <Typography>You’re not following anyone yet.</Typography>
            )}

            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}

            {hasNextPage && (
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Button
                        variant="outlined"
                        onClick={() => fetchNextPage()}
                        disabled={isFetching}
                    >
                        {isFetching ? 'Loading…' : 'Load more'}
                    </Button>
                </Box>
            )}
        </Box>
    );
}