import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import ComplianceQueue from '@/components/admin-interno/compliance/ComplianceQueue';

export default function AdminIntComplianceQueue() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Fila de Compliance"
        subtitle="Gerencie a fila de análise de compliance KYC/KYB"
        breadcrumbs={[
          { label: 'Admin Interno', href: '/AdminIntDashboard' },
          { label: 'KYC Compliance', href: '/AdminIntCompliance' },
          { label: 'Fila' }
        ]}
      />
      <ComplianceQueue />
    </div>
  );
}