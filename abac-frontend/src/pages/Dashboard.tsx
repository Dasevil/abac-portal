import { useFetch } from '../hooks/useFetch'
import { listUsers } from '../api/users'
import { listDocuments } from '../api/documents'
import AccessTester from '../components/AccessTester'

export default function Dashboard() {
  const users = useFetch(['users-count'], async () => (await listUsers()).length)
  const docs = useFetch(['docs-count'], async () => (await listDocuments()).length)

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="Users" value={users.data ?? 0} loading={users.isLoading} />
        <Stat title="Documents" value={docs.data ?? 0} loading={docs.isLoading} />
      </div>
      <section className="space-y-2">
        <h2 className="font-semibold">Access Tester</h2>
        <AccessTester />
      </section>
    </div>
  )
}

function Stat({ title, value, loading }: { title: string; value: number; loading: boolean }) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
      <div className="text-sm opacity-70">{title}</div>
      <div className="text-2xl font-semibold">{loading ? '…' : value}</div>
    </div>
  )
}


