// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /DIACopilot
// Fidelidade absoluta a pages/DIACopilot.jsx (538 linhas).
// ============================================================================

export const DIACopilotDoc = {
  pageId: 'DIACopilot',
  pagePath: '/DIACopilot',
  module: 'Agentes IA',
  parentPage: null,

  explainer: {
    oneLiner:
      'Assistente IA proativo do merchant — Header com gradient #2bc196→#5cf7cf + Sparkles + status "Monitorando em tempo real" + botão Configurar, Resumo Diário com 4 cards (Vendas/Taxa Aprovação/Ticket Médio/Recusas) + Top Refusal Reasons chart, 4 Oportunidades (priority high/medium/low color-coded), 3 Smart Alerts (warning/success/info), Comparativo Semanal, 4 Quick Actions, Chat flutuante + Floating Button + Notificação Proativa após 8s.',

    proactivePattern: {
      reasoning: 'Diferente de chatbots reativos, DIA é PROATIVO — analisa em background, gera notificação 8s após carregar',
      eightSecondsTrigger: 'useEffect com setTimeout 8000ms — primeiro gatilho',
    },

    fourDailySummaryKPIs: {
      sales: { value: 'R$ 847.320,00', count: 1247, change: '+12.3%', trend: 'up' },
      approvalRate: { value: '94.2%', change: '+1.8%', display: 'Progress bar 94.2' },
      averageTicket: { value: 'R$ 679,17', change: '-2.1%', sub: 'vs R$ 693,71 ontem' },
      refusals: { total: 73, topReasons: 'Saldo Insuf 38.4%/Limite 26%/Bloqueado 19.2%/Inválidos 16.4%' },
      gap: 'Dados HARDCODED — não vêm de query',
    },

    fourOpportunities: {
      recovery: { priority: 'high', impact: '+R$ 45.230', target: '/RecoveryAgent', icon: 'RefreshCw' },
      conversion: { priority: 'medium', impact: '+8% conversão', target: '/ConverterAgent', icon: 'TrendingUp' },
      dispute: { priority: 'high', impact: 'R$ 12.450', target: '/DisputeManager', icon: 'AlertTriangle' },
      insight: { priority: 'low', impact: '+34% vendas', target: '/Reports', icon: 'Clock' },
    },

    threePriorityColorBands: {
      high: 'border-red-200 + bg-red-50/50 + icon bg-red-100 text-red-600',
      medium: 'border-amber-200 + bg-amber-50/50 + icon bg-amber-100',
      low: 'border-slate-200 + bg-white + icon bg-slate-100',
    },

    threeSmartAlerts: {
      warning: 'Taxa de chargeback subindo (0.8% → 1.2% nos últimos 7 dias) — 2h atrás',
      success: 'Meta mensal atingida (105% da meta GMV) — 5h atrás',
      info: 'Novo pico de vendas (R$ 92.450 ontem) — 1d atrás',
    },

    fourQuickActions: {
      recoveryAgent: 'RefreshCw + group-hover:rotate-180 → /RecoveryAgent',
      converterAgent: 'TrendingUp + scale-110 → /ConverterAgent',
      disputeManager: 'AlertTriangle + scale-110 → /DisputeManager',
      reports: 'FileText + scale-110 → /Reports',
    },

    weekComparison: {
      thisWeek: { gmv: 4235000, transactions: 6234, approval: 94.2 },
      change: { gmv: 8.9, transactions: 5.8, approval: 1.4 },
      gap: 'gmv exibido como "(gmv/100).toLocaleString" — sugere centavos',
    },
  },

  technical: {
    fileLocation: 'pages/DIACopilot.jsx',
    totalLines: 538,

    imports: {
      react: ['useState', 'useEffect'],
      uiComponents: ['Card stack', 'Button', 'Badge', 'Tabs stack (sem uso)', 'Progress'],
      navigation: ['Link', 'createPageUrl'],
      lucideIcons: 'Sparkles, TrendingUp/Down, AlertTriangle, CheckCircle2, ArrowRight, DollarSign (sem uso), CreditCard (sem uso), BarChart3, Target (sem uso), Lightbulb (amber-500), Clock, RefreshCw, Settings, Zap, PieChart (sem uso), Activity, FileText, Bell, Eye (sem uso), ChevronRight (sem uso), Calendar',
      sharedComponents: ['AgentChatInterface', 'AgentFloatingButton', 'AgentProactiveNotification'],
      agentLogic: 'DIACopilotChatLogic exports: processDIACopilotMessage, diaCopilotQuickPrompts, diaCopilotProactiveNotifications',
    },

    componentState: {
      selectedPeriod: { initial: "'today'", purpose: 'today/yesterday/week — gap: não muda dados' },
      isChatOpen: { initial: 'false' },
      isFullscreen: { initial: 'false' },
      proactiveNotification: { initial: 'null' },
      hasShownNotification: { initial: 'false', purpose: 'Flag para mostrar apenas 1x' },
    },

    backendIntegration: 'NENHUMA query — TODOS os dados HARDCODED',

    proactiveNotificationLogic: {
      useEffect: 'if (!hasShownNotification) setTimeout 8000ms → set notification + flag true',
      cleanup: 'clearTimeout(timer) on unmount',
      handlers: {
        handleProactiveAction: 'set notification null + open chat',
        handleProactiveDismiss: 'set notification null',
      },
    },

    layout: {
      header: {
        leftSide: 'iconBox gradient + Sparkles 7x7 + h1 "DIA Copilot" + subtitle',
        rightSide: 'statusPill bolinha verde pulsante + Link /SettingsPage Button outline + Settings + "Configurar"',
      },

      dailySummaryCard: {
        wrapper: 'border-#2bc196/20 + gradient',
        header: 'Calendar #2bc196 + "Resumo Diário Automático" + 3 Buttons período (today/yesterday/week)',
        kpiGrid: 'grid 1/2/4: Vendas + Taxa Aprovação (Progress) + Ticket Médio + Recusas (top 2 razões + Link "Ver todas")',
        topRefusalReasonsChart: 'h4 + para cada razão: label w-32 + barFill gradient #2bc196→#5cf7cf width=% + count inside + percentage right',
      },

      opportunitiesCard: {
        header: 'Lightbulb amber-500 + "Oportunidades Identificadas"',
        grid: 'grid 1/2 cols gap-4',
        renderEach: 'border-2 priority-adaptive (red/amber/slate) + iconBox 10x10 + title + Badge outline #2bc196 impact + description + Link bg-#2bc196 + ArrowRight',
      },

      twoColsAlertsAndComparison: {
        layout: 'grid 1/2 cols',
        smartAlerts: 'Bell #2bc196 + cards type-adaptive (warning amber/success green/info blue) + icon + title + message + timestamp',
        weekComparison: 'BarChart3 #2bc196 + 3 rows: GMV (R${(gmv/100).toLocaleString}) + Transactions + Approval, cada um com Badge bg-#2bc196 + TrendingUp + change%',
      },

      quickActionsCard: {
        header: 'Zap #2bc196 + "Ações Rápidas"',
        grid: 'grid 2/4 cols',
        renderEach: 'Link rounded-xl border hover:border-#2bc196 cursor-pointer group + icon group-hover animation + name + description',
      },

      chatComponents: {
        agentChatInterface: 'agentName="dia_copilot" + accentColor="#2bc196" + welcome message PT + isOpen + isFullscreen',
        agentFloatingButton: 'pulseNotification = !isChatOpen && !hasShownNotification',
        agentProactiveNotification: 'notification + handlers + accentColor #2bc196',
      },
    },

    knownGaps: [
      'TODOS os dados são MOCK — sem queries backend',
      'Period buttons NÃO refiltram nada — apenas decoração',
      'DollarSign, CreditCard, Target, PieChart, Eye, ChevronRight (lucide), Tabs/TabsContent sem uso',
      'weekComparison.gmv divide por 100 — valores em centavos',
      'Notificação proativa única (hasShownNotification) — não recebe novas',
      'Smart Alerts tem property "action" mas SEM botão clicável',
      'Sem timestamp dinâmico — sempre "2 horas atrás"',
      'Top Refusal Reasons mock NÃO vem de DeclineAnalysis real',
      'Sem refresh manual + sem export PDF + sem filtro subaccount',
    ],

    relationshipsToOtherPages: {
      recoveryAgent: '/RecoveryAgent — Quick Action + Opportunity recovery',
      converterAgent: '/ConverterAgent — Opportunity conversion',
      disputeManager: '/DisputeManager — Quick Action + Opportunity dispute',
      reports: '/Reports — Opportunity insight + Quick Action',
      declineAnalysis: '/DeclineAnalysis — Link "Ver todas as recusas"',
      settingsPage: '/SettingsPage — botão Configurar',
      adminIntPagSmileCopilot: '/AdminIntPagSmileCopilot — versão admin interno',
    },
  },
};

export default DIACopilotDoc;