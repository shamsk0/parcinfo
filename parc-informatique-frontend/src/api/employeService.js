import api from './axiosConfig';

export const getEmployes = () => api.get('/employes');
export const getEmployeById = (id) => api.get(`/employes/${id}`);
export const createEmploye = (data) => api.post('/employes', data);
export const updateEmploye = (id, data) => api.put(`/employes/${id}`, data);
export const deleteEmploye = (id) => api.delete(`/employes/${id}`);