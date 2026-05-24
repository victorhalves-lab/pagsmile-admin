import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import {
  ArrowsClockwise, Wallet, ArrowDown, ChartLineUp, Receipt,
  CaretDown, CaretUp, Lightning, Target,
} from '@phosphor-icons/react';

import ModernDashboardHero from '@/components/dashboard/modern/ModernDashboardHero';
import ModernKpiCard from '@/components/dashboard/modern/ModernKpiCard';
import ModernChartPanel from '@/components/dashboard/modern/ModernChartPanel';
import ModernActivityPanel from '@/components/dashboard/modern/ModernActivityPanel';
import ModernSectionLabel from '@/components/dashboard/modern/ModernSectionLabel';

// Avançado (mantido fechado por padrão, abre sob demanda)
import ChartCard from '@/components/dashboard/ChartCard';
import VolumeChart from '@/components/dashboard/VolumeChart';
import PaymentMethodsChart from '@/components/dashboard/PaymentMethodsChart';
import ApprovalRateChart from '@/components/dashboard/ApprovalRateChart';
import TransactionMetricsCards from '@/components/dashboard/TransactionMetricsCards';
import ConversionMetricsCards from '@/components/dashboard/ConversionMetricsCards';
import ComparativeMetrics from '@/components/dashboard/ComparativeMetrics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CardPerformanceFull from '@/components/dashboard/analytics/CardPerformanceFull';
import PixPerformanceFull from '@/components/dashboard/analytics/PixPerformanceFull';
import AdvancedAnalyticsFull from '@/components/dashboard/analytics/AdvancedAnalyticsFull';
import PixFlowCards from '@/components/dashboard/PixFlowCards';
import PixUpliftCard from '@/components/dashboard/PixUpliftCard';

const fmtBRL = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

const fmtNumber = (v) =>
  new Intl.NumberFormat('pt-BR').format(v || 0);

// Gera mock de chart por hora se não houver dado real
const buildHourlyData = (transactions, period) => {
  const buckets = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}h`,
    volume: 0,
    count: 0,
  }));
  transactions.forEach((tx) => {
    const d = new Date(tx.created_date);
    const h = d.getHours();
    if (tx.status === 'approved') {
      buckets[h].volume += tx.amount || 0;
      buckets[h].count += 1;
    }
  });
  return buckets.filter((_, i) => i >= 3 && i <= 23 && i % 2 === 1);
};

export default function Dashboard() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState('7d');
  const [search, setSearch] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeView, setActiveView] = useState('executive');

  const { data: transactions = [], isLoading, refetch } = useQuery({
    queryKey: ['dashboard-transactions'],
    queryFn: () => base44.entities.Transaction.list('-created_date', 200),
  });

  // KPIs principais (3 cards do print)
  const kpis = useMemo(() => {
    const approved = transactions.filter((t) => t.status === 'approved');
    const refused = transactions.filter((t) => t.status === 'refused');
    const totalAttempts = approved.length + refused.length;
    const conversionRate = totalAttempts > 0 ? (approved.length / totalAttempts) * 100 : 0;
    const totalRevenue = approved.reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalWithdrawals = transactions
      .filter((t) => t.type === 'refund' || t.type === 'void')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    return { conversionRate, totalRevenue, totalWithdrawals, approvedCount: approved.length };
  }, [transactions]);

  const hourlyData = useMemo(() => buildHourlyData(transactions, period), [transactions, period]);

  // Activity items
  const activityItems = useMemo(() => {
    return transactions.slice(0, 6).map((tx) => ({
      id: tx.id,
      label: tx.customer?.name || tx.merchant_name || 'Transação',
      subtitle: `${tx.method?.toUpperCase() || 'PAGAMENTO'} · ${tx.status}`,
      value: fmtBRL(tx.amount),
      direction: tx.type === 'refund' ? 'out' : 'in',
      amount: tx.amount,
    }));
  }, [transactions]);

  return (
    <div
      className="min-h-screen -m-4 lg:-m-6 p-6 lg:p-8 pb-16"
      style={{
        background:
          'radial-gradient(1200px 600px at 50% -10%, rgba(0,193,148,0.06), transparent 60%), linear-gradient(180deg, #0a0a0a 0%, #0f0f0f 100%)',
      }}
    >
      {/* HERO */}
      <ModernDashboardHero
        userName="B4kpay"
        period={period}
        onPeriodChange={setPeriod}
        searchValue={search}
        onSearchChange={setSearch}
      />

      {/* GRID PRINCIPAL — KPIs (esquerda 3 cards) + Atividade (direita 1 card alto) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-8">
        {/* KPI 1 — Taxa de Conversão (FILLED VERDE) */}
        <div className="lg:col-span-3">
          <ModernKpiCard
            icon={ArrowsClockwise}
            label="Taxa de Conversão"
            value={`${kpis.conversionRate.toFixed(1)}%`}
            variant="filled"
            trend={{ value: 4.2, direction: 'up' }}
            hint="vs período anterior"
          />
        </div>

        {/* KPI 2 — Faturamento Total (DARK) */}
        <div className="lg:col-span-3">
          <ModernKpiCard
            icon={Wallet}
            label="Faturamento Total"
            value={fmtBRL(kpis.totalRevenue)}
            variant="dark"
            hint={`${fmtNumber(kpis.approvedCount)} aprovadas`}
          />
        </div>

        {/* KPI 3 — Volume de Saques (FILLED VERDE) */}
        <div className="lg:col-span-3">
          <ModernKpiCard
            icon={ArrowDown}
            label="Volume de Saques"
            value={fmtBRL(kpis.totalWithdrawals)}
            variant="filled"
            hint="últimos 7 dias"
          />
        </div>

        {/* Atividade — coluna direita ocupando 3 cols */}
        <div className="lg:col-span-3 lg:row-span-2">
          <ModernActivityPanel
            title="Últimas Operações"
            subtitle="Atividade recente da plataforma"
            items={activityItems}
            seeAllHref="/Transactions"
          />
        </div>

        {/* Linha 2 — métricas secundárias compactas */}
        <div className="lg:col-span-3">
          <ModernKpiCard
            icon={ChartLineUp}
            label="Ticket Médio"
            value={
              kpis.approvedCount > 0
                ? fmtBRL(kpis.totalRevenue / kpis.approvedCount)
                : 'R$ 0'
            }
            variant="outline"
          />
        </div>
        <div className="lg:col-span-3">
          <ModernKpiCard
            icon={Lightning}
            label="Recuperações"
            value="R$ 12.8K"
            variant="filled-dark"
            trend={{ value: 18.5, direction: 'up' }}
          />
        </div>
        <div className="lg:col-span-3">
          <ModernKpiCard
            icon={Target}
            label="Meta do Mês"
            value="73%"
            variant="dark"
            hint="R$ 184k / R$ 250k"
          />
        </div>
      </div>

      {/* ANÁLISE TEMPORAL */}
      <div className="mt-10">
        <ModernSectionLabel
          title="Análise Temporal"
          subtitle="Distribuição de volume e transações por horário"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Volume de Faturamento */}
          <ModernChartPanel
            label="Volume de Faturamento"
            indicator={{ label: 'R$ REAL', color: '#00c194' }}
            hours={['03h', '05h', '07h', '09h', '11h', '13h', '15h', '17h', '19h', '21h', '23h']}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00c194" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#00c194" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    background: '#0a0a0a',
                    border: '1px solid rgba(0,193,148,0.3)',
                    borderRadius: 8,
                    fontSize: 11,
                    color: '#fff',
                  }}
                  formatter={(v) => [fmtBRL(v), 'Volume']}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#00c194"
                  strokeWidth={2}
                  fill="url(#volGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ModernChartPanel>

          {/* Fluxo de Operações */}
          <ModernChartPanel
            label="Fluxo de Operações"
            indicator={{ label: 'QTD TRANSAÇÕES', color: '#5cf7cf' }}
            hours={['03h', '05h', '07h', '09h', '11h', '13h', '15h', '17h', '19h', '21h', '23h']}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <Tooltip
                  contentStyle={{
                    background: '#0a0a0a',
                    border: '1px solid rgba(92,247,207,0.3)',
                    borderRadius: 8,
                    fontSize: 11,
                    color: '#fff',
                  }}
                  formatter={(v) => [fmtNumber(v), 'Transações']}
                />
                <Bar dataKey="count" fill="#5cf7cf" radius={[3, 3, 0, 0]} maxBarSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </ModernChartPanel>
        </div>
      </div>

      {/* TOGGLE: Análise completa */}
      <div className="mt-10 flex items-center justify-center">
        <button
          onClick={() => setShowAdvanced((s) => !s)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/10 text-white/70 hover:text-white hover:border-[#00c194]/40 transition-all font-mono text-[11px] uppercase tracking-wider font-semibold"
        >
          {showAdvanced ? 'Ocultar análise completa' : 'Ver análise completa'}
          {showAdvanced ? (
            <CaretUp className="w-3.5 h-3.5" weight="bold" />
          ) : (
            <CaretDown className="w-3.5 h-3.5" weight="bold" />
          )}
        </button>
      </div>

      {/* ADVANCED — pode abrir/fechar */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-8 space-y-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <Tabs value={activeView} onValueChange={setActiveView}>
                <TabsList className="bg-white/[0.04] border border-white/10">
                  <TabsTrigger value="executive" className="data-[state=active]:bg-[#00c194] data-[state=active]:text-white">
                    Executivo
                  </TabsTrigger>
                  <TabsTrigger value="card" className="data-[state=active]:bg-[#00c194] data-[state=active]:text-white">
                    Cartão
                  </TabsTrigger>
                  <TabsTrigger value="pix" className="data-[state=active]:bg-[#00c194] data-[state=active]:text-white">
                    PIX
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="data-[state=active]:bg-[#00c194] data-[state=active]:text-white">
                    Analytics
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="executive" className="space-y-4 mt-4">
                  <ConversionMetricsCards transactions={transactions} />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <ChartCard title={t('dashboard.payment_methods')} subtitle={t('dashboard.volume_distribution')} action>
                      <PaymentMethodsChart />
                    </ChartCard>
                    <ChartCard title={t('dashboard.approval_rate_by_brand')} subtitle={`${t('common.goal')}: 85%`} action>
                      <ApprovalRateChart target={85} />
                    </ChartCard>
                  </div>
                  <TransactionMetricsCards transactions={transactions} />
                  <ComparativeMetrics transactions={transactions} />
                </TabsContent>

                <TabsContent value="card" className="space-y-4 mt-4">
                  <CardPerformanceFull />
                </TabsContent>

                <TabsContent value="pix" className="space-y-4 mt-4">
                  <PixUpliftCard />
                  <PixFlowCards transactions={transactions} />
                  <PixPerformanceFull />
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4 mt-4">
                  <AdvancedAnalyticsFull />
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}