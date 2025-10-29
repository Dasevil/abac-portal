import React, { useState, useEffect } from 'react';
import api from '../api';

function PoliciesTable() {
  const [policies, setPolicies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ sub: '', obj: '', act: '' });

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    const response = await api.get('/policies');
    setPolicies(response.data.policies);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/policies', formData);
      setShowForm(false);
      setFormData({ sub: '', obj: '', act: '' });
      loadPolicies();
    } catch (error) {
      alert('Error adding policy');
    }
  };

  const handleDelete = async (policy) => {
    if (window.confirm('Удалить политику?')) {
      try {
        // FastAPI DELETE может принимать JSON в теле запроса через request.json()
        await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/policies`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(policy)
        });
        loadPolicies();
      } catch (error) {
        alert('Error deleting policy');
      }
    }
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Политики Casbin</h2>
      
      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          marginBottom: '20px',
          cursor: 'pointer'
        }}
      >
        {showForm ? 'Отмена' : '➕ Добавить политику'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
          <input
            placeholder="Subject (роль)"
            value={formData.sub}
            onChange={(e) => setFormData({ ...formData, sub: e.target.value })}
            style={{ padding: '10px', margin: '5px', width: '200px' }}
          />
          <input
            placeholder="Object (ресурс)"
            value={formData.obj}
            onChange={(e) => setFormData({ ...formData, obj: e.target.value })}
            style={{ padding: '10px', margin: '5px', width: '200px' }}
          />
          <input
            placeholder="Action (действие)"
            value={formData.act}
            onChange={(e) => setFormData({ ...formData, act: e.target.value })}
            style={{ padding: '10px', margin: '5px', width: '200px' }}
          />
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', margin: '5px' }}>
            Сохранить
          </button>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Subject</th>
            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Object</th>
            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Action</th>
            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((policy, idx) => (
            <tr key={idx}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{policy.sub}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{policy.obj}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{policy.act}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <button
                  onClick={() => handleDelete(policy)}
                  style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PoliciesTable;

