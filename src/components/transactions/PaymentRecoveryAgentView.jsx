import React, { useState } from 'react';
import RecoveryAgentHeaderV8 from './recovery/RecoveryAgentHeaderV8';
import RecoveryKpiGridV8 from './recovery/RecoveryKpiGridV8';
import BeforeAfterV8 from './recovery/BeforeAfterV8';
import DeclineReasonMatrix from './recovery/DeclineReasonMatrix';
import DeclineReasonDrawer from './recovery/DeclineReasonDrawer';
import RecoverySubTabs from './recovery/RecoverySubTabs';
import RecoveryDashboardView from './recovery/views/RecoveryDashboardView';
import RecoverySimulatorView from './recovery/views/RecoverySimulatorView';
import RecoveryLiveQueueView from './recovery/views/RecoveryLiveQueueView';
import RecoveryWhatsAppView from './recovery/views/RecoveryWhatsAppView';
import RecoveryPhoneView from './recovery/views/RecoveryPhoneView';
import RecoveryEmailSmsView from './recovery/views/RecoveryEmailSmsView';
import RecoveryAutoRetryView from './recovery/views/RecoveryAutoRetryView';
import RecoveryABTestsView from './recovery/views/RecoveryABTestsView';
import SalesRecoveryTemplates from './recovery/SalesRecoveryTemplates';

/**
 * Payment Recovery Agent View · V8
 * Estrutura: Header → KPIs → Antes/Depois → MATRIZ POR MOTIVO DE RECUSA → Sub-tabs detalhadas.
 * Cada motivo de recusa tem sua própria estratégia (canal, cadência, mensagem, fallbacks).
 */
export default function PaymentRecoveryAgentView() {
  const [agentActive, setAgentActive] = useState(true);
  const [selectedReason, setSelectedReason] = useState(null);
  const [subTab, setSubTab] = useState('dashboard');

  const renderSubTab = () => {
    switch (subTab) {
      case 'dashboard': return <RecoveryDashboardView />;
      case 'simulator': return <RecoverySimulatorView />;
      case 'queue': return <RecoveryLiveQueueView />;
      case 'whatsapp': return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <RecoveryWhatsAppView />
          <SalesRecoveryTemplates />
        </div>
      );
      case 'phone': return <RecoveryPhoneView />;
      case 'email_sms': return <RecoveryEmailSmsView />;
      case 'auto_retry': return <RecoveryAutoRetryView />;
      case 'ab_tests': return <RecoveryABTestsView />;
      default: return <RecoveryDashboardView />;
    }
  };

  return (
    <div
      data-ds="v8"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        padding: 4,
        background: 'var(--v8-bg-canvas)',
        minHeight: 600,
      }}
    >
      {/* Bloco 1 · Resumo executivo (sempre visível) */}
      <RecoveryAgentHeaderV8 active={agentActive} onToggle={() => setAgentActive(v => !v)} />
      <RecoveryKpiGridV8 />
      <BeforeAfterV8 />

      {/* Bloco 2 · Sub-abas + matriz dentro de uma section V8 */}
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
              DETALHAMENTO POR CANAL E ESTRATÉGIA
            </span>
            <div style={{
              marginTop: 4, fontSize: 16, fontWeight: 700,
              letterSpacing: '-0.018em', color: '#0F172A',
            }}>
              Explore como o agente atua em cada frente
            </div>
          </div>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5,
            fontWeight: 600, color: '#64748B',
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            7 modos · {subTab.replace('_', ' ')}
          </span>
        </div>

        <RecoverySubTabs value={subTab} onChange={setSubTab} />

        <div style={{ marginTop: 16 }}>
          {renderSubTab()}
        </div>

        {subTab === 'dashboard' && (
          <div style={{ marginTop: 18 }}>
            <DeclineReasonMatrix onSelect={setSelectedReason} />
          </div>
        )}
      </div>

      {selectedReason && (
        <DeclineReasonDrawer reason={selectedReason} onClose={() => setSelectedReason(null)} />
      )}
    </div>
  );
}