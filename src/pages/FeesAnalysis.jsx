import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  QrCode,
  Receipt,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  Download,
  Eye,
  EyeOff,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Info,
  Lightbulb,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

import PageHeader from '@/components/common/PageHeader';

export default function FeesAnalysis() {
  const [showValues, setShowValues] = useState(true);
  const [period, setPeriod] = useState('30d');

  const formatCurrency = (value, hide = false) => {
    if (hide && !showValues) return '••••••';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatPercent = (value) => {
    return `${value.toFixed(2)}%`;
  };

  // Mock data - em produção viria das transações
  const financialSummary = {
    grossRevenue: 850000.00,
    totalFees: 28450.00,
    netRevenue: 821550.00,
    feePercentage: 3.35,
    transactionCount: 12450,
    avgTicket: 68.27,
    // Comparativo
    prevGrossRevenue: 780000.00,
    prevTotalFees: 26780.00,
    grossChange: 8.97,
    feesChange: 6.24
  };

  const feeBreakdown = {
    mdr: {
      card: 18500.00,
      pix: 3200.00,
      debit: 2100.00,
      total: 23800.00
    },
    tariffs: {
      gateway: 6102.50, // 0.49 * 12455
      antifraud: 8718.50, // 0.70 * 12455
      chargebacks: 450.00, // 30 * 15
      withdrawals: 78.00, // 20 TEDs * 3.90
      total: 15349.00
    }
  };

  // Fee evolution chart data
  const feeEvolutionData = [
    { month: 'Ago', bruto: 650000, taxas: 21775, liquido: 628225 },
    { month: 'Set', bruto: 720000, taxas: 24120, liquido: 695880 },
    { month: 'Out', bruto: 780000, taxas: 26780, liquido: 753220 },
    { month: 'Nov', bruto: 810000, taxas: 27135, liquido: 782865 },
    { month: 'Dez', bruto: 850000, taxas: 28450, liquido: 821550 },
  ];

  // Fee distribution by type
  const feeDistributionData = [
    { name: 'MDR Cartão', value: 18500, color: '#3B82F6' },
    { name: 'MDR Pix', value: 3200, color: '#00D26A' },
    { name: 'MDR Débito', value: 2100, color: '#8B5CF6' },
    { name: 'Gateway', value: 6102.50, color: '#F59E0B' },
    { name: 'Antifraude', value: 8718.50, color: '#EF4444' },
    { name: 'Chargebacks', value: 450, color: '#6B7280' },
  ];

  // Fee by payment method
  const feeByMethodData = [
    { method: 'Crédito 1x', volume: 350000, taxa: 2.99, custo: 10465, transacoes: 4200 },
    { method: 'Crédito 2-6x', volume: 280000, taxa: 3.49, custo: 9772, transacoes: 3100 },
    { method: 'Crédito 7-12x', volume: 85000, taxa: 3.99, custo: 3391.50, transacoes: 850 },
    { method: 'Débito', volume: 95000, taxa: 1.99, custo: 1890.50, transacoes: 1800 },
    { method: 'Pix', volume: 320000, taxa: 0.99, custo: 3168, transacoes: 5200 },
  ];

  // Optimization insights
  const optimizationInsights = [
    {
      type: 'warning',
      title: 'Alto volume de chargebacks',
      description: 'Você teve 30 chargebacks este mês, pagando R$ 450 em taxas. Considere implementar 3DS para reduzir fraudes.',
      potentialSavings: 300
    },
    {
      type: 'tip',
      title: 'Incentive pagamentos via Pix',
      description: 'Pix tem taxa de apenas 0.99%. Aumentando Pix de 37% para 50% do volume, você economizaria aproximadamente:',
      potentialSavings: 2800
    },
    {
      type: 'info',
      title: 'Seus saques via TED',
      description: 'Você fez 20 saques via TED (R$ 78). Saques via Pix são gratuitos.',
      potentialSavings: 78
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Análise de Tarifas"
        subtitle="Visão financeira do impacto das tarifas no seu negócio"
        breadcrumbs={[
          { label: 'Financeiro', page: 'FinancialOverview' },
          { label: 'Análise de Tarifas', page: 'FeesAnalysis' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-36">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                <SelectItem value="year">Este ano</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowValues(!showValues)}
            >
              {showValues ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        }
      />

      {/* Main Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Receita Bruta */}
        <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Receita Bruta</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(financialSummary.grossRevenue, true)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600 font-medium">+{financialSummary.grossChange}%</span>
              <span className="text-slate-500">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        {/* Total em Tarifas */}
        <Card className="border-2 border-red-100 bg-gradient-to-br from-red-50 to-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <Receipt className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total em Tarifas</p>
                <p className="text-2xl font-bold text-red-600">
                  -{formatCurrency(financialSummary.totalFees, true)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-700 border-0">
                {formatPercent(financialSummary.feePercentage)} da receita
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Receita Líquida */}
        <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Receita Líquida</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(financialSummary.netRevenue, true)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={100 - financialSummary.feePercentage} className="h-2 flex-1" />
              <span className="text-sm font-medium text-emerald-600">
                {formatPercent(100 - financialSummary.feePercentage)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Ticket Médio */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Ticket Médio</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(financialSummary.avgTicket)}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              {financialSummary.transactionCount.toLocaleString()} transações
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Summary */}
      <Card className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div>
                <p className="text-slate-400 text-sm mb-1">Receita Bruta</p>
                <p className="text-3xl font-bold">{formatCurrency(financialSummary.grossRevenue, true)}</p>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-6 h-6 text-slate-500" />
              </div>
              <div>
                <p className="text-red-400 text-sm mb-1">Tarifas</p>
                <p className="text-2xl font-bold text-red-400">-{formatCurrency(financialSummary.totalFees, true)}</p>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-6 h-6 text-slate-500" />
              </div>
              <div>
                <p className="text-[#00D26A] text-sm mb-1">Receita Líquida</p>
                <p className="text-3xl font-bold text-[#00D26A]">{formatCurrency(financialSummary.netRevenue, true)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400 mb-1">Você está retendo</p>
              <p className="text-4xl font-bold">{formatPercent(100 - financialSummary.feePercentage)}</p>
              <p className="text-sm text-slate-500">de cada venda</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evolution Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Evolução Receita vs Tarifas</CardTitle>
            <CardDescription>Últimos 5 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={feeEvolutionData}>
                  <defs>
                    <linearGradient id="colorBruto" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorLiquido" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D26A" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00D26A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `R$ ${(v/1000).toFixed(0)}k`} />
                  <RechartsTooltip 
                    formatter={(value, name) => [formatCurrency(value), name === 'bruto' ? 'Bruto' : name === 'liquido' ? 'Líquido' : 'Tarifas']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
                  />
                  <Area type="monotone" dataKey="bruto" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorBruto)" name="bruto" />
                  <Area type="monotone" dataKey="liquido" stroke="#00D26A" strokeWidth={2} fillOpacity={1} fill="url(#colorLiquido)" name="liquido" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Fee Distribution Pie */}
        <Card>
          <CardHeader>
            <CardTitle>Composição das Tarifas</CardTitle>
            <CardDescription>Distribuição por tipo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={feeDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {feeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {feeDistributionData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-600 truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MDR Breakdown */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Taxas de Processamento (MDR)
                </CardTitle>
                <CardDescription>Custos por método de pagamento</CardDescription>
              </div>
              <p className="text-xl font-bold text-red-600">
                -{formatCurrency(feeBreakdown.mdr.total, true)}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Cartão de Crédito</p>
                    <p className="text-xs text-slate-500">MDR médio: 3.29%</p>
                  </div>
                </div>
                <p className="font-semibold text-red-600">-{formatCurrency(feeBreakdown.mdr.card, true)}</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <QrCode className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Pix</p>
                    <p className="text-xs text-slate-500">MDR: 0.99%</p>
                  </div>
                </div>
                <p className="font-semibold text-red-600">-{formatCurrency(feeBreakdown.mdr.pix, true)}</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Cartão de Débito</p>
                    <p className="text-xs text-slate-500">MDR: 1.99%</p>
                  </div>
                </div>
                <p className="font-semibold text-red-600">-{formatCurrency(feeBreakdown.mdr.debit, true)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tariffs Breakdown */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-amber-600" />
                  Tarifas Fixas e Operacionais
                </CardTitle>
                <CardDescription>Custos por serviço</CardDescription>
              </div>
              <p className="text-xl font-bold text-red-600">
                -{formatCurrency(feeBreakdown.tariffs.total, true)}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div>
                  <p className="font-medium">Gateway (R$ 0,49/tx)</p>
                  <p className="text-xs text-slate-500">{financialSummary.transactionCount.toLocaleString()} transações aprovadas</p>
                </div>
                <p className="font-semibold text-red-600">-{formatCurrency(feeBreakdown.tariffs.gateway, true)}</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium">Antifraude (R$ 0,70/tx)</p>
                  <p className="text-xs text-slate-500">{financialSummary.transactionCount.toLocaleString()} análises</p>
                </div>
                <p className="font-semibold text-red-600">-{formatCurrency(feeBreakdown.tariffs.antifraud, true)}</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">Chargebacks (R$ 15,00/cb)</p>
                  <p className="text-xs text-slate-500">30 chargebacks</p>
                </div>
                <p className="font-semibold text-red-600">-{formatCurrency(feeBreakdown.tariffs.chargebacks, true)}</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">Saques TED (R$ 3,90/saque)</p>
                  <p className="text-xs text-slate-500">20 saques via TED</p>
                </div>
                <p className="font-semibold text-red-600">-{formatCurrency(feeBreakdown.tariffs.withdrawals, true)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table by Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Método de Pagamento</CardTitle>
          <CardDescription>Análise completa de custos por forma de pagamento</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Método</TableHead>
                <TableHead className="text-right">Volume</TableHead>
                <TableHead className="text-right">Transações</TableHead>
                <TableHead className="text-right">Taxa Média</TableHead>
                <TableHead className="text-right">Custo Total</TableHead>
                <TableHead className="text-right">% do Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feeByMethodData.map((row) => (
                <TableRow key={row.method}>
                  <TableCell className="font-medium">{row.method}</TableCell>
                  <TableCell className="text-right">{formatCurrency(row.volume)}</TableCell>
                  <TableCell className="text-right">{row.transacoes.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{formatPercent(row.taxa)}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-red-600">
                    -{formatCurrency(row.custo)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPercent((row.custo / financialSummary.totalFees) * 100)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-slate-50 font-bold">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">{formatCurrency(financialSummary.grossRevenue)}</TableCell>
                <TableCell className="text-right">{financialSummary.transactionCount.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Badge className="bg-slate-700 text-white">{formatPercent(financialSummary.feePercentage)}</Badge>
                </TableCell>
                <TableCell className="text-right text-red-600">
                  -{formatCurrency(financialSummary.totalFees)}
                </TableCell>
                <TableCell className="text-right">100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Optimization Insights */}
      <Card className="border-2 border-[#00D26A]/20 bg-gradient-to-br from-[#00D26A]/5 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#00D26A]" />
            Oportunidades de Economia
          </CardTitle>
          <CardDescription>
            Sugestões para reduzir seus custos com tarifas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {optimizationInsights.map((insight, idx) => (
            <div
              key={idx}
              className={cn(
                "p-4 rounded-xl border",
                insight.type === 'warning' && "bg-amber-50 border-amber-200",
                insight.type === 'tip' && "bg-emerald-50 border-emerald-200",
                insight.type === 'info' && "bg-blue-50 border-blue-200"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                  insight.type === 'warning' && "bg-amber-100",
                  insight.type === 'tip' && "bg-emerald-100",
                  insight.type === 'info' && "bg-blue-100"
                )}>
                  {insight.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                  {insight.type === 'tip' && <Lightbulb className="w-5 h-5 text-emerald-600" />}
                  {insight.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <p className={cn(
                    "font-semibold",
                    insight.type === 'warning' && "text-amber-900",
                    insight.type === 'tip' && "text-emerald-900",
                    insight.type === 'info' && "text-blue-900"
                  )}>
                    {insight.title}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">{insight.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Economia potencial</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {formatCurrency(insight.potentialSavings)}/mês
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between p-4 bg-[#00D26A]/10 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#00D26A]" />
              <div>
                <p className="font-semibold text-[#00D26A]">Economia Total Potencial</p>
                <p className="text-sm text-slate-600">Se implementar todas as sugestões acima</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-[#00D26A]">
              {formatCurrency(optimizationInsights.reduce((sum, i) => sum + i.potentialSavings, 0))}/mês
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}