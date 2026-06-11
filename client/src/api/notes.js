import axios from 'axios';

const api = axios.create({ baseURL: 'https://crm-app-d0iu.onrender.com/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getNotes = (params) => api.get('/notes', { params }).then(r => r.data);
export const getNote = (id) => api.get(`/notes/${id}`).then(r => r.data);
export const createNote = (data) => api.post('/notes', data).then(r => r.data);
export const updateNote = (id, data) => api.put(`/notes/${id}`, data).then(r => r.data);
export const deleteNote = (id) => api.delete(`/notes/${id}`).then(r => r.data);
