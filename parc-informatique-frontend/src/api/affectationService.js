import api from "./axiosConfig";

// Historique des affectations d'un équipement (tous les employés qui l'ont utilisé)
export const getHistoriqueEquipement = (equipementId) =>
  api.get(`/affectations/equipement/${equipementId}`);

// Historique des affectations d'un employé (tous les équipements qu'il a utilisés)
export const getHistoriqueEmploye = (employeId) =>
  api.get(`/affectations/employe/${employeId}`);
