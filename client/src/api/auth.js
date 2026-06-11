import axios from 'axios';

const api = axios.create({ baseURL: 'https://crm-app-d0iu.onrender.com/api' });

export const register = (data) => api.post('/auth/register', data).then(r => r.data);
export const login = (data) => api.post('/auth/login', data).then(r => r.data);