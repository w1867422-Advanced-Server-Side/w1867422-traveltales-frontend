import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './api';

export const usePosts = (filters={}) =>
    useInfiniteQuery({
        queryKey:['posts',filters],
        queryFn:({pageParam=0})=>api.listPosts({ ...filters, offset:pageParam, limit:10 }),
        getNextPageParam:(last,all)=> last.length<10 ? undefined : all.length*10
    });

export const usePost = id =>
    useQuery({ queryKey:['post',id], queryFn:()=>api.getPost(id) });

export const useCreatePost = () =>{
    const qc = useQueryClient();
    return useMutation({ mutationFn:api.createPost,
        onSuccess:()=> qc.invalidateQueries(['posts'])
    });
};
export const useUpdatePost = id =>{
    const qc = useQueryClient();
    return useMutation({ mutationFn:data=>api.updatePost(id,data),
        onSuccess:()=> qc.invalidateQueries(['post',id])
    });
};
export const useDeletePost = id =>{
    const qc = useQueryClient();
    return useMutation({ mutationFn:()=>api.deletePost(id),
        onSuccess:()=>{
            qc.invalidateQueries(['posts']);
            qc.removeQueries(['post',id]);
        }
    });
};

// fetch vote counts
export function useVotes(postId) {
    return useQuery({
        queryKey: ['votes', postId],
        queryFn: () => api.getVotes(postId)
    });
}

// fetch my vote on this post (true/false/null)
export function useUserVote(postId) {
    return useQuery({
        queryKey: ['vote', postId],
        queryFn: () => api.getUserVote(postId)
    });
}

// like
export function useLikeMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: api.likePost,
        onSuccess: (_data, postId) => {
            qc.invalidateQueries({ queryKey: ['votes', postId] });
            qc.invalidateQueries({ queryKey: ['vote', postId] });
        }
    });
}

// dislike
export function useDislikeMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: api.dislikePost,
        onSuccess: (_data, postId) => {
            qc.invalidateQueries({ queryKey: ['votes', postId] });
            qc.invalidateQueries({ queryKey: ['vote', postId] });
        }
    });
}

// unvote
export function useUnvoteMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: api.unvotePost,
        onSuccess: (_data, postId) => {
            qc.invalidateQueries({ queryKey: ['votes', postId] });
            qc.invalidateQueries({ queryKey: ['vote', postId] });
        }
    });
}