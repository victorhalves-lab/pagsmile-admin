// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /CustomDashboards
// Fidelidade absoluta a pages/CustomDashboards.jsx (450 linhas).
// ============================================================================

export const CustomDashboardsDoc = {
  pageId: 'CustomDashboards',
  pagePath: '/CustomDashboards',
  module: 'Analytics',
  parentPage: null,

  explainer: {
    oneLiner:
      'Construtor de dashboards customizados — grid de cards (gradient verde, name + count widgets, dropdown 5 ações: Adicionar Widget/Tornar Público-Privado/Copiar URL/Excluir, badges Público-Privado-Padrão, preview de até 6 widgets em mini-quadrados, botões Visualizar/Settings), Empty State quando 0 dashboards, Biblioteca de Widgets sempre visível (5 tipos), 2 Dialogs (Novo Dashboard + Adicionar Widget com 8 métricas).',

    fiveWidgetTypes: {
      kpi: 'KPI Card — Hash icon — "Número com variação"',
      line: 'Gráfico de Linha — LineChart — "Tendências ao longo do tempo"',
      bar: 'Gráfico de Barras — BarChart3 — "Comparações entre categorias"',
      pie: 'Gráfico de Pizza — PieChart — "Distribuição percentual"',
      table: 'Tabela — Table — "Dados tabulares detalhados"',
    },

    eightAvailableMetrics: {
      sales: 'gmv, transactions, avg_ticket',
      performance: 'approval_rate',
      risk: 'disputes, chargeback_rate',
      customers: 'new_customers, recurring_customers',
    },

    fourBadgesOnCard: {
      isPublic: 'bg-emerald-100 + Globe + "Público"',
      isPrivate: 'outline + Lock + "Privado"',
      isDefault: 'bg-blue-100 + "Padrão"',
      widgetCount: 'CardDescription "{N} widgets"',
    },

    fiveDropdownActions: {
      addWidget: 'Plus + "Adicionar Widget" → set selected + open dialog',
      togglePublic: 'Globe/Lock + "Tornar Público/Privado" → mutate is_public + public_url',
      copyUrl: 'Copy + "Copiar URL" — só renderiza se is_public && public_url',
      separator: 'DropdownMenuSeparator',
      delete: 'Trash2 + "Excluir" red-600 → deleteMutation (gap: SEM confirm)',
    },

    publicUrlPattern: 'https://app.pagsmile.com/public/{dashboard_id} — gerada quando is_public=true',
  },

  technical: {
    fileLocation: 'pages/CustomDashboards.jsx',
    totalLines: 450,

    imports: {
      react: ['useState'],
      reactQuery: ['useQuery', 'useMutation', 'useQueryClient'],
      base44: 'base44.entities.CustomDashboard',
      uiComponents: ['Card stack', 'Button', 'Badge', 'Input', 'Label', 'Textarea', 'Dialog stack', 'DropdownMenu stack + Separator', 'Select stack', 'Switch (sem uso)'],
      lucideIcons: 'LayoutDashboard, Plus, Settings, Share2 (sem uso), Trash2, Eye, EyeOff (sem uso), Copy, MoreHorizontal, GripVertical (sem uso), BarChart3, LineChart, PieChart, Hash, Table, Globe, Lock, Edit (sem uso), Check (sem uso), X (sem uso)',
      sharedComponents: ['PageHeader'],
      constants: { widgetTypes: '5 objetos { id, name, icon, description }', availableMetrics: '8 objetos { id, name, category }' },
    },

    componentState: {
      isCreateOpen: { initial: 'false' },
      isAddWidgetOpen: { initial: 'false' },
      selectedDashboard: { initial: 'null', purpose: 'ID do dashboard alvo do Add Widget' },
      newDashboard: { initial: '{ name: "", description: "" }' },
      newWidget: { initial: '{ type: kpi, title: "", metric: "" }' },
    },

    backendIntegration: {
      query: { queryKey: "['custom-dashboards']", queryFn: 'CustomDashboard.list("-created_date", 50)' },
      createMutation: 'CustomDashboard.create({ ...data, dashboard_id: dash_{Date.now()}, widgets: [], is_default: false, is_public: false })',
      updateMutation: 'CustomDashboard.update — usado para Add Widget (append) e togglePublic',
      deleteMutation: 'CustomDashboard.delete — gap: sem confirmação',
    },

    helperFunctions: {
      handleCreate: 'validation name + createMutation.mutate',
      handleAddWidget: {
        validation: 'title && metric',
        widgetBuild: '{ id: widget_{ts}, type, title, config: {metric}, position: {x:0, y:length, w:1, h:1} }',
        dispatch: 'updateMutation.mutate with widgets: [...existing, widget]',
      },
      togglePublic: 'updateMutation { is_public: !current, public_url: !current ? URL : null }',
      copyPublicUrl: 'navigator.clipboard.writeText + toast',
    },

    layout: {
      pageHeader: {
        title: '"Dashboards Customizados"',
        breadcrumbs: [{ label: 'Analytics' }, { label: 'Dashboards' }],
        actions: 'Button bg-#00D26A + Plus + "Novo Dashboard"',
      },

      dashboardsGrid: {
        renderIf: 'dashboards.length > 0',
        layout: 'grid 1/2/3 cols gap-6',
        cardHeader: 'icon-box gradient-#00D26A/20-#00A854/20 + LayoutDashboard + name + "{N} widgets" + Dropdown right',
        cardContent: {
          description: 'gray-500 (condicional)',
          badges: 'Público OR Privado + (opcional) Padrão',
          widgetPreview: 'grid grid-cols-3 gap-2 — slice(0,6) com aspect-square + WidgetIcon, fallback "Nenhum widget"',
          actions: 'Eye+Visualizar (gap: sem onClick) + Settings icon (gap: sem onClick)',
        },
      },

      emptyStateCard: {
        renderIf: 'dashboards.length === 0',
        body: 'LayoutDashboard 12x12 gray-300 + "Nenhum dashboard criado" + Button verde "Criar Dashboard"',
      },

      widgetLibraryCard: {
        title: '"Biblioteca de Widgets"',
        grid: 'grid grid-cols-2 md:grid-cols-5 gap-4',
        renderEach: 'card hover:border-#00D26A/50 cursor-pointer + icon 8x8 gray-400 + name + description',
        gap: 'cursor-pointer mas SEM onClick — drag-and-drop não implementado',
      },

      createDashboardDialog: {
        size: 'max-w-md',
        body: 'Nome (obrigatório) + Descrição (Textarea)',
        footer: 'outline Cancelar + bg-#00D26A "Criar Dashboard" disabled isPending',
      },

      addWidgetDialog: {
        size: 'max-w-md',
        body: 'Type Select (5 tipos com icon) + Título Input + Metric Select (8 métricas com category)',
        footer: 'outline Cancelar + bg-#00D26A "Adicionar"',
      },
    },

    knownGaps: [
      'Switch, Share2, EyeOff, GripVertical, Edit, Check, X (lucide) sem uso',
      'deleteMutation SEM confirmação dupla',
      'Biblioteca cards cursor-pointer mas sem onClick (drag-and-drop esperado)',
      'Botões Visualizar e Settings dos cards SEM onClick',
      'Sem tela de visualização efetiva do dashboard',
      'Sem edição/remoção de widgets individuais (só add)',
      'position hardcoded x:0, y:length, w:1, h:1 — sem layout grid drag',
      'Public URL hardcoded "https://app.pagsmile.com/public/{id}" — sem auth pública',
      'is_default não pode ser setado pela UI',
      'Sem ordering/sorting/busca/duplicar/export',
    ],

    relationshipsToOtherPages: {
      reports: '/Reports — irmão Analytics',
      dashboard: '/Dashboard — padrão (gap: sem duplicar)',
      transactions: '/Transactions — fonte das métricas gmv/transactions/avg_ticket',
      disputes: '/Disputes — fonte das métricas disputes/chargeback_rate',
      customers: '/Customers — fonte das métricas new_customers/recurring_customers',
    },
  },
};

export default CustomDashboardsDoc;