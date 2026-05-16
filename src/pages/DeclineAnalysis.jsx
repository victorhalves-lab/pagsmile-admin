import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Filter, ShieldAlert, MessageSquare, BarChart3 } from 'lucide-react';

import DeclineAnalysisView from '@/components/transactions/DeclineAnalysisView';
import PaymentRecoveryAgentView from '@/components/transactions/PaymentRecoveryAgentView';
import DeclineByBrand from '@/components/transactions/declines/DeclineByBrand';
import SalesRecoveryTemplates from '@/components/transactions/recovery/SalesRecoveryTemplates';

export default function DeclineAnalysis() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Análise de Recusas"
        subtitle="Entenda os motivos de recusa, performance por bandeira e recupere vendas com IA"
        icon={ShieldAlert}
        breadcrumbs={[
          { label: 'Transações', page: 'Transactions' },
          { label: 'Análise de Recusas' },
        ]}
        actions={
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" strokeWidth={1.75} />
            Filtros Avançados
          </Button>
        }
      />

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="bg-slate-100 dark:bg-slate-800">
          <TabsTrigger value="analysis" className="gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" strokeWidth={1.75} />
            Dashboards
          </TabsTrigger>
          <TabsTrigger value="brands" className="gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" strokeWidth={1.75} />
            Por Bandeira
          </TabsTrigger>
          <TabsTrigger value="recovery" className="gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.75} />
            Sales Recovery (IA)
          </TabsTrigger>
        </TabsList>

        {/* Aba 1 — Dashboards completos (Pareto, motivos, evolução, faixas, etc.) */}
        <TabsContent value="analysis" className="mt-6">
          <DeclineAnalysisView />
        </TabsContent>

        {/* Aba 2 — Quebra detalhada por bandeira do cartão */}
        <TabsContent value="brands" className="mt-6 space-y-6">
          <DeclineByBrand />
          {/* Mantém também a análise existente que já tinha breakdown por bandeira em barras */}
          <DeclineAnalysisView />
        </TabsContent>

        {/* Aba 3 — Sales Recovery Agent (IA que envia WhatsApp/ligação/PIX) */}
        <TabsContent value="recovery" className="mt-6 space-y-6">
          <SalesRecoveryTemplates />
          <PaymentRecoveryAgentView />
        </TabsContent>
      </Tabs>
    </div>
  );
}