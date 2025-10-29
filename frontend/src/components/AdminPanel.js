import React from 'react';
import PoliciesTable from './PoliciesTable';
import IntegrationsPanel from './IntegrationsPanel';

export default function AdminPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <IntegrationsPanel />
      <PoliciesTable />
    </div>
  );
}


