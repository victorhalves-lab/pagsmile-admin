import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  QrCode,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  DollarSign,
  Hash,
  Activity,
  Target,
  ShieldAlert,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  ArrowDown,
  ArrowUp,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Componente de KPI Card
const KPICard = ({ title, value, subtitle, icon: Icon, trend, trendValue, variant = 'default', size = 'default' }) => {
  const variants = {
    default: 'bg-white border-slate-200',
    success: 'bg-emerald-50 border-emerald-200',
    warning: 'bg-amber-50 border-amber-200',
    danger: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200'
  };

  const iconVariants = {
    default: 'bg-slate-100 text-slate-600',
    success: 'bg-emerald-100 text-emerald-600',
    warning: 'bg-amber-100 text-amber-600',
    danger: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <Card className={cn('border', variants[variant], size === 'sm' && 'p-3')}>
      <CardContent className={cn('pt-4', size === 'sm' && 'p-0')}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{title}</p>
            <p className={cn('font-bold text-slate-900', size === 'sm' ? 'text-xl' : 'text-2xl')}>{value}</p>
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
            {trend && (
              <div className={cn(
                'flex items-center gap-1 mt-2 text-xs font-medium',
                trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500'
              )}>
                {trend === 'up' ? <ArrowUp className="w-3 h-3" /> : trend === 'down' ? <ArrowDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          {Icon && (
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', iconVariants[variant])}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Componente de Gauge para taxas
const ConversionGauge = ({ label, value, benchmark, icon: Icon, color = 'emerald' }) => {
  const percentage = Math.min(value, 100);
  const isAboveBenchmark = value >= benchmark;

  const colors = {
    emerald: { bg: 'bg-emerald-100', fill: 'bg-emerald-500', text: 'text-emerald-600' },
    blue: { bg: 'bg-blue-100', fill: 'bg-blue-500', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-100', fill: 'bg-purple-500', text: 'text-purple-600' },
    amber: { bg: 'bg-amber-100', fill: 'bg-amber-500', text: 'text-amber-600' },
    red: { bg: 'bg-red-100', fill: 'bg-red-500', text: 'text-red-600' }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', colors[color].bg)}>
            <Icon className={cn('w-4 h-4', colors[color].text)} />
          </div>
          <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
        <Badge variant={isAboveBenchmark ? 'default' : 'destructive'} className="text-xs">
          {isAboveBenchmark ? 'Acima' : 'Abaixo'} do benchmark
        </Badge>
      </div>
      <div className="flex items-end justify-between mb-2">
        <span className="text-3xl font-bold text-slate-900">{value.toFixed(1)}%</span>
        <span className="text-xs text-slate-500">Benchmark: {benchmark}%</span>
      </div>
      <div className={cn('h-2 rounded-full', colors[color].bg)}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', colors[color].fill)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default function TabPerformance({ merchant, transactions = [] }) {
  const [period, setPeriod] = useState('30d');

  // Mock data para demonstração - em produção virá das transações reais
  const mockMetrics = useMemo(() => ({
    // Conversão Geral
    conversaoGeral: 78.5,
    conversaoGeralAnterior: 75.2,
    
    // Conversão por Método
    conversaoCartao: 72.3,
    conversaoCartaoAnterior: 70.1,
    conversaoPix: 94.8,
    conversaoPixAnterior: 93.5,
    conversaoBoleto: 45.2,
    conversaoBoletoAnterior: 48.0,
    
    // Volume por Método
    volumeCartao: 1250000,
    volumePix: 890000,
    volumeBoleto: 320000,
    volumePixIn: 850000,
    volumePixOut: 40000,
    
    // Quantidade por Método
    qtdCartao: 4520,
    qtdPix: 12350,
    qtdBoleto: 890,
    qtdPixIn: 12100,
    qtdPixOut: 250,
    
    // Ticket Médio
    ticketMedioCartao: 276.55,
    ticketMedioPix: 72.06,
    ticketMedioBoleto: 359.55,
    
    // Chargebacks
    chargebackQtd: 23,
    chargebackValor: 8750,
    chargebackRatioCartao: 0.51,
    chargebackRatioAnterior: 0.48,
    
    // MEDs (PIX)
    medQtd: 5,
    medValor: 1250,
    
    // Recusas
    recusaSaldoInsuficiente: 35,
    recusaFraude: 12,
    recusaTecnico: 8,
    recusaOutros: 15
  }), []);

  // Dados para gráficos
  const conversionTrendData = [
    { name: 'Sem 1', cartao: 71, pix: 93, boleto: 44, geral: 76 },
    { name: 'Sem 2', cartao: 73, pix: 94, boleto: 46, geral: 77 },
    { name: 'Sem 3', cartao: 70, pix: 95, boleto: 43, geral: 76 },
    { name: 'Sem 4', cartao: 72, pix: 95, boleto: 47, geral: 78 },
  ];

  const volumeByMethodData = [
    { name: 'Cartão', value: mockMetrics.volumeCartao, color: '#6366f1' },
    { name: 'PIX', value: mockMetrics.volumePix, color: '#10b981' },
    { name: 'Boleto', value: mockMetrics.volumeBoleto, color: '#f59e0b' },
  ];

  const pixFlowData = [
    { name: 'Entrada', value: mockMetrics.volumePixIn, color: '#10b981' },
    { name: 'Saída', value: mockMetrics.volumePixOut, color: '#ef4444' },
  ];

  const refusalReasonsData = [
    { name: 'Saldo Insuficiente', value: mockMetrics.recusaSaldoInsuficiente, color: '#f59e0b' },
    { name: 'Fraude', value: mockMetrics.recusaFraude, color: '#ef4444' },
    { name: 'Técnico', value: mockMetrics.recusaTecnico, color: '#6366f1' },
    { name: 'Outros', value: mockMetrics.recusaOutros, color: '#94a3b8' },
  ];

  const chargebackTrendData = [
    { name: 'Jan', qtd: 5, ratio: 0.45 },
    { name: 'Fev', qtd: 4, ratio: 0.42 },
    { name: 'Mar', qtd: 6, ratio: 0.48 },
    { name: 'Abr', qtd: 8, ratio: 0.51 },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header com Filtros */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Performance e Conversão</h2>
          <p className="text-sm text-slate-500">Análise detalhada da performance do cliente por método de pagamento</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
            <SelectItem value="12m">Últimos 12 meses</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alertas Contextuais */}
      {mockMetrics.chargebackRatioCartao > 0.5 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Atenção: Chargeback Ratio elevado</p>
            <p className="text-sm text-amber-700 mt-1">
              O ratio de chargeback de cartão está em {mockMetrics.chargebackRatioCartao}%, acima do limite recomendado de 0.5%. 
              Considere revisar as políticas antifraude.
            </p>
          </div>
        </div>
      )}

      {/* KPIs Principais - Conversão */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Conversão Geral"
          value={`${mockMetrics.conversaoGeral}%`}
          subtitle="Taxa de aprovação total"
          icon={Target}
          trend={mockMetrics.conversaoGeral > mockMetrics.conversaoGeralAnterior ? 'up' : 'down'}
          trendValue={`${Math.abs(mockMetrics.conversaoGeral - mockMetrics.conversaoGeralAnterior).toFixed(1)}% vs período anterior`}
          variant="success"
        />
        <KPICard
          title="Conversão Cartão"
          value={`${mockMetrics.conversaoCartao}%`}
          subtitle={`${formatNumber(mockMetrics.qtdCartao)} transações`}
          icon={CreditCard}
          trend={mockMetrics.conversaoCartao > mockMetrics.conversaoCartaoAnterior ? 'up' : 'down'}
          trendValue={`${Math.abs(mockMetrics.conversaoCartao - mockMetrics.conversaoCartaoAnterior).toFixed(1)}%`}
          variant="info"
        />
        <KPICard
          title="Conversão PIX"
          value={`${mockMetrics.conversaoPix}%`}
          subtitle={`${formatNumber(mockMetrics.qtdPix)} transações`}
          icon={QrCode}
          trend={mockMetrics.conversaoPix > mockMetrics.conversaoPixAnterior ? 'up' : 'down'}
          trendValue={`${Math.abs(mockMetrics.conversaoPix - mockMetrics.conversaoPixAnterior).toFixed(1)}%`}
          variant="success"
        />
        <KPICard
          title="Conversão Boleto"
          value={`${mockMetrics.conversaoBoleto}%`}
          subtitle={`${formatNumber(mockMetrics.qtdBoleto)} boletos`}
          icon={FileText}
          trend={mockMetrics.conversaoBoleto > mockMetrics.conversaoBoletoAnterior ? 'up' : 'down'}
          trendValue={`${Math.abs(mockMetrics.conversaoBoleto - mockMetrics.conversaoBoletoAnterior).toFixed(1)}%`}
          variant="warning"
        />
      </div>

      {/* Gauges de Conversão com Benchmark */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ConversionGauge
          label="Conversão Cartão"
          value={mockMetrics.conversaoCartao}
          benchmark={75}
          icon={CreditCard}
          color="blue"
        />
        <ConversionGauge
          label="Conversão PIX"
          value={mockMetrics.conversaoPix}
          benchmark={90}
          icon={QrCode}
          color="emerald"
        />
        <ConversionGauge
          label="Conversão Boleto"
          value={mockMetrics.conversaoBoleto}
          benchmark={50}
          icon={FileText}
          color="amber"
        />
      </div>

      {/* Gráficos de Volume e Tendência */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendência de Conversão */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <LineChart className="w-4 h-4 text-slate-500" />
              Tendência de Conversão
            </CardTitle>
            <CardDescription>Evolução das taxas por método</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsLineChart data={conversionTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  formatter={(value) => [`${value}%`, '']}
                />
                <Legend />
                <Line type="monotone" dataKey="cartao" name="Cartão" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="pix" name="PIX" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="boleto" name="Boleto" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Volume */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart className="w-4 h-4 text-slate-500" />
              Distribuição de Volume
            </CardTitle>
            <CardDescription>Volume transacionado por método</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={volumeByMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {volumeByMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Volume e Ticket Médio por Método */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Volume e Ticket Médio por Método</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cartão */}
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="font-medium text-indigo-900">Cartão</span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-indigo-600">Volume Total</p>
                  <p className="text-xl font-bold text-indigo-900">{formatCurrency(mockMetrics.volumeCartao)}</p>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-indigo-600">Quantidade</p>
                    <p className="font-semibold text-indigo-900">{formatNumber(mockMetrics.qtdCartao)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-indigo-600">Ticket Médio</p>
                    <p className="font-semibold text-indigo-900">{formatCurrency(mockMetrics.ticketMedioCartao)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* PIX */}
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="font-medium text-emerald-900">PIX</span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-emerald-600">Volume Total</p>
                  <p className="text-xl font-bold text-emerald-900">{formatCurrency(mockMetrics.volumePix)}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-emerald-100/50 rounded-lg p-2">
                    <p className="text-emerald-600">Entrada</p>
                    <p className="font-semibold text-emerald-900">{formatCurrency(mockMetrics.volumePixIn)}</p>
                    <p className="text-emerald-700">{formatNumber(mockMetrics.qtdPixIn)} txns</p>
                  </div>
                  <div className="bg-red-100/50 rounded-lg p-2">
                    <p className="text-red-600">Saída</p>
                    <p className="font-semibold text-red-900">{formatCurrency(mockMetrics.volumePixOut)}</p>
                    <p className="text-red-700">{formatNumber(mockMetrics.qtdPixOut)} txns</p>
                  </div>
                </div>
                <div className="flex justify-between pt-2 border-t border-emerald-200">
                  <div>
                    <p className="text-xs text-emerald-600">Saldo Líquido PIX</p>
                    <p className="font-semibold text-emerald-900">{formatCurrency(mockMetrics.volumePixIn - mockMetrics.volumePixOut)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-emerald-600">Ticket Médio</p>
                    <p className="font-semibold text-emerald-900">{formatCurrency(mockMetrics.ticketMedioPix)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Boleto */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-amber-600" />
                </div>
                <span className="font-medium text-amber-900">Boleto</span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-amber-600">Volume Total</p>
                  <p className="text-xl font-bold text-amber-900">{formatCurrency(mockMetrics.volumeBoleto)}</p>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-amber-600">Quantidade</p>
                    <p className="font-semibold text-amber-900">{formatNumber(mockMetrics.qtdBoleto)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-amber-600">Ticket Médio</p>
                    <p className="font-semibold text-amber-900">{formatCurrency(mockMetrics.ticketMedioBoleto)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chargebacks e MEDs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chargebacks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              Chargebacks
            </CardTitle>
            <CardDescription>Métricas de chargeback do cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-2xl font-bold text-slate-900">{mockMetrics.chargebackQtd}</p>
                <p className="text-xs text-slate-500">Quantidade</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(mockMetrics.chargebackValor)}</p>
                <p className="text-xs text-slate-500">Valor Total</p>
              </div>
              <div className={cn(
                "text-center p-3 rounded-xl",
                mockMetrics.chargebackRatioCartao > 0.5 ? "bg-red-50" : "bg-emerald-50"
              )}>
                <p className={cn(
                  "text-2xl font-bold",
                  mockMetrics.chargebackRatioCartao > 0.5 ? "text-red-600" : "text-emerald-600"
                )}>
                  {mockMetrics.chargebackRatioCartao}%
                </p>
                <p className="text-xs text-slate-500">Ratio Cartão</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={chargebackTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="qtd" name="Quantidade" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Análise de Recusas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <XCircle className="w-4 h-4 text-amber-500" />
              Análise de Recusas
            </CardTitle>
            <CardDescription>Principais motivos de recusa</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPieChart>
                <Pie
                  data={refusalReasonsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {refusalReasonsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {refusalReasonsData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value} recusas</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MEDs (PIX) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-purple-500" />
            MEDs (Mecanismo Especial de Devolução - PIX)
          </CardTitle>
          <CardDescription>Devoluções especiais via PIX</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
              <p className="text-3xl font-bold text-purple-900">{mockMetrics.medQtd}</p>
              <p className="text-sm text-purple-600">MEDs Recebidos</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
              <p className="text-3xl font-bold text-purple-900">{formatCurrency(mockMetrics.medValor)}</p>
              <p className="text-sm text-purple-600">Valor Total</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-3xl font-bold text-slate-900">3</p>
              <p className="text-sm text-slate-600">Em Análise</p>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-3xl font-bold text-slate-900">2</p>
              <p className="text-sm text-slate-600">Resolvidos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}