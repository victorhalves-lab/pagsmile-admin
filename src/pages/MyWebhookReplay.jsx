import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import MyKpiCard from '@/components/my-compliance/MyKpiCard';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Webhook, RefreshCw, CheckCircle2, AlertCircle, Activity, Sparkles, Send } from 'lucide-react';
import { myWebhookKpis, myWebhookEndpoints, myFailedWebhooks } from '@/components/my-ops/mocks/myOpsMock';

const ENDPOINT_STATUS = {
  healthy: { label: 'Saudável', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  attention: { label: 'Atenção', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  failing: { label: 'Falhando', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' }
};

export default function MyWebhookReplay() {
  const [selected, setSelected] = useState([]);

  const toggle = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const retryable = myFailedWebhooks.filter((w) => w.can_retry);

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <PageHeader
        title="Saúde de Webhooks — Replay & Diagnóstico"
        subtitle="Endpoints · Falhas recentes · Reprocessamento self-service"
        icon={Webhook}
        breadcrumbs={[{ label: 'Integrações', page: '#' }, { label: 'Webhooks' }]}
        actions={<Button variant="outline" className="gap-2"><RefreshCw className="w-4 h-4" /> Atualizar</Button>}
      />

      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <CardContent className="p-5 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-600 mt-0.5" />
          <div>
            <h3 className="font-bold text-slate-900">
              Taxa de sucesso 24h: <span className="text-emerald-700">{myWebhookKpis.success_rate_24h}%</span>
            </h3>
            <p className="text-sm text-slate-700 mt-1">
              {myWebhookKpis.failed_24h} eventos falharam — você pode reprocessar até {myWebhookKpis.pending_retry} deles agora. Latência média: <strong>{myWebhookKpis.avg_response_ms}ms</strong>.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <MyKpiCard label="ENDPOINTS" value={myWebhookKpis.total_endpoints} sub={`${myWebhookKpis.active_endpoints} ativos`} accent="blue" />
        <MyKpiCard label="SUCESSO 24H" value={`${myWebhookKpis.success_rate_24h}%`} sub="taxa global" accent="emerald" />
        <MyKpiCard label="FALHAS 24H" value={myWebhookKpis.failed_24h} sub="eventos" accent="amber" warn={myWebhookKpis.failed_24h > 30} />
        <MyKpiCard label="LATÊNCIA" value={`${myWebhookKpis.avg_response_ms}ms`} sub="média" accent="blue" />
        <MyKpiCard label="ENVIADOS 30D" value={(myWebhookKpis.total_sent_30d / 1000).toFixed(1) + 'k'} sub="eventos" accent="blue" />
        <MyKpiCard label="RETRY PENDENTE" value={myWebhookKpis.pending_retry} sub="reprocessar" icon={RefreshCw} accent="amber" />
        <MyKpiCard label="CRÍTICOS" value={myWebhookKpis.unhealthy_endpoints} sub="endpoints" accent="red" warn={myWebhookKpis.unhealthy_endpoints > 0} />
      </div>

      <Tabs defaultValue="failed">
        <TabsList>
          <TabsTrigger value="failed">Falhas Recentes ({myFailedWebhooks.length})</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints ({myWebhookEndpoints.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="failed" className="mt-6 space-y-3">
          {selected.length > 0 && (
            <Card className="bg-blue-50 border-blue-200 sticky top-4 z-10">
              <CardContent className="p-3 flex items-center justify-between">
                <span className="text-sm font-bold">{selected.length} eventos selecionados</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelected([])}>Cancelar</Button>
                  <Button size="sm" className="gap-2"><Send className="w-3 h-3" /> Reprocessar selecionados</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {myFailedWebhooks.map((wh) => (
            <Card key={wh.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selected.includes(wh.id)}
                    onCheckedChange={() => toggle(wh.id)}
                    disabled={!wh.can_retry}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <code className="text-xs bg-slate-100 px-2 py-0.5 rounded font-bold">{wh.event}</code>
                      <Badge className="bg-slate-100 text-slate-700">{wh.endpoint_name}</Badge>
                      <Badge className={wh.status_code >= 500 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}>
                        {wh.status_code === 0 ? 'Sem resposta' : `HTTP ${wh.status_code}`}
                      </Badge>
                      {!wh.can_retry && <Badge variant="outline">Não recuperável</Badge>}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <div className="text-[10px] uppercase text-slate-500">Erro</div>
                        <div className="font-mono text-red-600">{wh.error}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-slate-500">Tentativas</div>
                        <div className="font-mono">{wh.attempts}/5</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-slate-500">Payload</div>
                        <div className="font-mono">{wh.payload_size_kb} KB</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-slate-500">Quando</div>
                        <div className="font-mono">{new Date(wh.timestamp).toLocaleString('pt-BR')}</div>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-2 font-mono">
                      Ref: {wh.transaction_id || wh.subscription_id}
                    </div>
                  </div>
                  {wh.can_retry && (
                    <Button size="sm" variant="outline" className="gap-1"><RefreshCw className="w-3 h-3" /> Replay</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-sm text-slate-700">
              <strong className="text-slate-900 flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4" /> Como funciona o Replay
              </strong>
              Reprocessamos o evento usando o mesmo payload original com idempotency-key preservado. Falhas após 5 tentativas automáticas só podem ser reprocessadas manualmente em até 7 dias.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="mt-6 space-y-3">
          {myWebhookEndpoints.map((ep) => {
            const statusCfg = ENDPOINT_STATUS[ep.status];
            return (
              <Card key={ep.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`w-2 h-2 rounded-full ${statusCfg.dot} animate-pulse`} />
                        <span className="font-bold">{ep.name}</span>
                        <Badge className={statusCfg.color}>{statusCfg.label}</Badge>
                      </div>
                      <code className="text-xs text-slate-500 font-mono break-all">{ep.url}</code>
                      <div className="grid grid-cols-3 gap-3 mt-3 text-xs">
                        <div>
                          <div className="text-[10px] uppercase text-slate-500">Sucesso</div>
                          <div className="font-bold text-base">{ep.success_rate}%</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase text-slate-500">Latência</div>
                          <div className="font-bold text-base">{ep.avg_latency}ms</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase text-slate-500">Última call</div>
                          <div className="font-mono text-xs">{new Date(ep.last_call).toLocaleString('pt-BR')}</div>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-wrap mt-3">
                        {ep.events.map((ev) => (
                          <Badge key={ev} variant="outline" className="text-[10px] font-mono">{ev}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline">Testar</Button>
                      <Button size="sm" variant="outline">Editar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}