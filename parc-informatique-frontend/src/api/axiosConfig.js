import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');

const api = axios.create({
  // VITE_API_URL peut désigner la racine du serveur ou déjà inclure /api.
  // Dans les deux cas, les requêtes doivent viser une seule fois le préfixe.
  baseURL: configuredApiUrl
    ? configuredApiUrl.endsWith('/api')
      ? configuredApiUrl
      : `${configuredApiUrl}/api`
    : 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
