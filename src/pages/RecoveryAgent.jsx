import React, { useState } from 'react';
import PaymentRecoveryAgentView from '@/components/transactions/PaymentRecoveryAgentView';
import AgentChatInterface from '@/components/agents/AgentChatInterface';
import AgentFloatingButton from '@/components/agents/AgentFloatingButton';
import { processRecoveryAgentMessage, recoveryAgentQuickPrompts } from '@/components/agents/RecoveryAgentChatLogic';

/**
 * Recovery Agent · Admin Sub · V8
 * Estrutura completa:
 *   1. Header do agente (status, toggle ativar/pausar)
 *   2. KPI Grid (GMV recuperado, taxa, fila, custo evitado, etc.)
 *   3. Antes/Depois do agente
 *   4. Matriz de motivos de recusa (12 cenários reais — CVV, saldo, limite, antifraude...)
 *   5. Sub-abas:
 *      • Dashboard · Fila ao vivo · WhatsApp · Telefone · E-mail/SMS · Auto-retry · A/B Tests
 *   6. Drawer detalhado ao clicar em qualquer motivo de recusa
 */
export default function RecoveryAgent() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      <PaymentRecoveryAgentView />

      <AgentChatInterface
        agentName="recovery_agent"
        agentDisplayName="Recovery Agent"
        agentDescription="Assistente de recuperação de pagamentos"
        quickPrompts={recoveryAgentQuickPrompts}
        onProcessMessage={processRecoveryAgentMessage}
        welcomeMessage="Olá! 👋 Sou o Recovery Agent. Posso analisar recusas, sugerir cadência por canal (WhatsApp / ligação / e-mail) e mostrar quanto você está recuperando. Como posso ajudar?"
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
    </>
  );
}