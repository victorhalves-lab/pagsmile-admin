import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Download } from 'lucide-react';

import PageHeader from '@/components/common/PageHeader';
import AllTransactionsView from '@/components/transactions/AllTransactionsView';
import CardTransactionsView from '@/components/transactions/CardTransactionsView';
import PixTransactionsView from '@/components/transactions/PixTransactionsView';

export default function Transactions() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transações"
        subtitle="Gerencie todas as suas transações de pagamento"
        breadcrumbs={[
          { label: 'Transações', page: 'Transactions' }
        ]}
        actions={
          <>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="card">Cartão</TabsTrigger>
          <TabsTrigger value="pix">Pix</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <AllTransactionsView />
        </TabsContent>

        <TabsContent value="card" className="mt-6">
          <CardTransactionsView />
        </TabsContent>

        <TabsContent value="pix" className="mt-6">
          <PixTransactionsView />
        </TabsContent>
      </Tabs>
    </div>
  );
}