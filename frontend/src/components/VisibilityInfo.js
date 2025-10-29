import React from 'react';
import { columnVisibility } from '../visibilityConfig';

function Pill({ label }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 10px',
      margin: '2px',
      backgroundColor: '#E3F2FD',
      color: '#1565C0',
      borderRadius: '999px',
      fontSize: '12px',
      border: '1px solid #90CAF9'
    }}>{label}</span>
  );
}

export default function VisibilityInfo({ currentRole }) {
  const role = currentRole || 'viewer';
  const usersCols = columnVisibility.users[role] || [];
  const docsCols = columnVisibility.documents[role] || [];

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '16px',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '16px'
    }}>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>Поля таблицы Пользователи для роли “{role}”:</div>
          <div>
            {usersCols.length ? usersCols.map(c => <Pill key={`u-${c}`} label={c} />) : <span style={{ color: '#777' }}>нет полей</span>}
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>Поля таблицы Документы для роли “{role}”:</div>
          <div>
            {docsCols.length ? docsCols.map(c => <Pill key={`d-${c}`} label={c} />) : <span style={{ color: '#777' }}>нет полей</span>}
          </div>
        </div>
      </div>
    </div>
  );
}


