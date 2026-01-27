import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  RefreshCw,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Target,
  Clock,
  UserMinus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { cn } from '@/lib/utils';

import PageHeader from '@/components/common/PageHeader';
import KPICard from '@/components/dashboard/KPICard';

// Mock data for charts
const mrrData = [
  { month: 'Jul', mrr: 45000, novo: 5000, expansion: 2000, churn: -3000 },
  { month: 'Ago', mrr: 48000, novo: 6000, expansion: 1500, churn: -2500 },
  { month: 'Set', mrr: 52000, novo: 7000, expansion: 2500, churn: -3000 },
  { month: 'Out', mrr: 56000, novo: 8000, expansion: 1000, churn: -2500 },
  { month: 'Nov', mrr: 62000, novo: 9000, expansion: 2000, churn: -3500 },
  { month: 'Dez', mrr: 68000, novo: 10000, expansion: 2500, churn: -4000 },
];

const churnByCycleData = [
  { cycle: '1º mês', rate: 18 },
  { cycle: '2º mês', rate: 8 },
  { cycle: '3º mês', rate: 5 },
  { cycle: '4º mês', rate: 3 },
  { cycle: '5º mês', rate: 2 },
  { cycle: '6º mês+', rate: 1.5 },
];

const churnByPlanData = [
  { name: 'Básico', value: 45, color: '#94a3b8' },
  { name: 'Pro', value: 30, color: '#3b82f6' },
  { name: 'Premium', value: 25, color: '#8b5cf6' },
];

const cohortData = [
  { month: 'Jul/24', m1: 100, m2: 85, m3: 78, m4: 72, m5: 68, m6: 65 },
  { month: 'Ago/24', m1: 100, m2: 88, m3: 80, m4: 75, m5: 70, m6: null },
  { month: 'Set/24', m1: 100, m2: 90, m3: 82, m4: 77, m5: null, m6: null },
  { month: 'Out/24', m1: 100, m2: 87, m3: 79, m4: null, m5: null, m6: null },
  { month: 'Nov/24', m1: 100, m2: 89, m3: null, m4: null, m5: null, m6: null },
  { month: 'Dez/24', m1: 100, m2: null, m3: null, m4: null, m5: null, m6: null },
];

export default function SubscriptionAnalytics() {
  const [period, setPeriod] = useState('6months');

  const { data: subscriptions = [] } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => base44.entities.Subscription.list('-created_date', 500),
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  // Calculate metrics
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active' || s.status === 'trial');
  const mrr = activeSubscriptions.reduce((sum, s) => sum + (s.amount || 0), 0);
  const arr = mrr * 12;
  
  const cancelledThisMonth = subscriptions.filter(s => 
    s.status === 'cancelled' && 
    s.cancellation_date && 
    new Date(s.cancellation_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  
  const churnRate = subscriptions.length > 0 
    ? (cancelledThisMonth.length / subscriptions.length) * 100 
    : 0;
  
  const avgLTV = activeSubscriptions.reduce((sum, s) => sum + (s.total_paid || 0), 0) / (activeSubscriptions.length || 1);
  const avgCycles = activeSubscriptions.reduce((sum, s) => sum + (s.current_cycle || 1), 0) / (activeSubscriptions.length || 1);

  const trialSubscriptions = subscriptions.filter(s => s.status === 'trial');
  const convertedFromTrial = subscriptions.filter(s => s.status === 'active' && s.trial_end_date);
  const trialConversionRate = trialSubscriptions.length > 0 
    ? (convertedFromTrial.length / (trialSubscriptions.length + convertedFromTrial.length)) * 100 
    : 0;

  const getCellColor = (value) => {
    if (value === null) return 'bg-gray-100';
    if (value >= 80) return 'bg-green-500 text-white';
    if (value >= 60) return 'bg-green-300';
    if (value >= 40) return 'bg-yellow-300';
    if (value >= 20) return 'bg-orange-300';
    return 'bg-red-300';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics de Recorrência"
        subtitle="Métricas de MRR, Churn, LTV e análise de cohorts"
        breadcrumbs={[
          { label: 'Assinaturas', page: 'Subscriptions' },
          { label: 'Analytics' }
        ]}
        actions={
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Últimos 30 dias</SelectItem>
              <SelectItem value="3months">Últimos 3 meses</SelectItem>
              <SelectItem value="6months">Últimos 6 meses</SelectItem>
              <SelectItem value="12months">Últimos 12 meses</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* Main KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">MRR</p>
                <p className="text-3xl font-bold">{formatCurrency(mrr)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm">+12.5% vs mês anterior</span>
                </div>
              </div>
              <DollarSign className="w-10 h-10 text-emerald-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">ARR</p>
                <p className="text-3xl font-bold">{formatCurrency(arr)}</p>
                <p className="text-sm text-blue-100 mt-1">Receita anual projetada</p>
              </div>
              <Calendar className="w-10 h-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Assinantes Ativos</p>
                <p className="text-3xl font-bold">{activeSubscriptions.length}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm">+8 novos este mês</span>
                </div>
              </div>
              <Users className="w-10 h-10 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Churn Rate</p>
                <p className="text-3xl font-bold">{churnRate.toFixed(1)}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowDownRight className="w-4 h-4" />
                  <span className="text-sm">-0.5% vs mês anterior</span>
                </div>
              </div>
              <UserMinus className="w-10 h-10 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="LTV Médio"
          value={avgLTV}
          format="currency"
          icon={Target}
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
        />
        <KPICard
          title="Ciclos Médios"
          value={avgCycles}
          format="number"
          icon={RefreshCw}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
        <KPICard
          title="Trial → Pago"
          value={trialConversionRate}
          format="percentage"
          icon={TrendingUp}
          iconBg="bg-cyan-100"
          iconColor="text-cyan-600"
        />
        <KPICard
          title="Em Trial"
          value={trialSubscriptions.length}
          format="number"
          icon={Clock}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />
      </div>

      <Tabs defaultValue="mrr" className="space-y-6">
        <TabsList className="bg-white border">
          <TabsTrigger value="mrr">Evolução MRR</TabsTrigger>
          <TabsTrigger value="churn">Análise de Churn</TabsTrigger>
          <TabsTrigger value="cohort">Cohort Analysis</TabsTrigger>
        </TabsList>

        {/* MRR Evolution */}
        <TabsContent value="mrr" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evolução do MRR</CardTitle>
              <CardDescription>Receita recorrente mensal e suas componentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mrrData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(v) => `R$${v/1000}k`} />
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Legend />
                    <Area type="monotone" dataKey="mrr" name="MRR Total" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Net New MRR</CardTitle>
                <CardDescription>Breakdown por tipo de movimento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mrrData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(v) => `R$${v/1000}k`} />
                      <Tooltip formatter={(v) => formatCurrency(v)} />
                      <Legend />
                      <Bar dataKey="novo" name="Novo" fill="#22c55e" />
                      <Bar dataKey="expansion" name="Expansão" fill="#3b82f6" />
                      <Bar dataKey="churn" name="Churn" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>MRR por Plano</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Básico', value: 15000, color: '#94a3b8' },
                          { name: 'Pro', value: 30000, color: '#3b82f6' },
                          { name: 'Premium', value: 23000, color: '#8b5cf6' },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {[
                          { name: 'Básico', value: 15000, color: '#94a3b8' },
                          { name: 'Pro', value: 30000, color: '#3b82f6' },
                          { name: 'Premium', value: 23000, color: '#8b5cf6' },
                        ].map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => formatCurrency(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Churn Analysis */}
        <TabsContent value="churn" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Churn por Ciclo</CardTitle>
                <CardDescription>Em qual ciclo os assinantes mais cancelam</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={churnByCycleData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(v) => `${v}%`} />
                      <YAxis type="category" dataKey="cycle" width={80} />
                      <Tooltip formatter={(v) => `${v}%`} />
                      <Bar dataKey="rate" name="Taxa de Churn" fill="#ef4444" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Churn por Plano</CardTitle>
                <CardDescription>Distribuição dos cancelamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={churnByPlanData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {churnByPlanData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Principais Motivos de Cancelamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { reason: 'Não utiliza mais o serviço', count: 45, percentage: 35 },
                  { reason: 'Preço muito alto', count: 32, percentage: 25 },
                  { reason: 'Encontrou alternativa melhor', count: 20, percentage: 15 },
                  { reason: 'Falha de pagamento (involuntário)', count: 18, percentage: 14 },
                  { reason: 'Outros', count: 15, percentage: 11 },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.reason}</span>
                        <span className="text-gray-500">{item.count} ({item.percentage}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-400 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cohort Analysis */}
        <TabsContent value="cohort">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Cohort - Retenção</CardTitle>
              <CardDescription>Percentual de retenção por mês de aquisição</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-2 text-sm font-medium text-gray-500">Cohort</th>
                      <th className="text-center p-2 text-sm font-medium text-gray-500">Mês 1</th>
                      <th className="text-center p-2 text-sm font-medium text-gray-500">Mês 2</th>
                      <th className="text-center p-2 text-sm font-medium text-gray-500">Mês 3</th>
                      <th className="text-center p-2 text-sm font-medium text-gray-500">Mês 4</th>
                      <th className="text-center p-2 text-sm font-medium text-gray-500">Mês 5</th>
                      <th className="text-center p-2 text-sm font-medium text-gray-500">Mês 6</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cohortData.map((row, idx) => (
                      <tr key={idx}>
                        <td className="p-2 text-sm font-medium">{row.month}</td>
                        <td className={cn("p-2 text-center text-sm rounded", getCellColor(row.m1))}>
                          {row.m1 !== null ? `${row.m1}%` : '-'}
                        </td>
                        <td className={cn("p-2 text-center text-sm rounded", getCellColor(row.m2))}>
                          {row.m2 !== null ? `${row.m2}%` : '-'}
                        </td>
                        <td className={cn("p-2 text-center text-sm rounded", getCellColor(row.m3))}>
                          {row.m3 !== null ? `${row.m3}%` : '-'}
                        </td>
                        <td className={cn("p-2 text-center text-sm rounded", getCellColor(row.m4))}>
                          {row.m4 !== null ? `${row.m4}%` : '-'}
                        </td>
                        <td className={cn("p-2 text-center text-sm rounded", getCellColor(row.m5))}>
                          {row.m5 !== null ? `${row.m5}%` : '-'}
                        </td>
                        <td className={cn("p-2 text-center text-sm rounded", getCellColor(row.m6))}>
                          {row.m6 !== null ? `${row.m6}%` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <span>Legenda:</span>
                <div className="flex items-center gap-1"><div className="w-4 h-4 bg-green-500 rounded" /> 80%+</div>
                <div className="flex items-center gap-1"><div className="w-4 h-4 bg-green-300 rounded" /> 60-80%</div>
                <div className="flex items-center gap-1"><div className="w-4 h-4 bg-yellow-300 rounded" /> 40-60%</div>
                <div className="flex items-center gap-1"><div className="w-4 h-4 bg-orange-300 rounded" /> 20-40%</div>
                <div className="flex items-center gap-1"><div className="w-4 h-4 bg-red-300 rounded" /> &lt;20%</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}