import React, { useState } from 'react';
import SideDrawer from '@/components/common/SideDrawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RefreshCw, Activity, FileText, Zap, ChevronRight, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const SAMPLE_DELIVERIES = Array.from({ length: 12 }, (_, i) => {
  const ok = Math.random() > 0.15;
  const events = ['transaction.approved', 'subscription.payment_succeeded', 'pix.received', 'chargeback.received', 'transaction.refunded'];
  return {
    id: `del_${i}`,
    timestamp: new Date(Date.now() - i * 1000 * 60 * (Math.random() * 30 + 5)),
    event: events[i % events.length],
    status: ok ? 200 : Math.random() > 0.5 ? 500 : 422,
    latency: Math.round(50 + Math.random() * 800),
    retries: ok ? 0 : Math.round(Math.random() * 3),
    ok,
  };
});

const SAMPLE_PAYLOAD = {
  id: 'evt_1NwxYz',
  type: 'transaction.approved',
  created: 1714992841,
  data: {
    object: {
      id: 'tr_5hG9JmK',
      amount: 24750,
      currency: 'BRL',
      status: 'approved',
      method: 'credit_card',
      customer: { id: 'cus_8KhB3', name: 'Maria Santos' },
    },
  },
};

export default function WebhookLogsDrawer({ open, onOpenChange, webhook }) {
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  if (!webhook) return null;

  return (
    <SideDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={`Logs: ${webhook.name}`}
      description={webhook.url}
      icon={Activity}
      size="lg"
    >
      <div className="space-y-4">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800">
            <p className="text-[10px] text-slate-500 uppercase">Sucesso (24h)</p>
            <p className="text-xl font-bold mt-0.5 text-emerald-600">{webhook.success_rate || 98}%</p>
          </div>
          <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800">
            <p className="text-[10px] text-slate-500 uppercase">Latência p99</p>
            <p className="text-xl font-bold mt-0.5">340ms</p>
          </div>
          <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800">
            <p className="text-[10px] text-slate-500 uppercase">Falhas (24h)</p>
            <p className="text-xl font-bold mt-0.5 text-amber-600">{webhook.total_failed || 3}</p>
          </div>
        </div>

        <Tabs defaultValue="deliveries">
          <TabsList className="w-full grid grid-cols-3 h-9">
            <TabsTrigger value="deliveries" className="text-xs">Entregas</TabsTrigger>
            <TabsTrigger value="schema" className="text-xs">Payload Schema</TabsTrigger>
            <TabsTrigger value="dlq" className="text-xs">Dead-Letter</TabsTrigger>
          </TabsList>

          <TabsContent value="deliveries" className="mt-3">
            {!selectedDelivery ? (
              <div className="rounded-lg border divide-y">
                {SAMPLE_DELIVERIES.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDelivery(d)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left transition-colors"
                  >
                    {d.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                    <span className="text-[10px] text-slate-400 font-mono w-12 flex-shrink-0">{format(d.timestamp, 'HH:mm:ss')}</span>
                    <code className="text-xs font-mono flex-1 truncate">{d.event}</code>
                    <Badge className={cn('text-[10px] font-mono', d.ok ? 'bg-emerald-500/10 text-emerald-700' : 'bg-red-500/10 text-red-700')}>
                      {d.status}
                    </Badge>
                    <span className="text-[10px] text-slate-500 w-12 text-right tabular-nums">{d.latency}ms</span>
                    {d.retries > 0 && <Badge variant="outline" className="text-[10px]">{d.retries}x</Badge>}
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <Button variant="ghost" size="sm" onClick={() => setSelectedDelivery(null)} className="text-xs">
                  ← Voltar para lista
                </Button>

                {/* Delivery header */}
                <div className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedDelivery.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                    <code className="text-xs font-mono font-bold">{selectedDelivery.event}</code>
                    <Badge className={cn('text-[10px] font-mono', selectedDelivery.ok ? 'bg-emerald-500/10 text-emerald-700' : 'bg-red-500/10 text-red-700')}>
                      HTTP {selectedDelivery.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-3">
                    <span><Clock className="w-3 h-3 inline mr-1" /> {format(selectedDelivery.timestamp, 'dd/MM HH:mm:ss', { locale: ptBR })}</span>
                    <span>{selectedDelivery.latency}ms</span>
                    {selectedDelivery.retries > 0 && <span>{selectedDelivery.retries} retries</span>}
                  </div>
                </div>

                {/* Request payload */}
                <div className="rounded-lg border">
                  <div className="px-3 py-2 border-b bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold flex items-center gap-2">
                    <FileText className="w-3 h-3" /> Request Body
                  </div>
                  <pre className="p-3 text-[10px] font-mono bg-slate-900 text-emerald-300 overflow-auto max-h-60">
                    {JSON.stringify(SAMPLE_PAYLOAD, null, 2)}
                  </pre>
                </div>

                {/* Response */}
                <div className="rounded-lg border">
                  <div className="px-3 py-2 border-b bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Response
                  </div>
                  <pre className="p-3 text-[10px] font-mono bg-slate-900 text-blue-300 overflow-auto max-h-40">
                    {selectedDelivery.ok
                      ? JSON.stringify({ received: true, processed_at: '2026-05-08T...' }, null, 2)
                      : JSON.stringify({ error: 'Internal Server Error', message: 'Database timeout' }, null, 2)}
                  </pre>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => toast.success('Delivery reenviado!')}
                    className="bg-blue-600 hover:bg-blue-700 flex-1"
                  >
                    <RefreshCw className="w-3 h-3 mr-2" /> Replay
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(JSON.stringify(SAMPLE_PAYLOAD, null, 2))}>
                    Copiar payload
                  </Button>
                </div>

                {!selectedDelivery.ok && (
                  <div className="p-3 rounded-lg bg-violet-50 border border-violet-200 flex items-start gap-2">
                    <Zap className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-semibold text-violet-800">Helena IA · Diagnóstico</p>
                      <p className="text-violet-700 mt-0.5">
                        Erro 500 indica problema no servidor receiver. Verifique logs do seu endpoint, especialmente timeout no banco de dados.
                      </p>
                      <Button size="sm" variant="ghost" className="h-7 text-xs mt-1 text-violet-700">
                        Ver troubleshooting completo →
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="schema" className="mt-3">
            <div className="rounded-lg border">
              <div className="px-3 py-2 border-b bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold">
                JSON Schema · transaction.approved
              </div>
              <pre className="p-3 text-[10px] font-mono bg-slate-900 text-emerald-300 overflow-auto max-h-96">
{`{
  "$schema": "http://json-schema.org/draft-07/schema",
  "type": "object",
  "properties": {
    "id": { "type": "string", "pattern": "^evt_" },
    "type": { "type": "string", "const": "transaction.approved" },
    "created": { "type": "integer" },
    "data": {
      "type": "object",
      "properties": {
        "object": {
          "type": "object",
          "properties": {
            "id": { "type": "string" },
            "amount": { "type": "integer" },
            "currency": { "type": "string" },
            "status": { "type": "string" },
            "customer": { "type": "object" }
          }
        }
      }
    }
  },
  "required": ["id", "type", "data"]
}`}
              </pre>
            </div>
            <p className="text-xs text-slate-500 mt-2">📚 Schema completo de todos eventos disponível em <a href="#" className="text-blue-600 hover:underline">docs.pagsmile.com</a></p>
          </TabsContent>

          <TabsContent value="dlq" className="mt-3">
            <div className="text-center py-8 text-slate-500">
              <Activity className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-semibold">Dead-Letter Queue vazia</p>
              <p className="text-xs mt-1">Eventos com 5+ retries falhos aparecerão aqui</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SideDrawer>
  );
}