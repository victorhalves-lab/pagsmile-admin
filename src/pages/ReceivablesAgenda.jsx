import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import PageHeader from '@/components/common/PageHeader';
import ReceivablesCalendar from '@/components/financial/ReceivablesCalendar';
import ReceivablesHeatmap from '@/components/financial/v2/ReceivablesHeatmap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Zap,
  Filter,
  CreditCard,
  QrCode,
  Clock,
  CheckCircle2,
  Lock,
  BarChart3,
  Download,
  Send,
  ShieldAlert,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format, differenceInDays, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const statusConfig = {
  scheduled: { label: 'Agendado', color: 'bg-blue-100 text-blue-700', icon: Clock },
  settled: { label: 'Liquidado', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  anticipated: { label: 'Antecipado', color: 'bg-purple-100 text-purple-700', icon: Zap },
  blocked: { label: 'Bloqueado', color: 'bg-red-100 text-red-700', icon: Lock },
};

export default function ReceivablesAgenda() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [periodFilter, setPeriodFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [onlyAnticipatable, setOnlyAnticipatable] = useState(false);

  const { data: receivables = [], isLoading } = useQuery({
    queryKey: ['receivables'],
    queryFn: () => base44.entities.Receivable.list('settlement_date', 500)
  });

  const today = new Date();

  // Filter receivables
  const filteredReceivables = useMemo(() => {
    return receivables.filter(rec => {
      const settlementDate = new Date(rec.settlement_date);
      const daysToSettle = differenceInDays(settlementDate, today);

      // Only future receivables
      if (rec.status !== 'scheduled' || settlementDate < today) return false;

      // Period filter
      if (periodFilter !== 'all') {
        const days = parseInt(periodFilter);
        if (daysToSettle > days) return false;
      }

      // Method filter
      if (methodFilter !== 'all' && rec.payment_method !== methodFilter) return false;

      // Anticipatable filter
      if (onlyAnticipatable && !rec.is_anticipatable) return false;

      // Date filter
      if (selectedDate && rec.settlement_date !== selectedDate) return false;

      return true;
    });
  }, [receivables, periodFilter, methodFilter, onlyAnticipatable, selectedDate, today]);

  // Calculate totals
  const totals = useMemo(() => {
    const total = filteredReceivables.reduce((sum, r) => sum + (r.net_amount || 0), 0);
    const anticipatable = filteredReceivables
      .filter(r => r.is_anticipatable)
      .reduce((sum, r) => sum + (r.net_amount || 0), 0);

    return { total, anticipatable, count: filteredReceivables.length };
  }, [filteredReceivables]);

  // Group by date for chart
  const chartData = useMemo(() => {
    const grouped = {};
    filteredReceivables.forEach(rec => {
      const date = rec.settlement_date;
      if (!grouped[date]) {
        grouped[date] = { date, value: 0, count: 0 };
      }
      grouped[date].value += rec.net_amount || 0;
      grouped[date].count += 1;
    });

    return Object.values(grouped)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 30)
      .map(d => ({
        ...d,
        label: format(new Date(d.date), 'dd/MM')
      }));
  }, [filteredReceivables]);

  // Mock: cessões simuladas (recebíveis cedidos a terceiros)
  const cededReceivables = filteredReceivables.slice(0, 8).map((r, i) => ({
    ...r,
    cession_to: ['Banco XYZ', 'FIDC Master', 'Banco Inter'][i % 3],
    cession_date: format(addDays(today, -i), 'yyyy-MM-dd'),
    cession_value: r.net_amount,
  }));

  // Mock: recebíveis em chargeback (bloqueados)
  const inChargebackReceivables = receivables.filter(r => r.status === 'blocked').slice(0, 5);
  const inChargebackTotal = inChargebackReceivables.reduce((s, r) => s + (r.net_amount || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenda de Recebíveis"
        subtitle="Visualize seus recebíveis futuros, cessões e bloqueios"
        breadcrumbs={[
          { label: 'Financeiro', href: 'Financial' },
          { label: 'Agenda de Recebíveis' }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.success('Relatório fiscal gerado · formato Receita Federal')}>
              <FileText className="w-4 h-4 mr-2" />
              Relatório fiscal
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700" asChild>
              <Link to={createPageUrl('Anticipation')}>
                <Zap className="w-4 h-4 mr-2" />
                Antecipar
              </Link>
            </Button>
          </div>
        }
      />

      {inChargebackTotal > 0 && (
        <Card className="border-red-200 bg-red-50/40">
          <CardContent className="p-3 flex items-center gap-2 text-xs">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span><strong>{formatCurrency(inChargebackTotal)} em recebíveis bloqueados há mais de 7 dias</strong> — aguardando resolução de disputa</span>
            <Button variant="link" size="sm" className="text-red-600 ml-auto" asChild>
              <Link to={createPageUrl('Chargebacks')}>Ver disputas →</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total a Receber</p>
                <p className="text-xl font-bold">{formatCurrency(totals.total)}</p>
                <p className="text-xs text-gray-500">{totals.count} recebíveis</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-purple-700">Disponível para Antecipação</p>
                <p className="text-xl font-bold text-purple-700">{formatCurrency(totals.anticipatable)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ticket Médio</p>
                <p className="text-xl font-bold">
                  {formatCurrency(totals.count > 0 ? totals.total / totals.count : 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>

            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="7">Próximos 7 dias</SelectItem>
                <SelectItem value="15">Próximos 15 dias</SelectItem>
                <SelectItem value="30">Próximos 30 dias</SelectItem>
                <SelectItem value="60">Próximos 60 dias</SelectItem>
                <SelectItem value="90">Próximos 90 dias</SelectItem>
              </SelectContent>
            </Select>

            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="card">Cartão</SelectItem>
                <SelectItem value="pix">Pix</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Switch
                checked={onlyAnticipatable}
                onCheckedChange={setOnlyAnticipatable}
              />
              <Label className="text-sm">Apenas antecipáveis</Label>
            </div>

            {selectedDate && (
              <Badge variant="secondary" className="gap-1">
                {format(new Date(selectedDate), 'dd/MM/yyyy')}
                <button 
                  onClick={() => setSelectedDate(null)}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs principais */}
      <Tabs defaultValue="agenda" className="w-full">
        <TabsList className="bg-white border p-1 h-auto flex flex-wrap gap-1">
          <TabsTrigger value="agenda" className="text-xs gap-1.5"><Calendar className="w-3.5 h-3.5" />Agenda</TabsTrigger>
          <TabsTrigger value="cessions" className="text-xs gap-1.5"><Send className="w-3.5 h-3.5" />Cessões e ônus (CERC)</TabsTrigger>
          <TabsTrigger value="chargebacks" className="text-xs gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />Em chargeback
            {inChargebackReceivables.length > 0 && <Badge className="bg-red-500 text-white h-4 ml-1 text-[9px]">{inChargebackReceivables.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agenda" className="mt-4 space-y-6">
      {/* v2: Receivables heatmap */}
      <ReceivablesHeatmap receivables={filteredReceivables} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar View */}
        <ReceivablesCalendar
          receivables={filteredReceivables}
          onDayClick={setSelectedDate}
          selectedDate={selectedDate}
        />

        {/* Chart View */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fluxo de Recebíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis 
                    tick={{ fontSize: 12 }} 
                    tickFormatter={(value) => `${(value/1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={(label) => `Data: ${label}`}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]} 
                    name="Valor"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Receivables List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Lista de Recebíveis</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Data Liquidação</TableHead>
                  <TableHead>Transação</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Parcela</TableHead>
                  <TableHead className="text-right">Bruto</TableHead>
                  <TableHead className="text-right">Taxa</TableHead>
                  <TableHead className="text-right">Líquido</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceivables.slice(0, 50).map((rec) => {
                  const config = statusConfig[rec.status] || statusConfig.scheduled;
                  const StatusIcon = config.icon;
                  const daysToSettle = differenceInDays(new Date(rec.settlement_date), today);

                  return (
                    <TableRow key={rec.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {format(new Date(rec.settlement_date), 'dd/MM/yyyy')}
                          </p>
                          <p className="text-xs text-gray-500">D+{daysToSettle}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {rec.transaction_id?.slice(0, 12)}...
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {rec.payment_method === 'card' ? (
                            <CreditCard className="w-4 h-4 text-gray-500" />
                          ) : (
                            <QrCode className="w-4 h-4 text-green-500" />
                          )}
                          <span className="text-sm capitalize">{rec.payment_method}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {rec.installment_number && rec.total_installments ? (
                          <Badge variant="outline">
                            {rec.installment_number}/{rec.total_installments}
                          </Badge>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(rec.gross_amount)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        -{formatCurrency(rec.fee_amount)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(rec.net_amount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("gap-1", config.color)}>
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {filteredReceivables.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhum recebível encontrado com os filtros selecionados</p>
            </div>
          )}
        </CardContent>
      </Card>
        </TabsContent>

        {/* CESSÕES */}
        <TabsContent value="cessions" className="mt-4 space-y-4">
          <Card className="bg-violet-50 border-violet-200">
            <CardContent className="p-3 text-xs flex items-start gap-2">
              <Send className="w-4 h-4 text-violet-700 mt-0.5" />
              <div>
                <p className="font-bold text-violet-900">Recebíveis cedidos a terceiros (CERC)</p>
                <p className="text-violet-700 mt-0.5">
                  Estes recebíveis foram cedidos como garantia ou venda definitiva. Você não pode antecipar nem solicitar saque sobre eles até a liquidação na contraparte.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Data Cessão</TableHead>
                    <TableHead>Cessionário</TableHead>
                    <TableHead>ID Recebível</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead className="text-right">Valor cedido</TableHead>
                    <TableHead>Status CERC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cededReceivables.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-xs">{format(new Date(r.cession_date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell><Badge className="bg-violet-100 text-violet-700">{r.cession_to}</Badge></TableCell>
                      <TableCell className="font-mono text-[10px]">{r.id?.slice(0, 16)}</TableCell>
                      <TableCell className="text-xs">{format(new Date(r.settlement_date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(r.cession_value)}</TableCell>
                      <TableCell><Badge className="bg-emerald-100 text-emerald-700 text-[10px]">Registrado</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CHARGEBACKS */}
        <TabsContent value="chargebacks" className="mt-4 space-y-4">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-3 text-xs flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-red-700 mt-0.5" />
              <div>
                <p className="font-bold text-red-900">Recebíveis bloqueados por disputa</p>
                <p className="text-red-700 mt-0.5">
                  Total: <strong>{formatCurrency(inChargebackTotal)}</strong> em {inChargebackReceivables.length} recebíveis.
                  Estes valores serão liberados após resolução das disputas associadas.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              {inChargebackReceivables.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead>Recebível</TableHead>
                      <TableHead>Vencimento original</TableHead>
                      <TableHead>Disputa</TableHead>
                      <TableHead className="text-right">Valor bloqueado</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inChargebackReceivables.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-mono text-[10px]">{r.id?.slice(0, 16)}</TableCell>
                        <TableCell className="text-xs">{format(new Date(r.settlement_date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>
                          <Link to={createPageUrl('Chargebacks')} className="text-violet-600 hover:underline text-[11px]">
                            cb_{r.id?.slice(-6)}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right font-bold text-red-700">{formatCurrency(r.net_amount)}</TableCell>
                        <TableCell><Badge className="bg-red-100 text-red-700 text-[10px]">Bloqueado</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center text-sm text-slate-500">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  Nenhum recebível em chargeback no momento
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}