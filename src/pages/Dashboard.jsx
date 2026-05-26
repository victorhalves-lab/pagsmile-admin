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
import { Tabs, TabsContent } from '@/components/ui/tabs';
import V9TabSwitcher from '@/components/dashboard/V9TabSwitcher';
import { ChartLineUp, CreditCard as CreditCardIcon, QrCode as QrCodeIcon, ChartPieSlice } from '@phosphor-icons/react';

import EditorialPageHeader from '@/components/editorial/EditorialPageHeader';
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
      {/* PAGE HERO · Pulse VF */}
      <div className="mb-6 flex items-end justify-between gap-4 flex-wrap pb-5 border-b border-pag-mint-200 relative">
        <div style={{ position: 'absolute', left: 0, bottom: -1, width: 96, height: 2, background: 'linear-gradient(90deg, #00C194, #5CF7CF, #002443)', borderRadius: 99 }} />
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            background: 'linear-gradient(135deg, #00C194, #5CF7CF)',
            color: '#001124',
            borderRadius: 99,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10.5,
            fontWeight: 800,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: 12,
            boxShadow: '0 6px 18px -4px rgba(0,193,148,0.55)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: '#001124' }} />
            Dashboard · tempo real
          </div>
          <h1 style={{
            margin: 0,
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(32px, 4vw, 44px)',
            fontWeight: 800,
            letterSpacing: '-0.030em',
            color: '#001124',
            lineHeight: 1.05,
          }}>
            Painel <em style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #00C194, #5CF7CF, #002443)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>executivo</em>
          </h1>
          <p style={{
            margin: '8px 0 0',
            fontSize: 14,
            color: '#547C9D',
            maxWidth: 560,
            lineHeight: 1.5,
          }}>
            Visão 360 da sua operação · saldo, recebíveis, performance e compromissos regulatórios.
          </p>
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

      {/* ZONA 8 — Tabs analíticas · V9 segmented switcher */}
      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
          <div>
            <div
              className="font-mono inline-flex items-center gap-2 mb-2"
              style={{
                fontSize: 10.5, fontWeight: 800,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: '#007A5C',
              }}
            >
              <span style={{ width: 18, height: 2, background: '#00C194', borderRadius: 99 }} />
              Analytics · deep dive
            </div>
            <h2
              style={{
                margin: 0, fontFamily: 'Inter, sans-serif',
                fontSize: 22, fontWeight: 800, letterSpacing: '-0.022em',
                color: '#001124', lineHeight: 1.2,
              }}
            >
              Performance{' '}
              <em
                style={{
                  fontStyle: 'normal',
                  background: 'linear-gradient(135deg,#00C194,#007A5C)',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                detalhada
              </em>
            </h2>
          </div>
          <V9TabSwitcher
            value={activeView}
            onChange={setActiveView}
            options={[
              { value: 'executive', label: t('dashboard.views.executive'),          icon: ChartLineUp },
              { value: 'card',      label: t('dashboard.views.card_performance'),   icon: CreditCardIcon },
              { value: 'pix',       label: t('dashboard.views.pix_performance'),    icon: QrCodeIcon },
              { value: 'analytics', label: t('dashboard.views.advanced_analytics'), icon: ChartPieSlice },
            ]}
          />

        </div>

        <TabsContent value="executive" className="space-y-4">
          <ConversionMetricsCards transactions={transactions} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title={t('dashboard.payment_methods')} subtitle={t('dashboard.volume_distribution')}>
              <PaymentMethodsChart />
            </ChartCard>
            <ChartCard title={t('dashboard.approval_rate_by_brand')} subtitle={`${t('common.goal')}: 85%`}>
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

      {/* Modais */}
      <OnboardingTour open={tourOpen} onClose={() => setTourOpen(false)} />
      <ScheduledReportsModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
    </div>
  );
}