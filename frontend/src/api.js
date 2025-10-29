import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

// Attach current role to every request for backend field-level filtering
api.interceptors.request.use((config) => {
  try {
    const role = localStorage.getItem('currentRole') || 'viewer';
    config.headers = config.headers || {};
    config.headers['X-User-Role'] = role;
  } catch (_) {
    // ignore
  }
  return config;
});

export default api;

