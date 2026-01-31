import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Shuffle, 
  TrendingUp, 
  TrendingDown,
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
  Users,
  Smartphone,
  Monitor,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import AgentChatInterface from '@/components/agents/AgentChatInterface';
import AgentFloatingButton from '@/components/agents/AgentFloatingButton';
import { processConverterAgentAdminMessage, converterAgentAdminQuickPrompts } from '@/components/agents/ConverterAgentChatLogic';

export default function AdminIntConverterAgent() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Global KPIs
  const globalKpis = {
    avgConversion: '74.2%',
    conversionChange: '+5.8%',
    avgAbandon: '25.8%',
    abandonChange: '-4.2%',
    activeMerchants: 892,
    activeExperiments: 23,
    incrementalRevenue: 'R$ 1.2M',
    avgCheckoutTime: '52s'
  };

  // Top merchants by conversion
  const topMerchants = [
    { name: 'TechStore Brasil', conversion: 82, abandon: 18, experiments: 3, lift: '+8%', status: 'excellent' },
    { name: 'Fashion Express', conversion: 78, abandon: 22, experiments: 2, lift: '+5%', status: 'good' },
    { name: 'GameZone Digital', conversion: 71, abandon: 29, experiments: 4, lift: '+12%', status: 'improving' },
    { name: 'Pharma Online', conversion: 76, abandon: 24, experiments: 1, lift: '+3%', status: 'good' },
    { name: 'Auto Parts Hub', conversion: 65, abandon: 35, experiments: 2, lift: '-2%', status: 'needs_attention' }
  ];

  // Experiment results
  const experimentResults = [
    { experiment: 'PIX First (Global)', merchants: 245, avgLift: '+11.2%', status: 'winner' },
    { experiment: '1-Step Layout', merchants: 178, avgLift: '+7.8%', status: 'positive' },
    { experiment: 'Campos Reduzidos', merchants: 312, avgLift: '+4.5%', status: 'positive' },
    { experiment: 'Desconto PIX 5%', merchants: 156, avgLift: '+15.3%', status: 'winner' }
  ];

  // Monthly evolution
  const monthlyEvolution = [
    { month: 'Set', conversion: 68, abandon: 32 },
    { month: 'Out', conversion: 70, abandon: 30 },
    { month: 'Nov', conversion: 72, abandon: 28 },
    { month: 'Dez', conversion: 73, abandon: 27 },
    { month: 'Jan', conversion: 74.2, abandon: 25.8 }
  ];

  // Device breakdown
  const deviceData = [
    { device: 'Mobile', share: 68, conversion: 72 },
    { device: 'Desktop', share: 28, conversion: 82 },
    { device: 'Tablet', share: 4, conversion: 76 }
  ];

  const getStatusBadge = (status) => {
    const configs = {
      excellent: { label: 'Excelente', className: 'bg-green-100 text-green-700' },
      good: { label: 'Bom', className: 'bg-blue-100 text-blue-700' },
      improving: { label: 'Melhorando', className: 'bg-purple-100 text-purple-700' },
      needs_attention: { label: 'Atenção', className: 'bg-red-100 text-red-700' },
      winner: { label: 'Vencedor', className: 'bg-green-100 text-green-700' },
      positive: { label: 'Positivo', className: 'bg-blue-100 text-blue-700' }
    };
    const config = configs[status] || configs.good;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Shuffle className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Converter Agent</h1>
            <p className="text-slate-500 dark:text-slate-400">Visão Consolidada - Otimização de Checkout</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <Store className="w-3 h-3 mr-1" />
            {globalKpis.activeMerchants} merchants ativos
          </Badge>
          <Link to={createPageUrl('AdminIntConverterAgentSettings')}>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
          </Link>
        </div>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-green-600">Conversão Média</span>
            <Badge className="bg-green-500 text-white text-xs">{globalKpis.conversionChange}</Badge>
          </div>
          <p className="text-2xl font-bold text-green-700">{globalKpis.avgConversion}</p>
        </Card>

        <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-red-600">Abandono Médio</span>
            <Badge className="bg-green-500 text-white text-xs">{globalKpis.abandonChange}</Badge>
          </div>
          <p className="text-2xl font-bold text-red-700">{globalKpis.avgAbandon}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500">Experimentos Ativos</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{globalKpis.activeExperiments}</p>
        </Card>

        <Card className="p-4 bg-[#2bc196]/10 border-[#2bc196]/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#2bc196]" />
            <span className="text-xs text-[#2bc196]">Revenue Incremental</span>
          </div>
          <p className="text-2xl font-bold text-[#2bc196]">{globalKpis.incrementalRevenue}</p>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="merchants">Por Merchant</TabsTrigger>
          <TabsTrigger value="experiments">Experimentos</TabsTrigger>
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
                    <YAxis domain={[0, 100]} />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="conversion" stroke="#2bc196" strokeWidth={3} name="Conversão %" />
                    <Line type="monotone" dataKey="abandon" stroke="#ef4444" strokeWidth={2} name="Abandono %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Device Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performance por Dispositivo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceData.map((device) => (
                    <div key={device.device} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        {device.device === 'Mobile' ? (
                          <Smartphone className="w-5 h-5 text-blue-600" />
                        ) : device.device === 'Desktop' ? (
                          <Monitor className="w-5 h-5 text-purple-600" />
                        ) : (
                          <Monitor className="w-5 h-5 text-amber-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{device.device}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500">{device.share}% tráfego</span>
                            <Badge className="bg-green-100 text-green-700">{device.conversion}%</Badge>
                          </div>
                        </div>
                        <Progress value={device.conversion} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-700">
                    💡 <strong>Insight:</strong> Mobile tem 68% do tráfego mas menor conversão. Priorize otimizações mobile.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Insights do Converter Agent</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Experimento "PIX First" com resultados consistentes em 245 merchants. 
                    Recomendação: <strong>Aplicar como padrão global</strong>. Impacto estimado: <strong>+R$ 180.000/mês</strong>
                  </p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Aplicar Global
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Merchants Tab */}
        <TabsContent value="merchants" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>Performance por Merchant</CardTitle>
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
                    className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Store className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{merchant.name}</p>
                        <p className="text-sm text-slate-500">
                          {merchant.experiments} experimentos ativos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">{merchant.conversion}%</p>
                        <p className="text-xs text-slate-500">Conversão</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-red-600">{merchant.abandon}%</p>
                        <p className="text-xs text-slate-500">Abandono</p>
                      </div>
                      <div className="text-center">
                        <Badge className={merchant.lift.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {merchant.lift}
                        </Badge>
                        <p className="text-xs text-slate-500 mt-1">Lift</p>
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

        {/* Experiments Tab */}
        <TabsContent value="experiments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Experimentos Globais</CardTitle>
              <CardDescription>Resultados consolidados de A/B tests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {experimentResults.map((exp, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-lg border-2 ${
                      exp.status === 'winner'
                        ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                        : 'border-blue-200 bg-blue-50/50 dark:bg-blue-900/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {exp.status === 'winner' && (
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{exp.experiment}</p>
                          <p className="text-sm text-slate-500">{exp.merchants} merchants participando</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">{exp.avgLift}</p>
                          <p className="text-xs text-slate-500">Lift médio</p>
                        </div>
                        {getStatusBadge(exp.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Agent Chat Interface */}
      <AgentChatInterface
        agentName="converter_agent_admin"
        agentDisplayName="Converter Agent"
        agentDescription="Visão consolidada de conversão"
        quickPrompts={converterAgentAdminQuickPrompts}
        onProcessMessage={processConverterAgentAdminMessage}
        welcomeMessage="Olá! 👋 Sou o Converter Agent na visão Admin. Posso ajudar a analisar a performance global de conversão, identificar merchants que precisam de atenção e gerenciar experimentos A/B. O que deseja saber?"
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        accentColor="#3b82f6"
      />

      {/* Floating Button */}
      <AgentFloatingButton
        isOpen={isChatOpen}
        onClick={() => setIsChatOpen(!isChatOpen)}
        agentName="Converter Agent"
        accentColor="#3b82f6"
      />
    </div>
  );
}