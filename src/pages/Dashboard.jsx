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
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import PageHeader from '@/components/common/PageHeader';
import KPICard from '@/components/dashboard/KPICard';
import ChartCard from '@/components/dashboard/ChartCard';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import BalanceCard from '@/components/dashboard/BalanceCard';
import VolumeChart from '@/components/dashboard/VolumeChart';
import PaymentMethodsChart from '@/components/dashboard/PaymentMethodsChart';
import ApprovalRateChart from '@/components/dashboard/ApprovalRateChart';

export default function Dashboard() {
  const [period, setPeriod] = React.useState('7d');

  const { data: transactions = [], isLoading: loadingTx } = useQuery({
    queryKey: ['transactions', 'recent'],
    queryFn: () => base44.entities.Transaction.list('-created_date', 10),
  });

  const { data: disputes = [] } = useQuery({
    queryKey: ['disputes', 'open'],
    queryFn: () => base44.entities.Dispute.filter({ status: 'open' }),
  });

  // Calculate KPIs from transactions
  const approvedTx = transactions.filter(t => t.status === 'approved');
  const totalGMV = approvedTx.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalTx = transactions.length;
  const approvalRate = totalTx > 0 ? (approvedTx.length / totalTx) * 100 : 0;
  const avgTicket = approvedTx.length > 0 ? totalGMV / approvedTx.length : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral do seu negócio"
        actions={
          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-36">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Últimas 24h</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      {/* Quick Actions */}
      <QuickActions />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Volume Total (GMV)"
          value={totalGMV}
          format="currency"
          change={12.5}
          icon={DollarSign}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <KPICard
          title="Total de Transações"
          value={totalTx}
          format="number"
          change={8.3}
          icon={CreditCard}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <KPICard
          title="Taxa de Aprovação"
          value={approvalRate}
          format="percentage"
          change={2.1}
          icon={TrendingUp}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <KPICard
          title="Ticket Médio"
          value={avgTicket}
          format="currency"
          change={-3.2}
          icon={ArrowUpRight}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Taxa de Aprovação por Bandeira"
          subtitle="Meta: 85%"
          action
        >
          <ApprovalRateChart target={85} />
        </ChartCard>
        
        <ChartCard
          title="Métodos de Pagamento"
          subtitle="Distribuição do volume"
          action
        >
          <PaymentMethodsChart />
        </ChartCard>
      </div>

      {/* Recent Transactions + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions 
            transactions={transactions}
            loading={loadingTx}
          />
        </div>
        
        <div className="space-y-4">
          {/* Disputes Alert */}
          {disputes.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900">Disputas Pendentes</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Você tem {disputes.length} disputa(s) que requerem atenção
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
                  >
                    Ver Disputas
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-[#00D26A]/10 to-[#00D26A]/5 border border-[#00D26A]/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#00D26A]/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-[#00D26A]" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Insight do DIA</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Sua taxa de aprovação aumentou 2.1% esta semana. Continue otimizando o checkout para melhores resultados.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 border-[#00D26A]/30 text-[#00D26A] hover:bg-[#00D26A]/10"
                >
                  Ver mais insights
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 mb-4">Resumo Rápido</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-gray-600">Transações Aprovadas</span>
                </div>
                <span className="font-semibold">{approvedTx.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm text-gray-600">Transações Recusadas</span>
                </div>
                <span className="font-semibold">{transactions.filter(t => t.status === 'declined').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-sm text-gray-600">Pendentes</span>
                </div>
                <span className="font-semibold">{transactions.filter(t => t.status === 'pending').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}