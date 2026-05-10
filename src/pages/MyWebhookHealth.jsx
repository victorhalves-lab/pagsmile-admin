import React from 'react';
import { Webhook, Activity, AlertCircle, CheckCircle2, RefreshCw, Send } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const HEALTH_KPIS = {
  total_received_24h: 1_842,
  success_rate: 99.6,
  avg_response_time: 145,
  pending_replays: 3,
};

const TIMELINE = Array.from({ length: 24 }, (_, h) => ({
  hour: `${String(h).padStart(2, '0')}h`,
  success: Math.floor(Math.random() * 80) + 60,
  failed: Math.floor(Math.random() * 4),
}));

const RECENT_EVENTS = [
  { id: 'whk_001', type: 'pix.completed', status: 'success', http: 200, time_ms: 124, sent_at: '2026-05-10 09:42:18' },
  { id: 'whk_002', type: 'transaction.created', status: 'success', http: 200, time_ms: 89, sent_at: '2026-05-10 09:41:55' },
  { id: 'whk_003', type: 'pix.created', status: 'failed', http: 503, time_ms: 30000, sent_at: '2026-05-10 09:40:22', can_replay: true },
  { id: 'whk_004', type: 'chargeback.opened', status: 'success', http: 200, time_ms: 312, sent_at: '2026-05-10 09:38:41' },
  { id: 'whk_005', type: 'pix.completed', status: 'success', http: 200, time_ms: 102, sent_at: '2026-05-10 09:35:18' },
];

const ENDPOINTS = [
  { url: 'https://meusite.com.br/webhooks/pix', events: ['pix.created', 'pix.completed', 'pix.refund'], success_rate: 99.8, last_event: '2 min atrás', status: 'healthy' },
  { url: 'https://api.meusite.com.br/transactions', events: ['transaction.created', 'transaction.captured'], success_rate: 100, last_event: '5 min atrás', status: 'healthy' },
  { url: 'https://backup.meusite.com.br/notify', events: ['chargeback.opened', 'chargeback.lost'], success_rate: 96.2, last_event: '1h atrás', status: 'attention' },
];

export default function MyWebhookHealth() {
  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        icon={Webhook}
        title="Saúde dos Meus Webhooks"
        subtitle="Mentor API · Transparência operacional · Self-service replay"
        breadcrumbs={[
          { label: 'Desenvolvedores', page: 'Developers' },
          { label: 'Webhooks' },
          { label: 'Saúde' },
        ]}
        actions={
          <Button variant="outline" className="gap-1"><RefreshCw className="w-4 h-4" /> Atualizar</Button>
        }
      />

      <Card className="p-4 bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200">
        <div className="flex items-start gap-3">
          <Activity className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-semibold text-cyan-800">Você no controle dos seus webhooks</div>
            <p className="text-cyan-700 mt-1">
              Veja em tempo real como os webhooks PagSmile estão chegando aos seus endpoints. Disparos manuais (replay) disponíveis em caso de falha — auditados e governados.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3"><div className="text-xs text-slate-500 uppercase font-bold">Recebidos 24h</div><div className="text-2xl font-black mt-1 text-blue-600">{HEALTH_KPIS.total_received_24h.toLocaleString('pt-BR')}</div></Card>
        <Card className="p-3"><div className="text-xs text-slate-500 uppercase font-bold">Taxa Sucesso</div><div className="text-2xl font-black mt-1 text-emerald-600">{HEALTH_KPIS.success_rate}%</div></Card>
        <Card className="p-3"><div className="text-xs text-slate-500 uppercase font-bold">Tempo Médio Resposta</div><div className="text-2xl font-black mt-1 text-purple-600">{HEALTH_KPIS.avg_response_time}ms</div></Card>
        <Card className="p-3"><div className="text-xs text-slate-500 uppercase font-bold">Pendentes Replay</div><div className="text-2xl font-black mt-1 text-amber-600">{HEALTH_KPIS.pending_replays}</div></Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="endpoints">Meus Endpoints</TabsTrigger>
          <TabsTrigger value="events">Eventos Recentes</TabsTrigger>
          <TabsTrigger value="replay">Self-Service Replay</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Volume de Webhooks (últimas 24h)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={TIMELINE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="success" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Sucesso" />
                <Area type="monotone" dataKey="failed" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Falha" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="mt-4 space-y-3">
          {ENDPOINTS.map((ep, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-sm font-mono">{ep.url}</code>
                    {ep.status === 'healthy' ? 
                      <Badge className="bg-emerald-100 text-emerald-700"><CheckCircle2 className="w-3 h-3 mr-0.5" /> Saudável</Badge> :
                      <Badge className="bg-amber-100 text-amber-700"><AlertCircle className="w-3 h-3 mr-0.5" /> Atenção</Badge>}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {ep.events.map(e => <Badge key={e} variant="outline" className="text-xs">{e}</Badge>)}
                  </div>
                  <div className="text-xs text-slate-500 mt-2">Último evento: {ep.last_event}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 uppercase font-bold">Sucesso</div>
                  <div className={`text-2xl font-black ${ep.success_rate > 99 ? 'text-emerald-600' : 'text-amber-600'}`}>{ep.success_rate}%</div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="events" className="mt-4">
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-3 text-xs font-semibold">ID</th>
                  <th className="text-left p-3 text-xs font-semibold">Evento</th>
                  <th className="text-left p-3 text-xs font-semibold">Status HTTP</th>
                  <th className="text-right p-3 text-xs font-semibold">Tempo</th>
                  <th className="text-left p-3 text-xs font-semibold">Quando</th>
                  <th className="text-center p-3 text-xs font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_EVENTS.map(e => (
                  <tr key={e.id} className="border-b border-slate-100">
                    <td className="p-3"><code className="text-xs font-mono">{e.id}</code></td>
                    <td className="p-3"><Badge variant="outline">{e.type}</Badge></td>
                    <td className="p-3">
                      <Badge className={e.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>{e.http}</Badge>
                    </td>
                    <td className="p-3 text-right font-mono text-xs">
                      {e.time_ms > 1000 ? `${(e.time_ms / 1000).toFixed(1)}s` : `${e.time_ms}ms`}
                    </td>
                    <td className="p-3 text-xs text-slate-500">{e.sent_at}</td>
                    <td className="p-3 text-center">
                      {e.can_replay && <Button size="sm" variant="outline" className="gap-1"><Send className="w-3 h-3" /> Replay</Button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="replay" className="mt-4">
          <Card className="p-6">
            <div className="text-center max-w-md mx-auto">
              <Send className="w-12 h-12 text-cyan-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Self-Service Webhook Replay</h3>
              <p className="text-sm text-slate-600 mb-4">
                Reenvie webhooks que falharam no seu endpoint. Operação auditada e limitada a 50 replays/dia para proteção do sistema.
              </p>
              <Button className="gap-1"><Send className="w-4 h-4" /> Iniciar Replay</Button>
              <div className="text-xs text-slate-500 mt-3">3 webhooks falhados disponíveis para replay</div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}