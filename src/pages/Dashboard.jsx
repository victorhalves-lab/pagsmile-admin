import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useTranslation } from 'react-i18next';
import { Calendar, Settings, RefreshCw } from 'lucide-react';
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
import ChartCard from '@/components/dashboard/ChartCard';
import QuickActionsCustomizable from '@/components/dashboard/QuickActionsCustomizable';
import BalanceCard from '@/components/dashboard/BalanceCard';
import VolumeChart from '@/components/dashboard/VolumeChart';
import PaymentMethodsChart from '@/components/dashboard/PaymentMethodsChart';
import ApprovalRateChart from '@/components/dashboard/ApprovalRateChart';
import TransactionMetricsCards from '@/components/dashboard/TransactionMetricsCards';
import CardPerformanceMetrics from '@/components/dashboard/CardPerformanceMetrics';
import PixPerformanceMetrics from '@/components/dashboard/PixPerformanceMetrics';
import HeatmapChart from '@/components/dashboard/HeatmapChart';
import DeclineAnalysis from '@/components/dashboard/DeclineAnalysis';
import ComparativeMetrics from '@/components/dashboard/ComparativeMetrics';
import AlertsPanel from '@/components/dashboard/AlertsPanel';
import ConversionMetricsCards from '@/components/dashboard/ConversionMetricsCards';
import PixFlowCards from '@/components/dashboard/PixFlowCards';

// Novos componentes do redesign (Tier 1)
import CriticalAlertsBanner from '@/components/dashboard/CriticalAlertsBanner';
import GMVCardConsolidated from '@/components/dashboard/GMVCardConsolidated';
import ReceivablesBreakdown from '@/components/dashboard/ReceivablesBreakdown';
import AnticipationContextCard from '@/components/dashboard/AnticipationContextCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import AcquirerPerformanceCard from '@/components/dashboard/AcquirerPerformanceCard';
import PerformanceIndicatorsActionable from '@/components/dashboard/PerformanceIndicatorsActionable';

export default function Dashboard() {
  const { t } = useTranslation();
  const [period, setPeriod] = React.useState('7d');
  const [activeView, setActiveView] = React.useState('executive');

  const { data: transactions = [], isLoading: loadingTx, refetch } = useQuery({
    queryKey: ['transactions', 'all'],
    queryFn: () => base44.entities.Transaction.list('-created_date', 200),
  });

  // Mock GMV data (agregado a partir das transações)
  const approvedTx = transactions.filter((t) => t.status === 'approved');
  const totalGMV = approvedTx.reduce((sum, t) => sum + (t.amount || 0), 0);
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
    lastMonthChange: 5.1,
  };

  return (
    <div className="space-y-6 bg-[var(--color-bg-page)] min-h-screen pb-8">
      <PageHeader
        title={t('dashboard.executive_dashboard')}
        subtitle={t('dashboard.subtitle')}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => refetch()}
              title="Atualizar dados agora"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-36 h-9">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">{t('common.today')}</SelectItem>
                <SelectItem value="yesterday">{t('common.yesterday')}</SelectItem>
                <SelectItem value="7d">{t('common.last_7_days')}</SelectItem>
                <SelectItem value="30d">{t('common.this_month')}</SelectItem>
                <SelectItem value="last_month">{t('common.last_month')}</SelectItem>
                <SelectItem value="90d">{t('common.last_90_days')}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-9">
              <Settings className="w-4 h-4 mr-2" />
              {t('common.customize')}
            </Button>
          </div>
        }
      />

      {/* ===========================================================
          ZONA 0 — ALERTAS CRÍTICOS (banner global)  [#33]
          =========================================================== */}
      <CriticalAlertsBanner />

      {/* ===========================================================
          ZONA 1 — "AGORA" (saldo + dinheiro do merchant em destaque)
          BalanceCard sobe pro topo  [#32]
          =========================================================== */}
      <section className="space-y-4">
        <BalanceCard available={125430.5} pending={212880.0} blocked={2500.0} />

        {/* Antecipação contextual + A Receber decomposto lado a lado [#11 + #40] */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <AnticipationContextCard receivableAmount={212880} feePercentage={1.99} />
          </div>
          <div className="lg:col-span-2">
            <ReceivablesBreakdown />
          </div>
        </div>
      </section>

      {/* ===========================================================
          ZONA 2 — "ACONTECEU" (volume e performance)
          GMV consolidado em 1 card  [#34]
          Sparklines universais nos KPIs  [#48]
          PerformanceIndicators acionáveis com drill-down  [#13/#35/#57]
          =========================================================== */}
      <section className="space-y-4">
        <GMVCardConsolidated data={gmvData} loading={loadingTx} />

        <PerformanceIndicatorsActionable transactions={transactions} />

        <TransactionMetricsCards transactions={transactions} />
      </section>

      {/* ===========================================================
          ZONA 3 — "ORQUESTRAÇÃO" (diferencial PagSmile)  [#15]
          =========================================================== */}
      <section>
        <AcquirerPerformanceCard />
      </section>

      {/* ===========================================================
          ZONA 4 — Quick Actions + Volume + Activity Feed
          Activity Feed lateral em real-time  [#8]
          =========================================================== */}
      <section>
        <QuickActionsCustomizable />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartCard
            title={t('dashboard.sales_volume')}
            subtitle={t('dashboard.card_vs_pix')}
            periodSelector
            selectedPeriod={period}
            onPeriodChange={setPeriod}
          >
            <VolumeChart period={period} />
          </ChartCard>
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </section>

      {/* ===========================================================
          ZONA 5 — Análises avançadas (tabs preservadas)
          =========================================================== */}
      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
        <TabsList>
          <TabsTrigger value="executive">{t('dashboard.views.executive')}</TabsTrigger>
          <TabsTrigger value="card">{t('dashboard.views.card_performance')}</TabsTrigger>
          <TabsTrigger value="pix">{t('dashboard.views.pix_performance')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('dashboard.views.advanced_analytics')}</TabsTrigger>
        </TabsList>

        <TabsContent value="executive" className="space-y-4">
          <ConversionMetricsCards transactions={transactions} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title={t('dashboard.payment_methods')} subtitle={t('dashboard.volume_distribution')} action>
              <PaymentMethodsChart />
            </ChartCard>
            <ChartCard title={t('dashboard.approval_rate_by_brand')} subtitle={`${t('common.goal')}: 85%`} action>
              <ApprovalRateChart target={85} />
            </ChartCard>
          </div>
          <ComparativeMetrics transactions={transactions} />
        </TabsContent>

        <TabsContent value="card" className="space-y-4">
          <CardPerformanceMetrics transactions={transactions} />
          <DeclineAnalysis transactions={transactions} />
        </TabsContent>

        <TabsContent value="pix" className="space-y-4">
          <PixFlowCards transactions={transactions} />
          <PixPerformanceMetrics transactions={transactions} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <HeatmapChart type="volume" />
            <HeatmapChart type="approval" />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <HeatmapChart type="volume" />
            <DeclineAnalysis transactions={transactions} />
          </div>
        </TabsContent>
      </Tabs>

      {/* ===========================================================
          ZONA 6 — Alertas não-críticos (rodapé)
          =========================================================== */}
      <section>
        <AlertsPanel />
      </section>
    </div>
  );
}