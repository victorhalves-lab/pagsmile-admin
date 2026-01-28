import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import CardTransactionsView from '@/components/transactions/CardTransactionsView';

export default function CardTransactions() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transações de Cartão"
        subtitle="Visualize e gerencie todas as transações realizadas com cartão de crédito e débito"
        breadcrumbs={[
          { label: 'Transações', page: 'Transactions' },
          { label: 'Cartão' }
        ]}
      />
      <CardTransactionsView />
    </div>
  );
}