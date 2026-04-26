// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /FinancialStatement
// ============================================================================
// Arquivo dedicado, fidelidade absoluta a pages/FinancialStatement.jsx (343 linhas).
// Cada card de resumo, cada filtro, cada preset de período, cada categoria,
// cada formato de export, cada cálculo de saldo — documentado individualmente.
// ============================================================================

export const FinancialStatementDoc = {
  pageId: 'FinancialStatement',
  pagePath: '/FinancialStatement',
  module: 'Financeiro',
  parentPage: 'FinancialOverview',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Extrato financeiro completo do merchant — lista todas as movimentações (entries) da conta com filtros poderosos (preset de período, categoria, direção crédito/débito), 4 cards de resumo (Saldo Inicial / Total Entradas / Total Saídas / Saldo Final) e exportação em 4 formatos (CSV, XLSX, PDF, OFX) para reconciliação contábil externa.',

    whyAStatementPage: {
      reasoning:
        'Sem o extrato, merchant não confia no sistema. Esta tela é o "livro razão" da conta — fonte da verdade para batimento de impostos, conciliação com ERPs externos e auditoria. Cada credit e cada debit tem que estar aqui.',
      contabilidade:
        'Contadores brasileiros pedem OFX para importar no sistema deles, planilha Excel para batimento manual, e PDF assinado para arquivamento legal — todos os 3 são suportados.',
    },

    nineCategoriesOfMovement: {
      sale: 'Vendas — credit por aprovação de transação (PIX, cartão, boleto)',
      refund: 'Estornos — debit por reembolso ao cliente',
      chargeback: 'Chargebacks — debit por contestação perdida',
      withdrawal: 'Saques — debit por transferência para conta bancária do merchant',
      anticipation: 'Antecipações — credit/debit por antecipação de recebíveis (paga taxa)',
      fee: 'Taxas — debit por MDR, mensalidade, integração',
      adjustment: 'Ajustes — credit/debit manual da operadora (correção de erro)',
      split: 'Split — debit/credit por divisão de pagamento entre múltiplos beneficiários',
      // 9: 'all' — não é uma categoria real, apenas filtro
    },

    sixPeriodPresets: {
      today: 'Hoje — from=today, to=today',
      yesterday: 'Ontem — from=yesterday, to=yesterday (single day)',
      sevenDays: 'Últimos 7 dias — from=now-7d, to=now',
      thirtyDays: 'Últimos 30 dias — DEFAULT inicial',
      thisMonth: 'Este mês — from=startOfMonth, to=endOfMonth (date-fns)',
      custom: 'Personalizado — abre Popover Calendar mode=range numberOfMonths=2',
    },

    fourSummaryCards: {
      startingBalance: {
        what: 'Saldo Inicial — saldo antes da primeira entry do período filtrado',
        formula:
          'filteredEntries[last]?.balance_after - filteredEntries[last]?.amount (calcula reverso da última entry)',
        gap: 'Lógica frágil: se a última entry for um debit, balance_after - amount NÃO dá o saldo anterior corretamente — deveria ser balance_after ± amount conforme type',
      },
      totalCredits: {
        what: 'Total Entradas — soma de todas as entries type="credit" do período',
        countSubtitle: '`{creditCount} lançamentos`',
        color: 'bg-green-50 border-green-200',
      },
      totalDebits: {
        what: 'Total Saídas — soma de todas as entries type="debit" do período',
        color: 'bg-red-50 border-red-200',
      },
      endingBalance: {
        what: 'Saldo Final — balance_after da entry MAIS RECENTE (filteredEntries[0])',
        color: 'bg-blue-50 border-blue-200',
      },
    },

    fourExportFormats: {
      csv: 'CSV — texto simples, separado por vírgulas. Universal',
      xlsx: 'Excel — formato nativo do Microsoft Excel, mantém formatação',
      pdf: 'PDF — relatório formatado para impressão e arquivamento',
      ofx: 'OFX — Open Financial Exchange, padrão para importar em ERPs/contadores',
      gap: 'TODOS os 4 botões só fazem console.log("Exporting...") — sem implementação real',
    },

    coreCapabilities: [
      '4 cards summary com cores semânticas (gray/green/red/blue)',
      'Período via Select preset OU Popover Calendar mode=range',
      'Filtro de categoria (9 opções) + filtro direção (credit/debit/all)',
      'Badge dinâmico mostrando "{N} lançamentos" filtrados',
      'FinancialStatementTable como componente externo',
      'DropdownMenu de exportação com 4 formatos',
      'RefreshCcw button para forçar refetch da query',
    ],
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/FinancialStatement.jsx',
    totalLines: 343,

    imports: {
      react: ['useState', 'useMemo'],
      reactQuery: ['useQuery'],
      base44: 'base44.entities.FinancialEntry',
      uiComponents: [
        'PageHeader (shared)',
        'FinancialStatementTable (components/financial)',
        'Card+CardContent+CardHeader+CardTitle',
        'Button', 'Input', 'Label', 'Badge',
        'Select stack',
        'Popover+PopoverContent+PopoverTrigger',
        'Calendar (shadcn)',
        'DropdownMenu+DropdownMenuContent+DropdownMenuItem+DropdownMenuTrigger',
      ],
      utilities: ['cn (lib/utils)', 'date-fns: format, subDays, startOfMonth, endOfMonth', 'date-fns/locale: ptBR'],
      lucideIcons: [
        'Download — botão Exportar header',
        'Calendar (alias CalendarIcon) — Popover trigger',
        'Filter — importado, sem uso ativo',
        'FileSpreadsheet — opções CSV e Excel no dropdown',
        'FileText — opção PDF',
        'File — opção OFX',
        'Mail — importado, sem uso',
        'RefreshCcw — botão Atualizar',
        'ArrowUpCircle — card Total Entradas (verde)',
        'ArrowDownCircle — card Total Saídas (vermelho)',
        'TrendingUp — cards Saldo Inicial (cinza) e Saldo Final (azul)',
      ],
      localUtility: {
        formatCurrency: 'Definida INLINE — gap (duplica utils)',
      },
      constants: {
        periodPresets: 'Array de 6 objetos { label, value }',
        categoryOptions: 'Array de 9 objetos { label, value } — Todos/Vendas/Estornos/Chargebacks/Saques/Antecipações/Taxas/Ajustes/Split',
      },
    },

    componentState: {
      periodPreset: { initial: "'30days'", purpose: 'Preset selecionado no Select' },
      dateRange: { initial: '{ from: subDays(now, 30), to: now }', purpose: 'Janela de datas efetiva' },
      categoryFilter: { initial: "'all'", purpose: 'Filtro de categoria' },
      typeFilter: { initial: "'all'", purpose: 'Filtro de direção (credit/debit)' },
    },

    backendIntegration: {
      query: {
        queryKey: "['financial-entries', dateRange]",
        queryFn: 'base44.entities.FinancialEntry.list("-created_date", 500)',
        purpose: 'Últimas 500 entries — alimenta tabela e summary',
        criticalDetail:
          'queryKey inclui dateRange como chave — invalida quando muda. Mas queryFn NÃO usa dateRange para filtrar no backend! Filtragem é só no frontend (gap de eficiência)',
      },
    },

    filtersAndCalculations: {
      filteredEntries: {
        function: 'useMemo dependente de [entries, dateRange, categoryFilter, typeFilter]',
        chain: '3 condições AND',
        inDateRange: 'entryDate >= dateRange.from && entryDate <= dateRange.to',
        matchesCategory: 'categoryFilter === "all" || entry.category === categoryFilter',
        matchesType: 'typeFilter === "all" || entry.type === typeFilter',
      },

      summary: {
        function: 'useMemo dependente de [filteredEntries]',
        credits: "filteredEntries.filter(e => e.type === 'credit')",
        debits: "filteredEntries.filter(e => e.type === 'debit')",
        derived: {
          totalCredits: 'credits.reduce(sum amount, 0)',
          totalDebits: 'debits.reduce(sum amount, 0)',
          creditCount: 'credits.length',
          debitCount: 'debits.length',
          startingBalance:
            'filteredEntries[last].balance_after - filteredEntries[last].amount (gap: lógica frágil)',
          endingBalance: 'filteredEntries[0].balance_after',
        },
      },
    },

    handlers: {
      handlePeriodChange: {
        signature: '(preset: string) => void',
        switchCases: {
          today: 'setDateRange({ from: today, to: today })',
          yesterday: 'yesterday = subDays(today, 1); setDateRange({ from: yesterday, to: yesterday })',
          '7days': 'setDateRange({ from: subDays(today, 7), to: today })',
          '30days': 'setDateRange({ from: subDays(today, 30), to: today })',
          thisMonth: 'setDateRange({ from: startOfMonth(today), to: endOfMonth(today) })',
          default: 'break (não muda dateRange — caso "custom" mantém range atual e abre o Popover)',
        },
      },

      handleExport: {
        signature: '(format: "csv"|"xlsx"|"pdf"|"ofx") => void',
        implementation: 'console.log(`Exporting as ${format}...`)',
        gap: 'NÃO IMPLEMENTADO — apenas log no console. Em produção precisa chamar backend function que gera o arquivo',
      },
    },

    layout: {
      rootContainer: 'div className="space-y-6"',

      pageHeader: {
        title: '"Extrato Financeiro"',
        subtitle: '"Histórico completo de todas as movimentações"',
        breadcrumbs: [{ label: 'Financeiro', href: 'Financial' }, { label: 'Extrato' }],
        actions: [
          'Button outline + RefreshCcw + "Atualizar" → onClick refetch()',
          'DropdownMenu trigger Button outline + Download + "Exportar" → 4 opções no menu',
        ],
        criticalDetail: 'Header NÃO tem botão de "Voltar" — usuário usa breadcrumbs ou sidebar',
      },

      summaryCards: {
        layout: 'grid grid-cols-1 md:grid-cols-4 gap-4',
        cards: [
          {
            name: 'Saldo Inicial',
            color: 'default (white)',
            iconBox: 'p-2 bg-gray-100 rounded-lg + TrendingUp 5x5 gray-600',
            label: 'text-sm gray-500 "Saldo Inicial"',
            value: 'text-lg font-semibold formatCurrency',
          },
          {
            name: 'Total Entradas',
            color: 'bg-green-50 border-green-200',
            iconBox: 'bg-green-100 + ArrowUpCircle 5x5 green-600',
            label: 'text-sm green-700',
            value: 'text-lg font-semibold green-700',
            extraText: 'text-xs green-600 "{creditCount} lançamentos"',
          },
          {
            name: 'Total Saídas',
            color: 'bg-red-50 border-red-200',
            iconBox: 'bg-red-100 + ArrowDownCircle 5x5 red-600',
            label: 'red-700',
            value: 'red-700',
            extraText: 'red-600 "{debitCount} lançamentos"',
          },
          {
            name: 'Saldo Final',
            color: 'bg-blue-50 border-blue-200',
            iconBox: 'bg-blue-100 + TrendingUp 5x5 blue-600',
            label: 'blue-700',
            value: 'blue-700',
          },
        ],
      },

      filtersCard: {
        wrapper: 'Card → CardContent p-4',
        layout: 'flex flex-wrap items-end gap-4',

        periodSelect: {
          width: 'w-[180px]',
          label: 'Period',
          value: 'periodPreset',
          onValueChange: 'handlePeriodChange',
          options: 'periodPresets array (6 opções)',
        },

        customDatePopover: {
          renderIf: 'periodPreset === "custom"',
          trigger: {
            variant: 'outline',
            width: 'w-[240px] justify-start',
            content: 'CalendarIcon + (formatted "from - to") OR "Selecione o período"',
          },
          popoverContent: {
            align: 'start',
            calendar: {
              mode: 'range',
              selected: 'dateRange',
              onSelect: 'setDateRange',
              locale: 'ptBR',
              numberOfMonths: 2,
            },
          },
        },

        categorySelect: {
          width: 'w-[160px]',
          label: 'Tipo de Movimentação',
          value: 'categoryFilter',
          options: 'categoryOptions array (9 opções)',
        },

        typeSelect: {
          width: 'w-[140px]',
          label: 'Direção',
          options: ['Todas (all)', 'Entradas (credit)', 'Saídas (debit)'],
        },

        countBadge: {
          variant: 'outline',
          height: 'h-9 px-3',
          content: '`${filteredEntries.length} lançamentos`',
        },
      },

      statementTable: {
        wrapper: 'Card → CardContent p-0',
        component: 'FinancialStatementTable (components/financial/FinancialStatementTable)',
        props: { entries: 'filteredEntries', isLoading: 'isLoading' },
        purpose: 'Componente externo renderiza a tabela completa — colunas de data/descrição/valor/saldo',
      },

      exportDropdown: {
        location: 'dentro do PageHeader actions',
        trigger: 'Button outline + Download + "Exportar"',
        items: [
          { format: 'csv', icon: 'FileSpreadsheet', label: 'Exportar CSV' },
          { format: 'xlsx', icon: 'FileSpreadsheet', label: 'Exportar Excel' },
          { format: 'pdf', icon: 'FileText', label: 'Exportar PDF' },
          { format: 'ofx', icon: 'File', label: 'Exportar OFX' },
        ],
        onClickEach: 'handleExport(format) → console.log apenas',
      },
    },

    knownGaps: [
      'queryFn não usa dateRange como filtro no backend — busca 500 últimas e filtra frontend',
      'handleExport apenas console.log — sem implementação real de download',
      'startingBalance com lógica frágil (balance_after - amount não considera direção)',
      'formatCurrency redefinida inline em vez de importar centralizada',
      'Filter (lucide), Mail (lucide) e Input (ui) importados sem uso',
      'Sem busca por descrição/ID nos filtros — só categoria + tipo',
      'Sem ordenação clicável nas colunas (depende do FinancialStatementTable)',
      'Sem paginação visível — limitado a 500 entries do backend',
      'Sem totais por categoria (apenas total geral credit/debit)',
      'Calendar custom permite from > to silenciosamente (sem validação)',
      'Sem toast de feedback nos exports — usuário não sabe que clicou',
      'breadcrumbs.href: "Financial" — página com esse nome talvez não exista (deveria ser "FinancialOverview")',
    ],

    relationshipsToOtherPages: {
      financialOverview: '/FinancialOverview — pai do módulo via breadcrumb',
      receivablesAgenda: '/ReceivablesAgenda — outra ótica do mesmo dado (futuro vs passado)',
      withdrawals: '/Withdrawals — entries com category=withdrawal aparecem aqui',
      anticipation: '/Anticipation — entries com category=anticipation aparecem aqui',
      splitManagement: '/SplitManagement — entries com category=split aparecem aqui',
    },
  },
};

export default FinancialStatementDoc;