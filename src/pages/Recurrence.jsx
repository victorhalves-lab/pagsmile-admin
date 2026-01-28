import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Repeat,
  CreditCard,
  QrCode,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Pause,
  Play,
  XCircle,
  Edit3,
  Clock,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Settings,
  BarChart3,
  Mail,
  Bell,
  Zap,
  Target,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { format, addDays, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

import PageHeader from '@/components/common/PageHeader';
import KPICard from '@/components/dashboard/KPICard';

// Configurações de status
const statusConfig = {
  active: { label: 'Ativa', className: 'bg-green-100 text-green-700' },
  paused: { label: 'Pausada', className: 'bg-gray-100 text-gray-600' },
  pending_retry: { label: 'Aguardando Retentativa', className: 'bg-amber-100 text-amber-700' },
  failed: { label: 'Falhou', className: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Cancelada', className: 'bg-slate-100 text-slate-600' },
  completed: { label: 'Concluída', className: 'bg-blue-100 text-blue-700' }
};

const frequencyLabels = {
  daily: 'Diário',
  weekly: 'Semanal',
  biweekly: 'Quinzenal',
  monthly: 'Mensal',
  bimonthly: 'Bimestral',
  quarterly: 'Trimestral',
  custom: 'Personalizado'
};

const paymentMethodLabels = {
  credit_card: 'Cartão de Crédito',
  pix_recorrente: 'Pix Recorrente',
  boleto: 'Boleto'
};

export default function Recurrence() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [showNewRecurrenceDialog, setShowNewRecurrenceDialog] = useState(false);
  const [showRetryConfigDialog, setShowRetryConfigDialog] = useState(false);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  // Mock data para recorrências
  const recurrences = [
    {
      id: 'REC-001',
      customer_name: 'João Silva',
      customer_email: 'joao@email.com',
      amount: 299.90,
      frequency: 'monthly',
      payment_method: 'credit_card',
      card_last_four: '4532',
      card_brand: 'visa',
      status: 'active',
      next_charge_date: '2026-02-15',
      created_date: '2025-06-15',
      total_charged: 2099.30,
      charges_count: 7,
      failed_attempts: 0,
      description: 'Plano Premium Mensal'
    },
    {
      id: 'REC-002',
      customer_name: 'Maria Santos',
      customer_email: 'maria@email.com',
      amount: 89.90,
      frequency: 'monthly',
      payment_method: 'pix_recorrente',
      status: 'active',
      next_charge_date: '2026-02-10',
      created_date: '2025-08-10',
      total_charged: 449.50,
      charges_count: 5,
      failed_attempts: 0,
      description: 'Assinatura Básica'
    },
    {
      id: 'REC-003',
      customer_name: 'Pedro Costa',
      customer_email: 'pedro@empresa.com',
      amount: 1500.00,
      frequency: 'monthly',
      payment_method: 'credit_card',
      card_last_four: '8821',
      card_brand: 'mastercard',
      status: 'pending_retry',
      next_charge_date: '2026-01-30',
      created_date: '2025-03-01',
      total_charged: 15000.00,
      charges_count: 10,
      failed_attempts: 2,
      last_failure_reason: 'Cartão recusado - Saldo insuficiente',
      description: 'Licença Empresarial'
    },
    {
      id: 'REC-004',
      customer_name: 'Ana Oliveira',
      customer_email: 'ana@startup.io',
      amount: 199.00,
      frequency: 'weekly',
      payment_method: 'credit_card',
      card_last_four: '1234',
      card_brand: 'elo',
      status: 'active',
      next_charge_date: '2026-02-03',
      created_date: '2025-11-01',
      total_charged: 2388.00,
      charges_count: 12,
      failed_attempts: 1,
      description: 'Serviço Semanal Premium'
    },
    {
      id: 'REC-005',
      customer_name: 'Carlos Mendes',
      customer_email: 'carlos@corp.com.br',
      amount: 4999.00,
      frequency: 'quarterly',
      payment_method: 'boleto',
      status: 'active',
      next_charge_date: '2026-04-01',
      created_date: '2025-01-01',
      total_charged: 19996.00,
      charges_count: 4,
      failed_attempts: 0,
      description: 'Plano Enterprise Trimestral'
    }
  ];

  // Calcular métricas
  const activeRecurrences = recurrences.filter(r => r.status === 'active');
  const mrr = activeRecurrences.reduce((sum, r) => {
    let monthlyValue = r.amount;
    if (r.frequency === 'weekly') monthlyValue *= 4;
    if (r.frequency === 'biweekly') monthlyValue *= 2;
    if (r.frequency === 'quarterly') monthlyValue /= 3;
    return sum + monthlyValue;
  }, 0);
  const pendingRetry = recurrences.filter(r => r.status === 'pending_retry');
  const totalCustomers = new Set(recurrences.map(r => r.customer_email)).size;
  const avgTicket = recurrences.length > 0 ? recurrences.reduce((sum, r) => sum + r.amount, 0) / recurrences.length : 0;
  const recoveryRate = 78; // Mock
  const chargeSuccessRate = 94.5; // Mock

  // Mock chart data
  const revenueChartData = [
    { month: 'Set', valor: 45000 },
    { month: 'Out', valor: 52000 },
    { month: 'Nov', valor: 58000 },
    { month: 'Dez', valor: 61000 },
    { month: 'Jan', valor: 68000 },
  ];

  const paymentMethodDistribution = [
    { name: 'Cartão', value: 65, color: '#3B82F6' },
    { name: 'Pix', value: 25, color: '#00D26A' },
    { name: 'Boleto', value: 10, color: '#F59E0B' },
  ];

  const frequencyDistribution = [
    { frequency: 'Mensal', quantidade: 156 },
    { frequency: 'Semanal', quantidade: 42 },
    { frequency: 'Quinzenal', quantidade: 28 },
    { frequency: 'Trimestral', quantidade: 15 },
  ];

  // Filtrar recorrências
  const filteredRecurrences = recurrences.filter(r => {
    const matchesSearch = !searchTerm || 
      r.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesPayment = paymentMethodFilter === 'all' || r.payment_method === paymentMethodFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Motor de Recorrência"
        subtitle="Gerencie cobranças recorrentes de forma inteligente"
        breadcrumbs={[
          { label: 'Assinaturas', page: 'Subscriptions' },
          { label: 'Recorrência', page: 'Recurrence' }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowRetryConfigDialog(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Configurar Retentativas
            </Button>
            <Button 
              className="bg-[#00D26A] hover:bg-[#00A854]"
              onClick={() => setShowNewRecurrenceDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Recorrência
            </Button>
          </div>
        }
      />

      {/* Tabs internas */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border shadow-sm h-12">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#00D26A] data-[state=active]:text-white gap-2">
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="recurrences" className="data-[state=active]:bg-[#00D26A] data-[state=active]:text-white gap-2">
            <Repeat className="w-4 h-4" />
            Recorrências
          </TabsTrigger>
          <TabsTrigger value="charges" className="data-[state=active]:bg-[#00D26A] data-[state=active]:text-white gap-2">
            <DollarSign className="w-4 h-4" />
            Cobranças
          </TabsTrigger>
          <TabsTrigger value="retry" className="data-[state=active]:bg-[#00D26A] data-[state=active]:text-white gap-2">
            <RefreshCw className="w-4 h-4" />
            Retentativas
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-[#00D26A] data-[state=active]:text-white gap-2">
            <Bell className="w-4 h-4" />
            Notificações
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="MRR (Receita Mensal)"
              value={mrr}
              format="currency"
              change={12.5}
              icon={DollarSign}
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
            />
            <KPICard
              title="Recorrências Ativas"
              value={activeRecurrences.length}
              format="number"
              change={8}
              icon={Repeat}
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />
            <KPICard
              title="Taxa de Sucesso"
              value={chargeSuccessRate}
              format="percentage"
              change={2.3}
              icon={CheckCircle2}
              iconBg="bg-green-100"
              iconColor="text-green-600"
            />
            <KPICard
              title="Taxa de Recuperação"
              value={recoveryRate}
              format="percentage"
              change={5.1}
              icon={RefreshCw}
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
            />
          </div>

          {/* Alert for pending retries */}
          {pendingRetry.length > 0 && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-amber-900">
                      {pendingRetry.length} recorrência(s) aguardando retentativa
                    </h4>
                    <p className="text-sm text-amber-700">
                      O motor de retentativas está configurado para tentar novamente automaticamente.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="border-amber-300 text-amber-700">
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Evolução da Receita Recorrente</CardTitle>
                <CardDescription>Últimos 5 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueChartData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00D26A" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00D26A" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                      <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(v) => `R$ ${(v/1000).toFixed(0)}k`} />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value), 'Receita']}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="valor" 
                        stroke="#00D26A" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pagamento</CardTitle>
                <CardDescription>Distribuição por método</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name} ${value}%`}
                      >
                        {paymentMethodDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  {paymentMethodDistribution.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-slate-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Frequency Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Frequência</CardTitle>
              <CardDescription>Quantidade de recorrências por periodicidade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={frequencyDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="frequency" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
                    />
                    <Bar dataKey="quantidade" fill="#00D26A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recurrences Tab */}
        <TabsContent value="recurrences" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Buscar por cliente, e-mail ou ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="active">Ativas</SelectItem>
                    <SelectItem value="paused">Pausadas</SelectItem>
                    <SelectItem value="pending_retry">Retentativa</SelectItem>
                    <SelectItem value="failed">Falharam</SelectItem>
                    <SelectItem value="cancelled">Canceladas</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Métodos</SelectItem>
                    <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                    <SelectItem value="pix_recorrente">Pix Recorrente</SelectItem>
                    <SelectItem value="boleto">Boleto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Recorrência</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Próxima Cobrança</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Cobrado</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecurrences.map((rec) => (
                    <TableRow key={rec.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{rec.description}</p>
                          <p className="text-xs text-slate-500">{rec.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{rec.customer_name}</p>
                          <p className="text-xs text-slate-500">{rec.customer_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-slate-900">{formatCurrency(rec.amount)}</p>
                          <p className="text-xs text-slate-500">{frequencyLabels[rec.frequency]}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {rec.payment_method === 'credit_card' && (
                            <>
                              <CreditCard className="w-4 h-4 text-slate-400" />
                              <span className="text-sm">•••• {rec.card_last_four}</span>
                            </>
                          )}
                          {rec.payment_method === 'pix_recorrente' && (
                            <>
                              <QrCode className="w-4 h-4 text-emerald-500" />
                              <span className="text-sm">Pix</span>
                            </>
                          )}
                          {rec.payment_method === 'boleto' && (
                            <span className="text-sm">Boleto</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {rec.status !== 'cancelled' ? (
                          <div>
                            <p className="text-sm text-slate-900">
                              {format(new Date(rec.next_charge_date), 'dd/MM/yyyy')}
                            </p>
                            <p className="text-xs text-slate-500">
                              em {differenceInDays(new Date(rec.next_charge_date), new Date())} dias
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className={statusConfig[rec.status]?.className}>
                            {statusConfig[rec.status]?.label}
                          </Badge>
                          {rec.failed_attempts > 0 && (
                            <Badge variant="outline" className="text-amber-600 border-amber-300">
                              {rec.failed_attempts} falha(s)
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-emerald-600">{formatCurrency(rec.total_charged)}</p>
                          <p className="text-xs text-slate-500">{rec.charges_count} cobranças</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit3 className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {rec.status === 'active' && (
                              <DropdownMenuItem>
                                <Pause className="w-4 h-4 mr-2" />
                                Pausar
                              </DropdownMenuItem>
                            )}
                            {rec.status === 'paused' && (
                              <DropdownMenuItem>
                                <Play className="w-4 h-4 mr-2" />
                                Retomar
                              </DropdownMenuItem>
                            )}
                            {rec.status === 'pending_retry' && (
                              <DropdownMenuItem>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Forçar retentativa
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancelar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Charges Tab */}
        <TabsContent value="charges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Cobranças</CardTitle>
              <CardDescription>Todas as cobranças processadas pelo motor de recorrência</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Data</TableHead>
                    <TableHead>Recorrência</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tentativas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>27/01/2026 08:00</TableCell>
                    <TableCell>Plano Premium Mensal</TableCell>
                    <TableCell>João Silva</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(299.90)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-4 h-4 text-slate-400" />
                        <span>•••• 4532</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700">Aprovada</Badge>
                    </TableCell>
                    <TableCell>1</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>26/01/2026 10:30</TableCell>
                    <TableCell>Licença Empresarial</TableCell>
                    <TableCell>Pedro Costa</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(1500.00)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-4 h-4 text-slate-400" />
                        <span>•••• 8821</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-amber-100 text-amber-700">Aguardando</Badge>
                    </TableCell>
                    <TableCell>2/4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>25/01/2026 09:15</TableCell>
                    <TableCell>Assinatura Básica</TableCell>
                    <TableCell>Maria Santos</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(89.90)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <QrCode className="w-4 h-4 text-emerald-500" />
                        <span>Pix</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700">Aprovada</Badge>
                    </TableCell>
                    <TableCell>1</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Retry Tab */}
        <TabsContent value="retry" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Config Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-[#00D26A]" />
                  Motor de Retentativas
                </CardTitle>
                <CardDescription>Configure as regras de retentativa para cobranças falhas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Retentativas Automáticas</p>
                    <p className="text-sm text-slate-500">Tentar novamente cobranças que falharem</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Número máximo de tentativas</Label>
                    <Select defaultValue="4">
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 tentativas</SelectItem>
                        <SelectItem value="3">3 tentativas</SelectItem>
                        <SelectItem value="4">4 tentativas</SelectItem>
                        <SelectItem value="5">5 tentativas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Intervalo entre tentativas</Label>
                    <div className="grid grid-cols-4 gap-2 mt-1.5">
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <p className="text-lg font-bold text-slate-900">1ª</p>
                        <p className="text-xs text-slate-500">1 dia</p>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <p className="text-lg font-bold text-slate-900">2ª</p>
                        <p className="text-xs text-slate-500">3 dias</p>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <p className="text-lg font-bold text-slate-900">3ª</p>
                        <p className="text-xs text-slate-500">7 dias</p>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <p className="text-lg font-bold text-slate-900">4ª</p>
                        <p className="text-xs text-slate-500">15 dias</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-[#00D26A] hover:bg-[#00A854]">
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Performance de Recuperação</CardTitle>
                <CardDescription>Últimos 30 dias</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <p className="text-sm text-emerald-600 font-medium">Recuperadas</p>
                    <p className="text-3xl font-bold text-emerald-700">47</p>
                    <p className="text-xs text-emerald-600 mt-1">{formatCurrency(12350)}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-xl">
                    <p className="text-sm text-red-600 font-medium">Não recuperadas</p>
                    <p className="text-3xl font-bold text-red-700">13</p>
                    <p className="text-xs text-red-600 mt-1">{formatCurrency(3420)}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Taxa de Recuperação</span>
                    <span className="text-lg font-bold text-[#00D26A]">78.3%</span>
                  </div>
                  <Progress value={78.3} className="h-3" />
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-700">Recuperação por tentativa:</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">1ª tentativa</span>
                      <div className="flex items-center gap-2">
                        <Progress value={45} className="w-24 h-2" />
                        <span className="text-sm font-medium">45%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">2ª tentativa</span>
                      <div className="flex items-center gap-2">
                        <Progress value={25} className="w-24 h-2" />
                        <span className="text-sm font-medium">25%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">3ª tentativa</span>
                      <div className="flex items-center gap-2">
                        <Progress value={6} className="w-24 h-2" />
                        <span className="text-sm font-medium">6%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">4ª tentativa</span>
                      <div className="flex items-center gap-2">
                        <Progress value={2} className="w-24 h-2" />
                        <span className="text-sm font-medium">2%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  Notificações por E-mail
                </CardTitle>
                <CardDescription>Configure os e-mails enviados aos clientes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium">Lembrete de cobrança</p>
                    <p className="text-sm text-slate-500">3 dias antes da cobrança</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium">Cobrança realizada</p>
                    <p className="text-sm text-slate-500">Após cobrança bem-sucedida</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium">Cobrança falhou</p>
                    <p className="text-sm text-slate-500">Quando a cobrança falhar</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium">Cartão expirando</p>
                    <p className="text-sm text-slate-500">30 dias antes do vencimento</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Automações
                </CardTitle>
                <CardDescription>Ações automáticas baseadas em eventos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium">Após 4 falhas consecutivas</p>
                    <Badge variant="outline">Ativo</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <ArrowRight className="w-4 h-4" />
                    <span>Pausar recorrência e notificar equipe</span>
                  </div>
                </div>
                <div className="p-4 border rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium">Cartão expirado</p>
                    <Badge variant="outline">Ativo</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <ArrowRight className="w-4 h-4" />
                    <span>Enviar link para atualização do cartão</span>
                  </div>
                </div>
                <div className="p-4 border rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium">Cobrança recuperada</p>
                    <Badge variant="outline">Ativo</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <ArrowRight className="w-4 h-4" />
                    <span>Reativar acesso do cliente</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Automação
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* New Recurrence Dialog */}
      <Dialog open={showNewRecurrenceDialog} onOpenChange={setShowNewRecurrenceDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Recorrência</DialogTitle>
            <DialogDescription>Configure uma nova cobrança recorrente</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="joao">João Silva</SelectItem>
                  <SelectItem value="maria">Maria Santos</SelectItem>
                  <SelectItem value="pedro">Pedro Costa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor</Label>
                <Input type="number" placeholder="0,00" />
              </div>
              <div className="space-y-2">
                <Label>Frequência</Label>
                <Select defaultValue="monthly">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="biweekly">Quinzenal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="quarterly">Trimestral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Método de Pagamento</Label>
              <Select defaultValue="credit_card">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                  <SelectItem value="pix_recorrente">Pix Recorrente</SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input placeholder="Ex: Assinatura Premium Mensal" />
            </div>
            <div className="space-y-2">
              <Label>Data da primeira cobrança</Label>
              <Input type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewRecurrenceDialog(false)}>
              Cancelar
            </Button>
            <Button className="bg-[#00D26A] hover:bg-[#00A854]">
              Criar Recorrência
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}