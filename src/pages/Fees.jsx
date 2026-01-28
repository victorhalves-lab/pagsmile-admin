import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Wallet,
  QrCode,
  CreditCard,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Percent,
  DollarSign,
  Download,
  Filter,
  Calendar,
  ChevronDown,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import CopilotInsightCard from '@/components/copilot/CopilotInsightCard';
import FeeCategoryCard from '@/components/fees/FeeCategoryCard';
import FeeSimulator from '@/components/fees/FeeSimulator';

export default function Fees() {
  const [showValues, setShowValues] = useState(true);
  const [period, setPeriod] = useState('30d');
  
  // Taxas Mockadas para Tabela
  const allFees = [
    { name: 'MDR Crédito à Vista', value: '2.99%', type: 'percentage' },
    { name: 'MDR Crédito Parcelado (2-6x)', value: '3.49%', type: 'percentage' },
    { name: 'MDR Crédito Parcelado (7-12x)', value: '3.99%', type: 'percentage' },
    { name: 'MDR Débito', value: '1.99%', type: 'percentage' },
    { name: 'PIX', value: '0.99%', type: 'percentage' },
    { name: 'Tarifa Fixa (Gateway)', value: 'R$ 0,49', type: 'fixed' },
    { name: 'Antifraude', value: 'R$ 0,70', type: 'fixed' },
    { name: 'Antecipação Automática', value: '1.99% a.m.', type: 'percentage' },
    { name: 'Antecipação Pontual', value: '2.49% a.m.', type: 'percentage' },
    { name: 'Saque', value: 'R$ 3,90', type: 'fixed' },
  ];
  const [insightsLoading, setInsightsLoading] = useState(false);

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions-fees'],
    queryFn: () => base44.entities.Transaction.filter({ status: 'approved' }, '-created_date', 100),
  });

  const formatCurrency = (value, hide = false) => {
    if (hide && !showValues) return '••••••';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  // Calculate fee metrics from transactions
  const calculateMetrics = () => {
    const approved = transactions.filter(t => t.status === 'approved');
    
    const totalVolume = approved.reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalFees = approved.reduce((sum, t) => sum + (t.fee_amount || t.amount * 0.025), 0);
    const totalNet = totalVolume - totalFees;
    const avgFeePercentage = totalVolume > 0 ? (totalFees / totalVolume) * 100 : 0;

    const pixTransactions = approved.filter(t => t.type === 'pix');
    const cardTransactions = approved.filter(t => t.type === 'card');

    const pixVolume = pixTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const pixFees = pixTransactions.reduce((sum, t) => sum + (t.fee_amount || t.amount * 0.0099), 0);

    const cardVolume = cardTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const cardFees = cardTransactions.reduce((sum, t) => sum + (t.fee_amount || t.amount * 0.0249), 0);

    // Other fees (anticipation, refunds, etc.)
    const otherFees = totalFees * 0.1; // Mock: 10% of total fees

    return {
      totalVolume,
      totalFees,
      totalNet,
      avgFeePercentage,
      pixVolume,
      pixFees,
      pixFeePercentage: pixVolume > 0 ? (pixFees / pixVolume) * 100 : 0,
      cardVolume,
      cardFees,
      cardFeePercentage: cardVolume > 0 ? (cardFees / cardVolume) * 100 : 0,
      otherFees,
      pixPercentage: totalVolume > 0 ? (pixVolume / totalVolume) * 100 : 0
    };
  };

  const metrics = calculateMetrics();

  // Mock chart data
  const trendChartData = [
    { date: '01/01', bruto: 45200, liquido: 43900, tarifas: 1300 },
    { date: '08/01', bruto: 52100, liquido: 50500, tarifas: 1600 },
    { date: '15/01', bruto: 48700, liquido: 47200, tarifas: 1500 },
    { date: '22/01', bruto: 61300, liquido: 59400, tarifas: 1900 },
    { date: '29/01', bruto: 55800, liquido: 54100, tarifas: 1700 },
  ];

  const feePercentageChartData = [
    { date: '01/01', percentage: 2.42 },
    { date: '08/01', percentage: 2.38 },
    { date: '15/01', percentage: 2.51 },
    { date: '22/01', percentage: 2.35 },
    { date: '29/01', percentage: 2.29 },
  ];

  const compositionData = [
    { name: 'PIX', value: metrics.pixFees, color: '#3B82F6' },
    { name: 'Cartão', value: metrics.cardFees, color: '#F97316' },
    { name: 'Outras', value: metrics.otherFees, color: '#8B5CF6' },
  ];

  const cardBrandData = [
    { brand: 'Visa', value: metrics.cardFees * 0.45, percentage: 2.35 },
    { brand: 'Mastercard', value: metrics.cardFees * 0.35, percentage: 2.49 },
    { brand: 'Elo', value: metrics.cardFees * 0.12, percentage: 2.89 },
    { brand: 'Amex', value: metrics.cardFees * 0.05, percentage: 3.15 },
    { brand: 'Hipercard', value: metrics.cardFees * 0.03, percentage: 2.99 },
  ];

  const topCostScenarios = [
    { scenario: 'Crédito Parcelado Visa', fee: 2450, percentage: 3.15, volume: 77778 },
    { scenario: 'Crédito à Vista Mastercard', fee: 1820, percentage: 2.49, volume: 73092 },
    { scenario: 'Débito Elo', fee: 980, percentage: 1.99, volume: 49246 },
    { scenario: 'PIX (Geral)', fee: 750, percentage: 0.99, volume: 75758 },
    { scenario: 'Crédito Parcelado Amex', fee: 520, percentage: 3.45, volume: 15072 },
  ];

  const copilotInsights = [
    {
      type: 'alert',
      title: 'Taxa de PIX acima da média',
      description: 'Sua taxa média de PIX (0.99%) está 0.05% acima da média do seu segmento. Isso representa um custo adicional de R$150/mês.',
      badge: '+0.05%',
      metrics: [
        { label: 'Sua taxa', value: '0.99%' },
        { label: 'Média do mercado', value: '0.94%' }
      ],
      action: { label: 'Ver pontos de negociação', type: 'negotiate_pix' }
    },
    {
      type: 'opportunity',
      title: 'Oportunidade de economia',
      description: 'Reduzindo sua taxa de Crédito Parcelado da Visa em 0.1%, você economizaria R$245/mês com base no seu volume atual.',
      badge: 'R$245/mês',
      action: { label: 'Simular cenário', type: 'simulate' }
    },
    {
      type: 'trend_down',
      title: 'Custo de tarifas em queda',
      description: 'Seu percentual de custo de tarifas caiu 0.13% nas últimas 4 semanas. Continue incentivando pagamentos via PIX!',
      badge: '-0.13%',
      metrics: [
        { label: 'Há 4 semanas', value: '2.42%' },
        { label: 'Atual', value: '2.29%', color: 'text-emerald-600' }
      ]
    },
    {
      type: 'info',
      title: 'Impacto no lucro',
      description: 'As tarifas representam 2.3% da sua receita bruta. Reduzindo para 2.0%, seu lucro líquido aumentaria em R$1.500/mês.',
      action: { label: 'Criar meta de redução', type: 'create_goal' }
    }
  ];

  const handleRefreshInsights = () => {
    setInsightsLoading(true);
    setTimeout(() => setInsightsLoading(false), 2000);
  };

  const handleInsightAction = (action) => {
    console.log('Insight action:', action);
  };

  const feeDetailColumns = [
    {
      key: 'transaction_id',
      label: 'ID Transação',
      render: (value) => <span className="font-mono text-xs">{value?.slice(0, 12)}...</span>
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (value) => (
        <Badge variant="outline" className={cn(
          value === 'pix' ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-orange-200 text-orange-700 bg-orange-50'
        )}>
          {value === 'pix' ? 'PIX' : 'Cartão'}
        </Badge>
      )
    },
    {
      key: 'amount',
      label: 'Valor Bruto',
      render: (value) => <span className="font-medium">{formatCurrency(value)}</span>
    },
    {
      key: 'fee_amount',
      label: 'Tarifa',
      render: (value, row) => {
        const fee = value || row.amount * (row.type === 'pix' ? 0.0099 : 0.0249);
        return <span className="text-red-600 font-medium">-{formatCurrency(fee)}</span>;
      }
    },
    {
      key: 'net_amount',
      label: 'Valor Líquido',
      render: (value, row) => {
        const fee = row.fee_amount || row.amount * (row.type === 'pix' ? 0.0099 : 0.0249);
        const net = row.amount - fee;
        return <span className="text-emerald-600 font-semibold">{formatCurrency(net)}</span>;
      }
    },
    {
      key: 'created_date',
      label: 'Data',
      render: (value) => value ? format(new Date(value), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A'
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tarifas e Taxas"
        subtitle="Visualize suas taxas negociadas e simule custos"
        breadcrumbs={[
          { label: 'Financeiro', page: 'FinancialOverview' },
          { label: 'Tarifas e Taxas', page: 'Fees' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowValues(!showValues)}
            >
              {showValues ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </Button>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        }
      />

      {/* KPI Cards - Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <DollarSign className="w-5 h-5" />
              </div>
              <Badge className="bg-red-500/20 text-red-300 border-0">
                <TrendingUp className="w-3 h-3 mr-1" />
                +2.3%
              </Badge>
            </div>
            <p className="text-white/60 text-sm mb-1">Custo Total de Tarifas</p>
            <p className="text-2xl font-bold">{formatCurrency(metrics.totalFees, true)}</p>
            <p className="text-xs text-white/40 mt-1">No período selecionado</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Percent className="w-5 h-5 text-violet-600" />
              </div>
              <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                <TrendingDown className="w-3 h-3 mr-1" />
                -0.13%
              </Badge>
            </div>
            <p className="text-gray-500 text-sm mb-1">% Custo sobre Bruto</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.avgFeePercentage.toFixed(2)}%</p>
            <p className="text-xs text-gray-400 mt-1">Taxa média ponderada</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Wallet className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-1">Valor Líquido Total</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(metrics.totalNet, true)}</p>
            <p className="text-xs text-gray-400 mt-1">Após todas as tarifas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-1">Volume Bruto</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalVolume, true)}</p>
            <p className="text-xs text-gray-400 mt-1">Total processado</p>
          </CardContent>
        </Card>
      </div>

      {/* Fee Category Cards - PIX, Cartão, Outras */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FeeCategoryCard
          title="Tarifas PIX"
          icon={QrCode}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          totalFee={metrics.pixFees}
          feePercentage={metrics.pixFeePercentage}
          totalVolume={metrics.pixVolume}
          trend="down"
          trendValue="-0.05%"
          chartData={[
            { value: 280 }, { value: 310 }, { value: 295 }, { value: 340 }, { value: 320 }
          ]}
          chartColor="#3B82F6"
          insight="Sua taxa média de PIX está competitiva. Identificamos um aumento de volume nas últimas 2 semanas, o que é positivo para reduzir o custo médio."
          formatCurrency={formatCurrency}
        />

        <FeeCategoryCard
          title="Tarifas Cartão"
          icon={CreditCard}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
          totalFee={metrics.cardFees}
          feePercentage={metrics.cardFeePercentage}
          totalVolume={metrics.cardVolume}
          trend="up"
          trendValue="+0.08%"
          chartData={[
            { value: 980 }, { value: 1050 }, { value: 1120 }, { value: 1200 }, { value: 1150 }
          ]}
          chartColor="#F97316"
          insight="As taxas de Crédito Parcelado da bandeira Visa representam 40% do seu custo total de cartão. Considere negociar essa modalidade."
          formatCurrency={formatCurrency}
        />

        <FeeCategoryCard
          title="Outras Tarifas"
          icon={MoreHorizontal}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          totalFee={metrics.otherFees}
          feePercentage={metrics.totalVolume > 0 ? (metrics.otherFees / metrics.totalVolume) * 100 : 0}
          totalVolume={metrics.totalVolume}
          trend="stable"
          trendValue="0%"
          chartData={[
            { value: 150 }, { value: 180 }, { value: 160 }, { value: 170 }, { value: 165 }
          ]}
          chartColor="#8B5CF6"
          insight="Você teve 3 eventos de estorno que geraram R$180 em taxas este mês. Revise as políticas de cancelamento para reduzir esses custos."
          formatCurrency={formatCurrency}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="trend" className="space-y-4">
            <TabsList>
              <TabsTrigger value="trend">Evolução</TabsTrigger>
              <TabsTrigger value="composition">Composição</TabsTrigger>
              <TabsTrigger value="brands">Por Bandeira</TabsTrigger>
            </TabsList>

            <TabsContent value="trend">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Vendas Brutas vs Líquidas vs Tarifas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendChartData}>
                        <defs>
                          <linearGradient id="colorBruto" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorLiquido" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Area type="monotone" dataKey="bruto" name="Bruto" stroke="#3B82F6" strokeWidth={2} fill="url(#colorBruto)" />
                        <Area type="monotone" dataKey="liquido" name="Líquido" stroke="#10B981" strokeWidth={2} fill="url(#colorLiquido)" />
                        <Area type="monotone" dataKey="tarifas" name="Tarifas" stroke="#EF4444" strokeWidth={2} fill="none" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="composition">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Composição das Tarifas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={compositionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {compositionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    {compositionData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-600">{item.name}: {formatCurrency(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="brands">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Custo por Bandeira de Cartão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={cardBrandData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} tickFormatter={(v) => formatCurrency(v)} />
                        <YAxis dataKey="brand" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#374151' }} width={80} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Bar dataKey="value" name="Custo" fill="#F97316" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Top Cost Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top 5 Cenários de Maior Custo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topCostScenarios.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.scenario}</p>
                        <p className="text-xs text-gray-500">Volume: {formatCurrency(item.volume)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">{formatCurrency(item.fee)}</p>
                      <p className="text-xs text-gray-500">{item.percentage.toFixed(2)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Copilot Insights */}
        <div className="space-y-6">
          <CopilotInsightCard
            title="Insights do DIA Copilot"
            insights={copilotInsights}
            onRefresh={handleRefreshInsights}
            onAction={handleInsightAction}
            loading={insightsLoading}
          />

          {/* Percentage Trend Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">% Custo de Tarifas</CardTitle>
              <p className="text-xs text-gray-500">Evolução do percentual</p>
            </CardHeader>
            <CardContent>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={feePercentageChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} domain={[2, 3]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                    <Line type="monotone" dataKey="percentage" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fee Table & Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Minhas Taxas Negociadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0 divide-y">
              {allFees.map((fee, idx) => (
                <div key={idx} className="flex justify-between py-3">
                  <span className="text-sm font-medium text-gray-700">{fee.name}</span>
                  <Badge variant="secondary" className="font-mono">{fee.value}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <FeeSimulator
          currentData={{}}
          formatCurrency={formatCurrency}
          className="h-full"
        />
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detalhamento de Tarifas por Transação</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={feeDetailColumns}
            data={transactions}
            loading={isLoading}
            searchable
            searchPlaceholder="Buscar transação..."
            pagination
            pageSize={10}
            currentPage={1}
            totalItems={transactions.length}
            emptyMessage="Nenhuma transação encontrada"
          />
        </CardContent>
      </Card>
    </div>
  );
}