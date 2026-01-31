import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Gavel, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  Clock,
  Zap,
  Settings,
  Target,
  BarChart3,
  Sparkles,
  Search,
  Filter,
  Eye,
  Store,
  Shield,
  FileText,
  Brain,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts';

export default function AdminIntDisputeManager() {
  // Global KPIs
  const globalKpis = {
    totalDisputes: 847,
    openDisputes: 156,
    totalValueAtRisk: 'R$ 2.8M',
    globalWinRate: '68.5%',
    avgResolutionTime: '7.2 dias',
    potentialRecovery: 'R$ 1.92M'
  };

  // Top merchants by dispute volume
  const topMerchants = [
    { name: 'GameZone Digital', disputes: 45, value: 234000, winRate: 52, ratio: 1.8, status: 'critical' },
    { name: 'TechStore Brasil', disputes: 32, value: 178000, winRate: 72, ratio: 0.9, status: 'good' },
    { name: 'Fashion Express', disputes: 28, value: 145000, winRate: 68, ratio: 1.1, status: 'attention' },
    { name: 'Pharma Online', disputes: 18, value: 92000, winRate: 78, ratio: 0.6, status: 'excellent' },
    { name: 'Auto Parts Hub', disputes: 15, value: 87000, winRate: 45, ratio: 1.5, status: 'critical' }
  ];

  // Dispute by type
  const disputeTypes = [
    { type: 'Fraude', count: 312, value: 1.2, winRate: 58 },
    { type: 'Produto não recebido', count: 245, value: 0.8, winRate: 72 },
    { type: 'Não reconhece', count: 178, value: 0.5, winRate: 65 },
    { type: 'Duplicada', count: 67, value: 0.2, winRate: 85 },
    { type: 'Outros', count: 45, value: 0.1, winRate: 70 }
  ];

  // Monthly evolution
  const monthlyEvolution = [
    { month: 'Set', disputes: 145, won: 95, ratio: 0.92 },
    { month: 'Out', disputes: 162, won: 108, ratio: 0.98 },
    { month: 'Nov', disputes: 178, won: 118, ratio: 1.05 },
    { month: 'Dez', disputes: 198, won: 132, ratio: 1.12 },
    { month: 'Jan', disputes: 164, won: 112, ratio: 0.95 }
  ];

  // Urgent disputes
  const urgentDisputes = [
    { id: 'CB-001', merchant: 'GameZone Digital', value: 12500, deadline: 2, winProb: 78 },
    { id: 'CB-002', merchant: 'Fashion Express', value: 8900, deadline: 3, winProb: 65 },
    { id: 'CB-003', merchant: 'TechStore Brasil', value: 15200, deadline: 1, winProb: 82 }
  ];

  const getStatusBadge = (status) => {
    const configs = {
      excellent: { label: 'Excelente', className: 'bg-green-100 text-green-700' },
      good: { label: 'Bom', className: 'bg-blue-100 text-blue-700' },
      attention: { label: 'Atenção', className: 'bg-amber-100 text-amber-700' },
      critical: { label: 'Crítico', className: 'bg-red-100 text-red-700' }
    };
    const config = configs[status] || configs.attention;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/25">
            <Gavel className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dispute Manager</h1>
            <p className="text-slate-500 dark:text-slate-400">Visão Consolidada - Gestão de Disputas e Chargebacks</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            {globalKpis.openDisputes} disputas abertas
          </Badge>
          <Link to={createPageUrl('AdminIntDisputeManagerSettings')}>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
          </Link>
        </div>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500">Total Disputas</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{globalKpis.totalDisputes}</p>
          <p className="text-xs text-slate-500">{globalKpis.openDisputes} abertas</p>
        </Card>

        <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-red-600" />
            <span className="text-xs text-red-600">Valor em Risco</span>
          </div>
          <p className="text-2xl font-bold text-red-700">{globalKpis.totalValueAtRisk}</p>
        </Card>

        <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-600">Win Rate Global</span>
          </div>
          <p className="text-2xl font-bold text-green-700">{globalKpis.globalWinRate}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500">Tempo Médio</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{globalKpis.avgResolutionTime}</p>
        </Card>

        <Card className="p-4 bg-[#2bc196]/10 border-[#2bc196]/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-[#2bc196]" />
            <span className="text-xs text-[#2bc196]">Recuperação Potencial</span>
          </div>
          <p className="text-2xl font-bold text-[#2bc196]">{globalKpis.potentialRecovery}</p>
        </Card>

        <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-amber-600">Urgentes</span>
          </div>
          <p className="text-2xl font-bold text-amber-700">{urgentDisputes.length}</p>
          <p className="text-xs text-amber-600">prazo &lt; 3 dias</p>
        </Card>
      </div>

      {/* Urgent Disputes Alert */}
      {urgentDisputes.length > 0 && (
        <Card className="border-red-200 bg-red-50/50 dark:bg-red-900/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-700">Disputas Urgentes - Ação Necessária</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {urgentDisputes.map((dispute) => (
                <div key={dispute.id} className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{dispute.id}</span>
                    <Badge variant="outline" className="border-red-500 text-red-600">{dispute.deadline}d</Badge>
                  </div>
                  <p className="text-sm text-slate-600">{dispute.merchant}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-semibold">R$ {(dispute.value).toLocaleString()}</span>
                    <Badge className="bg-green-100 text-green-700">{dispute.winProb}% prob.</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="merchants">Por Merchant</TabsTrigger>
          <TabsTrigger value="types">Por Tipo</TabsTrigger>
          <TabsTrigger value="ai">AI Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Evolution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Evolução Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyEvolution}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="disputes" stroke="#ef4444" strokeWidth={2} name="Disputas" />
                    <Line type="monotone" dataKey="won" stroke="#22c55e" strokeWidth={2} name="Ganhas" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Dispute Types Pie */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={disputeTypes}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                    >
                      {disputeTypes.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Merchants Tab */}
        <TabsContent value="merchants" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>Disputas por Merchant</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Buscar merchant..." className="pl-9 w-64" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topMerchants.map((merchant, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      merchant.status === 'critical' ? 'border-red-200 bg-red-50/50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Store className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{merchant.name}</p>
                        <p className="text-sm text-slate-500">
                          {merchant.disputes} disputas • R$ {(merchant.value / 1000).toFixed(0)}k
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">{merchant.winRate}%</p>
                        <p className="text-xs text-slate-500">Win Rate</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-lg font-bold ${merchant.ratio > 1.2 ? 'text-red-600' : 'text-slate-900'}`}>
                          {merchant.ratio}%
                        </p>
                        <p className="text-xs text-slate-500">CB Ratio</p>
                      </div>
                      {getStatusBadge(merchant.status)}
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Types Tab */}
        <TabsContent value="types" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {disputeTypes.map((type, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{type.type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Quantidade:</span>
                      <span className="font-medium">{type.count}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Valor:</span>
                      <span className="font-medium">R$ {type.value}M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Win Rate:</span>
                      <Badge className="bg-green-100 text-green-700">{type.winRate}%</Badge>
                    </div>
                    <Progress value={type.winRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai" className="space-y-6">
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-900/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Análise Inteligente de Disputas</h3>
                  <p className="text-sm text-slate-500">Insights gerados pelo Dispute Manager AI</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h4 className="font-medium">Merchants em Risco</h4>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <strong>2 merchants</strong> com chargeback ratio acima de 1.5%. 
                    GameZone Digital requer ação imediata.
                  </p>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <h4 className="font-medium">Oportunidade de Contestação</h4>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <strong>23 disputas</strong> com probabilidade de ganho &gt;80% aguardando ação. 
                    Valor potencial: <strong>R$ 145.000</strong>
                  </p>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <h4 className="font-medium">Padrão Identificado</h4>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Aumento de 34% em disputas de "Produto não recebido" em janeiro.
                    Recomendação: revisar processo de tracking.
                  </p>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-purple-500" />
                    <h4 className="font-medium">Dossiês Pendentes</h4>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <strong>8 dossiês</strong> de contestação prontos para envio.
                    Prazo médio: 4 dias.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}