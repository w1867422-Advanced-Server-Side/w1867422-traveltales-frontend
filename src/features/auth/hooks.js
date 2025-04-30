import { useContext } from 'react';
import { AuthContext } from './AuthProvider.jsx';
import * as api from './api';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

export const useAuth = () => useContext(AuthContext);

// list of who I follow
export function useFollowing() {
    return useQuery({
        queryKey: ['following'],
        queryFn: api.getFollowing
    });
}

// follow someone
export function useFollowMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: api.followUser,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['following'] })
    });
}

// unfollow someone
export function useUnfollowMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: api.unfollowUser,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['following'] })
    });
}