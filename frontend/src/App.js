import React, { useState } from 'react';
import AccessTester from './components/AccessTester';
import UsersTable from './components/UsersTable';
import DocumentsTable from './components/DocumentsTable';
import PoliciesTable from './components/PoliciesTable';
import LogsViewer from './components/LogsViewer';

function App() {
  const [activeTab, setActiveTab] = useState('test');

  const tabs = [
    { id: 'test', label: '🔑 Тест ABAC' },
    { id: 'users', label: '🧑 Пользователи' },
    { id: 'docs', label: '📄 Документы' },
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
      </header>

      <main style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
        {activeTab === 'test' && <AccessTester />}
        {activeTab === 'users' && <UsersTable />}
        {activeTab === 'docs' && <DocumentsTable />}
        {activeTab === 'policies' && <PoliciesTable />}
        {activeTab === 'logs' && <LogsViewer />}
      </main>
    </div>
  );
}

export default App;

