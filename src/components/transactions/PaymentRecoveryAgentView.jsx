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
      <RecoveryAgentHeaderV8 active={agentActive} onToggle={() => setAgentActive(v => !v)} />

      <RecoveryKpiGridV8 />

      <BeforeAfterV8 />

      <DeclineReasonMatrix onSelect={setSelectedReason} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <RecoverySubTabs value={subTab} onChange={setSubTab} />
        {renderSubTab()}
      </div>

      {selectedReason && (
        <DeclineReasonDrawer reason={selectedReason} onClose={() => setSelectedReason(null)} />
      )}
    </div>
  );
}