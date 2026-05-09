import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck } from 'lucide-react';
import RecalculateFlow from '@/components/mentor/settlement/governance/RecalculateFlow';
import ForcedStatusFlow from '@/components/mentor/settlement/governance/ForcedStatusFlow';
import RollbackFlow from '@/components/mentor/settlement/governance/RollbackFlow';
import GovernanceAuditLog from '@/components/mentor/settlement/governance/GovernanceAuditLog';
import { mockGovernanceAuditLog } from '@/components/mentor/mocks/settlementGovernanceMock';

export default function SettlementGovernanceCenter() {
  const params = new URLSearchParams(window.location.search);
  const initialTab = params.get('action') || 'recalculate';

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader
        title="Governance Center · Settlements"
        subtitle="Centro de operações governadas: recalcular, forçar status, reverter pagamentos"
        icon={ShieldCheck}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
          { label: 'Liquidações', page: 'AdminIntSettlements' },
          { label: 'Governance Center' },
        ]}
      />

      <Tabs defaultValue={initialTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="recalculate">📐 Recalculate</TabsTrigger>
          <TabsTrigger value="forced_status">⚠️ Forçar Status</TabsTrigger>
          <TabsTrigger value="rollback">🛑 Manual Rollback</TabsTrigger>
          <TabsTrigger value="audit">📜 Trilha Auditável</TabsTrigger>
        </TabsList>

        <TabsContent value="recalculate"><RecalculateFlow /></TabsContent>
        <TabsContent value="forced_status"><ForcedStatusFlow /></TabsContent>
        <TabsContent value="rollback"><RollbackFlow /></TabsContent>
        <TabsContent value="audit"><GovernanceAuditLog events={mockGovernanceAuditLog} /></TabsContent>
      </Tabs>
    </div>
  );
}