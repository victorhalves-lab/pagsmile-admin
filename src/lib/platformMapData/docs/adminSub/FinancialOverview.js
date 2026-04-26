// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /FinancialOverview
// ============================================================================
// Arquivo dedicado, fidelidade absoluta a pages/FinancialOverview.jsx (372 linhas).
// Cada KPI, cada bucket de aging, cada gráfico, cada quick link, cada lista,
// cada handler de ação, cada fallback de mock — documentado individualmente.
// ============================================================================

export const FinancialOverviewDoc = {
  pageId: 'FinancialOverview',
  pagePath: '/FinancialOverview',
  module: 'Financeiro',
  parentPage: null,

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Hub central do módulo Financeiro do merchant — visão consolidada em UMA tela dos 4 saldos críticos (Disponível / A Receber / Bloqueado / Em Trânsito), aging dos recebíveis em 4 buckets (7d / 8-14d / 15-30d / >30d), gráfico de fluxo de caixa de 7-30 dias e atalhos rápidos para todas as ferramentas financeiras.',

    fourBalanceConcepts: {
      available: {
        what: 'available — Saldo LÍQUIDO já liberado, pronto para saque imediato',
        composition: 'Recebíveis cujo settlement_date já passou + ajustes manuais positivos - tarifas debitadas',
        action: 'Pode ser sacado via /Withdrawals OU usado para anteceder novos recebíveis',
        riskNote: 'Sem risco — dinheiro já é do merchant',
      },
      pending: {
        what: 'pending — A Receber (futuro). Soma de todos os Receivables com status="scheduled" e settlement_date > hoje',
        composition: 'Vendas em parcelas D+30/60/90, vendas com retenção de antifraude, vendas sub judice',
        action: 'NÃO pode ser sacado, mas pode ser ANTECIPADO via /Anticipation pagando taxa',
        riskNote: 'Risco de chargeback futuro — pode reduzir antes de liberar',
      },
      blocked: {
        what: 'blocked — Saldo Bloqueado, separado por motivos específicos',
        commonReasons: ['Reserva de Chargeback (5-10% retidos)', 'Disputas em curso', 'Investigação de fraude', 'Decisão judicial'],
        action: 'Não há ação possível pelo merchant — só destravado pela operadora após resolução',
        riskNote: 'ALTO risco — pode virar débito permanente se merchant perder a disputa',
      },
      inTransit: {
        what: 'inTransit — Em Trânsito (saques sendo processados)',
        composition: 'Sum(amount) das Withdrawals com status="processing"',
        action: 'Aguardar liquidação — geralmente D0 PIX ou D+1 TED',
        riskNote: 'Baixo — apenas timing entre solicitação e crédito na conta-destino',
      },
    },

    fourAgingBuckets: {
      next7Days: 'Próximos 7 dias — recebíveis com settlement_date entre hoje+1 e hoje+7',
      next8to14Days: '8 a 14 dias — janela secundária crítica para planejamento',
      next15to30Days: '15 a 30 dias — meio do mês fiscal típico',
      above30Days: 'Acima de 30 dias — cauda longa de parcelados D+60/90/180',
      whyBuckets: 'Operações pequenas precisam saber em que janela o dinheiro chega — 7d para folha, 30d para impostos',
    },

    coreCapabilities: [
      'BalanceSummaryCards: 4 cards principais com total + breakdown por categoria + ações',
      'Quick Links: 5 atalhos coloridos (Extrato/Recebíveis/Antecipação/Split/Saques) em grid',
      'Cash Flow Chart: AreaChart de entradas (verde) vs saídas (vermelho) com seletor de período (7/15/30 dias)',
      'Receivables Preview: BarChart com 4 buckets de aging + total a receber',
      'Recent Movements: lista das 5 últimas FinancialEntries com ícones credit/debit',
      'Header com 2 CTAs: "Extrato" (outline) + "Sacar" (verde) com Link asChild',
    ],

    whoUsesIt: [
      'Operacional do merchant: monitora saldos diariamente para decidir saques',
      'Financeiro/Tesouraria: planeja fluxo de caixa baseado nos buckets',
      'CEO/Gestor: visão one-pager da saúde financeira',
    ],

    fallbackMockBehavior: {
      what: 'Quando entries/receivables retornam vazio do backend, valores mock são usados:',
      mockValues: {
        available: 'R$ 45.680,50 hardcoded',
        pending: 'R$ 125.450,00 (se totalPending = 0)',
        blocked: 'R$ 8.500,00',
        inTransit: 'R$ 3.200,00 (se withdrawals vazias)',
        breakdown: 'Cada bucket fallback: 28500 / 32100 / 41200 / 23650',
        chartData: 'Math.random() * 5000 + 2000 para entradas, * 2000 + 500 para saídas',
      },
      why: 'Demo bonita quando o app é novo — gap em produção: deveria mostrar zeros honestos',
    },
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/FinancialOverview.jsx',
    totalLines: 372,

    imports: {
      react: ['useState', 'useMemo'],
      i18n: 'useTranslation (react-i18next) — chaves: financial.title, financial.overview, financial.statement, financial.withdraw, financial.cash_flow, financial.entries, financial.exits, financial.next_receivables, financial.view_schedule, financial.total_receivable, financial.recent_movements, financial.view_full_statement, financial.no_recent_movements, financial.days, financial.receivables, financial.anticipation, financial.withdrawals, menu.split',
      reactQuery: 'useQuery (3 queries paralelas)',
      base44: 'base44.entities.FinancialEntry / Receivable / Withdrawal',
      navigation: ['Link (react-router-dom)', 'createPageUrl from ../utils'],
      sharedComponents: ['PageHeader', 'BalanceSummaryCards (componente próprio)'],
      uiComponents: [
        'Card+CardContent+CardHeader+CardTitle+CardDescription',
        'Button',
        'Badge (importado, sem uso ativo)',
        'Tabs+TabsContent+TabsList+TabsTrigger (importados, sem uso)',
        'Select stack',
      ],
      utilities: ['cn', 'formatCurrency (definido inline)', 'date-fns: format/subDays/addDays/differenceInDays', 'date-fns/locale: ptBR'],
      recharts: ['AreaChart', 'Area', 'XAxis', 'YAxis', 'CartesianGrid', 'Tooltip', 'ResponsiveContainer', 'BarChart', 'Bar'],
      lucideIcons: [
        'FileText — botão Extrato + Quick Link Statement',
        'Calendar — Quick Link Receivables',
        'Zap — Quick Link Antecipação',
        'ArrowLeftRight — Quick Link Split',
        'ArrowUpFromLine — botão Sacar + Quick Link Saques',
        'Download — importado sem uso',
        'TrendingUp — credit entries',
        'TrendingDown — debit entries',
        'Wallet, Clock, BarChart3 — importados sem uso',
        'ChevronRight — botão "Ver agenda" no preview de recebíveis',
      ],
      localUtility: {
        formatCurrency: 'Definida INLINE (linhas 49-51) — duplica components/utils. Gap.',
      },
    },

    componentState: {
      period: { initial: "'30'", purpose: 'Período do gráfico de fluxo de caixa em dias (7|15|30)' },
    },

    backendIntegration: {
      queryEntries: {
        queryKey: "['financial-entries']",
        queryFn: 'base44.entities.FinancialEntry.list("-created_date", 100)',
        purpose: 'Últimas 100 entradas/saídas do extrato — alimenta lista de recentes + chart',
      },
      queryReceivables: {
        queryKey: "['receivables']",
        queryFn: 'base44.entities.Receivable.list("-settlement_date", 200)',
        purpose: 'Últimos 200 recebíveis — alimenta cálculo dos buckets de aging',
      },
      queryWithdrawals: {
        queryKey: "['withdrawals-pending']",
        queryFn: "base44.entities.Withdrawal.filter({ status: 'processing' })",
        purpose: 'Saques em trânsito — soma para inTransit balance',
      },
    },

    // ------------------------------------------------------------------------
    // CÁLCULO DE BALANCES (useMemo)
    // ------------------------------------------------------------------------
    balancesCalculation: {
      function: 'useMemo dependente de [receivables, withdrawals]',
      pendingReceivablesFilter: "r.status === 'scheduled' && new Date(r.settlement_date) > today",
      bucketLogic: {
        next7Days: 'pendingReceivables.filter(diff <= 7).reduce(sum net_amount)',
        next8to14Days: 'filter(diff > 7 && <= 14)',
        next15to30Days: 'filter(diff > 14 && <= 30)',
        above30Days: 'filter(diff > 30)',
      },
      diffFunction: 'differenceInDays(new Date(r.settlement_date), today)',
      summation: 'reduce((sum, r) => sum + (r.net_amount || 0), 0)',
      mockFallbacks: {
        available: '45680.50 hardcoded — não calcula nada do backend',
        pending: 'totalPending || 125450.00 — só usa mock se vazio',
        blocked: '8500.00 hardcoded',
        inTransit: 'withdrawals.reduce(...) || 3200.00 — só usa mock se vazio',
      },
      pendingBreakdown: 'Array de 4 objetos {label, value} com fallback por bucket',
      blockedBreakdown: 'Hardcoded 2 itens: "Reserva de CB" 5000 + "Disputas abertas" 3500',
    },

    // ------------------------------------------------------------------------
    // CÁLCULO DO chartData (useMemo)
    // ------------------------------------------------------------------------
    chartDataCalculation: {
      function: 'useMemo dependente de [entries, period]',
      logic: [
        'days = parseInt(period)',
        'Loop i from days down to 0',
        'date = subDays(now, i)',
        'dayEntries = entries onde format(created_date) === format(date) (yyyy-MM-dd)',
        'credits = filter type=credit reduce amount',
        'debits = filter type=debit reduce amount',
        'push { date: format(dd/MM), entradas: credits || mock, saidas: debits || mock }',
      ],
      mockFallback: 'entradas: Math.random() * 5000 + 2000, saidas: Math.random() * 2000 + 500',
      gap: 'mock muda a cada render — gráfico "tremula" sem dados reais',
    },

    // ------------------------------------------------------------------------
    // FUNÇÃO handleBalanceAction
    // ------------------------------------------------------------------------
    handleBalanceAction: {
      signature: '(action: "withdraw"|"receivables"|"blocked"|"withdrawals") => void',
      routesMap: {
        withdraw: 'Withdrawals',
        receivables: 'ReceivablesAgenda',
        blocked: 'FinancialStatement',
        withdrawals: 'Withdrawals',
      },
      navigation: 'window.location.href = createPageUrl(routes[action]) — full page reload (gap: deveria usar React Router navigate)',
    },

    // ------------------------------------------------------------------------
    // QUICK LINKS ARRAY
    // ------------------------------------------------------------------------
    quickLinks: {
      structure: 'Array de 5 objetos { labelKey, icon, page, color }',
      items: [
        { label: 'financial.statement', icon: 'FileText', page: 'FinancialStatement', color: 'bg-blue-100 text-blue-600' },
        { label: 'financial.receivables', icon: 'Calendar', page: 'ReceivablesAgenda', color: 'bg-green-100 text-green-600' },
        { label: 'financial.anticipation', icon: 'Zap', page: 'Anticipation', color: 'bg-purple-100 text-purple-600' },
        { label: 'menu.split', icon: 'ArrowLeftRight', page: 'SplitManagement', color: 'bg-indigo-100 text-indigo-600' },
        { label: 'financial.withdrawals', icon: 'ArrowUpFromLine', page: 'Withdrawals', color: 'bg-orange-100 text-orange-600' },
      ],
      layout: 'grid grid-cols-2 md:grid-cols-5 gap-3',
      itemRender: 'Link → flex items-center gap-3 p-4 bg-white rounded-lg border hover:shadow-md',
    },

    // ------------------------------------------------------------------------
    // LAYOUT GERAL
    // ------------------------------------------------------------------------
    layout: {
      rootContainer: '<div className="space-y-6">',

      pageHeader: {
        title: "t('financial.title')",
        subtitle: "t('financial.overview')",
        breadcrumbs: "[{ label: t('financial.title') }]",
        actions: [
          'Button outline + asChild + Link FinancialStatement + FileText + t("financial.statement")',
          'Button bg-green-600 hover:bg-green-700 + asChild + Link Withdrawals + ArrowUpFromLine + t("financial.withdraw")',
        ],
        criticalDetail: 'asChild = botão delega para Link interno — não há onClick',
      },

      balanceSummaryCards: {
        component: 'BalanceSummaryCards (componentes/financial/BalanceSummaryCards)',
        props: { balances: 'objeto memoized', isLoading: 'entriesLoading', onAction: 'handleBalanceAction' },
        purpose: '4 cards com saldos + breakdown + ações — vide doc do componente para granularidade interna',
      },

      cashFlowChart: {
        wrapper: 'Card → CardHeader pb-2 + CardContent',
        header: {
          left: 'CardTitle text-lg t("financial.cash_flow")',
          right: {
            component: 'Select w-[140px]',
            value: 'period',
            onValueChange: 'setPeriod',
            options: ["7 t('financial.days')", "15 t('financial.days')", "30 t('financial.days')"],
          },
        },
        chart: {
          height: 'h-[280px]',
          ResponsiveContainer: 'width=100% height=100%',
          AreaChart: {
            data: 'chartData',
            CartesianGrid: 'strokeDasharray="3 3" stroke="#f0f0f0"',
            XAxis: 'dataKey=date, tick fontSize=12',
            YAxis: 'tickFormatter: (v) => `${(v/1000).toFixed(0)}k` (formato 5k, 12k, etc)',
            Tooltip: 'formatter formatCurrency, labelFormatter "Data: {label}"',
            areas: [
              {
                dataKey: 'entradas',
                stackId: '1',
                stroke: '#10b981',
                fill: '#d1fae5',
                name: "t('financial.entries')",
              },
              {
                dataKey: 'saidas',
                stackId: '2',
                stroke: '#ef4444',
                fill: '#fee2e2',
                name: "t('financial.exits')",
              },
            ],
            stackingNote: 'stackIds DIFERENTES (1 vs 2) — não empilha de fato. Gap intencional ou bug?',
          },
          legend: {
            layout: 'flex justify-center gap-6 mt-4',
            items: ['Bolinha verde + Entradas', 'Bolinha vermelha + Saídas'],
          },
        },
      },

      receivablesPreview: {
        wrapper: 'Card',
        header: {
          left: 'CardTitle text-lg t("financial.next_receivables")',
          right: 'Button ghost sm + Link ReceivablesAgenda + t("financial.view_schedule") + ChevronRight',
        },
        chart: {
          height: 'h-[280px]',
          BarChart: {
            data: 'balances.pendingBreakdown (4 buckets)',
            XAxis: 'dataKey=label tick fontSize=11 — labels "Próximos 7 dias", "8 a 14 dias", etc',
            YAxis: 'tickFormatter k formatado',
            Tooltip: 'formatter formatCurrency',
            Bar: 'dataKey=value, fill=#3b82f6 (azul), radius=[4,4,0,0] (arredondado top)',
          },
          footer: {
            layout: 'flex justify-between pt-4 border-t mt-4',
            label: "t('financial.total_receivable')",
            value: 'span text-xl font-bold text-blue-600 + formatCurrency(balances.pending)',
          },
        },
      },

      recentMovements: {
        wrapper: 'Card',
        header: {
          left: 'CardTitle text-lg t("financial.recent_movements")',
          right: 'Button outline sm + Link FinancialStatement + t("financial.view_full_statement")',
        },
        body: {
          layout: 'space-y-3',
          listLogic: 'entries.slice(0, 5).map (apenas top 5)',
          itemRender: {
            wrapper: 'flex items-center justify-between p-3 bg-gray-50 rounded-lg',
            left: {
              icon: 'p-2 rounded-full + bg-green-100 (credit) ou bg-red-100 (debit) + TrendingUp ou TrendingDown',
              text: '2 linhas: description||category (font-medium) + format(created_date, "dd/MM/yyyy às HH:mm", ptBR)',
            },
            right: 'span font-semibold com cor + sinal +/- + formatCurrency(amount)',
          },
          emptyState: 'div text-center py-8 text-gray-500 + t("financial.no_recent_movements")',
        },
      },
    },

    // ------------------------------------------------------------------------
    // GAPS E OPORTUNIDADES
    // ------------------------------------------------------------------------
    knownGaps: [
      'Tabs e Badge importados mas não usados',
      'Download e BarChart3 (lucide), Wallet, Clock importados sem uso',
      'formatCurrency redefinida inline em vez de importar de components/utils',
      'available, blocked e parte de inTransit são HARDCODED — não consultam dados reais',
      'blockedBreakdown 100% hardcoded (Reserva CB 5000, Disputas 3500)',
      'mockFallback do chart usa Math.random — gráfico tremula sem dados reais',
      'handleBalanceAction usa window.location.href em vez de useNavigate (full reload)',
      'stackId 1 vs 2 nas Areas — não empilha de fato (parece intencional mas confuso)',
      'Não há filtro de subaccount no cabeçalho — mostra dados agregados',
      'Lista de "Recent Movements" não tem link clicável para detalhe da entry',
      'Quick Links sem ordem editável — fixos no array',
      'Sem indicador de "última atualização" / refresh manual',
    ],

    relationshipsToOtherPages: {
      financialStatement: '/FinancialStatement — header CTA + bloco de movimentações + handleBalanceAction("blocked")',
      withdrawals: '/Withdrawals — header CTA + Quick Link + handleBalanceAction("withdraw"|"withdrawals")',
      receivablesAgenda: '/ReceivablesAgenda — Quick Link + bloco de Receivables + handleBalanceAction("receivables")',
      anticipation: '/Anticipation — Quick Link',
      splitManagement: '/SplitManagement — Quick Link',
      dashboard: '/Dashboard — pai conceitual (esta tela substitui o módulo Financeiro como Home)',
    },
  },
};

export default FinancialOverviewDoc;