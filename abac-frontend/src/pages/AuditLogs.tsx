import { useEffect, useState } from 'react'
import { api } from '../api/client'

export default function AuditLogs() {
  const [rows, setRows] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    api
      .get('/logs')
      .then((r) => setRows(r.data?.logs ?? []))
      .catch(() => setError('Failed to load logs'))
  }, [])
  return (
    <div className="p-6 space-y-4">
      <h2 className="font-semibold">Audit Logs</h2>
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 dark:bg-neutral-800">
            <tr>
              <th className="text-left p-3">timestamp</th>
              <th className="text-left p-3">action</th>
              <th className="text-left p-3">resource</th>
              <th className="text-left p-3">decision</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(rows) && rows.length > 0 ? (
              rows.map((r, i) => (
                <tr key={i} className="border-t border-neutral-200 dark:border-neutral-800">
                  <td className="p-3">{r.timestamp}</td>
                  <td className="p-3">{r.action}</td>
                  <td className="p-3">{r.resource}</td>
                  <td className="p-3">{String(r.decision)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3" colSpan={4}>No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )}


