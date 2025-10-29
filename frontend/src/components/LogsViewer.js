import React, { useState, useEffect } from 'react';
import api from '../api';

function LogsViewer() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadLogs = async () => {
    try {
      const response = await api.get('/logs');
      setLogs(response.data.logs);
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Логи доступа</h2>
      <p style={{ marginBottom: '20px', color: '#666' }}>Последние 100 записей (автообновление каждые 3 секунды)</p>
      
      <div style={{ maxHeight: '600px', overflowY: 'auto', border: '1px solid #ddd' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f5f5f5' }}>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>ID</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Действие</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Ресурс</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Решение</th>
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Время</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{log.id}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{log.action}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{log.resource}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <span style={{
                    padding: '5px 10px',
                    borderRadius: '3px',
                    backgroundColor: log.decision ? '#4caf50' : '#f44336',
                    color: 'white',
                    fontSize: '12px'
                  }}>
                    {log.decision ? '✅ Granted' : '❌ Denied'}
                  </span>
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {new Date(log.timestamp).toLocaleString('ru-RU')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LogsViewer;

