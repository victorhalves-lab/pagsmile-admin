// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /SubaccountsDashboard
// ============================================================================
// Arquivo dedicado, fidelidade absoluta a pages/SubaccountsDashboard.jsx (433 linhas).
// Cada KPI, cada fatia da pizza, cada barra do top10, cada item de pendência,
// cada subconta problemática, cada Quick Action — documentado individualmente.
// ============================================================================

export const SubaccountsDashboardDoc = {
  pageId: 'SubaccountsDashboard',
  pagePath: '/SubaccountsDashboard',
  module: 'Subcontas',
  parentPage: null,

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Dashboard executivo do marketplace do merchant — 5 KPIs (Total / Ativas / Pendentes / GMV Total / Novas no mês), Pie Chart de distribuição por status (7 cores semânticas), BarChart vertical Top 10 por GMV, lista de pendências de aprovação (até 5 + CTA), lista de subcontas problemáticas (risk=high OU status=suspended) e grid de 4 Quick Actions.',

    whyMarketplaceNeedsThis: {
      reasoning:
        'Operadores de marketplace precisam visão one-pager para tomar decisão: quem aprovar, quem suspender, quem está faturando bem. Sem este dashboard, gestor precisa filtrar 100s de subcontas manualmente.',
    },

    fiveKPIs: {
      total: 'Total de Subcontas — count(subaccounts)',
      active: 'Subcontas Ativas — filter status=active. Subtitle "{X}% do total"',
      pending: 'Pendentes de Aprovação — filter status in [draft, pending_documents, under_review]',
      totalVolume: 'GMV Total — sum(total_volume) (formatado como currency)',
      newThisMonth: 'Novas este Mês — filter created_date no mês/ano corrente',
    },

    sevenStatusesPieChart: {
      active: '#10b981 (emerald)',
      pending_documents: '#f59e0b (amber)',
      under_review: '#3b82f6 (blue)',
      suspended: '#f97316 (orange)',
      blocked: '#ef4444 (red)',
      draft: '#9ca3af (gray)',
      cancelled: '#6b7280 (slate)',
    },

    problematicSubaccountsLogic: {
      filter: 'risk_level === "high" OR status === "suspended"',
      maxDisplay: '5 itens visíveis no card',
      emptyState: 'CheckCircle2 verde + "Nenhuma subconta com problema identificado"',
    },

    fourQuickActions: {
      newSubaccount: 'Nova Subconta — Plus green → /SubaccountOnboarding',
      manage: 'Gerenciar — Users blue → /Subaccounts',
      originationAgent: 'Agent Origination — BarChart3 purple → /OriginationAgentSettings (gap: rota suspeita)',
      split: 'Split — DollarSign indigo → /SplitManagement',
    },

    coreCapabilities: [
      'PageHeader com 2 CTAs: "Ver Todas" outline + "Nova Subconta" verde',
      '5 KPI Cards com KPICard component (icon, iconBgColor, iconColor, isLoading)',
      'Status Distribution donut (innerRadius=60, outerRadius=90, paddingAngle=2) + legenda flex-wrap',
      'Top 10 BarChart layout=vertical, fill=#3b82f6, names truncados em 15 chars',
      'Pending Approvals (5 visíveis + "Ver Todas (X)" se >5) com Badges semânticas',
      'Problematic com card vermelho + suspension_reason exibido',
      'Quick Actions grid 2/4 cols com hover-effect',
    ],
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/SubaccountsDashboard.jsx',
    totalLines: 433,

    imports: {
      react: ['useMemo'],
      reactQuery: ['useQuery'],
      base44: 'base44.entities.Subaccount',
      navigation: ['Link', 'createPageUrl from ../utils'],
      sharedComponents: ['PageHeader', 'KPICard (components/dashboard)'],
      uiComponents: ['Card+CardContent+CardHeader+CardTitle', 'Button', 'Badge'],
      utilities: ['cn (lib/utils)'],
      recharts: ['BarChart', 'Bar', 'XAxis', 'YAxis', 'CartesianGrid', 'Tooltip', 'ResponsiveContainer', 'PieChart', 'Pie', 'Cell'],
      lucideIcons: [
        'Building2 — KPI total + items pendentes + Quick Action',
        'Users — Quick Action Gerenciar',
        'TrendingUp — KPI Novas',
        'AlertTriangle — header card problemáticas + items',
        'Clock — KPI Pendentes + header card pendentes',
        'CheckCircle2 — KPI Ativas + empty states',
        'Plus — botão Nova + Quick Action',
        'ChevronRight — botão Ver Todas',
        'BarChart3 — Quick Action Origination',
        'DollarSign — KPI GMV + Quick Action Split',
        'ArrowUpRight, XCircle — importados sem uso',
      ],
      localUtility: { formatCurrency: 'inline' },
      constants: {
        statusColors: 'Object com 7 status mapeados para hex colors (active emerald, pending_documents amber, under_review blue, suspended orange, blocked red, draft gray, cancelled slate)',
      },
    },

    componentState: 'NENHUM — página puramente derivada da query',

    backendIntegration: {
      query: {
        queryKey: "['subaccounts']",
        queryFn: 'base44.entities.Subaccount.list("-created_date", 200)',
      },
    },

    derivedState: {
      metrics: {
        function: 'useMemo dependente de [subaccounts]',
        active: 'filter status=active',
        pending: 'filter status in [draft, pending_documents, under_review]',
        totalVolume: 'reduce sum total_volume',
        totalTransactions: 'reduce sum total_transactions',
        byStatus: 'reduce object {status: count}',
        statusData: 'Object.entries(byStatus).map → {name, value, color}',
        top10: 'spread + sort desc total_volume + slice(0,10) + map {name (slice 15), volume, transactions}',
        problematic: 'filter risk_level=high OR status=suspended',
        avgVolume: 'active.length > 0 ? totalVolume / active.length : 0',
      },
      newThisMonth: {
        formula: 'subaccounts.filter(getMonth() === now.getMonth() && getFullYear() === now.getFullYear()).length',
        gap: 'NÃO está dentro do useMemo — recalcula a cada render',
      },
    },

    layout: {
      pageHeader: {
        title: '"Dashboard de Subcontas"',
        subtitle: '"Visão geral do seu marketplace"',
        breadcrumbs: [{ label: 'Subcontas' }],
        actions: [
          'Button outline asChild + Link Subaccounts + "Ver Todas"',
          'Button asChild + Link SubaccountOnboarding + Plus + "Nova Subconta"',
        ],
      },

      kpiCards: {
        layout: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4',
        cards: [
          { title: 'Total de Subcontas', icon: 'Building2 blue', value: 'metrics.total' },
          { title: 'Subcontas Ativas', icon: 'CheckCircle2 green', value: 'metrics.active', change: '(active/total)*100', changeLabel: 'do total' },
          { title: 'Pendentes de Aprovação', icon: 'Clock yellow', value: 'metrics.pending' },
          { title: 'GMV Total', icon: 'DollarSign purple', value: 'metrics.totalVolume', format: 'currency' },
          { title: 'Novas este Mês', icon: 'TrendingUp indigo', value: 'newThisMonth' },
        ],
      },

      chartsGrid: {
        layout: 'grid grid-cols-1 lg:grid-cols-3 gap-6',

        statusDistribution: {
          colSpan: 'default 1',
          title: 'Distribuição por Status',
          chart: {
            height: 'h-[250px]',
            PieChart: {
              Pie: 'cx=50% cy=50% innerRadius=60 outerRadius=90 paddingAngle=2 dataKey=value',
              Cells: 'metrics.statusData.map → Cell fill=entry.color',
              Tooltip: 'formatter (value, name) => [value, name]',
            },
          },
          legend: 'flex flex-wrap justify-center gap-3 — bolinha colorida + name (replace _ space, capitalize) + count',
        },

        top10: {
          colSpan: 'lg:col-span-2',
          title: 'Top 10 Subcontas por GMV',
          headerAction: 'Button ghost sm → Link Subaccounts + "Ver Todas" + ChevronRight',
          chart: {
            height: 'h-[280px]',
            BarChart: {
              data: 'metrics.top10',
              layout: 'vertical',
              CartesianGrid: 'strokeDasharray="3 3" stroke=#f0f0f0',
              XAxis: 'type=number tickFormatter ${k}',
              YAxis: 'type=category dataKey=name tick fontSize=11 width=100',
              Tooltip: 'formatter formatCurrency',
              Bar: 'dataKey=volume fill=#3b82f6 radius=[0,4,4,0] (arredondado direita)',
            },
          },
        },
      },

      pendingAndProblematicGrid: {
        layout: 'grid grid-cols-1 lg:grid-cols-2 gap-6',

        pendingApprovals: {
          header: 'Clock yellow + "Aguardando Aprovação" + Badge variant=secondary metrics.pending',
          listFilter: 'subaccounts.filter status in [draft, pending_documents, under_review].slice(0, 5)',
          itemRender: {
            wrapper: 'flex items-center justify-between p-3 bg-gray-50 rounded-lg',
            left: 'p-2 bg-yellow-100 + Building2 yellow-600 + business_name + document',
            badge: {
              under_review: 'bg-blue-100 text-blue-700 "Em Análise"',
              pending_documents: 'bg-yellow-100 text-yellow-700 "Docs Pendentes"',
              draft: 'bg-gray-100 text-gray-700 "Rascunho"',
            },
          },
          emptyState: 'CheckCircle2 8x8 green + "Nenhuma subconta aguardando aprovação"',
          footer: 'metrics.pending > 5 → Button outline w-full → Link Subaccounts "Ver Todas ({pending})"',
        },

        problematicSubaccounts: {
          header: 'AlertTriangle red + "Subcontas com Problema" + Badge destructive metrics.problematic.length',
          listSlice: 'metrics.problematic.slice(0, 5)',
          itemRender: {
            wrapper: 'flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100',
            left: 'p-2 bg-red-100 + AlertTriangle red-600 + business_name + status text + (suspension_reason ? " - {reason}" : "")',
            statusText: 'status=suspended → "Suspensa", senão "Risco Alto"',
            cta: 'Button outline sm → Link Subaccounts "Ver"',
          },
          emptyState: 'CheckCircle2 8x8 green + "Nenhuma subconta com problema identificado"',
        },
      },

      quickActions: {
        title: '"Ações Rápidas"',
        layout: 'grid grid-cols-2 md:grid-cols-4 gap-4',
        items: [
          { icon: 'Plus green (bg-green-100)', title: 'Nova Subconta', sub: 'Cadastrar manualmente', target: '/SubaccountOnboarding' },
          { icon: 'Users blue (bg-blue-100)', title: 'Gerenciar', sub: 'Lista completa', target: '/Subaccounts' },
          { icon: 'BarChart3 purple (bg-purple-100)', title: 'Agent Origination', sub: 'Configurar IA', target: '/OriginationAgentSettings' },
          { icon: 'DollarSign indigo (bg-indigo-100)', title: 'Split', sub: 'Regras de divisão', target: '/SplitManagement' },
        ],
        itemStyle: 'flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50',
      },
    },

    knownGaps: [
      'newThisMonth FORA do useMemo — recalcula a cada render',
      'ArrowUpRight e XCircle importados sem uso',
      'Quick Action "Agent Origination" → /OriginationAgentSettings (rota suspeita — provavelmente deveria ser /OriginationAgent)',
      'CTAs do dashboard apontam todos para "/Subaccounts" (rota legacy — agora é /SubaccountsList)',
      '"Ver Todas" empty quando há subcontas problem mas pendentes <= 5 não aparece',
      'Sem alertas de risco programado (ex: subconta perto de bater limite)',
      'Sem comparativo mês anterior nos KPIs (apenas "Novas este Mês" sem delta)',
      'Pie Chart: nomes em snake_case mostrados com replace _ → space mas sem internacionalização',
      'Subaccount problemáticas: "Ver" sempre vai para /Subaccounts em vez de /AdminIntMerchantProfile?id=X',
    ],

    relationshipsToOtherPages: {
      subaccountsList: '/Subaccounts e /SubaccountsList — destino dos CTAs principais',
      subaccountOnboarding: '/SubaccountOnboarding — fluxo de criação',
      splitManagement: '/SplitManagement — Quick Action',
      originationAgent: '/OriginationAgentSettings — Quick Action (gap)',
      adminIntMerchantsList: 'admin interno tem versão equivalente para PagSmile gerenciar todos merchants',
    },
  },
};

export default SubaccountsDashboardDoc;