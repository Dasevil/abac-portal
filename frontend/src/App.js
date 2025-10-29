import React, { useState, useEffect } from 'react';
import AccessTester from './components/AccessTester';
import UsersTable from './components/UsersTable';
import DocumentsTable from './components/DocumentsTable';
import PoliciesTable from './components/PoliciesTable';
import LogsViewer from './components/LogsViewer';
import VisibilityInfo from './components/VisibilityInfo';
import TablesAccess from './components/TablesAccess';
import IntegrationsPanel from './components/IntegrationsPanel';
import AdminPanel from './components/AdminPanel';

function App() {
  const [activeTab, setActiveTab] = useState('test');
  const [currentRole, setCurrentRole] = useState(() => localStorage.getItem('currentRole') || 'admin');

  useEffect(() => {
    localStorage.setItem('currentRole', currentRole);
  }, [currentRole]);

  const tabs = [
    { id: 'test', label: '🔑 Тест ABAC' },
    { id: 'users', label: '🧑 Пользователи' },
    { id: 'docs', label: '📄 Документы' },
    { id: 'tables', label: '📚 Таблицы' },
    { id: 'integrations', label: '🔌 Интеграции' },
    { id: 'admin', label: '🛠️ Админка' },
    { id: 'policies', label: '⚙️ Политики' },
    { id: 'logs', label: '📊 Логи' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <header style={{ 
        backgroundColor: '#2196F3', 
        color: 'white', 
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ marginBottom: '20px' }}>ABAC Portal - Attribute-Based Access Control</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <nav style={{ display: 'flex', gap: '10px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.2)',
                color: activeTab === tab.id ? '#2196F3' : '#fff',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              {tab.label}
            </button>
          ))}
          </nav>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 'bold' }}>Текущая роль:</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              style={{ padding: '8px 10px', borderRadius: '5px', border: 'none', color: '#2196F3' }}
            >
              <option value="admin">admin</option>
              <option value="manager">manager</option>
              <option value="accountant">accountant</option>
              <option value="analyst">analyst</option>
              <option value="employee">employee</option>
              <option value="viewer">viewer</option>
            </select>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
        <VisibilityInfo currentRole={currentRole} />
        {activeTab === 'test' && <AccessTester />}
        {activeTab === 'users' && <UsersTable currentRole={currentRole} />}
        {activeTab === 'docs' && <DocumentsTable currentRole={currentRole} />}
        {activeTab === 'tables' && <TablesAccess currentRole={currentRole} />}
        {activeTab === 'integrations' && <IntegrationsPanel />}
        {activeTab === 'admin' && <AdminPanel />}
        {activeTab === 'policies' && <PoliciesTable />}
        {activeTab === 'logs' && <LogsViewer />}
      </main>
    </div>
  );
}

export default App;

