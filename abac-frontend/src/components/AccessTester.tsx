import { useState } from 'react'
import { api } from '../api/client'

export default function AccessTester() {
  const [role, setRole] = useState('manager')
  const [dept, setDept] = useState('sales')
  const [action, setAction] = useState('read')
  const [docId, setDocId] = useState(1)
  const [result, setResult] = useState<string | null>(null)
  const [explain, setExplain] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const onTest = async () => {
    setLoading(true)
    setResult(null)
    setExplain(null)
    try {
      const { data } = await api.post('/auth', {
        user_role: role,
        user_department: dept,
        action,
        document_id: docId
      })
      setResult(data?.allowed ? 'ALLOW ✅' : 'DENY ❌')
      if (data?.explain) setExplain(data.explain)
    } catch (e: any) {
      const msg = e?.response?.data?.detail || e?.message || 'Error testing access'
      setResult(String(msg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <input className="px-3 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800" value={role} onChange={(e) => setRole(e.target.value)} placeholder="role" />
        <input className="px-3 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800" value={dept} onChange={(e) => setDept(e.target.value)} placeholder="department" />
        <input className="px-3 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800" value={action} onChange={(e) => setAction(e.target.value)} placeholder="action" />
        <input className="px-3 py-2 rounded-md bg-neutral-100 dark:bg-neutral-800" value={docId} onChange={(e) => setDocId(Number(e.target.value) || 0)} placeholder="document id" />
      </div>
      <button className="px-4 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" onClick={onTest} disabled={loading}>
        {loading ? 'Testing…' : 'Test Access'}
      </button>
      {result && <div className="text-sm">{result}</div>}
      {explain && (
        <div className="text-xs opacity-80">
          Matched policy: <code>{JSON.stringify(explain)}</code>
        </div>
      )}
    </div>
  )
}


