import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import PixBiometricInsightsDashboard from '@/components/transactions/pix/PixBiometricInsightsDashboard';

export default function PixBiometricInsights() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="PIX Biometria · Insights"
        subtitle="Conversão, latência e qualidade da jornada Open Finance (sem redirect)"
        breadcrumbs={[
          { label: 'Transações', page: 'Transactions' },
          { label: 'PIX', page: 'PixTransactions' },
          { label: 'PIX Biometria' },
        ]}
      />
      <PixBiometricInsightsDashboard />
    </div>
  );
}