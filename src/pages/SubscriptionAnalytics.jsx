import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Download, Mail, Share2, ArrowLeftRight, Bell, FileText,
  TrendingUp, TrendingDown, Users, Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { toast } from 'sonner';

import PageHeader from '@/components/common/PageHeader';
import MRRMovementChart from '@/components/subscriptions/analytics/MRRMovementChart';
import SaasMetricsKpiBar from '@/components/subscriptions/analytics/SaasMetricsKpiBar';
import CohortMatrixAdvanced from '@/components/subscriptions/analytics/CohortMatrixAdvanced';
import ChurnReasonsAdvanced from '@/components/subscriptions/analytics/ChurnReasonsAdvanced';
import AnalyticsNarrative from '@/components/subscriptions/analytics/AnalyticsNarrative';
import MRRForecastCard from '@/components/subscriptions/analytics/MRRForecastCard';
import { buildMRRMovement, calcSaasMetrics, fmtCurrency } from '@/components/subscriptions/utils';

const churnByCycleData = [
  { cycle: '1º mês', rate: 18 }, { cycle: '2º mês', rate: 8 }, { cycle: '3º mês', rate: 5 },
  { cycle: '4º mês', rate: 3 }, { cycle: '5º mês', rate: 2 }, { cycle: '6º mês+', rate: 1.5 },
];

const churnByPlanData = [
  { name: 'Basic', value: 45, color: '#94a3b8' },
  { name: 'Starter', value: 30, color: '#3b82f6' },
  { name: 'Pro', value: 18, color: '#10b981' },
  { name: 'Premium', value: 7, color: '#8b5cf6' },
];

const trialConversionByLength = [
  { length: '7d', conversion: 18 }, { length: '14d', conversion: 28 },
  { length: '21d', conversion: 32 }, { length: '30d', conversion: 35 },
];

export default function SubscriptionAnalytics() {
  const [period, setPeriod] = useState('6m');

  useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => base44.entities.Subscription.list('-created_date', 500),
  });

  const movement = buildMRRMovement(period);
  const metrics = calcSaasMetrics(movement);

  return (
    <div className="space-y-3">
      <PageHeader
        title="Analytics SaaS-Grade"
        subtitle="MRR Movement, Quick Ratio, NRR/GRR, Cohort multi-dimensional"
        breadcrumbs={[{ label: 'Assinaturas', page: 'Subscriptions' }, { label: 'Analytics' }]}
        actions={
          <div className="flex gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="3m" className="text-xs">3 meses</SelectItem>
                <SelectItem value="6m" className="text-xs">6 meses</SelectItem>
                <SelectItem value="12m" className="text-xs">12 meses</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => toast.success('PDF Board Pack exportado')}>
              <FileText className="w-3.5 h-3.5 mr-1" /> Board Pack
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success('Report agendado')}>
              <Mail className="w-3.5 h-3.5 mr-1" /> Schedule
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success('Link compartilhado')}>
              <Share2 className="w-3.5 h-3.5 mr-1" /> Compartilhar
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success('Comparação ativa')}>
              <ArrowLeftRight className="w-3.5 h-3.5 mr-1" /> Comparar períodos
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success('Alerta criado')}>
              <Bell className="w-3.5 h-3.5 mr-1" /> Criar alerta
            </Button>
          </div>
        }
      />

      {/* KPIs SaaS-grade */}
      <SaasMetricsKpiBar metrics={metrics} />

      {/* Narrativa IA */}
      <AnalyticsNarrative />

      <Tabs defaultValue="mrr" className="space-y-3">
        <TabsList className="bg-white dark:bg-slate-900 border h-9">
          <TabsTrigger value="mrr" className="text-xs">MRR Movement</TabsTrigger>
          <TabsTrigger value="forecast" className="text-xs">Forecast</TabsTrigger>
          <TabsTrigger value="churn" className="text-xs">Churn Analysis</TabsTrigger>
          <TabsTrigger value="cohort" className="text-xs">Cohort</TabsTrigger>
          <TabsTrigger value="trials" className="text-xs">Trials & Conversion</TabsTrigger>
          <TabsTrigger value="ltv" className="text-xs">LTV & Unit Economics</TabsTrigger>
        </TabsList>

        {/* MRR MOVEMENT */}
        <TabsContent value="mrr" className="space-y-3">
          <MRRMovementChart data={movement} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">MRR total ao longo do tempo</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={movement.map((m, i) => ({ month: m.month, mrr: 50000 + i * 4000 + m.netNewMRR }))}>
                    <defs><linearGradient id="cMRR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.4} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => fmtCurrency(v)} />
                    <Area type="monotone" dataKey="mrr" stroke="#10b981" strokeWidth={2} fill="url(#cMRR)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">MRR por plano</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Basic', value: 7080, color: '#94a3b8' },
                        { name: 'Starter', value: 27768, color: '#3b82f6' },
                        { name: 'Pro', value: 26691, color: '#10b981' },
                        { name: 'Premium', value: 18000, color: '#8b5cf6' },
                      ]}
                      cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {[{ color: '#94a3b8' }, { color: '#3b82f6' }, { color: '#10b981' }, { color: '#8b5cf6' }].map((e, i) => (
                        <Cell key={i} fill={e.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => fmtCurrency(v)} />
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-[10px] text-slate-500 text-center">💡 Click em uma fatia para drill nos clientes</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FORECAST */}
        <TabsContent value="forecast" className="space-y-3">
          <MRRForecastCard baseMRR={metrics.mrr} growth={8.5} />
        </TabsContent>

        {/* CHURN */}
        <TabsContent value="churn" className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Churn por ciclo</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={churnByCycleData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="cycle" tick={{ fontSize: 10 }} width={70} />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Bar dataKey="rate" fill="#ef4444" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Churn por plano</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={churnByPlanData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                      {churnByPlanData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <ChurnReasonsAdvanced />

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Saved subscriptions (recuperadas pré-cancelamento)</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-50 rounded-lg text-center">
                  <p className="text-[10px] uppercase font-bold text-emerald-600">Salvas no mês</p>
                  <p className="text-2xl font-black text-emerald-700">14</p>
                  <p className="text-[10px] text-slate-500">de 56 ameaças</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-[10px] uppercase font-bold text-blue-600">MRR salvo</p>
                  <p className="text-2xl font-black text-blue-700">{fmtCurrency(4280, { short: true })}</p>
                  <p className="text-[10px] text-slate-500">25% taxa salvamento</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg text-center">
                  <p className="text-[10px] uppercase font-bold text-purple-600">Top tática</p>
                  <p className="text-base font-black text-purple-700">Desconto 20%</p>
                  <p className="text-[10px] text-slate-500">63% dos saves</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* COHORT */}
        <TabsContent value="cohort" className="space-y-3">
          <CohortMatrixAdvanced onCellClick={(row, m, v) => toast.info(`Cohort ${row.cohort} • M${m}: ${v}%`)} />
        </TabsContent>

        {/* TRIALS */}
        <TabsContent value="trials" className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-3">
                <p className="text-[10px] uppercase font-bold text-slate-500">Em trial</p>
                <p className="text-2xl font-black">38</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <p className="text-[10px] uppercase font-bold text-slate-500">Trial → Pago</p>
                <p className="text-2xl font-black text-emerald-600">28%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <p className="text-[10px] uppercase font-bold text-slate-500">Time to value</p>
                <p className="text-2xl font-black">3.2d</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <p className="text-[10px] uppercase font-bold text-slate-500">Expirando 7d</p>
                <p className="text-2xl font-black text-amber-600">12</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Heatmap: trial length × conversion</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={trialConversionByLength}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="length" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Bar dataKey="conversion" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[10px] text-emerald-600 mt-2 text-center">💡 14d é o sweet spot — máxima conversão sem custo de oportunidade alto</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LTV */}
        <TabsContent value="ltv" className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-3">
                <p className="text-[10px] uppercase font-bold text-slate-500">LTV médio</p>
                <p className="text-2xl font-black">{fmtCurrency(metrics.ltv, { short: true })}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">ARPU / Churn</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <p className="text-[10px] uppercase font-bold text-slate-500">CAC</p>
                <p className="text-2xl font-black">{fmtCurrency(metrics.cac, { precise: true })}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Customer Acquisition Cost</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <p className="text-[10px] uppercase font-bold text-slate-500">LTV:CAC</p>
                <p className="text-2xl font-black text-emerald-600">{(metrics.ltv / metrics.cac).toFixed(1)}x</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Saudável: &gt;3x</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <p className="text-[10px] uppercase font-bold text-slate-500">Magic Number</p>
                <p className="text-2xl font-black">{metrics.magicNumber.toFixed(2)}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Eficiência S&M</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">LTV decomposto por plano</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={[
                  { plan: 'Basic', ltv: 580 },
                  { plan: 'Starter', ltv: 1430 },
                  { plan: 'Pro', ltv: 7300 },
                  { plan: 'Premium', ltv: 53000 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="plan" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => fmtCurrency(v)} />
                  <Bar dataKey="ltv" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}