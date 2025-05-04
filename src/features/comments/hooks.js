import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './api';

export function useComments(postId) {
    return useQuery({
        queryKey: ['comments', postId],
        queryFn: () => api.listComments(postId),
        staleTime: 30_000,
    });
}

export function useAddComment(postId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: content => api.createComment(postId, content),
        onSuccess: () => {
            // invalidate the comments cache so it refetches
            qc.invalidateQueries({ queryKey: ['comments', postId] });
        },
    });
}

export function useDeleteComment(postId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: commentId => api.deleteComment(commentId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['comments', postId] });
        },
    });
}