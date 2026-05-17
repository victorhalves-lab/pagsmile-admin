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
 * Conciliação Automatizada · Admin Interno PagSmile · V8
 * Visão interna PagSmile que cruza Tuna Ledger × Arquivos de Adquirentes × Extrato Bancário (3-way).
 * Esta tela existe para a operação PagSmile auditar o fluxo end-to-end com os adquirentes parceiros.
 */
export default function AdminIntReconciliationAutomated() {
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

      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 16,
        padding: 20,
        boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, flexWrap: 'wrap',
          paddingBottom: 14, marginBottom: 14,
          borderBottom: '1px solid #EDEDED',
        }}>
          <div>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              fontWeight: 700, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#007A5C',
            }}>
              DETALHAMENTO DA CONCILIAÇÃO
            </span>
            <div style={{
              marginTop: 4, fontSize: 16, fontWeight: 700,
              letterSpacing: '-0.018em', color: '#0F172A',
            }}>
              Explore arquivos, divergências, ajustes e cronograma
            </div>
          </div>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5,
            fontWeight: 600, color: '#64748B',
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            6 modos · {subTab.replace('_', ' ')}
          </span>
        </div>

        <ReconSubTabs value={subTab} onChange={setSubTab} />

        <div style={{ marginTop: 16 }}>
          {renderSubTab()}
        </div>

        {subTab === 'overview' && (
          <div style={{ marginTop: 18 }}>
            <DivergenceBucketMatrix onSelect={setSelectedBucket} />
          </div>
        )}
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