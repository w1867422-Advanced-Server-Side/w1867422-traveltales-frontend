import React, { useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Grid,
    CardMedia,
    Button,
    IconButton,
    Alert
} from '@mui/material';
import Spinner from '../../../components/Spinner';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

import { usePost, useDeletePost } from '../hooks';
import {
    useVotes,
    useUserVote,
    useLikeMutation,
    useDislikeMutation,
    useUnvoteMutation
} from '../hooks';
import {
    useFollowing,
    useFollowMutation,
    useUnfollowMutation
} from '../../auth/hooks';
import { useAuth } from '../../auth/hooks';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, bootDone } = useAuth();

    // 1) Load the post
    const { data: post, status } = usePost(id);

    // 2) Deletion
    const del = useDeletePost(id);
    useEffect(() => {
        if (del.isSuccess) {
            navigate('/posts', { replace: true });
        }
    }, [del.isSuccess, navigate]);

    // 3) Follow / Unfollow
    const { data: following } = useFollowing();
    const isFollowing = !!following?.find(u => u.id === post?.author_id);
    const followMut = useFollowMutation();
    const unfollowMut = useUnfollowMutation();

    const handleFollow = () => {
        if (!bootDone) return;
        if (!user) {
            navigate('/login', { replace: true });
            return;
        }
        if (isFollowing) {
            unfollowMut.mutate(post.author_id);
        } else {
            followMut.mutate(post.author_id);
        }
    };

    // 4) Votes
    const { data: votes } = useVotes(id);
    const { data: userVote } = useUserVote(id);
    const likeMut = useLikeMutation();
    const dislikeMut = useDislikeMutation();
    const unvoteMut = useUnvoteMutation();

    // 👍 like / undo‑like
    const handleLike = () => {
        if (!bootDone) return;
        if (!user) return navigate('/login', { replace:true });

        if (userVote === true) {
            unvoteMut.mutate({ id });     // ← object form
        } else {
            likeMut.mutate({ id });
        }
    };

// 👎 dislike / undo‑dislike
    const handleDislike = () => {
        if (!bootDone) return;
        if (!user) return navigate('/login', { replace:true });

        if (userVote === false) {
            unvoteMut.mutate({ id });
        } else {
            dislikeMut.mutate({ id });
        }
    };

    // 5) Render guards
    if (status === 'idle' || status === 'loading') {
        return <Spinner />;
    }
    if (status === 'error') {
        return <Alert severity="error">Failed to load post</Alert>;
    }
    if (!post) {
        return <Alert severity="warning">Post not found</Alert>;
    }

    // 6) Ownership
    const isOwner = user?.id === post.author_id;

    return (
        <Container sx={{ mt: 4 }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Button component={RouterLink} to="/posts">← Back</Button>

                {/* follow/unfollow for non-owners */}
                {!isOwner && (
                    <IconButton onClick={handleFollow} sx={{ ml: 2 }}>
                        {isFollowing ? <PersonRemoveIcon /> : <PersonAddIcon />}
                    </IconButton>
                )}

                {/* edit/delete for owner */}
                {isOwner && (
                    <Box sx={{ ml: 'auto' }}>
                        <Button
                            component={RouterLink}
                            to={`/posts/${id}/edit`}
                            sx={{ mr: 1 }}
                        >
                            Edit
                        </Button>
                        <Button
                            color="error"
                            onClick={() => del.mutate()}
                        >
                            Delete
                        </Button>
                    </Box>
                )}
            </Box>

            <Typography variant="h3" gutterBottom>
                {post.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                by {post.author} on {new Date(post.visit_date).toLocaleDateString()}
            </Typography>

            {/* Like/Dislike bar (hidden for owner) */}
            {!isOwner && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton
                        onClick={handleLike}
                        disabled={likeMut.isLoading || unvoteMut.isLoading}
                    >
                        <ThumbUpIcon color={userVote === true ? 'primary' : 'inherit'} />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>
                        {votes?.likes ?? 0}
                    </Typography>

                    <IconButton
                        onClick={handleDislike}
                        disabled={dislikeMut.isLoading || unvoteMut.isLoading}
                        sx={{ ml: 2 }}
                    >
                        <ThumbDownIcon color={userVote === false ? 'error' : 'inherit'} />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>
                        {votes?.dislikes ?? 0}
                    </Typography>
                </Box>
            )}

            <Box dangerouslySetInnerHTML={{ __html: post.content }} sx={{ mb: 3 }} />
            <Typography variant="subtitle2">Country: {post.country}</Typography>

            {post.images?.length > 0 && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {post.images.map(img => (
                        <Grid item xs={12} sm={6} md={4} key={img.id}>
                            <CardMedia component="img" image={img.url} alt="" />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* show delete errors */}
            {del.isError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {del.error.message}
                </Alert>
            )}
        </Container>
    );
}