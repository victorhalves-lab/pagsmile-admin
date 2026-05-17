import React, { useState } from 'react';
import RecoveryAgentHeaderV8 from './recovery/RecoveryAgentHeaderV8';
import RecoveryKpiGridV8 from './recovery/RecoveryKpiGridV8';
import BeforeAfterV8 from './recovery/BeforeAfterV8';
import DeclineReasonMatrix from './recovery/DeclineReasonMatrix';
import DeclineReasonDrawer from './recovery/DeclineReasonDrawer';
import RecoverySubTabs from './recovery/RecoverySubTabs';
import RecoveryDashboardView from './recovery/views/RecoveryDashboardView';
import RecoveryLiveQueueView from './recovery/views/RecoveryLiveQueueView';
import RecoveryWhatsAppView from './recovery/views/RecoveryWhatsAppView';
import RecoveryPhoneView from './recovery/views/RecoveryPhoneView';
import RecoveryEmailSmsView from './recovery/views/RecoveryEmailSmsView';
import RecoveryAutoRetryView from './recovery/views/RecoveryAutoRetryView';
import RecoveryABTestsView from './recovery/views/RecoveryABTestsView';

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
      case 'queue': return <RecoveryLiveQueueView />;
      case 'whatsapp': return <RecoveryWhatsAppView />;
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

      {/* Bloco 2 · Sub-abas em destaque + matriz como conteúdo da Dashboard */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 14,
        background: 'var(--v8-bg-surface)',
        border: '1px solid var(--v8-bd-default)',
        borderRadius: 'var(--r-lg)',
        padding: 16,
        boxShadow: 'var(--sh-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span className="v8-eyebrow">DETALHAMENTO POR CANAL E ESTRATÉGIA</span>
            <h2 style={{
              fontSize: 18, fontWeight: 700, color: 'var(--v8-fg-strong)',
              letterSpacing: 'var(--tr-tight)', margin: '4px 0 0',
            }}>
              Explore como o agente atua em cada frente
            </h2>
          </div>
        </div>

        <RecoverySubTabs value={subTab} onChange={setSubTab} />

        {/* Conteúdo da sub-aba ativa */}
        <div style={{ paddingTop: 4 }}>
          {renderSubTab()}
        </div>

        {/* Matriz aparece dentro da aba Dashboard como contexto principal */}
        {subTab === 'dashboard' && (
          <div style={{ marginTop: 6 }}>
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