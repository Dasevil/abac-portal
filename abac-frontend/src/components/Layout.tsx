import { NavLink, useLocation } from 'react-router-dom'
import { Moon, Sun, Shield, Users, FileText, Settings, BookOpen, ChartPie, ListChecks } from 'lucide-react'
import { useState } from 'react'

const nav = [
  { to: '/', label: 'Dashboard', icon: ChartPie },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/employees', label: 'Employees', icon: ListChecks },
  { to: '/policies', label: 'Policies', icon: Shield },
  { to: '/audit', label: 'Audit Logs', icon: BookOpen },
  { to: '/settings', label: 'Settings', icon: Settings }
]

export function Layout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false)
  const location = useLocation()

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="flex h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50">
        <aside className="w-60 border-r border-neutral-200 dark:border-neutral-800 p-4 space-y-2">
          <div className="font-bold text-lg mb-4">ABAC Dashboard</div>
          <nav className="space-y-1">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                    isActive || location.pathname === n.to ? 'bg-neutral-100 dark:bg-neutral-800' : ''
                  }`
                }
              >
                <n.icon size={18} />
                <span>{n.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 flex flex-col">
          <header className="h-14 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4">
            <input
              placeholder="Search..."
              className="rounded-md px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 focus:outline-none text-sm"
            />
            <button
              aria-label="toggle-theme"
              className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={() => setDark((d) => !d)}
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </header>
          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}


