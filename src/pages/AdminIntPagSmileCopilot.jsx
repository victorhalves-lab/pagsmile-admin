import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  DollarSign,
  Users,
  BarChart3,
  Target,
  Lightbulb,
  Clock,
  RefreshCw,
  Settings,
  Zap,
  PieChart,
  Activity,
  FileText,
  Bell,
  Eye,
  ChevronRight,
  Calendar,
  Store,
  Shield,
  TrendingDown as TrendDown,
  Search,
  Brain,
  Percent,
  Building2,
  Scale
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

export default function AdminIntPagSmileCopilot() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  // Executive Summary Data
  const executiveSummary = {
    totalTPV: 'R$ 47.3M',
    tpvChange: '+12.4%',
    activeMerchants: 1247,
    merchantsChange: '+23',
    totalRevenue: 'R$ 892.450',
    revenueChange: '+8.7%',
    avgMargin: '1.89%',
    marginChange: '-0.02%',
    chargebackRatio: '0.87%',
    chargebackChange: '+0.12%'
  };

  // Top Merchants by Margin
  const topMerchantsByMargin = [
    { name: 'TechStore Brasil', margin: 'R$ 45.230', tpv: 'R$ 2.4M', rate: '1.88%', trend: 'up' },
    { name: 'Fashion Express', margin: 'R$ 38.920', tpv: 'R$ 1.9M', rate: '2.05%', trend: 'up' },
    { name: 'GameZone Digital', margin: 'R$ 32.150', tpv: 'R$ 1.7M', rate: '1.89%', trend: 'down' },
    { name: 'Pharma Online', margin: 'R$ 28.780', tpv: 'R$ 1.5M', rate: '1.92%', trend: 'up' },
    { name: 'Auto Parts Hub', margin: 'R$ 25.340', tpv: 'R$ 1.3M', rate: '1.95%', trend: 'stable' }
  ];

  // Rate Optimization Suggestions
  const rateOptimizations = [
    {
      id: 1,
      cluster: 'E-commerce Alto Volume',
      merchantCount: 45,
      currentAvgRate: '1.85%',
      suggestedRate: '1.92%',
      potentialRevenue: '+R$ 23.450/mês',
      churnRisk: 'low',
      npsImpact: '-2 pts'
    },
    {
      id: 2,
      cluster: 'Marketplaces',
      merchantCount: 12,
      currentAvgRate: '2.10%',
      suggestedRate: '1.95%',
      potentialRevenue: '-R$ 8.200/mês',
      churnRisk: 'high',
      npsImpact: '+5 pts',
      reason: 'Retenção de clientes estratégicos'
    },
    {
      id: 3,
      cluster: 'SaaS/Recorrência',
      merchantCount: 89,
      currentAvgRate: '1.75%',
      suggestedRate: '1.82%',
      potentialRevenue: '+R$ 15.780/mês',
      churnRisk: 'medium',
      npsImpact: '-1 pt'
    }
  ];

  // Operational Insights
  const operationalInsights = [
    {
      id: 1,
      type: 'warning',
      title: '3 merchants com chargeback ratio alto',
      description: 'GameZone Digital, Loja X e Store Y ultrapassaram 1.5% de chargeback ratio.',
      action: 'Revisar políticas',
      actionPage: 'AdminIntRiskDashboard',
      priority: 'high'
    },
    {
      id: 2,
      type: 'opportunity',
      title: '5 leads qualificados aguardando proposta',
      description: 'Leads com fit score >80 e volume estimado de R$ 2.1M/mês.',
      action: 'Ver leads',
      actionPage: 'AdminIntMerchantsList',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'info',
      title: '12 validações de KYC pendentes',
      description: 'Média de tempo em fila: 4.2 horas. SLA: 8 horas.',
      action: 'Ir para fila',
      actionPage: 'AdminIntComplianceQueue',
      priority: 'medium'
    },
    {
      id: 4,
      type: 'success',
      title: 'Taxa de aprovação global melhorou',
      description: 'De 91.2% para 93.8% nos últimos 7 dias.',
      action: 'Ver análise',
      actionPage: 'AdminIntTransactionsDashboard',
      priority: 'low'
    }
  ];

  // Portfolio Health
  const portfolioHealth = {
    healthy: { count: 892, percentage: 71.5, gmv: 'R$ 33.8M' },
    attention: { count: 245, percentage: 19.6, gmv: 'R$ 9.2M' },
    critical: { count: 78, percentage: 6.3, gmv: 'R$ 3.1M' },
    blocked: { count: 32, percentage: 2.6, gmv: 'R$ 1.2M' }
  };

  // Smart Alerts
  const smartAlerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Merchant TechStore com volume 300% acima da média',
      message: 'Volume diário saltou de R$ 80k para R$ 320k. Verificar possível fraude ou evento especial.',
      timestamp: '15 min atrás'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Concentração de risco detectada',
      message: '23% do TPV concentrado em 3 merchants. Diversificação recomendada.',
      timestamp: '2 horas atrás'
    },
    {
      id: 3,
      type: 'info',
      title: 'Novo recorde de transações PIX',
      message: 'Ontem processamos 45.230 transações PIX, maior volume da história.',
      timestamp: '1 dia atrás'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">PagSmile Copilot</h1>
            <p className="text-slate-500 dark:text-slate-400">Copiloto Interno para Gestão de Operações</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Monitorando 1.247 merchants</span>
          </div>
          <Link to={createPageUrl('AdminIntPagSmileCopilotSettings')}>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
          </Link>
        </div>
      </div>

      {/* Executive Summary */}
      <Card className="border-purple-500/20 bg-gradient-to-br from-white to-purple-50/50 dark:from-slate-900 dark:to-purple-900/10">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-lg">Resumo Executivo</CardTitle>
          </div>
          <CardDescription>Visão consolidada da operação PagSmile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500">TPV Total</span>
                <Badge variant="default" className="text-xs bg-purple-500">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {executiveSummary.tpvChange}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{executiveSummary.totalTPV}</p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500">Merchants Ativos</span>
                <Badge variant="default" className="text-xs bg-green-500">
                  {executiveSummary.merchantsChange}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{executiveSummary.activeMerchants}</p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500">Receita</span>
                <Badge variant="default" className="text-xs bg-purple-500">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {executiveSummary.revenueChange}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{executiveSummary.totalRevenue}</p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500">Margem Média</span>
                <Badge variant="outline" className="text-xs border-amber-500 text-amber-600">
                  {executiveSummary.marginChange}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{executiveSummary.avgMargin}</p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500">Chargeback Ratio</span>
                <Badge variant="outline" className="text-xs border-red-500 text-red-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {executiveSummary.chargebackChange}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{executiveSummary.chargebackRatio}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operational Insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <CardTitle>Insights Operacionais</CardTitle>
          </div>
          <CardDescription>Alertas e oportunidades identificados pelo PagSmile Copilot</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {operationalInsights.map((insight) => (
              <div 
                key={insight.id}
                className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                  insight.type === 'warning' 
                    ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10' 
                    : insight.type === 'opportunity'
                    ? 'border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-900/10'
                    : insight.type === 'success'
                    ? 'border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-900/10'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    insight.type === 'warning' 
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' 
                      : insight.type === 'opportunity'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                      : insight.type === 'success'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                  }`}>
                    {insight.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                    {insight.type === 'opportunity' && <Lightbulb className="w-5 h-5" />}
                    {insight.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                    {insight.type === 'info' && <Activity className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{insight.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{insight.description}</p>
                    <Link to={createPageUrl(insight.actionPage)}>
                      <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-600 hover:bg-purple-50">
                        {insight.action}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Merchants by Margin */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <CardTitle>Top Merchants por Margem</CardTitle>
              </div>
              <Link to={createPageUrl('AdminIntClientProfitability')}>
                <Button variant="ghost" size="sm">Ver todos</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topMerchantsByMargin.map((merchant, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{merchant.name}</p>
                      <p className="text-xs text-slate-500">TPV: {merchant.tpv} • Taxa: {merchant.rate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">{merchant.margin}</p>
                    {merchant.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500 inline" />}
                    {merchant.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500 inline" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Health */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <CardTitle>Saúde do Portfólio</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Saudáveis', data: portfolioHealth.healthy, color: 'bg-green-500' },
                { label: 'Atenção', data: portfolioHealth.attention, color: 'bg-amber-500' },
                { label: 'Críticos', data: portfolioHealth.critical, color: 'bg-red-500' },
                { label: 'Bloqueados', data: portfolioHealth.blocked, color: 'bg-slate-500' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-slate-600 dark:text-slate-400">{item.label}</div>
                  <div className="flex-1">
                    <div className="h-8 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-lg flex items-center justify-between px-3`}
                        style={{ width: `${Math.max(item.data.percentage, 10)}%` }}
                      >
                        <span className="text-xs font-medium text-white">{item.data.count}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-20 text-right text-sm font-medium text-slate-900 dark:text-white">
                    {item.data.gmv}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rate Optimization Suggestions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-600" />
            <CardTitle>Sugestões de Otimização de Taxa</CardTitle>
          </div>
          <CardDescription>Análise de clusters de merchants com sugestões de ajuste de taxas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="text-left p-3 text-xs font-medium text-slate-500">Cluster</th>
                  <th className="text-center p-3 text-xs font-medium text-slate-500">Merchants</th>
                  <th className="text-center p-3 text-xs font-medium text-slate-500">Taxa Atual</th>
                  <th className="text-center p-3 text-xs font-medium text-slate-500">Taxa Sugerida</th>
                  <th className="text-center p-3 text-xs font-medium text-slate-500">Impacto Receita</th>
                  <th className="text-center p-3 text-xs font-medium text-slate-500">Risco Churn</th>
                  <th className="text-center p-3 text-xs font-medium text-slate-500">Impacto NPS</th>
                  <th className="text-center p-3 text-xs font-medium text-slate-500">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rateOptimizations.map((opt) => (
                  <tr key={opt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3">
                      <p className="font-medium text-slate-900 dark:text-white">{opt.cluster}</p>
                      {opt.reason && <p className="text-xs text-slate-500">{opt.reason}</p>}
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="outline">{opt.merchantCount}</Badge>
                    </td>
                    <td className="p-3 text-center font-medium">{opt.currentAvgRate}</td>
                    <td className="p-3 text-center">
                      <Badge className={
                        parseFloat(opt.suggestedRate) > parseFloat(opt.currentAvgRate)
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }>
                        {opt.suggestedRate}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <span className={
                        opt.potentialRevenue.startsWith('+') ? 'text-green-600 font-medium' : 'text-red-600 font-medium'
                      }>
                        {opt.potentialRevenue}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className={
                        opt.churnRisk === 'low' ? 'border-green-500 text-green-600' :
                        opt.churnRisk === 'medium' ? 'border-amber-500 text-amber-600' :
                        'border-red-500 text-red-600'
                      }>
                        {opt.churnRisk === 'low' ? 'Baixo' : opt.churnRisk === 'medium' ? 'Médio' : 'Alto'}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <span className={
                        opt.npsImpact.startsWith('+') ? 'text-green-600' : 'text-amber-600'
                      }>
                        {opt.npsImpact}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-600">
                        Simular
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Smart Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-600" />
            <CardTitle>Alertas em Tempo Real</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {smartAlerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-4 rounded-lg border ${
                  alert.type === 'critical' 
                    ? 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/10' 
                    : alert.type === 'warning'
                    ? 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/10'
                    : 'border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {alert.type === 'critical' && <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />}
                    {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />}
                    {alert.type === 'info' && <Activity className="w-5 h-5 text-blue-500 mt-0.5" />}
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{alert.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{alert.message}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{alert.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            <CardTitle>Navegação Rápida</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to={createPageUrl('AdminIntRecoveryAgent')}>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group">
                <RefreshCw className="w-8 h-8 text-purple-600 mb-2 group-hover:rotate-180 transition-transform duration-500" />
                <p className="font-medium text-slate-900 dark:text-white">Recovery Agent</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Recuperação de pagamentos</p>
              </div>
            </Link>
            <Link to={createPageUrl('AdminIntDisputeManager')}>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group">
                <Shield className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-slate-900 dark:text-white">Dispute Manager</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Gestão de disputas</p>
              </div>
            </Link>
            <Link to={createPageUrl('AdminIntIdentityOnboarder')}>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group">
                <Users className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-slate-900 dark:text-white">Identity Onboarder</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">KYC/KYB Copilot</p>
              </div>
            </Link>
            <Link to={createPageUrl('AdminIntConverterAgent')}>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer group">
                <TrendingUp className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-slate-900 dark:text-white">Converter Agent</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Otimização de checkout</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}