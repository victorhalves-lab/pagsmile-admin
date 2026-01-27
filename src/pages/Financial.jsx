import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Wallet, 
  Clock, 
  Lock, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Download,
  Eye,
  EyeOff,
  FileText,
  PiggyBank,
  Percent
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

import PageHeader from '@/components/common/PageHeader';
import ChartCard from '@/components/dashboard/ChartCard';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';

export default function Financial() {
  const [showValues, setShowValues] = useState(true);
  const [period, setPeriod] = useState('30d');

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['financial-entries'],
    queryFn: () => base44.entities.FinancialEntry.list('-created_date', 50),
  });

  const formatCurrency = (value, hide = false) => {
    if (hide && !showValues) return '••••••';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  // Mock balance data
  const balances = {
    available: 125430.50,
    pending: 45200.75,
    blocked: 2500.00,
    anticipatable: 38500.00
  };

  const total = balances.available + balances.pending + balances.blocked;

  // Mock chart data
  const chartData = [
    { date: '01/01', entrada: 45200, saida: 12300 },
    { date: '08/01', entrada: 52100, saida: 15400 },
    { date: '15/01', entrada: 48700, saida: 18200 },
    { date: '22/01', entrada: 61300, saida: 22600 },
    { date: '29/01', entrada: 55800, saida: 19800 },
  ];

  // Mock receivables data
  const receivables = [
    { date: '28/01', amount: 12500.00, parcels: 45 },
    { date: '29/01', amount: 8750.00, parcels: 32 },
    { date: '30/01', amount: 15200.00, parcels: 58 },
    { date: '31/01', amount: 9800.00, parcels: 41 },
    { date: '01/02', amount: 22100.00, parcels: 89 },
  ];

  const entryColumns = [
    {
      key: 'type',
      label: 'Tipo',
      render: (value) => (
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          value === 'credit' ? 'bg-emerald-100' : 'bg-red-100'
        )}>
          {value === 'credit' ? (
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          ) : (
            <ArrowUpRight className="w-4 h-4 text-red-600" />
          )}
        </div>
      )
    },
    {
      key: 'description',
      label: 'Descrição',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900 text-sm">{value || row.category}</p>
          <p className="text-xs text-gray-500">{row.reference_id}</p>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Categoria',
      render: (value) => {
        const labels = {
          sale: 'Venda',
          refund: 'Estorno',
          chargeback: 'Chargeback',
          fee: 'Taxa',
          withdrawal: 'Saque',
          adjustment: 'Ajuste',
          anticipation: 'Antecipação',
          split: 'Split'
        };
        return <span className="text-sm capitalize">{labels[value] || value}</span>;
      }
    },
    {
      key: 'amount',
      label: 'Valor',
      render: (value, row) => (
        <span className={cn(
          "font-semibold",
          row.type === 'credit' ? 'text-emerald-600' : 'text-red-600'
        )}>
          {row.type === 'credit' ? '+' : '-'}{formatCurrency(Math.abs(value))}
        </span>
      )
    },
    {
      key: 'created_date',
      label: 'Data',
      render: (value) => value ? format(new Date(value), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'N/A'
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financeiro"
        subtitle="Gerencie seus saldos e movimentações"
        breadcrumbs={[
          { label: 'Financeiro', page: 'Financial' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowValues(!showValues)}
            >
              {showValues ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        }
      />

      {/* Balance Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 bg-gradient-to-br from-[#101F3E] to-[#1a2f5e] rounded-xl p-6 text-white">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-white/60 text-sm mb-1">Saldo Total</p>
              <p className="text-3xl font-bold">{formatCurrency(total, true)}</p>
            </div>
            <div className="p-2 bg-white/10 rounded-lg">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#00D26A]" />
                <span className="text-xs text-white/60">Disponível</span>
              </div>
              <p className="font-semibold">{formatCurrency(balances.available, true)}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="text-xs text-white/60">A Receber</span>
              </div>
              <p className="font-semibold">{formatCurrency(balances.pending, true)}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-xs text-white/60">Bloqueado</span>
              </div>
              <p className="font-semibold">{formatCurrency(balances.blocked, true)}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button className="flex-1 bg-[#00D26A] hover:bg-[#00A854]">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Solicitar Saque
            </Button>
            <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
              <FileText className="w-4 h-4 mr-2" />
              Ver Extrato
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <PiggyBank className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Antecipável</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(balances.anticipatable, true)}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Antecipar Recebíveis
          </Button>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Próximo Recebimento</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(receivables[0]?.amount, true)}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            {receivables[0]?.date} • {receivables[0]?.parcels} parcelas
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="statement">Extrato</TabsTrigger>
          <TabsTrigger value="receivables">Agenda de Recebíveis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Flow Chart */}
          <ChartCard
            title="Fluxo Financeiro"
            subtitle="Entradas e saídas no período"
            periodSelector
            selectedPeriod={period}
            onPeriodChange={setPeriod}
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorEntrada" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D26A" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00D26A" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSaida" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="entrada" name="Entradas" stroke="#00D26A" strokeWidth={2} fill="url(#colorEntrada)" />
                  <Area type="monotone" dataKey="saida" name="Saídas" stroke="#EF4444" strokeWidth={2} fill="url(#colorSaida)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Receivables Preview */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Agenda de Recebíveis (Próximos 5 dias)</h3>
              <Button variant="ghost" size="sm" className="text-[#00D26A]">
                Ver completa
              </Button>
            </div>
            <div className="space-y-3">
              {receivables.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.date}</p>
                      <p className="text-sm text-gray-500">{item.parcels} parcelas</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">{formatCurrency(item.amount, true)}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="statement">
          <DataTable
            columns={entryColumns}
            data={entries}
            loading={isLoading}
            searchable
            searchPlaceholder="Buscar movimentação..."
            pagination
            pageSize={25}
            currentPage={1}
            totalItems={entries.length}
            emptyMessage="Nenhuma movimentação encontrada"
          />
        </TabsContent>

        <TabsContent value="receivables">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-gray-900">Agenda Completa de Recebíveis</h3>
                <p className="text-sm text-gray-500">Parcelas a receber nos próximos 30 dias</p>
              </div>
              <Select defaultValue="30d">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Próximos 7 dias</SelectItem>
                  <SelectItem value="30d">Próximos 30 dias</SelectItem>
                  <SelectItem value="60d">Próximos 60 dias</SelectItem>
                  <SelectItem value="90d">Próximos 90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-6">
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }).map((_, idx) => {
                const hasValue = idx % 3 === 0 || idx % 5 === 0;
                const value = hasValue ? Math.random() * 20000 + 5000 : 0;
                return (
                  <div 
                    key={idx} 
                    className={cn(
                      "aspect-square rounded-lg flex flex-col items-center justify-center text-xs",
                      hasValue ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-400'
                    )}
                  >
                    <span>{idx + 1}</span>
                    {hasValue && (
                      <span className="font-semibold text-[10px]">
                        {(value / 1000).toFixed(1)}k
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Total no período</span>
                <span className="text-xl font-bold text-gray-900">{formatCurrency(185420.50, true)}</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}