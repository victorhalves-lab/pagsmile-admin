import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import ManualReviewQueue from '@/components/admin-interno/compliance/ManualReviewQueue';

export default function AdminIntComplianceReview() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Análise Manual"
        subtitle="Revisão manual de submissões encaminhadas pela Helena"
        breadcrumbs={[
          { label: 'Admin Interno', href: '/AdminIntDashboard' },
          { label: 'KYC Compliance', href: '/AdminIntCompliance' },
          { label: 'Análise Manual' }
        ]}
      />
      <ManualReviewQueue />
    </div>
  );
}