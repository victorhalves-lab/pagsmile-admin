import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import PaymentRecoveryAgentView from '@/components/transactions/PaymentRecoveryAgentView';
import AgentChatInterface from '@/components/agents/AgentChatInterface';
import AgentFloatingButton from '@/components/agents/AgentFloatingButton';
import { processRecoveryAgentMessage, recoveryAgentQuickPrompts } from '@/components/agents/RecoveryAgentChatLogic';

/**
 * Recovery Agent · Admin Sub (Merchant-facing) · V8
 * Reaproveita o componente PaymentRecoveryAgentView com:
 * - 12 cenários reais de recusa (CVV, saldo, limite, antifraude, timeout, etc.)
 * - Cadências por canal (WhatsApp / Telefone / E-mail+SMS / Auto-retry)
 * - Fila ao vivo + A/B tests
 * - Drawer detalhado por motivo de recusa
 */
export default function RecoveryAgent() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Recovery Agent"
        subtitle="Recuperação inteligente de pagamentos por motivo de recusa — WhatsApp, ligação, e-mail/SMS e auto-retry"
        breadcrumbs={[
          { label: 'Agentes IA', page: 'AiAgentsHub' },
          { label: 'Recovery Agent', page: 'RecoveryAgent' },
        ]}
      />

      <PaymentRecoveryAgentView />

      <AgentChatInterface
        agentName="recovery_agent"
        agentDisplayName="Recovery Agent"
        agentDescription="Assistente de recuperação de pagamentos"
        quickPrompts={recoveryAgentQuickPrompts}
        onProcessMessage={processRecoveryAgentMessage}
        welcomeMessage="Olá! 👋 Sou o Recovery Agent. Posso analisar recusas, sugerir cadência por canal (WhatsApp / ligação / e-mail) e mostrar quanto você está recuperando em tempo real. Como posso ajudar?"
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        accentColor="#2bc196"
      />

      <AgentFloatingButton
        isOpen={isChatOpen}
        onClick={() => setIsChatOpen(!isChatOpen)}
        agentName="Recovery Agent"
        accentColor="#2bc196"
      />
    </div>
  );
}