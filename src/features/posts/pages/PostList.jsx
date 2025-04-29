import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import {
    Container, Grid, Card, CardActionArea,
    CardMedia, CardContent, Typography
} from '@mui/material';

import { usePosts } from '../hooks';
import Spinner from '../../../components/Spinner';

export default function PostList() {
    const {
        data,
        status,                       // 'idle' | 'loading' | 'success' | 'error'
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = usePosts({});

    const { ref, inView } = useInView();

    /* auto-fetch next page on sentinel */
    useEffect(() => {
        if (inView && hasNextPage) fetchNextPage();
    }, [inView, hasNextPage, fetchNextPage]);

    /* ---------- guard states ---------- */
    if (status === 'idle' || status === 'loading')
        return <Spinner />;

    if (status === 'error')
        return (
            <Container sx={{ mt:4 }}>
                <Typography color="error">
                    Failed to load posts: {error.message}
                </Typography>
            </Container>
        );

    /* status === 'success' and data is defined */
    const posts = (data?.pages ?? []).flat();

    return (
        <Container sx={{ mt:4 }}>
            <Grid container spacing={2}>
                {posts.map(p => (
                    <Grid item xs={12} sm={6} md={4} key={p.id}>
                        <Card>
                            <CardActionArea component={RouterLink} to={`/posts/${p.id}`}>
                                {p.images?.[0] && (
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={p.images[0].url}
                                        alt={p.title}
                                    />
                                )}
                                <CardContent>
                                    <Typography variant="h6">{p.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        by {p.author} on{' '}
                                        {new Date(p.visit_date).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* sentinel for infinite scroll */}
            <div ref={ref} />

            {isFetchingNextPage && <Spinner />}
        </Container>
    );
}
