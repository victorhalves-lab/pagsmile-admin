// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /Withdrawals
// ============================================================================
// Arquivo dedicado, fidelidade absoluta a pages/Withdrawals.jsx (463 linhas).
// Cada card de saldo, cada filtro, cada coluna da tabela, cada bloco do
// SideDrawer, cada quick-button (50%/Tudo), cada validação — documentado.
// ============================================================================

export const WithdrawalsDoc = {
  pageId: 'Withdrawals',
  pagePath: '/Withdrawals',
  module: 'Financeiro',
  parentPage: 'FinancialOverview',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Tela de saques do merchant — 4 cards horizontais (Disponível para antecipar D+2 / Em processamento / Bloqueado em disputas / Disponível para saque) + busca/filtro de status + tabela de histórico + SideDrawer "Solicitar Saque" com seleção PIX/TED, conta destino, quick-buttons 50%/Tudo, e validação de mínimo R$ 10 + saldo suficiente.',

    fourBalanceCards: {
      anticipateBalance: {
        what: 'Disponível para antecipar (D+2) — Zap yellow',
        value: 'R$ 12.500 (HARDCODED)',
        cta: 'Button outline "Antecipar" (gap: sem onClick)',
      },
      anticipationProcessing: {
        what: 'Antecipação em processamento — Clock blue',
        value: 'R$ 3.200 (HARDCODED)',
        cta: 'Button outline "Ver status" (gap: sem onClick)',
      },
      blockedInDisputes: {
        what: 'Valor bloqueado em disputas — Lock red',
        value: 'R$ 1.800 (HARDCODED)',
        cta: 'Button outline "Ver disputas" (gap: sem onClick)',
      },
      availableBalance: {
        what: 'Disponível para saque — Wallet emerald',
        value: 'R$ 45.680,50 (HARDCODED)',
        cta: 'Button bg-#2bc196 "Sacar" + ChevronRight → abre SideDrawer',
      },
    },

    twoTransferTypes: {
      pix: 'Pix — Instantâneo (D+0). Cor verde quando selecionado',
      ted: 'TED — D+0 / D+1. Cor azul quando selecionado',
      defaultType: 'pix',
    },

    fiveStatuses: {
      pending: 'Pendente — Clock + bg-yellow-100',
      processing: 'Processando — Loader2 (animate-spin) + bg-blue-100',
      completed: 'Concluído — CheckCircle2 + bg-green-100',
      failed: 'Falhou — XCircle + bg-red-100',
      cancelled: 'Cancelado — XCircle + bg-gray-100',
    },

    sideDrawerStructure: {
      title: 'Solicitar Saque + ArrowUpFromLine',
      block1: 'Saldo disponível (bg-green-50, text-2xl green-800)',
      block2: 'Input "Valor do saque" + 2 quick-buttons (50% e Tudo)',
      block3: 'Toggle Pix / TED (2 cards visuais com border colorido no selecionado)',
      block4: 'Select "Conta de destino" populated com bankAccounts',
      block5: 'Alert amber se config.withdrawal_fee_type !== "free"',
      footer: 'Cancelar + "Confirmar saque" (disabled se !amount || !accountId || isPending)',
    },

    coreCapabilities: [
      'h1 simples (PageHeader removido — comentário explícito no código)',
      '4 cards em grid divisível por 4 (sm:divide-x)',
      'Search input com Search icon + Status Select + Botão Exportar',
      'Tabela 4 colunas: ID / Valor / Status / Criação',
      'SideDrawer (não Dialog!) para fluxo de saque',
      'i18n via useTranslation (statusConfig dinâmico via getStatusConfig(t))',
      'Validações: minWithdrawal R$ 10, saldo suficiente — toast.error',
      'Loader2 spin no botão durante mutation',
    ],
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/Withdrawals.jsx',
    totalLines: 463,

    imports: {
      react: ['useState'],
      i18n: 'useTranslation (chaves: common.pending/processing/completed/failed/cancelled)',
      reactQuery: ['useQuery', 'useMutation', 'useQueryClient'],
      base44: 'base44.entities.Withdrawal / BankAccount / WithdrawalConfig',
      sharedComponents: ['SideDrawer (NÃO usa PageHeader — h1 simples — comentário explícito)'],
      uiComponents: [
        'Card stack', 'Button', 'Badge', 'Input', 'Label', 'Switch (importado sem uso)',
        'Select stack', 'Table stack',
      ],
      utilities: ['cn (lib/utils)', 'sonner toast', 'date-fns format', 'date-fns/locale ptBR'],
      lucideIcons: [
        'ArrowUpFromLine — header SideDrawer + botão confirmar',
        'Wallet — Card 4 saldo disponível + bg emerald',
        'Building2 — TED toggle',
        'QrCode — Pix toggle',
        'Plus — importado sem uso',
        'Settings — importado sem uso',
        'Clock — Card 2 (processing) + status pending',
        'CheckCircle2 — status completed',
        'XCircle — status failed/cancelled',
        'Loader2 — status processing (animate-spin) + botão durante mutation',
        'AlertTriangle — importado sem uso',
        'Download — botão Exportar',
        'RefreshCcw — importado sem uso',
        'CreditCard — importado sem uso',
        'Zap — Card 1 (antecipar)',
        'Info — botões "i" em cada card de saldo',
        'Lock — Card 3 (bloqueado)',
        'Search — input de busca',
        'ChevronRight — botão Sacar',
      ],
      localUtility: { formatCurrency: 'inline' },
    },

    componentState: {
      showWithdrawDialog: { initial: 'false', purpose: 'Controla SideDrawer' },
      showAccountDialog: { initial: 'false', purpose: 'State criado mas SEM USO — gap' },
      withdrawAmount: { initial: "''", purpose: 'Valor digitado no input' },
      selectedAccountId: { initial: "''", purpose: 'Conta destino selecionada' },
      withdrawType: { initial: "'pix'", purpose: 'pix ou ted' },
      searchQuery: { initial: "''", purpose: 'Filtro de busca por ID/valor' },
      statusFilter: { initial: "'all'", purpose: 'Filtro de status' },
    },

    backendIntegration: {
      queryWithdrawals: {
        queryKey: "['withdrawals']",
        queryFn: 'base44.entities.Withdrawal.list("-created_date", 100)',
      },
      queryBankAccounts: {
        queryKey: "['bank-accounts']",
        queryFn: "base44.entities.BankAccount.filter({ status: 'active' })",
      },
      queryConfigs: {
        queryKey: "['withdrawal-config']",
        queryFn: 'base44.entities.WithdrawalConfig.list()',
        defaultFallback: '{ is_auto_enabled:false, auto_frequency:daily, min_amount_to_withdraw:100, keep_minimum_balance:0, withdrawal_fee_type:free, withdrawal_fee_value:0 }',
      },
      createWithdrawalMutation: {
        mutationFn: 'base44.entities.Withdrawal.create(data)',
        onSuccess: 'invalidate withdrawals + toast "Saque solicitado com sucesso!" + close dialog + reset amount',
      },
      updateConfigMutation: {
        mutationFn: 'configs[0]?.id ? update : create',
        gap: 'Mutation declarada mas SEM USO no JSX — função handleConfigChange é dead code',
      },
    },

    constants: {
      availableBalance: '45680.50 (HARDCODED — comentário "Simulated available balance")',
      minWithdrawal: '10 (HARDCODED — DIFERE de config.min_amount_to_withdraw=100, gap)',
      anticipateBalance: '12500.00 (HARDCODED)',
      anticipationProcessing: '3200.00 (HARDCODED)',
      blockedInDisputes: '1800.00 (HARDCODED)',
    },

    handlers: {
      handleWithdraw: {
        validation1: 'isNaN(amount) || amount < 10 → toast.error "Valor mínimo R$ 10,00"',
        validation2: 'amount > availableBalance → toast.error "Saldo insuficiente"',
        payload: {
          withdrawal_id: '`WD-${Date.now()}`',
          amount: 'parseFloat',
          fee: 'config.fee_type === fixed ? fee_value : 0',
          net_amount: 'amount - fee',
          type: '"manual"',
          bankFields: 'bank_name, bank_code, agency, account_number, account_type da selectedAccount',
          pixFields: 'pix_key, pix_key_type apenas se withdrawType === pix',
          status: '"pending"',
        },
      },
      handleConfigChange: 'updateConfigMutation.mutate({ ...config, [field]: value }) — DEAD CODE',
    },

    derivedState: {
      filteredWithdrawals: {
        chain: 'matchesSearch && matchesStatus',
        matchesSearch: '!searchQuery || withdrawal_id.includes lowercase || String(amount).includes',
        matchesStatus: 'statusFilter === all || w.status === statusFilter',
      },
    },

    layout: {
      header: 'h1 text-2xl font-bold text-slate-800 "Saques" (sem PageHeader — comentário explícito no código)',

      summaryCards: {
        wrapper: 'Card → CardContent p-0',
        layout: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100',
        cards: [
          {
            id: 1,
            label: 'Zap yellow + "Disponível para antecipar (D+2)"',
            value: 'text-2xl font-bold formatCurrency(anticipateBalance)',
            cta: 'Button outline sm "Antecipar"',
            iconCorner: 'Info hover-effect',
          },
          {
            id: 2,
            label: 'Clock blue + "Antecipação em processamento"',
            value: 'formatCurrency(anticipationProcessing)',
            cta: '"Ver status"',
          },
          {
            id: 3,
            label: 'Lock red + "Valor bloqueado em disputas"',
            value: 'formatCurrency(blockedInDisputes)',
            cta: '"Ver disputas"',
          },
          {
            id: 4,
            label: 'Wallet emerald + "Disponível para saque"',
            value: 'formatCurrency(availableBalance)',
            cta: 'Button bg-#2bc196 hover:bg-#239b7a "Sacar" + ChevronRight → setShowWithdrawDialog(true)',
          },
        ],
      },

      filters: {
        layout: 'flex items-center gap-3',
        searchInput: 'Input + Search icon absolute left-3 + placeholder "Pesquisar por ID, valor"',
        statusSelect: {
          width: 'w-[140px]',
          options: ['all (Todos)', 'pending (Pendente)', 'processing (Processando)', 'completed (Concluído)', 'failed (Falhou)', 'cancelled (Cancelado)'],
        },
        exportButton: 'Button outline sm + Download + "Exportar" (gap: sem onClick)',
      },

      table: {
        wrapper: 'Card → CardContent p-0',
        headers: ['ID de pagamento', 'Valor', 'Status', 'Criação'],
        headerClass: 'bg-slate-50',
        rowRender: {
          col1: 'font-medium slate-700 withdrawal_id',
          col2: 'font-semibold formatCurrency(amount)',
          col3: 'Badge gap-1 com statusConf.color + Icon (animate-spin se processing) + label',
          col4: 'text-slate-500 format(created_date, "dd/MM/yyyy HH:mm")',
        },
        emptyState: 'text-center py-16 slate-400 "Nenhum dado encontrado"',
        gap: 'Sem coluna de ações (visualizar/cancelar) + sem paginação visível',
      },

      withdrawSideDrawer: {
        component: 'SideDrawer',
        props: { open: 'showWithdrawDialog', onOpenChange: 'setShowWithdrawDialog', title: 'Solicitar Saque', description: 'Transfira o saldo disponível para sua conta bancária', icon: 'ArrowUpFromLine' },

        body: [
          {
            id: 'balanceCard',
            wrapper: 'p-4 bg-green-50 rounded-lg',
            text: 'Saldo disponível + 2xl bold green-800 formatCurrency(availableBalance)',
          },
          {
            id: 'amountInput',
            label: 'Valor do saque',
            input: 'type=number placeholder "0,00"',
            quickButtons: [
              'Button outline sm "50%" → setWithdrawAmount(String(availableBalance / 2))',
              'Button outline sm "Tudo" → setWithdrawAmount(String(availableBalance))',
            ],
          },
          {
            id: 'transferTypeToggle',
            label: 'Tipo de transferência',
            layout: 'grid grid-cols-2 gap-3',
            buttons: [
              {
                type: 'pix',
                icon: 'QrCode',
                label: 'Pix + sub "Instantâneo"',
                activeStyle: 'border-green-500 bg-green-50 + green-600',
                inactiveStyle: 'hover:bg-gray-50 + gray-400',
              },
              {
                type: 'ted',
                icon: 'Building2',
                label: 'TED + sub "D+0 / D+1"',
                activeStyle: 'border-blue-500 bg-blue-50 + blue-600',
              },
            ],
          },
          {
            id: 'destinationAccount',
            label: 'Conta de destino',
            select: 'placeholder "Selecione uma conta" + map(bankAccounts → "{bank_name} - {pix_key || account_number}")',
          },
          {
            id: 'feeAlert',
            renderIf: 'config.withdrawal_fee_type !== "free"',
            wrapper: 'p-3 bg-yellow-50 rounded-lg',
            text: 'Taxa de saque: fixed → R$ value, percentage → X%',
          },
        ],

        footer: [
          'Button outline "Cancelar" → setShowWithdrawDialog(false)',
          {
            primary: 'Button "Confirmar saque"',
            disabled: '!withdrawAmount || !selectedAccountId || createWithdrawalMutation.isPending',
            iconLogic: 'isPending ? Loader2 animate-spin : ArrowUpFromLine',
          },
        ],
      },
    },

    knownGaps: [
      'showAccountDialog state criado mas sem uso',
      'updateConfigMutation declarada mas nunca disparada',
      'handleConfigChange é dead code',
      'minWithdrawal hardcoded 10 difere de config.min_amount_to_withdraw 100',
      '4 saldos são 100% HARDCODED (anticipate, processing, blocked, available)',
      'Botões dos cards 1/2/3 sem onClick (Antecipar, Ver status, Ver disputas)',
      'Botão Exportar sem onClick',
      'Switch, Plus, Settings, AlertTriangle, RefreshCcw, CreditCard importados sem uso',
      'Sem coluna de ações na tabela (cancelar saque pendente, ver detalhes)',
      'Sem paginação na tabela (limite 100 do backend)',
      'PageHeader removido com comentário "// PageHeader removed - using simple h1" — quebra padrão',
      'i18n parcial: tabela e botões em PT-BR hardcoded, só status traduzidos',
      'Tooltips dos botões "i" sem implementação real (apenas hover style)',
      'Sem confirmação dupla antes de saque alto valor',
      'Sem tag visual para diferentiar saque manual vs automático',
    ],

    relationshipsToOtherPages: {
      financialOverview: '/FinancialOverview — pai do módulo (Quick Link + ação handleBalanceAction("withdraw"))',
      anticipation: '/Anticipation — destino esperado do botão "Antecipar" do Card 1',
      disputeDashboard: '/DisputeDashboard — destino esperado do botão "Ver disputas" do Card 3',
      financialStatement: '/FinancialStatement — entries category=withdrawal aparecem aqui',
      adminIntWithdrawals: '/AdminIntWithdrawals — visão admin interno (aprovações)',
      adminIntWithdrawalApprovals: '/AdminIntWithdrawalApprovals — fluxo de aprovação manual',
    },
  },
};

export default WithdrawalsDoc;