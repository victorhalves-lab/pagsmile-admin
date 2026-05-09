import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, FileText } from 'lucide-react';
import {
  mockSettlementDetail,
  mockAggregatedTransactions,
  mockTimeline,
  mockSettlementInstallments,
  mockSettlementRefunds,
  mockRefundsKPIs,
} from '@/components/mentor/mocks/settlementDetail360Mock';
import MentorSettlementHeaderCard from '@/components/mentor/settlement/MentorSettlementHeaderCard';
import MentorSettlementMerchantCard from '@/components/mentor/settlement/MentorSettlementMerchantCard';
import MentorSettlementBankAccountCard from '@/components/mentor/settlement/MentorSettlementBankAccountCard';
import MentorSettlementFinancialBreakdown from '@/components/mentor/settlement/MentorSettlementFinancialBreakdown';
import MentorSettlementHealthScore from '@/components/mentor/settlement/MentorSettlementHealthScore';
import MentorSettlementActionsBar from '@/components/mentor/settlement/MentorSettlementActionsBar';
import MentorSettlementTransactionsTab from '@/components/mentor/settlement/MentorSettlementTransactionsTab';
import MentorSettlementTimelineTab from '@/components/mentor/settlement/MentorSettlementTimelineTab';
import MentorSettlementInstallmentsTab from '@/components/mentor/settlement/MentorSettlementInstallmentsTab';
import MentorSettlementRefundsTab from '@/components/mentor/settlement/MentorSettlementRefundsTab';
import MentorSettlementNotesPanel from '@/components/mentor/settlement/MentorSettlementNotesPanel';

export default function AdminIntSettlementDetail360() {
  const s = mockSettlementDetail;

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader
        title={`Settlement ${s.settlement_id}`}
        subtitle="Ficha 360 da liquidação financeira · visão Mentor com decomposição, ações governadas e auditoria"
        icon={FileText}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
          { label: 'Liquidações', page: 'AdminIntSettlements' },
          { label: s.settlement_id },
        ]}
        actions={
          <Badge className="bg-violet-100 text-violet-700 gap-1">
            <Sparkles className="w-3 h-3" /> Mentor · Wave I.1-I.3
          </Badge>
        }
      />

      <MentorSettlementHeaderCard settlement={s} />
      <MentorSettlementActionsBar settlement={s} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <MentorSettlementMerchantCard merchant={s.merchant} />
        <MentorSettlementBankAccountCard account={s.bank_account} />
        <MentorSettlementHealthScore score={s.health_score} risks={s.risks} suggestions={s.proactive_suggestions} />
      </div>

      <Tabs defaultValue="financial" className="space-y-4">
        <TabsList>
          <TabsTrigger value="financial">Decomposição financeira</TabsTrigger>
          <TabsTrigger value="transactions">Transações ({mockAggregatedTransactions.length})</TabsTrigger>
          <TabsTrigger value="installments">Parcelas {mockSettlementInstallments.total_installments > 0 && `(${mockSettlementInstallments.paid_installments}/${mockSettlementInstallments.total_installments})`}</TabsTrigger>
          <TabsTrigger value="refunds">Estornos ({mockSettlementRefunds.length})</TabsTrigger>
          <TabsTrigger value="timeline">Cronologia</TabsTrigger>
          <TabsTrigger value="notes">Notas ({s.admin_notes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="financial">
          <MentorSettlementFinancialBreakdown financial={s.financial} />
        </TabsContent>
        <TabsContent value="transactions">
          <MentorSettlementTransactionsTab transactions={mockAggregatedTransactions} />
        </TabsContent>
        <TabsContent value="installments">
          <MentorSettlementInstallmentsTab data={mockSettlementInstallments} />
        </TabsContent>
        <TabsContent value="refunds">
          <MentorSettlementRefundsTab refunds={mockSettlementRefunds} kpis={mockRefundsKPIs} />
        </TabsContent>
        <TabsContent value="timeline">
          <MentorSettlementTimelineTab timeline={mockTimeline} />
        </TabsContent>
        <TabsContent value="notes">
          <MentorSettlementNotesPanel notes={s.admin_notes} />
        </TabsContent>
      </Tabs>
    </div>
  );
}