import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Edit, UserMinus, Mail, Phone, TrendingUp, Users, DollarSign, History, Briefcase, ExternalLink, Award } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { MOCK_SALES_REPS, REP_STATUSES, REP_TYPES, REP_AUDIT_EVENTS } from '@/components/mentor/mocks/salesRepsMock';
import { AuditTimelineTab } from '@/components/mentor';
import SalesRepDeactivateDrawer from '@/components/mentor/reps/SalesRepDeactivateDrawer';
import { toast } from 'sonner';

const fmt = (v) => v >= 1_000_000 ? `R$ ${(v / 1_000_000).toFixed(1)}mi` : `R$ ${(v / 1000).toFixed(0)}k`;

export default function AdminIntSalesRepDetail() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'rep_001';
  const rep = MOCK_SALES_REPS.find((r) => r.id === id) || MOCK_SALES_REPS[0];
  const status = REP_STATUSES[rep.status];
  const type = REP_TYPES[rep.type];

  const [tab, setTab] = useState('resumo');
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      <Button variant="ghost" size="sm" onClick={() => navigate(createPageUrl('AdminIntSalesReps'))} className="-ml-2">
        <ArrowLeft className="w-4 h-4 mr-1" />Voltar para representantes
      </Button>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-[#101F3E] text-white text-xl">{rep.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold">{rep.name}</h1>
                <Badge className={status?.color}>{status?.label}</Badge>
                <Badge className={type?.color}>{type?.label}</Badge>
                <Badge variant="outline" className="capitalize">{rep.region}</Badge>
                {rep.specialty && <Badge variant="outline" className="capitalize">{rep.specialty.replace('_', ' ')}</Badge>}
              </div>
              <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{rep.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{rep.phone}</span>
                <span>CPF: {rep.cpf}</span>
                <span>Comissão: {rep.commission_pct}%</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-2">
                Hierarquia: {rep.hierarchy.join(' → ')}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => toast.info('Edição abrindo...')}><Edit className="w-4 h-4 mr-2" />Editar</Button>
              <Button variant="outline" className="text-red-600" onClick={() => setDeactivateOpen(true)}><UserMinus className="w-4 h-4 mr-2" />Desligar</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="resumo" className="gap-1.5"><Briefcase className="w-3.5 h-3.5" />Resumo</TabsTrigger>
          <TabsTrigger value="carteira" className="gap-1.5"><Users className="w-3.5 h-3.5" />Carteira ({rep.accounts_count})</TabsTrigger>
          <TabsTrigger value="performance" className="gap-1.5"><TrendingUp className="w-3.5 h-3.5" />Performance</TabsTrigger>
          <TabsTrigger value="comissoes" className="gap-1.5"><DollarSign className="w-3.5 h-3.5" />Comissões</TabsTrigger>
          <TabsTrigger value="captacoes" className="gap-1.5"><Award className="w-3.5 h-3.5" />Captações & Perdas</TabsTrigger>
          <TabsTrigger value="auditoria" className="gap-1.5"><History className="w-3.5 h-3.5" />Auditoria</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card><CardContent className="p-4"><p className="text-[10px] uppercase text-slate-500 font-semibold">TPV/mês</p><p className="text-2xl font-bold text-emerald-600">{fmt(rep.monthly_tpv)}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-[10px] uppercase text-slate-500 font-semibold">Receita PagSmile</p><p className="text-2xl font-bold text-blue-600">{fmt(rep.monthly_revenue)}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-[10px] uppercase text-slate-500 font-semibold">Comissão/mês</p><p className="text-2xl font-bold text-violet-600">{fmt(rep.monthly_commission)}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-[10px] uppercase text-slate-500 font-semibold">Atingimento meta</p><p className={`text-2xl font-bold ${rep.quota_target_pct >= 100 ? 'text-emerald-600' : 'text-amber-600'}`}>{rep.quota_target_pct}%</p><p className="text-[10px] text-slate-500">{fmt(rep.quota_target_value)}</p></CardContent></Card>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-base">Evolução TPV (24 meses)</CardTitle></CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer>
                  <LineChart data={rep.tpv_evolution_24m}>
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}mi`} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v) => fmt(v)} />
                    <Line type="monotone" dataKey="tpv" stroke="#2bc196" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="carteira">
          <Card>
            <CardHeader><CardTitle className="text-base">Empresas e lojistas atendidos · {rep.accounts_count} contas</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {rep.accounts.map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-[10px]">{a.type}</Badge>
                      <p className="font-medium text-sm">{a.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-emerald-600">{fmt(a.tpv)}</span>
                      <Button size="icon" variant="ghost" className="h-7 w-7"><ExternalLink className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="mt-4 bg-amber-50 dark:bg-amber-900/10 border-amber-200">
            <CardContent className="p-3 text-xs text-amber-800">
              💡 IA detectou: <strong>2 empresas com sinais de risco de churn</strong> · queda de TPV {'>'} 25% em 60 dias. Considere ação retentiva proativa.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card><CardContent className="p-4"><p className="text-[10px] uppercase text-slate-500">Crescimento 12m</p><p className={`text-2xl font-bold ${rep.growth_12m_pct >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{rep.growth_12m_pct >= 0 ? '+' : ''}{rep.growth_12m_pct.toFixed(1)}%</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-[10px] uppercase text-slate-500">Aprovação consolidada</p><p className="text-2xl font-bold">{rep.avg_approval_rate.toFixed(1)}%</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-[10px] uppercase text-slate-500">Captações 12m</p><p className="text-2xl font-bold text-emerald-600">+{rep.captures_12m}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-[10px] uppercase text-slate-500">Perdas 12m</p><p className="text-2xl font-bold text-red-600">-{rep.losses_12m}</p></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="comissoes">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center justify-between">
              <span>Histórico de comissões</span>
              <Badge className="bg-violet-100 text-violet-700">YTD: {fmt(rep.ytd_commission)}</Badge>
            </CardTitle></CardHeader>
            <CardContent>
              {rep.commission_history.length === 0 ? <p className="text-sm text-slate-500 text-center py-6">Sem histórico</p> : (
                <div className="space-y-2">
                  {rep.commission_history.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="text-sm font-medium">{c.month}</p>
                        <p className="text-[10px] text-slate-500">{c.status === 'paid' ? `Pago em ${c.paid_at}` : 'Pendente'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-violet-600">{fmt(c.value)}</span>
                        <Badge className="text-[10px] bg-emerald-100 text-emerald-700">{c.status}</Badge>
                        <Button size="sm" variant="ghost" className="h-7 text-[10px]">Comprovante</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="captacoes">
          <Card>
            <CardHeader><CardTitle className="text-base">Captações & Perdas — últimos 12 meses</CardTitle></CardHeader>
            <CardContent>
              {rep.captures_losses.length === 0 ? <p className="text-sm text-slate-500 text-center py-6">Sem eventos no período</p> : (
                <div className="space-y-2">
                  {rep.captures_losses.map((e, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Badge className={e.type === 'capture' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
                          {e.type === 'capture' ? '+ Captação' : '− Perda'}
                        </Badge>
                        <div>
                          <p className="text-sm font-medium">{e.name}</p>
                          <p className="text-[10px] text-slate-500">{e.date} · {e.source || e.reason}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auditoria">
          <AuditTimelineTab events={REP_AUDIT_EVENTS} entityName={rep.name} />
        </TabsContent>
      </Tabs>

      <SalesRepDeactivateDrawer open={deactivateOpen} onOpenChange={setDeactivateOpen} rep={rep} />
    </div>
  );
}