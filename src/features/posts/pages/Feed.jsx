import React, { useState } from 'react';
import { useFeed } from '../hooks';
import PostsGrid   from '../../../components/PostsGrid';

export default function Feed() {
    const [search, setSearch] = useState('');
    const [type,   setType]   = useState('title');
    const [sortBy, setSortBy] = useState('newest');

    const feedQuery = useFeed({ limit: 10, search, type, sortBy });

    return (
        <PostsGrid
            {...feedQuery}
            search={search}
            setSearch={setSearch}
            type={type}
            setType={setType}
            sortBy={sortBy}
            setSortBy={setSortBy}
            emptyMessage="You’re not following anyone yet."
        />
    );
}
