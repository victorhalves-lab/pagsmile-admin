import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import OpenFinanceLiveMap from '@/components/open-finance/OpenFinanceLiveMap';

export default function AdminIntOpenFinanceLiveMap() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Open Finance · Live Map"
        subtitle="Monitoramento em tempo real de jornadas, saúde de conexão e roteamento por banco"
        breadcrumbs={[{ label: 'Admin Interno' }, { label: 'Open Finance Live Map' }]}
      />
      <OpenFinanceLiveMap />
    </div>
  );
}