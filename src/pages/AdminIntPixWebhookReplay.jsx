import React, { useState } from 'react';
import { Webhook, Send, ShieldCheck, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { 
  PIX_WEBHOOK_KPIS, PIX_WEBHOOK_LOGS, PIX_RESOURCES, 
  PIX_PROBLEMATIC_DESTINATIONS, PIX_REPLAY_PATTERNS 
} from '@/components/pixwebhook/mocks/pixWebhookMock';

function KpiCard({ label, value, color = 'text-slate-800', subtitle }) {
  return (
    <Card className="p-3">
      <div className="text-xs uppercase tracking-wide text-slate-500 font-bold">{label}</div>
      <div className={`text-2xl font-black mt-1 ${color}`}>{value}</div>
      {subtitle && <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>}
    </Card>
  );
}

export default function AdminIntPixWebhookReplay() {
  const [resource, setResource] = useState('pix_payment_in');
  const [operation, setOperation] = useState('completed');
  const [eventIds, setEventIds] = useState('');
  const [justification, setJustification] = useState('');
  const [otp, setOtp] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setResult({ success: true, sent: eventIds.split('\n').filter(Boolean).length, audit_id: `aud_${Math.random().toString(36).slice(2, 12)}` });
      setEventIds(''); setJustification(''); setOtp('');
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        icon={Webhook}
        title="PIX Webhook Replay — Reenvio Manual Governado"
        subtitle="Mentor API · ORIGEM 201 · Conformidade BCB Resolução 1/2020"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'Dashboard' },
          { label: 'Webhooks' },
          { label: 'PIX Replay' },
        ]}
        actions={
          <Link to="/AdminIntWebhookReplay">
            <Button variant="outline">Webhook Replay Geral</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <KpiCard label="Enviados 24h" value={PIX_WEBHOOK_KPIS.total_sent_24h.toLocaleString('pt-BR')} color="text-blue-600" />
        <KpiCard label="Taxa Sucesso" value={`${PIX_WEBHOOK_KPIS.success_rate}%`} color="text-emerald-600" />
        <KpiCard label="Tempo Médio" value={`${PIX_WEBHOOK_KPIS.avg_response_time_ms}ms`} color="text-purple-600" />
        <KpiCard label="Replays 24h" value={PIX_WEBHOOK_KPIS.manual_replays_24h} color="text-orange-600" />
        <KpiCard label="Falhas Pendentes" value={PIX_WEBHOOK_KPIS.failed_pending} color="text-red-600" />
        <KpiCard label="Destinos Únicos" value={PIX_WEBHOOK_KPIS.unique_destinations} color="text-cyan-600" />
        <KpiCard label="Quebras BCB" value={PIX_WEBHOOK_KPIS.regulatory_breaches} color="text-rose-600" />
        <KpiCard label="BCB Compliance" value={`${PIX_WEBHOOK_KPIS.bcb_compliance_score}%`} color="text-emerald-600" subtitle="Res. 1/2020" />
      </div>

      <Tabs defaultValue="replay">
        <TabsList>
          <TabsTrigger value="replay">Disparar Replay</TabsTrigger>
          <TabsTrigger value="logs">Logs de Envio</TabsTrigger>
          <TabsTrigger value="destinations">Destinos Problemáticos</TabsTrigger>
          <TabsTrigger value="patterns">Padrões IA</TabsTrigger>
        </TabsList>

        <TabsContent value="replay" className="space-y-4 mt-4">
          {result && (
            <Card className="p-4 bg-emerald-50 border-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="font-semibold text-emerald-800">{result.sent} webhook(s) reenviado(s) com sucesso</div>
                  <div className="text-xs text-slate-600 font-mono mt-0.5">Auditoria: {result.audit_id}</div>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4 space-y-3">
              <h3 className="font-semibold">⚙️ Configuração do Reenvio</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Recurso PIX</Label>
                  <Select value={resource} onValueChange={setResource}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(PIX_RESOURCES).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tipo de evento</Label>
                  <Select value={operation} onValueChange={setOperation}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created">created</SelectItem>
                      <SelectItem value="updated">updated</SelectItem>
                      <SelectItem value="completed">completed</SelectItem>
                      <SelectItem value="failed">failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>IDs dos eventos PIX (um por linha)</Label>
                <Textarea
                  value={eventIds}
                  onChange={(e) => setEventIds(e.target.value)}
                  placeholder="pix_8000001&#10;pix_8000002&#10;pix_8000003"
                  rows={5}
                  className="font-mono text-sm"
                />
                <div className="text-xs text-slate-500 mt-1">{eventIds.split('\n').filter(Boolean).length} evento(s) selecionado(s)</div>
              </div>
            </Card>

            <Card className="p-4 space-y-3">
              <h3 className="font-semibold flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-purple-600" /> Governança</h3>
              <div>
                <Label>Justificativa <span className="text-red-500">*</span></Label>
                <Textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Ex: Reenvio após indisponibilidade reportada pelo lojista TechShop SP em ticket TS-2026-0142..."
                  rows={4}
                />
                <div className="text-xs text-slate-500 mt-1">{justification.length}/50 caracteres mínimos</div>
              </div>
              <div>
                <Label>Token OTP</Label>
                <Input
                  type="text" inputMode="numeric" maxLength={6} placeholder="000000"
                  value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="font-mono text-xl text-center tracking-widest"
                />
              </div>
              <Card className="p-2 bg-amber-50 border-amber-200">
                <div className="text-xs text-amber-800 flex items-start gap-1">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  <span>BCB Resolução 1/2020 exige notificação tempestiva. Reenvios fora de janela regulatória são reportados a Compliance.</span>
                </div>
              </Card>
              <Button
                className="w-full gap-1 bg-purple-600 hover:bg-purple-700"
                disabled={!eventIds || justification.length < 50 || otp.length !== 6 || sending}
                onClick={handleSend}
              >
                {sending ? '⏳ Enviando...' : <><Send className="w-4 h-4" /> Disparar Replay</>}
              </Button>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="text-left p-3 text-xs font-semibold">ID Webhook</th>
                  <th className="text-left p-3 text-xs font-semibold">Lojista</th>
                  <th className="text-left p-3 text-xs font-semibold">Recurso</th>
                  <th className="text-left p-3 text-xs font-semibold">Status HTTP</th>
                  <th className="text-right p-3 text-xs font-semibold">Tempo</th>
                  <th className="text-left p-3 text-xs font-semibold">Origem</th>
                  <th className="text-left p-3 text-xs font-semibold">Quando</th>
                </tr>
              </thead>
              <tbody>
                {PIX_WEBHOOK_LOGS.slice(0, 15).map(log => (
                  <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                    <td className="p-3"><code className="text-xs font-mono">{log.id}</code></td>
                    <td className="p-3 text-sm">{log.merchant.name}</td>
                    <td className="p-3"><Badge className={PIX_RESOURCES[log.resource].color}>{PIX_RESOURCES[log.resource].label}</Badge></td>
                    <td className="p-3">
                      <Badge className={log.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
                        {log.http_status}
                      </Badge>
                      {log.bcb_window_breached && <Badge variant="outline" className="ml-1 text-xs text-rose-600 border-rose-300">⚠ BCB</Badge>}
                    </td>
                    <td className="p-3 text-right font-mono text-xs">
                      {log.response_time_ms > 1000 ? `${(log.response_time_ms / 1000).toFixed(1)}s` : `${log.response_time_ms.toFixed(0)}ms`}
                    </td>
                    <td className="p-3">
                      {log.is_manual_replay ? (
                        <Badge variant="outline" className="text-xs text-purple-600 border-purple-300">Manual ({log.operator})</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Automático</Badge>
                      )}
                    </td>
                    <td className="p-3 text-xs text-slate-500">{new Date(log.sent_at).toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="destinations" className="mt-4 space-y-3">
          {PIX_PROBLEMATIC_DESTINATIONS.map((d, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-100">{d.merchant.name}</div>
                  <code className="text-xs text-slate-500">{d.merchant.webhook_url}</code>
                  <div className="text-sm text-slate-600 mt-2 italic">💡 {d.recommendation}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase font-bold text-red-600">Taxa de Falha</div>
                  <div className="text-3xl font-black text-red-700">{d.failure_rate}%</div>
                  <div className="text-xs text-slate-500">{d.total_events} eventos · 30d</div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="patterns" className="mt-4 space-y-3">
          <Card className="p-3 bg-purple-50 border-purple-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-800">Padrões detectados pelo Mentor IA</span>
            </div>
          </Card>
          {PIX_REPLAY_PATTERNS.map((p, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Badge className={p.severity === 'critical' ? 'bg-red-500 text-white' : p.severity === 'high' ? 'bg-orange-500 text-white' : 'bg-yellow-500 text-white'}>
                  {p.severity}
                </Badge>
                <span className="font-semibold">{p.pattern}</span>
              </div>
              <div className="text-sm text-slate-600 italic">💡 {p.suggestion}</div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}