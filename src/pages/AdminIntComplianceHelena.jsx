import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import HelenaTraining from '@/components/admin-interno/compliance/HelenaTraining';

export default function AdminIntComplianceHelena() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Helena IA"
        subtitle="Treinamento e configuração da Helena, nossa IA de Compliance"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'KYC Compliance', page: 'AdminIntCompliance' },
          { label: 'Helena IA' }
        ]}
      />
      <HelenaTraining />
    </div>
  );
}