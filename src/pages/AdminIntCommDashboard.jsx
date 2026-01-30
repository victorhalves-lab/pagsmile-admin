import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Mail, Send, Eye, MousePointer, AlertTriangle, TrendingUp, TrendingDown, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { cn } from '@/lib/utils';

const kpis = [
  { label: 'Enviados', value: '12.456', icon: Send, change: '+15%', changeType: 'up', color: 'bg-blue-500' },
  { label: 'Entregues', value: '12.180', subValue: '97,8%', icon: CheckCircle2, change: '+0,3pp', changeType: 'up', color: 'bg-emerald-500' },
  { label: 'Abertos', value: '4.872', subValue: '40,0%', icon: Eye, change: '+2,1pp', changeType: 'up', color: 'bg-violet-500' },
  { label: 'Clicados', value: '1.218', subValue: '25,0%', icon: MousePointer, change: '-1,5pp', changeType: 'down', color: 'bg-amber-500' },
  { label: 'Bounces', value: '276', subValue: '2,2%', icon: AlertTriangle, change: '-0,5pp', changeType: 'down', isNegative: true, color: 'bg-red-500' },
];

const volumeData = [
  { week: 'Sem 1', value: 2800 },
  { week: 'Sem 2', value: 3200 },
  { week: 'Sem 3', value: 2900 },
  { week: 'Sem 4', value: 3500 },
];

const emailTypeData = [
  { name: 'Onboarding', value: 35, count: 4360, color: 'bg-blue-500' },
  { name: 'Transacional', value: 28, count: 3488, color: 'bg-emerald-500' },
  { name: 'Financeiro', value: 22, count: 2740, color: 'bg-violet-500' },
  { name: 'Risco/CB', value: 10, count: 1246, color: 'bg-amber-500' },
  { name: 'Sistema', value: 5, count: 622, color: 'bg-slate-400' },
];

const topTemplates = [
  { name: 'KYC Aprovado', rate: 62.3 },
  { name: 'Boas-vindas', rate: 58.1 },
  { name: 'Saque Processado', rate: 55.8 },
  { name: 'Primeira Transação', rate: 51.2 },
  { name: 'Credenciais API', rate: 48.9 },
];

const problems = [
  { type: 'error', message: '156 bounces de domínio @empresa.com', action: 'Verificar' },
  { type: 'warning', message: 'Email marketing@pagsmile.com com SPF inválido', action: 'Corrigir' },
  { type: 'warning', message: '23 e-mails em fila há mais de 1 hora', action: 'Ver fila' },
];

const topAutomations = [
  { name: 'Boas-vindas (Cadastro)', sent: 1234, delivery: 98.2, open: 58.1, status: 'active' },
  { name: 'Lembrete KYC (3 dias)', sent: 456, delivery: 97.5, open: 42.3, status: 'active' },
  { name: 'KYC Aprovado', sent: 892, delivery: 99.1, open: 62.3, status: 'active' },
  { name: 'Merchant Ativado', sent: 756, delivery: 98.8, open: 55.2, status: 'active' },
  { name: 'Saque Processado', sent: 2345, delivery: 97.9, open: 55.8, status: 'active' },
];

export default function AdminIntCommDashboard() {
  const [period, setPeriod] = useState('30d');

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard de Comunicação"
        subtitle="Visão geral de e-mails e métricas de engajamento"
        icon={Mail}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Comunicação' }
        ]}
        actions={
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => (
          <Card key={idx} className="relative overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", kpi.color)}>
                  <kpi.icon className="w-5 h-5 text-white" />
                </div>
                <Badge 
                  variant="outline"
                  className={cn(
                    "text-xs font-medium",
                    (kpi.changeType === 'up' && !kpi.isNegative) || (kpi.changeType === 'down' && kpi.isNegative)
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400'
                  )}
                >
                  {kpi.changeType === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {kpi.change}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{kpi.value}</p>
                {kpi.subValue && <p className="text-sm text-slate-500 dark:text-slate-400">{kpi.subValue}</p>}
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#2bc196]" />
              Volume de Envio
            </CardTitle>
            <CardDescription>Últimas 4 semanas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis dataKey="week" className="text-xs" tick={{ fill: '#64748b' }} />
                  <YAxis className="text-xs" tick={{ fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2bc196" 
                    strokeWidth={2.5}
                    dot={{ fill: '#2bc196', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Email Type Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#2bc196]" />
              Distribuição por Tipo
            </CardTitle>
            <CardDescription>Categorização dos e-mails enviados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emailTypeData.map((type, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{type.name}</span>
                    <span className="text-slate-500 dark:text-slate-400">{type.value}% ({type.count.toLocaleString()})</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all", type.color)}
                      style={{ width: `${type.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Templates */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#2bc196]" />
                Top 5 Templates
              </CardTitle>
              <CardDescription>Por taxa de abertura</CardDescription>
            </div>
            <Link to={createPageUrl('AdminIntCommTemplates')}>
              <Button variant="ghost" size="sm" className="text-[#2bc196] hover:text-[#239b7a] hover:bg-[#2bc196]/10">
                Ver todos <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topTemplates.map((tpl, idx) => (
                <div key={idx} className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{tpl.name}</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                    {tpl.rate}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Problems */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Problemas Recentes
              </CardTitle>
              <CardDescription>Requer atenção</CardDescription>
            </div>
            <Link to={createPageUrl('AdminIntCommLogs')}>
              <Button variant="ghost" size="sm" className="text-[#2bc196] hover:text-[#239b7a] hover:bg-[#2bc196]/10">
                Ver logs <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {problems.map((problem, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl",
                    problem.type === 'error' 
                      ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
                      : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={cn(
                      "w-4 h-4 mt-0.5",
                      problem.type === 'error' ? 'text-red-500' : 'text-amber-500'
                    )} />
                    <span className={cn(
                      "text-sm",
                      problem.type === 'error' ? 'text-red-700 dark:text-red-300' : 'text-amber-700 dark:text-amber-300'
                    )}>
                      {problem.message}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs h-7">
                    {problem.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Automations Table */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#2bc196]" />
              Automações Mais Ativas
            </CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </div>
          <Link to={createPageUrl('AdminIntCommAutomations')}>
            <Button variant="ghost" size="sm" className="text-[#2bc196] hover:text-[#239b7a] hover:bg-[#2bc196]/10">
              Ver todas <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Automação</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Enviados</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Entrega</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Abertura</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {topAutomations.map((auto, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-900 dark:text-white">{auto.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-600 dark:text-slate-400">{auto.sent.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right text-slate-600 dark:text-slate-400">{auto.delivery}%</td>
                    <td className="py-3.5 px-4 text-right text-slate-600 dark:text-slate-400">{auto.open}%</td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Ativa
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}