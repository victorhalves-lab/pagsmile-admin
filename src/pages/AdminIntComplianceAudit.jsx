import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import AuditHistory from '@/components/admin-interno/compliance/AuditHistory';

export default function AdminIntComplianceAudit() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Auditoria"
        subtitle="Histórico completo de auditoria do processo de compliance"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'KYC Compliance', page: 'AdminIntCompliance' },
          { label: 'Auditoria' }
        ]}
      />
      <AuditHistory />
    </div>
  );
}