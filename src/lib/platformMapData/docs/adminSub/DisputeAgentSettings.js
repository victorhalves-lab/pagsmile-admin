// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /DisputeAgentSettings
// Fidelidade absoluta a pages/DisputeAgentSettings.jsx (515 linhas).
// ============================================================================

export const DisputeAgentSettingsDoc = {
  pageId: 'DisputeAgentSettings',
  pagePath: '/DisputeAgentSettings',
  module: 'Agentes IA',
  parentPage: null,

  explainer: {
    oneLiner:
      'Centro de configuração do Dispute Manager Agent — PageHeader + AgentDashboardSummary com toggle, 5 Tabs (Geral/Automação/Notificações/Pré-Chargebacks/Aprendizado) com Sliders de threshold, Switches de auto-ações, Inputs de valores limite, Select de histórico do cliente, e card de Aprendizado Contínuo com métricas de Ganhos/Perdidos/Pré-CBs Prevenidos + sugestões de prevenção da IA.',

    twoEntitiesUsed: {
      DisputeAgentConfig: 'Config principal do agente — 1 registro singleton',
      AutoReimburseConfig: 'Config separada de auto-reembolso de pré-chargebacks — 1 registro singleton',
    },

    fiveTabsConcept: {
      general: 'Status (Switch global) + Threshold de probabilidade (Slider 30-100%) + Valor máximo auto-ação (Input BRL) + Exigir Revisão Humana (Switch)',
      automation: 'Alert Brain explicativo + Auto-Contestar (Switch) + Auto-Aceitar Baixa Prob (Switch) + Threshold Baixa Prob (Slider 5-50%) + Critérios de Escalação (valor)',
      notifications: '4 toggles: Email cada ação + Resumo diário + Push + Email para notificações',
      preChargebacks: 'Auto-Reembolso Inteligente (Switch) + Valor Máximo + Consideração histórico (Select) + Notificar Auto-Reembolsos',
      learning: '3 cards (Ganhas/Perdidas/Pré-CBs Prevenidos) + Alert TrendingUp + Sugestões de Prevenção da IA',
    },

    threeAutoActionsLogic: {
      auto_contest: 'Quando probabilidade > threshold (default 70%) E valor < max_value (default R$500) → contesta automaticamente',
      auto_accept_low: 'Quando probabilidade < low_threshold (default 20%) → aceita automaticamente (não vale a luta)',
      require_human_review: 'OVERRIDE — se ON, agente NUNCA age sozinho, sempre escala',
    },

    threeEscalationCriteria: {
      valueAbove: 'escalation_value_threshold (default R$1000) — sempre revisão humana',
      uncertainProbability: 'Faixa 30-60% — incerteza grande sempre escalada',
      reasonCodes: 'Reason codes específicos (campo escalation_reason_codes) sempre escalados',
    },

    threeCustomerHistoryConsideration: {
      none: 'Não considera histórico — auto-reembolso baseado apenas em valor',
      new_customers_only: 'Auto-reembolsa APENAS clientes novos — assume risco menor de fraude',
      exclude_good_standing: 'NÃO auto-reembolsa clientes em boa posição — protege relacionamento',
    },

    threeLearningMetrics: {
      total_won: 'Contestações Ganhas (green) — agente aprende quais evidências funcionaram',
      total_lost: 'Contestações Perdidas (red) — agente identifica padrões de perda',
      total_pre_cbs_prevented: 'Pré-CBs Prevenidos (purple) — alertas resolvidos antes de virar CB',
    },

    twoAIPreventionSuggestionsExamples: [
      'BIN 456789 com 5x mais chargebacks — Considere bloquear ou adicionar verificação extra (yellow)',
      'RC 13.1 (não recebido) em alta — Melhorar tracking de entrega no checkout (blue)',
    ],
  },

  technical: {
    fileLocation: 'pages/DisputeAgentSettings.jsx',
    totalLines: 515,

    imports: {
      react: ['default'],
      reactQuery: ['useQuery', 'useMutation', 'useQueryClient'],
      base44: 'base44.entities.DisputeAgentConfig + AutoReimburseConfig',
      uiComponents: ['Card stack', 'Button', 'Input', 'Label', 'Switch', 'Slider', 'Badge', 'Tabs stack', 'Select stack', 'Alert+AlertDescription', 'Separator (importado sem uso)'],
      lucideIcons: 'Bot (sem uso direto), Settings, Zap, Bell, Shield, TrendingUp, AlertTriangle, CheckCircle2, Save (sem uso), RefreshCcw (sem uso), Brain, Target, DollarSign (sem uso), Clock (sem uso), Users (sem uso)',
      sharedComponents: ['PageHeader', 'AgentDashboardSummary (components/disputes)'],
      utilities: ['cn', 'sonner toast'],
      localUtility: 'formatCurrency inline',
    },

    componentState: 'NENHUM state local explícito — tudo deriva das queries',

    backendIntegration: {
      queryAgentConfigs: { queryKey: "['disputeAgentConfig']", queryFn: 'DisputeAgentConfig.list()' },
      queryAutoReimburseConfigs: { queryKey: "['auto-reimburse-config']", queryFn: 'AutoReimburseConfig.list()' },
      derived: {
        agentConfig: 'agentConfigs[0] || defaults com 13 campos default',
        autoConfig: 'autoReimburseConfigs[0] || {}',
      },
      updateConfigMutation: {
        signature: '(data) => if (id) update(id, data) else create(data)',
        onSuccess: 'invalidate + toast.success("Configurações salvas")',
      },
      updateAutoConfigMutation: {
        signature: 'idem com create criando { name: "Configuração Padrão", ...data }',
        onSuccess: 'invalidate + toast.success("Configurações de auto-reembolso salvas")',
      },
    },

    helperFunctions: {
      handleToggleAgent: '(enabled) => updateConfigMutation { ...agentConfig, is_agent_enabled: enabled }',
      handleSaveConfig: '(updates) => updateConfigMutation { ...agentConfig, ...updates }',
      formatCurrency: 'Intl.NumberFormat pt-BR BRL',
    },

    layout: {
      pageHeader: {
        title: 'Dispute Manager Agent',
        subtitle: 'Configure o agente de IA para gerenciamento automático de disputas',
        breadcrumbs: [{ label: 'Agentes de IA' }, { label: 'Dispute Manager' }],
      },

      agentSummary: {
        component: 'AgentDashboardSummary',
        props: 'config=agentConfig + onToggleAgent + isLoading',
      },

      tabsContainer: {
        defaultValue: 'general',
        tabs: ['Geral', 'Automação', 'Notificações', 'Pré-Chargebacks', 'Aprendizado'],
      },

      tabGeneral: {
        title: 'Settings + "Configurações Gerais"',
        description: 'Defina os parâmetros básicos de funcionamento do agente',
        fields: [
          {
            wrapper: 'p-4 bg-gray-50 rounded-lg',
            label: 'Status do Agente',
            sub: 'Ativar ou desativar o agente de disputas',
            control: 'Switch checked=is_agent_enabled → handleToggleAgent',
          },
          {
            label: 'Threshold de Probabilidade para Auto-Ação',
            badge: '{auto_action_probability_threshold}%',
            slider: 'min=30 max=100 step=5',
            help: 'O agente só tomará ações automáticas se a probabilidade de ganho for maior que este valor',
          },
          {
            label: 'Valor Máximo para Auto-Ação',
            input: 'type=number value=max_value_for_auto_action default 500 + sufixo "BRL"',
            help: 'Disputas acima deste valor sempre serão escaladas para revisão humana',
          },
          {
            wrapper: 'p-4 border rounded-lg',
            label: 'Exigir Revisão Humana',
            sub: 'Todas as ações do agente precisam de aprovação',
            control: 'Switch require_human_review',
          },
        ],
      },

      tabAutomation: {
        title: 'Zap + "Automação de Contestações"',
        alertBrainCard: 'Brain icon + descrição: "O agente analisa cada disputa e recomenda a melhor ação..."',
        fields: [
          {
            label: 'Auto-Contestar',
            sub: 'Contestar automaticamente quando probabilidade > {threshold}%',
            control: 'Switch auto_contest_enabled',
          },
          {
            label: 'Auto-Aceitar Baixa Probabilidade',
            sub: 'Aceitar automaticamente quando probabilidade < {low_threshold}%',
            control: 'Switch auto_accept_low_probability_enabled',
          },
          {
            label: 'Threshold de Baixa Probabilidade',
            slider: 'min=5 max=50 step=5 default 20%',
            badge: '{low_probability_threshold}%',
          },
        ],
        escalationCriteria: {
          title: 'Critérios de Escalação para Humano',
          field: 'Valor acima de — Input default 1000',
          help: 'Disputas com valor acima de {formatCurrency(escalation_value_threshold)} ou probabilidade entre 30-60% serão sempre escaladas.',
        },
      },

      tabNotifications: {
        title: 'Bell + "Notificações"',
        switches: [
          'E-mail para Cada Ação (notification_email_each_action)',
          'Resumo Diário por E-mail (notification_daily_summary)',
          'Notificações Push (notification_push_enabled)',
        ],
        emailInput: 'E-mail para Notificações — Input type=email',
      },

      tabPreCB: {
        title: 'AlertTriangle + "Gestão de Pré-Chargebacks"',
        subtitle: 'Configure o auto-reembolso inteligente para alertas Ethoca/Verifi',
        switchHero: {
          wrapper: 'p-4 bg-purple-50 border-purple-200',
          label: 'Auto-Reembolso Inteligente',
          sub: 'O agente decide automaticamente se deve reembolsar pré-chargebacks',
          control: 'Switch is_enabled',
        },
        conditionalSection: {
          renderIf: 'autoConfig.is_enabled === true',
          fields: [
            'Valor Máximo Global (Input default 100 BRL)',
            'Consideração do Histórico do Cliente (Select [none/new_customers_only/exclude_good_standing])',
            'Notificar Auto-Reembolsos (Switch notification_email_enabled)',
          ],
        },
      },

      tabLearning: {
        title: 'Brain + "Aprendizado Contínuo"',
        subtitle: 'O agente aprende com os resultados para melhorar suas recomendações',
        threeMetricsGrid: {
          layout: 'grid 1/3 cols gap-4',
          cards: [
            { name: 'Contestações Ganhas', icon: 'CheckCircle2 green', value: 'total_won', sub: 'O agente aprende quais evidências funcionaram' },
            { name: 'Contestações Perdidas', icon: 'AlertTriangle red', value: 'total_lost', sub: 'O agente identifica padrões de perda' },
            { name: 'Pré-CBs Prevenidos', icon: 'Shield purple', value: 'total_pre_cbs_prevented', sub: 'Alertas resolvidos antes de virar CB' },
          ],
        },
        alertPattern: 'TrendingUp + "Análise de Padrões: O agente identifica padrões problemáticos como BINs com alto índice de CB, produtos específicos, horários e regiões..."',
        suggestionsCard: {
          title: 'Sugestões de Prevenção Recentes',
          items: [
            { bg: 'yellow', icon: 'AlertTriangle yellow-600', title: 'BIN 456789 com 5x mais chargebacks', sub: 'Considere bloquear ou adicionar verificação extra' },
            { bg: 'blue', icon: 'Target blue-600', title: 'RC 13.1 (não recebido) em alta', sub: 'Melhorar tracking de entrega no checkout' },
          ],
        },
      },
    },

    knownGaps: [
      'Bot, Save, RefreshCcw, DollarSign, Clock, Users (lucide), Separator (UI) importados sem uso',
      'Sliders/Switches salvam imediatamente a cada mudança — sem botão "Salvar" explícito (UX divergente do padrão "form")',
      'Sem debounce — múltiplos updates podem disparar muitas mutations',
      'Sem confirmação ao desativar agente (operação crítica)',
      'Sugestões de Prevenção HARDCODED — não vêm de query real',
      '3 métricas Aprendizado vêm do agentConfig mas sem TIMESERIES (apenas total acumulado)',
      'AutoReimburseConfig sem default name no derived (autoConfig = {} se não existir)',
      'Sem campo para configurar reason_codes específicos no escalation (campo existe na entidade)',
      'Sem campo para configurar per_reason_code_thresholds (campo existe na AutoReimburseConfig)',
      'min_customer_purchases_for_good_standing existe no schema mas UI não permite ajustar',
    ],

    relationshipsToOtherPages: {
      disputeManager: '/DisputeManager — onde o agente atua',
      disputeManagerSettings: '/DisputeManagerSettings — settings paralelas (overlap?)',
      disputeDashboard: '/DisputeDashboard — visão executiva',
      preChargebacks: '/PreChargebacks — fluxo de pré-CBs',
      adminIntDisputeManager: '/AdminIntDisputeManager — visão admin interno',
      adminIntDisputeManagerSettings: '/AdminIntDisputeManagerSettings — config admin',
    },
  },
};

export default DisputeAgentSettingsDoc;