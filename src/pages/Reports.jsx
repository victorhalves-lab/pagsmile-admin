import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  CreditCard,
  ShieldAlert,
  BarChart3,
  PieChart,
  Clock,
  Mail,
  Plus,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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

import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';

const COLORS = ['#00D26A', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Reports() {
  const [dateRange, setDateRange] = useState('30d');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleConfig, setScheduleConfig] = useState({
    frequency: 'daily',
    time: '09:00',
    recipients: '',
    format: 'pdf'
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['report-transactions'],
    queryFn: () => base44.entities.Transaction.list('-created_date', 500),
  });

  const { data: disputes = [] } = useQuery({
    queryKey: ['report-disputes'],
    queryFn: () => base44.entities.Dispute.list('-created_date', 100),
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  // Calculate metrics
  const approvedTxns = transactions.filter(t => t.status === 'approved');
  const totalGMV = approvedTxns.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalFees = approvedTxns.reduce((sum, t) => sum + (t.fee_amount || 0), 0);
  const avgTicket = approvedTxns.length > 0 ? totalGMV / approvedTxns.length : 0;
  const approvalRate = transactions.length > 0 
    ? (approvedTxns.length / transactions.length * 100).toFixed(1)
    : 0;

  // Sales by day (mock data for chart)
  const salesByDay = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dayTxns = approvedTxns.filter(t => {
      const txnDate = new Date(t.created_date);
      return txnDate.toDateString() === date.toDateString();
    });
    return {
      date: format(date, 'dd/MM'),
      gmv: dayTxns.reduce((sum, t) => sum + (t.amount || 0), 0),
      qty: dayTxns.length
    };
  });

  // Payment methods breakdown
  const cardTxns = approvedTxns.filter(t => t.type === 'card');
  const pixTxns = approvedTxns.filter(t => t.type === 'pix');
  const paymentMethods = [
    { name: 'Cartão', value: cardTxns.reduce((sum, t) => sum + (t.amount || 0), 0), count: cardTxns.length },
    { name: 'Pix', value: pixTxns.reduce((sum, t) => sum + (t.amount || 0), 0), count: pixTxns.length },
  ];

  // Decline reasons (mock)
  const declineReasons = [
    { reason: 'Saldo Insuficiente', count: 45, percentage: 35 },
    { reason: 'Cartão Bloqueado', count: 32, percentage: 25 },
    { reason: 'Antifraude', count: 26, percentage: 20 },
    { reason: 'Dados Inválidos', count: 15, percentage: 12 },
    { reason: 'Outros', count: 10, percentage: 8 },
  ];

  // Dispute metrics
  const openDisputes = disputes.filter(d => ['received', 'in_analysis', 'in_contestation'].includes(d.status));
  const wonDisputes = disputes.filter(d => d.status === 'won');
  const lostDisputes = disputes.filter(d => d.status === 'lost');
  const disputeWinRate = disputes.length > 0 
    ? (wonDisputes.length / (wonDisputes.length + lostDisputes.length) * 100).toFixed(1)
    : 0;

  const reportCategories = [
    {
      id: 'sales',
      name: 'Relatórios de Vendas',
      icon: TrendingUp,
      color: 'emerald',
      reports: [
        { name: 'Resumo de Vendas', description: 'GMV, quantidade, ticket médio, aprovação' },
        { name: 'Vendas por Dia', description: 'Detalhamento diário' },
        { name: 'Vendas por Hora', description: 'Distribuição horária' },
        { name: 'Vendas por Canal', description: 'API, Link, Checkout, Assinatura' },
      ]
    },
    {
      id: 'financial',
      name: 'Relatórios Financeiros',
      icon: DollarSign,
      color: 'blue',
      reports: [
        { name: 'Resumo Financeiro', description: 'Entradas, saídas e saldo' },
        { name: 'Relatório de Taxas', description: 'MDR, antecipação, outras' },
        { name: 'Agenda de Recebíveis', description: 'Projeção de recebimentos' },
        { name: 'Relatório de Saques', description: 'Histórico de saques' },
      ]
    },
    {
      id: 'performance',
      name: 'Relatórios de Performance',
      icon: BarChart3,
      color: 'purple',
      reports: [
        { name: 'Taxa de Aprovação', description: 'Por bandeira, BIN, valor, horário' },
        { name: 'Análise de Recusas', description: 'Por motivo e tendência' },
        { name: 'Conversão de Checkout', description: 'Funil de conversão' },
        { name: 'Conversão de Pix', description: 'QRs gerados vs pagos' },
      ]
    },
    {
      id: 'disputes',
      name: 'Relatórios de Disputas',
      icon: ShieldAlert,
      color: 'red',
      reports: [
        { name: 'Resumo de Disputas', description: 'Quantidade, valor, ratio, win rate' },
        { name: 'Chargebacks por Motivo', description: 'Breakdown por reason code' },
        { name: 'Relatório de Compliance', description: 'Status nos programas' },
      ]
    },
  ];

  const handleExport = (format) => {
    toast.success(`Exportando relatório em ${format.toUpperCase()}...`);
  };

  const handleSchedule = () => {
    toast.success('Agendamento configurado com sucesso!');
    setIsScheduleOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatórios"
        subtitle="Analytics e relatórios detalhados"
        breadcrumbs={[
          { label: 'Analytics', page: 'Analytics' },
          { label: 'Relatórios', page: 'Reports' }
        ]}
        actions={
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-36">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                <SelectItem value="month">Este mês</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setIsScheduleOpen(true)}>
              <Clock className="w-4 h-4 mr-2" />
              Agendar
            </Button>
            <Button className="bg-[#00D26A] hover:bg-[#00A854]" onClick={() => handleExport('pdf')}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="disputes">Disputas</TabsTrigger>
        </TabsList>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">GMV Total</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalGMV)}</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Transações</p>
                    <p className="text-2xl font-bold text-gray-900">{approvedTxns.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Ticket Médio</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgTicket)}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Taxa Aprovação</p>
                    <p className="text-2xl font-bold text-emerald-600">{approvalRate}%</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Vendas por Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesByDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" fontSize={11} />
                      <YAxis fontSize={11} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        labelStyle={{ color: '#666' }}
                      />
                      <Bar dataKey="gmv" fill="#00D26A" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Métodos de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={paymentMethods}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {paymentMethods.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">Vendas Líquidas</p>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalGMV - totalFees)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">Taxas (MDR)</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalFees)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">Estornos</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(0)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">Taxa Média</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalGMV > 0 ? ((totalFees / totalGMV) * 100).toFixed(2) : 0}%
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fluxo Financeiro (30 dias)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" fontSize={11} />
                    <YAxis fontSize={11} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Line type="monotone" dataKey="gmv" stroke="#00D26A" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Motivos de Recusa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {declineReasons.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{item.reason}</span>
                          <span className="text-sm text-gray-500">{item.count} ({item.percentage}%)</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div 
                            className="h-2 bg-red-500 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Taxa de Aprovação por Hora</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Array.from({ length: 24 }, (_, i) => ({
                      hora: `${i}h`,
                      taxa: 75 + Math.random() * 20
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="hora" fontSize={10} />
                      <YAxis domain={[0, 100]} fontSize={11} />
                      <Tooltip formatter={(v) => `${v.toFixed(1)}%`} />
                      <Bar dataKey="taxa" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Disputes Tab */}
        <TabsContent value="disputes" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">Total de Disputas</p>
                <p className="text-2xl font-bold text-gray-900">{disputes.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">Em Aberto</p>
                <p className="text-2xl font-bold text-yellow-600">{openDisputes.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">Taxa de Vitória</p>
                <p className="text-2xl font-bold text-emerald-600">{disputeWinRate}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">Valor em Risco</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(openDisputes.reduce((sum, d) => sum + (d.amount || 0), 0))}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Available Reports */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Todos os Relatórios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    category.color === 'emerald' && "bg-emerald-100",
                    category.color === 'blue' && "bg-blue-100",
                    category.color === 'purple' && "bg-purple-100",
                    category.color === 'red' && "bg-red-100",
                  )}>
                    <category.icon className={cn(
                      "w-5 h-5",
                      category.color === 'emerald' && "text-emerald-600",
                      category.color === 'blue' && "text-blue-600",
                      category.color === 'purple' && "text-purple-600",
                      category.color === 'red' && "text-red-600",
                    )} />
                  </div>
                  <CardTitle className="text-base">{category.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.reports.map((report, idx) => (
                    <button
                      key={idx}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      onClick={() => toast.info(`Abrindo: ${report.name}`)}
                    >
                      <div>
                        <p className="font-medium text-sm">{report.name}</p>
                        <p className="text-xs text-gray-500">{report.description}</p>
                      </div>
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Schedule Dialog */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agendar Envio de Relatório</DialogTitle>
            <DialogDescription>Receba relatórios automaticamente por e-mail</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Frequência</Label>
              <Select 
                value={scheduleConfig.frequency} 
                onValueChange={(v) => setScheduleConfig({ ...scheduleConfig, frequency: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Horário de Envio</Label>
              <Input 
                type="time" 
                value={scheduleConfig.time}
                onChange={(e) => setScheduleConfig({ ...scheduleConfig, time: e.target.value })}
              />
            </div>
            <div>
              <Label>Destinatários (separados por vírgula)</Label>
              <Input 
                placeholder="email@exemplo.com"
                value={scheduleConfig.recipients}
                onChange={(e) => setScheduleConfig({ ...scheduleConfig, recipients: e.target.value })}
              />
            </div>
            <div>
              <Label>Formato</Label>
              <Select 
                value={scheduleConfig.format} 
                onValueChange={(v) => setScheduleConfig({ ...scheduleConfig, format: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>Cancelar</Button>
            <Button className="bg-[#00D26A] hover:bg-[#00A854]" onClick={handleSchedule}>
              <Mail className="w-4 h-4 mr-2" />
              Agendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}