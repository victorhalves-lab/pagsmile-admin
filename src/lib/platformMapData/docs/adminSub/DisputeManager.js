// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /DisputeManager
// ============================================================================
// Arquivo dedicado, fidelidade absoluta a pages/DisputeManager.jsx (570 linhas).
// Cada KPI, cada tab, cada coluna, cada modal de detalhe, cada cor de win prob,
// cada checkbox de evidência, cada estado do AgentChatInterface — documentado.
// ============================================================================

export const DisputeManagerDoc = {
  pageId: 'DisputeManager',
  pagePath: '/DisputeManager',
  module: 'Disputas',
  parentPage: 'DisputeDashboard',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Cockpit do AGENTE IA "Dispute Manager" — visão unificada de chargebacks E pré-chargebacks com análises automáticas (probabilidade de ganho, recomendação contest/accept, justificativa) e chat conversacional para queries operacionais sobre disputas.',

    whatIsTheAgent: {
      definition:
        'Agente IA especializado em DISPUTAS que analisa cada caso considerando reason code, valor, bandeira, evidências disponíveis (3DS/AVS/entrega/antifraude) e histórico do cliente para emitir 2 outputs: probabilidade de ganho (0-100%) e recomendação binária (contestar ou aceitar perda) com justificativa textual.',
      differentiation:
        'Diferente do /Chargebacks (lista pura) ou /DisputeContestation (wizard), esta página é o HUB DA IA — mostra a análise da máquina E permite acionar ações em massa via chat ou botões "Contestar Todas".',
    },

    fourTabsLogic: {
      all: 'Todas as disputas (chargeback E pre_chargeback) sem filtros',
      pending: 'Status pending OU in_analysis — aguardando ação',
      high_probability: 'aiWinProbability >= 70 — onde a IA tem alta confiança',
      urgent: 'daysRemaining <= 3 E status NOT IN (won, lost) — prazo crítico',
    },

    aiInsightsBanner: {
      what: 'Card destaque com gradient verde-marca + Brain icon + agregado: "X disputas com alta probabilidade de ganho (≥85%) aguardando ação. Valor total: Y. Recomendação: contestar imediatamente."',
      action: 'Botão "Contestar Todas" (gap: sem implementação real)',
    },

    coreCapabilities: [
      'Header com gradient red-orange-500 + Gavel icon — visual distintivo do agente',
      '6 KPIs: Total Disputas | Valor Total | Win Rate (verde) | Tempo Médio | Recuperação (marca verde) | Urgentes (amber)',
      'AI Insights Banner com agregado de oportunidades',
      'Tabela 10 colunas com Probabilidade de Ganho VISUAL (Progress 1.5px h) + cor por threshold',
      'Modal de detalhes com 4 evidências em grid colorido (green/red por presença)',
      'AgentChatInterface flutuante para conversas (vermelho #ef4444 como accent)',
      'AgentFloatingButton fixo para abrir/fechar chat',
    ],

    chatIntegration: {
      welcomeMessage:
        '"Olá! 👋 Sou o Dispute Manager, seu assistente para gestão de chargebacks e disputas. Posso ajudar a analisar casos, gerar contestações e configurar regras automáticas. Como posso ajudar?"',
      processFunction: 'processDisputeManagerMessage from DisputeManagerChatLogic',
      quickPrompts: 'disputeManagerQuickPrompts',
      accentColor: '#ef4444 (red-500) — alinha com tema vermelho de disputas',
    },

    fiveStatusStates: {
      pending: 'amber — Recebido, aguardando análise',
      in_analysis: 'blue — Time interno analisando',
      contested: 'purple — Evidências enviadas, aguarda decisão da bandeira',
      won: 'green — Vitória',
      lost: 'red — Derrota',
    },
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/DisputeManager.jsx',
    totalLines: 570,
    notabilityNote: 'TODO O DADO É MOCK INLINE — não usa base44.entities.Dispute (gap importante)',

    imports: {
      uiComponents: ['Card stack', 'Button', 'Badge', 'Tabs+TabsContent+TabsList+TabsTrigger', 'Progress', 'Input'],
      navigation: ['Link', 'createPageUrl from @/components/utils'],
      agentSystem: [
        'AgentChatInterface from @/components/agents/AgentChatInterface',
        'AgentFloatingButton from @/components/agents/AgentFloatingButton',
        'processDisputeManagerMessage + disputeManagerQuickPrompts from DisputeManagerChatLogic',
      ],
      lucideIcons: [
        'AlertTriangle — KPI Total Disputas',
        'CheckCircle2 — evidence checklist green',
        'XCircle — evidence checklist red + close modal',
        'ArrowRight — AI banner CTA + buttons',
        'DollarSign — KPI Valor Total',
        'Clock — KPI Tempo Médio',
        'FileText — botão contestar na tabela + modal action',
        'Target — KPI Win Rate',
        'Search — input de busca',
        'Filter — botão de filtro icon-only',
        'Eye — botão ver detalhes',
        'Download — botão Exportar header',
        'AlertCircle — KPI Urgentes',
        'Gavel — ícone do agente no header',
        'Brain — AI Insights banner + modal AI Analysis',
        'Zap — KPI Recuperação',
        'Settings — botão Configurar (link DisputeManagerSettings)',
        'Sparkles, Shield, TrendingUp, TrendingDown, ChevronRight, Scale, BarChart3, Calendar, RefreshCw — importados sem uso',
      ],
    },

    componentState: {
      selectedTab: { initial: "'all'", purpose: 'Tab atualmente ativa' },
      selectedDispute: { initial: 'null', purpose: 'Dispute aberto no modal' },
      isChatOpen: { initial: 'false', purpose: 'Visibilidade do AgentChatInterface' },
      isFullscreen: { initial: 'false', purpose: 'Modo tela cheia do chat' },
    },

    mockData: {
      kpis: {
        totalDisputes: 47,
        openDisputes: 12,
        totalValue: '"R$ 127.450,00" (string formatada manualmente)',
        winRate: 72,
        avgResolutionTime: '"8.3 dias"',
        potentialRecovery: '"R$ 89.200,00"',
      },
      disputes: {
        count: 5,
        types: '["chargeback", "pre_chargeback", "chargeback", "chargeback", "chargeback"]',
        statuses: '["pending", "in_analysis", "pending", "won", "lost"]',
        eachDispute: {
          fields: [
            'id (CB-2024-XXX)',
            'transactionId (TXN-XXXXXX)',
            'type (chargeback | pre_chargeback)',
            'status, amount, customer, customerDocument (mascarado)',
            'reason (texto livre PT-BR), reasonCode (10.4, 13.1, ETHOCA, 12.6, 10.1)',
            'cardBrand (Visa | Mastercard | Elo)',
            'openedDate, deadline, daysRemaining',
            'aiWinProbability (15-95)',
            'aiRecommendation (contest | accept)',
            'aiJustification (string PT-BR longa)',
            'evidence: { has3DS, hasDeliveryProof, hasCustomerHistory, hasAntifraudApproval }',
          ],
        },
      },
      gap: 'TODO o array é hardcoded — não busca da Dispute entity. UI funciona mas é demonstrativa.',
    },

    badgeFunctions: {
      getStatusBadge: {
        signature: '(status) => <Badge>',
        configs: {
          pending: 'border-amber-500 text-amber-600 bg-amber-50',
          in_analysis: 'border-blue-500 text-blue-600 bg-blue-50',
          contested: 'border-purple-500 text-purple-600 bg-purple-50',
          won: 'border-green-500 text-green-600 bg-green-50',
          lost: 'border-red-500 text-red-600 bg-red-50',
        },
        fallback: 'config = configs[status] || configs.pending',
      },
      getTypeBadge: {
        pre_chargeback: 'bg-purple-100 text-purple-700 border-purple-200',
        chargeback: 'bg-red-100 text-red-700 border-red-200 (default)',
      },
    },

    tabFiltering: {
      all: 'disputes (sem filtro)',
      pending: 'd.status === pending OR in_analysis',
      high_probability: 'd.aiWinProbability >= 70',
      urgent: 'd.daysRemaining <= 3 && d.status NOT IN (won, lost)',
    },

    layout: {
      header: {
        layout: 'flex flex-col lg:flex-row lg:items-center justify-between gap-4',
        leftSide: {
          iconCircle: 'w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/25',
          icon: 'Gavel 7x7 white',
          title: 'h1 text-2xl font-bold "Dispute Manager"',
          subtitle: '"Gestor Inteligente de Disputas e Chargebacks"',
        },
        rightSide: [
          'Button outline sm + Download + "Exportar" (gap: sem onClick)',
          'Link para DisputeManagerSettings + Button outline sm + Settings + "Configurar"',
        ],
      },

      kpiCards: {
        layout: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4',
        cards: [
          { name: 'Total Disputas', icon: 'AlertTriangle', value: '47', subValue: '12 abertas' },
          { name: 'Valor Total', icon: 'DollarSign', value: 'R$ 127.450,00', subValue: 'em disputa' },
          { name: 'Win Rate', icon: 'Target', color: 'green-50/200', value: '72% (verde-700)', subValue: 'acima da média' },
          { name: 'Tempo Médio', icon: 'Clock', value: '8.3 dias', subValue: 'resolução' },
          { name: 'Recuperação', icon: 'Zap', color: '[#2bc196]/5', value: 'R$ 89.200,00 ([#2bc196])', subValue: 'potencial' },
          { name: 'Urgentes', icon: 'AlertCircle', color: 'amber-50/200', value: '3 hardcoded (gap)', subValue: 'prazo < 3 dias' },
        ],
      },

      aiInsightsBanner: {
        wrapper: 'Card border-[#2bc196]/20 bg-gradient-to-r from-[#2bc196]/5 to-transparent',
        layout: 'CardContent p-4 + flex items-center gap-4',
        iconCircle: 'w-12 h-12 rounded-xl bg-gradient-to-br from-[#2bc196] to-[#5cf7cf]',
        icon: 'Brain 6x6 white',
        title: 'h3 font-semibold "Análise IA do Dispute Manager"',
        body: '"3 disputas com alta probabilidade..." STRONG embutido',
        cta: 'Button bg-[#2bc196] + "Contestar Todas" + ArrowRight',
        gap: 'Texto e contagem hardcoded — não dinâmico',
      },

      mainTable: {
        wrapper: 'Card → CardHeader (filtros + busca) + CardContent (Tabs + table)',
        cardHeader: {
          leftSide: 'CardTitle "Lista de Disputas" + CardDescription',
          rightSide: ['Input com Search 4x4 absolute + placeholder (gap: sem onChange)', 'Button outline icon + Filter (gap: sem onClick)'],
        },
        tabs: {
          defaultValue: 'all',
          triggers: ['Todas ({count})', 'Pendentes ({count})', 'Alta Prob. Ganho ({count})', 'Urgentes ({count})'],
        },
        tableHTML: 'TABELA NATIVA HTML <table> — não usa shadcn/Table',
        columns: [
          'ID: id (font-medium) + transactionId (text-xs)',
          'Tipo: getTypeBadge(type)',
          'Cliente: customer + customerDocument (mascarado)',
          'Motivo: 2 linhas (reason truncate max-w-[200px] + cardBrand • reasonCode)',
          'Valor: R$ {amount.toLocaleString} alignment right',
          'Prob. Ganho: % colorido (>=70 verde, >=40 amber, else red) + Progress w-16 h-1.5',
          'Prazo: Badge outline com cor por urgência (<=3 red, <=7 amber, else default)',
          'Status: getStatusBadge',
          'Recomendação IA: Badge contest (green) "✓ Contestar" ou accept (slate) "✗ Aceitar"',
          'Ações: Eye (setSelectedDispute) + FileText [#2bc196] (gap: sem onClick)',
        ],
      },

      detailModal: {
        renderIf: 'selectedDispute !== null',
        overlayDiv: 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4',
        overlayClick: 'onClick={() => setSelectedDispute(null)} (fecha)',
        innerCardClick: 'onClick={(e) => e.stopPropagation()} (não fecha)',
        innerCard: 'w-full max-w-2xl max-h-[90vh] overflow-y-auto',
        gap: 'Não usa shadcn Dialog — perde acessibilidade (focus trap, escape key)',
        sections: [
          {
            name: 'AI Analysis Block',
            wrapper: 'p-4 rounded-lg bg-gradient-to-r from-[#2bc196]/10 border-[#2bc196]/20',
            header: 'Brain 5x5 [#2bc196] + h4 "Análise do Dispute Manager"',
            justification: 'p text-sm slate-600 — aiJustification',
            metrics: [
              'Probabilidade de Ganho: aiWinProbability% text-2xl bold com cor',
              'Recomendação: Badge contest (green-100) ou accept (slate-100)',
            ],
          },
          {
            name: 'Evidence Checklist',
            heading: 'h4 font-semibold "Checklist de Evidências"',
            grid: 'grid-cols-2 gap-3',
            items: ['has3DS', 'hasDeliveryProof', 'hasCustomerHistory', 'hasAntifraudApproval'],
            itemRender: {
              presentClass: 'border-green-200 bg-green-50',
              absentClass: 'border-red-200 bg-red-50',
              icon: 'evidence[key] ? CheckCircle2 green : XCircle red',
            },
          },
          {
            name: 'Actions Footer',
            primaryButton: 'flex-1 + bg-[#2bc196] + FileText + "Gerar Dossiê" (gap: sem onClick)',
            secondaryButton: 'flex-1 + outline + "Aceitar Perda" (gap: sem onClick)',
          },
        ],
      },

      agentChatInterface: {
        component: 'AgentChatInterface from @/components/agents/AgentChatInterface',
        props: {
          agentName: '"dispute_manager"',
          agentDisplayName: '"Dispute Manager"',
          quickPrompts: 'disputeManagerQuickPrompts',
          onProcessMessage: 'processDisputeManagerMessage',
          welcomeMessage: '"Olá! 👋 Sou o Dispute Manager..."',
          isOpen: 'isChatOpen state',
          onClose: '() => setIsChatOpen(false)',
          isFullscreen: 'isFullscreen state',
          onToggleFullscreen: '() => setIsFullscreen(!isFullscreen)',
          accentColor: '"#ef4444" (red-500)',
        },
      },

      agentFloatingButton: {
        component: 'AgentFloatingButton',
        props: { isOpen: 'isChatOpen', onClick: '() => setIsChatOpen(!isChatOpen)', agentName: '"Dispute Manager"', accentColor: '"#ef4444"' },
      },
    },

    knownGaps: [
      'TODO O DADO É MOCK INLINE — não busca da entity Dispute',
      'KPIs todos hardcoded',
      'Banner AI tem texto fixo — não dinâmico',
      'Botão "Contestar Todas" sem implementação',
      'Botão "Exportar" sem onClick',
      'Button "Filter" icon-only sem onClick',
      'Input de busca sem onChange — não filtra',
      'Modal de detalhes usa overlay manual em vez de Dialog do shadcn',
      'Botões "Gerar Dossiê" e "Aceitar Perda" no modal sem onClick',
      'Botão FileText [#2bc196] na coluna Ações sem onClick',
      'KPI Urgentes mostra "3" hardcoded — deveria computar de daysRemaining',
      'getStatusBadge tem caso "contested" mas dados mock só têm pending/in_analysis/won/lost',
      'Tabela usa <table> nativa em vez de shadcn Table',
      'AI accent color #ef4444 vs visual KPIs/banner em [#2bc196] — inconsistência cromática',
      'Sem paginação na tabela',
      'Sem ordenação nas colunas',
    ],

    relationshipsToOtherPages: {
      disputeDashboard: '/DisputeDashboard — pai do módulo',
      disputeManagerSettings: '/DisputeManagerSettings — botão Settings do header',
      chargebacks: '/Chargebacks — sobreposição funcional importante (gap: deveriam ser unificadas)',
      preChargebacks: '/PreChargebacks — esta página JUNTA pre_chargeback E chargeback no mesmo grid',
      disputeContestation: '/DisputeContestation — destino esperado do botão "Gerar Dossiê" (não implementado)',
      disputeAgentSettings: '/DisputeAgentSettings — config do agente IA real (entity DisputeAgentConfig)',
    },
  },
};

export default DisputeManagerDoc;