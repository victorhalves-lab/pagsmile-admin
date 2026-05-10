import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TrendingUp, AlertTriangle, CheckCircle2, DollarSign, FileText, Scale, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import MyKpiCard from '@/components/my-compliance/MyKpiCard';
import { myDriftKpis, myDriftAlerts, myDriftHistory, formatCurrency } from '@/components/my-compliance/mocks/myComplianceMock';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const statusColors = {
  open: 'bg-orange-100 text-orange-700',
  in_review: 'bg-blue-100 text-blue-700',
  resolved: 'bg-emerald-100 text-emerald-700',
  disputed: 'bg-red-100 text-red-700'
};

export default function MyDriftAlerts() {
  const [selectedDrift, setSelectedDrift] = useState(null);

  const open = myDriftAlerts.filter(d => d.status === 'open');
  const resolved = myDriftAlerts.filter(d => d.status === 'resolved');

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Alertas de Divergência de Taxa (Drift)"
        subtitle="Transparência de Cobrança · Diferenças entre MDR contratado e MDR aplicado"
        breadcrumbs={[{ label: 'Financeiro' }, { label: 'Drift Alerts' }]}
        icon={TrendingUp}
        actions={<Button variant="outline" size="sm"><FileText className="w-4 h-4 mr-2" />Política de Recuperação</Button>}
      />

      {open.length > 0 && (
        <Card className="mb-6 bg-amber-50/30 border-amber-200">
          <CardContent className="p-4 flex gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-900 flex-1">
              <p className="font-semibold">💰 Detectamos {open.length} divergência(s) ativa(s) — potencial recuperação de {formatCurrency(myDriftKpis.potential_recovery)}</p>
              <p className="text-amber-700 mt-1">Nosso sistema monitora automaticamente cada transação e compara a MDR efetivamente cobrada com a MDR contratada do seu plano. Você é notificado proativamente sobre qualquer divergência.</p>
            </div>
            <Button size="sm" variant="outline">Ver detalhamento</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <MyKpiCard label="Alertas 30d" value={myDriftKpis.total_alerts_30d} icon={AlertTriangle} accent="amber" />
        <MyKpiCard label="Não resolvidos" value={myDriftKpis.active_unresolved} icon={AlertTriangle} accent="red" warn />
        <MyKpiCard label="Impacto total" value={formatCurrency(myDriftKpis.total_impact_brl)} icon={DollarSign} accent="red" />
        <MyKpiCard label="A recuperar" value={formatCurrency(myDriftKpis.potential_recovery)} icon={ArrowRight} accent="emerald" />
        <MyKpiCard label="MDR contratada" value={myDriftKpis.contracted_mdr_avg+'%'} icon={Scale} accent="blue" />
        <MyKpiCard label="Drift médio" value={'+'+myDriftKpis.drift_pp+'pp'} sub="vs contratado" icon={TrendingUp} accent="amber" warn />
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Alertas Ativos ({open.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolvidos ({resolved.length})</TabsTrigger>
          <TabsTrigger value="history">Histórico 6m</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-3">
          {open.map(d => (
            <Card key={d.id} className="border-orange-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={statusColors[d.status]}>{d.status === 'open' ? 'Não resolvido' : 'Em análise'}</Badge>
                      <Badge variant="outline" className="capitalize">{d.method.replace(/_/g,' ')}</Badge>
                      {d.card_brand && <Badge variant="outline" className="uppercase">{d.card_brand}</Badge>}
                      <span className="text-xs text-slate-500">Detectado em {format(new Date(d.detected_at), 'dd/MM HH:mm')}</span>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4 mt-3">
                      <div>
                        <div className="text-xs text-slate-500 uppercase font-semibold">Contratado</div>
                        <div className="text-2xl font-black text-emerald-600">{d.contracted_rate}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase font-semibold">Aplicado</div>
                        <div className="text-2xl font-black text-red-600">{d.applied_rate}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase font-semibold">Drift</div>
                        <div className="text-2xl font-black text-amber-600">+{d.drift_pp}pp</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase font-semibold">Impacto Financeiro</div>
                        <div className="text-2xl font-black text-red-600">{formatCurrency(d.financial_impact)}</div>
                        <div className="text-xs text-slate-500">{d.transactions_affected.toLocaleString('pt-BR')} transações afetadas</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg mb-3">
                  <div className="text-xs font-semibold text-slate-600 uppercase mb-1">Causa identificada (IA)</div>
                  <p className="text-sm text-slate-700">{d.cause}</p>
                </div>

                <div className="bg-emerald-50 p-3 rounded-lg mb-3">
                  <div className="text-xs font-semibold text-emerald-700 uppercase mb-1">Recomendação</div>
                  <p className="text-sm text-emerald-800">{d.recommendation}</p>
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <Button size="sm"><Scale className="w-4 h-4 mr-2" />Solicitar Estorno do Diferencial</Button>
                  <Button size="sm" variant="outline">Ver Transações Afetadas ({d.transactions_affected})</Button>
                  <Button size="sm" variant="ghost"><FileText className="w-4 h-4 mr-2" />Detalhamento Técnico</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-3">
          {resolved.map(d => (
            <Card key={d.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <Badge className={statusColors[d.status]}>Resolvido</Badge>
                    <Badge variant="outline" className="capitalize">{d.method.replace(/_/g,' ')}</Badge>
                  </div>
                  <div className="text-sm text-slate-700 mt-1">{d.recommendation}</div>
                  <div className="text-xs text-slate-500 mt-1">Resolvido em {format(new Date(d.resolved_at), 'dd/MM/yyyy')}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-600">{formatCurrency(d.resolution_amount)}</div>
                  <div className="text-xs text-slate-500">recuperado</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader><CardTitle>Histórico de Drift (6 meses)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={myDriftHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={v => 'R$' + (v/1000).toFixed(1)+'k'} />
                  <Tooltip formatter={v => formatCurrency(v)} />
                  <Legend />
                  <Bar dataKey="total_drift_brl" fill="#f59e0b" name="Drift detectado" />
                  <Bar dataKey="recovered" fill="#10b981" name="Recuperado" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader><CardTitle>Notificações de Drift</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'E-mail imediato para drift > R$ 100', enabled: true },
                { label: 'WhatsApp para drift > R$ 500', enabled: true },
                { label: 'Resumo semanal', enabled: true },
                { label: 'Auto-solicitação de estorno (drift > 0.10pp)', enabled: false }
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">{s.label}</span>
                  <Badge className={s.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}>{s.enabled ? 'Ativo' : 'Inativo'}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}