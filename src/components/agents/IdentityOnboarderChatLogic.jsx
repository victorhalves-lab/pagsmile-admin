// Lógica de processamento de mensagens para o Identity Onboarder
// Simula respostas de LLM para análise KYC/KYB

import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2,
  FileText,
  Settings,
  Eye,
  UserCheck
} from 'lucide-react';
import { createPageUrl } from '@/components/utils';

// Dados mock
const mockData = {
  submissionKYC002: {
    id: 'KYC-2024-002',
    merchant: 'Fashion Express',
    document: '12.345.678/0001-90',
    helenaScore: 45,
    status: 'Revisão Manual',
    redFlags: ['Sócio com restrições', 'Endereço inconsistente'],
    recommendation: 'Solicitar documentação adicional',
    documentsNeeded: ['Comprovante de endereço atualizado', 'Certidão negativa do sócio']
  },
  queueStats: {
    pending: 23,
    aiApproved: 156,
    aiRejected: 12,
    manualReview: 8,
    avgProcessingTime: '4.2h'
  },
  helenaConfig: {
    autoApproveThreshold: 75,
    manualReviewThreshold: 50,
    autoRejectThreshold: 30,
    pepCheckEnabled: true,
    addressValidationWeight: 15
  }
};

// Padrões de intenção
const intentPatterns = [
  // ANALISAR CASO ESPECÍFICO
  {
    patterns: ['kyc-', 'analisar', 'análise', 'submissão', 'caso'],
    response: () => ({
      content: `🔍 **Análise da Submissão ${mockData.submissionKYC002.id}**\n\n**Merchant:** ${mockData.submissionKYC002.merchant}\n**CNPJ:** ${mockData.submissionKYC002.document}\n\n**Helena AI Score:** ${mockData.submissionKYC002.helenaScore}/100\n**Status:** ${mockData.submissionKYC002.status}\n\n**🚩 Red Flags Identificados:**\n${mockData.submissionKYC002.redFlags.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n**Recomendação da IA:**\n${mockData.submissionKYC002.recommendation}\n\n**Documentos Necessários:**\n${mockData.submissionKYC002.documentsNeeded.map((d, i) => `• ${d}`).join('\n')}\n\nDeseja que eu detalhe algum red flag ou puxe os documentos enviados?`,
      actions: [
        { label: 'Ver documentos', variant: 'outline', onClick: () => {} },
        { label: 'Detalhar red flags', variant: 'outline', onClick: () => {} },
        { label: 'Aprovar manualmente', variant: 'default', onClick: () => {} },
        { label: 'Solicitar docs', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // POR QUE SINALIZADO
  {
    patterns: ['por que', 'sinalizado', 'flag', 'motivo', 'razão'],
    response: () => ({
      content: `🚩 **Detalhamento dos Red Flags**\n\n**1. Sócio com restrições**\n• O sócio João Silva (CPF: ***.456.789-**) possui:\n  - Pendência na Receita Federal\n  - Processo judicial ativo (cível)\n• **Impacto no score:** -20 pontos\n• **Ação recomendada:** Solicitar certidão negativa atualizada\n\n**2. Endereço inconsistente**\n• Endereço declarado: Rua A, 123 - SP\n• Endereço Receita Federal: Rua B, 456 - RJ\n• **Impacto no score:** -15 pontos\n• **Ação recomendada:** Solicitar comprovante de endereço comercial\n\n**Score sem red flags seria:** 80/100 (Auto-aprovação)\n\nDeseja solicitar os documentos ao merchant?`,
      actions: [
        { label: 'Solicitar documentos', variant: 'default', onClick: () => {} },
        { label: 'Aprovar mesmo assim', variant: 'outline', onClick: () => {} },
        { label: 'Rejeitar', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // FILA DE ANÁLISE
  {
    patterns: ['fila', 'pendente', 'quantos', 'queue', 'aguardando'],
    response: () => ({
      content: `📊 **Status da Fila de Compliance**\n\n**Métricas Atuais:**\n• 🔴 Pendentes: ${mockData.queueStats.pending}\n• ✅ Auto-aprovados (Helena): ${mockData.queueStats.aiApproved}\n• ❌ Auto-rejeitados (Helena): ${mockData.queueStats.aiRejected}\n• 🟡 Revisão Manual: ${mockData.queueStats.manualReview}\n\n**Performance:**\n• Tempo médio de processamento: ${mockData.queueStats.avgProcessingTime}\n• Taxa de auto-aprovação: 78%\n\n**Próximos na fila (prioridade):**\n1. KYC-2024-025 - Alto valor (R$ 500k/mês)\n2. KYC-2024-023 - MCC de alto risco\n3. KYC-2024-022 - Aguardando há 48h\n\nQuer que eu abra algum caso específico?`,
      actions: [
        { label: 'Abrir próximo', variant: 'default', onClick: () => {} },
        { label: 'Ver todos pendentes', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // CONFIGURAÇÃO DA HELENA
  {
    patterns: ['configurar', 'helena', 'threshold', 'limite', 'ajustar', 'parâmetro'],
    response: () => ({
      content: `⚙️ **Configuração da Helena AI**\n\n**Thresholds Atuais:**\n• Auto-aprovação: Score ≥ ${mockData.helenaConfig.autoApproveThreshold}\n• Revisão manual: Score ${mockData.helenaConfig.manualReviewThreshold}-${mockData.helenaConfig.autoApproveThreshold - 1}\n• Auto-rejeição: Score < ${mockData.helenaConfig.autoRejectThreshold}\n\n**Pesos de Validação:**\n• Validação de endereço: ${mockData.helenaConfig.addressValidationWeight}%\n• Verificação PEP: ${mockData.helenaConfig.pepCheckEnabled ? 'Ativa' : 'Inativa'}\n\n**Para ajustar, diga:**\n• "Ajuste o limite de auto-aprovação para 70"\n• "Aumente o peso da validação de endereço"\n• "Desative a verificação PEP para MCCs de baixo risco"`,
      actions: [
        { label: 'Ajustar thresholds', variant: 'outline', onClick: () => {} },
        { label: 'Ajustar pesos', variant: 'outline', onClick: () => {} },
        { label: 'Ver histórico', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // AJUSTAR THRESHOLD
  {
    patterns: ['ajuste', 'altere', 'mude', 'defina'],
    response: () => ({
      content: `✅ **Ajuste de Configuração**\n\nEntendido! Para confirmar a alteração:\n\n**Alteração solicitada:**\n• Threshold de auto-aprovação: 75 → 70\n\n**Impacto estimado:**\n• +12% de submissões auto-aprovadas\n• -8% de casos para revisão manual\n• Risco: Levemente aumentado\n\n⚠️ Esta alteração entrará em vigor imediatamente e afetará todas as novas submissões.\n\nConfirma a alteração?`,
      actions: [
        { label: 'Confirmar', variant: 'default', onClick: () => {} },
        { label: 'Cancelar', variant: 'outline', onClick: () => {} },
        { label: 'Testar antes', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // ANÁLISE DE DOCUMENTO
  {
    patterns: ['documento', 'comprovante', 'analisar documento', 'validar'],
    response: () => ({
      content: `📄 **Análise de Documento**\n\nQual documento você gostaria que eu analisasse?\n\n**Documentos do caso ${mockData.submissionKYC002.id}:**\n1. 📄 Contrato Social - Enviado ✅\n2. 📄 Comprovante de Endereço - Pendente ⏳\n3. 📄 RG dos Sócios - Enviado ✅\n4. 📄 Certidão Negativa - Não solicitada\n\n**Para analisar um documento específico:**\n"Analise o contrato social da Fashion Express"\n\nOu posso fazer uma análise consolidada de todos os documentos enviados.`,
      actions: [
        { label: 'Análise consolidada', variant: 'default', onClick: () => {} },
        { label: 'Solicitar pendentes', variant: 'outline', onClick: () => {} }
      ]
    })
  }
];

// Função principal
export function processIdentityOnboarderMessage(message, conversationHistory = []) {
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
      content: `Olá! 👋 Sou o Identity Onboarder, assistente para análise KYC/KYB.\n\nPosso ajudar com:\n• Analisar casos específicos de compliance\n• Detalhar red flags e justificativas\n• Configurar parâmetros da Helena AI\n• Gerenciar a fila de análise\n• Validar documentos\n\nComo posso ajudar?`,
      actions: [
        { label: 'Ver fila', variant: 'outline', onClick: () => {} },
        { label: 'Config Helena', variant: 'outline', onClick: () => {} }
      ]
    };
  }

  return {
    content: `Não entendi completamente. 🤔\n\nPosso ajudar com:\n• **Análise** - "Analisar KYC-2024-002"\n• **Red flags** - "Por que este merchant foi sinalizado?"\n• **Fila** - "Quantos casos pendentes na fila?"\n• **Configuração** - "Ajustar threshold de auto-aprovação"\n• **Documentos** - "Analisar documentos enviados"\n\nTente uma dessas opções!`,
    actions: [
      { label: 'Ver fila', variant: 'outline', onClick: () => {} },
      { label: 'Analisar caso', variant: 'outline', onClick: () => {} }
    ]
  };
}

export const identityOnboarderQuickPrompts = [
  { label: 'Ver fila', text: 'Quantos casos estão pendentes na fila de compliance?', icon: FileText },
  { label: 'Analisar caso', text: 'Analisar a submissão KYC-2024-002', icon: Eye },
  { label: 'Por que sinalizado', text: 'Por que este merchant foi sinalizado com red flags?', icon: AlertTriangle },
  { label: 'Config Helena', text: 'Quais são as configurações atuais da Helena AI?', icon: Settings }
];