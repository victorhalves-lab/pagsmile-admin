import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Code2, ExternalLink } from 'lucide-react';
import {
  mockApiEndpoints,
  mockWebhookEvents,
  mockWebhookKPIs,
} from '@/components/mentor/mocks/splitApiPlaygroundMock';
import MentorApiPlayground from '@/components/mentor/split/MentorApiPlayground';
import MentorWebhookEventsList from '@/components/mentor/split/MentorWebhookEventsList';
import MentorWebhookKPIBar from '@/components/mentor/split/MentorWebhookKPIBar';
import { Card, CardContent } from '@/components/ui/card';

export default function SplitApiPlayground() {
  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader
        title="API Playground & Webhook Inspector · Splits"
        subtitle="Sandbox Mentor para testar endpoints e monitorar entrega de eventos split.*"
        icon={Code2}
        breadcrumbs={[
          { label: 'Financeiro', page: 'FinancialOverview' },
          { label: 'Splits', page: 'SplitManagement' },
          { label: 'API & Webhooks' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Badge className="bg-violet-100 text-violet-700 gap-1">
              <Sparkles className="w-3 h-3" /> Mentor · Wave H.12
            </Badge>
            <Button size="sm" variant="outline">
              <ExternalLink className="w-3.5 h-3.5 mr-1" /> Documentação completa
            </Button>
          </div>
        }
      />

      <Card className="bg-violet-50/50 border-violet-200">
        <CardContent className="p-3 text-xs text-violet-900">
          🧪 <strong>Modo sandbox</strong> · todas as chamadas executadas aqui são simuladas e não afetam dados de produção.
          Use sua API key <code className="bg-white px-1 rounded font-mono">sk_sandbox_...</code> para reproduzir nas suas integrações.
        </CardContent>
      </Card>

      <Tabs defaultValue="playground" className="space-y-4">
        <TabsList>
          <TabsTrigger value="playground">API Playground</TabsTrigger>
          <TabsTrigger value="webhooks">Webhook Inspector</TabsTrigger>
        </TabsList>

        <TabsContent value="playground" className="space-y-3">
          <MentorApiPlayground endpoints={mockApiEndpoints} />
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <MentorWebhookKPIBar kpis={mockWebhookKPIs} />
          <MentorWebhookEventsList events={mockWebhookEvents} />
        </TabsContent>
      </Tabs>
    </div>
  );
}