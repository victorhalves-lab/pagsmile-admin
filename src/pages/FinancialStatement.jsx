import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import FinancialStatementTable from '@/components/financial/FinancialStatementTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  Calendar as CalendarIcon,
  Filter,
  FileSpreadsheet,
  FileText,
  File,
  Mail,
  RefreshCcw,
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const periodPresets = [
  { label: 'Hoje', value: 'today' },
  { label: 'Ontem', value: 'yesterday' },
  { label: 'Últimos 7 dias', value: '7days' },
  { label: 'Últimos 30 dias', value: '30days' },
  { label: 'Este mês', value: 'thisMonth' },
  { label: 'Personalizado', value: 'custom' },
];

const categoryOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Vendas', value: 'sale' },
  { label: 'Estornos', value: 'refund' },
  { label: 'Chargebacks', value: 'chargeback' },
  { label: 'Saques', value: 'withdrawal' },
  { label: 'Antecipações', value: 'anticipation' },
  { label: 'Taxas', value: 'fee' },
  { label: 'Ajustes', value: 'adjustment' },
  { label: 'Split', value: 'split' },
];

export default function FinancialStatement() {
  const [periodPreset, setPeriodPreset] = useState('30days');
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const { data: entries = [], isLoading, refetch } = useQuery({
    queryKey: ['financial-entries', dateRange],
    queryFn: () => base44.entities.FinancialEntry.list('-created_date', 500)
  });

  // Apply filters
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const entryDate = new Date(entry.created_date);
      const inDateRange = entryDate >= dateRange.from && entryDate <= dateRange.to;
      const matchesCategory = categoryFilter === 'all' || entry.category === categoryFilter;
      const matchesType = typeFilter === 'all' || entry.type === typeFilter;
      return inDateRange && matchesCategory && matchesType;
    });
  }, [entries, dateRange, categoryFilter, typeFilter]);

  // Calculate summary
  const summary = useMemo(() => {
    const credits = filteredEntries.filter(e => e.type === 'credit');
    const debits = filteredEntries.filter(e => e.type === 'debit');
    
    return {
      totalCredits: credits.reduce((sum, e) => sum + (e.amount || 0), 0),
      totalDebits: debits.reduce((sum, e) => sum + (e.amount || 0), 0),
      creditCount: credits.length,
      debitCount: debits.length,
      startingBalance: filteredEntries.length > 0 
        ? (filteredEntries[filteredEntries.length - 1]?.balance_after || 0) - (filteredEntries[filteredEntries.length - 1]?.amount || 0)
        : 0,
      endingBalance: filteredEntries[0]?.balance_after || 0
    };
  }, [filteredEntries]);

  const handlePeriodChange = (preset) => {
    setPeriodPreset(preset);
    const today = new Date();
    
    switch (preset) {
      case 'today':
        setDateRange({ from: today, to: today });
        break;
      case 'yesterday':
        const yesterday = subDays(today, 1);
        setDateRange({ from: yesterday, to: yesterday });
        break;
      case '7days':
        setDateRange({ from: subDays(today, 7), to: today });
        break;
      case '30days':
        setDateRange({ from: subDays(today, 30), to: today });
        break;
      case 'thisMonth':
        setDateRange({ from: startOfMonth(today), to: endOfMonth(today) });
        break;
      default:
        break;
    }
  };

  const handleExport = (format) => {
    // In a real app, this would trigger a download
    console.log(`Exporting as ${format}...`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Extrato Financeiro"
        subtitle="Histórico completo de todas as movimentações"
        breadcrumbs={[
          { label: 'Financeiro', href: 'Financial' },
          { label: 'Extrato' }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCcw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Exportar CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('xlsx')}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Exportar Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Exportar PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('ofx')}>
                  <File className="w-4 h-4 mr-2" />
                  Exportar OFX
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Saldo Inicial</p>
                <p className="text-lg font-semibold">{formatCurrency(summary.startingBalance)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ArrowUpCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-700">Total Entradas</p>
                <p className="text-lg font-semibold text-green-700">{formatCurrency(summary.totalCredits)}</p>
                <p className="text-xs text-green-600">{summary.creditCount} lançamentos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <ArrowDownCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-red-700">Total Saídas</p>
                <p className="text-lg font-semibold text-red-700">{formatCurrency(summary.totalDebits)}</p>
                <p className="text-xs text-red-600">{summary.debitCount} lançamentos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-700">Saldo Final</p>
                <p className="text-lg font-semibold text-blue-700">{formatCurrency(summary.endingBalance)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Período</Label>
              <Select value={periodPreset} onValueChange={handlePeriodChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periodPresets.map(preset => (
                    <SelectItem key={preset.value} value={preset.value}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {periodPreset === 'custom' && (
              <div className="space-y-1">
                <Label className="text-xs">Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px] justify-start">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {dateRange.from && dateRange.to ? (
                        `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}`
                      ) : (
                        'Selecione o período'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      locale={ptBR}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="space-y-1">
              <Label className="text-xs">Tipo de Movimentação</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Direção</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="credit">Entradas</SelectItem>
                  <SelectItem value="debit">Saídas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Badge variant="outline" className="h-9 px-3">
              {filteredEntries.length} lançamentos
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Statement Table */}
      <Card>
        <CardContent className="p-0">
          <FinancialStatementTable 
            entries={filteredEntries}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}