import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useTranslation } from 'react-i18next';
import { Calendar, Settings, RefreshCw, CalendarPlus, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


import ChartCard from '@/components/dashboard/ChartCard';
import QuickActionsCustomizable from '@/components/dashboard/QuickActionsCustomizable';
import BalanceCard from '@/components/dashboard/BalanceCard';
import VolumeChart from '@/components/dashboard/VolumeChart';
import PaymentMethodsChart from '@/components/dashboard/PaymentMethodsChart';
import ApprovalRateChart from '@/components/dashboard/ApprovalRateChart';
import TransactionMetricsCards from '@/components/dashboard/TransactionMetricsCards';
import HeatmapChart from '@/components/dashboard/HeatmapChart';
import DeclineAnalysis from '@/components/dashboard/DeclineAnalysis';
import CardPerformanceFull from '@/components/dashboard/analytics/CardPerformanceFull';
import PixPerformanceFull from '@/components/dashboard/analytics/PixPerformanceFull';
import AdvancedAnalyticsFull from '@/components/dashboard/analytics/AdvancedAnalyticsFull';
import ComparativeMetrics from '@/components/dashboard/ComparativeMetrics';
import ConversionMetricsCards from '@/components/dashboard/ConversionMetricsCards';
import PixFlowCards from '@/components/dashboard/PixFlowCards';
import PixUpliftCard from '@/components/dashboard/PixUpliftCard';

// Tier 1
import CriticalAlertsBanner from '@/components/dashboard/CriticalAlertsBanner';
import GMVCardConsolidated from '@/components/dashboard/GMVCardConsolidated';
import ReceivablesBreakdown from '@/components/dashboard/ReceivablesBreakdown';
import AnticipationContextCard from '@/components/dashboard/AnticipationContextCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import AcquirerPerformanceCard from '@/components/dashboard/AcquirerPerformanceCard';
import PerformanceIndicatorsActionable from '@/components/dashboard/PerformanceIndicatorsActionable';

// Tier 2
import ForecastRow from '@/components/dashboard/ForecastRow';
import IntradayProjection from '@/components/dashboard/IntradayProjection';
import FinancialRiskCard from '@/components/dashboard/FinancialRiskCard';
import TopRevenueLevers from '@/components/dashboard/TopRevenueLevers';
import GoalsProgressCard from '@/components/dashboard/GoalsProgressCard';
import MoneyFlowCard from '@/components/dashboard/MoneyFlowCard';
import AISuggestionsCard from '@/components/dashboard/AISuggestionsCard';
import RecoveryRevenueCard from '@/components/dashboard/RecoveryRevenueCard';
import CheckoutFunnelCard from '@/components/dashboard/CheckoutFunnelCard';
import ChannelBreakdownCard from '@/components/dashboard/ChannelBreakdownCard';
import ProfileSwitcher, { useProfile } from '@/components/dashboard/ProfileSwitcher';
import AlertsPanelEnhanced from '@/components/dashboard/AlertsPanelEnhanced';
import OnboardingTour from '@/components/common/OnboardingTour';
import ScheduledReportsModal from '@/components/common/ScheduledReportsModal';
import RegulatoryCommitmentsCard from '@/components/dashboard/RegulatoryCommitmentsCard';

// Container animado padrão
const AnimatedSection = ({ children, delay = 0, className }) => (
  <motion.section
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className={className}
  >
    {children}
  </motion.section>
);

export default function Dashboard() {
  const { t } = useTranslation();
  const [period, setPeriod] = React.useState('7d');
  const [activeView, setActiveView] = React.useState('executive');
  const [tourOpen, setTourOpen] = React.useState(false);
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  const { profile, setProfile, showSection } = useProfile();

  const { data: transactions = [], isLoading: loadingTx, refetch } = useQuery({
    queryKey: ['transactions', 'all'],
    queryFn: () => base44.entities.Transaction.list('-created_date', 200),
  });

  const approvedTx = transactions.filter((t) => t.status === 'approved');
  const totalGMV = approvedTx.reduce((sum, t) => sum + (t.amount || 0), 0);
  const gmvData = {
    today: totalGMV * 0.15, todayChange: 12.5,
    todayCard: totalGMV * 0.1, todayPix: totalGMV * 0.05,
    yesterday: totalGMV * 0.14, yesterdayChange: -2.3,
    last7days: totalGMV, last7daysChange: 8.7,
    currentMonth: totalGMV * 2.5, currentMonthChange: 15.2,
    monthProgress: 60, monthProjection: totalGMV * 4.2,
    lastMonth: totalGMV * 3.8, lastMonthChange: 5.1,
  };

  return (
    <div className="space-y-6 bg-[var(--color-bg-page)] min-h-screen pb-8">
      {/* DS PAGE HERO · v9 / VF */}
      <div className="ds-page-hero flex items-start justify-between flex-wrap gap-4">
        <div>
          <span className="badge">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)] animate-pulse" />
            Dashboard · tempo real
          </span>
          <h1>
            Painel <em>executivo</em>
          </h1>
          <p>Visão 360 da sua operação · volume, conversão, recebíveis e risco em um só lugar.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <ProfileSwitcher profile={profile} onChange={setProfile} />
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => refetch()} title="Atualizar dados">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setScheduleOpen(true)} title="Agendar relatório">
            <CalendarPlus className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setTourOpen(true)} title="Tour guiado">
            <HelpCircle className="w-4 h-4" />
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
        </div>
      </div>

      {/* ZONA 0 — Alertas críticos (só se houver) */}
      {showSection('alerts') && (
        <AnimatedSection>
          <CriticalAlertsBanner />
        </AnimatedSection>
      )}

      {/* ZONA 1 — DINHEIRO AGORA: saldo + antecipação + a receber */}
      {showSection('balance') && (
        <AnimatedSection delay={0.05} className="space-y-4">
          <BalanceCard available={125430.5} pending={212880.0} blocked={2500.0} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
              <AnticipationContextCard receivableAmount={212880} feePercentage={1.99} />
            </div>
            <div className="lg:col-span-2">
              <ReceivablesBreakdown />
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* ZONA 2 — VENDAS: Volume / Transações / Ticket Médio (subiu para responder a pergunta #1) */}
      {showSection('gmv') && (
        <AnimatedSection delay={0.1}>
          <GMVCardConsolidated data={gmvData} loading={loadingTx} />
        </AnimatedSection>
      )}

      {/* ZONA 3 — ATALHOS (subiu para o topo do campo de visão) */}
      <AnimatedSection delay={0.12}>
        <QuickActionsCustomizable />
      </AnimatedSection>

      {/* ZONA 4 — PERFORMANCE: indicadores acionáveis + métricas de transação */}
      {showSection('gmv') && showSection('performance') && (
        <AnimatedSection delay={0.15} className="space-y-4">
          <PerformanceIndicatorsActionable transactions={transactions} />
          <TransactionMetricsCards transactions={transactions} />
        </AnimatedSection>
      )}

      {/* ZONA 5 — VAI ACONTECER: forecast + intraday + risco */}
      {showSection('forecast') && (
        <AnimatedSection delay={0.18}>
          <ForecastRow />
        </AnimatedSection>
      )}

      {(showSection('forecast') || showSection('goals')) && (
        <AnimatedSection delay={0.2} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <IntradayProjection />
          <FinancialRiskCard />
          {showSection('goals') && <GoalsProgressCard />}
        </AnimatedSection>
      )}

      {/* ZONA 6 — IA proativa */}
      {showSection('ai') && (
        <AnimatedSection delay={0.22} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AISuggestionsCard />
          <RecoveryRevenueCard />
        </AnimatedSection>
      )}

      {showSection('levers') && (
        <AnimatedSection delay={0.25}>
          <TopRevenueLevers />
        </AnimatedSection>
      )}

      {/* ZONA 7 — FLUXO DE DINHEIRO + CANAIS */}
      {showSection('flow') && (
        <AnimatedSection delay={0.28} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MoneyFlowCard />
          {showSection('channels') ? <ChannelBreakdownCard /> : <CheckoutFunnelCard />}
        </AnimatedSection>
      )}

      {/* ZONA 8 — Orquestração + canais (Ops) */}
      {showSection('acquirers') && (
        <AnimatedSection delay={0.3}>
          <AcquirerPerformanceCard />
        </AnimatedSection>
      )}

      {showSection('channels') && showSection('funnel') && (
        <AnimatedSection delay={0.32} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChannelBreakdownCard />
          <CheckoutFunnelCard />
        </AnimatedSection>
      )}

      {showSection('volume') || showSection('activity') ? (
        <AnimatedSection delay={0.32} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {showSection('volume') && (
              <ChartCard
                title={t('dashboard.sales_volume')}
                subtitle={t('dashboard.card_vs_pix')}
                periodSelector
                selectedPeriod={period}
                onPeriodChange={setPeriod}
              >
                <VolumeChart period={period} />
              </ChartCard>
            )}
          </div>
          <div className="lg:col-span-1">
            {showSection('activity') && <ActivityFeed />}
          </div>
        </AnimatedSection>
      ) : null}

      {/* ZONA 8 — Tabs preservadas */}
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
          <CardPerformanceFull />
        </TabsContent>

        <TabsContent value="pix" className="space-y-4">
          <PixUpliftCard />
          <PixFlowCards transactions={transactions} />
          <PixPerformanceFull />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AdvancedAnalyticsFull />
        </TabsContent>
      </Tabs>

      {/* ZONA 9 — Alertas não-críticos com snooze */}
      <AnimatedSection delay={0.35}>
        <AlertsPanelEnhanced />
      </AnimatedSection>

      {/* ZONA 10 — Compromissos regulatórios (informativo, baixo destaque) */}
      <AnimatedSection delay={0.4}>
        <RegulatoryCommitmentsCard />
      </AnimatedSection>

      {/* Modais */}
      <OnboardingTour open={tourOpen} onClose={() => setTourOpen(false)} />
      <ScheduledReportsModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
    </div>
  );
}