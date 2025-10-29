import { useEffect, useState } from 'react'
import { api } from '../api/client'

export default function Settings() {
  const [health, setHealth] = useState<string>('unknown')
  useEffect(() => {
    api
      .get('/logs')
      .then(() => setHealth('ok'))
      .catch(() => setHealth('unreachable'))
  }, [])
  return (
    <div className="p-6 space-y-3">
      <div>API URL: {import.meta.env.VITE_API_URL || 'http://localhost:5000'}</div>
      <div>Enforce path: {import.meta.env.VITE_ENFORCE_PATH || '/auth'}</div>
      <div>Backend health: {health}</div>
    </div>
  )
}


