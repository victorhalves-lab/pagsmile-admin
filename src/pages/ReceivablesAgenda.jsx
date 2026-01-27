import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import PageHeader from '@/components/common/PageHeader';
import ReceivablesCalendar from '@/components/financial/ReceivablesCalendar';
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
  Download
} from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenda de Recebíveis"
        subtitle="Visualize seus recebíveis futuros e solicite antecipação"
        breadcrumbs={[
          { label: 'Financeiro', href: 'Financial' },
          { label: 'Agenda de Recebíveis' }
        ]}
        actions={
          <Button className="bg-purple-600 hover:bg-purple-700" asChild>
            <Link to={createPageUrl('Anticipation')}>
              <Zap className="w-4 h-4 mr-2" />
              Antecipar
            </Link>
          </Button>
        }
      />

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
    </div>
  );
}