// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /RecoveryAgent
// Fidelidade absoluta a pages/RecoveryAgent.jsx (795 linhas).
// ============================================================================

export const RecoveryAgentDoc = {
  pageId: 'RecoveryAgent',
  pagePath: '/RecoveryAgent',
  module: 'Agentes IA',
  parentPage: null,

  explainer: {
    oneLiner:
      'Agente IA recuperador de pagamentos em tempo real — Header com gradient laranja-vermelho + status "Modo simulação/Monitorando", 6 KPIs (GMV em Risco/Recuperado/Taxa Recovery/Tempo Resposta/Perdas Evitáveis/Comunicações), 4 Tabs (Simulador Interativo/Cenários/Comunicações/Métricas), Simulador completo com 5 cenários (NSF/Limite/PIX Pendente/Abandono/Timeout) e checkout preview animado, Live Feed em tempo real (intervalo 2.5s), Natural Language Scenario Input, performance por canal e mensagens-exemplo.',

    fiveScenarios: {
      nsf: { name: 'Saldo Insuficiente', icon: 'WalletCards amber', impact: '35%', recovery: '62%', primary: 'Oferecer PIX 5% desconto' },
      limit: { name: 'Limite Excedido', icon: 'AlertTriangle red', impact: '25%', recovery: '48%', primary: 'Dividir em 2 cartões' },
      pix_pending: { name: 'PIX Não Finalizado', icon: 'QrCode blue', impact: '20%', recovery: '71%', primary: 'Lembrete WhatsApp' },
      abandon: { name: 'Abandono Checkout', icon: 'XCircle slate', impact: '40%', recovery: '35%', primary: 'Email recuperação' },
      timeout: { name: 'Erro Técnico/Timeout', icon: 'RotateCcw purple', impact: '10%', recovery: '85%', primary: 'Retry automático' },
    },

    sixKPIs: {
      gmvAtRisk: 'R$ 127.450 (amber bg)',
      gmvRecovered: 'R$ 68.230 (green bg)',
      recoveryRate: '53.5%',
      avgResponseTime: '0.8s',
      avoidableLosses: 'R$ 32.180 (red bg)',
      communicationsSent: '4.250',
    },

    fourSimulationSteps: {
      step1: 'Detectar (800ms)',
      step2: 'Analisar (1000ms)',
      step3: 'Selecionar (800ms)',
      step4: 'Executar (1200ms)',
      successFormula: 'Math.random() < parseFloat(scenario.recoveryRate) / 100',
    },

    threeActionTypesPerScenario: {
      primary: 'Verde #2bc196 — ação principal recomendada',
      secondary: 'Azul — alternativa',
      fallback: 'Cinza — última opção',
    },

    fourCommunicationChannels: {
      whatsapp: { sent: 1250, converted: 438, rate: '35%' },
      email: { sent: 2100, converted: 420, rate: '20%' },
      sms: { sent: 850, converted: 170, rate: '20%' },
      push: { sent: 950, converted: 143, rate: '15%' },
    },

    threeMessageExamples: {
      whatsappNSF: '"Oi João! 👋 Vi que houve um probleminha... Que tal PIX com 5% desconto? 💚" (verde)',
      emailAbandon: '"Seus itens ainda estão no carrinho! Complete em 30min e ganhe frete grátis." (azul)',
      smsPixPending: '"Seu PIX expira em 10min! [link]. Responda AJUDA para suporte." (amber)',
    },
  },

  technical: {
    fileLocation: 'pages/RecoveryAgent.jsx',
    totalLines: 795,

    imports: {
      react: ['useState', 'useEffect'],
      uiComponents: ['Card stack', 'Button', 'Badge', 'Tabs stack', 'Progress', 'Switch', 'Label', 'Slider (sem uso)', 'Select (sem uso)', 'Textarea'],
      navigation: ['Link', 'createPageUrl'],
      lucideIcons: 'RefreshCw, DollarSign (sem uso), TrendingUp (sem uso), AlertTriangle, CheckCircle2, XCircle, ArrowRight, CreditCard, QrCode, Smartphone (sem uso), Mail, MessageSquare, Bell, Clock, Zap, Play, Settings, Target, BarChart3 (sem uso), Sparkles, Phone, Send, ChevronRight (sem uso), Loader2, WalletCards, Split, RotateCcw, Percent (sem uso)',
      sharedComponents: ['AgentChatInterface', 'AgentFloatingButton'],
      agentLogic: 'RecoveryAgentChatLogic — processRecoveryAgentMessage, recoveryAgentQuickPrompts',
      recharts: 'BarChart, Bar, XAxis, YAxis, RechartsTooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart (sem uso), Pie, Cell',
    },

    componentState: {
      selectedScenario: { initial: 'null' },
      isSimulating: { initial: 'false' },
      simulationStep: { initial: '0', purpose: '0-4 incrementado a cada delay' },
      recoveryResult: { initial: 'null', purpose: '"recovered" | "failed"' },
      liveMode: { initial: 'false', purpose: 'Switch ativa live feed' },
      liveFeed: { initial: '[]', purpose: 'Array max 8 eventos' },
      isChatOpen: { initial: 'false' },
      isFullscreen: { initial: 'false' },
      nlScenarioInput: { initial: "''", purpose: 'Textarea NL' },
    },

    backendIntegration: 'NENHUMA query — TODOS os dados HARDCODED',

    helperFunctions: {
      runSimulation: {
        steps: '4 steps com delays diferentes (800/1000/800/1200ms)',
        successDetermination: 'Math.random() < parseFloat(recoveryRate) / 100',
      },
      getColorClass: 'hash {amber, red, blue, slate, purple} default slate',
    },

    liveFeedEffect: {
      useEffect: 'if liveMode setInterval 2500ms → push random event from 5 mocks → slice(0, 8)',
      eventStructure: '{ ...event, id: Date.now(), time: toLocaleTimeString }',
    },

    layout: {
      header: {
        leftSide: 'iconBox 14x14 gradient orange-500→red-500 + RefreshCw 7x7 white + "Recovery Agent"',
        rightSide: 'statusPill liveMode? green pulsante : cinza + Button outline Settings + "Configurar"',
      },

      kpiGrid: 'grid 2/3/6 cols gap-4 — 6 cards com 3 destacados (amber/green/red bg)',

      tabsContainer: {
        defaultValue: 'simulator',
        tabsList: 'grid w-full grid-cols-4',
      },

      tabSimulator: {
        nlScenarioInputCard: 'border-orange-500/20 + gradient + Sparkles + Textarea + Button bg-orange-500 "Analisar com IA" → alert mock',
        simulatorGrid: 'grid 1/3 cols — left col1 lista 5 cenários (button selectable), right col2 display da simulação',
        simulationDisplay: {
          ifNoScenario: 'h-80 center + RefreshCw 16x16 + "Selecione um cenário..."',
          ifSelected: {
            progressSteps: '4 dots numbered + linha conectora — completed=green, current=orange pulse, pending=slate',
            checkoutPreview: 'border-2 dashed + max-w-sm card animate-pulse durante simulação + scenario.icon 12x12 + checkoutAction.title/message + 2 buttons (primaryButton/secondaryButton)',
            resultBlock: 'recovered=border-green-300 bg-green-50 + CheckCircle2 OR failed=border-red-300 bg-red-50 + XCircle',
            actionsList: 'grid 3 cols — primary/secondary/fallback adaptive borders',
          },
        },
        liveFeedCard: 'header bolinha verde/cinza + Switch "Ativar" + lista max-h-48 + cada evento adaptive (recovered green / pending amber)',
      },

      tabScenarios: {
        chartCard: 'BarChart 2 bars: impacto (slate) + recuperacao (#2bc196)',
        scenariosGrid: 'grid 1/2/3 cols — cada card: icon + name + description + Impacto + Taxa Badge green + Progress + Button "Simular Cenário"',
      },

      tabCommunications: {
        twoCols: {
          channelChart: 'BarChart 2 bars: sent (slate) + converted (#2bc196)',
          messageExamples: '3 cards bg-color-50 (green/blue/amber) + icon + tipo header + texto exemplo',
        },
      },

      tabMetrics: {
        evolutionChart: 'LineChart 2 linhas — atRisk (slate strokeWidth=2) + recovered (#2bc196 strokeWidth=3)',
      },

      chatComponents: {
        agentChatInterface: 'agentName="recovery_agent" + accentColor="#f97316" (orange)',
        agentFloatingButton: 'accentColor="#f97316"',
      },
    },

    knownGaps: [
      'TODOS os dados são MOCK — sem queries backend',
      'Slider, Select, DollarSign, TrendingUp, Smartphone, BarChart3, ChevronRight, Percent, PieChart importados sem uso',
      'Botão "Configurar" do header SEM onClick',
      'Natural Language input usa native alert() — UX ruim',
      'runSimulation usa Math.random — não determinístico',
      'Live feed eventos podem repetir consecutivamente (sem dedup)',
      'AgentProactiveNotification NÃO importado (diferente do DIA)',
      'Sem persistência das simulações + sem histórico',
      'Sem integração com /Transactions reais para identificar candidates',
      'kpi.communicationsSent.toLocaleString() falha se for string',
    ],

    relationshipsToOtherPages: {
      diaCopilot: '/DIACopilot — DIA aponta para Recovery em uma das oportunidades',
      converterAgent: '/ConverterAgent — agente irmão',
      disputeManager: '/DisputeManager — agente irmão',
      transactions: '/Transactions — fonte real (não usado)',
      declineAnalysis: '/DeclineAnalysis — fonte de motivos real',
      adminIntRecoveryAgent: '/AdminIntRecoveryAgent + /AdminIntRecoveryAgentSettings — visão admin interno',
    },
  },
};

export default RecoveryAgentDoc;