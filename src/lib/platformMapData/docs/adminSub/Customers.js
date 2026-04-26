// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /Customers
// ============================================================================
// Arquivo dedicado, fidelidade absoluta a pages/Customers.jsx (603 linhas).
// Cada KPI, cada métrica adicional, cada coluna, cada filtro avançado, cada tab,
// cada item do dropdown, cada bloco do quick-view dialog — documentado.
// ============================================================================

export const CustomersDoc = {
  pageId: 'Customers',
  pagePath: '/Customers',
  module: 'Clientes',
  parentPage: null,

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Lista completa dos clientes (compradores finais) do merchant — 4 KPIs principais (Total / Novos 30d / Recorrentes / LTV Médio com deltas mock), 3 métricas adicionais (Ativos 30d / Inativos +90d / VIPs), Filtros Avançados colapsáveis (Segmento + LTV mín/máx + Compras mín), Tabs por segmento (Todos/VIP/Em Risco/Novos/Inativos) e DataTable com 7 colunas, Quick View Dialog com header colorido + 3 stats + contato + atividade.',

    customerVsSubaccount: {
      Subaccount: 'Outros sellers no marketplace do merchant (entidades comerciais)',
      Customer: 'Compradores finais do merchant (entidade comprador) — quem paga',
    },

    fiveSegments: {
      new: { label: 'Novo', color: 'bg-blue-100 text-blue-700', icon: 'UserPlus', meaning: 'Recém-cadastrado, nenhuma ou poucas compras' },
      recurring: { label: 'Recorrente', color: 'bg-emerald-100 text-emerald-700', icon: 'TrendingUp', meaning: 'Compra com regularidade' },
      vip: { label: 'VIP', color: 'bg-purple-100 text-purple-700', icon: 'Crown', meaning: 'Alto valor (LTV/frequência)' },
      at_risk: { label: 'Em Risco', color: 'bg-yellow-100 text-yellow-700', icon: 'AlertTriangle', meaning: 'Era recorrente mas comprou pouco recentemente' },
      inactive: { label: 'Inativo', color: 'bg-gray-100 text-gray-700', icon: 'Clock', meaning: 'Sem compras há muito tempo' },
    },

    fourMainKPIs: {
      totalCustomers: 'Total de Clientes — count(customers). Change mock: +8.5%',
      newCustomers: 'Novos (30d) — first_purchase_date >= now-30. Change mock: +12.3%',
      recurringCustomers: 'Recorrentes — segment in [recurring, vip]. Change: +5.2%',
      avgLTV: 'LTV Médio — sum(total_spent) / count(customers). Change: +3.8%',
    },

    threeAdditionalMetrics: {
      activeCustomers: 'Ativos (30d) — last_purchase_date >= now-30. Subtitle: "{X}% do total"',
      inactiveCustomers: 'Inativos (+90d) — last_purchase_date < now-90 OU sem last_purchase_date. Texto amarelo: "Oportunidade de reativação"',
      vipCustomers: 'Clientes VIP — segment === vip. Texto roxo: "Alto valor"',
    },

    fiveTabsLogic: {
      all: 'Todos os filteredCustomers',
      vip: 'filter segment === vip',
      at_risk: 'filter segment === at_risk',
      new: 'filter segment === new',
      inactive: 'filter segment === inactive',
      gap: 'Cada Tab tem Badge mostrando count exceto "Novos"',
    },

    fourAdvancedFilters: {
      segment: 'Select com 6 opções (all + 5 segments)',
      minLTV: 'number — total_spent >= valor',
      maxLTV: 'number — total_spent <= valor',
      minPurchases: 'number — total_purchases >= valor',
    },

    sevenColumns: {
      col1: 'Cliente — Avatar (iniciais bg-#101F3E text-white) + name + email',
      col2: 'Documento — value + document_type uppercase',
      col3: 'Segmento — Badge color-coded',
      col4: 'Compras — total_purchases (count)',
      col5: 'LTV — formatCurrency emerald-600',
      col6: 'Última Compra — format dd/MM/yyyy ou "Nunca"',
      col7: 'Ações — Eye link + DropdownMenu (perfil/email/transações/tag)',
    },

    quickViewDialogStructure: {
      header: 'Avatar 16x16 + name + email + Badge segment + tags do cliente',
      statsGrid: '3 cards: Compras (count) + LTV (emerald) + Ticket Médio',
      contactInfo: 'Mail + Phone (opcional) + CreditCard (document)',
      activity: '4 linhas: Primeira compra / Última / Método preferido / Chargebacks (red se >0)',
      footer: '2 botões: "Ver Perfil Completo" verde → /CustomerDetail?id=X + "Enviar E-mail"',
    },

    coreCapabilities: [
      'i18n via useTranslation',
      'Filtros Avançados toggleable (showFilters)',
      'KPI Cards via componente externo KPICard',
      '5 Tabs com DataTable em cada (componente externo)',
      'DataTable com searchable + pagination pageSize=25',
      'Avatar com iniciais auto-geradas (split + map first letter + slice 2)',
      'Quick View Dialog com 5 seções + 2 CTAs',
      'Botão "Limpar Filtros" para reset',
    ],
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/Customers.jsx',
    totalLines: 603,

    imports: {
      react: ['useState'],
      i18n: 'useTranslation (chaves: customers.title/total_customers/new_customers/returning_customers/lifetime_value, common.filter/export)',
      reactQuery: ['useQuery'],
      base44: 'base44.entities.Customer',
      navigation: ['Link', 'createPageUrl from @/utils'],
      sharedComponents: ['PageHeader', 'DataTable', 'StatusBadge (importado sem uso ativo)', 'KPICard'],
      uiComponents: ['Button', 'Badge', 'Avatar+AvatarFallback', 'Tabs stack', 'DropdownMenu stack', 'Dialog stack'],
      utilities: ['cn (lib/utils)', 'date-fns format', 'date-fns/locale ptBR'],
      lucideIcons: [
        'Users — KPI Total',
        'UserPlus — KPI Novos + segment new',
        'Eye — link Ver detalhes',
        'MoreHorizontal — DropdownMenu trigger',
        'Mail — DropdownMenu enviar e-mail',
        'Phone — info contato',
        'CreditCard — info documento + dropdown ver transações',
        'TrendingUp — KPI Recorrentes + segment recurring',
        'Crown — métrica VIP + segment vip',
        'AlertTriangle — segment at_risk',
        'Star — importado sem uso',
        'DollarSign — KPI LTV',
        'Filter — botão Filtros',
        'Download — botão Export',
        'Tag — DropdownMenu add tag',
        'Clock — métrica Inativos + segment inactive',
        'Target — métrica Ativos',
      ],
      localUtility: { formatCurrency: 'inline' },
      constants: {
        segmentConfig: 'Object com 5 segments mapeados {label, color, icon}',
      },
    },

    componentState: {
      selectedCustomer: { initial: 'null', purpose: 'Quick View Dialog (state criado mas SEM onClick que abre dialog — gap)' },
      showFilters: { initial: 'false', purpose: 'Toggle painel de filtros avançados' },
      filters: { initial: '{ segment: all, minLTV: "", maxLTV: "", minPurchases: "" }', purpose: 'Filtros avançados' },
    },

    backendIntegration: {
      query: {
        queryKey: "['customers']",
        queryFn: 'base44.entities.Customer.list("-created_date", 100)',
      },
    },

    derivedState: {
      totalCustomers: 'customers.length',
      newCustomers: 'filter first_purchase_date >= now-30 (inline, sem useMemo)',
      recurringCustomers: 'filter segment in [recurring, vip]',
      avgLTV: 'sum(total_spent) / count (zero protection)',
      activeCustomers: 'filter last_purchase_date >= now-30',
      inactiveCustomers: 'filter !last_purchase_date OR last_purchase_date < now-90',
      filteredCustomers: {
        chain: 'segment match + minLTV + maxLTV + minPurchases',
      },
    },

    layout: {
      pageHeader: {
        title: 't("customers.title")',
        subtitle: 't("customers.title")',
        breadcrumbs: [{ label: 't("customers.title")', page: 'Customers' }],
        actions: [
          'Button outline + Filter + t("common.filter") → toggle showFilters',
          'Button outline + Download + t("common.export") (gap: sem onClick)',
        ],
      },

      advancedFiltersPanel: {
        renderIf: 'showFilters === true',
        wrapper: 'bg-white rounded-xl border border-gray-100 p-4',
        layout: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
        fields: [
          { label: 'Segmento', input: 'native select com 6 opções' },
          { label: 'LTV Mínimo', input: 'number placeholder "R$ 0"' },
          { label: 'LTV Máximo', input: 'number placeholder "Sem limite"' },
          { label: 'Compras Mínimas', input: 'number placeholder "0"' },
        ],
        clearButton: 'Button ghost sm "Limpar Filtros" → reset filters object',
        gap: 'Usa native HTML select/input em vez dos componentes shadcn — inconsistência',
      },

      kpiCards: {
        layout: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
        cards: [
          { title: 'customers.total_customers', value: 'totalCustomers', change: '8.5', icon: 'Users blue', format: 'number' },
          { title: 'customers.new_customers', value: 'newCustomers', change: '12.3', icon: 'UserPlus emerald' },
          { title: 'customers.returning_customers', value: 'recurringCustomers', change: '5.2', icon: 'TrendingUp purple' },
          { title: 'customers.lifetime_value', value: 'avgLTV', change: '3.8', icon: 'DollarSign orange', format: 'currency' },
        ],
      },

      additionalMetrics: {
        layout: 'grid grid-cols-1 sm:grid-cols-3 gap-4',
        cards: [
          {
            label: 'Clientes Ativos (30d)',
            value: 'activeCustomers',
            subtitle: '{(active/total)*100}% do total',
            icon: 'Target emerald (bg-emerald-100)',
          },
          {
            label: 'Clientes Inativos (+90d)',
            value: 'inactiveCustomers',
            subtitle: 'yellow-600 "Oportunidade de reativação"',
            icon: 'Clock yellow (bg-yellow-100)',
          },
          {
            label: 'Clientes VIP',
            value: 'count segment vip',
            subtitle: 'purple-600 "Alto valor"',
            icon: 'Crown purple (bg-purple-100)',
          },
        ],
      },

      tabs: {
        defaultValue: 'all',
        tabsList: [
          { value: 'all', label: 'Todos', badge: 'customers.length secondary' },
          { value: 'vip', label: 'VIP', badge: 'count vip purple' },
          { value: 'at_risk', label: 'Em Risco', badge: 'count at_risk yellow' },
          { value: 'new', label: 'Novos', badge: 'NENHUM (gap)' },
          { value: 'inactive', label: 'Inativos', badge: 'count inactive gray' },
        ],
        eachTabContent: {
          component: 'DataTable',
          props: {
            columns: '7 columns array',
            data: 'filtered subset por segment',
            loading: 'isLoading',
            searchable: true,
            searchPlaceholder: '"Buscar por nome, e-mail ou documento..." (apenas tab "all")',
            pagination: true,
            pageSize: 25,
            currentPage: 1,
            totalItems: 'subset.length',
            emptyMessage: 'mensagem específica por segment',
          },
        },
      },

      dataTableColumns: [
        {
          key: 'name',
          render: 'Avatar 10x10 bg-#101F3E text-white + iniciais auto-geradas + name + email',
        },
        {
          key: 'document',
          render: 'document + document_type uppercase (default CPF)',
        },
        {
          key: 'segment',
          render: 'Badge color-coded com segmentConfig[value]',
        },
        { key: 'total_purchases', render: 'value || 0' },
        { key: 'total_spent', render: 'formatCurrency emerald-600' },
        { key: 'last_purchase_date', render: 'format dd/MM/yyyy ou "Nunca"' },
        {
          key: 'actions',
          render: {
            link: 'Link Eye → /CustomerDetail?id={row.id}',
            dropdown: [
              'asChild Link "Ver perfil completo"',
              'Mail "Enviar e-mail" (gap: sem onClick)',
              'CreditCard "Ver transações" (gap)',
              'Tag "Adicionar tag" (gap)',
            ],
          },
        },
      ],

      quickViewDialog: {
        trigger: 'open=!!selectedCustomer (state que NUNCA é setado para customer — gap funcional)',
        size: 'max-w-2xl',
        body: {
          header: 'Avatar 16x16 + name + email + Badge segment + tags map',
          statsGrid: 'grid-cols-3: Compras (count) / LTV (emerald) / Ticket Médio',
          contactInfo: 'Mail + Phone (optional) + CreditCard document',
          activity: '4 lines: Primeira compra / Última / Método preferido / Chargebacks (red if >0)',
          footer: 'Button bg-#00D26A "Ver Perfil Completo" → /CustomerDetail?id=X + Button outline "Enviar E-mail"',
        },
      },
    },

    knownGaps: [
      'selectedCustomer state existe mas NUNCA é setado — Quick View Dialog é dead code',
      'StatusBadge e Star (lucide) importados sem uso',
      'Filtros Avançados usam native <select>/<input> em vez de shadcn Select/Input',
      'Botão "Exportar" sem onClick',
      'DropdownMenu items "Enviar e-mail", "Ver transações", "Adicionar tag" sem onClick',
      'Tab "Novos" não tem Badge contador (inconsistência)',
      'Mocks de change% nos KPIs (8.5/12.3/5.2/3.8) hardcoded',
      'DataTables das tabs vip/at_risk/new/inactive sem searchPlaceholder e onRefresh',
      'newCustomers, activeCustomers etc. não estão em useMemo — recalculam a cada render',
      'Filtro de tabs duplicado: filtra filteredCustomers (já com filtros avançados) por segmento (gap dupla filtragem)',
      'Sem importação real de clientes (botão Add Customer não existe)',
    ],

    relationshipsToOtherPages: {
      customerDetail: '/CustomerDetail — destino do CTA principal e Eye link',
      transactions: '/Transactions — destino esperado do "Ver transações"',
      adminIntMerchantProfile: '/AdminIntMerchantProfile — visão admin interno (não diretamente, mas merchants compartilham customers)',
    },
  },
};

export default CustomersDoc;