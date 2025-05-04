import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button
} from '@mui/material';
import { usePosts } from '../hooks';
import Spinner from '../../../components/Spinner';

/**
 * Strip HTML tags and return plain text.
 */
function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

/**
 * Return the first `maxLen` characters of the plain-text story,
 * adding "..." if it was longer.
 */
function excerpt(html, maxLen = 150) {
    const txt = stripHtml(html);
    return txt.length > maxLen ? txt.slice(0, maxLen) + '...' : txt;
}

export default function PostList() {
    const {
        data,
        status,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = usePosts({});

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage) fetchNextPage();
    }, [inView, hasNextPage, fetchNextPage]);

    if (status === 'idle' || status === 'loading') {
        return <Spinner />;
    }
    if (status === 'error') {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography color="error">
                    Error loading posts: {error.message}
                </Typography>
            </Container>
        );
    }

    const posts = (data?.pages ?? []).flat();

    return (
        <Container sx={{ mt: 4 }}>
            <Grid container spacing={2}>
                {posts.map(post => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                        <Card>
                            {post.images?.[0] && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={post.images[0].url}
                                    alt={post.title}
                                />
                            )}

                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {post.title}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" component="p" gutterBottom>
                                    {excerpt(post.content)}
                                </Typography>

                                <Button
                                    component={RouterLink}
                                    to={`/posts/${post.id}`}
                                    size="small"
                                >
                                    Read More
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* infinite-scroll sentinel */}
            <div ref={ref} />

            {isFetchingNextPage && <Spinner />}
        </Container>
    );
}