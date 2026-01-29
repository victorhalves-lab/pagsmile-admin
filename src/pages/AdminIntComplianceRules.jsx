import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import RulesAndWorkflows from '@/components/admin-interno/compliance/RulesAndWorkflows';

export default function AdminIntComplianceRules() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Regras & Workflows"
        subtitle="Configure regras de automação e workflows de compliance"
        breadcrumbs={[
          { label: 'Admin Interno', href: '/AdminIntDashboard' },
          { label: 'KYC Compliance', href: '/AdminIntCompliance' },
          { label: 'Regras' }
        ]}
      />
      <RulesAndWorkflows />
    </div>
  );
}