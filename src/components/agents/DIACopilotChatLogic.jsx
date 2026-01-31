// Lógica de processamento de mensagens para o DIA Merchant Copilot
// Simula respostas de LLM para diferentes tipos de consultas

import { 
  TrendingUp, 
  RefreshCw, 
  AlertTriangle, 
  FileText, 
  Settings,
  CreditCard,
  DollarSign,
  BarChart3,
  Link2,
  Eye
} from 'lucide-react';
import { createPageUrl } from '@/components/utils';

// Dados mock para respostas
const mockData = {
  salesYesterday: {
    value: 'R$ 892.450,00',
    transactions: 1.342,
    approvalRate: '93.8%',
    change: '+8.2%'
  },
  salesToday: {
    value: 'R$ 547.320,00',
    transactions: 847,
    approvalRate: '94.2%',
    change: '+12.3%'
  },
  pixApprovalRate7Days: '97.4%',
  weekComparison: {
    lastWeek: 'R$ 4.235.000',
    previousWeek: 'R$ 3.890.000',
    growth: '+8.9%'
  },
  pendingRecovery: {
    count: 73,
    value: 'R$ 45.230',
    mainReason: 'saldo insuficiente'
  },
  chargebacks: {
    pending: 3,
    highWinProbability: 3,
    totalValue: 'R$ 12.450'
  },
  topRefusalReasons: [
    { reason: 'Saldo Insuficiente', count: 28, percentage: '38.4%' },
    { reason: 'Limite Excedido', count: 19, percentage: '26.0%' },
    { reason: 'Cartão Bloqueado', count: 14, percentage: '19.2%' }
  ]
};

// Padrões de intenção e respostas
const intentPatterns = [
  // CONSULTAS DE VENDAS
  {
    patterns: ['vendas de ontem', 'vendas ontem', 'faturamento ontem', 'quanto vendi ontem'],
    response: () => ({
      content: `📊 **Vendas de Ontem (30/01/2026)**\n\n• **Valor Total:** ${mockData.salesYesterday.value}\n• **Transações:** ${mockData.salesYesterday.transactions.toLocaleString()}\n• **Taxa de Aprovação:** ${mockData.salesYesterday.approvalRate}\n• **Variação vs dia anterior:** ${mockData.salesYesterday.change}\n\nSeu desempenho ontem foi acima da média! Quer que eu detalhe por método de pagamento ou horário?`,
      actions: [
        { label: 'Por método', variant: 'outline', onClick: () => {} },
        { label: 'Por horário', variant: 'outline', onClick: () => {} }
      ]
    })
  },
  {
    patterns: ['vendas de hoje', 'vendas hoje', 'faturamento hoje', 'quanto vendi hoje'],
    response: () => ({
      content: `📊 **Vendas de Hoje (31/01/2026)**\n\n• **Valor Total:** ${mockData.salesToday.value}\n• **Transações:** ${mockData.salesToday.transactions.toLocaleString()}\n• **Taxa de Aprovação:** ${mockData.salesToday.approvalRate}\n• **Variação vs ontem:** ${mockData.salesToday.change}\n\nVocê está no caminho certo! Projeção para o fim do dia: R$ 920.000,00.`,
      actions: [
        { label: 'Ver detalhes', variant: 'outline', onClick: () => window.location.href = createPageUrl('Transactions') }
      ]
    })
  },

  // TAXA DE APROVAÇÃO PIX
  {
    patterns: ['taxa de aprovação', 'aprovação pix', 'pix últimos', 'aprovação dos pagamentos'],
    response: () => ({
      content: `✅ **Taxa de Aprovação PIX (Últimos 7 dias)**\n\n• **Taxa Atual:** ${mockData.pixApprovalRate7Days}\n• **Média do mercado:** 95.2%\n• **Sua posição:** Acima da média ✨\n\nSua taxa de aprovação PIX está excelente! Isso representa uma melhoria de +1.2% em relação à semana anterior.\n\n💡 **Dica:** PIX tem a maior taxa de aprovação entre seus métodos. Considere destacá-lo no checkout.`,
      actions: [
        { label: 'Otimizar Checkout', variant: 'outline', onClick: () => window.location.href = createPageUrl('ConverterAgent') }
      ]
    })
  },

  // COMPARATIVO SEMANAL
  {
    patterns: ['compare', 'comparação', 'semana passada', 'semana anterior', 'comparativo'],
    response: () => ({
      content: `📈 **Comparativo Semanal de Vendas**\n\n**Esta Semana:**\n• GMV: ${mockData.weekComparison.lastWeek}\n• Transações: 6.234\n• Aprovação: 94.2%\n\n**Semana Anterior:**\n• GMV: ${mockData.weekComparison.previousWeek}\n• Transações: 5.890\n• Aprovação: 92.8%\n\n**Crescimento:** ${mockData.weekComparison.growth} 🚀\n\nParabéns! Você está crescendo consistentemente. Quer que eu identifique os fatores de sucesso?`,
      actions: [
        { label: 'Analisar fatores', variant: 'outline', onClick: () => {} },
        { label: 'Ver relatório completo', variant: 'outline', onClick: () => window.location.href = createPageUrl('Reports') }
      ]
    })
  },

  // TRANSAÇÕES RECUSADAS
  {
    patterns: ['recusadas', 'recusas', 'negadas', 'não aprovadas', 'por que tantas'],
    response: () => ({
      content: `⚠️ **Análise de Transações Recusadas**\n\nHoje tivemos **73 transações recusadas**. Principais motivos:\n\n1. **${mockData.topRefusalReasons[0].reason}** - ${mockData.topRefusalReasons[0].count} (${mockData.topRefusalReasons[0].percentage})\n2. **${mockData.topRefusalReasons[1].reason}** - ${mockData.topRefusalReasons[1].count} (${mockData.topRefusalReasons[1].percentage})\n3. **${mockData.topRefusalReasons[2].reason}** - ${mockData.topRefusalReasons[2].count} (${mockData.topRefusalReasons[2].percentage})\n\n💡 **Recomendação:** ${mockData.pendingRecovery.count} dessas transações podem ser recuperadas com retry inteligente, totalizando ${mockData.pendingRecovery.value} em potencial.`,
      actions: [
        { label: 'Ativar Recovery', variant: 'default', onClick: () => window.location.href = createPageUrl('RecoveryAgent') },
        { label: 'Ver análise completa', variant: 'outline', onClick: () => window.location.href = createPageUrl('DeclineAnalysis') }
      ]
    })
  },

  // RECUPERAÇÃO DE VENDAS
  {
    patterns: ['recuperar', 'recovery', 'vendas perdidas', 'retry', 'retentativa'],
    response: () => ({
      content: `♻️ **Oportunidade de Recuperação**\n\nIdentifiquei **${mockData.pendingRecovery.count} transações** que podem ser recuperadas:\n\n• **Valor total:** ${mockData.pendingRecovery.value}\n• **Principal motivo:** ${mockData.pendingRecovery.mainReason}\n• **Taxa estimada de sucesso:** 45-60%\n\nO Recovery Agent pode enviar comunicações personalizadas via WhatsApp, SMS e E-mail para recuperar essas vendas.\n\n🎯 **Impacto estimado:** +R$ 20.000 a R$ 27.000`,
      actions: [
        { label: 'Ativar Recovery Agent', variant: 'default', onClick: () => window.location.href = createPageUrl('RecoveryAgent') },
        { label: 'Ver configurações', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // CHARGEBACKS / DISPUTAS
  {
    patterns: ['chargeback', 'disputa', 'contestação', 'contestar'],
    response: () => ({
      content: `⚖️ **Status de Chargebacks**\n\nVocê tem **${mockData.chargebacks.pending} chargebacks pendentes** com alto potencial de vitória (>85%):\n\n• **Valor total em disputa:** ${mockData.chargebacks.totalValue}\n• **Prazo médio:** 5 dias\n\nO Dispute Manager pode preparar automaticamente as evidências e narrativas de contestação.\n\n💡 Recomendo priorizar a contestação dessas disputas para maximizar suas chances.`,
      actions: [
        { label: 'Abrir Dispute Manager', variant: 'default', onClick: () => window.location.href = createPageUrl('DisputeManager') },
        { label: 'Ver detalhes', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // AJUSTE DE LIMITE
  {
    patterns: ['ajuste', 'limite', 'aumentar limite', 'limite pix', 'limite transação'],
    response: () => ({
      content: `⚙️ **Solicitação de Ajuste de Limite**\n\nEntendido! Para ajustar seu limite de transação, preciso de algumas informações:\n\n• **Seu limite atual PIX:** R$ 15.000/transação\n• **Seu limite atual Cartão:** R$ 10.000/transação\n\nQual limite você gostaria de ajustar e para qual valor?\n\n⚠️ *Ajustes de limite passam por análise de risco e podem levar até 24h para aprovação.*`,
      actions: [
        { label: 'Ajustar PIX', variant: 'outline', onClick: () => {} },
        { label: 'Ajustar Cartão', variant: 'outline', onClick: () => {} },
        { label: 'Ver configurações', variant: 'outline', onClick: () => window.location.href = createPageUrl('SettingsPage') }
      ]
    })
  },

  // CRIAR LINK DE PAGAMENTO
  {
    patterns: ['criar link', 'link de pagamento', 'gerar link', 'novo link'],
    response: () => ({
      content: `🔗 **Criar Link de Pagamento**\n\nPerfeito! Vou te ajudar a criar um link de pagamento.\n\nPor favor, me informe:\n1. **Nome do produto/serviço**\n2. **Valor** (ou deixe em aberto)\n3. **Descrição** (opcional)\n\nOu, se preferir, posso te levar diretamente para o criador de links com todas as opções.`,
      actions: [
        { label: 'Criar Link Agora', variant: 'default', onClick: () => window.location.href = createPageUrl('PaymentLinkCreate') },
        { label: 'Ver meus links', variant: 'outline', onClick: () => window.location.href = createPageUrl('PaymentLinks') }
      ]
    })
  },

  // OTIMIZAÇÃO DE CHECKOUT
  {
    patterns: ['otimizar', 'checkout', 'conversão', 'melhorar conversão', 'converter mais'],
    response: () => ({
      content: `🎯 **Otimização de Checkout**\n\nAnalisei seu checkout e identifiquei oportunidades:\n\n**Potencial de melhoria:** +8% na taxa de conversão\n\n**Sugestões:**\n1. ✅ PIX como método principal (maior aprovação)\n2. ✅ Reduzir campos obrigatórios\n3. ✅ Adicionar desconto para PIX (5%)\n4. ✅ Exibir selos de segurança\n\nO Converter Agent pode simular diferentes configurações e mostrar o impacto esperado.`,
      actions: [
        { label: 'Abrir Converter Agent', variant: 'default', onClick: () => window.location.href = createPageUrl('ConverterAgent') },
        { label: 'Ver A/B Tests', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // RELATÓRIO
  {
    patterns: ['relatório', 'report', 'exportar', 'gerar relatório'],
    response: () => ({
      content: `📋 **Geração de Relatório**\n\nQual tipo de relatório você precisa?\n\n• **Vendas** - GMV, transações, métodos de pagamento\n• **Financeiro** - Receitas, taxas, liquidações\n• **Performance** - Aprovação, recusas, conversão\n• **Disputas** - Chargebacks, contestações\n\nPosso gerar em PDF ou Excel e enviar para seu e-mail.`,
      actions: [
        { label: 'Relatório de Vendas', variant: 'outline', onClick: () => {} },
        { label: 'Relatório Financeiro', variant: 'outline', onClick: () => {} },
        { label: 'Ver todos', variant: 'outline', onClick: () => window.location.href = createPageUrl('Reports') }
      ]
    })
  },

  // HORÁRIO DE PICO
  {
    patterns: ['horário', 'pico', 'melhor horário', 'quando mais vendo'],
    response: () => ({
      content: `⏰ **Análise de Horário de Pico**\n\nBaseado nos últimos 30 dias:\n\n**Melhores horários:**\n• 🥇 19h - 22h: +34% vendas\n• 🥈 12h - 14h: +18% vendas\n• 🥉 09h - 11h: +12% vendas\n\n**Dia da semana com mais vendas:** Sexta-feira\n\n💡 **Recomendação:** Concentre campanhas e promoções entre 19h-22h para maximizar conversões.`,
      actions: [
        { label: 'Ver análise completa', variant: 'outline', onClick: () => window.location.href = createPageUrl('Reports') }
      ]
    })
  }
];

// Função principal de processamento
export function processDIACopilotMessage(message, conversationHistory = []) {
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
  if (lowerMessage.match(/^(oi|olá|ola|hey|bom dia|boa tarde|boa noite|e aí|eae)/)) {
    return {
      content: `Olá! 👋 Sou o DIA Copilot, seu assistente inteligente para gestão de pagamentos.\n\nComo posso ajudar você hoje?\n\n**Algumas coisas que posso fazer:**\n• Mostrar suas vendas e métricas\n• Analisar transações recusadas\n• Identificar oportunidades de recuperação\n• Ajudar com disputas e chargebacks\n• Otimizar seu checkout\n• Gerar relatórios`,
      actions: [
        { label: 'Vendas de hoje', variant: 'outline', onClick: () => {} },
        { label: 'Oportunidades', variant: 'outline', onClick: () => {} }
      ]
    };
  }

  // Agradecimentos
  if (lowerMessage.match(/^(obrigado|valeu|thanks|brigado|vlw)/)) {
    return {
      content: `De nada! 😊 Estou aqui para ajudar. Se precisar de mais alguma coisa, é só chamar!`
    };
  }

  // Resposta padrão para mensagens não reconhecidas
  return {
    content: `Desculpe, não entendi completamente sua solicitação. 🤔\n\nPosso te ajudar com:\n• **Vendas e métricas** - "Me mostre as vendas de hoje"\n• **Análise de recusas** - "Por que tive tantas recusas?"\n• **Recuperação** - "Quanto posso recuperar?"\n• **Disputas** - "Status dos chargebacks"\n• **Checkout** - "Como otimizar minha conversão?"\n\nTente reformular sua pergunta ou escolha uma opção acima.`,
    actions: [
      { label: 'Vendas de hoje', variant: 'outline', onClick: () => {} },
      { label: 'Análise de recusas', variant: 'outline', onClick: () => {} },
      { label: 'Oportunidades', variant: 'outline', onClick: () => {} }
    ]
  };
}

// Quick prompts para o DIA Copilot
export const diaCopilotQuickPrompts = [
  { label: 'Vendas de hoje', text: 'Me mostre as vendas de hoje', icon: DollarSign },
  { label: 'Taxa de aprovação', text: 'Qual a taxa de aprovação dos pagamentos por PIX nos últimos 7 dias?', icon: TrendingUp },
  { label: 'Recusas', text: 'Me dê uma visão geral das transações recusadas', icon: AlertTriangle },
  { label: 'Oportunidades', text: 'Quanto posso recuperar em vendas perdidas?', icon: RefreshCw }
];

// Notificações proativas mock
export const diaCopilotProactiveNotifications = [
  {
    id: 1,
    title: 'Oportunidade de Recuperação',
    description: '10 clientes abandonaram o checkout nas últimas 2 horas. R$ 8.450 em potencial.',
    actionLabel: 'Recuperar agora',
    agentName: 'DIA Copilot'
  },
  {
    id: 2,
    title: 'Alerta de Chargeback',
    description: 'Novo chargeback recebido. Alta probabilidade de vitória se contestado.',
    actionLabel: 'Ver disputa',
    agentName: 'DIA Copilot'
  },
  {
    id: 3,
    title: 'Meta Atingida! 🎉',
    description: 'Você atingiu 100% da sua meta diária de vendas.',
    actionLabel: 'Ver detalhes',
    agentName: 'DIA Copilot'
  }
];