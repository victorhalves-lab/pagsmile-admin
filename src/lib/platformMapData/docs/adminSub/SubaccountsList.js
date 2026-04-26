// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /SubaccountsList
// ============================================================================
// Arquivo dedicado, fidelidade absoluta a pages/SubaccountsList.jsx (455 linhas).
// Cada coluna, cada ação do dropdown, cada modal, cada validação,
// cada transição de status, cada filtro — documentado individualmente.
// ============================================================================

export const SubaccountsListDoc = {
  pageId: 'SubaccountsList',
  pagePath: '/SubaccountsList',
  module: 'Subcontas',
  parentPage: 'SubaccountsDashboard',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Lista operacional completa das subcontas do marketplace — DataTable com 9 colunas (Subconta, Contato, Categoria, Status, GMV, Saldo, Risco, Cadastro, Ações), filtros (busca em nome/CNPJ/e-mail + status), DropdownMenu com transições de estado (Aprovar/Rejeitar/Suspender/Reativar) condicional ao status atual, e 3 modais auxiliares (Detail/Limits/Rates) para drill-down.',

    sevenStatusesAndTransitions: {
      draft: 'Rascunho — gray. Pode → approve OR reject',
      pending_documents: 'Docs Pendentes — yellow. Pode → approve OR reject',
      under_review: 'Em Análise — blue. Pode → approve OR reject',
      active: 'Ativa — green. Pode → suspend',
      suspended: 'Suspensa — orange. Pode → reactivate',
      blocked: 'Bloqueada — red. Sem transição (terminal)',
      cancelled: 'Cancelada — gray. Sem transição (terminal)',
    },

    fourActionsLogic: {
      approve: { trigger: '3 status iniciais', updateData: 'status=active + approval_date=ISO', requireReason: false, buttonClass: 'bg-green-600' },
      reject: { trigger: '3 status iniciais', updateData: 'status=blocked + rejection_reason', requireReason: true, buttonClass: 'bg-red-600' },
      suspend: { trigger: 'status=active', updateData: 'status=suspended + suspension_reason', requireReason: true, buttonClass: 'bg-orange-600' },
      reactivate: { trigger: 'status=suspended', updateData: 'status=active + suspension_reason=null', requireReason: false, buttonClass: 'bg-green-600' },
    },

    threeRiskLevels: {
      low: { label: 'Baixo', color: 'bg-green-100 text-green-700' },
      medium: { label: 'Médio', color: 'bg-yellow-100 text-yellow-700' },
      high: { label: 'Alto', color: 'bg-red-100 text-red-700' },
      noRisk: 'Quando value undefined → render "-"',
    },

    nineColumnsTable: {
      col1: 'Subconta — Building2 + business_name + document',
      col2: 'Contato — Mail email truncado max-w-150 + Phone (opcional)',
      col3: 'Categoria — Badge outline mcc + mcc_description',
      col4: 'Status — Badge com cor/label do statusConfig',
      col5: 'GMV — formatCurrency(total_volume) font-semibold',
      col6: 'Saldo — formatCurrency(available_balance)',
      col7: 'Risco — Badge color-coded ou "-"',
      col8: 'Cadastro — format(created_date, "dd/MM/yyyy")',
      col9: 'Ações — DropdownMenu condicional',
    },

    threeAuxiliaryModals: {
      detail: 'SubaccountDetailModal — visão 360° (componente externo)',
      limits: 'SubaccountLimitsModal — alterar limites operacionais',
      rates: 'SubaccountRatesModal — alterar taxas negociadas',
    },

    coreCapabilities: [
      'PageHeader com CTA "Nova Subconta"',
      'Card de filtros: Search + Status Select + Badge contador',
      'DataTable com 9 colunas (componente externo)',
      'Action Dialog único parametrizado por actionType',
      'Reason Textarea obrigatório para reject/suspend (button disabled se vazio)',
      'Confirmation summary: card cinza com business_name + document',
      '3 modais separados invocáveis pelo dropdown',
    ],
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/SubaccountsList.jsx',
    totalLines: 455,

    imports: {
      react: ['useState', 'useMemo'],
      reactQuery: ['useQuery', 'useMutation', 'useQueryClient'],
      base44: 'base44.entities.Subaccount',
      navigation: ['Link', 'createPageUrl from @/components/utils'],
      sharedComponents: ['PageHeader', 'DataTable', 'StatusBadge (importado sem uso ativo — gap)'],
      uiComponents: ['Card stack', 'Button', 'Badge', 'Input', 'Label', 'Textarea', 'Select stack', 'Dialog stack', 'DropdownMenu stack'],
      utilities: ['cn (lib/utils)', 'sonner toast', 'date-fns format', 'formatCurrency from @/components/utils'],
      modals: [
        'SubaccountDetailModal (components/subaccounts)',
        'SubaccountLimitsModal',
        'SubaccountRatesModal',
      ],
      lucideIcons: [
        'Building2 — col1 + items pendentes',
        'Plus — header CTA',
        'Search — input filtro',
        'Filter — importado sem uso',
        'MoreVertical — trigger DropdownMenu',
        'Eye — Ver Detalhes',
        'CheckCircle2 — Aprovar',
        'XCircle — Rejeitar',
        'Pause — Suspender',
        'Play — Reativar',
        'Settings — Alterar Limites',
        'DollarSign — Alterar Taxas',
        'AlertTriangle — importado sem uso',
        'Mail / Phone — col2',
      ],
      constants: {
        statusConfig: 'Object com 7 status mapeados {label, color}',
        actionDialogContent: 'Object com 4 actions mapeadas {title, description, buttonText, buttonClass, requireReason}',
      },
    },

    componentState: {
      searchTerm: { initial: "''", purpose: 'Busca em business_name/document/email' },
      statusFilter: { initial: "'all'", purpose: 'Filter por status' },
      selectedSubaccount: { initial: 'null', purpose: 'Subconta sendo editada (Action Dialog)' },
      showActionDialog: { initial: 'false', purpose: 'Action Dialog (approve/reject/suspend/reactivate)' },
      actionType: { initial: 'null', purpose: 'Tipo da ação selecionada' },
      actionReason: { initial: "''", purpose: 'Motivo da ação (textarea)' },
      showDetailModal: { initial: 'false', purpose: 'SubaccountDetailModal' },
      showLimitsModal: { initial: 'false', purpose: 'SubaccountLimitsModal' },
      showRatesModal: { initial: 'false', purpose: 'SubaccountRatesModal' },
      modalSubaccount: { initial: 'null', purpose: 'Subconta passada para os 3 modais auxiliares' },
    },

    backendIntegration: {
      query: {
        queryKey: "['subaccounts']",
        queryFn: 'base44.entities.Subaccount.list("-created_date", 200)',
      },
      updateMutation: {
        mutationFn: '({ id, data }) => Subaccount.update(id, data)',
        onSuccess: 'invalidate + toast "Subconta atualizada!" + close dialog + clear states',
      },
    },

    handlers: {
      handleAction: '(subaccount, action) => set selectedSubaccount + actionType + open dialog',
      executeAction: {
        guards: '!selectedSubaccount || !actionType → return',
        switchByActionType: {
          approve: 'updateData = { status: active, approval_date: new Date().toISOString() }',
          reject: 'updateData = { status: blocked, rejection_reason: actionReason }',
          suspend: 'updateData = { status: suspended, suspension_reason: actionReason }',
          reactivate: 'updateData = { status: active, suspension_reason: null }',
        },
        dispatch: 'updateMutation.mutate({ id: selectedSubaccount.id, data: updateData })',
      },
    },

    derivedState: {
      filteredSubaccounts: {
        function: 'useMemo dependente de [subaccounts, searchTerm, statusFilter]',
        matchesSearch: '!searchTerm || business_name|document|email contém searchTerm (case-insensitive)',
        matchesStatus: 'statusFilter==="all" || sub.status === statusFilter',
      },
    },

    layout: {
      pageHeader: {
        title: '"Subcontas"',
        subtitle: '"Gerencie as subcontas do seu marketplace"',
        breadcrumbs: [{ label: 'Subcontas', page: 'SubaccountsDashboard' }, { label: 'Lista' }],
        actions: 'Button asChild + Link SubaccountOnboarding + Plus + "Nova Subconta"',
      },

      filtersCard: {
        wrapper: 'Card → CardContent p-4',
        layout: 'flex flex-wrap items-center gap-4',
        searchInput: 'flex-1 min-w-[200px] + Search icon left + placeholder "Buscar por nome, CNPJ ou e-mail..."',
        statusSelect: 'w-[180px] + opção "all" + statusConfig entries',
        countBadge: 'variant=outline "{filteredSubaccounts.length} subcontas"',
      },

      table: {
        wrapper: 'Card → CardContent p-0',
        component: 'DataTable',
        props: { columns: '9 columns array', data: 'filteredSubaccounts', isLoading: 'isLoading', onRefresh: 'refetch' },
        columns: [
          { key: 'business_name', title: 'Subconta', render: 'icon Building2 + business_name + document' },
          { key: 'contact', title: 'Contato', render: 'Mail truncate-150 + Phone optional' },
          { key: 'mcc', title: 'Categoria', render: 'Badge outline + description' },
          { key: 'status', title: 'Status', render: 'Badge color-coded' },
          { key: 'total_volume', title: 'GMV', render: 'formatCurrency font-semibold' },
          { key: 'available_balance', title: 'Saldo', render: 'formatCurrency' },
          { key: 'risk_level', title: 'Risco', render: 'Badge color (low/medium/high) ou "-"' },
          { key: 'created_date', title: 'Cadastro', render: 'format dd/MM/yyyy' },
          { key: 'actions', title: '', render: 'DropdownMenu condicional' },
        ],
      },

      actionsDropdownLogic: {
        always: 'Ver Detalhes → openDetailModal',
        ifPendingStatus: '[draft, pending_documents, under_review] → Aprovar (CheckCircle2 green) + Rejeitar (XCircle red)',
        ifActive: 'Suspender (Pause orange)',
        ifSuspended: 'Reativar (Play green)',
        always2: 'Alterar Limites (Settings) + Alterar Taxas (DollarSign)',
      },

      actionDialog: {
        title: 'actionDialogContent[actionType].title',
        description: 'actionDialogContent[actionType].description',
        body: {
          summary: 'p-4 bg-gray-50 + business_name + document',
          reasonTextarea: {
            renderIf: 'requireReason === true (reject ou suspend)',
            label: 'Motivo *',
            placeholder: 'Informe o motivo...',
            rows: 3,
          },
        },
        footer: [
          'Button outline "Cancelar"',
          {
            primary: 'Button com buttonClass dinâmico',
            label: 'buttonText (Aprovar/Rejeitar/Suspender/Reativar)',
            disabled: 'requireReason && !actionReason',
            onClick: 'executeAction',
          },
        ],
      },

      auxiliaryModals: [
        { component: 'SubaccountDetailModal', props: 'open, onOpenChange, subaccount=modalSubaccount' },
        { component: 'SubaccountLimitsModal', props: 'idem' },
        { component: 'SubaccountRatesModal', props: 'idem' },
      ],
    },

    knownGaps: [
      'StatusBadge (shared) e Filter (lucide) e AlertTriangle (lucide) importados sem uso',
      'Não há ação para "blocked" e "cancelled" — terminais sem volta',
      'Botão "Ver Detalhes" apenas abre modal interno — não navega para perfil 360 dedicado',
      'Sem ordenação clicável nas colunas (depende da DataTable)',
      'Sem paginação visível — limite 200 do backend',
      'Sem busca por mcc (categoria)',
      'Sem export CSV/Excel da lista',
      'Sem filtro por GMV mín/máx, risk_level',
      'rejection_reason vai para o campo mas não há UI para visualizá-lo posteriormente',
      'Sem confirmação dupla para ações destrutivas (reject/suspend de subcontas com volume alto)',
      'Sem auditoria visível das ações (quem aprovou? quando?)',
      'Sem indicador visual no card de subcontas que já tiveram ação recente',
    ],

    relationshipsToOtherPages: {
      subaccountsDashboard: '/SubaccountsDashboard — pai (breadcrumb)',
      subaccountOnboarding: '/SubaccountOnboarding — header CTA',
      splitManagement: '/SplitManagement — Quick Action global do módulo',
      adminIntMerchantsList: 'visão admin interno (PagSmile vê todos os merchants e subcontas)',
      adminIntMerchantProfile: '/AdminIntMerchantProfile — visão 360° admin',
    },
  },
};

export default SubaccountsListDoc;