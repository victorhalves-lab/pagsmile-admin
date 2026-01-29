import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  DollarSign, TrendingUp, TrendingDown, Download, Calendar, Filter,
  Wallet, CreditCard, Zap, Shield, AlertTriangle, PieChart, BarChart3
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, PieChart as RePieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { cn } from '@/lib/utils';
import DataTable from '@/components/common/DataTable';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const COLORS = ['#2bc196', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

export default function AdminIntFinancialResults() {
  const [period, setPeriod] = useState('30');
  const [methodFilter, setMethodFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: revenueEntries = [], isLoading: loadingRevenue } = useQuery({
    queryKey: ['revenue-entries'],
    queryFn: () => base44.entities.RevenueEntry.list('-created_date', 500)
  });

  const { data: costEntries = [], isLoading: loadingCosts } = useQuery({
    queryKey: ['cost-entries'],
    queryFn: () => base44.entities.CostEntry.list('-created_date', 500)
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions-all'],
    queryFn: () => base44.entities.Transaction.list('-created_date', 500)
  });

  // Calculate main KPIs
  const kpis = useMemo(() => {
    const approvedTx = transactions.filter(t => t.status === 'approved');
    const gmv = approvedTx.reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const totalRevenue = revenueEntries.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalCosts = costEntries.reduce((sum, e) => sum + (e.amount || 0), 0);
    const netRevenue = totalRevenue - totalCosts;
    const margin = gmv > 0 ? (netRevenue / gmv) * 100 : 0;

    return { gmv, totalRevenue, totalCosts, netRevenue, margin };
  }, [transactions, revenueEntries, costEntries]);

  // Revenue breakdown
  const revenueBreakdown = useMemo(() => {
    const breakdown = {};
    revenueEntries.forEach(entry => {
      if (!breakdown[entry.revenue_type]) {
        breakdown[entry.revenue_type] = 0;
      }
      breakdown[entry.revenue_type] += entry.amount || 0;
    });
    
    const labels = {
      mdr_card: 'MDR Cartão',
      mdr_pix: 'MDR Pix',
      mdr_boleto: 'MDR Boleto',
      anticipation: 'Antecipação',
      fixed_fee_card: 'Taxa Fixa Cartão',
      fixed_fee_pix: 'Taxa Fixa Pix',
      antifraud: 'Anti-fraude',
      setup_fee: 'Setup Fee',
      chargeback_fee: 'Taxas de CB',
      other: 'Outras'
    };

    return Object.entries(breakdown).map(([type, amount]) => ({
      type,
      label: labels[type] || type,
      amount
    }));
  }, [revenueEntries]);

  // Cost breakdown
  const costBreakdown = useMemo(() => {
    const breakdown = {};
    costEntries.forEach(entry => {
      if (!breakdown[entry.cost_type]) {
        breakdown[entry.cost_type] = 0;
      }
      breakdown[entry.cost_type] += entry.amount || 0;
    });
    
    const labels = {
      mdr_paid: 'MDR Repassado',
      pix_cost: 'Custo Pix',
      boleto_cost: 'Custo Boleto',
      anticipation_cost: 'Custo Antecipação',
      antifraud_cost: 'Custo Anti-fraude',
      gateway_cost: 'Gateway',
      chargeback_loss: 'Perdas CB',
      prechargeback_alert_cost: 'Alertas Pré-CB',
      operational: 'Operacional',
      other: 'Outros'
    };

    return Object.entries(breakdown).map(([type, amount]) => ({
      type,
      label: labels[type] || type,
      amount
    }));
  }, [costEntries]);

  // Pie chart data
  const revenuePieData = revenueBreakdown.map((item, idx) => ({
    name: item.label,
    value: item.amount,
    fill: COLORS[idx % COLORS.length]
  }));

  const costPieData = costBreakdown.map((item, idx) => ({
    name: item.label,
    value: item.amount,
    fill: COLORS[idx % COLORS.length]
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resultados Financeiros"
        subtitle="Análise completa de receitas, custos e lucratividade (P&L)"
        breadcrumbs={[
          { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
          { label: 'Resultados', page: 'AdminIntFinancialResults' }
        ]}
        actions={
          <div className="flex gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Este mês</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
                <SelectItem value="365">Este ano</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar P&L
            </Button>
          </div>
        }
      />

      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">GMV Total</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(kpis.gmv)}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-blue-100">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Receita Bruta</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(kpis.totalRevenue)}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-100">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Custos Totais</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(kpis.totalCosts)}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-red-100">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Receita Líquida</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(kpis.netRevenue)}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-purple-100">
                <Wallet className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Margem Líquida</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {kpis.margin.toFixed(2)}%
                </p>
                <p className="text-xs text-slate-400 mt-1">sobre GMV</p>
              </div>
              <div className="p-2 rounded-lg bg-indigo-100">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue & Cost Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Composição de Receitas</CardTitle>
            <CardDescription>Breakdown detalhado por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {revenueBreakdown.map((item) => (
                <div key={item.type} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm font-bold text-emerald-600">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-[200px] mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={revenuePieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {revenuePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Composição de Custos</CardTitle>
            <CardDescription>Breakdown detalhado por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {costBreakdown.map((item) => (
                <div key={item.type} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm font-bold text-red-600">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-[200px] mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costBreakdown} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="label" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="amount" fill="#ef4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pre-Chargeback ROI */}
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-600" />
            Resultado de Pré-Chargebacks (Alertas)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">
              <p className="text-sm text-slate-500">Alertas Recebidos</p>
              <p className="text-2xl font-bold">145</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">
              <p className="text-sm text-slate-500">Valor em Risco</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(87500)}</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">
              <p className="text-sm text-slate-500">Custo dos Alertas</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(7250)}</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg">
              <p className="text-sm text-slate-500">ROI Pré-CB</p>
              <p className="text-2xl font-bold text-emerald-600">+1,107%</p>
              <p className="text-xs text-slate-500 mt-1">CB evitados - Custo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tendência de Receitas, Custos e Margem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { month: 'Ago', revenue: 245000, costs: 180000, margin: 26.5 },
                { month: 'Set', revenue: 280000, costs: 195000, margin: 30.4 },
                { month: 'Out', revenue: 320000, costs: 210000, margin: 34.4 },
                { month: 'Nov', revenue: 385000, costs: 245000, margin: 36.4 },
                { month: 'Dez', revenue: 420000, costs: 270000, margin: 35.7 },
                { month: 'Jan', revenue: kpis.totalRevenue || 450000, costs: kpis.totalCosts || 285000, margin: kpis.margin }
              ]}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2bc196" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2bc196" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'Margem %') return `${value}%`;
                    return formatCurrency(value);
                  }}
                />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#2bc196" fill="url(#colorRevenue)" name="Receita" />
                <Area yAxisId="left" type="monotone" dataKey="costs" stroke="#ef4444" fill="url(#colorCosts)" name="Custos" />
                <Line yAxisId="right" type="monotone" dataKey="margin" stroke="#8b5cf6" strokeWidth={2} name="Margem %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Análise Detalhada por Transação</CardTitle>
            <div className="flex gap-2">
              <Input 
                placeholder="Buscar..." 
                className="w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="credit_card">Cartão</SelectItem>
                  <SelectItem value="pix">Pix</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { key: 'created_date', label: 'Data', render: (v) => new Date(v).toLocaleDateString('pt-BR') },
              { key: 'merchant_name', label: 'Cliente' },
              { key: 'method', label: 'Método', render: (v) => v === 'credit_card' ? 'Cartão' : v === 'pix' ? 'Pix' : v },
              { key: 'amount', label: 'Volume', render: (v) => formatCurrency(v) },
              { key: 'transaction_id', label: 'ID' }
            ]}
            data={transactions.filter(t => methodFilter === 'all' || t.method === methodFilter)}
            pagination
            pageSize={20}
          />
        </CardContent>
      </Card>
    </div>
  );
}