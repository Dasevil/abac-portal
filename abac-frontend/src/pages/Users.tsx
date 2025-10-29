import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { listUsers } from '../api/users'

export default function Users() {
  const [roleHeader, setRoleHeader] = useState('admin')
  const users = useFetch(['users', roleHeader], () => listUsers(roleHeader))

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
              <th className="text-left p-3">username</th>
              <th className="text-left p-3">role</th>
              <th className="text-left p-3">department</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users.data) && users.data.length > 0 ? (
              users.data.map((u: any) => (
                <tr key={u.id ?? u.username} className="border-t border-neutral-200 dark:border-neutral-800">
                  <td className="p-3">{u.id ?? '-'}</td>
                  <td className="p-3">{u.username}</td>
                  <td className="p-3">{u.role ?? '-'}</td>
                  <td className="p-3">{u.department}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3" colSpan={4}>{users.isLoading ? 'Loading…' : 'No data'}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


