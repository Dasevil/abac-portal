import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { listDocuments } from '../api/documents'
import AccessTester from '../components/AccessTester'

export default function Documents() {
  const [roleHeader, setRoleHeader] = useState('admin')
  const docs = useFetch(['documents', roleHeader], () => listDocuments(roleHeader))

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm">Header X-User-Role:</label>
        <input className="px-3 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800" value={roleHeader} onChange={(e) => setRoleHeader(e.target.value)} />
      </div>
      <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 dark:bg-neutral-800">
            <tr>
              <th className="text-left p-3">id</th>
              <th className="text-left p-3">title</th>
              <th className="text-left p-3">department</th>
              <th className="text-left p-3">status</th>
              <th className="text-left p-3">sensitivity</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(docs.data) && docs.data.length > 0 ? (
              docs.data.map((d: any) => (
                <tr key={d.id ?? d.title} className="border-t border-neutral-200 dark:border-neutral-800">
                  <td className="p-3">{d.id ?? '-'}</td>
                  <td className="p-3">{d.title}</td>
                  <td className="p-3">{d.department ?? '-'}</td>
                  <td className="p-3">{d.status ?? '-'}</td>
                  <td className="p-3">{d.sensitivity ?? '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3" colSpan={5}>{docs.isLoading ? 'Loading…' : 'No data'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-2">
        <h2 className="font-semibold">Test Access</h2>
        <AccessTester />
      </div>
    </div>
  )
}


