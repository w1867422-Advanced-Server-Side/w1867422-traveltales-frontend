import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function PostCard({ post }) {
    // strip HTML and truncate
    const excerpt = html => {
        const text = html.replace(/<[^>]+>/g, '');
        return text.length > 150 ? text.slice(0, 150) + '…' : text;
    };

    // format visit date
    const date = new Date(post.visit_date).toLocaleDateString();

    return (
        <Card sx={{ mb: 2, width: '100%' }}>
            <CardContent>
                {/* author + date */}
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    By {post.author} on {date}
                </Typography>

                {/* title */}
                <Typography variant="h5" gutterBottom>
                    {post.title}
                </Typography>

                {/* excerpt */}
                <Typography variant="body2" color="text.secondary" paragraph>
                    {excerpt(post.content)}
                </Typography>

                {/* read-more + stats */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Button
                        component={RouterLink}
                        to={`/posts/${post.id}`}
                        size="small"
                    >
                        READ MORE
                    </Button>

                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Typography variant="body2">👍 {post.likes ?? 0}</Typography>
                        <Typography variant="body2">👎 {post.dislikes ?? 0}</Typography>
                        {post.comments != null && (
                            <Typography variant="body2">💬 {post.comments}</Typography>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}