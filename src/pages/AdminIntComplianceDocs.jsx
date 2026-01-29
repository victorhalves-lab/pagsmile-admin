import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import DocumentsRepository from '@/components/admin-interno/compliance/DocumentsRepository';

export default function AdminIntComplianceDocs() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Documentos"
        subtitle="Repositório de documentos enviados pelos clientes"
        breadcrumbs={[
          { label: 'Admin Interno', href: '/AdminIntDashboard' },
          { label: 'KYC Compliance', href: '/AdminIntCompliance' },
          { label: 'Documentos' }
        ]}
      />
      <DocumentsRepository />
    </div>
  );
}