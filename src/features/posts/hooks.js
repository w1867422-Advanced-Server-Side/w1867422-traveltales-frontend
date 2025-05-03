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

/* get total likes/dislikes */
export const useVotes = id =>
    useQuery({ queryKey: ['votes', id], queryFn: () => api.getVotes(id) });

/* get what *I* voted (true | false | null) */
export const useUserVote = id =>
    useQuery({ queryKey: ['userVote', id], queryFn: () => api.getUserVote(id) });

/* helper to invalidate both caches */
const invalidate = (qc, id) => {
    qc.invalidateQueries(['votes', id]);
    qc.invalidateQueries(['userVote', id]);
};

/* like */
export const useLikeMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id }) => api.likePost(id),
        onSuccess : (_, { id }) => invalidate(qc, id)
    });
};

/* dislike */
export const useDislikeMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id }) => api.dislikePost(id),
        onSuccess : (_, { id }) => invalidate(qc, id)
    });
};

/* un‑vote (undo) */
export const useUnvoteMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id }) => api.unvotePost(id),
        onSuccess : (_, { id }) => invalidate(qc, id)
    });
};