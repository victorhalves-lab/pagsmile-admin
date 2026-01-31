// Lógica de processamento de mensagens para o Dispute Manager
// Simula respostas de LLM para gestão de disputas e chargebacks

import { 
  AlertTriangle, 
  FileText, 
  Shield,
  CheckCircle2,
  Scale,
  Eye
} from 'lucide-react';
import { createPageUrl } from '@/components/utils';

// Dados mock
const mockData = {
  disputes: {
    pending: 12,
    inAnalysis: 5,
    contested: 8,
    won: 45,
    lost: 12
  },
  disputeCB001: {
    id: 'CB-001',
    merchant: 'GameZone Digital',
    amount: 'R$ 12.500',
    reason: 'Produto não recebido',
    status: 'Em Análise',
    deadline: '2 dias',
    winProbability: '78%',
    evidenceNeeded: ['Comprovante de entrega', 'Nota fiscal', 'Termo de serviço']
  },
  chargebackRatio: '1.2%',
  avgWinRate: '68%'
};

// Padrões de intenção
const intentPatterns = [
  // STATUS DE DISPUTA
  {
    patterns: ['status', 'cb-', 'disputa', 'chargeback'],
    response: () => ({
      content: `⚖️ **Status da Disputa ${mockData.disputeCB001.id}**\n\n**Merchant:** ${mockData.disputeCB001.merchant}\n**Valor:** ${mockData.disputeCB001.amount}\n**Motivo:** ${mockData.disputeCB001.reason}\n**Status:** ${mockData.disputeCB001.status}\n**Prazo:** ${mockData.disputeCB001.deadline}\n\n**Análise da IA:**\n• Probabilidade de vitória: ${mockData.disputeCB001.winProbability}\n• Recomendação: **Contestar**\n\n**Evidências necessárias:**\n${mockData.disputeCB001.evidenceNeeded.map((e, i) => `${i + 1}. ${e}`).join('\n')}\n\nPosso gerar a narrativa de contestação ou o checklist de evidências.`,
      actions: [
        { label: 'Gerar narrativa', variant: 'default', onClick: () => {} },
        { label: 'Checklist evidências', variant: 'outline', onClick: () => {} },
        { label: 'Ver timeline', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // EVIDÊNCIAS
  {
    patterns: ['evidência', 'evidencias', 'documento', 'comprovante', 'preciso para'],
    response: () => ({
      content: `📋 **Checklist de Evidências - ${mockData.disputeCB001.id}**\n\n**Motivo da disputa:** ${mockData.disputeCB001.reason}\n\n**Evidências Recomendadas:**\n\n✅ **Obrigatórias:**\n• Comprovante de entrega com assinatura\n• Nota fiscal eletrônica\n• Print do rastreamento\n\n📎 **Recomendadas (aumentam chances):**\n• Termo de serviço aceito pelo cliente\n• Histórico de comunicação\n• Fotos do produto embalado\n\n⚠️ **Prazo:** ${mockData.disputeCB001.deadline} para envio\n\nPosso ajudar a gerar a carta de contestação com base nas evidências que você tiver.`,
      actions: [
        { label: 'Gerar carta', variant: 'default', onClick: () => {} },
        { label: 'Upload evidências', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // GERAR NARRATIVA
  {
    patterns: ['narrativa', 'carta', 'contestação', 'contestar', 'gerar'],
    response: () => ({
      content: `✍️ **Narrativa de Contestação - ${mockData.disputeCB001.id}**\n\n---\n\n**CARTA DE CONTESTAÇÃO**\n\nRef: Chargeback ${mockData.disputeCB001.id}\nValor: ${mockData.disputeCB001.amount}\n\nPrezados,\n\nContestamos formalmente o chargeback em referência pelos seguintes motivos:\n\n1. **Entrega Confirmada:** Conforme comprovante anexo (Anexo A), o produto foi entregue em [DATA] no endereço cadastrado, com assinatura do recebedor.\n\n2. **Comunicação Prévia:** O cliente foi informado sobre prazos de entrega no momento da compra e recebeu atualizações de rastreamento.\n\n3. **Política Clara:** Os termos de serviço aceitos pelo cliente (Anexo B) descrevem claramente o processo de entrega.\n\nSolicitamos a reversão do chargeback com base nas evidências apresentadas.\n\n---\n\n*Esta é uma prévia. Personalize com os dados reais antes de enviar.*`,
      actions: [
        { label: 'Copiar texto', variant: 'default', onClick: () => {} },
        { label: 'Editar', variant: 'outline', onClick: () => {} },
        { label: 'Enviar contestação', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // VISÃO GERAL
  {
    patterns: ['visão geral', 'resumo', 'todas', 'pendentes', 'quantas'],
    response: () => ({
      content: `📊 **Visão Geral de Disputas**\n\n**Status Atual:**\n• 🔴 Pendentes: ${mockData.disputes.pending}\n• 🟡 Em Análise: ${mockData.disputes.inAnalysis}\n• 🔵 Contestadas: ${mockData.disputes.contested}\n• ✅ Ganhas: ${mockData.disputes.won}\n• ❌ Perdidas: ${mockData.disputes.lost}\n\n**Métricas:**\n• Taxa de Chargeback: ${mockData.chargebackRatio}\n• Taxa de Vitória: ${mockData.avgWinRate}\n\n**Atenção Urgente:**\n3 disputas com prazo < 48h precisam de ação imediata.\n\nQuer ver os casos urgentes?`,
      actions: [
        { label: 'Ver urgentes', variant: 'default', onClick: () => {} },
        { label: 'Filtrar por status', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // REGRAS DE AUTOMAÇÃO
  {
    patterns: ['regra', 'automação', 'automatizar', 'auto-aceitar'],
    response: () => ({
      content: `⚙️ **Regras de Automação de Disputas**\n\n**Regras Ativas:**\n1. ✅ Auto-aceitar disputas < R$ 50 (economia de tempo)\n2. ✅ Escalar disputas de fraude para analista sênior\n3. ✅ Notificar merchant em novas disputas\n4. ⏸️ Auto-contestar com evidência de entrega (pausado)\n\n**Criar Nova Regra:**\nExemplos:\n• "Auto-aceitar disputas abaixo de R$ 100"\n• "Escalar disputas > R$ 5.000 para revisão manual"\n• "Auto-contestar se houver comprovante de entrega"\n\nQual regra deseja criar?`,
      actions: [
        { label: 'Auto-aceitar', variant: 'outline', onClick: () => {} },
        { label: 'Escalar valores altos', variant: 'outline', onClick: () => {} },
        { label: 'Ver todas regras', variant: 'outline', onClick: () => {} }
      ]
    })
  }
];

// Função principal
export function processDisputeManagerMessage(message, conversationHistory = []) {
  const lowerMessage = message.toLowerCase().trim();
  
  for (const intent of intentPatterns) {
    for (const pattern of intent.patterns) {
      if (lowerMessage.includes(pattern)) {
        return intent.response();
      }
    }
  }

  if (lowerMessage.match(/^(oi|olá|ola|hey|bom dia|boa tarde|boa noite)/)) {
    return {
      content: `Olá! 👋 Sou o Dispute Manager, seu assistente para gestão de chargebacks e disputas.\n\nPosso ajudar com:\n• Consultar status de disputas\n• Recomendar evidências necessárias\n• Gerar narrativas de contestação\n• Configurar regras de automação\n• Analisar probabilidade de vitória\n\nComo posso ajudar?`,
      actions: [
        { label: 'Ver disputas pendentes', variant: 'outline', onClick: () => {} },
        { label: 'Gerar contestação', variant: 'outline', onClick: () => {} }
      ]
    };
  }

  return {
    content: `Não entendi completamente. 🤔\n\nPosso ajudar com:\n• **Status** - "Qual o status da disputa CB-001?"\n• **Evidências** - "Que evidências preciso para contestar?"\n• **Contestação** - "Gere a narrativa de contestação"\n• **Visão geral** - "Quantas disputas tenho pendentes?"\n• **Regras** - "Crie uma regra de auto-aceitar"\n\nTente uma dessas opções!`,
    actions: [
      { label: 'Ver pendentes', variant: 'outline', onClick: () => {} },
      { label: 'Gerar contestação', variant: 'outline', onClick: () => {} }
    ]
  };
}

export const disputeManagerQuickPrompts = [
  { label: 'Disputas pendentes', text: 'Quantas disputas tenho pendentes e quais são urgentes?', icon: AlertTriangle },
  { label: 'Gerar contestação', text: 'Gere uma narrativa de contestação para a disputa CB-001', icon: FileText },
  { label: 'Evidências', text: 'Que evidências preciso para contestar um chargeback de produto não recebido?', icon: Shield },
  { label: 'Regras', text: 'Quais regras de automação de disputas estão ativas?', icon: Scale }
];

// Admin Interno
export function processDisputeManagerAdminMessage(message, conversationHistory = []) {
  const lowerMessage = message.toLowerCase().trim();
  
  if (lowerMessage.includes('global') || lowerMessage.includes('consolidado') || lowerMessage.includes('todos merchants')) {
    return {
      content: `📊 **Visão Global de Disputas**\n\n**Métricas Consolidadas (847 merchants):**\n• Total de disputas ativas: 342\n• Valor em disputa: R$ 2.8M\n• Taxa média de vitória: 64%\n• Chargeback ratio médio: 0.9%\n\n**Merchants em Alerta:**\n• 5 merchants com ratio > 2% (risco de penalização)\n• 12 merchants com ratio crescente\n\n**Oportunidades:**\n• R$ 890k em disputas com alta probabilidade de vitória não contestadas\n\nQuer focar nos merchants críticos?`,
      actions: [
        { label: 'Ver merchants críticos', variant: 'default', onClick: () => {} },
        { label: 'Exportar relatório', variant: 'outline', onClick: () => {} }
      ]
    };
  }

  return processDisputeManagerMessage(message, conversationHistory);
}

export const disputeManagerAdminQuickPrompts = [
  { label: 'Visão global', text: 'Qual o volume total de disputas de todos os merchants?', icon: AlertTriangle },
  { label: 'Merchants críticos', text: 'Quais merchants estão com chargeback ratio acima do limite?', icon: AlertTriangle },
  { label: 'Oportunidades', text: 'Quais disputas têm alta chance de vitória mas não foram contestadas?', icon: CheckCircle2 },
  { label: 'Regras globais', text: 'Quais regras de automação estão configuradas globalmente?', icon: Scale }
];