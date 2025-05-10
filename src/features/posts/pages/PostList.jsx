import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Grid,
    Typography,
    CircularProgress
} from '@mui/material';

import { usePosts }      from '../hooks';
import PostCard          from '../../../components/PostCard';
import PostFiltersBar    from '../../../components/PostFiltersBar';

export default function PostList() {
    /* filter state (lifted out of PostFiltersBar) */
    const [search, setSearch] = useState('');       // committed term
    const [type,   setType]   = useState('title');  // title | author | country
    const [sortBy, setSortBy] = useState('newest'); // newest | likes | comments
    const limit = 10;

    /* InfiniteQuery with filters */
    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetching,
        refetch          // allows manual re‑fetch when filters change
    } = usePosts({ search, type, sortBy, limit });

    /* Re‑run from page whenever a filter changes */
    useEffect(() => { refetch(); }, [search, type, sortBy, refetch]);


    /* Intersection‑observer “load more” sentinel   */
    const loadMoreRef = useRef(null);
    useEffect(() => {
        if (!hasNextPage) return;
        const obs = new IntersectionObserver(
            ents => { if (ents[0].isIntersecting) fetchNextPage(); },
            { rootMargin: '200px' }
        );
        const el = loadMoreRef.current;
        if (el) obs.observe(el);
        return () => { if (el) obs.unobserve(el); };
    }, [fetchNextPage, hasNextPage]);


    /* Loading / error guards */
    if (isLoading) {
        return (
            <Box sx={{ display:'flex', justifyContent:'center', mt:4 }}>
                <CircularProgress />
            </Box>
        );
    }
    if (isError) {
        return (
            <Typography color="error" sx={{ mt:4, textAlign:'center' }}>
                Failed to load posts.
            </Typography>
        );
    }

    const posts = data.pages.flat();

    return (
        <Box sx={{ p: 2 }}>
            {/* 🔍 shared search / filter / sort bar */}
            <PostFiltersBar
                search={search}
                onSearchChange={() => {/* not used by component but keep API */}}
                type={type}
                onTypeChange={setType}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onSubmit={setSearch}   /* called when user clicks the 🔍 icon or hits Enter */
            />

            {/* cards grid */}
            <Grid container spacing={2}>
                {posts.map(p => (
                    <Grid item xs={12} sm={6} md={4} key={p.id}>
                        <PostCard post={p} />
                    </Grid>
                ))}
            </Grid>

            {/* sentinel + spinner */}
            <Box ref={loadMoreRef} sx={{ textAlign:'center', my:3 }}>
                {isFetching && <CircularProgress />}
            </Box>
        </Box>
    );
}