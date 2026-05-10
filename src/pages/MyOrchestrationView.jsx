import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import MyKpiCard from '@/components/my-compliance/MyKpiCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Network, TrendingUp, Activity, Zap, ShieldCheck, ArrowRight, Sparkles, Info } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import {
  myOrchestrationKpis,
  myAcquirerHealth,
  myRoutingRules,
  myMethodBreakdown,
  myFailoverEvents,
  formatCurrency,
  formatPct
} from '@/components/my-value/mocks/myValueMock';

const STATUS_CFG = {
  healthy: { label: '🟢 Saudável', color: 'bg-emerald-100 text-emerald-700' },
  attention: { label: '🟡 Atenção', color: 'bg-amber-100 text-amber-700' },
  critical: { label: '🔴 Crítico', color: 'bg-red-100 text-red-700' }
};

const ROLE_CFG = {
  primary: 'Primária',
  failover: 'Failover',
  failover_secondary: 'Failover Secundária'
};

const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

export default function MyOrchestrationView() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <PageHeader
        title="Roteamento Inteligente — Como suas vendas são processadas"
        subtitle="Visibilidade total · Adquirentes · Failover · Recuperação automática"
        icon={Network}
        breadcrumbs={[{ label: 'Transações', page: '#' }, { label: 'Orquestração' }]}
        actions={
          <Button variant="outline" className="gap-2">
            <Info className="w-4 h-4" /> Como funciona?
          </Button>
        }
      />

      {/* Banner explicativo */}
      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-slate-900">Sua taxa de aprovação está em <span className="text-emerald-700">{formatPct(myOrchestrationKpis.global_approval_rate)}</span> — acima do benchmark de mercado (91%)</h3>
              <p className="text-sm text-slate-700 mt-1">
                Recuperamos automaticamente <strong>{myOrchestrationKpis.retry_recovered} transações</strong> nos últimos 30 dias ({formatCurrency(myOrchestrationKpis.retry_recovered_brl)}) através de retry inteligente e failover entre adquirentes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <MyKpiCard label="APROVAÇÃO GLOBAL" value={formatPct(myOrchestrationKpis.global_approval_rate)} sub="vs 91% benchmark" icon={TrendingUp} accent="emerald" />
        <MyKpiCard label="VOLUME 30D" value={formatCurrency(myOrchestrationKpis.total_volume_30d).replace('R$', 'R$').slice(0, 12)} sub={`${(myOrchestrationKpis.total_routed_30d / 1000).toFixed(1)}k tx`} icon={Activity} accent="blue" />
        <MyKpiCard label="ADQ. PRIMÁRIA" value={`${myOrchestrationKpis.primary_acquirer_share}%`} sub="Cielo" accent="slate" />
        <MyKpiCard label="FAILOVERS 30D" value={myOrchestrationKpis.failover_events_30d} sub="recuperações" icon={Zap} accent="purple" />
        <MyKpiCard label="RETRY OK" value={myOrchestrationKpis.retry_recovered} sub="transações" accent="emerald" />
        <MyKpiCard label="$ RECUPERADO" value={formatCurrency(myOrchestrationKpis.retry_recovered_brl).slice(0, 12)} sub="via retry" accent="emerald" />
        <MyKpiCard label="LATÊNCIA MÉDIA" value="1.2s" sub="P50" accent="slate" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="acquirers">Adquirentes</TabsTrigger>
          <TabsTrigger value="rules">Regras de Roteamento</TabsTrigger>
          <TabsTrigger value="failovers">Histórico de Failover</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribuição por Método de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={myMethodBreakdown} dataKey="share" nameKey="method" outerRadius={90} label={(e) => `${e.method} ${e.share}%`}>
                      {myMethodBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Taxa de Aprovação por Método</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={myMethodBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="method" tick={{ fontSize: 11 }} />
                    <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="approval" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="acquirers" className="space-y-3 mt-6">
          {myAcquirerHealth.map((a) => (
            <Card key={a.acquirer}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-700">
                      {a.acquirer[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{a.acquirer}</span>
                        <Badge variant="outline">{ROLE_CFG[a.role]}</Badge>
                        <Badge className={STATUS_CFG[a.status].color}>{STATUS_CFG[a.status].label}</Badge>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Latência: {a.latency_ms}ms · Última incidência: {a.last_incident || 'sem incidentes'}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6 text-right">
                    <div>
                      <div className="text-[10px] uppercase text-slate-500">Share</div>
                      <div className="font-bold text-lg">{a.share}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-slate-500">Aprovação</div>
                      <div className="font-bold text-lg text-emerald-600">{formatPct(a.approval_rate)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-slate-500">Volume 30d</div>
                      <div className="font-bold text-lg">{formatCurrency(a.volume_30d).slice(0, 14)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="rules" className="space-y-2 mt-6">
          {myRoutingRules.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono">#{r.priority}</Badge>
                  <div>
                    <div className="font-semibold text-slate-900">{r.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      {r.primary} <ArrowRight className="w-3 h-3" /> {r.secondary}
                    </div>
                  </div>
                </div>
                <Badge className={r.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100'}>
                  {r.active ? 'Ativa' : 'Inativa'}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="failovers" className="space-y-3 mt-6">
          {myFailoverEvents.map((f) => (
            <Card key={f.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {f.from} <ArrowRight className="w-3 h-3 text-slate-400" /> {f.to}
                      </div>
                      <div className="text-xs text-slate-500">{f.timestamp.replace('T', ' às ').slice(0, 19)} · Motivo: {f.reason}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Recuperado</div>
                    <div className="font-bold text-emerald-600">{formatCurrency(f.recovered_brl)} ({f.transactions} tx)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Card className="bg-emerald-50 border-emerald-200">
        <CardContent className="p-5 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-slate-700">
            <strong>Garantia de Continuidade Operacional:</strong> Nossa orquestração mantém suas vendas funcionando mesmo durante instabilidades de adquirentes. Em caso de queda, redirecionamos automaticamente para a opção de failover sem perda transacional.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}