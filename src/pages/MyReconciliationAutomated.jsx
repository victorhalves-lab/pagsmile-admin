import React, { useState } from 'react';
import ReconHeaderV8 from '@/components/reconciliation/automated/ReconHeaderV8';
import ReconKpiGridV8 from '@/components/reconciliation/automated/ReconKpiGridV8';
import ThreeWayDiagramV8 from '@/components/reconciliation/automated/ThreeWayDiagramV8';
import DivergenceBucketMatrix from '@/components/reconciliation/automated/DivergenceBucketMatrix';
import DivergenceBucketDrawer from '@/components/reconciliation/automated/DivergenceBucketDrawer';
import ReconSubTabs from '@/components/reconciliation/automated/ReconSubTabs';
import ReconOverviewView from '@/components/reconciliation/automated/views/ReconOverviewView';
import ReconFilesView from '@/components/reconciliation/automated/views/ReconFilesView';
import ReconDivergencesView from '@/components/reconciliation/automated/views/ReconDivergencesView';
import ReconAdjustmentsView from '@/components/reconciliation/automated/views/ReconAdjustmentsView';
import ReconScheduleView from '@/components/reconciliation/automated/views/ReconScheduleView';
import ReconHowItWorksView from '@/components/reconciliation/automated/views/ReconHowItWorksView';

/**
 * Conciliação Automatizada · Admin Sub · V8
 * Tela single-merchant que cruza Tuna × Adquirente × Banco em 3 vias.
 * Inspirada na arquitetura do Recovery Agent V8 + Admin Interno ReconciliationHub.
 */
export default function MyReconciliationAutomated() {
  const [agentActive, setAgentActive] = useState(true);
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [subTab, setSubTab] = useState('overview');

  const renderSubTab = () => {
    switch (subTab) {
      case 'overview': return <ReconOverviewView />;
      case 'files': return <ReconFilesView />;
      case 'divergences': return <ReconDivergencesView />;
      case 'adjustments': return <ReconAdjustmentsView />;
      case 'schedule': return <ReconScheduleView />;
      case 'how': return <ReconHowItWorksView />;
      default: return <ReconOverviewView />;
    }
  };

  return (
    <div
      data-ds="v8"
      style={{
        display: 'flex', flexDirection: 'column', gap: 18,
        padding: 20,
        background: 'var(--v8-bg-canvas)',
        minHeight: '100vh',
      }}
    >
      <ReconHeaderV8 active={agentActive} onToggle={() => setAgentActive(v => !v)} />
      <ReconKpiGridV8 />
      <ThreeWayDiagramV8 />
      <DivergenceBucketMatrix onSelect={setSelectedBucket} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <ReconSubTabs value={subTab} onChange={setSubTab} />
        {renderSubTab()}
      </div>

      {selectedBucket && (
        <DivergenceBucketDrawer
          bucket={selectedBucket}
          onClose={() => setSelectedBucket(null)}
        />
      )}
    </div>
  );
}