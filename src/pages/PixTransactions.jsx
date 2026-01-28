import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import PixTransactionsView from '@/components/transactions/PixTransactionsView';

export default function PixTransactions() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transações Pix"
        subtitle="Visualize e gerencie todas as transações realizadas via Pix"
        breadcrumbs={[
          { label: 'Transações', page: 'Transactions' },
          { label: 'Pix' }
        ]}
      />
      <PixTransactionsView />
    </div>
  );
}