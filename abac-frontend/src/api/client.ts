import axios from 'axios'

// Prefer relative /api for nginx proxy; fallback to VITE_API_URL or backend port
const baseURL = (typeof window !== 'undefined' ? '/api' : '') || (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000'

export const api = axios.create({ baseURL })

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // normalize error
    return Promise.reject(err)
  }
)

export const ENFORCE_PATH = import.meta.env.VITE_ENFORCE_PATH || '/auth'


