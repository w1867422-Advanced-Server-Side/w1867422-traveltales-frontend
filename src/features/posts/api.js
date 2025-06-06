import apiClient from '../../api/apiClient';

export const listPosts = ({
                              search   = '',
                              type     = 'title',        // title | author | country
                              country  = '',
                              author   = '',
                              sortBy   = 'newest',       // newest | likes | comments
                              limit    = 10,
                              offset   = 0,
                          } = {}) =>
    apiClient
        .get('/posts', {
            params: { search, type, country, author, sortBy, limit, offset }
        })
        .then(r => r.data);

export const getPost    = (id)     => apiClient.get(`/posts/${id}`).then(r=>r.data);

export const createPost = (formData)=> apiClient.post('/posts', formData, {
    headers:{'Content-Type':'multipart/form-data'}
}).then(r=>r.data);

export const updatePost = (id,formData)=> apiClient.put(`/posts/${id}`, formData, {
    headers:{'Content-Type':'multipart/form-data'}
}).then(r=>r.data);

export const deletePost = (id)=> apiClient.delete(`/posts/${id}`).then(r=>r.data);

export const getVotes     = id => apiClient.get(`/posts/${id}/votes`).then(r => r.data);          // { likes, dislikes }
export const getUserVote  = id => apiClient.get(`/posts/${id}/vote`).then(r => r.data.vote);      // true | false | null
export const likePost     = id => apiClient.post(`/posts/${id}/like`);
export const dislikePost  = id => apiClient.post(`/posts/${id}/dislike`);
export const unvotePost   = id => apiClient.delete(`/posts/${id}/vote`);

export const fetchFeed = ({
                              limit  = 10,
                              offset = 0,
                              sortBy = 'newest',
                              search = '',
                              type   = 'title'
                          } = {}) =>
    apiClient
        .get('/posts/feed', { params: { limit, offset, sortBy, search, type } })
        .then(r => r.data);