import { Link, Outlet, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Documents from './pages/Documents'
import Employees from './pages/Employees'
import Policies from './pages/Policies'
import AuditLogs from './pages/AuditLogs'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/audit" element={<AuditLogs />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<div className="p-6">Not Found</div>} />
      </Routes>
      <Outlet />
    </Layout>
  )
}


