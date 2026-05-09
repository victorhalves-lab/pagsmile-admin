import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Layers } from 'lucide-react';
import { mockSplitDetail360 } from '@/components/mentor/mocks/splitMentorMock';
import MentorSplitHeaderCard from '@/components/mentor/split/MentorSplitHeaderCard';
import MentorSplitOwnerMerchantCards from '@/components/mentor/split/MentorSplitOwnerMerchantCards';
import MentorSplitConfigViewer from '@/components/mentor/split/MentorSplitConfigViewer';
import MentorSplitTerminalsCoverage from '@/components/mentor/split/MentorSplitTerminalsCoverage';
import MentorSplitMetricsBlock from '@/components/mentor/split/MentorSplitMetricsBlock';
import MentorSplitHistoryTimeline from '@/components/mentor/split/MentorSplitHistoryTimeline';
import MentorSplitActionsBar from '@/components/mentor/split/MentorSplitActionsBar';
import MentorSplitDerivedInsights from '@/components/mentor/split/MentorSplitDerivedInsights';
import { toast } from 'sonner';

export default function SplitDetail360() {
  const split = mockSplitDetail360;

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader
        title="Ficha 360 do Split"
        subtitle="Visão completa · configuração · beneficiários · terminais · métricas · histórico"
        icon={Layers}
        breadcrumbs={[
          { label: 'Financeiro', page: 'FinancialOverview' },
          { label: 'Splits', page: 'SplitManagement' },
          { label: 'Ficha 360' },
        ]}
      />

      <MentorSplitHeaderCard split={split} />

      <MentorSplitActionsBar
        split={split}
        onEdit={() => toast.info('Fluxo de edição — Wave H.4 (PUT com aviso prévio + cutover)')}
        onSuspend={() => toast.info('Suspensão temporária — Wave H.2 ações de status')}
        onTerminate={() => toast.warning('Encerramento exige OTP + alçada — Wave H.7 (admin interno)')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <MentorSplitOwnerMerchantCards
            owner={split.owner}
            merchant={split.merchant}
            additionalMerchants={split.additional_merchants}
          />
          <MentorSplitConfigViewer ruleConfig={split.rule_config} simulations={split.simulations} />
          <MentorSplitTerminalsCoverage
            terminals={split.terminals}
            totalOwnerTerminals={split.terminals_total_owner}
            inactiveCount={split.terminals_inactive_count}
          />
          <MentorSplitMetricsBlock metrics={split.metrics} />
        </div>

        <div className="space-y-4">
          <MentorSplitDerivedInsights
            healthScore={split.health_score}
            healthFactors={split.health_factors}
            suggestions={split.optimization_suggestions}
          />
          <MentorSplitHistoryTimeline events={split.history} />
        </div>
      </div>
    </div>
  );
}