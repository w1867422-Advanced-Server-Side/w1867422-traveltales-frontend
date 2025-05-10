import React, { useState, useRef, useEffect } from 'react';
import {
    Box, Typography, Button, CircularProgress
} from '@mui/material';
import { useFeed } from '../hooks';
import PostCard      from '../../../components/PostCard';
import PostFiltersBar from '../../../components/PostFiltersBar';

export default function Feed() {
    /* local filter state */
    const [search, setSearch] = useState('');
    const [type,   setType]   = useState('title');   // title | author | country
    const [sortBy, setSortBy] = useState('newest');  // newest | likes | comments

    /* infinite query */
    const {
        data, isLoading, isError,
        fetchNextPage, hasNextPage, isFetching
    } = useFeed({ limit:10, sortBy, search, type });

    /* sentinel for intersection‑observer pagination */
    const loadMoreRef = useRef(null);
    useEffect(() => {
        if (!hasNextPage) return;
        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) fetchNextPage();
            },
            { rootMargin:'200px' }
        );
        const el = loadMoreRef.current;
        if (el) obs.observe(el);
        return () => { if (el) obs.unobserve(el); };
    }, [fetchNextPage, hasNextPage]);

    /* loading & error */
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
                Error loading your feed.
            </Typography>
        );
    }

    /* flatten pages */
    const posts = data.pages.flat();

    return (
        <Box sx={{ p:2 }}>
            <PostFiltersBar
                search={search}
                onSearchChange={setSearch}
                type={type}
                onTypeChange={setType}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onSubmit={setSearch}
            />

            {posts.length === 0 && (
                <Typography>You’re not following anyone yet.</Typography>
            )}

            {posts.map(p => <PostCard key={p.id} post={p}/> )}

            {/* invisible sentinel for infinite scroll */}
            <Box ref={loadMoreRef} sx={{ textAlign:'center', my:3 }}>
                {isFetching && <CircularProgress />}
            </Box>

            {/* fallback button (if IntersectionObserver not supported) */}
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
