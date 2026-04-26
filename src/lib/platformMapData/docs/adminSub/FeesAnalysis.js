// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /FeesAnalysis
// ============================================================================
// Arquivo dedicado, fidelidade absoluta a pages/FeesAnalysis.jsx (615 linhas).
// Cada KPI, cada barra, cada fatia da pizza, cada linha da tabela,
// cada insight de otimização, cada cálculo de economia — documentado.
// ============================================================================

export const FeesAnalysisDoc = {
  pageId: 'FeesAnalysis',
  pagePath: '/FeesAnalysis',
  module: 'Financeiro',
  parentPage: 'FinancialOverview',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Análise QUANTITATIVA do impacto das tarifas no negócio — 4 KPIs principais (Receita Bruta, Tarifas, Líquida, Ticket Médio com comparação MoM), funil visual escuro Bruta → Tarifas → Líquida, Area Chart de evolução 5 meses, Pie Chart de composição das taxas, breakdown detalhado MDR vs Tarifas, tabela por método de pagamento, e seção "Oportunidades de Economia" com insights acionáveis e economia potencial mensal.',

    differenceFromFees: {
      Fees: 'Catálogo das taxas — quanto eu pago por cada coisa',
      FeesAnalysis: 'Análise do total pago — quanto eu paguei no mês e onde posso economizar',
    },

    fourMainKPIs: {
      grossRevenue: 'Receita Bruta — R$ 850.000 (mock) + grossChange 8.97% MoM (TrendingUp emerald)',
      totalFees: 'Total em Tarifas — R$ 28.450 (3.35% da receita) — Badge red',
      netRevenue: 'Receita Líquida — R$ 821.550 + Progress bar mostrando 96.65% da receita retida',
      avgTicket: 'Ticket Médio — R$ 68,27 + 12.450 transações',
    },

    visualSummaryStrip: {
      what: 'Card escuro slate-900 horizontal com 3 valores conectados por ArrowRight',
      flow: 'Receita Bruta R$ 850.000 → -R$ 28.450 (red-400) → R$ 821.550 (#00D26A)',
      retention: 'À direita: "Você está retendo 96.65% de cada venda"',
    },

    feeBreakdownByCategory: {
      mdr: {
        total: 'R$ 23.800',
        breakdown: ['Cartão de Crédito R$ 18.500 (3.29% MDR médio)', 'Pix R$ 3.200 (0.99%)', 'Débito R$ 2.100 (1.99%)'],
      },
      tariffs: {
        total: 'R$ 15.349',
        breakdown: [
          'Gateway R$ 6.102,50 (0,49 × 12.455 tx)',
          'Antifraude R$ 8.718,50 (0,70 × 12.455 tx)',
          'Chargebacks R$ 450 (15 × 30)',
          'Saques TED R$ 78 (3,90 × 20)',
        ],
      },
    },

    feeDistributionPie: {
      slices: [
        { name: 'MDR Cartão', value: 18500, color: '#3B82F6 (blue)' },
        { name: 'MDR Pix', value: 3200, color: '#00D26A (green)' },
        { name: 'MDR Débito', value: 2100, color: '#8B5CF6 (purple)' },
        { name: 'Gateway', value: 6102.50, color: '#F59E0B (amber)' },
        { name: 'Antifraude', value: 8718.50, color: '#EF4444 (red)' },
        { name: 'Chargebacks', value: 450, color: '#6B7280 (gray)' },
      ],
      shape: 'innerRadius=50 outerRadius=80 (donut chart)',
    },

    feeByMethodTable: {
      columns: ['Método', 'Volume', 'Transações', 'Taxa Média', 'Custo Total', '% do Total'],
      rows: [
        '{ method: "Crédito 1x", volume: 350000, taxa: 2.99, custo: 10465, transacoes: 4200 }',
        '{ method: "Crédito 2-6x", volume: 280000, taxa: 3.49, custo: 9772, transacoes: 3100 }',
        '{ method: "Crédito 7-12x", volume: 85000, taxa: 3.99, custo: 3391.50, transacoes: 850 }',
        '{ method: "Débito", volume: 95000, taxa: 1.99, custo: 1890.50, transacoes: 1800 }',
        '{ method: "Pix", volume: 320000, taxa: 0.99, custo: 3168, transacoes: 5200 }',
      ],
      totalRow: 'bg-slate-50 font-bold com totais agregados',
    },

    threeOptimizationInsights: {
      warning: {
        title: 'Alto volume de chargebacks',
        description: '30 chargebacks este mês = R$ 450. Considere implementar 3DS para reduzir fraudes.',
        potentialSavings: 'R$ 300/mês',
        color: 'amber',
        icon: 'AlertTriangle',
      },
      tip: {
        title: 'Incentive pagamentos via Pix',
        description: 'Pix tem taxa de apenas 0.99%. Aumentando Pix de 37% para 50% do volume, economia ~R$ 2.800',
        potentialSavings: 'R$ 2.800/mês',
        color: 'emerald',
        icon: 'Lightbulb',
      },
      info: {
        title: 'Seus saques via TED',
        description: 'Você fez 20 saques via TED (R$ 78). Saques via Pix são gratuitos.',
        potentialSavings: 'R$ 78/mês',
        color: 'blue',
        icon: 'Info',
      },
      totalSavings: 'R$ 3.178/mês (sum dos 3 insights)',
    },

    coreCapabilities: [
      '4 cards de resumo com gradientes coloridos e MoM comparativo',
      'Visual Summary Strip dark com flow Bruta → Tarifas → Líquida',
      'Area Chart 5 meses (Ago-Dez) com gradient fills + tooltip rounded',
      'Pie Chart de composição com 6 slices coloridas + legenda 2 colunas',
      'Cards de detalhamento MDR (3 sub-rows) e Tarifas (4 sub-rows)',
      'Tabela completa por método com 5 sub-rows + total agregado',
      'Card "Oportunidades de Economia" com 3 insights coloridos + total potencial',
      'Toggle Eye/EyeOff para mascarar valores',
      'Period Select (7d/30d/90d/year) — gap: state existe mas não recalcula dados',
    ],
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/FeesAnalysis.jsx',
    totalLines: 615,

    imports: {
      react: ['useState'],
      reactQuery: ['useQuery (importado, sem uso real)'],
      base44: 'base44.entities (importado, sem uso real)',
      sharedComponents: ['PageHeader'],
      uiComponents: [
        'Button', 'Card+CardContent+CardHeader+CardTitle+CardDescription', 'Badge',
        'Progress',
        'Select stack', 'Table stack',
        'Tooltip+TooltipContent+TooltipProvider+TooltipTrigger',
      ],
      utilities: ['cn (lib/utils)'],
      recharts: ['AreaChart', 'Area', 'XAxis', 'YAxis', 'CartesianGrid', 'Tooltip as RechartsTooltip', 'ResponsiveContainer', 'PieChart', 'Pie', 'Cell', 'BarChart', 'Bar', 'Legend'],
      lucideIcons: [
        'Wallet — KPI Receita Líquida',
        'TrendingUp — KPI Receita Bruta MoM + insight title',
        'TrendingDown — importado sem uso',
        'DollarSign — KPI Receita Bruta',
        'CreditCard — MDR Cartão',
        'QrCode — MDR Pix',
        'Receipt — KPI Tarifas + Tariffs Breakdown',
        'PieChart as PieChartIcon — importado sem uso',
        'BarChart3 — importado sem uso',
        'Calendar — Period Select',
        'Download — botão Exportar',
        'Eye / EyeOff — toggle showValues',
        'ArrowRight — separadores no Visual Summary',
        'AlertTriangle — insight warning',
        'CheckCircle2 — total economy footer',
        'Info — insight info',
        'Lightbulb — insight tip + título Oportunidades',
        'Target — KPI Ticket Médio',
      ],
      localUtilities: { formatCurrency: 'inline com hide param', formatPercent: '${value.toFixed(2)}%' },
      mockConstants: {
        financialSummary: '{ grossRevenue: 850000, totalFees: 28450, netRevenue: 821550, feePercentage: 3.35, transactionCount: 12450, avgTicket: 68.27, prevGrossRevenue: 780000, prevTotalFees: 26780, grossChange: 8.97, feesChange: 6.24 }',
        feeBreakdown: '{ mdr: {card, pix, debit, total}, tariffs: {gateway, antifraud, chargebacks, withdrawals, total} }',
        feeEvolutionData: '5 meses Ago→Dez com bruto/taxas/liquido',
        feeDistributionData: '6 slices da pizza',
        feeByMethodData: '5 rows da tabela',
        optimizationInsights: '3 insights {type, title, description, potentialSavings}',
      },
    },

    componentState: {
      showValues: { initial: 'true', purpose: 'Mascarar valores monetários' },
      period: { initial: "'30d'", purpose: 'Period filter (state existe mas dados são mock fixo)' },
    },

    backendIntegration: {
      none: 'Página 100% mock — useQuery e base44 importados mas sem uso',
      gap: 'Em produção precisa agregar Transactions + FinancialEntries + Disputes do período',
    },

    layout: {
      pageHeader: {
        title: '"Análise de Tarifas"',
        subtitle: '"Visão financeira do impacto das tarifas no seu negócio"',
        breadcrumbs: [{ label: 'Financeiro', page: 'FinancialOverview' }, { label: 'Análise de Tarifas', page: 'FeesAnalysis' }],
        actions: [
          'Select w-36 + Calendar icon + 4 opções (7d/30d/90d/year)',
          'Button ghost icon Eye/EyeOff toggle',
          'Button outline + Download + "Exportar" (gap: sem onClick)',
        ],
      },

      mainKPICards: {
        layout: 'grid grid-cols-1 md:grid-cols-4 gap-4',
        cards: [
          {
            name: 'Receita Bruta',
            theme: 'border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white',
            icon: 'DollarSign blue-600 12x12 bg-blue-100',
            value: 'text-2xl font-bold formatCurrency(grossRevenue, true)',
            footer: 'TrendingUp emerald + "+8.97%" emerald-600 + "vs mês anterior"',
          },
          {
            name: 'Total em Tarifas',
            theme: 'border-2 border-red-100 from-red-50 to-white',
            icon: 'Receipt red-600',
            value: 'text-2xl font-bold red-600 + "-{formatCurrency}"',
            footer: 'Badge bg-red-100 text-red-700 "3.35% da receita"',
          },
          {
            name: 'Receita Líquida',
            theme: 'border-2 border-emerald-200 from-emerald-50 to-white',
            icon: 'Wallet emerald-600',
            value: 'text-2xl font-bold emerald-600',
            footer: 'Progress h-2 + "{100 - feePercentage}%" emerald-600',
          },
          {
            name: 'Ticket Médio',
            theme: 'default white',
            icon: 'Target purple-600 bg-purple-100',
            value: 'text-2xl font-bold formatCurrency(avgTicket)',
            footer: '"{transactionCount.toLocaleString()} transações"',
          },
        ],
      },

      visualSummaryStrip: {
        wrapper: 'Card bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-0',
        layout: 'flex items-center justify-between',
        leftFlow: 'Receita Bruta + ArrowRight + Tarifas (red-400 negativo) + ArrowRight + Receita Líquida (#00D26A)',
        rightCallout: 'Você está retendo + 96.65% (text-4xl font-bold) + de cada venda',
      },

      chartsRow: {
        layout: 'grid grid-cols-1 lg:grid-cols-3 gap-6',

        evolutionChart: {
          colSpan: 'lg:col-span-2',
          title: 'Evolução Receita vs Tarifas',
          description: 'Últimos 5 meses',
          chart: {
            height: 'h-[300px]',
            AreaChart: {
              defs: 'colorBruto (#3B82F6) + colorLiquido (#00D26A) gradientes',
              CartesianGrid: 'strokeDasharray="3 3" stroke="#E2E8F0"',
              XAxis: 'dataKey=month stroke=#94A3B8 fontSize=12',
              YAxis: 'tickFormatter R$ Xk',
              Tooltip: 'formatter formatCurrency + label "Bruto/Líquido/Tarifas" + contentStyle rounded 8px',
              areas: ['bruto blue strokeWidth=2 url(#colorBruto)', 'liquido green strokeWidth=2 url(#colorLiquido)'],
              gap: 'taxas dataKey existe nos dados mas não é renderizado como Area',
            },
          },
        },

        distributionPie: {
          title: 'Composição das Tarifas',
          description: 'Distribuição por tipo',
          chart: {
            height: 'h-[200px]',
            PieChart: {
              Pie: 'cx=50% cy=50% innerRadius=50 outerRadius=80 dataKey=value',
              Cells: '6 cells com cores de feeDistributionData[i].color',
              Tooltip: 'formatter formatCurrency',
            },
          },
          legend: 'grid grid-cols-2 gap-2 mt-4 — bolinha colorida + nome',
        },
      },

      detailedBreakdown: {
        layout: 'grid grid-cols-1 lg:grid-cols-2 gap-6',

        mdrBreakdown: {
          title: 'CreditCard blue + "Taxas de Processamento (MDR)"',
          description: 'Custos por método de pagamento',
          totalRight: 'text-xl font-bold red-600 -R$ 23.800',
          rows: [
            { bg: 'bg-blue-50', icon: 'CreditCard blue', titulo: 'Cartão de Crédito', sub: 'MDR médio: 3.29%', valor: '-R$ 18.500' },
            { bg: 'bg-emerald-50', icon: 'QrCode emerald', titulo: 'Pix', sub: 'MDR: 0.99%', valor: '-R$ 3.200' },
            { bg: 'bg-purple-50', icon: 'CreditCard purple', titulo: 'Cartão de Débito', sub: 'MDR: 1.99%', valor: '-R$ 2.100' },
          ],
        },

        tariffsBreakdown: {
          title: 'Receipt amber + "Tarifas Fixas e Operacionais"',
          totalRight: 'text-xl font-bold red-600 -R$ 15.349',
          rows: [
            { bg: 'bg-amber-50', titulo: 'Gateway (R$ 0,49/tx)', sub: '12.450 transações aprovadas', valor: '-R$ 6.102,50' },
            { bg: 'bg-red-50', titulo: 'Antifraude (R$ 0,70/tx)', sub: '12.450 análises', valor: '-R$ 8.718,50' },
            { bg: 'bg-slate-50', titulo: 'Chargebacks (R$ 15,00/cb)', sub: '30 chargebacks', valor: '-R$ 450' },
            { bg: 'bg-slate-50', titulo: 'Saques TED (R$ 3,90/saque)', sub: '20 saques via TED', valor: '-R$ 78' },
          ],
        },
      },

      tableByMethod: {
        card: { title: 'Detalhamento por Método de Pagamento', description: 'Análise completa de custos por forma de pagamento' },
        headers: ['Método', 'Volume (right)', 'Transações (right)', 'Taxa Média (right)', 'Custo Total (right)', '% do Total (right)'],
        rows: '5 rows + 1 row total bg-slate-50 font-bold com agregados',
        percentCalc: 'formatPercent((row.custo / financialSummary.totalFees) * 100)',
      },

      optimizationInsights: {
        wrapper: 'Card border-2 border-#00D26A/20 bg-gradient-to-br from-#00D26A/5 to-white',
        title: 'Lightbulb #00D26A + "Oportunidades de Economia"',
        description: 'Sugestões para reduzir seus custos com tarifas',
        insightItems: {
          dynamicStyling: 'cn() switch por insight.type: warning amber / tip emerald / info blue',
          structure: 'flex items-start gap-4: Icon + Title+Description + RightSide(Economia + Valor)',
          icons: { warning: 'AlertTriangle amber', tip: 'Lightbulb emerald', info: 'Info blue' },
        },
        totalFooter: {
          wrapper: 'flex items-center justify-between p-4 bg-#00D26A/10 rounded-xl',
          left: 'CheckCircle2 + "Economia Total Potencial" + "Se implementar todas as sugestões acima"',
          right: 'text-2xl font-bold #00D26A + reduce sum potentialSavings + "/mês"',
        },
      },
    },

    knownGaps: [
      'useQuery, base44, BarChart3, PieChartIcon, TrendingDown, BarChart, Bar, Legend importados sem uso',
      'period state existe mas não recalcula dados (todos os números são mock fixos)',
      'taxas (dataKey) existe em feeEvolutionData mas não é renderizado como Area no gráfico',
      'Optimization insights são hardcoded — em produção precisa motor de regras + IA',
      'Botão Exportar sem onClick implementado',
      'Sem drill-down clicável no Pie Chart (não navega para detalhe da fatia)',
      'Sem comparativo "vs mercado" / benchmarks de indústria',
      'Sem histórico de execução das sugestões (já implementei? quanto economizei?)',
    ],

    relationshipsToOtherPages: {
      financialOverview: '/FinancialOverview — pai do módulo (breadcrumb)',
      fees: '/Fees — catálogo das taxas (esta tela analisa o impacto delas)',
      disputeDashboard: '/DisputeDashboard — fonte do número de chargebacks (insight warning)',
      withdrawals: '/Withdrawals — fonte do número de saques TED (insight info)',
      transactions: '/Transactions — fonte da grossRevenue + feeBreakdown',
    },
  },
};

export default FeesAnalysisDoc;