import React, { useState, useEffect } from 'react';
import api from '../api';
import { columnVisibility } from '../visibilityConfig';

function DocumentsTable({ currentRole = 'admin' }) {
  const [documents, setDocuments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', department: 'sales', status: 'draft', sensitivity: 'public' });
  const [statusMsg, setStatusMsg] = useState(null);
  const [statusType, setStatusType] = useState('info'); // 'success' | 'error' | 'info'
  const [addPolicy, setAddPolicy] = useState(false);
  const [policyRole, setPolicyRole] = useState('manager');
  const [policyAction, setPolicyAction] = useState('read');
  const defaultPolicyWindow = { start: '08:00', end: '20:00' };

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await api.get('/documents');
      let docs = [];
      if (response && response.data && response.data.documents != null) {
        const payload = response.data.documents;
        if (Array.isArray(payload)) {
          docs = payload;
        } else if (typeof payload === 'object') {
          docs = Object.values(payload);
        }
      }
      setDocuments(docs);
    } catch (err) {
      console.error('Error loading documents:', err);
      setDocuments([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title.trim()) {
        setStatusType('error');
        setStatusMsg('Укажите название документа');
        return;
      }
      const createResp = await api.post('/documents', formData);
      setShowForm(false);
      setFormData({ title: '', department: 'sales', status: 'draft', sensitivity: 'public' });
      setStatusType('success');
      setStatusMsg('Документ создан');
      // optionally add policy bound to dept/status of this doc
      if (addPolicy) {
        try {
          await api.post('/policies', {
            sub: policyRole,
            dept: formData.department,
            status: formData.status,
            act: policyAction,
            res: 'documents',
            start: defaultPolicyWindow.start,
            end: defaultPolicyWindow.end
          });
        } catch (e) {
          console.warn('Policy create failed', e);
        }
      }
      loadDocuments();
    } catch (error) {
      const msg = (error && error.response && error.response.data && (error.response.data.detail || error.response.data.message)) || 'Ошибка при создании документа';
      setStatusType('error');
      setStatusMsg(msg);
    }
  };

  const visible = columnVisibility.documents[currentRole] || columnVisibility.documents.viewer;

  return (
    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Документы</h2>
      {statusMsg && (
        <div style={{
          marginBottom: '16px',
          padding: '12px 14px',
          borderRadius: '6px',
          color: statusType === 'error' ? '#b71c1c' : statusType === 'success' ? '#1b5e20' : '#0d47a1',
          backgroundColor: statusType === 'error' ? '#ffebee' : statusType === 'success' ? '#e8f5e9' : '#e3f2fd',
          border: '1px solid ' + (statusType === 'error' ? '#ffcdd2' : statusType === 'success' ? '#c8e6c9' : '#90caf9')
        }}>
          {statusMsg}
        </div>
      )}

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

      <button
        onClick={loadDocuments}
        style={{
          padding: '10px 14px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          marginLeft: '10px',
          marginBottom: '20px',
          cursor: 'pointer'
        }}
      >
        Обновить
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

          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed #ccc' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={addPolicy} onChange={(e) => setAddPolicy(e.target.checked)} />
              <span>Сразу добавить правило доступа для этого документа</span>
            </label>
            {addPolicy && (
              <div style={{ marginTop: 8 }}>
                <select value={policyRole} onChange={(e) => setPolicyRole(e.target.value)} style={{ padding: '8px 10px', marginRight: 8 }}>
                  <option value="admin">admin</option>
                  <option value="manager">manager</option>
                  <option value="accountant">accountant</option>
                  <option value="analyst">analyst</option>
                  <option value="employee">employee</option>
                  <option value="viewer">viewer</option>
                </select>
                <select value={policyAction} onChange={(e) => setPolicyAction(e.target.value)} style={{ padding: '8px 10px' }}>
                  <option value="read">read</option>
                </select>
              </div>
            )}
          </div>

          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', margin: '5px' }}>
            Сохранить
          </button>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            {visible.includes('id') && (
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>ID</th>
            )}
            {visible.includes('title') && (
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Название</th>
            )}
            {visible.includes('department') && (
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Департамент</th>
            )}
            {visible.includes('status') && (
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Статус</th>
            )}
            {visible.includes('sensitivity') && (
              <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Конфиденциальность</th>
            )}
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(documents) ? documents : []).map(doc => (
            <tr key={doc.id}>
              {visible.includes('id') && (
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{doc.id}</td>
              )}
              {visible.includes('title') && (
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{doc.title}</td>
              )}
              {visible.includes('department') && (
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{doc.department}</td>
              )}
              {visible.includes('status') && (
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
              )}
              {visible.includes('sensitivity') && (
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{doc.sensitivity}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DocumentsTable;

