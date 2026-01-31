import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  RefreshCw, 
  DollarSign, 
  TrendingUp, 
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
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts';

export default function AdminIntRecoveryAgent() {
  const [selectedMerchant, setSelectedMerchant] = useState(null);

  // Global KPIs
  const globalKpis = {
    totalGmvAtRisk: 'R$ 4.2M',
    totalGmvRecovered: 'R$ 2.3M',
    globalRecoveryRate: '54.8%',
    activeMerchants: 847,
    totalCommunications: 125430,
    avgRecoveryTime: '1.2h'
  };

  // Top merchants by recovery
  const topMerchants = [
    { name: 'TechStore Brasil', gmvAtRisk: 245000, recovered: 156800, rate: 64, status: 'excellent' },
    { name: 'Fashion Express', gmvAtRisk: 198000, recovered: 118800, rate: 60, status: 'good' },
    { name: 'GameZone Digital', gmvAtRisk: 167000, recovered: 85170, rate: 51, status: 'average' },
    { name: 'Pharma Online', gmvAtRisk: 145000, recovered: 94250, rate: 65, status: 'excellent' },
    { name: 'Auto Parts Hub', gmvAtRisk: 132000, recovered: 59400, rate: 45, status: 'needs_attention' }
  ];

  // Recovery by scenario (global)
  const scenarioData = [
    { scenario: 'Saldo Insuficiente', volume: 1.4, recovered: 0.87, rate: 62 },
    { scenario: 'Limite Excedido', volume: 0.9, recovered: 0.43, rate: 48 },
    { scenario: 'PIX Pendente', volume: 0.8, recovered: 0.57, rate: 71 },
    { scenario: 'Abandono', volume: 1.5, recovered: 0.52, rate: 35 },
    { scenario: 'Erro Técnico', volume: 0.3, recovered: 0.26, rate: 85 }
  ];

  // Monthly evolution
  const monthlyEvolution = [
    { month: 'Set', atRisk: 3.2, recovered: 1.6, rate: 50 },
    { month: 'Out', atRisk: 3.5, recovered: 1.82, rate: 52 },
    { month: 'Nov', atRisk: 3.8, recovered: 2.01, rate: 53 },
    { month: 'Dez', atRisk: 4.1, recovered: 2.21, rate: 54 },
    { month: 'Jan', atRisk: 4.2, recovered: 2.3, rate: 55 }
  ];

  const getStatusBadge = (status) => {
    const configs = {
      excellent: { label: 'Excelente', className: 'bg-green-100 text-green-700' },
      good: { label: 'Bom', className: 'bg-blue-100 text-blue-700' },
      average: { label: 'Médio', className: 'bg-amber-100 text-amber-700' },
      needs_attention: { label: 'Atenção', className: 'bg-red-100 text-red-700' }
    };
    const config = configs[status] || configs.average;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
            <RefreshCw className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Recovery Agent</h1>
            <p className="text-slate-500 dark:text-slate-400">Visão Consolidada - Todos os Merchants</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-orange-100 text-orange-700 border-orange-200">
            <Store className="w-3 h-3 mr-1" />
            {globalKpis.activeMerchants} merchants ativos
          </Badge>
          <Link to={createPageUrl('AdminIntRecoveryAgentSettings')}>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
          </Link>
        </div>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-amber-600">GMV em Risco (Global)</span>
          </div>
          <p className="text-2xl font-bold text-amber-700">{globalKpis.totalGmvAtRisk}</p>
        </Card>

        <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-600">GMV Recuperado</span>
          </div>
          <p className="text-2xl font-bold text-green-700">{globalKpis.totalGmvRecovered}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500">Taxa Global</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{globalKpis.globalRecoveryRate}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Store className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500">Merchants Ativos</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{globalKpis.activeMerchants}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500">Comunicações</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{globalKpis.totalCommunications.toLocaleString()}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500">Tempo Médio</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{globalKpis.avgRecoveryTime}</p>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="merchants">Por Merchant</TabsTrigger>
          <TabsTrigger value="scenarios">Por Cenário</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Evolution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Evolução Mensal (R$ Milhões)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyEvolution}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="atRisk" stroke="#94a3b8" strokeWidth={2} name="GMV em Risco" />
                    <Line type="monotone" dataKey="recovered" stroke="#2bc196" strokeWidth={3} name="GMV Recuperado" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Scenario Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performance por Cenário</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={scenarioData}>
                    <XAxis dataKey="scenario" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="volume" fill="#94a3b8" name="Em Risco (M)" />
                    <Bar dataKey="recovered" fill="#2bc196" name="Recuperado (M)" />
                  </BarChart>
                </ResponsiveContainer>
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
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Insights do Recovery Agent</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <strong>5 merchants</strong> com taxa de recuperação abaixo de 40% precisam de atenção. 
                    Potencial de recuperação adicional: <strong>R$ 320.000/mês</strong> com otimização de configurações.
                  </p>
                </div>
                <Link to={createPageUrl('AdminIntMerchantsList')}>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Ver Detalhes
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
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
                    className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedMerchant(merchant)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Store className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{merchant.name}</p>
                        <p className="text-sm text-slate-500">
                          Em risco: R$ {(merchant.gmvAtRisk / 1000).toFixed(0)}k • 
                          Recuperado: R$ {(merchant.recovered / 1000).toFixed(0)}k
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{merchant.rate}%</p>
                        <Progress value={merchant.rate} className="w-24 h-2" />
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

        {/* Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarioData.map((scenario, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{scenario.scenario}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Volume em risco:</span>
                      <span className="font-medium">R$ {scenario.volume}M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Recuperado:</span>
                      <span className="font-medium text-green-600">R$ {scenario.recovered}M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Taxa:</span>
                      <Badge className="bg-green-100 text-green-700">{scenario.rate}%</Badge>
                    </div>
                    <Progress value={scenario.rate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}