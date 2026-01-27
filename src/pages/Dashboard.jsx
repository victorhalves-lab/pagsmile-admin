import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  QrCode,
  Users,
  ShieldAlert,
  ArrowUpRight,
  Calendar,
  Settings,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import PageHeader from '@/components/common/PageHeader';
import KPICard from '@/components/dashboard/KPICard';
import ChartCard from '@/components/dashboard/ChartCard';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import BalanceCard from '@/components/dashboard/BalanceCard';
import VolumeChart from '@/components/dashboard/VolumeChart';
import PaymentMethodsChart from '@/components/dashboard/PaymentMethodsChart';
import ApprovalRateChart from '@/components/dashboard/ApprovalRateChart';
import GMVCards from '@/components/dashboard/GMVCards';
import TransactionMetricsCards from '@/components/dashboard/TransactionMetricsCards';
import PerformanceIndicators from '@/components/dashboard/PerformanceIndicators';
import CardPerformanceMetrics from '@/components/dashboard/CardPerformanceMetrics';
import PixPerformanceMetrics from '@/components/dashboard/PixPerformanceMetrics';
import HeatmapChart from '@/components/dashboard/HeatmapChart';
import DeclineAnalysis from '@/components/dashboard/DeclineAnalysis';
import ComparativeMetrics from '@/components/dashboard/ComparativeMetrics';
import AlertsPanel from '@/components/dashboard/AlertsPanel';

export default function Dashboard() {
  const [period, setPeriod] = React.useState('7d');
  const [activeView, setActiveView] = React.useState('executive');

  const { data: transactions = [], isLoading: loadingTx } = useQuery({
    queryKey: ['transactions', 'all'],
    queryFn: () => base44.entities.Transaction.list('-created_date', 200),
  });

  const { data: disputes = [] } = useQuery({
    queryKey: ['disputes', 'open'],
    queryFn: () => base44.entities.Dispute.filter({ status: 'open' }),
  });

  // Calculate KPIs from transactions
  const approvedTx = transactions.filter(t => t.status === 'approved');
  const totalGMV = approvedTx.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalTx = transactions.length;
  const approvalRate = totalTx > 0 ? (approvedTx.filter(t => t.status === 'approved' || t.status === 'declined').length > 0 ? (approvedTx.length / transactions.filter(t => t.status === 'approved' || t.status === 'declined').length) * 100 : 0) : 0;
  const avgTicket = approvedTx.length > 0 ? totalGMV / approvedTx.length : 0;

  // Mock GMV data (in real app, calculate from actual data)
  const gmvData = {
    today: totalGMV * 0.15,
    todayChange: 12.5,
    todayCard: totalGMV * 0.1,
    todayPix: totalGMV * 0.05,
    yesterday: totalGMV * 0.14,
    yesterdayChange: -2.3,
    last7days: totalGMV,
    last7daysChange: 8.7,
    currentMonth: totalGMV * 2.5,
    currentMonthChange: 15.2,
    monthProgress: 60,
    monthProjection: totalGMV * 4.2,
    lastMonth: totalGMV * 3.8,
    lastMonthChange: 5.1
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Executivo"
        subtitle="Visão completa da sua operação em tempo real"
        actions={
          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-36">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Hoje</SelectItem>
                <SelectItem value="yesterday">Ontem</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Este mês</SelectItem>
                <SelectItem value="last_month">Mês anterior</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Personalizar
            </Button>
          </div>
        }
      />

      {/* Quick Actions */}
      <QuickActions />

      {/* GMV Overview Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Volume Financeiro (GMV)</h2>
        </div>
        <GMVCards data={gmvData} loading={loadingTx} />
      </div>

      {/* Transaction Metrics */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Quantidade de Transações</h2>
        </div>
        <TransactionMetricsCards transactions={transactions} />
      </div>

      {/* Performance Indicators */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Indicadores de Performance</h2>
        </div>
        <PerformanceIndicators transactions={transactions} />
      </div>

      {/* Balance + Volume Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BalanceCard
          available={125430.50}
          pending={45200.75}
          blocked={2500.00}
          className="lg:col-span-1"
        />
        <ChartCard
          title="Volume de Vendas"
          subtitle="Comparativo Cartão vs Pix"
          className="lg:col-span-2"
          periodSelector
          selectedPeriod={period}
          onPeriodChange={setPeriod}
        >
          <VolumeChart period={period} />
        </ChartCard>
      </div>

      {/* Tabs for Different Views */}
      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
        <TabsList>
          <TabsTrigger value="executive">Visão Executiva</TabsTrigger>
          <TabsTrigger value="card">Performance Cartão</TabsTrigger>
          <TabsTrigger value="pix">Performance Pix</TabsTrigger>
          <TabsTrigger value="analytics">Analytics Avançado</TabsTrigger>
        </TabsList>

        {/* Executive View */}
        <TabsContent value="executive" className="space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Métodos de Pagamento"
              subtitle="Distribuição do volume"
              action
            >
              <PaymentMethodsChart />
            </ChartCard>
            
            <ChartCard
              title="Taxa de Aprovação por Bandeira"
              subtitle="Meta: 85%"
              action
            >
              <ApprovalRateChart target={85} />
            </ChartCard>
          </div>

          {/* Comparative Metrics */}
          <ComparativeMetrics transactions={transactions} />
        </TabsContent>

        {/* Card Performance View */}
        <TabsContent value="card" className="space-y-6">
          <CardPerformanceMetrics transactions={transactions} />
          <DeclineAnalysis transactions={transactions} />
        </TabsContent>

        {/* Pix Performance View */}
        <TabsContent value="pix" className="space-y-6">
          <PixPerformanceMetrics transactions={transactions} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HeatmapChart type="volume" />
            <HeatmapChart type="approval" />
          </div>
        </TabsContent>

        {/* Advanced Analytics View */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HeatmapChart type="volume" />
            <DeclineAnalysis transactions={transactions} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Transactions + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions 
            transactions={transactions}
            loading={loadingTx}
          />
        </div>
        
        <AlertsPanel />
      </div>
    </div>
  );
}