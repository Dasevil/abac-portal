import React from 'react';
import api from '../api';

export default function IntegrationsPanel() {
  const [items, setItems] = React.useState([]);
  const [msg, setMsg] = React.useState(null);

  const load = async () => {
    try {
      const r = await api.get('/integrations');
      setItems(r.data?.integrations || []);
    } catch (_) {
      setItems([]);
    }
  };

  React.useEffect(() => { load(); }, []);

  const connect = async (service) => {
    setMsg(null);
    try {
      await api.post('/integrations/connect', { service });
      setMsg(`Подключено: ${service}`);
      load();
    } catch (e) {
      setMsg('Ошибка подключения');
    }
  };

  const Btn = ({ name }) => (
    <button onClick={() => connect(name)} style={{ padding: '8px 12px', marginRight: 8, background: '#1565C0', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>{name}</button>
  );

  return (
    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '12px', color: '#333' }}>Интеграции</h2>
      <div style={{ marginBottom: 12 }}>
        <Btn name="casbin" />
        <Btn name="gitlab" />
        <Btn name="mediawiki" />
      </div>
      {msg && <div style={{ marginBottom: 12, padding: '10px 12px', background: '#E8F5E9', border: '1px solid #C8E6C9', color: '#1B5E20', borderRadius: 6 }}>{msg}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: 10, textAlign: 'left', border: '1px solid #ddd' }}>Сервис</th>
            <th style={{ padding: 10, textAlign: 'left', border: '1px solid #ddd' }}>Время подключения</th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.service}>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>{it.service}</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>{it.connected_at ? new Date(it.connected_at).toLocaleString('ru-RU') : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


