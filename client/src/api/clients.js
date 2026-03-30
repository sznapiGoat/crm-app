import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getClients = (params) => api.get('/clients', { params }).then(r => r.data);
export const getClient = (id) => api.get(`/clients/${id}`).then(r => r.data);
export const getStats = () => api.get('/clients/stats').then(r => r.data);
export const createClient = (data) => api.post('/clients', data).then(r => r.data);
export const updateClient = (id, data) => api.put(`/clients/${id}`, data).then(r => r.data);
export const deleteClient = (id) => api.delete(`/clients/${id}`).then(r => r.data);
