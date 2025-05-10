import React, { useState } from 'react';
import {
    Box,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    IconButton,
    Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

/**
 * Reusable bar for { search text, search type, sort‑by }.
 * Parents control the actual filter values via props.
 */
export default function PostFiltersBar({
                                           search,          // string
                                           onSearchChange,  // fn(text)
                                           type,            // 'title' | 'author' | 'country'
                                           onTypeChange,    // fn(type)
                                           sortBy,          // 'newest' | 'likes' | 'comments'
                                           onSortChange,    // fn(sort)
                                           onSubmit         // () => void
                                       }) {
    // local input so that it doesn't hammer the hook on every keystroke
    const [draft, setDraft] = useState(search);

    const handleKey = e => {
        if (e.key === 'Enter') onSubmit(draft.trim());
    };

    return (
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mb: 3 }}
            alignItems="center"
        >
            {/* Search box + button */}
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
                <TextField
                    fullWidth
                    placeholder="Search…"
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={handleKey}
                    size="small"
                />
                <IconButton
                    color="primary"
                    sx={{ ml: 1 }}
                    onClick={() => onSubmit(draft.trim())}
                >
                    <SearchIcon />
                </IconButton>
            </Box>

            {/* search‑type selector */}
            <FormControl size="small" sx={{ minWidth: 110 }}>
                <InputLabel id="post-type-label">Field</InputLabel>
                <Select
                    labelId="post-type-label"
                    value={type}
                    label="Field"
                    onChange={e => onTypeChange(e.target.value)}
                >
                    <MenuItem value="title">Title</MenuItem>
                    <MenuItem value="author">Author</MenuItem>
                    <MenuItem value="country">Country</MenuItem>
                </Select>
            </FormControl>

            {/* sort selector */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="sort-label">Sort by</InputLabel>
                <Select
                    labelId="sort-label"
                    value={sortBy}
                    label="Sort by"
                    onChange={e => onSortChange(e.target.value)}
                >
                    <MenuItem value="newest">Newest</MenuItem>
                    <MenuItem value="likes">Most Liked</MenuItem>
                    <MenuItem value="comments">Most Commented</MenuItem>
                </Select>
            </FormControl>
        </Stack>
    );
}