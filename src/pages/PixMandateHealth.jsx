import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import PixMandateHealthDashboard from '@/components/transactions/pix/PixMandateHealthDashboard.jsx';

export default function PixMandateHealth() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="PIX Automático · Saúde de Mandatos"
        subtitle="Acompanhe seus consentimentos recorrentes, cobranças automáticas, revocações e churn de mandato"
        breadcrumbs={[
          { label: 'Transações', page: 'Transactions' },
          { label: 'PIX', page: 'PixTransactions' },
          { label: 'PIX Automático' },
        ]}
      />
      <PixMandateHealthDashboard />
    </div>
  );
}