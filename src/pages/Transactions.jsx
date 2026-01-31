import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="space-y-6 bg-[var(--color-bg-page)] min-h-screen">
      <PageHeader
        title={t('transactions.title')}
        subtitle={t('transactions.subtitle') || t('transactions.title')}
        breadcrumbs={[
          { label: t('transactions.title'), page: 'Transactions' }
        ]}
        actions={
          <>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              {t('common.export')}
            </Button>
          </>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="h-auto flex-wrap gap-1 p-1">
          <TabsTrigger value="all">{t('transactions.all')}</TabsTrigger>
          <TabsTrigger value="card">{t('transactions.card')}</TabsTrigger>
          <TabsTrigger value="pix">{t('transactions.pix')}</TabsTrigger>
          <TabsTrigger value="declines" className="gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            {t('menu.decline_analysis')}
          </TabsTrigger>
          <TabsTrigger value="recovery" className="gap-1.5">
            <Sparkles className="w-4 h-4" />
            {t('transactions.recovery_agent')}
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