import React, { useState } from 'react';
import { usePosts } from '../hooks';
import PostsGrid      from '../../../components/PostsGrid';

export default function PostList() {
    const [search, setSearch] = useState('');
    const [type,   setType]   = useState('title');
    const [sortBy, setSortBy] = useState('newest');
    const limit = 10;

    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetching,
        refetch
    } = usePosts({ search, type, sortBy, limit });

    React.useEffect(() => {
        refetch();
    }, [search, type, sortBy, refetch]);

    return (
        <PostsGrid
            data={data}
            isLoading={isLoading}
            isError={isError}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetching={isFetching}
            search={search}
            setSearch={setSearch}
            type={type}
            setType={setType}
            sortBy={sortBy}
            setSortBy={setSortBy}
            emptyMessage="No posts to show."
        />
    );
}