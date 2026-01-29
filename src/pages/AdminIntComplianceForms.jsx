import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import QuestionnaireManager from '@/components/admin-interno/compliance/QuestionnaireManager';

export default function AdminIntComplianceForms() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestão de Formulários"
        subtitle="Gerencie os questionários de compliance KYC/KYB"
        breadcrumbs={[
          { label: 'Admin Interno', href: '/AdminIntDashboard' },
          { label: 'KYC Compliance', href: '/AdminIntCompliance' },
          { label: 'Formulários' }
        ]}
      />
      <QuestionnaireManager />
    </div>
  );
}