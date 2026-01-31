// Lógica de processamento de mensagens para o Converter Agent
// Simula respostas de LLM para otimização de checkout e conversão

import { 
  TrendingUp, 
  Target, 
  Zap, 
  Settings,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { createPageUrl } from '@/components/utils';

// Dados mock
const mockData = {
  currentConversion: '3.2%',
  potentialConversion: '3.8%',
  potentialLift: '+18.7%',
  abTests: [
    { name: 'Cor do Botão', status: 'running', winner: null, lift: '+5.2%' },
    { name: 'Ordem de Pagamento', status: 'completed', winner: 'PIX Primeiro', lift: '+8.1%' },
    { name: 'Campos Opcionais', status: 'draft', winner: null, lift: null }
  ],
  topRecommendations: [
    { action: 'PIX como método principal', impact: '+8% conversão' },
    { action: 'Reduzir campos obrigatórios', impact: '+5% conversão' },
    { action: 'Adicionar desconto PIX 5%', impact: '+12% conversão PIX' }
  ]
};

// Padrões de intenção
const intentPatterns = [
  // INICIAR TESTE A/B
  {
    patterns: ['teste a/b', 'ab test', 'iniciar teste', 'testar', 'experimento'],
    response: () => ({
      content: `🧪 **Criar Teste A/B**\n\nO que você gostaria de testar?\n\n**Opções populares:**\n1. **Cor do botão de compra** - Verde vs Azul vs Laranja\n2. **Ordem dos métodos de pagamento** - PIX primeiro vs Cartão primeiro\n3. **Layout do checkout** - Uma coluna vs Duas colunas\n4. **Campos do formulário** - Com/sem campos opcionais\n5. **Desconto PIX** - 5% vs 10% vs sem desconto\n\nVocê também pode descrever um teste personalizado, como:\n"Teste a cor do botão de compra: verde vs azul"`,
      actions: [
        { label: 'Cor do botão', variant: 'outline', onClick: () => {} },
        { label: 'Ordem de pagamento', variant: 'outline', onClick: () => {} },
        { label: 'Layout', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // COR DO BOTÃO
  {
    patterns: ['cor do botão', 'botão verde', 'botão azul', 'cor botao'],
    response: () => ({
      content: `🎨 **Teste A/B: Cor do Botão de Compra**\n\n**Configuração:**\n• Variante A: Verde (#2bc196) - Atual\n• Variante B: Azul (#3b82f6)\n• Duração: 7 dias ou 1.000 conversões\n• Métrica principal: Taxa de conversão\n\n**Previsão baseada em dados históricos:**\n• Verde: 3.2% conversão (baseline)\n• Azul: 3.4% conversão estimada (+6.25%)\n\n⚠️ O teste será iniciado imediatamente e dividirá o tráfego 50/50.\n\nConfirma a criação do teste?`,
      actions: [
        { label: 'Iniciar teste', variant: 'default', onClick: () => {} },
        { label: 'Adicionar variante', variant: 'outline', onClick: () => {} },
        { label: 'Ajustar config', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // ANÁLISE DE CONVERSÃO
  {
    patterns: ['conversão', 'taxa de conversão', 'por que caiu', 'análise', 'analisar'],
    response: () => ({
      content: `📊 **Análise de Conversão**\n\n**Performance Atual:**\n• Taxa de conversão: ${mockData.currentConversion}\n• Potencial identificado: ${mockData.potentialConversion}\n• Lift possível: ${mockData.potentialLift}\n\n**Principais Gargalos Identificados:**\n1. 🔴 35% abandono na seleção de pagamento\n2. 🟡 22% abandono no preenchimento de dados\n3. 🟢 8% abandono na confirmação\n\n**Recomendações:**\n${mockData.topRecommendations.map((r, i) => `${i + 1}. ${r.action} → ${r.impact}`).join('\n')}\n\nQuer que eu detalhe algum ponto específico?`,
      actions: [
        { label: 'Ver funil completo', variant: 'outline', onClick: () => {} },
        { label: 'Aplicar recomendações', variant: 'default', onClick: () => {} }
      ]
    })
  },

  // SIMULAR CHECKOUT
  {
    patterns: ['simular', 'simule', 'checkout com', 'como ficaria'],
    response: () => ({
      content: `🎯 **Simulação de Checkout**\n\nDescreva o cenário que quer simular ou escolha:\n\n**Cenários pré-configurados:**\n1. **Checkout Otimizado** - PIX primeiro, sem campos opcionais, desconto 5%\n2. **Checkout Premium** - Todos os métodos, campos completos, parcelamento em 12x\n3. **Checkout Express** - Apenas PIX e cartão, mínimo de campos\n\n**Ou descreva:**\n"Simule um checkout com PIX com 10% de desconto, parcelamento em até 6x, sem campo de telefone"\n\nO simulador mostrará o impacto estimado na conversão.`,
      actions: [
        { label: 'Checkout Otimizado', variant: 'outline', onClick: () => {} },
        { label: 'Checkout Express', variant: 'outline', onClick: () => {} },
        { label: 'Personalizar', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // REGRA DE PERSONALIZAÇÃO
  {
    patterns: ['regra', 'personalização', 'personalizar', 'segmento', 'cliente vip'],
    response: () => ({
      content: `⚙️ **Regras de Personalização**\n\n**Regras Ativas:**\n1. ✅ Frete grátis para pedidos > R$ 200\n2. ✅ Desconto 10% para clientes recorrentes\n3. ✅ PIX destacado para mobile\n\n**Criar Nova Regra:**\nDescreva a regra que deseja criar, por exemplo:\n• "Exibir frete grátis para clientes VIP"\n• "Mostrar parcelamento em 12x para tickets > R$ 500"\n• "Oferecer desconto de 5% para primeira compra"\n\nOu escolha um template:`,
      actions: [
        { label: 'Frete grátis', variant: 'outline', onClick: () => {} },
        { label: 'Desconto recorrente', variant: 'outline', onClick: () => {} },
        { label: 'Criar personalizada', variant: 'outline', onClick: () => {} }
      ]
    })
  },

  // STATUS DOS TESTES
  {
    patterns: ['status', 'testes ativos', 'resultados', 'como está'],
    response: () => ({
      content: `📈 **Status dos Testes A/B**\n\n${mockData.abTests.map(t => {
        const statusIcon = t.status === 'running' ? '🔄' : t.status === 'completed' ? '✅' : '📝';
        const statusLabel = t.status === 'running' ? 'Em execução' : t.status === 'completed' ? 'Concluído' : 'Rascunho';
        return `**${t.name}** ${statusIcon}\n• Status: ${statusLabel}\n• ${t.winner ? `Vencedor: ${t.winner}` : 'Aguardando dados'}\n• ${t.lift ? `Lift: ${t.lift}` : ''}\n`;
      }).join('\n')}\n\n💡 **Recomendação:** Aplicar o vencedor "PIX Primeiro" pode aumentar sua conversão em 8.1%.`,
      actions: [
        { label: 'Aplicar vencedor', variant: 'default', onClick: () => {} },
        { label: 'Ver detalhes', variant: 'outline', onClick: () => {} }
      ]
    })
  }
];

// Função principal
export function processConverterAgentMessage(message, conversationHistory = []) {
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
      content: `Olá! 👋 Sou o Converter Agent, especialista em otimização de checkout.\n\nPosso ajudar com:\n• Criar e gerenciar testes A/B\n• Analisar sua taxa de conversão\n• Simular diferentes configurações de checkout\n• Criar regras de personalização\n\nO que gostaria de otimizar hoje?`,
      actions: [
        { label: 'Criar teste A/B', variant: 'outline', onClick: () => {} },
        { label: 'Analisar conversão', variant: 'outline', onClick: () => {} }
      ]
    };
  }

  return {
    content: `Não entendi completamente. 🤔\n\nPosso ajudar com:\n• **Testes A/B** - "Crie um teste de cor do botão"\n• **Análise** - "Por que minha conversão caiu?"\n• **Simulação** - "Simule checkout com PIX 10% desconto"\n• **Personalização** - "Crie uma regra para clientes VIP"\n\nTente uma dessas opções!`,
    actions: [
      { label: 'Criar teste A/B', variant: 'outline', onClick: () => {} },
      { label: 'Analisar conversão', variant: 'outline', onClick: () => {} }
    ]
  };
}

export const converterAgentQuickPrompts = [
  { label: 'Criar teste A/B', text: 'Quero criar um teste A/B para otimizar meu checkout', icon: Target },
  { label: 'Analisar conversão', text: 'Analise minha taxa de conversão e sugira melhorias', icon: BarChart3 },
  { label: 'Simular checkout', text: 'Simule um checkout otimizado com PIX destacado', icon: Zap },
  { label: 'Ver testes ativos', text: 'Qual o status dos meus testes A/B?', icon: TrendingUp }
];

// Admin Interno
export function processConverterAgentAdminMessage(message, conversationHistory = []) {
  const lowerMessage = message.toLowerCase().trim();
  
  if (lowerMessage.includes('global') || lowerMessage.includes('consolidado') || lowerMessage.includes('todos')) {
    return {
      content: `📊 **Visão Global de Conversão**\n\n**Métricas Consolidadas (847 merchants):**\n• Taxa média de conversão: 3.4%\n• Melhor performer: 8.2% (TechStore)\n• Pior performer: 1.1% (AutoParts)\n\n**Testes A/B Ativos:** 127\n**Lift médio dos testes:** +6.8%\n\n**Oportunidades:**\n• 45 merchants sem testes ativos\n• 23 merchants com conversão < 2%\n• Potencial de GMV adicional: R$ 890k/mês\n\nQuer focar em algum segmento?`,
      actions: [
        { label: 'Merchants críticos', variant: 'default', onClick: () => {} },
        { label: 'Exportar análise', variant: 'outline', onClick: () => {} }
      ]
    };
  }

  return processConverterAgentMessage(message, conversationHistory);
}

export const converterAgentAdminQuickPrompts = [
  { label: 'Visão global', text: 'Qual a taxa de conversão consolidada de todos os merchants?', icon: BarChart3 },
  { label: 'Merchants críticos', text: 'Quais merchants têm conversão abaixo da média?', icon: TrendingUp },
  { label: 'Testes ativos', text: 'Quantos testes A/B estão rodando no momento?', icon: Target },
  { label: 'Oportunidades', text: 'Onde estão as maiores oportunidades de otimização?', icon: Sparkles }
];