import React, { useState, useEffect } from 'react';
import api from '../api';

function UsersTable() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ username: '', role: 'employee', department: 'sales', attributes: '{}' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const response = await api.get('/users');
    setUsers(response.data.users);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', formData);
      setShowForm(false);
      setFormData({ username: '', role: 'employee', department: 'sales', attributes: '{}' });
      loadUsers();
    } catch (error) {
      alert('Error creating user');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить пользователя?')) {
      await api.delete(`/users/${id}`);
      loadUsers();
    }
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Пользователи</h2>
      
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
        {showForm ? 'Отмена' : '➕ Добавить пользователя'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
          <input
            placeholder="Имя пользователя"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            style={{ padding: '10px', margin: '5px', width: '200px' }}
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            style={{ padding: '10px', margin: '5px' }}
          >
            <option value="admin">admin</option>
            <option value="manager">manager</option>
            <option value="employee">employee</option>
            <option value="viewer">viewer</option>
          </select>
          <select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            style={{ padding: '10px', margin: '5px' }}
          >
            <option value="sales">sales</option>
            <option value="engineering">engineering</option>
            <option value="hr">hr</option>
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
            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Имя</th>
            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Роль</th>
            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Департамент</th>
            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.id}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.username}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.role}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.department}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <button
                  onClick={() => handleDelete(user.id)}
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

export default UsersTable;

