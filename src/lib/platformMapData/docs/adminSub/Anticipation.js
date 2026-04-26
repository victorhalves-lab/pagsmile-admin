// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /Anticipation
// ============================================================================
// Arquivo dedicado, fidelidade absoluta a pages/Anticipation.jsx (419 linhas).
// Cada tab, cada input do simulador, cada switch, cada regra auto, cada item
// do histórico, cada bloco do dialog de confirmação — documentado.
// ============================================================================

export const AnticipationDoc = {
  pageId: 'Anticipation',
  pagePath: '/Anticipation',
  module: 'Financeiro',
  parentPage: 'FinancialOverview',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Hub de antecipação de recebíveis em 3 abas: (1) Simular e Antecipar — usa AnticipationSimulator com saldo disponível real (sum receivables.net_amount onde is_anticipatable=true) + dialog de confirmação 3-blocos; (2) Auto-Antecipação — Switch master + 3 regras condicionais (all/above_days/above_value) + taxa máxima aceitável; (3) Histórico — lista de antecipações realizadas.',

    threeTabsConcept: {
      simulate: 'Simular e Antecipar — ação manual: usuário escolhe valor, vê simulação, confirma',
      auto: 'Auto-Antecipação — modo automático D+0: sistema antecipa novos recebíveis sem intervenção',
      history: 'Histórico — auditoria de antecipações já realizadas',
    },

    economicLogic: {
      whyAnticipate:
        'Vendas em cartão liquidam em D+30 ou parceladas. Merchant que precisa de capital de giro paga taxa para receber em D+0/D+1.',
      feePercentageMonthly: '1.99% ao mês padrão (config.fee_percentage_monthly)',
      formula: 'fee = grossAmount * (feePercentageMonthly / 100) * (diasAntecipados / 30)',
      netResult: 'netAmount = grossAmount - fee — creditado no saldo disponível em até 1 hora',
    },

    autoAnticipationRules: {
      all: 'Antecipar todo recebível novo — agressivo (D+0 garantido)',
      above_days: 'Apenas recebíveis com D+X ou mais — input numérico auto_min_days (default 15)',
      above_value: 'Apenas recebíveis acima de um valor — input numérico auto_min_value',
      maxFeePercentage: 'Taxa máxima aceitável (%) — só antecipa se taxa efetiva < este valor (default 3%)',
    },

    confirmationDialogStructure: {
      block1: 'Valor Bruto (bg-gray-50)',
      block2: 'Taxa de Antecipação (bg-red-50, sinal negativo)',
      block3: 'Valor Líquido (bg-green-50, font-bold lg)',
      alert: 'Clock icon + "O valor será creditado no seu saldo disponível em até 1 hora."',
    },

    coreCapabilities: [
      '3 Tabs com defaultValue="simulate"',
      'AnticipationSimulator (componente externo) recebe availableAmount + feePercentage + onAnticipate',
      'Resumo lateral com Total Antecipado + Total em Taxas (purple/orange)',
      'Card "Como funciona" 3 passos numerados (1/2/3)',
      'Auto-Antecipação Switch master habilitando 3 inputs condicionais',
      'Alert "fluxo de caixa D+0 automaticamente" com Zap icon',
      'Histórico em lista com Badge "Concluída" + ícone Zap purple',
      'Dialog de confirmação com 3 blocos coloridos antes da execução',
      'Toast (sonner) para feedback de sucesso',
    ],
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/Anticipation.jsx',
    totalLines: 419,

    imports: {
      react: ['useState', 'useMemo'],
      reactQuery: ['useQuery', 'useMutation', 'useQueryClient'],
      base44: 'base44.entities.Receivable / AnticipationConfig',
      sharedComponents: ['PageHeader', 'AnticipationSimulator (components/financial)'],
      uiComponents: [
        'Card+CardContent+CardHeader+CardTitle+CardDescription', 'Button', 'Badge',
        'Label', 'Switch', 'Input',
        'Alert+AlertDescription',
        'Select stack', 'Dialog stack', 'Tabs stack',
      ],
      utilities: ['cn (lib/utils)', 'sonner toast', 'date-fns: format', 'date-fns/locale: ptBR'],
      lucideIcons: [
        'Zap — botão Confirmar Antecipação + ícone do header histórico + Alert',
        'Settings — ícone aba Auto-Antecipação',
        'Clock — Alert no dialog "em até 1 hora"',
        'CheckCircle2 — badge "Concluída" no histórico',
        'AlertTriangle — importado sem uso',
        'TrendingUp — header "Resumo de Antecipações"',
        'Calendar — importado sem uso',
        'History — header tab Histórico + empty state',
        'Info — header "Como funciona"',
      ],
      localUtility: { formatCurrency: 'inline (não usa centralizada)' },
    },

    componentState: {
      showConfirmDialog: { initial: 'false', purpose: 'Dialog de confirmação após simulação' },
      pendingAnticipation: { initial: 'null', purpose: 'Objeto da simulação aguardando confirmação' },
    },

    backendIntegration: {
      queryReceivables: {
        queryKey: "['receivables-anticipatable']",
        queryFn: "base44.entities.Receivable.filter({ status: 'scheduled', is_anticipatable: true })",
        purpose: 'Apenas recebíveis elegíveis para antecipação',
      },
      queryConfigs: {
        queryKey: "['anticipation-config']",
        queryFn: 'base44.entities.AnticipationConfig.list()',
        defaultFallback: '{ is_auto_enabled: false, auto_rule: "all", auto_min_days: 15, fee_percentage_monthly: 1.99, total_anticipated: 0, total_fees_paid: 0 }',
      },
      updateConfigMutation: {
        mutationFn: 'configs[0]?.id ? AnticipationConfig.update(id, data) : .create(data)',
        onSuccess: 'invalidate query + toast.success("Configurações salvas!")',
      },
    },

    derivedState: {
      availableAmount: 'useMemo: receivables.reduce(sum net_amount, 0)',
      anticipationHistory: 'Mock hardcoded: 3 itens {id, date, gross, fee, net, status:completed}',
    },

    handlers: {
      handleAnticipate: 'setPendingAnticipation(simulation) + setShowConfirmDialog(true)',
      confirmAnticipation: {
        steps: ['toast.success(`Antecipação de ${netAmount} solicitada com sucesso!`)', 'setShowConfirmDialog(false)', 'setPendingAnticipation(null)', 'invalidate receivables-anticipatable'],
        gap: 'NÃO PROCESSA REALMENTE — comentário no código: "In real app, this would process the anticipation"',
      },
      handleAutoConfigChange: '(field, value) => updateConfigMutation.mutate({ ...config, [field]: value })',
    },

    layout: {
      pageHeader: {
        title: '"Antecipação de Recebíveis"',
        subtitle: '"Antecipe seus recebíveis e tenha o dinheiro na hora"',
        breadcrumbs: [{ label: 'Financeiro', href: 'Financial' }, { label: 'Antecipação' }],
        actions: 'NENHUM (header sem botões — gap leve)',
      },

      tabs: {
        defaultValue: 'simulate',
        tabsList: ['Simular e Antecipar', 'Auto-Antecipação', 'Histórico'],
      },

      tabSimulate: {
        layout: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
        leftColumn: {
          component: 'AnticipationSimulator',
          props: {
            availableAmount: 'availableAmount memoized',
            feePercentage: 'config.fee_percentage_monthly',
            onAnticipate: 'handleAnticipate',
          },
        },
        rightColumn: {
          statsCard: {
            title: 'TrendingUp + "Resumo de Antecipações"',
            grid: 'grid-cols-2 gap-4',
            cards: [
              { bg: 'bg-purple-50', label: 'purple-600 "Total Antecipado"', value: 'purple-700 formatCurrency(config.total_anticipated)' },
              { bg: 'bg-orange-50', label: 'orange-600 "Total em Taxas"', value: 'orange-700 formatCurrency(config.total_fees_paid)' },
            ],
          },
          infoCard: {
            title: 'Info + "Como funciona"',
            steps: [
              { num: 1, title: 'Escolha o valor', sub: 'Informe quanto deseja antecipar ou selecione "Antecipar tudo"' },
              { num: 2, title: 'Confira a simulação', sub: 'Veja o valor líquido que receberá após a taxa de antecipação' },
              { num: 3, title: 'Receba em até 1 hora', sub: 'O valor será creditado no seu saldo disponível' },
            ],
            stepStyle: 'p-1.5 bg-blue-100 rounded-full + xs font-bold blue-600 (número)',
          },
        },
      },

      tabAuto: {
        card: {
          title: 'Settings + "Configurações de Auto-Antecipação"',
          description: 'Configure para antecipar automaticamente seus recebíveis',
        },
        masterSwitch: {
          wrapper: 'p-4 bg-purple-50 rounded-lg border border-purple-200',
          left: 'Label "Habilitar Auto-Antecipação" + sub "Antecipar automaticamente novos recebíveis"',
          right: 'Switch checked=is_auto_enabled onCheckedChange=handler',
        },
        conditionalInputs: {
          renderIf: 'config.is_auto_enabled === true',

          ruleSelect: {
            label: 'Regra de Auto-Antecipação',
            options: ['all (todo recebível novo)', 'above_days (D+X ou mais)', 'above_value (acima de valor)'],
          },

          aboveDaysInput: {
            renderIf: 'auto_rule === "above_days"',
            label: 'Dias mínimos para antecipar (D+)',
            input: 'type=number max-w-[200px]',
            helper: '"Só antecipará recebíveis com prazo de {auto_min_days} dias ou mais"',
          },

          aboveValueInput: {
            renderIf: 'auto_rule === "above_value"',
            label: 'Valor mínimo para antecipar',
            input: 'type=number max-w-[200px]',
          },

          maxFeeInput: {
            label: 'Taxa máxima aceitável (%)',
            input: 'type=number step=0.1 max-w-[200px] default 3',
            helper: '"Só antecipará se a taxa efetiva for menor que este valor"',
          },
        },
        bottomAlert: {
          icon: 'Zap',
          text: 'Com a auto-antecipação ativa, você terá fluxo de caixa D+0 automaticamente. Taxa atual: <strong>1.99% ao mês</strong>.',
        },
      },

      tabHistory: {
        title: 'History + "Histórico de Antecipações"',
        listLayout: 'space-y-3',
        itemRender: {
          wrapper: 'flex items-center justify-between p-4 bg-gray-50 rounded-lg',
          left: 'Zap purple-600 (bg-purple-100 rounded-lg) + "Antecipação" + format(date, "dd \'de\' MMMM \'de\' yyyy", ptBR)',
          middle: '+R$ {net} (green-600) + "Taxa: R$ {fee}"',
          badge: 'bg-green-100 text-green-700 + CheckCircle2 + "Concluída"',
        },
        emptyState: 'History 12x12 gray-300 + "Nenhuma antecipação realizada ainda"',
      },

      confirmDialog: {
        trigger: 'showConfirmDialog state',
        header: { title: 'Confirmar Antecipação', description: 'Revise os detalhes da antecipação antes de confirmar' },
        body: {
          renderIf: 'pendingAnticipation !== null',
          blocks: [
            { bg: 'bg-gray-50', label: 'Valor Bruto', value: 'font-semibold formatCurrency(grossAmount)' },
            { bg: 'bg-red-50', label: 'red-600 "Taxa de Antecipação"', value: 'red-600 -formatCurrency(fee)' },
            { bg: 'bg-green-50', label: 'green-700 font-medium "Valor Líquido"', value: 'green-700 text-lg font-bold formatCurrency(netAmount)' },
          ],
          alert: 'Clock + "O valor será creditado no seu saldo disponível em até 1 hora."',
        },
        footer: ['Button outline "Cancelar" → setShowConfirmDialog(false)', 'Button bg-purple-600 hover:bg-purple-700 + Zap + "Confirmar Antecipação" → confirmAnticipation()'],
      },
    },

    knownGaps: [
      'confirmAnticipation só toast — NÃO processa antecipação real (comentário explícito no código)',
      'auto_min_value não tem helper text como auto_min_days',
      'Dialog de confirmação não mostra prazo médio (quantos dias está sendo antecipado)',
      'Histórico hardcoded com 3 items — não vem do backend',
      'Total Antecipado/Taxas não são atualizados após confirmação (não chamada update config)',
      'AlertTriangle e Calendar (lucide) importados sem uso',
      'PageHeader sem actions — falta CTA "Ver Recebíveis" / "Configurar Auto"',
      'Não há filtro de período no histórico',
      'Sem badge mostrando "auto-antecipado" vs "manual" no histórico',
      'breadcrumbs.href "Financial" — possível alias quebrado',
      'Switch master ativa o config no save mas inputs ficam visíveis SEM salvar — UX confuso',
    ],

    relationshipsToOtherPages: {
      financialOverview: '/FinancialOverview — pai (breadcrumb + Quick Link)',
      receivablesAgenda: '/ReceivablesAgenda — origem dos recebíveis is_anticipatable',
      financialStatement: '/FinancialStatement — entries category=anticipation aparecem aqui',
      fees: '/Fees — taxa de antecipação 1.99% também documentada lá',
    },
  },
};

export default AnticipationDoc;