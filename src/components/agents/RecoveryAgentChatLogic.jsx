// Lógica de processamento de mensagens para o Recovery Agent
// Simula respostas de LLM para consultas sobre recuperação de pagamentos

import { 
  RefreshCw, 
  MessageSquare, 
  Mail, 
  QrCode, 
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { createPageUrl } from '@/components/utils';

// Dados mock para respostas
const mockData = {
  transactionT12345: {
    id: 'T-12345',
    customer: 'João Silva',
    amount: 'R$ 892,00',
    reason: 'fundos insuficientes',
    retries: 3,
    status: 'pending_recovery'
  },
  gmvAtRisk: 'R$ 127.450',
  gmvRecovered: 'R$ 68.230',
  recoveryRate: '53.5%',
  topScenarios: [
    { name: 'Saldo Insuficiente', rate: '62%', suggestion: 'PIX com desconto' },
    { name: 'PIX Pendente', rate: '71%', suggestion: 'Lembrete WhatsApp' },
    { name: 'Abandono', rate: '35%', suggestion: 'Email + Push' }
  ],
  channels: {
    whatsapp: { rate: '35%', best_for: 'PIX pendente e saldo insuficiente' },
    email: { rate: '20%', best_for: 'Abandono de carrinho' },
    sms: { rate: '20%', best_for: 'Lembretes urgentes' },
    push: { rate: '15%', best_for: 'Reengajamento' }
  }
};

// Padrões de intenção e respostas
const intentPatterns = [
  // CONSULTA DE TRANSAÇÃO ESPECÍFICA
  {
    patterns: ['transação', 'transacao', 't-', 'o que aconteceu', 'status da'],
    response: () => ({
      content: `🔍 **Análise da Transação ${mockData.transactionT12345.id}**\n\n**Cliente:** ${mockData.transactionT12345.customer}\n**Valor:** ${mockData.transactionT12345.amount}\n**Motivo da falha:** ${mockData.transactionT12345.reason}\n**Tentativas:** ${mockData.transactionT12345.retries} retentativas sem sucesso\n\n**Recomendação do Recovery Agent:**\nEnviar SMS de lembrete com link para novo pagamento via PIX (com 5% de desconto). Taxa de sucesso estimada: 62%.\n\nDeseja que eu execute essa ação?`,
      actions: [
        { label: 'Enviar SMS agora', variant: 'default', onClick: () => {} },
        { label: 'Tentar WhatsApp', variant: 'outline', onClick: () => {} },
        { label: 'Ver histórico', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // MELHOR COMUNICAÇÃO PARA CENÁRIO
  {
    patterns: ['melhor comunicação', 'qual comunicação', 'como comunicar', 'mensagem para'],
    response: () => ({
      content: `📨 **Recomendação de Comunicação**\n\nBaseado na análise de milhares de recuperações, aqui estão as melhores práticas:\n\n**Para Saldo Insuficiente:**\n• Canal: WhatsApp (35% conversão)\n• Tom: Empático, oferecer alternativa\n• Ação: Oferecer PIX com desconto\n\n**Para PIX Pendente:**\n• Canal: WhatsApp (71% conversão)\n• Tom: Urgente mas amigável\n• Ação: Lembrete com QR code atualizado\n\n**Para Limite Excedido:**\n• Canal: Email + WhatsApp\n• Tom: Solução prática\n• Ação: Sugerir split de pagamento\n\nPosso gerar um rascunho de mensagem para qual cenário?`,
      actions: [
        { label: 'Saldo Insuficiente', variant: 'outline', onClick: () => {} },
        { label: 'PIX Pendente', variant: 'outline', onClick: () => {} },
        { label: 'Limite Excedido', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // GERAÇÃO DE MENSAGEM
  {
    patterns: ['gerar mensagem', 'rascunho', 'criar email', 'criar sms', 'criar whatsapp'],
    response: () => ({
      content: `✍️ **Rascunho de Mensagem - Saldo Insuficiente**\n\n**WhatsApp:**\n\`\`\`\nOi, [Nome]! 👋\n\nVi que houve um probleminha no pagamento da sua compra de [Valor].\n\nQue tal tentar com PIX? Te dou 5% de desconto! 💚\n\n[Link para pagamento]\n\nQualquer dúvida, é só responder aqui!\n\`\`\`\n\n**Taxa de conversão estimada:** 35-40%\n**Melhor horário para envio:** 10h-12h ou 18h-20h\n\nDeseja personalizar ou enviar como está?`,
      actions: [
        { label: 'Enviar agora', variant: 'default', onClick: () => {} },
        { label: 'Personalizar', variant: 'outline', onClick: () => {} },
        { label: 'Ver outros templates', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // GMV EM RISCO / RECUPERÁVEL
  {
    patterns: ['gmv', 'quanto posso recuperar', 'potencial', 'em risco'],
    response: () => ({
      content: `💰 **Análise de GMV em Risco**\n\n**Situação Atual:**\n• GMV em Risco: ${mockData.gmvAtRisk}\n• GMV Recuperado: ${mockData.gmvRecovered}\n• Taxa de Recuperação: ${mockData.recoveryRate}\n\n**Potencial Adicional:**\n• 73 transações pendentes de retry\n• Valor total: R$ 45.230\n• Recuperação estimada (60%): R$ 27.138\n\n**Top 3 Cenários para Focar:**\n1. PIX Pendente - 71% taxa de recuperação\n2. Saldo Insuficiente - 62% taxa\n3. Erro Técnico - 85% taxa (baixo volume)\n\nQuer que eu priorize algum cenário específico?`,
      actions: [
        { label: 'Ativar recuperação automática', variant: 'default', onClick: () => {} },
        { label: 'Ver por cenário', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // PERFORMANCE DE CANAIS
  {
    patterns: ['canal', 'whatsapp', 'email', 'sms', 'performance'],
    response: () => ({
      content: `📊 **Performance por Canal de Comunicação**\n\n**WhatsApp** ⭐ Melhor performance\n• Taxa de conversão: ${mockData.channels.whatsapp.rate}\n• Melhor para: ${mockData.channels.whatsapp.best_for}\n\n**Email**\n• Taxa de conversão: ${mockData.channels.email.rate}\n• Melhor para: ${mockData.channels.email.best_for}\n\n**SMS**\n• Taxa de conversão: ${mockData.channels.sms.rate}\n• Melhor para: ${mockData.channels.sms.best_for}\n\n**Push Notification**\n• Taxa de conversão: ${mockData.channels.push.rate}\n• Melhor para: ${mockData.channels.push.best_for}\n\n💡 **Recomendação:** Use WhatsApp como canal primário e Email como fallback para melhor cobertura.`,
      actions: [
        { label: 'Ajustar prioridades', variant: 'outline', onClick: () => {} },
        { label: 'Ver métricas detalhadas', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // CONFIGURAÇÃO DE REGRAS
  {
    patterns: ['configurar', 'regra', 'automático', 'automatizar'],
    response: () => ({
      content: `⚙️ **Configuração de Regras de Recuperação**\n\n**Regras Ativas:**\n1. ✅ Retry automático para erro técnico (até 3x)\n2. ✅ WhatsApp após 5min de PIX pendente\n3. ✅ Email de carrinho abandonado após 30min\n4. ⏸️ SMS para saldo insuficiente (pausado)\n\n**Sugestão de Otimização:**\nAtivar SMS para saldo insuficiente pode aumentar a recuperação em +8%. Custo estimado: R$ 0,08/mensagem.\n\nDeseja ativar ou ajustar alguma regra?`,
      actions: [
        { label: 'Ativar SMS', variant: 'default', onClick: () => {} },
        { label: 'Editar regras', variant: 'outline', onClick: () => {} },
        { label: 'Ver todas', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // SIMULAÇÃO DE CENÁRIO
  {
    patterns: ['simular', 'simule', 'cenário', 'teste'],
    response: () => ({
      content: `🧪 **Simulação de Cenário**\n\nDescreva o cenário que deseja simular ou escolha uma opção:\n\n**Cenários Comuns:**\n1. **Saldo Insuficiente** - Cartão sem limite\n2. **PIX Pendente** - QR gerado mas não pago\n3. **Limite Excedido** - Valor acima do limite\n4. **Abandono** - Saiu antes de pagar\n5. **Erro Técnico** - Timeout no gateway\n\nVocê também pode descrever um cenário específico, como:\n"Simule uma transação de R$ 500 que falhou por saldo insuficiente de um cliente novo"`,
      actions: [
        { label: 'Saldo Insuficiente', variant: 'outline', onClick: () => {} },
        { label: 'PIX Pendente', variant: 'outline', onClick: () => {} },
        { label: 'Abandono', variant: 'outline', onClick: () => {} }
      ]
    })
  }
];

// Função principal de processamento
export function processRecoveryAgentMessage(message, conversationHistory = []) {
  const lowerMessage = message.toLowerCase().trim();
  
  // Busca por padrões correspondentes
  for (const intent of intentPatterns) {
    for (const pattern of intent.patterns) {
      if (lowerMessage.includes(pattern)) {
        return intent.response();
      }
    }
  }

  // Saudações
  if (lowerMessage.match(/^(oi|olá|ola|hey|bom dia|boa tarde|boa noite)/)) {
    return {
      content: `Olá! 👋 Sou o Recovery Agent, seu assistente para recuperação de pagamentos.\n\nPosso ajudar você com:\n• Analisar transações que falharam\n• Sugerir a melhor comunicação para cada cenário\n• Gerar mensagens de recuperação personalizadas\n• Mostrar seu potencial de recuperação\n• Configurar regras automáticas\n\nComo posso ajudar?`,
      actions: [
        { label: 'GMV em risco', variant: 'outline', onClick: () => {} },
        { label: 'Gerar mensagem', variant: 'outline', onClick: () => {} }
      ]
    };
  }

  // Resposta padrão
  return {
    content: `Não entendi completamente. 🤔\n\nPosso ajudar com:\n• **Analisar transações** - "O que aconteceu com T-12345?"\n• **Recomendar comunicação** - "Qual a melhor comunicação para saldo insuficiente?"\n• **Gerar mensagens** - "Crie um WhatsApp de recuperação"\n• **Ver potencial** - "Quanto GMV posso recuperar?"\n• **Simular cenários** - "Simule um cenário de abandono"\n\nTente uma dessas opções!`,
    actions: [
      { label: 'GMV em risco', variant: 'outline', onClick: () => {} },
      { label: 'Melhor comunicação', variant: 'outline', onClick: () => {} }
    ]
  };
}

// Quick prompts para o Recovery Agent
export const recoveryAgentQuickPrompts = [
  { label: 'GMV em risco', text: 'Quanto GMV tenho em risco e quanto posso recuperar?', icon: AlertTriangle },
  { label: 'Melhor comunicação', text: 'Qual a melhor comunicação para cada cenário de falha?', icon: MessageSquare },
  { label: 'Gerar mensagem', text: 'Gere um rascunho de mensagem de recuperação para saldo insuficiente', icon: Mail },
  { label: 'Performance canais', text: 'Qual a performance de cada canal de comunicação?', icon: TrendingUp }
];

// Quick prompts para Admin Interno (visão consolidada)
export const recoveryAgentAdminQuickPrompts = [
  { label: 'Visão global', text: 'Qual o GMV total em risco e recuperado de todos os merchants?', icon: AlertTriangle },
  { label: 'Merchants críticos', text: 'Quais merchants precisam de atenção na recuperação?', icon: AlertTriangle },
  { label: 'Otimização', text: 'Onde posso otimizar as configurações de recuperação?', icon: TrendingUp },
  { label: 'Benchmark', text: 'Como está a performance de recuperação comparada ao mercado?', icon: TrendingUp }
];

// Função de processamento para Admin Interno
export function processRecoveryAgentAdminMessage(message, conversationHistory = []) {
  const lowerMessage = message.toLowerCase().trim();
  
  // Padrões específicos para admin interno
  if (lowerMessage.includes('global') || lowerMessage.includes('total') || lowerMessage.includes('todos')) {
    return {
      content: `📊 **Visão Global de Recuperação**\n\n**Métricas Consolidadas (847 merchants):**\n• GMV Total em Risco: R$ 4.2M\n• GMV Recuperado: R$ 2.3M\n• Taxa Global: 54.8%\n• Comunicações Enviadas: 125.430\n\n**Distribuição por Cenário:**\n• Saldo Insuficiente: R$ 1.4M em risco (62% recuperação)\n• PIX Pendente: R$ 0.8M (71% recuperação)\n• Abandono: R$ 1.5M (35% recuperação)\n\n**Potencial de Otimização:** R$ 320.000/mês com ajustes em 5 merchants críticos.`,
      actions: [
        { label: 'Ver merchants críticos', variant: 'default', onClick: () => {} },
        { label: 'Exportar relatório', variant: 'outline', onClick: () => {} }
      ]
    };
  }

  if (lowerMessage.includes('merchant') || lowerMessage.includes('crítico') || lowerMessage.includes('atenção')) {
    return {
      content: `⚠️ **Merchants que Precisam de Atenção**\n\n**Abaixo da média (< 45% recuperação):**\n\n1. **Auto Parts Hub** - 45% (meta: 55%)\n   • Problema: Configuração de retry desatualizada\n   • Ação: Atualizar regras de comunicação\n\n2. **Sports Center** - 38% (meta: 50%)\n   • Problema: Sem integração WhatsApp\n   • Ação: Ativar canal WhatsApp\n\n3. **Home Decor** - 41% (meta: 50%)\n   • Problema: Delay no envio de comunicações\n   • Ação: Reduzir tempo de trigger\n\n**Impacto estimado:** +R$ 180.000/mês se otimizados.`,
      actions: [
        { label: 'Contatar merchants', variant: 'default', onClick: () => {} },
        { label: 'Aplicar correções', variant: 'outline', onClick: () => {} }
      ]
    };
  }

  // Fallback para função padrão
  return processRecoveryAgentMessage(message, conversationHistory);
}