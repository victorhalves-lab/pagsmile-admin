import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Search, Filter, Download, RefreshCw, CheckCircle2, XCircle, AlertTriangle,
  Clock, DollarSign, CreditCard, QrCode, ArrowUpDown, Calendar, FileText,
  TrendingUp, TrendingDown, AlertCircle, Loader2, Eye, MoreHorizontal
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { format } from 'date-fns';

// Mock data
const conciliationSummary = {
  totalTransactions: 45678,
  totalVolume: 12456789.50,
  conciliated: 44890,
  conciliatedVolume: 12234567.80,
  pending: 456,
  pendingVolume: 156789.20,
  divergent: 332,
  divergentVolume: 65432.50,
  conciliationRate: 98.3,
};

const paymentMethodBreakdown = [
  { method: 'Pix', transactions: 28456, volume: 5678900.50, conciliated: 28400, rate: 99.8 },
  { method: 'Cartão Crédito', transactions: 12345, volume: 4567890.30, conciliated: 12100, rate: 98.0 },
  { method: 'Cartão Débito', transactions: 4877, volume: 2210000.70, conciliated: 4390, rate: 90.0 },
];

const settlementCycles = [
  { cycle: 'D+0 (Pix)', pending: 45, volume: 23456.00, status: 'processing' },
  { cycle: 'D+1', pending: 123, volume: 89012.50, status: 'pending' },
  { cycle: 'D+2', pending: 67, volume: 34567.80, status: 'pending' },
  { cycle: 'D+7', pending: 89, volume: 45678.90, status: 'pending' },
  { cycle: 'D+15', pending: 34, volume: 12345.00, status: 'pending' },
  { cycle: 'D+30', pending: 98, volume: 56789.00, status: 'pending' },
];

const divergentItems = [
  { 
    id: 'div_001', 
    transaction_id: 'txn_abc123',
    merchant: 'Loja ABC',
    type: 'valor_diferente',
    expected: 150.00,
    received: 145.50,
    difference: -4.50,
    date: '2026-01-28',
    method: 'card',
    status: 'pending'
  },
  { 
    id: 'div_002', 
    transaction_id: 'txn_def456',
    merchant: 'E-commerce XYZ',
    type: 'taxa_incorreta',
    expected: 3.49,
    received: 3.99,
    difference: 0.50,
    date: '2026-01-28',
    method: 'card',
    status: 'investigating'
  },
  { 
    id: 'div_003', 
    transaction_id: 'txn_ghi789',
    merchant: 'Café Gourmet',
    type: 'chargeback_pendente',
    expected: 89.90,
    received: 0,
    difference: -89.90,
    date: '2026-01-27',
    method: 'card',
    status: 'chargeback'
  },
  { 
    id: 'div_004', 
    transaction_id: 'txn_jkl012',
    merchant: 'Tech Solutions',
    type: 'pix_nao_confirmado',
    expected: 500.00,
    received: 0,
    difference: -500.00,
    date: '2026-01-27',
    method: 'pix',
    status: 'pending'
  },
];

const dailyTrend = [
  { date: '22/01', conciliated: 6789, pending: 45, divergent: 12 },
  { date: '23/01', conciliated: 7234, pending: 38, divergent: 8 },
  { date: '24/01', conciliated: 6890, pending: 52, divergent: 15 },
  { date: '25/01', conciliated: 7456, pending: 41, divergent: 10 },
  { date: '26/01', conciliated: 7123, pending: 67, divergent: 23 },
  { date: '27/01', conciliated: 6567, pending: 89, divergent: 45 },
  { date: '28/01', conciliated: 5831, pending: 124, divergent: 219 },
];

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export default function AdminIntConciliation() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('today');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const getDivergenceTypeBadge = (type) => {
    const types = {
      valor_diferente: { label: 'Valor Diferente', color: 'bg-amber-100 text-amber-700' },
      taxa_incorreta: { label: 'Taxa Incorreta', color: 'bg-blue-100 text-blue-700' },
      chargeback_pendente: { label: 'Chargeback', color: 'bg-red-100 text-red-700' },
      pix_nao_confirmado: { label: 'Pix Não Confirmado', color: 'bg-purple-100 text-purple-700' },
      pre_chargeback: { label: 'Pré-Chargeback', color: 'bg-orange-100 text-orange-700' },
    };
    const config = types[type] || { label: type, color: 'bg-slate-100 text-slate-700' };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Conciliação Financeira" 
        subtitle="Acompanhamento completo de conciliação por método de pagamento e ciclo"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
          { label: 'Conciliação', page: 'AdminIntConciliation' }
        ]}
        actions={
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="yesterday">Ontem</SelectItem>
                <SelectItem value="week">Últimos 7 dias</SelectItem>
                <SelectItem value="month">Este mês</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" /> Exportar
            </Button>
          </div>
        }
      />

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-slate-900 border-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Conciliado</p>
                <p className="text-2xl font-bold text-green-600">{conciliationSummary.conciliationRate}%</p>
                <p className="text-xs text-slate-400">{conciliationSummary.conciliated.toLocaleString()} transações</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-slate-900 border-amber-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pendentes</p>
                <p className="text-2xl font-bold text-amber-600">{conciliationSummary.pending}</p>
                <p className="text-xs text-slate-400">{formatCurrency(conciliationSummary.pendingVolume)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-slate-900 border-red-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Divergências</p>
                <p className="text-2xl font-bold text-red-600">{conciliationSummary.divergent}</p>
                <p className="text-xs text-slate-400">{formatCurrency(conciliationSummary.divergentVolume)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-900 border-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Volume Total</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(conciliationSummary.totalVolume)}</p>
                <p className="text-xs text-slate-400">{conciliationSummary.totalTransactions.toLocaleString()} transações</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="methods">Por Método</TabsTrigger>
          <TabsTrigger value="cycles">Ciclos de Liquidação</TabsTrigger>
          <TabsTrigger value="divergent">Divergências</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tendência de Conciliação (7 dias)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="conciliated" name="Conciliado" fill="#2bc196" stackId="a" />
                  <Bar dataKey="pending" name="Pendente" fill="#f59e0b" stackId="a" />
                  <Bar dataKey="divergent" name="Divergente" fill="#ef4444" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Payment Methods Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Conciliação por Método de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethodBreakdown.map((item) => (
                  <div key={item.method} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {item.method === 'Pix' ? (
                          <QrCode className="w-5 h-5 text-[#2bc196]" />
                        ) : (
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        )}
                        <span className="font-medium">{item.method}</span>
                      </div>
                      <Badge className={item.rate >= 99 ? 'bg-green-100 text-green-700' : item.rate >= 95 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}>
                        {item.rate}% conciliado
                      </Badge>
                    </div>
                    <Progress value={item.rate} className="h-2 mb-2" />
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>{item.conciliated.toLocaleString()} / {item.transactions.toLocaleString()} transações</span>
                      <span>{formatCurrency(item.volume)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pix */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#2bc196]/10 flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-[#2bc196]" />
                </div>
                <div>
                  <CardTitle className="text-base">Pix</CardTitle>
                  <CardDescription>Liquidação instantânea (D+0)</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-xs text-slate-500">Transações</p>
                    <p className="text-xl font-bold">28.456</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-xs text-slate-500">Volume</p>
                    <p className="text-xl font-bold">R$ 5.6M</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-xs text-slate-500">Conciliado</p>
                    <p className="text-xl font-bold text-green-600">99.8%</p>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <p className="text-xs text-slate-500">Pendentes</p>
                    <p className="text-xl font-bold text-amber-600">56</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Principais Divergências</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pix não confirmado</span>
                      <span className="font-medium">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Valor diferente</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">MED pendente</span>
                      <span className="font-medium">8</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Cartão</CardTitle>
                  <CardDescription>Múltiplos ciclos de liquidação</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-xs text-slate-500">Transações</p>
                    <p className="text-xl font-bold">17.222</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-xs text-slate-500">Volume</p>
                    <p className="text-xl font-bold">R$ 6.7M</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-xs text-slate-500">Conciliado</p>
                    <p className="text-xl font-bold text-green-600">95.4%</p>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <p className="text-xs text-slate-500">Pendentes</p>
                    <p className="text-xl font-bold text-amber-600">792</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Por Ciclo de Liquidação</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">D+1</span>
                      <span className="font-medium">234 pendentes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">D+2</span>
                      <span className="font-medium">156 pendentes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">D+30</span>
                      <span className="font-medium">402 pendentes</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cycles" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ciclos de Liquidação</CardTitle>
              <CardDescription>Acompanhamento por prazo de recebimento</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ciclo</TableHead>
                    <TableHead>Transações Pendentes</TableHead>
                    <TableHead>Volume Pendente</TableHead>
                    <TableHead>Previsão Liquidação</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settlementCycles.map((cycle) => (
                    <TableRow key={cycle.cycle}>
                      <TableCell className="font-medium">{cycle.cycle}</TableCell>
                      <TableCell>{cycle.pending}</TableCell>
                      <TableCell>{formatCurrency(cycle.volume)}</TableCell>
                      <TableCell>
                        {cycle.cycle === 'D+0 (Pix)' ? 'Imediato' : 
                         cycle.cycle === 'D+1' ? 'Amanhã' :
                         cycle.cycle === 'D+2' ? 'Em 2 dias' :
                         `Em ${cycle.cycle.replace('D+', '')} dias`}
                      </TableCell>
                      <TableCell>
                        {cycle.status === 'processing' ? (
                          <Badge className="bg-blue-100 text-blue-700 gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" /> Processando
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-700 gap-1">
                            <Clock className="w-3 h-3" /> Aguardando
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="divergent" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Divergências para Análise</CardTitle>
                  <CardDescription>Itens que necessitam de investigação manual</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Tipos</SelectItem>
                      <SelectItem value="valor_diferente">Valor Diferente</SelectItem>
                      <SelectItem value="taxa_incorreta">Taxa Incorreta</SelectItem>
                      <SelectItem value="chargeback">Chargeback</SelectItem>
                      <SelectItem value="pix_nao_confirmado">Pix Não Confirmado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transação</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Esperado</TableHead>
                    <TableHead>Recebido</TableHead>
                    <TableHead>Diferença</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {divergentItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs">{item.transaction_id}</TableCell>
                      <TableCell>{item.merchant}</TableCell>
                      <TableCell>{getDivergenceTypeBadge(item.type)}</TableCell>
                      <TableCell>{formatCurrency(item.expected)}</TableCell>
                      <TableCell>{formatCurrency(item.received)}</TableCell>
                      <TableCell className={item.difference < 0 ? 'text-red-600 font-medium' : 'text-amber-600 font-medium'}>
                        {item.difference > 0 ? '+' : ''}{formatCurrency(item.difference)}
                      </TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}