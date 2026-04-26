// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /SubscriptionAnalytics
// ============================================================================
// Arquivo dedicado, fidelidade absoluta ao código real de pages/SubscriptionAnalytics.jsx.
// Cada KPI, cada cor de gradient, cada cell da tabela cohort, cada linha de
// motivo de cancelamento, cada métrica calculada, documentada individualmente.
// ============================================================================

export const SubscriptionAnalyticsDoc = {
  pageId: 'SubscriptionAnalytics',
  pagePath: '/SubscriptionAnalytics',
  module: 'Assinaturas',
  parentPage: 'Subscriptions',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Painel executivo de métricas SaaS (MRR, ARR, Churn, LTV, Trial→Paid) e análise de retenção via Cohort Analysis — transforma dados brutos de assinaturas em insights acionáveis para decisões estratégicas.',

    whyThisMatters: {
      forSaaS:
        'Em SaaS o NEGÓCIO é a recorrência. Métricas instantâneas (faturamento do mês) escondem a verdade — o que importa é a TRAJETÓRIA: MRR está crescendo? Churn está estabilizando? Cohort Outubro retém melhor que Setembro? Esta página responde isso.',
      forInvestors:
        'Investidores valorizam SaaS em MRR × múltiplo. Empresa com MRR R$ 1M crescendo 10% am pode valer 5-10x mais que empresa com mesmo MRR estagnado. Esta página dá os inputs do valuation.',
      forOperations:
        'Identifica gargalos: se churn no 1º mês é 18% (alto), problema é onboarding. Se 6º mês+ é 1.5%, base madura está saudável.',
    },

    keyConceptsExplained: {
      mrr: 'Monthly Recurring Revenue — soma de quanto a empresa fatura POR MÊS de assinaturas ativas. Métrica-âncora SaaS.',
      arr: 'Annual Recurring Revenue = MRR × 12. Receita anualizada se nada mudar. Comum em conversas com investidores/board.',
      churnRate: 'Taxa de cancelamento. Geralmente medido mensal (% de assinantes que cancelaram no mês). Bom SaaS: < 5% mensal. Excelente: < 2%.',
      ltv: 'Lifetime Value — receita total esperada de um cliente durante toda sua vida útil. Fórmula simples: ticket × (1/churn_rate).',
      cohortAnalysis:
        'Análise que agrupa clientes pela DATA de aquisição (cohort = "safra") e mede retenção mês a mês. Permite comparar: "minha cohort de Outubro está retendo melhor que a de Julho?" — sinaliza melhorias/pioras de produto.',
      trialConversionRate: '% dos que entraram em trial e viraram pagantes. Métrica crítica para empresas com freemium ou trial gratuito.',
      netNewMRR:
        'Decomposição do crescimento de MRR: New (novos clientes) + Expansion (upsells/upgrades de existentes) + Churn (cancelamentos, NEGATIVO) = Net New MRR. Mostra se crescimento é "verdadeiro" ou só compensação.',
    },

    coreCapabilities: [
      '4 KPIs primários em cards coloridos (MRR, ARR, Assinantes Ativos, Churn) com indicadores de variação',
      '4 KPIs secundários (LTV Médio, Ciclos Médios, Trial→Pago, Em Trial) em cards padrão',
      'Aba MRR: gráfico de evolução temporal + breakdown Net New (Novo/Expansão/Churn) + distribuição por plano',
      'Aba Churn: análise por ciclo (em qual mês mais cancelam) + por plano + ranking de motivos com barras',
      'Aba Cohort: matriz triangular de retenção mês-a-mês com cell coloring por faixa (heat map)',
      'Filtro de período (30 dias / 3 meses / 6 meses / 12 meses)',
    ],

    whoUsesIt: [
      'CEO/CFO: bater metas de MRR/ARR, reportar para investidores',
      'Head de Produto: identificar churn por ciclo e ajustar onboarding',
      'Head de Customer Success: focar atenção nos planos com maior churn',
      'Marketing: avaliar quality dos leads (cohorts recentes melhores ou piores que antigas?)',
    ],
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/SubscriptionAnalytics.jsx',
    totalLines: 493,

    // ------------------------------------------------------------------------
    // IMPORTS
    // ------------------------------------------------------------------------
    imports: {
      reactQuery: ['useQuery'],
      base44: 'base44.entities.Subscription.list("-created_date", 500) — busca real até 500 assinaturas ordenadas por mais recentes',
      lucideIcons: [
        'DollarSign — KPI MRR',
        'TrendingUp — KPI Trial→Pago e ícone secundário',
        'TrendingDown — não usado ativamente',
        'Users — KPI Assinantes Ativos',
        'RefreshCw — KPI Ciclos Médios',
        'Calendar — KPI ARR',
        'ArrowUpRight / ArrowDownRight — variação positiva/negativa',
        'Minus — neutro (não usado ativamente)',
        'Target — KPI LTV Médio',
        'Clock — KPI Em Trial',
        'UserMinus — KPI Churn Rate',
      ],
      uiComponents: ['Button', 'Tabs+TabsList+TabsTrigger+TabsContent', 'Card+CardHeader+CardContent+CardTitle+CardDescription', 'Select+items'],
      utilities: ['cn (classnames)'],
      charts: ['recharts: LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer'],
      sharedComponents: ['PageHeader', 'KPICard'],
    },

    // ------------------------------------------------------------------------
    // ESTADO LOCAL
    // ------------------------------------------------------------------------
    componentState: {
      period: { initial: "'6months'", purpose: 'Filtro de período no header — afeta título conceitual mas NÃO refiltra dados (gap atual)' },
    },

    // ------------------------------------------------------------------------
    // INTEGRAÇÃO COM BACKEND
    // ------------------------------------------------------------------------
    backendIntegration: {
      query: {
        queryKey: "['subscriptions']",
        queryFn: 'base44.entities.Subscription.list("-created_date", 500)',
        defaultData: '[] (array vazio enquanto carrega)',
        criticalNuance: 'NÃO há filtro por subaccount — assume que SDK já isola pelo contexto. Limite de 500 pode ser insuficiente para empresas grandes (gap a evoluir com paginação).',
      },
    },

    // ------------------------------------------------------------------------
    // DADOS MOCK (charts hardcoded)
    // ------------------------------------------------------------------------
    mockChartData: {
      mrrData: {
        purpose: 'Evolução temporal do MRR e suas componentes (Jul → Dez)',
        structure: '6 pontos × 4 atributos: { month, mrr, novo, expansion, churn }',
        values: '[Jul:45k/+5/+2/-3, Ago:48k/+6/+1.5/-2.5, Set:52k/+7/+2.5/-3, Out:56k/+8/+1/-2.5, Nov:62k/+9/+2/-3.5, Dez:68k/+10/+2.5/-4]',
        coherenceCheck: 'Diferenças mês-a-mês não fecham exatamente com Net New (mock didático, não modelado matematicamente)',
      },
      churnByCycleData: {
        purpose: 'Em qual ciclo da assinatura os clientes mais cancelam',
        structure: '6 pontos: { cycle, rate }',
        values: '[1º mês: 18%, 2º: 8%, 3º: 5%, 4º: 3%, 5º: 2%, 6º+: 1.5%]',
        insight: 'Curva clássica de churn SaaS — 1º mês é o mais crítico (cliente ainda não viu valor). Se base madura tem churn baixo, o problema é onboarding.',
      },
      churnByPlanData: {
        purpose: 'Distribuição percentual de cancelamentos por plano',
        structure: '3 fatias com cores fixas',
        values: '[Básico 45% (#94a3b8 cinza), Pro 30% (#3b82f6 azul), Premium 25% (#8b5cf6 roxo)]',
        insight: 'Plano Básico tem maior CONCENTRAÇÃO de cancelamentos — esperado (lá estão clientes mais commodity)',
      },
      cohortData: {
        purpose: 'Matriz TRIANGULAR de retenção: linhas=cohorts (mês de aquisição), colunas=mês após aquisição',
        structure: '6 cohorts × 6 colunas (m1-m6)',
        triangularNature: 'Cohorts mais recentes têm menos colunas (cohort de Dez/24 só tem m1=100%, todo o resto é null porque ainda não aconteceu)',
        values: {
          'Jul/24': '[100, 85, 78, 72, 68, 65]',
          'Ago/24': '[100, 88, 80, 75, 70, null]',
          'Set/24': '[100, 90, 82, 77, null, null]',
          'Out/24': '[100, 87, 79, null, null, null]',
          'Nov/24': '[100, 89, null, null, null, null]',
          'Dez/24': '[100, null, null, null, null, null]',
        },
        readingPattern: {
          horizontal: 'Lê a TRAJETÓRIA de uma cohort específica (ex: Jul perde 15% no m2, mais 7% no m3, etc.)',
          vertical: 'Compara cohorts no MESMO ponto temporal (ex: m2 → Set retém melhor com 90% que Jul com 85%)',
          improvement: 'Set/24 com 90% no m2 é MELHOR que Jul/24 com 85% — sinaliza melhoria do produto/onboarding',
        },
      },
    },

    // ------------------------------------------------------------------------
    // CÁLCULOS DERIVADOS (rodam a cada render baseado em subscriptions reais)
    // ------------------------------------------------------------------------
    derivedCalculations: {
      activeSubscriptions: {
        formula: "subscriptions.filter(s => s.status === 'active' || s.status === 'trial')",
        nuance: 'Inclui TRIALS — porque trial-com-cartão também conta como engajamento ativo',
        usedFor: 'KPI Assinantes Ativos, base do cálculo de MRR e LTV',
      },
      mrr: {
        formula: 'activeSubscriptions.reduce((sum, s) => sum + (s.amount || 0), 0)',
        criticalSimplification: 'Soma BRUTA de subscription.amount — assume todas mensais. Se houver subscriptions weekly/quarterly/annual, NÃO normaliza para mensal (gap em relação ao /Recurrence que normaliza). Para empresas com mix de billing_cycle, este MRR está incorreto.',
      },
      arr: {
        formula: 'mrr * 12',
        purpose: 'Annualização linear — assume MRR estável (não considera growth rate)',
      },
      cancelledThisMonth: {
        formula: `subscriptions.filter(s => 
          s.status === 'cancelled' && 
          s.cancellation_date && 
          new Date(s.cancellation_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        )`,
        windowLogic: 'Últimos 30 dias contados da data atual (não mês civil)',
      },
      churnRate: {
        formula: 'subscriptions.length > 0 ? (cancelledThisMonth.length / subscriptions.length) * 100 : 0',
        criticalNuance: 'Denominador é TOTAL de subscriptions (incluindo já canceladas) — fórmula tecnicamente "churn ratio" não "churn rate" puro. Churn rate canônico SaaS: cancelados / ativos_inicio_periodo.',
        protection: '> 0 guard contra divisão por zero',
      },
      avgLTV: {
        formula: 'activeSubscriptions.reduce((sum, s) => sum + (s.total_paid || 0), 0) / (activeSubscriptions.length || 1)',
        criticalSimplification:
          'Calcula TOTAL JÁ PAGO médio, não LIFETIME VALUE proper. LTV correto = ticket / churn_rate. Esta métrica subestima sistemicamente o LTV porque não considera receita futura.',
      },
      avgCycles: {
        formula: 'activeSubscriptions.reduce((sum, s) => sum + (s.current_cycle || 1), 0) / (activeSubscriptions.length || 1)',
        purpose: 'Tempo médio de vida em ciclos — proxy de longevidade',
      },
      trialSubscriptions: {
        formula: "subscriptions.filter(s => s.status === 'trial')",
      },
      convertedFromTrial: {
        formula: "subscriptions.filter(s => s.status === 'active' && s.trial_end_date)",
        nuance: 'Identifica ativas que JÁ TIVERAM trial_end_date (ou seja, passaram pela jornada de trial)',
      },
      trialConversionRate: {
        formula: 'trialSubscriptions.length > 0 ? (convertedFromTrial.length / (trialSubscriptions.length + convertedFromTrial.length)) * 100 : 0',
        denominatorLogic: 'TOTAL DE QUEM JÁ ENTROU EM TRIAL (atuais + já convertidos) — denominador correto',
      },
    },

    // ------------------------------------------------------------------------
    // FUNÇÃO UTILITÁRIA: getCellColor (heat map cohort)
    // ------------------------------------------------------------------------
    cellColorFunction: {
      signature: '(value: number | null) => string (className Tailwind)',
      thresholds: [
        { condition: 'value === null', return: "'bg-gray-100'", meaning: 'Cohort ainda não atingiu este mês — futuro' },
        { condition: 'value >= 80', return: "'bg-green-500 text-white'", meaning: 'Excelente retenção — verde forte com texto branco para contraste' },
        { condition: 'value >= 60', return: "'bg-green-300'", meaning: 'Boa retenção' },
        { condition: 'value >= 40', return: "'bg-yellow-300'", meaning: 'Atenção — possível problema' },
        { condition: 'value >= 20', return: "'bg-orange-300'", meaning: 'Alerta — alta perda' },
        { condition: 'else (< 20)', return: "'bg-red-300'", meaning: 'Crítico — quase nada retido' },
      ],
      readingNote: 'A função cria uma escala Red→Yellow→Green tradicional, mas com bg-green-500 destacado (white text) para "excelente" se diferenciar do bg-green-300 "bom".',
    },

    // ------------------------------------------------------------------------
    // LAYOUT GERAL
    // ------------------------------------------------------------------------
    layout: {
      pageHeader: {
        title: '"Analytics de Recorrência"',
        subtitle: '"Métricas de MRR, Churn, LTV e análise de cohorts"',
        breadcrumbs: [{ label: 'Assinaturas', page: 'Subscriptions' }, { label: 'Analytics' }],
        action: {
          control: 'Select de período',
          width: 'w-40',
          options: ['Últimos 30 dias (30days)', 'Últimos 3 meses (3months)', 'Últimos 6 meses (6months)', 'Últimos 12 meses (12months)'],
          gap: 'state existe mas não é USADO em filtros de dados — apenas decoração no momento (gap a evoluir)',
        },
      },
    },

    // ------------------------------------------------------------------------
    // SEÇÃO: 4 KPIs PRIMÁRIOS (cards com gradient colorido)
    // ------------------------------------------------------------------------
    primaryKpiCards: {
      gridLayout: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
      structurePerCard: 'bg-gradient-to-br from-{color}-500 to-{color}-600 text-white | CardContent pt-6 | flex justify-between',

      cards: [
        {
          name: 'MRR',
          colorScheme: 'emerald (from-emerald-500 to-emerald-600) — verde recorrência saudável',
          labelColor: 'text-emerald-100 (claro sobre verde escuro)',
          valueDisplay: 'formatCurrency(mrr) text-3xl bold',
          variation: { icon: 'ArrowUpRight w-4', text: '+12.5% vs mês anterior', color: 'inerente do card branco' },
          icon: 'DollarSign w-10 text-emerald-200',
          dataSource: 'mrr (calculado em runtime)',
        },
        {
          name: 'ARR',
          colorScheme: 'blue (from-blue-500 to-blue-600) — azul institucional/financeiro',
          labelColor: 'text-blue-100',
          valueDisplay: 'formatCurrency(arr) text-3xl bold',
          subText: '"Receita anual projetada" (text-blue-100, sem variação)',
          icon: 'Calendar w-10 text-blue-200',
          dataSource: 'arr = mrr * 12',
          differenceFromMrr: 'NÃO mostra variação % porque ARR é derivada — variação seria proporcional ao MRR',
        },
        {
          name: 'Assinantes Ativos',
          colorScheme: 'purple (from-purple-500 to-purple-600) — roxo people/community',
          labelColor: 'text-purple-100',
          valueDisplay: 'activeSubscriptions.length text-3xl bold (número absoluto)',
          variation: { icon: 'ArrowUpRight', text: '+8 novos este mês (hardcoded)', meaning: 'Net New de assinantes do mês' },
          icon: 'Users w-10 text-purple-200',
        },
        {
          name: 'Churn Rate',
          colorScheme: 'red (from-red-500 to-red-600) — vermelho perda/atenção',
          labelColor: 'text-red-100',
          valueDisplay: 'churnRate.toFixed(1) + "%" text-3xl bold',
          variation: { icon: 'ArrowDownRight (DESCIDA é POSITIVO aqui)', text: '-0.5% vs mês anterior', semantic: 'Diminuir churn é BOM — daí seta para BAIXO sendo verde-positivo (interpretação contextual)' },
          icon: 'UserMinus w-10 text-red-200',
        },
      ],
    },

    // ------------------------------------------------------------------------
    // SEÇÃO: 4 KPIs SECUNDÁRIOS (KPICard padrão)
    // ------------------------------------------------------------------------
    secondaryKpiCards: {
      gridLayout: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
      structurePerCard: 'KPICard component (sem gradient — branco padrão)',

      cards: [
        { name: 'LTV Médio', value: 'avgLTV', format: 'currency', icon: 'Target', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
        { name: 'Ciclos Médios', value: 'avgCycles', format: 'number', icon: 'RefreshCw', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
        { name: 'Trial → Pago', value: 'trialConversionRate', format: 'percentage', icon: 'TrendingUp', iconBg: 'bg-cyan-100', iconColor: 'text-cyan-600' },
        { name: 'Em Trial', value: 'trialSubscriptions.length', format: 'number', icon: 'Clock', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
      ],

      contrastWithPrimary: 'Primários são "as estrelas" (gradients dramáticos), secundários são "supporting cast" (formato consistente padrão).',
    },

    // ------------------------------------------------------------------------
    // ABA 1 — EVOLUÇÃO MRR
    // ------------------------------------------------------------------------
    tabMRR: {
      defaultTab: true,
      defaultValue: "'mrr'",

      mainAreaChart: {
        cardTitle: 'Evolução do MRR',
        cardDescription: 'Receita recorrente mensal e suas componentes',
        height: 'h-80 (320px)',
        chart: 'AreaChart',
        config: {
          xAxis: 'month (Jul→Dez)',
          yAxis: 'tickFormatter `R$${v/1000}k`',
          tooltip: 'formatter formatCurrency',
          legend: '<Legend/> ativada',
          area: { dataKey: 'mrr', name: 'MRR Total', stroke: '#10b981 (emerald-500)', fill: '#10b981', fillOpacity: 0.3 },
        },
      },

      twoColsRow: {
        layout: 'grid lg:grid-cols-2 gap-6',

        netNewMrrChart: {
          cardTitle: 'Net New MRR',
          cardDescription: 'Breakdown por tipo de movimento',
          height: 'h-64 (256px)',
          chart: 'BarChart com Legend',
          bars: [
            { dataKey: 'novo', name: 'Novo', fill: '#22c55e (green-500)', meaning: 'MRR vindo de NOVOS clientes' },
            { dataKey: 'expansion', name: 'Expansão', fill: '#3b82f6 (blue-500)', meaning: 'MRR ADICIONAL de clientes existentes (upgrade/upsell)' },
            { dataKey: 'churn', name: 'Churn', fill: '#ef4444 (red-500)', meaning: 'MRR PERDIDO (valores negativos no mock)' },
          ],
          insight: 'Permite ver: estamos crescendo por NEW (alto CAC) ou por EXPANSION (alta saúde)?',
        },

        mrrByPlanPie: {
          cardTitle: 'MRR por Plano',
          cardDescription: 'Sem (não tem CardDescription neste card)',
          height: 'h-64',
          chart: 'PieChart donut (innerRadius 60, outerRadius 90, paddingAngle 2)',
          data: 'HARDCODED IN-PLACE: [Básico 15k cinza, Pro 30k azul, Premium 23k roxo]',
          labels: '`${name} ${(percent * 100).toFixed(0)}%`',
          duplicationGap: 'O array é DUPLICADO entre data prop e map de Cells (devia extrair para const local — code smell)',
          insight: 'Pro 30k é o "motor" da empresa (44% do MRR concentrado em 1 plano)',
        },
      },
    },

    // ------------------------------------------------------------------------
    // ABA 2 — ANÁLISE DE CHURN
    // ------------------------------------------------------------------------
    tabChurn: {
      twoColsRow: {
        layout: 'grid lg:grid-cols-2 gap-6',

        churnByCycle: {
          cardTitle: 'Churn por Ciclo',
          cardDescription: 'Em qual ciclo os assinantes mais cancelam',
          height: 'h-64',
          chart: 'BarChart layout="vertical" (barras horizontais)',
          xAxis: 'type=number tickFormatter `${v}%`',
          yAxis: 'type=category dataKey=cycle width=80',
          bar: { dataKey: 'rate', name: 'Taxa de Churn', fill: '#ef4444 (red-500)', radius: '[0, 4, 4, 0]' },
          insight: '1º mês 18% é claramente o maior gap — onboarding falha',
        },

        churnByPlan: {
          cardTitle: 'Churn por Plano',
          cardDescription: 'Distribuição dos cancelamentos',
          height: 'h-64',
          chart: 'PieChart donut idêntico ao MRR por Plano (consistência visual)',
          data: 'churnByPlanData (mock)',
          colors: 'cinza/azul/roxo (mesma paleta do MRR by Plan)',
        },
      },

      cancellationReasons: {
        cardTitle: 'Principais Motivos de Cancelamento',
        layout: 'space-y-3 dentro do card',
        rendering: 'Loop sobre array hardcoded',
        items: [
          { reason: 'Não utiliza mais o serviço', count: 45, percentage: 35, insight: 'Maior categoria — sinaliza problema de ENGAJAMENTO/ATIVAÇÃO' },
          { reason: 'Preço muito alto', count: 32, percentage: 25, insight: 'Pode ser problema de PRICING ou de PERCEPÇÃO de valor' },
          { reason: 'Encontrou alternativa melhor', count: 20, percentage: 15, insight: 'Competição direta — concorrente está vencendo' },
          { reason: 'Falha de pagamento (involuntário)', count: 18, percentage: 14, insight: 'Endereçável via dunning — potencial recuperável' },
          { reason: 'Outros', count: 15, percentage: 11, insight: 'Categoria genérica — granularizar com sub-motivos' },
        ],
        rowLayout: {
          wrapper: 'flex items-center gap-4',
          textRow: 'flex justify-between text-sm mb-1: motivo (esquerda) | count + (percentage%) (direita gray-500)',
          progressBar: { wrapper: 'h-2 bg-gray-100 rounded-full overflow-hidden', fill: 'h-full bg-red-400 rounded-full', width: 'percentage% inline style' },
        },
        totalCheck: '35+25+15+14+11 = 100% ✓',
      },
    },

    // ------------------------------------------------------------------------
    // ABA 3 — COHORT ANALYSIS (heat map)
    // ------------------------------------------------------------------------
    tabCohort: {
      cardTitle: 'Análise de Cohort - Retenção',
      cardDescription: 'Percentual de retenção por mês de aquisição',

      table: {
        wrapper: 'overflow-x-auto (responsivo em mobile)',
        structure: '7 colunas (Cohort + 6 meses)',
        headerRow: {
          firstCell: 'text-left p-2 sm font-medium gray-500 — "Cohort"',
          dataCells: '6 cells text-center: "Mês 1", "Mês 2", ..., "Mês 6"',
        },
        bodyRows: {
          rendering: 'cohortData.map((row, idx) => ...)',
          firstCell: 'p-2 text-sm font-medium — row.month (ex: "Jul/24")',
          dataCells: 'p-2 text-center text-sm rounded + getCellColor(value) + value !== null ? `${value}%` : "-"',
          coloringPerCell: 'Cada cell tem cor INDIVIDUAL baseada em getCellColor — gera o efeito heat map',
        },
      },

      legend: {
        wrapper: 'flex items-center gap-4 mt-4 text-xs text-gray-500',
        prefix: '"Legenda:"',
        items: [
          { swatch: 'bg-green-500', range: '80%+' },
          { swatch: 'bg-green-300', range: '60-80%' },
          { swatch: 'bg-yellow-300', range: '40-60%' },
          { swatch: 'bg-orange-300', range: '20-40%' },
          { swatch: 'bg-red-300', range: '<20% (com &lt; escapado em HTML)' },
        ],
      },

      readingExample: {
        scenario: 'Olhar coluna m2: Jul=85, Ago=88, Set=90, Out=87, Nov=89',
        interpretation: 'Cohort Set/24 teve a MELHOR retenção no 2º mês (90%). Investigar: o que mudou em Set? Foi novo onboarding? Nova oferta?',
        actionability: 'Cohort analysis é a ferramenta MAIS poderosa de SaaS — permite isolar variáveis temporais e validar mudanças.',
      },
    },

    // ------------------------------------------------------------------------
    // GAPS & OPORTUNIDADES
    // ------------------------------------------------------------------------
    knownGaps: [
      'Filtro de período (state period) NÃO É USADO — todos os charts mostram dados estáticos do mock',
      'MRR não normaliza por billing_cycle — soma bruta de amount (incorreto se houver weekly/quarterly/annual)',
      'avgLTV usa total_paid (passado) em vez de fórmula clássica ticket/churn (subestima)',
      'churnRate usa total subscriptions como denominador (deveria ser ativas_inicio_periodo)',
      'Charts MRR/Churn/Cohort são todos MOCK hardcoded (não respondem a dados reais)',
      'Pie chart MRR por Plano duplica o array data (code smell)',
      'Sem export PDF/CSV dos relatórios (executivos costumam querer exportar)',
      'Sem comparação YoY (ano sobre ano)',
      'Sem segmentação por subaccount (em multi-merchant) ou por plano',
      'Sem MoM growth rate explícito (mostra valores absolutos mas não % de crescimento)',
      'Cohort matrix limitada a 6 meses — bases maduras precisam de 12+',
      'Imports não usados: LineChart, Line, Button, Minus, TrendingDown — code smell',
      'Lacuna grave: não conecta dados com /Customers (LTV teórico sem segmentação por persona)',
    ],

    relationshipsToOtherPages: {
      with: '/Subscriptions',
      relationship: 'Esta página é o "executivo" — /Subscriptions é o "operacional". Mesmos dados, recortes diferentes.',
      with2: '/SubscriptionPlans',
      relationship2: 'O "MRR por Plano" deveria linkar para o catálogo de planos — clicar em "Pro" filtraria /SubscriptionPlans pelo plano.',
      with3: '/DunningSettings',
      relationship3: 'Motivo "Falha de pagamento (14%)" é o KPI que justifica investimento em dunning robusto.',
      with4: '/Recurrence',
      relationship4: 'KPI "Taxa de Recuperação" do /Recurrence pode reduzir o motivo "Falha de pagamento" daqui.',
    },
  },
};

export default SubscriptionAnalyticsDoc;