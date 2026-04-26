// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /DisputeManagerSettings
// ============================================================================
// Arquivo dedicado, fidelidade absoluta a pages/DisputeManagerSettings.jsx (346 linhas).
// Cada tab, cada switch, cada slider, cada input numérico, cada threshold,
// cada regra de auto-aceitar/escalonar/notificar — documentado individualmente.
// ============================================================================

export const DisputeManagerSettingsDoc = {
  pageId: 'DisputeManagerSettings',
  pagePath: '/DisputeManagerSettings',
  module: 'Disputas',
  parentPage: 'DisputeManager',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Painel de configuração do AGENTE IA Dispute Manager — define em 4 tabs (Automação / Auto-Aceitar / Escalonamento / Notificações) os thresholds, regras e gatilhos que governam o comportamento autônomo do agente: o que ele pode fazer SOZINHO, o que precisa de revisão humana, e quando alertar o operador.',

    fourTabsLogic: {
      automation: {
        purpose: 'Configurar contestações AUTOMÁTICAS para casos com alta probabilidade',
        keyControls: [
          'agentEnabled: Switch master — desliga TODO o agente',
          'autoContestHighProbability: Switch para auto-contestar casos com prob alta',
          'minWinProbabilityForAutoContest: Slider 70-95% (step 5)',
        ],
        riskMitigation: 'Agente nunca contesta sozinho casos com prob abaixo do threshold — força revisão humana',
      },
      autoAccept: {
        purpose: 'Aceitar perda automaticamente para disputas de BAIXO valor (não vale a pena contestar)',
        keyControls: [
          'enableAutoAccept: Switch master',
          'autoAcceptMaxValue: Input numérico em R$ (default 50)',
          'autoAcceptIfNoEvidence: Switch (warning amber) — aceita se SEM evidências',
        ],
        economicRationale:
          'Para um CB de R$30, contestar custa mais em mão-de-obra que o valor disputado. Auto-aceitar é racional.',
      },
      escalation: {
        purpose: 'Forçar revisão HUMANA antes de qualquer ação automática em casos críticos',
        keyControls: [
          'escalateHighValue: Switch — disputas acima do threshold sempre passam por humano',
          'highValueThreshold: Input em R$ (default 5000)',
          'escalateRecurringCustomer: Switch — clientes com histórico de compras escalam',
        ],
        whyEscalate:
          'Casos de alto valor têm risco regulatório se contestados/aceitos errado. Cliente recorrente = risco reputacional. Humano deve revisar.',
      },
      notifications: {
        purpose: 'Configurar quando o agente notifica o operador via push/email',
        keyControls: [
          'notifyNewDispute: Switch — toda disputa nova',
          'notifyDeadlineApproaching: Switch + Input dias (default 3)',
          'notifyWinLoss: Switch — quando bandeira decide',
          'notifyRatioAlert: Switch + Input % (default 1.5)',
        ],
      },
    },

    saveModel: {
      pattern: 'Single state object "settings" + setSettings({...settings, key: v}) imutável',
      saveButton: 'Botão "Salvar" no header — chama handleSave() que faz alert("Configurações salvas!")',
      gap: 'NÃO PERSISTE em backend (DisputeAgentConfig) — só alert. Funcionalidade simulada.',
      resetButton: 'Botão "Resetar" no header (gap: sem implementação)',
    },

    coreCapabilities: [
      'Header com Back button + Gavel icon (gradient red-orange) + título + Reset/Save',
      '4 Tabs em grid w-full grid-cols-4 (não responsivo em mobile)',
      'Padrão repetido: Switch + Input + Slider em cards bordados',
      'Conditional disable: filhos ficam disabled quando o Switch master está OFF',
      'Visual warning: Switch "Auto-Aceitar Sem Evidências" tem bg-amber-50 + AlertTriangle',
    ],
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/DisputeManagerSettings.jsx',
    totalLines: 346,
    notabilityNote: 'Estado LOCAL apenas — não lê nem escreve no DisputeAgentConfig do banco (gap importante)',

    imports: {
      uiComponents: ['Card stack', 'Button', 'Badge', 'Tabs+TabsContent+TabsList+TabsTrigger', 'Switch', 'Label', 'Input', 'Slider', 'Select stack'],
      navigation: ['Link', 'createPageUrl from @/components/utils'],
      lucideIcons: [
        'Settings — não usado ativamente',
        'Gavel — ícone do agente no header',
        'Save — botão Salvar',
        'RotateCcw — botão Resetar',
        'AlertTriangle — Auto-Aceitar Sem Evidências warning + Alerta de Ratio',
        'CheckCircle2 — Resultado de Disputa notification',
        'Bell — Nova Disputa notification',
        'DollarSign — Auto-Aceitar + Escalar Valor Alto',
        'Clock — Prazo se Aproximando notification',
        'FileText — não usado ativamente',
        'ArrowLeft — back button para DisputeManager',
        'Shield — Escalar Cliente Recorrente',
        'Zap, Target — importados sem uso',
      ],
    },

    componentState: {
      settings: {
        initialValues: {
          // General/Automation
          agentEnabled: true,
          autoContestHighProbability: true,
          minWinProbabilityForAutoContest: 85,
          // Auto-accept
          enableAutoAccept: true,
          autoAcceptMaxValue: 50,
          autoAcceptIfNoEvidence: false,
          // Escalation
          escalateHighValue: true,
          highValueThreshold: 5000,
          escalateRecurringCustomer: true,
          // Notifications
          notifyNewDispute: true,
          notifyDeadlineApproaching: true,
          deadlineWarningDays: 3,
          notifyWinLoss: true,
          notifyRatioAlert: true,
          ratioAlertThreshold: 1.5,
        },
        immutableUpdates: 'setSettings({...settings, key: value}) — pattern repetido em todos os controles',
      },
    },

    handleSave: {
      signature: '() => void',
      implementation: 'alert("Configurações salvas com sucesso!")',
      gap: 'NÃO PERSISTE — não chama base44.entities.DisputeAgentConfig.update/create',
    },

    layout: {
      header: {
        layout: 'flex items-center justify-between',
        leftSide: [
          'Link wrapper para createPageUrl("DisputeManager")',
          'Button ghost icon + ArrowLeft 5x5 — back button',
          'iconCircle: w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 + Gavel 6x6 white',
          'h1 text-2xl font-bold "Configurações do Dispute Manager"',
          'p slate-500 "Regras de automação, thresholds e notificações"',
        ],
        rightSide: [
          'Button outline + RotateCcw + "Resetar" (gap: sem onClick)',
          'Button bg-red-600 hover:bg-red-700 + Save + "Salvar" → handleSave()',
        ],
      },

      tabs: {
        defaultValue: '"automation"',
        tabsList: 'grid w-full grid-cols-4',
        triggers: ['"automation": Automação', '"autoaccept": Auto-Aceitar', '"escalation": Escalonamento', '"notifications": Notificações'],
        gap: 'Em mobile com 4 cols ficam apertados — sem responsividade',
      },

      // --------------------------------------------------------------------
      // TAB AUTOMAÇÃO
      // --------------------------------------------------------------------
      tabAutomation: {
        cardTitle: '"Automação de Contestação"',
        cardDescription: '"Configure regras para contestação automática"',
        controls: [
          {
            name: 'Agente Ativo',
            wrapper: 'flex justify-between p-4 rounded-lg border',
            label: 'Label text-base "Agente Ativo"',
            subLabel: 'p text-sm slate-500 "Habilita análises e recomendações automáticas"',
            control: 'Switch bound a settings.agentEnabled',
            criticalDetail: 'Master toggle — quando off, o agente fica completamente inativo',
          },
          {
            name: 'Contestar Automaticamente (Alta Probabilidade)',
            label: 'Label "Contestar Automaticamente (Alta Probabilidade)"',
            subLabel: '"Inicia contestação sem intervenção manual"',
            control: 'Switch bound a settings.autoContestHighProbability',
          },
          {
            name: 'Probabilidade Mínima para Auto-Contestar',
            layout: 'space-y-3',
            slider: {
              value: '[settings.minWinProbabilityForAutoContest]',
              onValueChange: '([v]) => setSettings({...settings, minWinProbabilityForAutoContest: v})',
              min: 70,
              max: 95,
              step: 5,
              disabled: '!settings.autoContestHighProbability',
            },
            display: 'span text-lg font-bold w-16 text-right "{value}%"',
            helpText: '"Disputas com probabilidade acima serão contestadas automaticamente"',
          },
        ],
      },

      // --------------------------------------------------------------------
      // TAB AUTO-ACEITAR
      // --------------------------------------------------------------------
      tabAutoAccept: {
        cardTitle: '"Regras de Auto-Aceitar Perda"',
        cardDescription: '"Defina quando aceitar disputas automaticamente para economizar tempo"',
        controls: [
          {
            name: 'Habilitar Auto-Aceitar',
            wrapper: 'flex justify-between p-4 rounded-lg border',
            iconBlock: 'DollarSign 5x5 slate-500',
            label: '"Habilitar Auto-Aceitar"',
            subLabel: '"Aceita disputas de baixo valor automaticamente"',
            control: 'Switch bound a settings.enableAutoAccept',
          },
          {
            name: 'Valor Máximo para Auto-Aceitar',
            layout: 'space-y-3',
            inputBlock: 'flex items-center gap-2',
            currencyPrefix: 'span text-sm slate-500 "R$"',
            input: {
              type: 'number',
              value: 'settings.autoAcceptMaxValue',
              onChange: '(e) => setSettings({...settings, autoAcceptMaxValue: Number(e.target.value)})',
              width: 'w-32',
              disabled: '!settings.enableAutoAccept',
            },
            helpText: '"Disputas abaixo deste valor serão aceitas automaticamente"',
          },
          {
            name: 'Auto-Aceitar Sem Evidências',
            wrapper: 'flex justify-between p-4 rounded-lg border bg-amber-50 dark:bg-amber-900/20',
            iconBlock: 'AlertTriangle 5x5 amber-600',
            label: '"Auto-Aceitar Sem Evidências"',
            subLabel: '"Aceita se não houver evidências suficientes"',
            control: 'Switch bound a settings.autoAcceptIfNoEvidence (disabled se !enableAutoAccept)',
            visualWarning: 'fundo amber + AlertTriangle alerta o operador do risco dessa configuração',
          },
        ],
      },

      // --------------------------------------------------------------------
      // TAB ESCALONAMENTO
      // --------------------------------------------------------------------
      tabEscalation: {
        cardTitle: '"Regras de Escalonamento"',
        cardDescription: '"Defina quando escalar disputas para revisão manual"',
        controls: [
          {
            name: 'Escalar Valores Altos',
            iconBlock: 'DollarSign 5x5 slate-500',
            label: '"Escalar Valores Altos"',
            subLabel: '"Requer aprovação manual para valores acima do threshold"',
            control: 'Switch bound a settings.escalateHighValue',
          },
          {
            name: 'Threshold de Valor Alto',
            input: {
              type: 'number',
              value: 'settings.highValueThreshold',
              width: 'w-32',
              prefix: '"R$"',
              disabled: '!settings.escalateHighValue',
            },
          },
          {
            name: 'Escalar Cliente Recorrente',
            iconBlock: 'Shield 5x5 slate-500',
            label: '"Escalar Cliente Recorrente"',
            subLabel: '"Requer revisão para clientes com histórico de compras"',
            control: 'Switch bound a settings.escalateRecurringCustomer',
          },
        ],
      },

      // --------------------------------------------------------------------
      // TAB NOTIFICAÇÕES
      // --------------------------------------------------------------------
      tabNotifications: {
        cardTitle: '"Configurações de Notificações"',
        cardDescription: '"Defina quando receber alertas do agente"',
        controls: [
          {
            name: 'Nova Disputa Recebida',
            iconBlock: 'Bell 5x5 blue-600',
            label: '"Nova Disputa Recebida"',
            subLabel: '"Notificar quando uma nova disputa for aberta"',
            control: 'Switch bound a settings.notifyNewDispute',
          },
          {
            name: 'Prazo se Aproximando',
            iconBlock: 'Clock 5x5 amber-600',
            label: '"Prazo se Aproximando"',
            subLabel: '"Alertar quando prazo estiver próximo"',
            controls: [
              'Input number bound a deadlineWarningDays w-20 (disabled se !notifyDeadlineApproaching)',
              'span "dias"',
              'Switch bound a settings.notifyDeadlineApproaching',
            ],
          },
          {
            name: 'Resultado de Disputa',
            iconBlock: 'CheckCircle2 5x5 green-600',
            label: '"Resultado de Disputa"',
            subLabel: '"Notificar quando uma disputa for resolvida"',
            control: 'Switch bound a settings.notifyWinLoss',
          },
          {
            name: 'Alerta de Chargeback Ratio',
            iconBlock: 'AlertTriangle 5x5 red-600',
            label: '"Alerta de Chargeback Ratio"',
            subLabel: '"Alertar quando ratio ultrapassar limite"',
            controls: [
              'Input number step=0.1 bound a ratioAlertThreshold w-20 (disabled se !notifyRatioAlert)',
              'span "%"',
              'Switch bound a settings.notifyRatioAlert',
            ],
          },
        ],
      },
    },

    knownGaps: [
      'NÃO PERSISTE — handleSave() apenas alert("Configurações salvas!")',
      'Não lê DisputeAgentConfig do banco — sempre carrega valores hardcoded iniciais',
      'Botão "Resetar" sem onClick',
      'Settings, FileText, Zap, Target importados sem uso',
      'TabsList grid-cols-4 sem responsividade — fica apertado em mobile',
      'Sem confirmação ao trocar de aba com mudanças não salvas',
      'Sem indicador visual de "tem mudanças pendentes"',
      'Slider min=70 — não permite operadores muito conservadores (ex: 50%)',
      'Auto-Aceitar Sem Evidências disabled segue switch master mas visualmente continua amber-50 (UX confuso)',
      'Sem campo para valor MÍNIMO de auto-aceitar (apenas máximo) — pode aceitar disputas de R$1',
      'Sem audit log de alterações — quem mudou o quê quando?',
      'ratioAlertThreshold em % mas sem visualização de qual ratio (CB? Fraude?)',
      'Sem multi-canal: notificação só genérica — não diferencia email/push/SMS',
    ],

    relationshipsToOtherPages: {
      disputeManager: '/DisputeManager — pai (botão Settings + back button ArrowLeft)',
      disputeAgentSettings: '/DisputeAgentSettings — outra página de config do agente (entity DisputeAgentConfig). DUPLICAÇÃO!',
      disputeDashboard: '/DisputeDashboard — onde se vê os efeitos das configurações via AgentDashboardSummary',
    },
  },
};

export default DisputeManagerSettingsDoc;