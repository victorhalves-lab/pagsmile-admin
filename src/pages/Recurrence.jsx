import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Repeat, DollarSign, RefreshCw, CheckCircle2, Plus, Settings, Eye, CreditCard, QrCode, MoreHorizontal, BarChart3, Calendar, AlertTriangle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { format } from 'date-fns';

import PageHeader from '@/components/common/PageHeader';
import KPICard from '@/components/dashboard/KPICard';
import RecurrenceAnomaliesCard from '@/components/subscriptions/recurrence/RecurrenceAnomaliesCard';
import UpcomingChargesCalendar from '@/components/subscriptions/recurrence/UpcomingChargesCalendar';
import RecurrenceFailureBreakdown from '@/components/subscriptions/recurrence/RecurrenceFailureBreakdown';
import RetryVisualEditor from '@/components/subscriptions/recurrence/RetryVisualEditor';
import { mockCharges } from '@/components/subscriptions/mockData';
import { fmtCurrency } from '@/components/subscriptions/utils';

const statusBadge = {
  approved: { label: 'Aprovada', className: 'bg-emerald-100 text-emerald-700' },
  pending_retry: { label: 'Em retry', className: 'bg-amber-100 text-amber-700' },
  failed: { label: 'Falhou', className: 'bg-red-100 text-red-700' },
};

const revenueChartData = [
  { month: 'Set', valor: 45000 }, { month: 'Out', valor: 52000 }, { month: 'Nov', valor: 58000 },
  { month: 'Dez', valor: 61000 }, { month: 'Jan', valor: 68000 }, { month: 'Fev', valor: 72500 },
];

export default function Recurrence() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  const filteredCharges = mockCharges.filter((c) => {
    if (search && !c.customer.toLowerCase().includes(search.toLowerCase()) && !c.subscription_id.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (methodFilter !== 'all' && c.method !== methodFilter) return false;
    return true;
  });

  return (
    <div className="space-y-3">
      <PageHeader
        title="Motor de Recorrência"
        subtitle="Lista de cobranças, retry engine e operação real-time"
        breadcrumbs={[{ label: 'Assinaturas', page: 'Subscriptions' }, { label: 'Recorrência' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(createPageUrl('DunningSettings'))}><Settings className="w-3.5 h-3.5 mr-1" /> Dunning</Button>
            <Button size="sm" className="bg-[#2bc196] hover:bg-[#239b7a]"><Plus className="w-3.5 h-3.5 mr-1" /> Nova recorrência</Button>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3">
        <TabsList className="bg-white dark:bg-slate-900 border h-9">
          <TabsTrigger value="dashboard" className="text-xs gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Dashboard</TabsTrigger>
          <TabsTrigger value="charges" className="text-xs gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Cobranças</TabsTrigger>
          <TabsTrigger value="retry" className="text-xs gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Retry & Recovery</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            <KPICard title="MRR" value={72500} format="currency" change={12.5} icon={DollarSign} iconBg="bg-emerald-100" iconColor="text-emerald-600" />
            <KPICard title="Recorrências ativas" value={156} format="number" change={8} icon={Repeat} iconBg="bg-blue-100" iconColor="text-blue-600" />
            <KPICard title="Taxa de sucesso" value={94.5} format="percentage" change={2.3} icon={CheckCircle2} iconBg="bg-emerald-100" iconColor="text-emerald-600" />
            <KPICard title="Recovery rate" value={78.3} format="percentage" change={5.1} icon={RefreshCw} iconBg="bg-purple-100" iconColor="text-purple-600" />
            <KPICard title="Receita 24h" value={4580} format="currency" icon={Calendar} iconBg="bg-blue-100" iconColor="text-blue-600" />
            <KPICard title="MRR em risco" value={4500} format="currency" icon={AlertTriangle} iconBg="bg-red-100" iconColor="text-red-600" />
          </div>

          <RecurrenceAnomaliesCard />
          <UpcomingChargesCalendar />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Evolução receita recorrente</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={revenueChartData}>
                    <defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2bc196" stopOpacity={0.4} /><stop offset="95%" stopColor="#2bc196" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => fmtCurrency(v)} />
                    <Area type="monotone" dataKey="valor" stroke="#2bc196" strokeWidth={2} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Distribuição por frequência</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={[{ frequency: 'Mensal', q: 156 }, { frequency: 'Semanal', q: 42 }, { frequency: 'Quinzenal', q: 28 }, { frequency: 'Trimestral', q: 15 }, { frequency: 'Anual', q: 8 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="frequency" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="q" fill="#2bc196" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <RecurrenceFailureBreakdown />
        </TabsContent>

        <TabsContent value="charges" className="space-y-3">
          <Card>
            <CardContent className="p-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." className="pl-9 h-8 text-xs" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">Todos</SelectItem>
                    <SelectItem value="approved" className="text-xs">Aprovadas</SelectItem>
                    <SelectItem value="pending_retry" className="text-xs">Em retry</SelectItem>
                    <SelectItem value="failed" className="text-xs">Falharam</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Método" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">Todos</SelectItem>
                    <SelectItem value="card" className="text-xs">Cartão</SelectItem>
                    <SelectItem value="pix" className="text-xs">PIX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                    <TableHead className="text-[10px]">Data/hora</TableHead>
                    <TableHead className="text-[10px]">Recorrência</TableHead>
                    <TableHead className="text-[10px]">Cliente</TableHead>
                    <TableHead className="text-[10px]">Valor</TableHead>
                    <TableHead className="text-[10px]">Método</TableHead>
                    <TableHead className="text-[10px]">Status</TableHead>
                    <TableHead className="text-[10px]">Tentativas</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCharges.map((c) => (
                    <TableRow key={c.id} className="hover:bg-slate-50">
                      <TableCell className="text-xs">{format(new Date(c.date), 'dd/MM HH:mm')}</TableCell>
                      <TableCell className="text-xs font-mono">{c.subscription_id}</TableCell>
                      <TableCell className="text-xs">{c.customer}</TableCell>
                      <TableCell className="text-xs font-bold">{fmtCurrency(c.amount, { precise: true })}</TableCell>
                      <TableCell><div className="flex items-center gap-1.5">{c.method === 'card' ? <CreditCard className="w-3 h-3 text-slate-400" /> : <QrCode className="w-3 h-3 text-emerald-500" />}<span className="text-[10px]">{c.method === 'card' ? `••${c.last_four}` : 'PIX'}</span></div></TableCell>
                      <TableCell><Badge className={`text-[10px] ${statusBadge[c.status]?.className}`}>{statusBadge[c.status]?.label}</Badge>{c.fail_reason && <p className="text-[9px] text-red-500 mt-0.5">{c.fail_reason}</p>}</TableCell>
                      <TableCell className="text-xs">{c.attempts}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button size="icon" variant="ghost" className="h-7 w-7"><MoreHorizontal className="w-3 h-3" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Eye className="w-3 h-3 mr-2" /> Ver detalhes</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.success('Retry forçado')}><RefreshCw className="w-3 h-3 mr-2" /> Forçar retry</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.success('Pulado')}>Pular próximo retry</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.success('PIX')}>Migrar para PIX</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.success('Card update')}>Solicitar update de cartão</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Cancelar recorrência</DropdownMenuItem>
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

        <TabsContent value="retry" className="space-y-3">
          <Card className="bg-blue-50/40 border-blue-200">
            <CardContent className="p-3 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-blue-900">Configuração consolidada</p>
                <p className="text-blue-700">Regras de retry e dunning vivem em uma única tela. <button onClick={() => navigate(createPageUrl('DunningSettings'))} className="underline font-bold">Abrir configuração completa →</button></p>
              </div>
            </CardContent>
          </Card>
          <RetryVisualEditor retries={[1, 3, 7, 15]} />
          <RecurrenceFailureBreakdown />
        </TabsContent>
      </Tabs>
    </div>
  );
}