// Lógica de processamento de mensagens para o PagSmile Copilot Interno
// Simula respostas de LLM para operações internas

import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  FileText,
  Users,
  DollarSign,
  Settings,
  Sparkles
} from 'lucide-react';
import { createPageUrl } from '@/components/utils';

// Dados mock
const mockData = {
  tpv: {
    current: 'R$ 47.3M',
    growth: '+12.4%',
    projection: 'R$ 52.1M'
  },
  merchants: {
    total: 847,
    active: 792,
    churnRisk: 32,
    newThisMonth: 45
  },
  revenue: {
    current: 'R$ 2.8M',
    growth: '+8.7%',
    mdrAvg: '2.4%'
  },
  alerts: [
    { type: 'risk', message: '5 merchants com chargeback ratio > 2%', priority: 'high' },
    { type: 'opportunity', message: '12 merchants elegíveis para upsell de antecipação', priority: 'medium' },
    { type: 'compliance', message: '3 merchants com documentação vencendo em 30 dias', priority: 'medium' }
  ],
  topMerchants: [
    { name: 'TechStore Brasil', tpv: 'R$ 4.2M', growth: '+15%' },
    { name: 'Fashion Express', tpv: 'R$ 3.8M', growth: '+12%' },
    { name: 'GameZone Digital', tpv: 'R$ 3.1M', growth: '+8%' }
  ]
};

// Padrões de intenção
const intentPatterns = [
  // TPV / VOLUME
  {
    patterns: ['tpv', 'volume', 'processado', 'transacionado'],
    response: () => ({
      content: `📊 **Análise de TPV**\n\n**TPV Atual (Mês):** ${mockData.tpv.current}\n**Crescimento:** ${mockData.tpv.growth} vs mês anterior\n**Projeção fim do mês:** ${mockData.tpv.projection}\n\n**Distribuição por Método:**\n• PIX: 45% (R$ 21.3M)\n• Cartão de Crédito: 42% (R$ 19.9M)\n• Cartão de Débito: 10% (R$ 4.7M)\n• Boleto: 3% (R$ 1.4M)\n\n**Top 3 Merchants (contribuição):**\n${mockData.topMerchants.map((m, i) => `${i + 1}. ${m.name}: ${m.tpv} (${m.growth})`).join('\n')}\n\nQuer ver a evolução diária ou semanal?`,
      actions: [
        { label: 'Evolução diária', variant: 'outline', onClick: () => {} },
        { label: 'Por merchant', variant: 'outline', onClick: () => {} },
        { label: 'Exportar', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // MERCHANTS
  {
    patterns: ['merchant', 'cliente', 'quantos', 'base'],
    response: () => ({
      content: `👥 **Visão da Base de Merchants**\n\n**Números Atuais:**\n• Total cadastrados: ${mockData.merchants.total}\n• Ativos (transacionando): ${mockData.merchants.active}\n• Novos este mês: ${mockData.merchants.newThisMonth}\n\n**⚠️ Atenção:**\n• Em risco de churn: ${mockData.merchants.churnRisk}\n• Contribuição de churn risk: R$ 1.2M TPV\n\n**Segmentação:**\n• Enterprise (> R$ 1M/mês): 23 merchants\n• Mid-market (R$ 100k-1M): 156 merchants\n• SMB (< R$ 100k): 668 merchants\n\nQuer analisar os merchants em risco de churn?`,
      actions: [
        { label: 'Ver risco de churn', variant: 'default', onClick: () => {} },
        { label: 'Novos merchants', variant: 'outline', onClick: () => {} },
        { label: 'Por segmento', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // CHURN / RISCO
  {
    patterns: ['churn', 'risco', 'perder', 'saindo'],
    response: () => ({
      content: `⚠️ **Análise de Risco de Churn**\n\n**Merchants em Risco:** ${mockData.merchants.churnRisk}\n**TPV em Risco:** R$ 1.2M/mês\n\n**Principais Indicadores de Risco:**\n1. Queda de volume > 30% (12 merchants)\n2. Aumento de recusas (8 merchants)\n3. Tickets de suporte não resolvidos (7 merchants)\n4. Sem transações há 15+ dias (5 merchants)\n\n**Top 5 em Risco:**\n1. AutoParts Hub - R$ 320k/mês - Queda de 45%\n2. Sports Center - R$ 280k/mês - Muitas recusas\n3. Home Decor - R$ 210k/mês - Sem transações há 20 dias\n\n**Recomendação:** Contato proativo com os 10 maiores pode reter R$ 890k/mês.`,
      actions: [
        { label: 'Gerar lista de contato', variant: 'default', onClick: () => {} },
        { label: 'Ver detalhes', variant: 'outline', onClick: () => {} },
        { label: 'Exportar', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // RECEITA
  {
    patterns: ['receita', 'faturamento', 'revenue', 'mdr'],
    response: () => ({
      content: `💰 **Análise de Receita**\n\n**Receita Atual (Mês):** ${mockData.revenue.current}\n**Crescimento:** ${mockData.revenue.growth} vs mês anterior\n**MDR Médio:** ${mockData.revenue.mdrAvg}\n\n**Composição da Receita:**\n• MDR Cartão: R$ 1.9M (68%)\n• MDR PIX: R$ 0.5M (18%)\n• Antecipação: R$ 0.3M (11%)\n• Outros: R$ 0.1M (3%)\n\n**Oportunidades:**\n• 45 merchants sem antecipação (potencial R$ 120k/mês)\n• 23 merchants com MDR abaixo da média (renegociar)\n\nQuer ver a análise de lucratividade por merchant?`,
      actions: [
        { label: 'Por merchant', variant: 'outline', onClick: () => {} },
        { label: 'Oportunidades', variant: 'default', onClick: () => {} },
        { label: 'Projeção', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // RELATÓRIO
  {
    patterns: ['relatório', 'report', 'gerar', 'exportar'],
    response: () => ({
      content: `📋 **Geração de Relatório**\n\nQual relatório você precisa?\n\n**Relatórios Disponíveis:**\n1. **Executivo Mensal** - TPV, receita, merchants, KPIs\n2. **Análise de Churn** - Merchants em risco, tendências\n3. **Performance Operacional** - Aprovação, recusas, uptime\n4. **Financeiro Detalhado** - Receita por linha, custos\n5. **Compliance** - Status KYC, documentação\n\n**Formatos:** PDF, Excel, Dashboard interativo\n\nQual relatório devo gerar?`,
      actions: [
        { label: 'Executivo Mensal', variant: 'outline', onClick: () => {} },
        { label: 'Análise de Churn', variant: 'outline', onClick: () => {} },
        { label: 'Financeiro', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // ALERTAS
  {
    patterns: ['alerta', 'atenção', 'urgente', 'problema'],
    response: () => ({
      content: `🚨 **Alertas Ativos**\n\n${mockData.alerts.map((a, i) => {
        const icon = a.type === 'risk' ? '🔴' : a.type === 'opportunity' ? '🟢' : '🟡';
        const priority = a.priority === 'high' ? 'URGENTE' : 'Médio';
        return `${icon} **[${priority}]** ${a.message}`;
      }).join('\n\n')}\n\n**Ações Recomendadas:**\n1. Revisar merchants com alto chargeback ratio\n2. Contatar merchants para upsell de antecipação\n3. Notificar sobre documentação a vencer\n\nQuer que eu detalhe algum alerta?`,
      actions: [
        { label: 'Ver merchants risco', variant: 'default', onClick: () => {} },
        { label: 'Oportunidades upsell', variant: 'outline', onClick: () => {} },
        { label: 'Compliance', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // CONFIGURAÇÃO
  {
    patterns: ['configurar', 'configuração', 'ajustar', 'preferência'],
    response: () => ({
      content: `⚙️ **Configurações do PagSmile Copilot**\n\n**Alertas:**\n• ✅ Alertas de risco de churn ativos\n• ✅ Alertas de compliance ativos\n• ⏸️ Alertas de oportunidade (pausado)\n\n**Relatórios Automáticos:**\n• Executivo semanal: Toda segunda às 9h\n• Financeiro mensal: Dia 1 às 8h\n\n**Notificações:**\n• Email: ativo\n• Slack: configurado (#ops-alerts)\n\nO que gostaria de ajustar?`,
      actions: [
        { label: 'Alertas', variant: 'outline', onClick: () => {} },
        { label: 'Relatórios', variant: 'outline', onClick: () => {} },
        { label: 'Notificações', variant: 'outline', onClick: () => {} }
      ]
    })
  }
];

// Função principal
export function processPagSmileCopilotMessage(message, conversationHistory = []) {
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
      content: `Olá! 👋 Sou o PagSmile Copilot, seu assistente para operações internas.\n\nPosso ajudar com:\n• Análise de TPV e métricas de negócio\n• Visão da base de merchants\n• Identificar riscos e oportunidades\n• Gerar relatórios\n• Monitorar alertas\n\nO que você gostaria de saber?`,
      actions: [
        { label: 'TPV atual', variant: 'outline', onClick: () => {} },
        { label: 'Alertas', variant: 'outline', onClick: () => {} }
      ]
    };
  }

  return {
    content: `Não entendi completamente. 🤔\n\nPosso ajudar com:\n• **TPV** - "Qual o TPV atual?"\n• **Merchants** - "Quantos merchants ativos temos?"\n• **Churn** - "Quais merchants estão em risco?"\n• **Receita** - "Como está nossa receita?"\n• **Relatórios** - "Gere um relatório executivo"\n• **Alertas** - "Quais alertas estão ativos?"\n\nTente uma dessas opções!`,
    actions: [
      { label: 'TPV atual', variant: 'outline', onClick: () => {} },
      { label: 'Ver alertas', variant: 'outline', onClick: () => {} }
    ]
  };
}

export const pagSmileCopilotQuickPrompts = [
  { label: 'TPV atual', text: 'Qual o TPV atual e como está a evolução?', icon: BarChart3 },
  { label: 'Merchants', text: 'Quantos merchants ativos temos e quantos estão em risco de churn?', icon: Users },
  { label: 'Receita', text: 'Como está nossa receita e quais as oportunidades?', icon: DollarSign },
  { label: 'Alertas', text: 'Quais alertas precisam de atenção?', icon: AlertTriangle }
];