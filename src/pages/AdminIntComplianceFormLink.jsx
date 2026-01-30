import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import FormLinkGenerator from '@/components/admin-interno/compliance/FormLinkGenerator';

export default function AdminIntComplianceFormLink() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Link do Formulário"
        subtitle="Gere e compartilhe links para formulários de compliance"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'KYC Compliance', page: 'AdminIntCompliance' },
          { label: 'Link do Formulário' }
        ]}
      />
      <FormLinkGenerator />
    </div>
  );
}