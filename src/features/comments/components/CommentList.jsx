import React from 'react';
import {
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    IconButton,
    Typography,
    CircularProgress,
    Alert,
    Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../auth/hooks';
import { useComments, useDeleteComment } from '../hooks';

export default function CommentList({ postId }) {
    const { user, bootDone } = useAuth();
    const { data: comments, isLoading, isError } = useComments(postId);
    const deleteComment = useDeleteComment(postId);

    if (!bootDone) return null;
    if (isLoading) return <CircularProgress />;
    if (isError)   return <Alert severity="error">Failed to load comments.</Alert>;

    if (comments.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary">
                No comments yet.
            </Typography>
        );
    }

    return (
        <List disablePadding>
            {comments.map(c => (
                <ListItem
                    key={c.id}
                    alignItems="flex-start"
                    secondaryAction={
                        user && user.id === c.user_id && (
                            <IconButton
                                edge="end"
                                onClick={() => deleteComment.mutate(c.id)}
                                disabled={deleteComment.isLoading}
                            >
                                <DeleteIcon />
                            </IconButton>
                        )
                    }
                    sx={{ mb: 1, bgcolor: 'background.paper', borderRadius: 1 }}
                >
                    <ListItemAvatar>
                        <Avatar>{c.username.charAt(0).toUpperCase()}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Typography variant="subtitle2">{c.username}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(c.created_at).toLocaleString()}
                                </Typography>
                            </Box>
                        }
                        secondary={<Typography variant="body2">{c.content}</Typography>}
                    />
                </ListItem>
            ))}
        </List>
    );
}