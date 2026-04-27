// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — FINANCEIRO CORE (Admin Interno) — Parte 1/2
// Cobre as 5 páginas analíticas/visão-geral do módulo Financeiro:
//   - AdminIntFinancialDashboard.jsx (220 linhas) — Dashboard geral
//   - AdminIntFinancialResults.jsx  (438 linhas) — Resultados/P&L COM SDK REAL
//   - AdminIntClientProfitability.jsx (315 linhas) — Splits e Ganhos por Cliente COM SDK REAL
//   - AdminIntConciliation.jsx      (521 linhas) — Conciliação multi-tab
//   - AdminIntPaymentAgenda.jsx     (495 linhas) — Agenda de Pagamentos com Calendar
// ============================================================================

export const AdminIntFinancialCoreDoc = {
  pageId: 'AdminIntFinancialCore',
  pagePaths: [
    '/AdminIntFinancialDashboard',
    '/AdminIntFinancialResults',
    '/AdminIntClientProfitability',
    '/AdminIntConciliation',
    '/AdminIntPaymentAgenda',
  ],
  module: 'Admin Interno',
  section: 'Financeiro — Core (Dashboard + Resultados + Profitability + Conciliação + Agenda)',

  explainer: {
    oneLiner:
      'Quinteto financeiro do back-office: (1) FinancialDashboard 220L 100% mock estático com 5 KPIs gradient (TPV R$15.2M+12% / Receita R$425K+8% / A Liquidar R$8.3M / Saldo Merchants R$2.1M / Saques Pend R$340K), AreaChart TPV 6 meses (#2bc196), Receita por Produto 4 barras horizontais coloridas (Cartão 65% emerald / PIX 25% blue / Boleto 8% amber / Outros 2% slate), Agenda 5 dias hardcoded e 4 alertas (3 saques bloqueados >24h ERROR / 5 merchants saldo negativo WARNING / Retenção atípica 2 merchants WARNING / Sem atrasos SUCCESS); (2) FinancialResults 438L COM useQuery REAL em 3 entities (RevenueEntry list 500 / CostEntry list 500 / Transaction list 500), 5 KPIs calculados (GMV/Receita Bruta/Custos/Receita Líquida/Margem%), Composição Receitas 10 tipos com PieChart + Composição Custos 10 tipos com BarChart horizontal #ef4444, Box gradient laranja "Resultado Pré-Chargeback" com ROI +1107% HARDCODED, AreaChart Tendência 6 meses (5 hardcoded + 1 dinâmico só do mês atual) com YAxis dual (esquerda R$ direita %), DataTable de transações filtrável; (3) ClientProfitability 315L COM SDK REAL em 4 entities (Subaccount filter active / RevenueEntry list 1000 / CostEntry list 1000 / SubSeller list), calcula spread por cliente (revenue-cost) e margem (spread/GMV), 4 KPIs globais + BarChart Vertical Top10 por spread com cor por sinal (#2bc196 positivo / #ef4444 negativo), DataTable 8-col com badges Margem (≥3% emerald / ≥1% yellow / <1% red) + 2 botões navegação Perfil/Splits, filtro spread em 5 ranges (negative/low<1k/medium 1-10k/high>10k); (4) Conciliation 521L 100% mock com 4 KPIs gradient (Conciliado 98.3%/Pendentes 456/Divergências 332/Volume R$12.4M) + 4 Tabs (Overview BarChart Stacked 7 dias com 3 cores / Methods 2 cards Pix vs Cartão com 4 mini-KPIs cada e breakdown / Cycles Table 6 ciclos D+0 a D+30 com badge animate-spin "Processando" / Divergent Table 4 itens com 5 tipos de divergência coloridos), botão Atualizar com setTimeout(2000) FAKE; (5) PaymentAgenda 495L 100% mock com 6 KPIs centralizados (Total Agendado/Hoje blue/Semana indigo/Mês purple/Atrasados red/Merchants), 3 Tabs (Overview com BarChart Entradas vs Saídas + Tabela 8-col com row vermelha para overdue + 5 status badges com ícones / Calendar com Calendar shadcn locale ptBR + 3 cards centro Total/Débitos/Merchants HARDCODED não muda com data / List com 2 Selects e 9-col), suporta valores negativos (chargebacks) com text-red-600. Todos exceto Results+Profitability são MOCK ESTÁTICO.',

    financialDashboardMicroscopic: {
      role: 'Dashboard executivo financeiro — visão de TPV, agenda e alertas críticos em uma única tela',
      backendIntegration: 'NENHUMA — 100% mocks internos (tpvData / revenueByProduct / settlementAgenda / alerts)',
      pageHeader: {
        title: '"Dashboard Financeiro"',
        breadcrumbs: '[Financeiro → Dashboard]',
        actionElement: 'Select w-180 com 3 opções (Janeiro 2026 default / Dezembro 2025 / Novembro 2025) — gap: SEM onValueChange, decorativo',
        gap: 'Usa "actionElement" prop (não "actions") — pode não renderizar dependendo da assinatura do PageHeader',
      },
      mainKPIs: {
        layout: 'grid grid-cols-2 md:grid-cols-5 gap-4',
        cards: [
          'TPV Mês — gradient blue-50→white border-blue-100 / DollarSign / R$ 15,2 M / TrendingUp +12% green',
          'Receita — gradient green-50→white border-green-100 / TrendingUp / R$ 425 K / TrendingUp +8% green',
          'A Liquidar — Card padrão / Calendar slate / R$ 8,3 M / "Agenda futura"',
          'Saldo Merchants — Card padrão / Wallet slate / R$ 2,1 M / "234 merchants ativos"',
          'Saques Pend. — gradient amber-50→white border-amber-100 / ArrowUpFromLine / R$ 340 K / "23 pendentes"',
        ],
        gap: 'TODOS valores hardcoded — não vem do backend',
      },
      tpvChart: {
        title: '📈 Evolução do TPV',
        type: 'AreaChart altura 250px',
        data: '6 pontos mensais Ago→Jan (8.5M → 15.2M)',
        styling: 'stroke #2bc196 / fill #2bc196 fillOpacity 0.2 / strokeWidth 2 / type monotone',
        tooltipFormatter: 'formatCurrency completo',
        gap: 'Hardcoded — última coluna Jan deveria refletir KPI principal',
      },
      revenueByProduct: {
        title: '📊 Receita por Produto',
        type: 'Lista de 4 barras horizontais customizadas (não usa Recharts aqui)',
        items: [
          'Cartão 65% R$ 276.250 — bg #2bc196',
          'PIX 25% R$ 106.250 — bg #3b82f6',
          'Boleto 8% R$ 34.000 — bg #f59e0b',
          'Outros 2% R$ 8.500 — bg #94a3b8',
        ],
        gap: 'Cores hardcoded inline via style — não usa CSS classes (escapa Tailwind purge)',
      },
      settlementAgenda: {
        title: '📅 Agenda de Liquidação (Próximos 7 dias)',
        items: '5 entries (29/01 a 04/02) com formato "DD/MM (Dia)" + valor + "{N} merchants"',
        gap: 'Título diz "7 dias" mas mostra apenas 5 itens',
      },
      alerts: {
        title: '⚠️ Alertas Financeiros',
        items: [
          'ERROR red — "3 saques bloqueados há mais de 24h" + AlertTriangle',
          'WARNING amber — "5 merchants com saldo negativo" + AlertTriangle',
          'WARNING amber — "Retenção atípica em 2 merchants" + AlertTriangle',
          'SUCCESS green — "Nenhum atraso de liquidação" + Clock (ícone errado para success)',
        ],
        gap: 'Alertas decorativos — sem onClick para drill-down',
      },
      knownGapsDashboard: [
        'PageHeader usa "actionElement" em vez de "actions" — provável bug de prop name',
        'Select de período sem onValueChange — não filtra nada',
        'Todos os 5 KPIs com valores hardcoded',
        'Chart Receita por Produto não usa Recharts (inconsistência com o resto da plataforma)',
        '"Próximos 7 dias" mostra apenas 5 itens',
        'Alertas sem ação clicável (não levam para a página de origem)',
        'Ícone Clock no alerta success em vez de CheckCircle',
        'Cores das barras inline em style (escapam Tailwind purge mas inconsistente)',
      ],
    },

    financialResultsMicroscopic: {
      role: 'P&L completo com receitas vs custos calculados em tempo real — único dashboard com SDK base44 REAL nesta seção',
      backendIntegration: {
        sdkCalls: [
          'base44.entities.RevenueEntry.list("-created_date", 500)',
          'base44.entities.CostEntry.list("-created_date", 500)',
          'base44.entities.Transaction.list("-created_date", 500)',
        ],
        realTimeCalcs: 'GMV (sum approved tx amount) / Receita (sum revenue) / Custos (sum cost) / Líquido (rev-cost) / Margem (líquido/GMV*100)',
      },
      pageHeader: {
        title: '"Resultados Financeiros"',
        subtitle: 'Análise completa de receitas, custos e lucratividade (P&L)',
        breadcrumbs: '[Financeiro → Resultados]',
        actions: 'Select periodo 4 opções (7/30 default/90/365 dias) + Button "Exportar P&L" (Download)',
        gap: 'Period state é capturado mas NÃO entra nas queries (não filtra) — botão Exportar SEM onClick',
      },
      mainKPIs: {
        cards: [
          'GMV Total / formatCurrency(kpis.gmv) / icon DollarSign blue / sem trend',
          'Receita Bruta / text-emerald-600 / icon TrendingUp emerald',
          'Custos Totais / text-red-600 / icon TrendingDown red',
          'Receita Líquida / text-purple-600 / icon Wallet purple',
          'Margem Líquida / text-indigo-600 / kpis.margin.toFixed(2)% / "sobre GMV"',
        ],
      },
      revenueBreakdown: {
        labelMap10Types: [
          'mdr_card → MDR Cartão',
          'mdr_pix → MDR Pix',
          'mdr_boleto → MDR Boleto',
          'anticipation → Antecipação',
          'fixed_fee_card → Taxa Fixa Cartão',
          'fixed_fee_pix → Taxa Fixa Pix',
          'antifraud → Anti-fraude',
          'setup_fee → Setup Fee',
          'chargeback_fee → Taxas de CB',
          'other → Outras',
        ],
        layout: 'Lista de cards bg-slate-50 + PieChart Recharts (cx 50% cy 50% outerRadius 80) com 7 cores rotativas',
        colorPalette: '#2bc196 / #3b82f6 / #8b5cf6 / #f59e0b / #ef4444 / #ec4899 / #14b8a6',
      },
      costBreakdown: {
        labelMap10Types: [
          'mdr_paid → MDR Repassado',
          'pix_cost → Custo Pix',
          'boleto_cost → Custo Boleto',
          'anticipation_cost → Custo Antecipação',
          'antifraud_cost → Custo Anti-fraude',
          'gateway_cost → Gateway',
          'chargeback_loss → Perdas CB',
          'prechargeback_alert_cost → Alertas Pré-CB',
          'operational → Operacional',
          'other → Outros',
        ],
        layout: 'Lista bg-slate-50 + BarChart horizontal radius [0,4,4,0] fill #ef4444',
      },
      preChargebackROI: {
        wrapper: 'Card gradient orange-50→amber-50 dark:from-orange-900/20 border-orange-200',
        title: 'Resultado de Pré-Chargebacks (Alertas) com Shield orange',
        cards4: [
          'Alertas Recebidos: 145',
          'Valor em Risco: R$ 87.500 (text-orange-600)',
          'Custo dos Alertas: R$ 7.250 (text-red-600)',
          'ROI Pré-CB: +1.107% (text-emerald-600) "CB evitados - Custo"',
        ],
        gap: 'TUDO HARDCODED — não vem da entity Dispute nem de PreChargeback',
      },
      trendChart: {
        title: 'Tendência de Receitas, Custos e Margem',
        type: 'AreaChart com 2 áreas + 1 line',
        data: '6 meses Ago-Jan (5 hardcoded + último mês usa kpis dinâmicos com fallback || 450000 / || 285000)',
        gradients: 'colorRevenue #2bc196 0.3→0 / colorCosts #ef4444 0.3→0',
        margin: 'stroke #8b5cf6 strokeWidth 2 / yAxisId right',
        gap: 'YAxis right não tem domain definido — pode flutuar entre 0-100% ou exceder',
      },
      detailedTable: {
        component: 'DataTable common',
        columns: [
          'created_date — toLocaleDateString pt-BR',
          'merchant_name — direto',
          'method — credit_card→Cartão / pix→Pix / fallback v',
          'amount — formatCurrency',
          'transaction_id — direto (não trunca)',
        ],
        filters: 'Input search w-64 (state setado mas NÃO filtra) + Select method (all/credit_card/pix — SIM filtra)',
        pagination: 'pageSize 20',
        gap: 'searchTerm não está conectado ao .filter() — Input cosmético',
      },
      knownGapsResults: [
        'period select sem efeito (não passa para queries)',
        'Botão "Exportar P&L" sem onClick',
        'Card Pré-CB ROI 100% hardcoded — destoa do resto da página que usa SDK',
        'searchTerm da tabela não filtra (apenas methodFilter funciona)',
        'TrendChart último mês mistura kpis dinâmicos com fallback — pode exibir dados inconsistentes',
        'YAxis direito (Margem%) sem domain — pode quebrar visualmente',
      ],
    },

    clientProfitabilityMicroscopic: {
      role: 'Análise de spread (revenue-cost) e margem por cliente, com Top 10 visualizado e DataTable filtrável',
      backendIntegration: {
        sdkCalls: [
          'base44.entities.Subaccount.filter({ status: "active" })',
          'base44.entities.RevenueEntry.list("-created_date", 1000)',
          'base44.entities.CostEntry.list("-created_date", 1000)',
          'base44.entities.SubSeller.list()',
        ],
        perClientCalc: 'Para cada subaccount: filter revenues by subaccount_id → soma | filter costs by subaccount_id → soma | spread = totalRevenue - totalCost | margin = (spread/GMV)*100 | subsellersCount = filter subSellers by parent_subaccount_id',
      },
      pageHeader: {
        title: '"Splits e Ganhos por Cliente"',
        subtitle: 'Análise de rentabilidade e spread por subconta',
        breadcrumbs: '[Financeiro → Splits e Ganhos]',
        actions: 'Button "Exportar" (Download) — gap: sem onClick',
      },
      globalKPIs: [
        'Clientes Ativos — count subaccounts',
        'Spread Médio — formatCurrency(avgSpread) text-purple-600',
        'Top Cliente — globalKPIs.topClient.business_name + spread',
        'Clientes c/ Spread Negativo — count + warning vermelho condicional "⚠️ Requer atenção" (border-red-200 bg-red-50 quando >0)',
      ],
      top10Chart: {
        type: 'BarChart layout vertical altura 350px',
        data: 'filteredData.slice(0,10) com fill condicional (#2bc196 spread>=0 / #ef4444 negative)',
        yAxisCategory: 'name truncado em 20 chars',
        gap: 'Truncamento em substring(0,20) sem reticências',
      },
      filtersCard: {
        searchInput: 'max-w-xs busca em business_name OR document',
        spreadSelect: '5 opções all/negative/low(0-1k)/medium(1k-10k)/high(>10k)',
      },
      dataTable: {
        columns: [
          'business_name — composto (nome + document abaixo em xs slate)',
          'gmv — formatCurrency font-semibold',
          'totalRevenue — text-emerald-600',
          'totalCost — text-red-600',
          'spread — text-purple-600 (>=0) / text-red-600 (<0) / text-lg font-bold',
          'margin — Badge condicional (≥3 emerald / ≥1 yellow / <1 red) + .toFixed(2)%',
          'subsellersCount — Users icon + número (default 0)',
          'actions — 2 botões ghost: Eye → MerchantProfile?id={row.id} / ArrowLeftRight → ClientSplitDetail?id={row.id}',
        ],
        sort: '.sort((a,b) => b.spread - a.spread) DESC fixo — gap: usuário não pode mudar',
        pagination: 'pageSize 25 / emptyMessage "Nenhum cliente encontrado"',
      },
      knownGapsClientProfitability: [
        'period state declarado mas NÃO usado',
        'Botão Exportar sem onClick',
        'Sort fixo descendente — colunas não são clicáveis',
        'Truncamento de nome em 20 chars sem reticências',
        'Não calcula custos opportunity (apenas registrados em CostEntry)',
      ],
    },

    conciliationMicroscopic: {
      role: 'Hub de conciliação financeira por método e por ciclo de liquidação — diagnóstico operacional',
      backendIntegration: 'NENHUMA — 100% mock (conciliationSummary, paymentMethodBreakdown, settlementCycles, divergentItems, dailyTrend)',
      pageHeader: {
        title: '"Conciliação Financeira"',
        subtitle: 'Acompanhamento completo de conciliação por método de pagamento e ciclo',
        breadcrumbs: '[Admin Interno → Financeiro → Conciliação]',
        actions: 'Select dateRange (today default/yesterday/week/month) + Button "Atualizar" RefreshCw com isRefreshing setTimeout(2000) FAKE + Button "Exportar"',
        gap: 'dateRange não filtra dados / Atualizar é fake (apenas anima 2s) / Exportar sem onClick',
      },
      summaryKPIs4: {
        cards: [
          'Conciliado — gradient green-50→white border-green-100 / 98.3% green / 44.890 transações / CheckCircle2',
          'Pendentes — gradient amber-50→white / 456 amber / R$ 156.789 / Clock',
          'Divergências — gradient red-50→white / 332 red / R$ 65.432 / AlertTriangle',
          'Volume Total — gradient blue-50→white / R$ 12.456.789 blue / 45.678 trans / DollarSign',
        ],
      },
      fourTabs: {
        overview: {
          trendChart: 'BarChart altura 300 / 7 dias / Stacked (stackId="a") / 3 fills #2bc196 conciliated #f59e0b pending #ef4444 divergent',
          paymentMethodsSummary: '3 cards com Progress bar (Pix 99.8% green / Cartão Crédito 98% / Cartão Débito 90% red) + Badge condicional thresholds (≥99 green / ≥95 amber / <95 red)',
        },
        methods: {
          twoCardsGrid: 'Pix card icon QrCode #2bc196 + Cartão card icon CreditCard blue',
          pixSubKPIs: '4 mini-cards (Trans 28.456 / Volume R$5.6M / Conciliado 99.8% green / Pendentes 56 amber) + Lista "Principais Divergências" (Pix não confirmado 23 / Valor diferente 12 / MED pendente 8)',
          cardSubKPIs: '4 mini-cards (Trans 17.222 / Volume R$6.7M / Conciliado 95.4% green / Pendentes 792 amber) + Lista "Por Ciclo" (D+1 234 / D+2 156 / D+30 402)',
        },
        cycles: {
          tableSettlementCycles: '6 ciclos D+0(Pix) a D+30 com Status Badge ("Processando" Loader2 animate-spin blue / "Aguardando" Clock amber)',
          previsao: 'Lógica condicional D+0→Imediato / D+1→Amanhã / D+2→Em 2 dias / fallback "Em N dias"',
        },
        divergent: {
          filterSelect: 'Tipo (all default + 4 tipos)',
          tableDivergent: '8 colunas (Transação font-mono / Merchant / Tipo Badge / Esperado / Recebido / Diferença com sinal+ ou - colorido / Data / 2 ações Eye+MoreHorizontal)',
          divergenceTypes5: [
            'valor_diferente — amber',
            'taxa_incorreta — blue',
            'chargeback_pendente — red',
            'pix_nao_confirmado — purple',
            'pre_chargeback — orange',
          ],
        },
      },
      knownGapsConciliation: [
        'Atualizar com setTimeout fake — dá ilusão de sync sem fazer nada',
        'dateRange Select sem efeito',
        'Exportar sem onClick',
        'Eye e MoreHorizontal nas linhas de divergência sem onClick',
        'Tipo "pre_chargeback" definido em getDivergenceTypeBadge mas não aparece nos mocks',
        'Mocks de Pix divergências (23/12/8) não casam com 332 total na summary',
      ],
    },

    paymentAgendaMicroscopic: {
      role: 'Agenda de pagamentos completa — visão geral, calendário interativo e lista detalhada',
      backendIntegration: 'NENHUMA — 100% mock (paymentAgendaSummary, upcomingPayments 6 itens, dailyProjection 7 dias)',
      pageHeader: {
        title: '"Agenda de Pagamentos"',
        subtitle: 'Visão completa de repasses e liquidações programadas',
        breadcrumbs: '[Admin Interno → Financeiro → Agenda de Pagamentos]',
        actions: 'Apenas Button "Exportar" — sem onClick',
      },
      summaryKPIs6: {
        layout: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 — TODOS centralizados (text-center)',
        cards: [
          'Total Agendado — Card padrão / R$ 3.456.789',
          'Hoje — bg-blue-50 / R$ 234.567 blue',
          'Esta Semana — bg-indigo-50 / R$ 1.234.567 indigo',
          'Este Mês — bg-purple-50 / R$ 2.890.123 purple',
          'Atrasados — bg-red-50 / R$ 45.678 red',
          'Merchants — Card padrão / 1.234',
        ],
      },
      threeTabs: {
        overview: {
          projectionChart: 'BarChart 7 dias 29/01-04/02 / 2 bars (entrada #2bc196 / saida #ef4444) — gap: existe "liquido" no data mas não é renderizado',
          upcomingPaymentsTable: {
            search: 'Input com Search icon — busca por merchant',
            columns: '8 cols (Merchant com avatar+ID / Tipo Badge / Valor Bruto / Taxas com prefix - / Líquido com cor por sinal / Data dd/MM/yyyy / Status / 2 ações Eye+MoreHorizontal)',
            rowConditional: 'IF status=overdue → bg-red-50/50 dark:bg-red-900/10',
            statusConfigs: '5 (scheduled blue Clock / processing amber Clock / completed green CheckCircle2 / overdue red AlertCircle / pending_debit orange AlertCircle)',
            typeConfigs: '5 (settlement green / chargeback red / refund amber / fee slate / adjustment purple)',
          },
        },
        calendar: {
          layout: 'grid 3 cols — sidebar 1 col Calendar shadcn locale ptBR / main 2 cols pagamentos do dia',
          calendarComponent: 'Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} locale={ptBR}',
          mainContent: '3 cards centro (Total a Pagar R$234.567 green / Débitos R$12.345 red / Merchants 45) — TODOS HARDCODED não mudam com selectedDate',
          listOfDay: 'border rounded-lg divide-y com slice(0,4) primeiros 4 pagamentos (sempre os mesmos)',
          gap: 'Calendar selectedDate atualiza apenas o título, mas dados não filtram',
        },
        list: {
          filters: '2 Selects (Status all/scheduled/completed/overdue + Tipo all/settlement/chargeback/refund) — gap: defaultValue "all" ambos, sem onValueChange',
          tableColumns: '9 cols (mesma do Overview + coluna Método = Badge variant outline com payment.method.toUpperCase())',
        },
      },
      negativeAmountSupport: 'pay_005 amount=-1250 type=chargeback status=pending_debit demonstra suporte completo a débitos',
      knownGapsPaymentAgenda: [
        'Botão Exportar sem onClick',
        'Calendar tab: dados centro não atualizam com selectedDate (mock fixo)',
        'Calendar tab: lista mostra sempre slice(0,4) ignorando data',
        '"liquido" no dailyProjection não é plotado no chart',
        'List tab: ambos Selects sem onValueChange',
        'Eye e MoreHorizontal em todas as tabelas sem onClick',
        'searchTerm Overview não filtra a tabela (state setado mas filter não aplica)',
        'Header com 3 itens em "Admin Interno → Financeiro → Agenda" diferente de outras páginas (2 itens)',
      ],
    },
  },

  technical: {
    fileLocations: {
      dashboard: 'pages/AdminIntFinancialDashboard.jsx (220 linhas)',
      results: 'pages/AdminIntFinancialResults.jsx (438 linhas — único com SDK extensivo)',
      profitability: 'pages/AdminIntClientProfitability.jsx (315 linhas — único com 4 SDK queries + cálculos)',
      conciliation: 'pages/AdminIntConciliation.jsx (521 linhas)',
      paymentAgenda: 'pages/AdminIntPaymentAgenda.jsx (495 linhas)',
    },
    sdkUsageSummary: {
      noSdk: '3 páginas (Dashboard, Conciliation, PaymentAgenda) — 100% mock',
      withSdk: '2 páginas (Results, Profitability) — base44.entities {RevenueEntry, CostEntry, Transaction, Subaccount, SubSeller}',
    },
    componentReuse: {
      PageHeader: 'usado em todas, mas Dashboard usa "actionElement" em vez de "actions" (provável bug)',
      DataTable: 'usado em Results + Profitability (com columns customizadas via render)',
      shadcnCalendar: 'apenas em PaymentAgenda Tab calendar',
      Recharts: 'AreaChart (Dashboard, Results) / BarChart (Results, Profitability, Conciliation, PaymentAgenda) / PieChart (Results) / Stacked Bar (Conciliation)',
      colorPalette: 'COLORS array em Results = [#2bc196 / #3b82f6 / #8b5cf6 / #f59e0b / #ef4444 / #ec4899 / #14b8a6]',
    },
    crossPageRelationships: {
      dashboard_to_others: 'Sem links — apenas alertas decorativos',
      results_to_no_drilldown: 'DataTable de transações não tem link para TransactionDetail',
      profitability_to_merchant: 'Botão Eye → AdminIntMerchantProfile?id={row.id}',
      profitability_to_split: 'Botão ArrowLeftRight → AdminIntClientSplitDetail?id={row.id}',
      conciliation_isolated: 'Tabelas têm Eye+MoreHorizontal mas sem onClick (não navega)',
      paymentAgenda_isolated: 'Idem — Eye+MoreHorizontal sem ação',
    },
    knownGapsCrossSection: [
      'Apenas 2/5 páginas usam SDK real — visualmente parecem iguais às mock',
      'Dashboard tem prop "actionElement" enquanto restante usa "actions"',
      'Period filters não funcionam em Results, Profitability, Conciliation (apenas state local)',
      'Botões "Exportar" presentes em todas mas SEM onClick em todas',
      '5 status diferentes para liquidação (scheduled/processing/completed/overdue/pending_debit) — não há entity Settlement consolidada',
      'PaymentAgenda Calendar tab não filtra dados pela data selecionada',
      'Conciliation Atualizar fake (setTimeout 2s) sem refazer query',
    ],
  },
};

export default AdminIntFinancialCoreDoc;