import React, { useEffect, useRef } from 'react';
import { Box, Grid, CircularProgress, Button, Typography } from '@mui/material';
import PostCard       from './PostCard';
import PostFiltersBar from './PostFiltersBar';

export default function PostsGrid({
                                      data, isLoading, isError,
                                      fetchNextPage, hasNextPage, isFetching,
                                      search, setSearch,
                                      type,   setType,
                                      sortBy, setSortBy,
                                      emptyMessage = 'No posts to show.'
                                  }) {
    const loadMoreRef = useRef();

    useEffect(() => {
        if (!hasNextPage) return;
        const obs = new IntersectionObserver(
            entries => { if (entries[0].isIntersecting) fetchNextPage(); },
            { rootMargin: '200px' }
        );
        const el = loadMoreRef.current;
        if (el) obs.observe(el);
        return () => el && obs.unobserve(el);
    }, [fetchNextPage, hasNextPage]);

    if (isLoading) return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <CircularProgress/>
        </Box>
    );
    if (isError) return (
        <Typography color="error" sx={{ mt:4, textAlign:'center' }}>
            Failed to load posts.
        </Typography>
    );

    const posts = (data?.pages ?? []).flat();

    return (
        <Box sx={{ p: 2 }}>
            <PostFiltersBar
                search={search} onSearchChange={setSearch}
                type={type}     onTypeChange={setType}
                sortBy={sortBy} onSortChange={setSortBy}
                onSubmit={setSearch}
            />

            {posts.length === 0 ? (
                <Typography>{emptyMessage}</Typography>
            ) : (
                <Grid container spacing={2}>
                    {posts.map(p => (
                        <Grid item xs={12} key={p.id}>
                            <PostCard post={p}/>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Box ref={loadMoreRef} sx={{ textAlign:'center', my:3 }}>
                {isFetching && <CircularProgress/>}
            </Box>

            {hasNextPage && !isFetching && (
                <Box sx={{ textAlign:'center', mt:3 }}>
                    <Button variant="outlined" onClick={() => fetchNextPage()}>
                        Load more
                    </Button>
                </Box>
            )}
        </Box>
    );
}