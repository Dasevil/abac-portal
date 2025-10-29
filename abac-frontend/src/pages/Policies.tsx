import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPolicies, reloadPolicies } from '../api/policies'

export default function Policies() {
  const [error, setError] = useState<string | null>(null)
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['policies'],
    queryFn: async () => {
      try {
        setError(null)
        return await getPolicies()
      } catch (e) {
        setError('Failed to load policies')
        return []
      }
    },
    refetchOnWindowFocus: true,
    staleTime: 0
  })
  return (
    <div className="p-6 space-y-4">
      <h2 className="font-semibold">Casbin Policies</h2>
      <div className="flex items-center gap-3">
        <button className="px-3 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" onClick={() => refetch()}>
          Reload cache
        </button>
        <button
          className="px-3 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800"
          onClick={async () => {
            await reloadPolicies()
            await refetch()
          }}
        >
          Reload backend policies
        </button>
        {isLoading && <span className="text-sm opacity-70">Loading…</span>}
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 dark:bg-neutral-800">
            <tr>
              <th className="text-left p-3">sub</th>
              <th className="text-left p-3">dept</th>
              <th className="text-left p-3">status</th>
              <th className="text-left p-3">act</th>
              <th className="text-left p-3">res</th>
              <th className="text-left p-3">start</th>
              <th className="text-left p-3">end</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((p, i) => (
                <tr key={i} className="border-t border-neutral-200 dark:border-neutral-800">
                  <td className="p-3">{p.sub}</td>
                  <td className="p-3">{p.dept}</td>
                  <td className="p-3">{p.status}</td>
                  <td className="p-3">{p.act}</td>
                  <td className="p-3">{p.res}</td>
                  <td className="p-3">{p.start}</td>
                  <td className="p-3">{p.end}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3" colSpan={7}>No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


