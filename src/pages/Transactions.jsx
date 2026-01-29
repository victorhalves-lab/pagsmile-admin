import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Download, AlertTriangle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

import PageHeader from '@/components/common/PageHeader';
import AllTransactionsView from '@/components/transactions/AllTransactionsView';
import CardTransactionsView from '@/components/transactions/CardTransactionsView';
import PixTransactionsView from '@/components/transactions/PixTransactionsView';
import DeclineAnalysisView from '@/components/transactions/DeclineAnalysisView';
import PaymentRecoveryAgentView from '@/components/transactions/PaymentRecoveryAgentView';

export default function Transactions() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="space-y-6 bg-[var(--color-bg-page)] min-h-screen">
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
        <TabsList className="h-auto flex-wrap gap-1 p-1">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="card">Cartão</TabsTrigger>
          <TabsTrigger value="pix">Pix</TabsTrigger>
          <TabsTrigger value="declines" className="gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Análise de Recusas
          </TabsTrigger>
          <TabsTrigger value="recovery" className="gap-1.5">
            <Sparkles className="w-4 h-4" />
            Recovery Agent
            <Badge className="ml-1 bg-[#00D26A] text-white px-1.5 py-0 text-xs">AI</Badge>
          </TabsTrigger>
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

        <TabsContent value="declines" className="mt-6">
          <DeclineAnalysisView />
        </TabsContent>

        <TabsContent value="recovery" className="mt-6">
          <PaymentRecoveryAgentView />
        </TabsContent>
      </Tabs>
    </div>
  );
}