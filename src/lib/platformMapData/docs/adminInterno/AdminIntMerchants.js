// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — Seção MERCHANTS (Admin Interno)
// Fidelidade absoluta a 3 páginas + 5 componentes (~1.760 linhas):
//  - AdminIntMerchantsOverview.jsx (336 linhas) — visão hierárquica merchants → subcontas
//  - AdminIntMerchants.jsx (208 linhas) — dashboard de merchants
//  - AdminIntMerchantsList.jsx (231 linhas) — lista paginada com filtros avançados
//  - components/admin-interno/merchants/MerchantFilters.jsx (300 linhas)
//  - components/admin-interno/merchants/MerchantTable.jsx (255 linhas)
//  - components/admin-interno/merchants/MerchantBulkActions.jsx (311 linhas)
//  - components/admin-interno/merchants/MerchantSummary.jsx (70 linhas)
//  - components/admin-interno/merchants/MerchantPagination.jsx (109 linhas)
// ============================================================================

export const AdminIntMerchantsDoc = {
  pageId: 'AdminIntMerchants',
  pagePaths: ['/AdminIntMerchantsOverview', '/AdminIntMerchants', '/AdminIntMerchantsList'],
  module: 'Admin Interno',
  section: 'Merchants',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Trio de páginas que formam a coluna vertebral da gestão de merchants no back-office: (1) Overview hierárquico mãe→subcontas com 4 KPIs + tabela expansível com 7 ações por subconta condicionais ao status; (2) Dashboard com Insight Banner gradiente azul + 6 KPIs em grid + 4 charts (PieChart status, PieChart MCC, BarChart Top5 TPV horizontal, lista Últimos Merchants); (3) MerchantsList com 5 componentes filhos (Summary clicável p/ filtrar, Filters com search+3 quick popovers+1 advanced panel+badges removíveis, BulkActions com 4 SideDrawers para tags/grupo/bloqueio com confirmação BLOQUEAR/email c/ variáveis), tabela de 11 colunas com 5 sortable + dropdown de 12 ações por linha, paginação com ellipsis 7-visíveis e selector 25/50/100/200.',

    threeAdjacentLayers: {
      overview: 'Hierárquico parent→child com expand/collapse e ações contextuais',
      dashboard: 'BI/visão executiva com 6 KPIs + 4 charts + insight banner',
      list: 'CRUD denso com filtros, ações em massa e paginação avançada',
      relationship: 'Overview foca em ESTRUTURA HIERÁRQUICA / Dashboard em MÉTRICAS / List em OPERAÇÃO DIÁRIA',
    },

    // ==========================================================================
    // SUB-DOC #1 — AdminIntMerchantsOverview
    // ==========================================================================
    overviewMicroscopic: {
      role: 'Visão hierárquica de comerciantes principais e suas subcontas — focada em estrutura organizacional',

      pageHeader: {
        title: 'Gestão de Comerciantes e Subcontas',
        subtitle: 'Visão hierárquica completa de merchants e suas subcontas',
        icon: 'Building2',
        breadcrumbs: '[Admin Interno (page=AdminIntDashboard) → Gestão de Comerciantes e Subcontas (atual)]',
        gap: 'Breadcrumb final SEM page prop — não navegável',
      },

      fourKPICards: {
        layout: 'grid grid-cols-1 md:grid-cols-4 gap-4',
        comerciantes: {
          icon: 'Building2 6x6 blue-600 — bg blue-100 dark:blue-900/30 p-3 rounded-xl',
          label: 'Comerciantes',
          value: 'totalMerchants = mockMainMerchants.length',
        },
        totalSubcontas: {
          icon: 'Store 6x6 emerald-600 — bg emerald-100',
          label: 'Total Subcontas',
          value: 'totalSubaccounts = mockHierarchicalSubaccounts.length',
        },
        aguardandoAprovacao: {
          icon: 'AlertTriangle 6x6 amber-600 — bg amber-100',
          label: 'Aguardando Aprovação',
          value: 'pendingApprovals = filter status IN [pending_compliance, under_review]',
        },
        bloqueadasSuspensas: {
          icon: 'Lock 6x6 red-600 — bg red-100',
          label: 'Bloqueadas/Suspensas',
          value: 'blockedSubaccounts = filter status IN [blocked, suspended]',
        },
      },

      searchSection: {
        wrapper: 'Card → CardHeader flex justify-between',
        title: 'CardTitle "Comerciantes Principais" text-lg',
        searchInput: 'w-72 sm — Search icon left + Input "Buscar por nome ou CNPJ..." pl-10 — onChange setSearchTerm',
        filterLogic: 'mockMainMerchants.filter — business_name.toLowerCase().includes OR document.includes',
      },

      hierarchicalTable: {
        sevenColumns: ['empty (chevron toggle, w-10)', 'Comerciante (Building2 + name + category)', 'CNPJ (font-mono sm)', 'Status (StatusBadge)', 'Volume Total (text-right font-semibold formatCurrency)', 'Subcontas (text-center Badge secondary count)', 'Ações (text-right)'],

        merchantRow: {
          rowStyle: 'bg-slate-50 hover:bg-slate-100 dark:slate-800/50',
          chevron: 'Button ghost icon h-8w8 — ChevronDown se expanded ELSE ChevronRight — onClick=toggleMerchantExpand(id)',
          mainCell: 'flex items-center gap-3 — iconBox bg-blue-100 p-2 + Building2 4x4 blue-600 — name semibold + category xs slate-500',
          actionsButton: 'Link → AdminIntMerchantProfile?id={merchant.id} — Button outline sm "Ver Perfil" Eye',
          gap: 'Visual indica hierarquia mas merchant principal NÃO tem dropdown de ações (só Link "Ver Perfil") — diferente das subcontas',
        },

        subaccountRow: {
          conditionalRender: 'isExpanded && subaccounts.map() — só renderiza se chevron expandido',
          rowStyle: 'bg-white dark:bg-slate-900 (contrasta com parent slate-50)',
          firstCellEmpty: '<TableCell></TableCell> (sem chevron pois é folha)',
          mainCellWithIndent: 'flex pl-6 — w-px h-8 bg-slate-300 -ml-3 mr-2 (LINHA VERTICAL conectora) + iconBox emerald-100 + Store 4x4 emerald-600 + name medium + mcc_description xs',
          riskBadge: 'Badge variant: low→success / critical→destructive / else→secondary — text-xs',

          dropdownActions: {
            trigger: 'Button ghost icon h-8w8 + MoreHorizontal',
            content: 'align=end w-56 — 7 itens com Separator entre grupos',
            sevenItems: [
              '[1] Ver Detalhes Completos (Eye) → Link AdminIntSubaccountFullDetail?id={sub.id}',
              '[2] Ver Transações (ArrowLeftRight) → Link AdminIntSubaccountTransactions?id',
              '— SEPARATOR —',
              '[3] Gerenciar Limites (Settings) → Link AdminIntSubaccountLimits?id',
              '[4] Visualizar Taxas (DollarSign) → Link AdminIntSubaccountRates?id',
              '— SEPARATOR —',
              '[5 CONDITIONAL pending_compliance] Aprovar Subconta (Check) — emerald-600 — gap: SEM onClick',
              '[6 CONDITIONAL active] Suspender Subconta (Pause) — amber-600 — gap: SEM onClick',
              '[6b CONDITIONAL active] Bloquear Subconta (Lock) — red-600 — gap: SEM onClick',
              '[7 CONDITIONAL suspended || blocked] Reativar Subconta (Check) — emerald-600 — gap: SEM onClick',
            ],
            statusActionMatrix: {
              pending_compliance: '[Ver Detalhes, Ver Transações, Limites, Taxas, APROVAR]',
              active: '[Ver Detalhes, Ver Transações, Limites, Taxas, SUSPENDER, BLOQUEAR]',
              'suspended/blocked': '[Ver Detalhes, Ver Transações, Limites, Taxas, REATIVAR]',
              under_review: '[Ver Detalhes, Ver Transações, Limites, Taxas] — gap: nenhuma ação de mudança de status',
            },
          },
        },

        knownGapsOverview: [
          'Filtro searchTerm SÓ filtra mockMainMerchants — subcontas NÃO são filtradas',
          'Subaccounts não expandem se merchant for filtrado out (correto, mas pode confundir)',
          'KPIs hardcoded sem trend/comparativo MoM/WoW',
          'Sem botão "+ Novo Merchant" no Overview (existe na List/Dashboard) — inconsistência',
          'Linha vertical conectora (w-px h-8) é puramente cosmética — não escalável se >1 nível',
          'Risk_level Badge rendeiriza valor literal ("low", "high") sem capitalize — feio para low/medium/high/critical',
          'Ações de mudança de status (Aprovar/Suspender/Bloquear/Reativar) TODAS sem onClick — apenas visual',
          'Importações: TrendingUp, Users importados mas NÃO usados',
        ],
      },
    },

    // ==========================================================================
    // SUB-DOC #2 — AdminIntMerchants (Dashboard de Merchants)
    // ==========================================================================
    dashboardMicroscopic: {
      role: 'Dashboard executivo da base de merchants — KPIs + 4 charts + insight banner',

      pageHeader: {
        title: 'Dashboard de Merchants',
        subtitle: 'Visão Geral da Base de Clientes',
        breadcrumbs: '[Admin Interno → Merchants (page=AdminIntMerchants)]',
        actions: '[Button outline "Ver Lista" List → /AdminIntMerchantsList, Button bg-#00D26A "Novo Merchant" Plus → /AdminIntNewMerchant]',
        gap: 'Cor #00D26A inconsistente com #2bc196 do design system principal',
      },

      insightBanner: {
        component: 'InsightBanner local',
        wrapper: 'gradient blue-50→indigo-50 dark:blue-950/30→indigo-950/30 border-blue-100 rounded-xl p-4 mb-6',
        layout: 'flex items-start gap-4',
        iconBox: 'p-2 bg-blue-100 + Activity 5x5 blue-600',
        title: '"💡 INSIGHTS DO DIA - Merchants" semibold blue-900',
        threeBullets: [
          '📈 3 merchants com crescimento > 50% no mês - oportunidade de upgrade',
          '⚠️ 2 merchants com ratio de chargeback próximo do limite',
          '🆕 23 novos merchants ativados nos últimos 30 dias',
        ],
        ctaButton: 'Button ghost sm "Ver Análise Completa" — gap: SEM onClick',
        gap: 'Insights HARDCODED literais em strings — não derivam de mockMetrics',
      },

      sixKPICards: {
        layout: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4',
        kpis: [
          'Total Merchants — Store icon — value=mockMetrics.totalMerchants — sem trend',
          'Ativos — Users — trend=up change=+5%',
          'Suspensos — AlertTriangle — borderL-4 amber-500 — sem trend',
          'TPV Mês — DollarSign — prefix="R$ " — trend=up change=+18%',
          'Receita Mês — TrendingUp — prefix="R$ " — trend=up change=+12%',
          'Novos (30d) — Plus — trend=up change=+15%',
        ],
        gap: 'Trend % HARDCODED nas props — não vem de mockMetrics',
      },

      fourChartsGrid: {
        layout: 'grid grid-cols-1 lg:grid-cols-2 gap-6',

        chart1_StatusDistribution: {
          title: 'Distribuição por Status',
          cardContent: 'h-300 flex items-center',
          pieChart: 'ResponsiveContainer w=60% — Pie innerRadius=60 outerRadius=80 — Cell fill=entry.color',
          legendRight: 'w-40% space-y-2 — flex justify-between — w-3 h-3 rounded-full color circle + name + value bold',
          dataSource: 'mockMetrics.statusDistribution',
        },

        chart2_MCCDistribution: {
          title: 'Distribuição por MCC',
          structure: 'IDÊNTICA ao chart1 — pieChart 60%/legend 40%',
          dataSource: 'mockMetrics.mccDistribution',
          gap: 'Duplicação visual — chart1 e chart2 são copy-paste com data source diferente, poderia ser componente reutilizável',
        },

        chart3_TopMerchantsTPV: {
          title: 'Top 5 Merchants por TPV',
          cardContent: 'h-300',
          barChart: 'ResponsiveContainer w/h 100% — layout="vertical" margin-left 20',
          axes: 'XAxis type=number tickFormatter=`R$ ${(v/1000000).toFixed(1)}M` / YAxis dataKey=name type=category width=120 fontSize=12',
          tooltip: 'formatter=`R$ ${(v/1000000).toFixed(2)}M`',
          bar: 'fill=#3B82F6 radius=[0,4,4,0] (right-only rounded) barSize=25',
          dataSource: 'mockMetrics.topMerchants',
        },

        chart4_LastMerchants: {
          title: 'Últimos Merchants',
          renderEach: 'mockMerchants.slice(0,5) — flex items-center justify-between p-3 bg-slate-50 rounded-lg',
          leftSide: 'business_name medium + document xs slate-500',
          rightSide: 'Badge variant: active→default / suspended→destructive / else→secondary + plan_name xs',
          ctaLink: 'Link "Ver todos os merchants →" Button variant=link w-full',
          gap: 'Status badges renderizam VALOR LITERAL EM PORTUGUÊS para active/suspended mas valor cru para outros (ex: "kyc_pending") — UX inconsistente',
        },
      },

      knownGapsDashboard: [
        'mockMetrics e mockMerchants importados de mockData/adminInternoMocks — valores estáticos',
        'Insights hardcoded — não atualizam',
        'Trends hardcoded nos KPIs',
        'Cor #00D26A inconsistente (deveria ser #2bc196)',
        'Sem filtros de período — KPIs e charts sempre mostram "mockMetrics atual"',
        'Sem drilldown ao clicar nas slices do PieChart',
        'BarChart Top5 não navega ao clicar na barra',
      ],
    },

    // ==========================================================================
    // SUB-DOC #3 — AdminIntMerchantsList
    // ==========================================================================
    listMicroscopic: {
      role: 'Lista operacional principal — filtros densos + ações em massa + tabela ordenável paginada',

      pageHeader: {
        title: 'Merchants',
        subtitle: 'Gestão completa de clientes',
        breadcrumbs: '[Admin Interno → Merchants (page=AdminIntMerchantsList)]',
        actions: [
          'Link Button "Novo Merchant" Plus → /AdminIntNewMerchant',
          'Button outline "Importar" Upload — gap: SEM onClick',
          'DropdownMenu "Exportar" Download → 3 itens [Excel .xlsx FileSpreadsheet, CSV .csv File, PDF Relatório FileText] — gap: TODOS sem onClick',
          'Button outline icon Settings — gap: SEM onClick',
        ],
      },

      mainContainer: 'space-y-6 pb-20 bg-[var(--color-bg-page)] min-h-screen',

      twelveMockMerchants: {
        diversity: 'Cobre todos os 8 status (lead, kyc_pending, kyc_incomplete, active(6×), suspended, blocked, inactive não usado)',
        statusDistribution: '6 active, 1 lead, 1 kyc_pending, 1 kyc_incomplete, 1 blocked, 1 suspended',
        tpvRange: 'R$ 0 (lead/kyc) → R$ 2.340.000 (E-commerce XYZ)',
        cbRatioRange: '0% (sem TPV) → 2.34% (Fashion Online → blocked, makes sense)',
        last_access: 'Variados: minutos atrás, hoje, ontem, datas absolutas, null (lead)',
        segments: '11 segments diferentes (E-commerce, Varejo, Eletrônicos, Moda, SaaS/Digital, Educação, Marketplace, Saúde, Games, Viagens, Financeiro, Serviços)',
      },

      mockStatsHardcoded: {
        total: 1234,
        active: 987,
        kyc_pending: 78,
        kyc_incomplete: 45,
        blocked: 22,
        suspended: 23,
        lead: 45,
        inactive: 12,
        cancelled: 22,
        gap: 'mockStats NÃO bate com mockMerchants.length=12 — Stats fictícios para parecer base grande',
      },

      sevenStateVariables: [
        'filters {} — { status?: string[], methods?: string[], segment?: string, tpvMin?, tpvMax?, cbRatioMax?, salesRep? }',
        'searchTerm "" — string',
        'selectedIds [] — string[]',
        'sortField "trade_name" — initial sort',
        'sortDirection "asc"',
        'currentPage 1',
        'itemsPerPage 50 — default',
      ],

      filterPipeline_useMemo: {
        order: '[clone] → search → status → methods → segment → tpvMin → tpvMax → cbRatioMax → sort',
        searchMatch: 'OR de 4 fields: trade_name OR business_name OR document OR id (lowercase para 2 primeiros, includes raw para 2 últimos)',
        statusFilter: 'filters.status?.length>0 → result.filter(m => filters.status.includes(m.status))',
        methodsFilter: 'filters.methods.SOME(method => m.methods?.includes(method)) — OR entre métodos selecionados',
        segmentFilter: 'lowercase comparison',
        tpvMinMax: 'Number(filters.tpvMin/Max) numeric range',
        cbRatioMax: 'Number comparison <=',
        sort: 'Multi-tipo — toLowerCase() para strings — direction asc/desc',
        gap: 'Sort SEM tratamento de undefined/null — last_access null pode quebrar comparação',
      },

      paginatedMerchants_useMemo: {
        slice: 'filteredMerchants.slice((currentPage-1)*itemsPerPage, +itemsPerPage)',
        totalPages: 'Math.ceil(filteredMerchants.length / itemsPerPage)',
      },

      handleBulkAction: 'console.log apenas + setSelectedIds([]) — gap: NÃO faz nada de real',

      fiveSubComponents: {
        merchantSummary: 'Vide SUB-DOC #4',
        merchantFilters: 'Vide SUB-DOC #5',
        merchantBulkActions: 'Vide SUB-DOC #6',
        merchantTable: 'Vide SUB-DOC #7',
        merchantPagination: 'Vide SUB-DOC #8',
      },
    },

    // ==========================================================================
    // SUB-DOC #4 — MerchantSummary
    // ==========================================================================
    merchantSummaryComponent: {
      role: '4 cards-resumo CLICÁVEIS que aplicam filtro de status ao parent',
      props: '{ stats, onFilterByStatus }',
      layout: 'grid grid-cols-2 md:grid-cols-4 gap-4',

      fourSummaryItems: {
        total: {
          label: 'Total',
          icon: 'Building2 5x5 slate-600 + bg slate-100',
          value: 'stats.total || 0 — toLocaleString pt-BR',
          filter: 'null — Card NÃO tem cursor-pointer behavior',
        },
        ativos: {
          label: 'Ativos',
          icon: 'CheckCircle 5x5 green-600 + bg green-100',
          value: 'stats.active',
          filter: '["active"] — onClick aplica filtro',
        },
        emAnalise: {
          label: 'Em Análise',
          icon: 'Clock 5x5 yellow-600 + bg yellow-100',
          value: '(stats.kyc_pending || 0) + (stats.kyc_incomplete || 0)',
          filter: '["kyc_pending", "kyc_incomplete"] — combina 2 statuses em 1 card',
          tooltip: '`KYC Pendente: ${kyc_pending} | Doc. Incompleta: ${kyc_incomplete}`',
          gap: 'tooltip variável existe mas NÃO é renderizado em nenhum lugar — só bullet text "Clique para filtrar"',
        },
        bloqueados: {
          label: 'Bloqueados',
          icon: 'Ban 5x5 red-600 + bg red-100',
          value: '(stats.blocked || 0) + (stats.suspended || 0)',
          filter: '["blocked", "suspended"] — também combina',
          tooltip: '`Bloqueados: ${blocked} | Suspensos: ${suspended}`',
        },
      },

      cardBehavior: {
        cardClass: 'cursor-pointer hover:shadow-md + hover:border-blue-300 SE filter exists',
        clickHandler: 'item.filter && onFilterByStatus(item.filter)',
        bottomLabel: '"Clique para filtrar" — só aparece se filter existe',
        gap: 'Card "Total" SEM cursor-pointer mas TEM hover:shadow-md (visual confuso — parece clicável mas não é)',
      },

      knownGapsSummary: [
        '4 cards — não cobre os 8 statuses individualmente (só Ativo, kyc combinados, blocked combinados)',
        'lead/inactive/cancelled NÃO têm card próprio',
        'Tooltip prop existe no array mas NÃO renderizado',
        'Sem indicador visual de quais filtros estão ativos atualmente nos cards',
      ],
    },

    // ==========================================================================
    // SUB-DOC #5 — MerchantFilters
    // ==========================================================================
    merchantFiltersComponent: {
      role: 'Sistema de filtros denso — search + 3 quick filters + 1 advanced panel + active filter badges',

      searchBar: {
        wrapper: '<form> onSubmit=handleSearchSubmit',
        layout: 'relative',
        leftIcon: 'Search 4x4 slate-400 absolute left-3',
        input: 'placeholder="Buscar por nome, CNPJ, ID, e-mail..." pl-10 pr-10 — onChange setSearchTerm',
        clearButton: 'condicional searchTerm — X 4x4 absolute right-3 — onClick=clearSearch',
        gap: 'Submit form é via Enter / Click — onSearch só dispara via submit, NÃO em tempo real (controlado pelo parent useState searchTerm)',
        gap2: 'Placeholder menciona "e-mail" mas filterPipeline NÃO suporta busca por email',
      },

      threeQuickFilters: {
        layout: 'flex flex-wrap items-center gap-2',

        statusFilter_Popover: {
          trigger: 'Button outline sm "Status" + Badge secondary count se >0 + ChevronDown',
          contentWidth: 'w-56 p-3',
          eightStatusOptions: [
            'lead — ⚪ Lead',
            'kyc_pending — 🟡 Em Análise',
            'kyc_incomplete — 🟠 KYC Pendente',
            'active — 🟢 Ativo',
            'suspended — 🔴 Suspenso',
            'blocked — ⚫ Bloqueado',
            'inactive — ⚪ Inativo',
            'cancelled — ⚫ Cancelado',
          ],
          renderEach: 'Checkbox + Label cursor-pointer com emoji + label',
          toggleLogic: 'handleStatusToggle — toggle inclusão no array',
        },

        methodFilter_Popover: {
          trigger: 'Button outline sm "Método" + Badge count + ChevronDown',
          contentWidth: 'w-48 p-3',
          threeMethodOptions: [
            'card — 💳 Cartão',
            'pix — ⚡ PIX',
            'boleto — 📄 Boleto',
          ],
          toggleLogic: 'handleMethodToggle — toggle no array',
        },

        segmentFilter_Select: {
          width: 'w-140 h-9',
          placeholder: 'Segmento',
          elevenSegmentOptions: [
            'ecommerce — E-commerce',
            'saas — SaaS/Digital',
            'educacao — Educação',
            'marketplace — Marketplace',
            'varejo — Varejo',
            'servicos — Serviços',
            'games — Games',
            'viagens — Viagens',
            'saude — Saúde',
            'financeiro — Financeiro',
            'outros — Outros',
          ],
          firstItem: 'SelectItem value=null "Todos"',
          gap: 'value=null em SelectItem é problema com Radix Select (não permite null) — pode causar warning console',
        },

        advancedToggleButton: {
          element: 'Button outline sm "+ Filtros" Filter + Badge se activeFiltersCount>0',
          onClick: 'setShowAdvanced(!showAdvanced)',
        },
      },

      advancedFiltersPanel: {
        conditional: 'showAdvanced &&',
        wrapper: 'p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-4',
        layout: 'grid grid-cols-1 md:2 lg:4 gap-4',
        fourFields: [
          'TPV 30d (Mínimo) — type=number placeholder="R$ 0"',
          'TPV 30d (Máximo) — type=number placeholder="Sem limite"',
          'CB Ratio (Máximo) — type=number step=0.01 placeholder="%"',
          'Comercial Select — 3 reps mock: maria/joao/ana — gap: filterPipeline NÃO usa salesRep',
        ],
      },

      activeFiltersBadges: {
        conditional: 'activeFiltersCount > 0 &&',
        layout: 'flex flex-wrap items-center gap-2 — "Filtros ativos:" prefix',
        fourBadgeRenderers: {
          statusBadge: 'filters.status.map(s => STATUS_OPTIONS.find).join(", ") + X cursor-pointer onClick=removeFilter("status")',
          methodsBadge: 'similar — labels concatenados',
          segmentBadge: 'segment label resolved',
          tpvMinBadge: '"TPV > R$ {Number.toLocaleString}" — gap: NÃO renderiza tpvMax/cbRatioMax/salesRep badges',
        },
        clearAllButton: 'Button ghost sm "Limpar Todos" — onClick={clearAllFilters} — slate-500',
        gap: 'tpvMax, cbRatioMax e salesRep TÊM filter mas NÃO TÊM badge — usuário não vê filtro ativo',
      },

      activeFiltersCountLogic: 'Object.keys(filters).filter(k => filters[k] && (Array.isArray ? length>0 : true)).length',
    },

    // ==========================================================================
    // SUB-DOC #6 — MerchantBulkActions
    // ==========================================================================
    merchantBulkActionsComponent: {
      role: 'Barra de ações em massa que aparece quando selectedCount>0 + 4 SideDrawers para tags/grupo/bloqueio/email',
      conditionalRender: 'if (selectedCount === 0) return null',

      mainBar: {
        wrapper: 'flex items-center gap-4 p-3 bg-blue-50 border border-blue-200 rounded-lg',
        leftSection: 'Checkbox checked + "{selectedCount} merchants selecionados" font-medium',
        bulkDropdown: {
          trigger: 'Button outline sm "Ações em Massa" + ChevronDown',
          twelveMenuItems: [
            '[1] Adicionar Tags (Tag) → setShowTagsModal(true) FUNCIONAL',
            '[2] Remover Tags (Tag) — gap: SEM onClick',
            '— SEPARATOR —',
            '[3] Adicionar ao Grupo (FolderPlus) → setShowGroupModal(true) FUNCIONAL',
            '[4] Remover do Grupo (FolderMinus) — gap: SEM onClick',
            '— SEPARATOR —',
            '[5] Ativar (CheckCircle) — gap: SEM onClick',
            '[6] Suspender (Lock) yellow-600 — gap: SEM onClick',
            '[7] Bloquear (Ban) red-600 → setShowBlockModal(true) FUNCIONAL',
            '— SEPARATOR —',
            '[8] Enviar E-mail (Mail) → setShowEmailModal(true) FUNCIONAL',
            '[9] Exportar Selecionados (Download) — gap: SEM onClick',
            '— SEPARATOR —',
            '[10] Alterar Configuração em Massa (Settings) — gap: SEM onClick',
          ],
        },
        clearButton: 'Button ghost sm "Limpar Seleção" X + onClick={onClearSelection}',
      },

      blockSideDrawer: {
        component: 'SideDrawer (de @/components/common/SideDrawer)',
        title: 'Bloquear Merchants',
        description: 'Esta ação irá bloquear {selectedCount} merchants.',
        icon: 'Ban — bg-red-100 text-red-600',
        size: 'md',

        contentSections: {
          warningBanner: 'flex p-3 bg-red-50 text-red-800 + AlertTriangle 5x5 + texto duplicado da description',
          effectsList: 'p-3 bg-slate-50 — "Efeitos do bloqueio:" font-medium + ul disc 4 itens [Novas transações rejeitadas, Saques pendentes cancelados, Acesso portal bloqueado, E-mail enviado]',

          motivoDoBloqueio: {
            label: 'Motivo do Bloqueio *',
            select: 'Select value=blockReason → 7 BLOCK_REASONS [cb_ratio, med_ratio, fraud, docs, suspicious, judicial, other (especificar)]',
          },

          justificativaDetalhada: {
            label: 'Justificativa Detalhada *',
            textarea: 'rows=4 — onChange setBlockJustification',
            helper: '"Mínimo 50 caracteres" xs slate-500',
            validation: 'blockJustification.length < 50 → desabilita botão',
          },

          twoCheckboxes: [
            'notifyMerchants (default true) — "Notificar merchants por e-mail"',
            'blockSubaccounts (default false) — "Bloquear também contas vinculadas (subcontas)"',
          ],

          confirmacaoInput: {
            label: 'Confirmação',
            description: 'Digite "BLOQUEAR" para confirmar:',
            input: 'placeholder=BLOQUEAR + onChange=value.toUpperCase() (auto-uppercase)',
            validation: 'blockConfirmation !== "BLOQUEAR" → desabilita botão',
          },
        },

        footer: 'flex justify-end gap-3 — Button outline "Cancelar" + Button destructive "Bloquear" Ban — disabled=!blockReason || justification.length<50 || confirmation!=="BLOQUEAR"',
        handleBlock: 'guard if (blockConfirmation !== "BLOQUEAR") return — chama onAction("block", {merchantIds, reason, justification, notifyMerchants, blockSubaccounts}) — fecha drawer + resetBlockForm',
      },

      tagsSideDrawer: {
        title: 'Adicionar Tags',
        description: 'Merchants selecionados: {count}',
        icon: 'Tag',
        content: '"Selecione as Tags" Label + grid grid-cols-2 gap-2 — 6 tags hardcoded [VIP, Novo Cliente, Alto Risco, Promoção Q1, Requer Atenção, Piloto] cada com Checkbox + Label "🏷️ {tag}"',
        warning: '"⚠️ Merchants que já possuem estas tags não serão afetados."',
        footer: 'Cancelar + Adicionar Tags — gap: AMBOS botões só fecham, NÃO chamam onAction',
      },

      groupSideDrawer: {
        title: 'Adicionar ao Grupo',
        content: 'Select com 4 grupos hardcoded [📁 VIP (45 merchants), 📁 Parceria ABC (123), 📁 Taxa Promo Q1 (67), 📁 Monitoramento (12)]',
        gap: 'Counts hardcoded entre parênteses — não dinâmicos',
        footer: 'Cancelar + Adicionar ao Grupo — gap: AMBOS só fecham',
      },

      emailSideDrawer: {
        title: 'Enviar E-mail em Massa',
        description: 'Destinatários: {count} merchants',
        size: 'lg',
        threeFields: [
          'Template Select — 4 opções [Boas-vindas, Atualização de Taxas, Manutenção Programada, Escrever do zero]',
          'Assunto Input * — placeholder "[PagSmile] Comunicado Importante"',
          'Mensagem Textarea * rows=8 — placeholder com \\n e {{nome_contato}}',
        ],
        variablesHelper: '"Variáveis disponíveis: {{nome_contato}} {{nome_fantasia}} {{cnpj}} {{id_merchant}} {{saldo}}"',
        footer: 'Cancelar + Button outline "Preview" Eye — gap: SEM onClick + Enviar — só fecha drawer',
      },

      knownGapsBulkActions: [
        '7 dos 12 itens do dropdown principal SEM onClick (Remover Tags, Remover Grupo, Ativar, Suspender, Exportar, Alterar Config, alguns mais)',
        'Apenas Block tem fluxo COMPLETO (validação + onAction call)',
        'Tags drawer não captura quais tags foram selecionadas — checkboxes uncontrolled',
        'Group drawer Select sem state — não captura escolha',
        'Email drawer todos os fields uncontrolled — não captura template/assunto/mensagem',
        'Preview button do email drawer SEM onClick',
      ],
    },

    // ==========================================================================
    // SUB-DOC #7 — MerchantTable
    // ==========================================================================
    merchantTableComponent: {
      role: 'Tabela densa de 11 colunas com 5 sortable + 12-action dropdown por linha + checkbox seleção',

      tableHeader: {
        rowStyle: 'bg-slate-50 dark:bg-slate-800',
        elevenColumns: [
          'Checkbox SelectAll — w-12 — checked se selectedIds.length===merchants.length && length>0',
          'ID — w-20 cursor-pointer onClick=handleSort("id") + SortIcon',
          'Merchant — cursor-pointer handleSort("trade_name")',
          'CNPJ — sem sort',
          'Status — cursor-pointer handleSort("status")',
          'Métodos — sem sort',
          'TPV 30d — text-right cursor-pointer handleSort("tpv_30d")',
          'CB Ratio — text-right cursor-pointer handleSort("cb_ratio")',
          'Segmento — sem sort',
          'Último Acesso — cursor-pointer handleSort("last_access")',
          'Actions — w-12',
        ],
        sortIcon: 'ArrowUp se direction=asc / ArrowDown se desc — só aparece se sortField===field atual',
        sortToggleLogic: 'click no mesmo field → toggle asc↔desc; click em field novo → asc',
      },

      eightStatusConfig: {
        lead: 'bg-slate-100 text-slate-700 ⚪ Lead',
        kyc_pending: 'bg-yellow-100 text-yellow-700 🟡 Em Análise',
        kyc_incomplete: 'bg-orange-100 text-orange-700 🟠 KYC Pendente',
        active: 'bg-green-100 text-green-700 🟢 Ativo',
        suspended: 'bg-red-100 text-red-700 🔴 Suspenso',
        blocked: 'bg-slate-800 text-white ⚫ Bloqueado',
        inactive: 'bg-slate-100 text-slate-700 ⚪ Inativo',
        cancelled: 'bg-slate-800 text-white ⚫ Cancelado',
        gap: 'lead+inactive idênticos visualmente / blocked+cancelled idênticos — não distinguem',
      },

      cbRatioConfig: {
        thresholds: '<0.65=normal (green) / <0.85=attention (yellow) / >=0.85=critical (red)',
        renderEach: 'span font-medium colored "{ratio.toFixed(2)}%" + dot 2x2 ring se !=normal (yellow ou red)',
        gap: 'Thresholds 0.65/0.85 hardcoded — devem ser configuráveis pelas regras de Visa/Mastercard',
      },

      formatLastAccessFunction: {
        nullCase: 'return "Nunca"',
        recent: '<60min: "Há {n} min"',
        sameDay: '<24h: "Hoje, {HH:MM}"',
        yesterday: 'diffDays===1: "Ontem, {HH:MM}"',
        thisWeek: '<7days: locale "DD/MM HH:MM"',
        older: 'locale "DD/MM/AAAA"',
      },

      cellByCell: {
        idCell: 'font-mono text-sm — value cru',
        merchantCell: 'Link → AdminIntMerchantProfile?id={id} — text-blue-600 hover:underline — fallback trade_name || business_name',
        cnpjCell: 'font-mono — REGEX format: $1.$2.$3/$4-$5 (XX.XXX.XXX/XXXX-XX)',
        statusCell: 'Badge color dinâmico — icon + label',
        methodsCell: {
          condRender: 'flex gap-1',
          card: 'CreditCard 4x4 blue-500 com title="Cartão"',
          pix: 'QrCode 4x4 green-500 title="PIX"',
          boleto: 'FileText 4x4 amber-500 title="Boleto"',
        },
        tpvCell: {
          mainValue: 'formatCurrency(tpv_30d || 0) font-medium',
          changeIndicator: 'condicional tpv_change!==undefined → "↑/↓ {abs}%" — green se >=0, red senão',
        },
        cbRatioCell: 'condicional !== undefined — flex justify-end gap-2 + value colored + dot indicator OR "—"',
        segmentCell: 'text-sm slate-600 — fallback "—"',
        lastAccessCell: 'text-sm slate-500 — formatLastAccess()',

        actionsCell: {
          trigger: 'Button ghost icon h-8w8 + MoreVertical 4x4',
          contentAlign: 'end',
          twelveMenuItems: [
            '[1] Ver Perfil (Eye) → Link AdminIntMerchantProfile?id',
            '[2] Editar (Edit) — gap: SEM onClick',
            '[3] Credenciais API (Key) — gap: SEM onClick',
            '— SEPARATOR —',
            '[4] Enviar E-mail (Mail) — gap: SEM onClick',
            '[5] Registrar Contato (Phone) — gap: SEM onClick',
            '— SEPARATOR —',
            '[6] Suspender (Lock) yellow-600 — gap: SEM onClick',
            '[7] Bloquear (Ban) red-600 — gap: SEM onClick',
            '[8] Cancelar (XCircle) red-600 — gap: SEM onClick',
            '— SEPARATOR —',
            '[9] Copiar ID (Copy) → onClick=copyToClipboard(id, "ID") — FUNCIONAL com navigator.clipboard',
            '[10] Copiar Link do Portal (ExternalLink) — gap: SEM onClick',
          ],
          copyToClipboard: 'navigator.clipboard.writeText(text) — comentário "// Could add toast notification here" — FALTA toast',
        },
      },
    },

    // ==========================================================================
    // SUB-DOC #8 — MerchantPagination
    // ==========================================================================
    merchantPaginationComponent: {
      role: 'Paginação avançada com ellipsis 7-visíveis + selector tamanho página',

      props: '{ currentPage, totalPages, totalItems, itemsPerPage, onPageChange, onItemsPerPageChange }',

      threeSection_Layout: 'flex sm:flex-row items-center justify-between gap-4 pt-4',

      sectionLeft_Counter: {
        text: 'Mostrando {startItem}-{endItem} de {totalItems.toLocaleString("pt-BR")} merchants',
        startItem: '(currentPage-1) * itemsPerPage + 1',
        endItem: 'Math.min(currentPage * itemsPerPage, totalItems)',
      },

      sectionCenter_Pagination: {
        prevButton: 'Button outline icon ChevronLeft — disabled=currentPage===1',
        getVisiblePagesAlgorithm: {
          ifTotalPagesLE7: 'render todas as páginas 1..N',
          ifCurrentPageLE3: 'render [1,2,3,4,5, "...", N]',
          ifCurrentPageGEtotalMinus2: 'render [1, "...", N-4,N-3,N-2,N-1,N]',
          else: 'render [1, "...", current-1, current, current+1, "...", N]',
          maxVisible: 7,
        },
        ellipsisRender: 'span px-2 text-slate-400 "..."',
        pageButton: 'Button variant=default se ===currentPage ELSE outline + size=sm + w-9',
        nextButton: 'Button outline icon ChevronRight — disabled=currentPage===totalPages',
      },

      sectionRight_PageSizeSelector: {
        label: '"Itens por página:"',
        select: 'w-20 — value=String(itemsPerPage) — onChange=Number(value)',
        fourOptions: ['25', '50', '100', '200'],
      },

      knownGapsPagination: [
        'Sem botão "First" e "Last" (saltar para 1 ou totalPages)',
        'Page input direto (digite número e pula) — não suportado',
        'Selector w-20 fixo — números 100/200 podem clipar dependendo do layout',
        'Sem indicação de "fim atingido" quando totalPages=1 (botões prev/next sempre disabled)',
      ],
    },
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocations: {
      overview: 'pages/AdminIntMerchantsOverview.jsx (336 linhas)',
      dashboard: 'pages/AdminIntMerchants.jsx (208 linhas)',
      list: 'pages/AdminIntMerchantsList.jsx (231 linhas)',
      filters: 'components/admin-interno/merchants/MerchantFilters.jsx (300 linhas)',
      table: 'components/admin-interno/merchants/MerchantTable.jsx (255 linhas)',
      bulkActions: 'components/admin-interno/merchants/MerchantBulkActions.jsx (311 linhas)',
      summary: 'components/admin-interno/merchants/MerchantSummary.jsx (70 linhas)',
      pagination: 'components/admin-interno/merchants/MerchantPagination.jsx (109 linhas)',
    },

    backendIntegration: 'NENHUMA — todos usam mocks: mockMerchants/mockStats/mockMetrics/mockMainMerchants/mockHierarchicalSubaccounts',

    crossPageStateContract: {
      filtersShape: '{ status: string[], methods: string[], segment: string, tpvMin: string, tpvMax: string, cbRatioMax: string, salesRep: string }',
      sortShape: '{ sortField: string, sortDirection: "asc"|"desc" }',
      paginationShape: '{ currentPage: number, itemsPerPage: number }',
      bulkSelectionShape: 'string[] (merchant IDs)',
    },

    twelveMenuItemsCompiledByPage: {
      overviewSubaccount: '7 itens condicionais [Ver Detalhes, Ver Transações, Limites, Taxas, Aprovar(pending) | Suspender+Bloquear(active) | Reativar(suspended/blocked)]',
      listTableRow: '12 itens [Ver Perfil, Editar, Credenciais API, Enviar E-mail, Registrar Contato, Suspender, Bloquear, Cancelar, Copiar ID, Copiar Link Portal]',
      listBulkActions: '12 itens [Add Tags, Remove Tags, Add Grupo, Remove Grupo, Ativar, Suspender, Bloquear, Email, Exportar, Alterar Config]',
    },

    hardcodedConstantsConfigs: {
      blockReasons: '7 BLOCK_REASONS [cb_ratio, med_ratio, fraud, docs, suspicious, judicial, other]',
      cbThresholds: '0.65 normal / 0.85 attention',
      tagOptions: '6 hardcoded [VIP, Novo Cliente, Alto Risco, Promoção Q1, Requer Atenção, Piloto]',
      groupOptions: '4 com counts hardcoded [VIP(45), Parceria ABC(123), Taxa Promo Q1(67), Monitoramento(12)]',
      emailTemplates: '4 [Boas-vindas, Atualização Taxas, Manutenção, Custom]',
      emailVariables: '5 {{nome_contato}}, {{nome_fantasia}}, {{cnpj}}, {{id_merchant}}, {{saldo}}',
      statusOptions: '8 statuses + emojis ⚪🟡🟠🟢🔴⚫',
      methodOptions: '3 (card/pix/boleto) + emojis 💳⚡📄',
      segmentOptions: '11 segmentos',
    },

    crossComponentKnownGaps: [
      'TODAS as 3 páginas usam mocks fixos sem persistência real',
      'mockStats da List (1234 total) NÃO bate com mockMerchants.length=12 — divergência intencional para "parecer base grande"',
      'Maioria dos buttons sem onClick (estimativa: 60-70% das ações são gaps visuais)',
      'Cores: dashboard usa #00D26A inconsistente com o resto do app (#2bc196)',
      'Sem persistência de filtros entre navegações (filters resetam ao voltar)',
      'Sem URL params para filtros — não bookmarkável',
      'AlertDialog confirm para ações destrutivas só existe no BlockSideDrawer (Email/Tags/Grupo não confirmam)',
      'Tags/Group/Email drawers todos com fields uncontrolled — não capturam estado',
    ],

    relationshipsToOtherPages: {
      AdminIntMerchantProfile: 'Detalhe 360° de um merchant — 25 abas — destino dos botões "Ver Perfil"',
      AdminIntNewMerchant: 'Cadastro novo — destino do "+ Novo Merchant" CTA',
      AdminIntSubaccountFullDetail: 'Drilldown de subconta — destino do "Ver Detalhes Completos"',
      AdminIntSubaccountTransactions: 'Transações da subconta',
      AdminIntSubaccountLimits: 'Gerenciar limites',
      AdminIntSubaccountRates: 'Visualizar taxas',
      AdminIntKycAnalysis: 'Análise individual KYC (relacionada com kyc_pending status)',
      AdminIntMerchantGroups: 'Gestão dos grupos referenciados no BulkActions',
      AdminIntMerchantTags: 'Gestão das tags referenciadas no BulkActions',
      AdminIntCommTemplates: 'Templates referenciados no Email drawer',
      AdminIntBlockages: 'Histórico de bloqueios (alimentado pelo Block drawer)',
    },
  },
};

export default AdminIntMerchantsDoc;