import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('habitflow_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('habitflow_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authService = {
  register: (datos) => api.post('/auth/register', datos),
  login: (datos) => api.post('/auth/login', datos),
  perfil: () => api.get('/auth/perfil'),
};

export const habitService = {
  listar: () => api.get('/habits'),
  crear: (datos) => api.post('/habits', datos),
  actualizar: (id, datos) => api.put(`/habits/${id}`, datos),
  eliminar: (id) => api.delete(`/habits/${id}`),
};
