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
