import React, { useState, useEffect } from 'react';
import api from '../api';

function DocumentsTable() {
  const [documents, setDocuments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', department: 'sales', status: 'draft', sensitivity: 'public' });

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    const response = await api.get('/docs');
    setDocuments(response.data.documents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/docs', formData);
      setShowForm(false);
      setFormData({ title: '', department: 'sales', status: 'draft', sensitivity: 'public' });
      loadDocuments();
    } catch (error) {
      alert('Error creating document');
    }
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Документы</h2>
      
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
        {showForm ? 'Отмена' : '➕ Добавить документ'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
          <input
            placeholder="Название документа"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            style={{ padding: '10px', margin: '5px', width: '250px' }}
          />
          <select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            style={{ padding: '10px', margin: '5px' }}
          >
            <option value="sales">sales</option>
            <option value="engineering">engineering</option>
            <option value="hr">hr</option>
          </select>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            style={{ padding: '10px', margin: '5px' }}
          >
            <option value="draft">draft</option>
            <option value="approved">approved</option>
          </select>
          <select
            value={formData.sensitivity}
            onChange={(e) => setFormData({ ...formData, sensitivity: e.target.value })}
            style={{ padding: '10px', margin: '5px' }}
          >
            <option value="public">public</option>
            <option value="confidential">confidential</option>
          </select>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', margin: '5px' }}>
            Сохранить
          </button>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Название</th>
            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Департамент</th>
            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Статус</th>
            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Конфиденциальность</th>
          </tr>
        </thead>
        <tbody>
          {documents.map(doc => (
            <tr key={doc.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{doc.id}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{doc.title}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{doc.department}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <span style={{
                  padding: '5px 10px',
                  borderRadius: '3px',
                  backgroundColor: doc.status === 'approved' ? '#4caf50' : '#ff9800',
                  color: 'white',
                  fontSize: '12px'
                }}>
                  {doc.status}
                </span>
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{doc.sensitivity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DocumentsTable;

