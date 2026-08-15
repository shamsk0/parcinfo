import api from "./axiosConfig";

export const getAllEquipements = () => api.get("/equipements");

export const getEquipementById = (id) => api.get(`/equipements/${id}`);

export const getEquipementsByEmploye = (employeId) =>
  api.get(`/equipements/employe/${employeId}`);

// Création directement affectée à un employé
export const createEquipement = (employeId, data) =>
  api.post(`/equipements/employe/${employeId}`, data);

// Création sans affectation
export const createEquipementStandalone = (data) =>
  api.post("/equipements", data);

export const assignEquipement = (id, employeId) =>
  api.put(`/equipements/${id}/assigner/${employeId}`);

export const unassignEquipement = (id) =>
  api.put(`/equipements/${id}/desaffecter`);

export const updateEquipement = (id, data) =>
  api.put(`/equipements/${id}`, data);

export const deleteEquipement = (id) => api.delete(`/equipements/${id}`);
