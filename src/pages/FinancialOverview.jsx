import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import PageHeader from '@/components/common/PageHeader';
import BalanceSummaryCards from '@/components/financial/BalanceSummaryCards';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Calendar,
  Zap,
  ArrowLeftRight,
  ArrowUpFromLine,
  Download,
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, subDays, addDays, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

export default function FinancialOverview() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState('30');

  const { data: entries = [], isLoading: entriesLoading } = useQuery({
    queryKey: ['financial-entries'],
    queryFn: () => base44.entities.FinancialEntry.list('-created_date', 100)
  });

  const { data: receivables = [], isLoading: receivablesLoading } = useQuery({
    queryKey: ['receivables'],
    queryFn: () => base44.entities.Receivable.list('-settlement_date', 200)
  });

  const { data: withdrawals = [] } = useQuery({
    queryKey: ['withdrawals-pending'],
    queryFn: () => base44.entities.Withdrawal.filter({ status: 'processing' })
  });

  // Calculate balances
  const balances = useMemo(() => {
    const today = new Date();
    const pendingReceivables = receivables.filter(r => 
      r.status === 'scheduled' && new Date(r.settlement_date) > today
    );

    // Calculate pending by period
    const next7Days = pendingReceivables
      .filter(r => differenceInDays(new Date(r.settlement_date), today) <= 7)
      .reduce((sum, r) => sum + (r.net_amount || 0), 0);

    const next8to14Days = pendingReceivables
      .filter(r => {
        const diff = differenceInDays(new Date(r.settlement_date), today);
        return diff > 7 && diff <= 14;
      })
      .reduce((sum, r) => sum + (r.net_amount || 0), 0);

    const next15to30Days = pendingReceivables
      .filter(r => {
        const diff = differenceInDays(new Date(r.settlement_date), today);
        return diff > 14 && diff <= 30;
      })
      .reduce((sum, r) => sum + (r.net_amount || 0), 0);

    const above30Days = pendingReceivables
      .filter(r => differenceInDays(new Date(r.settlement_date), today) > 30)
      .reduce((sum, r) => sum + (r.net_amount || 0), 0);

    const totalPending = next7Days + next8to14Days + next15to30Days + above30Days;

    // Simulated values for demo
    const available = 45680.50;
    const blocked = 8500.00;
    const inTransit = withdrawals.reduce((sum, w) => sum + (w.amount || 0), 0) || 3200.00;

    return {
      available,
      pending: totalPending || 125450.00,
      blocked,
      inTransit,
      pendingBreakdown: [
        { label: 'Próximos 7 dias', value: next7Days || 28500 },
        { label: '8 a 14 dias', value: next8to14Days || 32100 },
        { label: '15 a 30 dias', value: next15to30Days || 41200 },
        { label: 'Acima de 30 dias', value: above30Days || 23650 },
      ],
      blockedBreakdown: [
        { label: 'Reserva de CB', value: 5000 },
        { label: 'Disputas abertas', value: 3500 },
      ]
    };
  }, [receivables, withdrawals]);

  // Generate chart data
  const chartData = useMemo(() => {
    const days = parseInt(period);
    const data = [];
    for (let i = days; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayEntries = entries.filter(e => 
        format(new Date(e.created_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      const credits = dayEntries.filter(e => e.type === 'credit').reduce((sum, e) => sum + e.amount, 0);
      const debits = dayEntries.filter(e => e.type === 'debit').reduce((sum, e) => sum + e.amount, 0);
      
      data.push({
        date: format(date, 'dd/MM'),
        entradas: credits || Math.random() * 5000 + 2000,
        saidas: debits || Math.random() * 2000 + 500,
      });
    }
    return data;
  }, [entries, period]);

  const handleBalanceAction = (action) => {
    const routes = {
      withdraw: 'Withdrawals',
      receivables: 'ReceivablesAgenda',
      blocked: 'FinancialStatement',
      withdrawals: 'Withdrawals'
    };
    if (routes[action]) {
      window.location.href = createPageUrl(routes[action]);
    }
  };

  const quickLinks = [
    { labelKey: 'financial.statement', icon: FileText, page: 'FinancialStatement', color: 'bg-blue-100 text-blue-600' },
    { labelKey: 'financial.receivables', icon: Calendar, page: 'ReceivablesAgenda', color: 'bg-green-100 text-green-600' },
    { labelKey: 'financial.anticipation', icon: Zap, page: 'Anticipation', color: 'bg-purple-100 text-purple-600' },
    { labelKey: 'menu.split', icon: ArrowLeftRight, page: 'SplitManagement', color: 'bg-indigo-100 text-indigo-600' },
    { labelKey: 'financial.withdrawals', icon: ArrowUpFromLine, page: 'Withdrawals', color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('financial.title')}
        subtitle={t('financial.overview')}
        breadcrumbs={[{ label: t('financial.title') }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={createPageUrl('FinancialStatement')}>
                <FileText className="w-4 h-4 mr-2" />
                {t('financial.statement')}
              </Link>
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" asChild>
              <Link to={createPageUrl('Withdrawals')}>
                <ArrowUpFromLine className="w-4 h-4 mr-2" />
                {t('financial.withdraw')}
              </Link>
            </Button>
          </div>
        }
      />

      {/* Balance Cards */}
      <BalanceSummaryCards 
        balances={balances} 
        isLoading={entriesLoading}
        onAction={handleBalanceAction}
      />

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {quickLinks.map((link) => (
          <Link
            key={link.page}
            to={createPageUrl(link.page)}
            className="flex items-center gap-3 p-4 bg-white rounded-lg border hover:shadow-md transition-all"
          >
            <div className={cn("p-2 rounded-lg", link.color)}>
              <link.icon className="w-5 h-5" />
            </div>
            <span className="font-medium text-sm">{t(link.labelKey)}</span>
          </Link>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{t('financial.cash_flow')}</CardTitle>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 {t('financial.days')}</SelectItem>
                  <SelectItem value="15">15 {t('financial.days')}</SelectItem>
                  <SelectItem value="30">30 {t('financial.days')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis 
                    tick={{ fontSize: 12 }} 
                    tickFormatter={(value) => `${(value/1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={(label) => `Data: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="entradas" 
                    stackId="1"
                    stroke="#10b981" 
                    fill="#d1fae5"
                    name={t('financial.entries')}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="saidas" 
                    stackId="2"
                    stroke="#ef4444" 
                    fill="#fee2e2"
                    name={t('financial.exits')}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600">{t('financial.entries')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-gray-600">{t('financial.exits')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receivables Preview */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{t('financial.next_receivables')}</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to={createPageUrl('ReceivablesAgenda')}>
                  {t('financial.view_schedule')}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={balances.pendingBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis 
                    tick={{ fontSize: 12 }} 
                    tickFormatter={(value) => `${(value/1000).toFixed(0)}k`}
                  />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Valor" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between pt-4 border-t mt-4">
              <span className="text-sm text-gray-600">{t('financial.total_receivable')}</span>
              <span className="text-xl font-bold text-blue-600">
                {formatCurrency(balances.pending)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{t('financial.recent_movements')}</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to={createPageUrl('FinancialStatement')}>
                {t('financial.view_full_statement')}
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {entries.slice(0, 5).map((entry) => (
              <div 
                key={entry.id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-full",
                    entry.type === 'credit' ? "bg-green-100" : "bg-red-100"
                  )}>
                    {entry.type === 'credit' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{entry.description || entry.category}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(entry.created_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <span className={cn(
                  "font-semibold",
                  entry.type === 'credit' ? "text-green-600" : "text-red-600"
                )}>
                  {entry.type === 'credit' ? '+' : '-'} {formatCurrency(entry.amount)}
                </span>
              </div>
            ))}
            {entries.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {t('financial.no_recent_movements')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}