import apiClient from '../../api/apiClient';

export function listComments(postId) {
    return apiClient
        .get(`/posts/${postId}/comments`)
        .then(r => r.data);
}

export function createComment(postId, content) {
    return apiClient
        .post(`/posts/${postId}/comments`, { content })
        .then(r => r.data);
}

export function deleteComment(commentId) {
    return apiClient
        .delete(`/comments/${commentId}`)
        .then(r => r.data);
}