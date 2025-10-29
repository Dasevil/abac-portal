import React from 'react';
import { columnVisibility } from '../visibilityConfig';
import api from '../api';

export default function TablesAccess({ currentRole = 'viewer' }) {
  const usersCols = columnVisibility.users[currentRole] || [];
  const docsCols = columnVisibility.documents[currentRole] || [];
  const [usersCount, setUsersCount] = React.useState(null);
  const [docsCount, setDocsCount] = React.useState(null);
  const [msg, setMsg] = React.useState(null);

  const testFetch = async () => {
    setMsg(null);
    try {
      const [u, d] = await Promise.all([
        api.get('/users'),
        api.get('/documents')
      ]);
      setUsersCount(Array.isArray(u.data?.users) ? u.data.users.length : 0);
      setDocsCount(Array.isArray(d.data?.documents) ? d.data.documents.length : 0);
      setMsg('Доступ к таблицам есть, данные получены');
    } catch (e) {
      setMsg('Нет доступа или ошибка запроса');
    }
  };

  const Pill = ({ label }) => (
    <span style={{
      display: 'inline-block', padding: '4px 10px', margin: '2px',
      backgroundColor: '#EDE7F6', color: '#4527A0', borderRadius: '999px',
      fontSize: '12px', border: '1px solid #B39DDB'
    }}>{label}</span>
  );

  return (
    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '12px', color: '#333' }}>Доступ к таблицам</h2>
      <p style={{ marginTop: 0, color: '#666' }}>Роль: <b>{currentRole}</b></p>
      {msg && (
        <div style={{ marginBottom: 12, padding: '10px 12px', background: '#E3F2FD', border: '1px solid #90CAF9', color: '#0D47A1', borderRadius: 6 }}>{msg}</div>
      )}
      <button onClick={testFetch} style={{ padding: '10px 14px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: 16 }}>Проверить доступ</button>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 6 }}>Поля: Пользователи</div>
          <div>{usersCols.map(c => <Pill key={`u-${c}`} label={c} />)}</div>
          {usersCount != null && <div style={{ marginTop: 6, color: '#666' }}>Записей доступно: {usersCount}</div>}
        </div>
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 6 }}>Поля: Документы</div>
          <div>{docsCols.map(c => <Pill key={`d-${c}`} label={c} />)}</div>
          {docsCount != null && <div style={{ marginTop: 6, color: '#666' }}>Записей доступно: {docsCount}</div>}
        </div>
      </div>
    </div>
  );
}


