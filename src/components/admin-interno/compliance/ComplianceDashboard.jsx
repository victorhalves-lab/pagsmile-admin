import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import MetricImpactCard from '@/components/common/MetricImpactCard';
import {
  Brain, CheckCircle2, XCircle, Users, FileText, AlertTriangle,
  TrendingUp, TrendingDown, Sparkles, ArrowRight, BarChart3, PieChart,
  Timer, Shield, Target, Zap, Clock
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#2bc196', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

// Mock data
const kpiData = {
  totalSubmissions: 1247,
  aiApproved: 892,
  aiRejected: 156,
  manualReview: 199,
  avgAiTime: '2.3s',
  avgManualTime: '4.2h',
  avgRiskScore: 72,
  pendingDocs: 34
};

const funnelData = [
  { name: 'Submissões', value: 1247, fill: '#3b82f6' },
  { name: 'Análise IA', value: 1213, fill: '#8b5cf6' },
  { name: 'Aprovadas IA', value: 892, fill: '#2bc196' },
  { name: 'Manual Review', value: 199, fill: '#f59e0b' },
  { name: 'Aprovadas Final', value: 1048, fill: '#10b981' },
];

const statusDistribution = [
  { name: 'Aprovado IA', value: 892, color: '#2bc196' },
  { name: 'Reprovado IA', value: 156, color: '#ef4444' },
  { name: 'Review Manual', value: 199, color: '#f59e0b' },
];

const trendData = [
  { month: 'Jul', ia: 120, manual: 45 },
  { month: 'Ago', ia: 145, manual: 38 },
  { month: 'Set', ia: 168, manual: 42 },
  { month: 'Out', ia: 189, manual: 35 },
  { month: 'Nov', ia: 210, manual: 28 },
  { month: 'Dez', ia: 234, manual: 22 },
];

const rejectionReasons = [
  { reason: 'Documento Inválido', count: 45 },
  { reason: 'Dados Inconsistentes', count: 38 },
  { reason: 'Alto Risco Fraude', count: 32 },
  { reason: 'PEP Não Declarado', count: 24 },
  { reason: 'Atividade Suspeita', count: 17 },
];

const riskDistribution = [
  { range: 'Baixo (80-100)', count: 456, color: '#2bc196' },
  { range: 'Médio (60-79)', count: 389, color: '#f59e0b' },
  { range: 'Alto (40-59)', count: 267, color: '#f97316' },
  { range: 'Crítico (0-39)', count: 135, color: '#ef4444' },
];

const helenaAlerts = [
  { type: 'warning', message: '12 submissões aguardando análise manual há mais de 24h', action: 'Ver fila' },
  { type: 'info', message: 'Taxa de aprovação automática aumentou 8% esta semana', action: 'Ver métricas' },
  { type: 'critical', message: '3 merchants com score crítico detectados hoje', action: 'Analisar' },
  { type: 'success', message: 'Tempo médio de análise manual reduziu 15%', action: 'Detalhes' },
];

export default function ComplianceDashboard() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-900 border-blue-100 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Submissões</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{kpiData.totalSubmissions.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1 text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12% vs mês anterior</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-slate-900 border-green-100 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Aprovadas (Helena)</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{kpiData.aiApproved}</p>
                <p className="text-sm text-green-600 mt-1">{((kpiData.aiApproved / kpiData.totalSubmissions) * 100).toFixed(1)}% automático</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-slate-900 border-amber-100 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Em Análise Manual</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{kpiData.manualReview}</p>
                <p className="text-sm text-amber-600 mt-1">{((kpiData.manualReview / kpiData.totalSubmissions) * 100).toFixed(1)}% do total</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-slate-900 border-red-100 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Reprovadas (Helena)</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{kpiData.aiRejected}</p>
                <p className="text-sm text-red-600 mt-1">{((kpiData.aiRejected / kpiData.totalSubmissions) * 100).toFixed(1)}% rejeitado</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metric Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricImpactCard
          metricName="Tempo de Conclusão"
          before={7}
          after={0.5}
          unit=" dias"
          description="Redução de 93% no tempo de onboarding"
          target={0.25}
        />
        <MetricImpactCard
          metricName="Taxa de Conversão"
          before={35}
          after={85}
          unit="%"
          description="Aumento de 142% na conclusão"
          target={90}
        />
        <MetricImpactCard
          metricName="NPS do Processo"
          before={20}
          after={82}
          unit=" pts"
          description="Satisfação excepcional"
          target={80}
        />
        <MetricImpactCard
          metricName="Custo por Onboarding"
          before={150}
          after={5}
          unit=" R$"
          description="Redução de 96.7% em custos"
          target={3}
        />
      </div>

      {/* Second Row KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Tempo Médio (IA)</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{kpiData.avgAiTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                <Timer className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Tempo Médio (Manual)</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{kpiData.avgManualTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center">
                <Target className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Score Médio Carteira</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{kpiData.avgRiskScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Docs Pendentes</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{kpiData.pendingDocs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Helena Insights */}
      <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50/50 to-white dark:from-purple-900/20 dark:to-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            Helena Insights & Alertas
          </CardTitle>
          <CardDescription>Alertas e recomendações em tempo real da IA</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {helenaAlerts.map((alert, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  alert.type === 'critical' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' :
                  alert.type === 'warning' ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800' :
                  alert.type === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
                  'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {alert.type === 'critical' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                  {alert.type === 'warning' && <Clock className="w-5 h-5 text-amber-600" />}
                  {alert.type === 'success' && <TrendingUp className="w-5 h-5 text-green-600" />}
                  {alert.type === 'info' && <Brain className="w-5 h-5 text-blue-600" />}
                  <span className="text-sm text-slate-700 dark:text-slate-300">{alert.message}</span>
                </div>
                <Button variant="ghost" size="sm" className="text-xs">
                  {alert.action} <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-slate-500" />
              Funil de Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart className="w-5 h-5 text-slate-500" />
              Distribuição por Status (Helena)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RechartsPie>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tendência de Análises (IA vs Manual)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ia" stroke="#2bc196" strokeWidth={2} name="Análises IA" />
                <Line type="monotone" dataKey="manual" stroke="#f59e0b" strokeWidth={2} name="Análises Manual" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rejection Reasons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top 5 Causas de Reprovação (Helena)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={rejectionReasons} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="reason" type="category" width={130} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Risk Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-5 h-5 text-slate-500" />
            Distribuição de Risco da Carteira
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {riskDistribution.map((item, idx) => (
              <div key={idx} className="text-center">
                <div 
                  className="h-32 rounded-lg flex items-end justify-center pb-2 mb-2"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <div 
                    className="w-16 rounded-t-lg transition-all duration-500"
                    style={{ 
                      height: `${(item.count / 500) * 100}%`,
                      backgroundColor: item.color 
                    }}
                  />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.range}</p>
                <p className="text-2xl font-bold" style={{ color: item.color }}>{item.count}</p>
                <p className="text-xs text-slate-500">clientes</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}