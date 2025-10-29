import React, { useState } from 'react';
import api from '../api';

function AccessTester() {
  const [userRole, setUserRole] = useState('manager');
  const [userDepartment, setUserDepartment] = useState('sales');
  const [action, setAction] = useState('read');
  const [documentId, setDocumentId] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAccess = async () => {
    setLoading(true);
    try {
      const response = await api.post('/auth', {
        user_role: userRole,
        user_department: userDepartment,
        action: action,
        document_id: documentId
      });
      setResult(response.data);
    } catch (error) {
      setResult({ 
        allowed: false, 
        reason: 'Error: ' + (error.response?.data?.detail || error.message)
      });
    }
    setLoading(false);
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Тест доступа</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Роль пользователя:
          </label>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          >
            <option value="admin">admin</option>
            <option value="manager">manager</option>
            <option value="employee">employee</option>
            <option value="viewer">viewer</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Департамент:
          </label>
          <select
            value={userDepartment}
            onChange={(e) => setUserDepartment(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          >
            <option value="sales">sales</option>
            <option value="engineering">engineering</option>
            <option value="hr">hr</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Действие:
          </label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          >
            <option value="read">read</option>
            <option value="write">write</option>
            <option value="edit">edit</option>
            <option value="delete">delete</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            ID документа:
          </label>
          <input
            type="number"
            value={documentId}
            onChange={(e) => setDocumentId(parseInt(e.target.value))}
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          />
        </div>

        <button
          onClick={testAccess}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Проверка...' : 'Проверить доступ'}
        </button>
      </div>

      {result && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: result.allowed ? '#e8f5e9' : '#ffebee',
          borderRadius: '5px',
          border: `2px solid ${result.allowed ? '#4caf50' : '#f44336'}`,
          color: '#333'
        }}>
          <h3 style={{ marginBottom: '10px' }}>
            Результат: {result.allowed ? '✅ Доступ разрешен' : '❌ Доступ запрещен'}
          </h3>
          <p><strong>Причина:</strong> {result.reason}</p>
          {result.document && (
            <p style={{ marginTop: '10px' }}>
              <strong>Документ:</strong> {result.document.title} (Department: {result.document.department}, Status: {result.document.status})
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default AccessTester;

