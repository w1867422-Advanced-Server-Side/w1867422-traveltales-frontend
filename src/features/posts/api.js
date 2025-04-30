import apiClient from '../../api/apiClient';

export const listPosts  = (params) => apiClient.get('/posts', { params }).then(r=>r.data);
export const getPost    = (id)     => apiClient.get(`/posts/${id}`).then(r=>r.data);

export const createPost = (formData)=> apiClient.post('/posts', formData, {
    headers:{'Content-Type':'multipart/form-data'}
}).then(r=>r.data);

export const updatePost = (id,formData)=> apiClient.put(`/posts/${id}`, formData, {
    headers:{'Content-Type':'multipart/form-data'}
}).then(r=>r.data);

export const deletePost = (id)=> apiClient.delete(`/posts/${id}`).then(r=>r.data);

export const getVotes    = postId => apiClient.get(`/posts/${postId}/votes`).then(r => r.data);
export const getUserVote = postId => apiClient.get(`/posts/${postId}/vote`).then(r => r.data);

export const likePost    = postId => apiClient.post(`/posts/${postId}/like`);
export const dislikePost = postId => apiClient.post(`/posts/${postId}/dislike`);
export const unvotePost  = postId => apiClient.delete(`/posts/${postId}/vote`);