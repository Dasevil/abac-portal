import { useEffect, useState } from 'react'
import { enforceWeb } from '../api/enforce'

export default function Employees() {
  const rows = [
    { name: 'John Doe', department: 'sales', salary: 90000, email: 'john@example.com', sensitivity: 'confidential' },
    { name: 'Alice', department: 'engineering', salary: 120000, email: 'alice@example.com', sensitivity: 'confidential' }
  ]
  const [role, setRole] = useState<string>('viewer')
  const [canSalary, setCanSalary] = useState<boolean>(false)
  const [canEmail, setCanEmail] = useState<boolean>(false)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const [{ allowed: s }, { allowed: e }] = await Promise.all([
          enforceWeb({ user_role: role, action: 'view', service: 'salary' }),
          enforceWeb({ user_role: role, action: 'view', service: 'email' })
        ])
        if (!cancelled) {
          setCanSalary(s)
          setCanEmail(e)
        }
      } catch {
        if (!cancelled) {
          setCanSalary(false)
          setCanEmail(false)
        }
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [role])

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm">Simulated role:</label>
        <select className="px-3 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="manager">manager</option>
          <option value="admin">admin</option>
          <option value="user">user</option>
          <option value="viewer">viewer</option>
        </select>
        <div className="text-sm opacity-70">Salary: {String(canSalary)} | Email: {String(canEmail)}</div>
      </div>
      <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 dark:bg-neutral-800">
            <tr>
              <th className="text-left p-3">name</th>
              <th className="text-left p-3">department</th>
              <th className="text-left p-3">salary</th>
              <th className="text-left p-3">email</th>
              <th className="text-left p-3">sensitivity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.email} className="border-t border-neutral-200 dark:border-neutral-800">
                <td className="p-3">{r.name}</td>
                <td className="p-3">{r.department}</td>
                <td className="p-3">{canSalary ? r.salary : 'hidden'}</td>
                <td className="p-3">{canEmail ? r.email : 'hidden'}</td>
                <td className="p-3">{r.sensitivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


