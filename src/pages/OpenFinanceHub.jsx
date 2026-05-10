import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import OpenFinanceHubDashboard from '@/components/open-finance/OpenFinanceHubDashboard';

export default function OpenFinanceHub() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Open Finance Hub"
        subtitle="Centralize seus consentimentos, conexões com bancos e jornadas de PIX via Open Finance"
        breadcrumbs={[{ label: 'Open Finance' }]}
      />
      <OpenFinanceHubDashboard />
    </div>
  );
}