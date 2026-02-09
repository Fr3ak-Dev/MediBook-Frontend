import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5154/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const pacientesAPI = {
    getAll: () => api.get('/Pacientes'),
    getById: (id) => api.get(`/Pacientes/${id}`),
    create: (data) => api.post('/Pacientes', data),
    update: (id, data) => api.put(`/Pacientes/${id}`, data),
    delete: (id) => api.delete(`/Pacientes/${id}`),
};

export const medicosAPI = {
    getAll: () => api.get('/Medicos'),
    getById: (id) => api.get(`/Medicos/${id}`),
    create: (data) => api.post('/Medicos', data),
    update: (id, data) => api.put(`/Medicos/${id}`, data),
    delete: (id) => api.delete(`/Medicos/${id}`),
};

export const especialidadesAPI = {
    getAll: () => api.get('/Especialidades'),
    getById: (id) => api.get(`/Especialidades/${id}`),
    create: (data) => api.post('/Especialidades', data),
    update: (id, data) => api.put(`/Especialidades/${id}`, data),
    delete: (id) => api.delete(`/Especialidades/${id}`),
};

export const citasAPI = {
    getAll: () => api.get('/Citas'),
    getById: (id) => api.get(`/Citas/${id}`),
    create: (data) => api.post('/Citas', data),
    update: (id, data) => api.put(`/Citas/${id}`, data),
    delete: (id) => api.delete(`/Citas/${id}`),
};

export default api;