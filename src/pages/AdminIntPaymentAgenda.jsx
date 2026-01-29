import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Search, Filter, Download, Calendar as CalendarIcon, DollarSign, 
  ArrowUpRight, ArrowDownRight, Building2, Clock, CheckCircle2, 
  AlertCircle, TrendingUp, Eye, MoreHorizontal
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data para agenda de pagamentos
const paymentAgendaSummary = {
  totalScheduled: 3456789.50,
  dueToday: 234567.80,
  dueThisWeek: 1234567.90,
  dueThisMonth: 2890123.40,
  overdue: 45678.90,
  merchantsCount: 1234,
};

const upcomingPayments = [
  { 
    id: 'pay_001',
    merchant: 'Tech Solutions Ltda',
    merchant_id: 'sub_abc123',
    amount: 15678.50,
    net_amount: 15123.45,
    fee: 555.05,
    scheduled_date: '2026-01-29',
    method: 'pix',
    type: 'settlement',
    status: 'scheduled'
  },
  { 
    id: 'pay_002',
    merchant: 'E-commerce ABC',
    merchant_id: 'sub_def456',
    amount: 45890.30,
    net_amount: 44287.23,
    fee: 1603.07,
    scheduled_date: '2026-01-29',
    method: 'card',
    type: 'settlement',
    status: 'scheduled'
  },
  { 
    id: 'pay_003',
    merchant: 'Café Gourmet SA',
    merchant_id: 'sub_ghi789',
    amount: 8765.40,
    net_amount: 8459.11,
    fee: 306.29,
    scheduled_date: '2026-01-30',
    method: 'pix',
    type: 'settlement',
    status: 'scheduled'
  },
  { 
    id: 'pay_004',
    merchant: 'Digital Services',
    merchant_id: 'sub_jkl012',
    amount: 23456.00,
    net_amount: 22637.04,
    fee: 818.96,
    scheduled_date: '2026-01-30',
    method: 'card',
    type: 'settlement',
    status: 'scheduled'
  },
  { 
    id: 'pay_005',
    merchant: 'Loja Rápida ME',
    merchant_id: 'sub_mno345',
    amount: -1250.00,
    net_amount: -1250.00,
    fee: 0,
    scheduled_date: '2026-01-29',
    method: 'card',
    type: 'chargeback',
    status: 'pending_debit'
  },
  { 
    id: 'pay_006',
    merchant: 'Fashion Store',
    merchant_id: 'sub_pqr678',
    amount: 5678.90,
    net_amount: 5678.90,
    fee: 0,
    scheduled_date: '2026-01-28',
    method: 'pix',
    type: 'settlement',
    status: 'overdue'
  },
];

const dailyProjection = [
  { date: '29/01', entrada: 234567, saida: 12345, liquido: 222222 },
  { date: '30/01', entrada: 345678, saida: 23456, liquido: 322222 },
  { date: '31/01', entrada: 456789, saida: 34567, liquido: 422222 },
  { date: '01/02', entrada: 567890, saida: 45678, liquido: 522212 },
  { date: '02/02', entrada: 678901, saida: 56789, liquido: 622112 },
  { date: '03/02', entrada: 789012, saida: 67890, liquido: 721122 },
  { date: '04/02', entrada: 890123, saida: 78901, liquido: 811222 },
];

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export default function AdminIntPaymentAgenda() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status) => {
    const configs = {
      scheduled: { label: 'Agendado', color: 'bg-blue-100 text-blue-700', icon: Clock },
      processing: { label: 'Processando', color: 'bg-amber-100 text-amber-700', icon: Clock },
      completed: { label: 'Pago', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
      overdue: { label: 'Atrasado', color: 'bg-red-100 text-red-700', icon: AlertCircle },
      pending_debit: { label: 'Débito Pendente', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
    };
    const config = configs[status] || configs.scheduled;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} gap-1`}>
        <Icon className="w-3 h-3" /> {config.label}
      </Badge>
    );
  };

  const getTypeBadge = (type) => {
    const types = {
      settlement: { label: 'Liquidação', color: 'bg-green-100 text-green-700' },
      chargeback: { label: 'Chargeback', color: 'bg-red-100 text-red-700' },
      refund: { label: 'Reembolso', color: 'bg-amber-100 text-amber-700' },
      fee: { label: 'Taxa', color: 'bg-slate-100 text-slate-700' },
      adjustment: { label: 'Ajuste', color: 'bg-purple-100 text-purple-700' },
    };
    const config = types[type] || types.settlement;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Agenda de Pagamentos" 
        subtitle="Visão completa de repasses e liquidações programadas"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
          { label: 'Agenda de Pagamentos', page: 'AdminIntPaymentAgenda' }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" /> Exportar
            </Button>
          </div>
        }
      />

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Total Agendado</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {formatCurrency(paymentAgendaSummary.totalScheduled)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100">
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Hoje</p>
              <p className="text-lg font-bold text-blue-600">
                {formatCurrency(paymentAgendaSummary.dueToday)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100">
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Esta Semana</p>
              <p className="text-lg font-bold text-indigo-600">
                {formatCurrency(paymentAgendaSummary.dueThisWeek)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-100">
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Este Mês</p>
              <p className="text-lg font-bold text-purple-600">
                {formatCurrency(paymentAgendaSummary.dueThisMonth)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-100">
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Atrasados</p>
              <p className="text-lg font-bold text-red-600">
                {formatCurrency(paymentAgendaSummary.overdue)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Merchants</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {paymentAgendaSummary.merchantsCount.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
          <TabsTrigger value="list">Lista Detalhada</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Projection Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Projeção de Fluxo (Próximos 7 dias)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyProjection}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `R$ ${(value/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="entrada" name="Entradas" fill="#2bc196" />
                  <Bar dataKey="saida" name="Saídas" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Upcoming Payments Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Próximos Pagamentos</CardTitle>
                  <CardDescription>Liquidações e débitos agendados</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Buscar merchant..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor Bruto</TableHead>
                    <TableHead>Taxas</TableHead>
                    <TableHead>Valor Líquido</TableHead>
                    <TableHead>Data Prevista</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingPayments.map((payment) => (
                    <TableRow key={payment.id} className={payment.status === 'overdue' ? 'bg-red-50/50 dark:bg-red-900/10' : ''}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-slate-500" />
                          </div>
                          <div>
                            <p className="font-medium">{payment.merchant}</p>
                            <p className="text-xs text-slate-500">{payment.merchant_id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(payment.type)}</TableCell>
                      <TableCell className={payment.amount < 0 ? 'text-red-600' : ''}>
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {payment.fee > 0 ? `-${formatCurrency(payment.fee)}` : '-'}
                      </TableCell>
                      <TableCell className={`font-medium ${payment.net_amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(payment.net_amount)}
                      </TableCell>
                      <TableCell>{format(new Date(payment.scheduled_date), "dd/MM/yyyy")}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
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

        <TabsContent value="calendar" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-base">Selecionar Data</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={ptBR}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">
                  Pagamentos em {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                      <p className="text-xs text-slate-500 mb-1">Total a Pagar</p>
                      <p className="text-xl font-bold text-green-600">{formatCurrency(234567.80)}</p>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                      <p className="text-xs text-slate-500 mb-1">Débitos</p>
                      <p className="text-xl font-bold text-red-600">{formatCurrency(12345.00)}</p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                      <p className="text-xs text-slate-500 mb-1">Merchants</p>
                      <p className="text-xl font-bold text-blue-600">45</p>
                    </div>
                  </div>
                  <div className="border rounded-lg divide-y">
                    {upcomingPayments.slice(0, 4).map((payment) => (
                      <div key={payment.id} className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${payment.amount >= 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                          <div>
                            <p className="font-medium text-sm">{payment.merchant}</p>
                            <p className="text-xs text-slate-500">{payment.method.toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${payment.net_amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(payment.net_amount)}
                          </p>
                          {getStatusBadge(payment.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Lista Completa de Pagamentos</CardTitle>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="scheduled">Agendados</SelectItem>
                      <SelectItem value="completed">Pagos</SelectItem>
                      <SelectItem value="overdue">Atrasados</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="settlement">Liquidação</SelectItem>
                      <SelectItem value="chargeback">Chargeback</SelectItem>
                      <SelectItem value="refund">Reembolso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Valor Bruto</TableHead>
                    <TableHead>Taxas</TableHead>
                    <TableHead>Valor Líquido</TableHead>
                    <TableHead>Data Prevista</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.merchant}</p>
                          <p className="text-xs text-slate-500">{payment.merchant_id}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(payment.type)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {payment.method.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className={payment.amount < 0 ? 'text-red-600' : ''}>
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {payment.fee > 0 ? `-${formatCurrency(payment.fee)}` : '-'}
                      </TableCell>
                      <TableCell className={`font-medium ${payment.net_amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(payment.net_amount)}
                      </TableCell>
                      <TableCell>{format(new Date(payment.scheduled_date), "dd/MM/yyyy")}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
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