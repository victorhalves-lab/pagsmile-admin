import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent } from '@/components/ui/tabs';

import PageHeader from '@/components/common/PageHeader';
import AllTransactionsView from '@/components/transactions/AllTransactionsView';
import CardTransactionsView from '@/components/transactions/CardTransactionsView';
import PixTransactionsView from '@/components/transactions/PixTransactionsView';
import DeclineAnalysisView from '@/components/transactions/DeclineAnalysisView';
import PaymentRecoveryAgentView from '@/components/transactions/PaymentRecoveryAgentView';
import RefundsView from '@/components/transactions/RefundsView';
import CRMView from '@/components/transactions/CRMView';

import { TransactionsProvider } from '@/components/transactions/hub/TransactionsContext';
import StatusOfTheDayBar from '@/components/transactions/hub/StatusOfTheDayBar';
import HubActionBar from '@/components/transactions/hub/HubActionBar';
import StickyFiltersBar from '@/components/transactions/hub/StickyFiltersBar';
import TransactionsTabs from '@/components/transactions/hub/TransactionsTabs';
import DiaInsightsSidePanel from '@/components/transactions/hub/DiaInsightsSidePanel';
import KeyboardShortcutsHelp from '@/components/transactions/hub/KeyboardShortcutsHelp';

function TransactionsHubInner() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');
  const [diaOpen, setDiaOpen] = useState(false);

  // Carrega contagem para badges
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions-counts'],
    queryFn: () => base44.entities.Transaction.list('-created_date', 500),
  });

  const counts = useMemo(() => {
    const all = transactions.length;
    const card = transactions.filter(t => t.method === 'credit_card' || t.method === 'debit_card' || t.type === 'card').length;
    const pix = transactions.filter(t => t.method === 'pix' || t.type === 'pix').length;
    const refunds = transactions.filter(t =>
      ['refunded', 'partial_refunded', 'voided'].includes(t.status) ||
      ['refund', 'partial_refund', 'void'].includes(t.type)
    ).length;
    const declines = transactions.filter(t => t.status === 'refused' || t.status === 'declined').length;
    return { all, card, pix, refunds, declines };
  }, [transactions]);

  return (
    <div className="space-y-5 bg-[var(--color-bg-page)] min-h-screen">
      <PageHeader
        title={t('transactions.title')}
        subtitle={t('transactions.subtitle') || 'Hub centralizado de transações, reembolsos, recusas e CRM'}
        breadcrumbs={[{ label: t('transactions.title'), page: 'Transactions' }]}
      />

      {/* Status do dia */}
      <StatusOfTheDayBar />

      {/* Action bar */}
      <HubActionBar onToggleDia={() => setDiaOpen(d => !d)} />

      {/* Sticky filters cross-aba */}
      <StickyFiltersBar />

      {/* Tabs com badges */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TransactionsTabs counts={counts} />

        <TabsContent value="all" className="mt-4">
          <AllTransactionsView />
        </TabsContent>
        <TabsContent value="card" className="mt-4">
          <CardTransactionsView />
        </TabsContent>
        <TabsContent value="pix" className="mt-4">
          <PixTransactionsView />
        </TabsContent>
        <TabsContent value="refunds" className="mt-4">
          <RefundsView />
        </TabsContent>
        <TabsContent value="declines" className="mt-4">
          <DeclineAnalysisView />
        </TabsContent>
        <TabsContent value="recovery" className="mt-4">
          <PaymentRecoveryAgentView />
        </TabsContent>
        <TabsContent value="crm" className="mt-4">
          <CRMView />
        </TabsContent>
      </Tabs>

      {/* DIA Insights side panel */}
      <DiaInsightsSidePanel open={diaOpen} onClose={() => setDiaOpen(false)} />

      {/* Atalhos de teclado (?) */}
      <KeyboardShortcutsHelp />
    </div>
  );
}

export default function Transactions() {
  return (
    <TransactionsProvider>
      <TransactionsHubInner />
    </TransactionsProvider>
  );
}