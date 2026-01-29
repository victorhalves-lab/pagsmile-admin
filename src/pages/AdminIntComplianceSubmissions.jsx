import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import AllSubmissionsList from '@/components/admin-interno/compliance/AllSubmissionsList';

export default function AdminIntComplianceSubmissions() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Submissões"
        subtitle="Histórico completo de todas as submissões de compliance"
        breadcrumbs={[
          { label: 'Admin Interno', href: '/AdminIntDashboard' },
          { label: 'KYC Compliance', href: '/AdminIntCompliance' },
          { label: 'Submissões' }
        ]}
      />
      <AllSubmissionsList />
    </div>
  );
}