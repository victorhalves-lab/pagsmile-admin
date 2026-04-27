// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — Páginas Auxiliares MERCHANTS (Admin Interno)
// Fidelidade absoluta a 6 páginas (~1.495 linhas):
//  - AdminIntSubaccounts.jsx (155 linhas) — marketplaces + subcontas resumidas
//  - AdminIntLimitRequests.jsx (469 linhas) — fila aprovação com SDK base44 REAL
//  - AdminIntMerchantGroups.jsx (362 linhas) — CRUD grupos + cores + taxas especiais
//  - AdminIntMerchantTags.jsx (226 linhas) — CRUD tags com isSystem lock
//  - AdminIntMerchantReports.jsx (165 linhas) — 6 templates + histórico
//  - AdminIntNewMerchant.jsx (680 linhas) — wizard 4-step com CNPJ/CEP lookup
// ============================================================================

export const AdminIntMerchantsExtrasDoc = {
  pageId: 'AdminIntMerchantsExtras',
  pagePaths: [
    '/AdminIntSubaccounts',
    '/AdminIntLimitRequests',
    '/AdminIntMerchantGroups',
    '/AdminIntMerchantTags',
    '/AdminIntMerchantReports',
    '/AdminIntNewMerchant',
  ],
  module: 'Admin Interno',
  section: 'Merchants — Páginas Auxiliares',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Conjunto de 6 páginas auxiliares que complementam a gestão de merchants: (1) Subaccounts foca marketplaces+sellers com 4 KPIs + tabela 7-col Marketplaces + tabela 4-col Últimas Subcontas; (2) LimitRequests é a ÚNICA destas 6 com integração SDK REAL — usa useQuery+useMutation+base44.entities.ClientLimitRequest com filter status, mutation update com reviewed_by/reviewed_at/approved_limit, SideDrawer review com 5 client_metrics dinâmicas; (3) MerchantGroups CRUD completo de grupos com 8 cores selecionáveis + condicional "Aplicar configurações especiais" expand 4-fields rates; (4) MerchantTags CRUD simples com flag isSystem que bloqueia edit/delete via disabled; (5) MerchantReports 6 templates pré-configurados + tabela "Recentes" com download + simulação 2s loading; (6) NewMerchant wizard 4-step com progresso visual conector entre etapas, lookup CNPJ simulado retornando 6 fields RFB, lookup CEP onBlur, 3 method-cards selecionáveis com border colorido, status inicial 3 opções (lead/kyc_pending/active gerentes-only), Step 4 Review com Edit-buttons que voltam ao step + 3 ações automáticas após criação.',

    sixPageOverview: {
      subaccounts: 'Visão simplificada — 12 marketplaces hardcoded + 4 KPIs',
      limitRequests: 'PRIMEIRA página com SDK base44 REAL — fluxo completo de aprovação',
      groups: 'CRUD com 8 cores + 4-field special rates condicional',
      tags: 'CRUD com isSystem lock (3 tags bloqueadas)',
      reports: '6 templates + simulação async 2000ms',
      newMerchant: 'Wizard 4-step com 35+ fields totais',
    },

    // ==========================================================================
    // SUB-DOC #1 — AdminIntSubaccounts
    // ==========================================================================
    subaccountsMicroscopic: {
      role: 'Painel resumido de marketplaces e suas subcontas — visão rápida sem profundidade',

      pageHeader: {
        title: 'Subcontas & Marketplaces',
        subtitle: 'Gestão de Sellers e Splits',
        breadcrumbs: '[Admin Interno (page=AdminIntDashboard) → Merchants (page=AdminIntMerchants) → Subcontas (atual)]',
      },

      fourKPICards: {
        layout: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
        kpis: [
          { title: 'Marketplaces', value: '"12" hardcoded', icon: 'ShoppingBag' },
          { title: 'Subcontas Total', value: '"845" hardcoded', icon: 'Users' },
          { title: 'Aguard. Aprovação', value: '"28" hardcoded', icon: 'Clock', extraStyle: 'border-l-4 border-l-amber-500' },
          { title: 'GMV Subcontas', value: '"15M" prefix "R$ "', icon: 'DollarSign' },
        ],
        gap: 'KPIs HARDCODED como string — não derivam de mockMarketplaces ou mockSubaccounts',
      },

      twoColumnLayout: 'grid grid-cols-1 lg:grid-cols-3 gap-6 — left col-span-2 / right col-span-1',

      leftColumn_MarketplacesTable: {
        cardTitle: 'Marketplaces',
        threeMockMarketplaces: [
          { id: 'M-001', name: 'Marketplace A', subaccounts: 350, active: 320, pending: 15, gmv: '8.5M', status: 'active' },
          { id: 'M-002', name: 'Marketplace B', subaccounts: 280, active: 265, pending: 8, gmv: '4.2M', status: 'active' },
          { id: 'M-003', name: 'Marketplace C', subaccounts: 215, active: 200, pending: 5, gmv: '2.3M', status: 'warning' },
        ],
        sevenColumns: ['Marketplace (font-medium)', 'Subcontas (raw number)', 'Ativas (text-green-600 font-medium)', 'Pendentes (text-amber-600)', 'GMV ("R$ {gmv/1M.toFixed(1)}M")', 'Status (StatusBadge component)', 'Ações (text-right)'],
        actions: 'Button ghost sm asChild Link → AdminIntMerchantProfile?id={mp.id} — Eye icon — gap: marketplace.id ≠ merchant.id (M-001 não bate com mockMerchants)',
        gap: 'Apenas 3 marketplaces no array mas KPI diz "12 marketplaces" — divergência intencional p/ "parecer base maior"',
      },

      rightColumn_SubaccountsTable: {
        cardTitle: 'Últimas Subcontas',
        dataSource: 'mockSubaccounts (do adminInternoMocks)',
        fourColumns: ['Vendedor (name medium + marketplace xs slate-500)', 'GMV (formatCurrency Intl)', 'Status (StatusBadge)', 'Ações (DropdownMenu)'],
        formatCurrency: 'Intl.NumberFormat pt-BR style currency BRL — local helper, NÃO importa de @/components/utils',
        dropdownActions: {
          trigger: 'Button ghost sm + MoreVertical',
          alignEnd: true,
          threeItems: [
            'Ver Detalhes (Eye) → Link AdminIntSubaccountDetail?id',
            'Alterar Limites (Settings) → Link AdminIntSubaccountLimits?id',
            'Alterar Taxas (DollarSign) → Link AdminIntSubaccountRates?id',
          ],
        },
      },

      knownGapsSubaccounts: [
        '4 KPIs com valores hardcoded como strings — não dinâmicos',
        '3 marketplaces vs KPI "12 Marketplaces" — divergência',
        'mp.id format diferente de merchant.id — Link "Ver Profile" pode quebrar',
        'formatCurrency redefinido localmente em vez de usar @/components/utils/formatCurrency',
        'Sem filtros, busca, paginação',
        'Sem botão "+ Novo Marketplace" ou "+ Subconta"',
        'StatusBadge "warning" no Marketplace C sem indicação de causa',
      ],
    },

    // ==========================================================================
    // SUB-DOC #2 — AdminIntLimitRequests (PRIMEIRA com SDK REAL)
    // ==========================================================================
    limitRequestsMicroscopic: {
      role: 'ÚNICA página com integração SDK base44 REAL — fluxo completo de aprovação de aumento de limite',

      backendIntegration: {
        sdkUsage: 'PRIMEIRA documentação com base44 REAL via @tanstack/react-query',
        listQuery: '`useQuery({ queryKey: ["limit-requests", statusFilter], queryFn: () => statusFilter==="all" ? base44.entities.ClientLimitRequest.list("-created_date", 100) : base44.entities.ClientLimitRequest.filter({status: statusFilter}, "-created_date", 100) })`',
        reviewMutation: 'useMutation — chama base44.entities.ClientLimitRequest.update(id, {status, reviewed_by: user.email, reviewed_at: new Date().toISOString(), admin_comments, approved_limit: decision==="approved" ? approved_limit : null})',
        userAuth: 'base44.auth.me() para pegar email do reviewer',
        invalidation: 'queryClient.invalidateQueries(["limit-requests"]) onSuccess',
      },

      sevenLimitTypeLabels: {
        per_transaction: 'Por Transação',
        daily: 'Diário',
        monthly: 'Mensal',
        pix_per_transaction: 'Pix - Por Transação',
        pix_daily: 'Pix - Diário',
        card_per_transaction: 'Cartão - Por Transação',
        card_daily: 'Cartão - Diário',
      },

      fourStatusConfig: {
        pending: 'yellow + Clock',
        under_review: 'blue + Eye',
        approved: 'green + CheckCircle',
        rejected: 'red + XCircle',
      },

      pageHeader: {
        title: 'Solicitações de Limite',
        subtitle: 'Aprove ou rejeite solicitações de aumento de limite dos clientes',
        breadcrumbs: '[Merchants → Solicitações de Limite (atual)]',
      },

      fourStatsCards: {
        layout: 'grid grid-cols-1 md:grid-cols-4 gap-4',
        cards: [
          {
            label: 'Pendentes',
            value: 'pendingCount = filter status=pending',
            icon: 'Clock yellow-600',
            highlight: 'CONDICIONAL: statusFilter==="pending" → border-yellow-300 bg-yellow-50',
          },
          {
            label: 'Em Análise',
            value: 'underReviewCount',
            icon: 'Eye blue-600',
          },
          {
            label: 'Alta Prioridade',
            value: 'highPriorityCount = filter priority=high && status IN [pending, under_review]',
            icon: 'AlertTriangle red-600',
            highlight: 'CONDICIONAL: highPriorityCount>0 → border-red-300 bg-red-50',
          },
          {
            label: 'Total Solicitações',
            value: 'requests.length',
            icon: 'FileText slate-600',
          },
        ],
      },

      filterCard: {
        wrapper: 'Card → Filter icon + Select w-200',
        statusFilterDefault: '"pending"',
        fiveOptions: ['Todas (all)', 'Pendentes (pending)', 'Em Análise (under_review)', 'Aprovadas (approved)', 'Rejeitadas (rejected)'],
      },

      requestsTable: {
        nineColumns: [
          'Cliente — iconBox 8x8 slate-100 + Building2 + business_name medium + document xs',
          'Tipo de Limite — Badge outline {limitTypeLabels[limit_type]}',
          'Limite Atual — text-right font-medium formatCurrency',
          'Limite Solicitado — text-right font-bold blue-600',
          'Aumento — flex flex-col items-end → "+R$ X.XXX,XX" green + "+XX%" xs slate-500',
          'Prioridade — Badge color {high: red, medium: yellow, low: blue} + label "Alta/Média/Baixa"',
          'Status — Badge gap-1 border-2 + StatusIcon + label',
          'Solicitado em — date-fns format("dd/MM/yyyy", locale: ptBR)',
          'Action — CONDICIONAL: pending|under_review → Button outline sm "Revisar" / approved → Button ghost sm Eye / rejected → vazio',
        ],
        emptyState: 'condicional requests.length===0 → center py-12 + TrendingUp 12x12 slate-300 + "Nenhuma solicitação de limite"',
      },

      reviewSideDrawer: {
        wrapper: 'SideDrawer size=lg + icon TrendingUp',
        title: 'Revisar Solicitação de Limite',
        description: 'Analise a solicitação e aprove ou rejeite com base nas métricas do cliente',

        clientInfoBox: {
          wrapper: 'p-4 bg-slate-50 rounded-lg',
          twoCol: 'Cliente {business_name + document} | Tipo de Limite {limitTypeLabels[type]}',
        },

        threeLimitsComparison: {
          layout: 'grid grid-cols-3 gap-4',
          atual: 'p-4 bg-slate-50 — "Limite Atual" + xl bold formatCurrency',
          solicitado: 'p-4 bg-blue-50 border-2 border-blue-200 — "Solicitado" + xl bold blue-700 + "+R$ X (+Y%)" calc inline',
          aprovado: 'p-4 bg-green-50 — "Limite Aprovado" + Input type=number CONTROLLED via reviewData.approved_limit + placeholder=requested_limit',
        },

        justificationField: {
          conditional: 'IF selectedRequest.justification',
          render: 'Label "Justificativa do Cliente" + p-3 bg-slate-50 rounded-lg sm + texto',
        },

        clientMetrics: {
          conditional: 'IF selectedRequest.client_metrics',
          layout: 'grid 2-col / md:5-col gap-3',
          fiveMetrics: [
            'TPV Total — bg-blue-50 — formatCurrency(total_tpv)',
            'Ticket Médio — bg-purple-50 — formatCurrency(avg_ticket)',
            'Taxa de Aprovação — bg-green-50 — "{approval_rate}%"',
            'CB Ratio — bg-orange-50 — "{chargeback_ratio}%"',
            'Tempo como Cliente — bg-slate-50 — "{time_as_client_days} dias"',
          ],
        },

        decisionFields: {
          decisionSelect: {
            label: 'Decisão *',
            twoOptions: [
              'approved — CheckCircle green + "Aprovar"',
              'rejected — XCircle red + "Rejeitar"',
            ],
          },
          commentsTextarea: 'Label "Comentários" + Textarea rows=3 + placeholder "Adicione comentários sobre a decisão..."',
        },

        validation: {
          handleReview: '(1) IF !decision → toast.error("Selecione uma decisão") return / (2) IF approved && !approved_limit → toast.error("Informe o limite aprovado") return / (3) reviewMutation.mutate({id, decision, comments, approved_limit: parseFloat})',
          submitDisabled: 'reviewMutation.isPending → "Processando..."',
        },

        footerButton: {
          dynamicColor: 'CONDICIONAL: decision==="approved" → bg-green-600 / decision==="rejected" → bg-red-600',
          gap: 'Cor do botão muda baseada na decisão MAS apenas após selecionar — feedback visual atrasado',
        },
      },

      knownGapsLimitRequests: [
        'isLoading não tem skeleton — tabela apenas renderiza vazia até dados chegarem',
        'Sem paginação — sempre carrega 100 (max via .list/filter)',
        'increasePercent.toFixed(0) — perde precisão decimal',
        'Botão Eye em status=approved — gap: SEM onClick',
        'priority HIGH/MEDIUM/LOW renderizado como ENUM — sem suporte a "urgent" ou "critical"',
        'Sem histórico de revisões anteriores no Drawer (auditoria)',
        'Sem rejection_reason obrigatório se decision=rejected — analista pode rejeitar sem comments',
        'parseFloat(reviewData.approved_limit) sem validação numérica — pode resultar em NaN',
      ],
    },

    // ==========================================================================
    // SUB-DOC #3 — AdminIntMerchantGroups
    // ==========================================================================
    merchantGroupsMicroscopic: {
      role: 'CRUD de grupos com cores + descrição + responsável + opcional taxas especiais',

      sixMockGroups: [
        '1: VIP / purple / 45 / 12.3M / Maria Santos',
        '2: Parceria ABC / blue / 123 / 8.7M / João Silva',
        '3: Taxa Promo Q1 / green / 67 / 3.4M / Ana Costa',
        '4: Monitoramento / red / 12 / 890k / Carlos Risco',
        '5: Região Sul / cyan / 234 / 15.2M / Pedro Regional',
        '6: Piloto v2.0 / orange / 8 / 450k / Tech Team',
      ],

      eightColorOptions: [
        'blue — 🔵 Azul — bg-blue-500',
        'green — 🟢 Verde — bg-green-500',
        'yellow — 🟡 Amarelo — bg-yellow-500',
        'orange — 🟠 Laranja — bg-orange-500',
        'red — 🔴 Vermelho — bg-red-500',
        'purple — 🟣 Roxo — bg-purple-500',
        'gray — ⚪ Cinza — bg-gray-500',
        'cyan — 🔷 Ciano — bg-cyan-500',
      ],

      pageHeader: {
        title: 'Grupos de Merchants',
        subtitle: 'Organize merchants em categorias personalizadas',
        breadcrumbs: '[Admin Interno → Merchants (List) → Grupos]',
        rightAction: 'Button "Novo Grupo" Plus → setShowCreateModal(true)',
      },

      searchBar: 'Search icon left + Input "Buscar grupos..." pl-10',

      summaryStrip: {
        layout: 'flex items-center gap-6 text-sm',
        threeStats: [
          'Total: {groups.length} grupos',
          '• {totalMerchants reduce sum} merchants agrupados',
          '• 745 sem grupo (HARDCODED ungroupedCount)',
        ],
      },

      groupsTable: {
        sixColumns: ['Grupo (color dot 3x3 + FolderOpen + name)', 'Descrição (slate-600)', 'Merchants (text-right font-medium)', 'TPV 30d (formatCurrency)', 'Responsável (slate-600)', 'Actions (DropdownMenu w-12)'],
        dropdownActions: {
          threeItems: [
            'Editar (Edit) → openEditModal(group) FUNCIONAL — preenche formData com group',
            'Ver Merchants (Users) — gap: SEM onClick',
            'Excluir (Trash2) red — onClick=handleDeleteGroup(id) FUNCIONAL — sem confirmação',
          ],
          gap: 'Excluir SEM AlertDialog confirm — clica e some imediatamente',
        },
      },

      createEditModal: {
        wrapper: 'Dialog max-w-lg — open via showCreateModal || editingGroup !== null',
        title: 'CONDITIONAL — "📁 Novo Grupo" / "✏️ Editar Grupo"',

        baseFields: [
          'Nome do Grupo * — Input controlled',
          'Descrição — Textarea rows=3',
          'Cor do Grupo — flex 8 buttons w-8h8 rounded-full + ring-2 ring-offset-2 se selected',
          'Responsável pelo Grupo — Select 3 opções (maria/joao/ana)',
        ],

        specialRatesSection: {
          wrapper: 'border-t pt-4',
          checkbox: 'specialRate (CONTROLLED) + Label "Aplicar configurações especiais" font-medium',
          conditionalFields: 'IF specialRate → grid 2-col gap-4 pl-6',
          fourFields: [
            'Taxa Cartão (%) — Input type=number step=0.01 placeholder="4.49"',
            'Taxa PIX (%) — Input type=number step=0.01 placeholder="0.99"',
            'Liquidação (dias) — Input type=number placeholder="30"',
            'Retenção (%) — Input type=number step=0.01 placeholder="5.00"',
          ],
        },

        footer: {
          cancelButton: 'outline + reset form + close',
          saveButton: 'editingGroup ? "💾 Salvar" handleEditGroup : "📁 Criar Grupo" handleCreateGroup',
          gap: 'Sem validação — pode criar grupo com name vazio',
        },
      },

      knownGapsMerchantGroups: [
        'Excluir SEM AlertDialog — UX perigoso',
        '"Ver Merchants" SEM onClick — não navega',
        'specialRate state local mas não persiste com grupo (dropado ao reabrir)',
        'Sem validação de nome vazio',
        'Sem suporte a hierarchy (grupo com subgrupos)',
        'ungroupedCount=745 hardcoded',
        'Cores limitadas a 8 — sem custom hex',
      ],
    },

    // ==========================================================================
    // SUB-DOC #4 — AdminIntMerchantTags
    // ==========================================================================
    merchantTagsMicroscopic: {
      role: 'CRUD simples de tags com flag isSystem que bloqueia edit/delete',

      sevenMockTags: [
        '1: VIP / purple / 45 / Maria Santos / NÃO sistema',
        '2: Alto Risco / red / 23 / Sistema / 🔒 SISTEMA',
        '3: Novo Cliente / green / 156 / Sistema / 🔒 SISTEMA',
        '4: Requer Atenção / yellow / 34 / João Silva / NÃO',
        '5: Promoção Q1 / blue / 89 / Maria Santos / NÃO',
        '6: Piloto / cyan / 12 / Admin / NÃO',
        '7: Inativo > 30 dias / gray / 67 / Sistema / 🔒 SISTEMA',
      ],

      isSystemFeature: {
        flag: 'tag.isSystem boolean — 3 das 7 tags são system (Alto Risco, Novo Cliente, Inativo>30)',
        visualLock: 'Lock icon w-3h3 slate-400 ao lado do name',
        editDisabled: 'DropdownMenuItem "Editar" disabled={tag.isSystem}',
        deleteDisabled: 'DropdownMenuItem "Excluir" disabled={tag.isSystem}',
        helperText: 'p slate-500 abaixo da tabela — Lock icon + "Tags do sistema não podem ser excluídas ou editadas"',
      },

      pageHeader: {
        title: 'Tags de Merchants',
        subtitle: 'Classificações flexíveis para merchants',
        breadcrumbs: '[Admin Interno → Merchants (List) → Tags]',
        rightAction: 'Button "Nova Tag" Plus',
      },

      tagsTable: {
        fiveColumns: [
          'Tag (Tag icon 4x4 + name + Lock icon CONDICIONAL isSystem)',
          'Cor (div w-6h6 rounded {colorClass})',
          'Merchants (text-right font-medium)',
          'Criado por (slate-600)',
          'Actions (DropdownMenu w-12)',
        ],
      },

      createEditModal: {
        wrapper: 'Dialog default size',
        title: 'CONDITIONAL "Editar Tag" / "Nova Tag"',
        twoFields: [
          'Nome da Tag * — Input controlled placeholder "Ex: VIP"',
          'Cor — flex 8 buttons w-8h8 rounded-full + ring-2 ring-offset-2',
        ],
        footer: {
          cancelButton: 'outline + close + reset formData',
          saveButton: 'editingTag ? "💾 Salvar" : "🏷️ Criar Tag"',
        },
      },

      knownGapsMerchantTags: [
        'Tags muito mais simples que Groups — não tem responsável, descrição, taxas',
        'Excluir SEM AlertDialog — pode deletar tag com 156 merchants vinculados sem aviso',
        'Sem validação de nome único (pode criar 2 tags "VIP")',
        'Sem migração ao deletar — merchants ficam órfãos',
        'isSystem é boolean simples — não tem categories/policies',
      ],
    },

    // ==========================================================================
    // SUB-DOC #5 — AdminIntMerchantReports
    // ==========================================================================
    merchantReportsMicroscopic: {
      role: 'Central de relatórios pré-configurados + histórico de relatórios gerados',

      sixAvailableReports: [
        { id: 'base', icon: 'BarChart3', title: 'Base de Merchants', description: 'Visão geral da base de clientes: quantidade, status, segmentos', color: 'blue' },
        { id: 'performance', icon: 'TrendingUp', title: 'Performance por Merchant', description: 'TPV, transações, receita e margem por merchant', color: 'green' },
        { id: 'growth', icon: 'TrendingUp', title: 'Crescimento e Churn', description: 'Novos merchants, cancelamentos, taxa de retenção', color: 'purple' },
        { id: 'risk', icon: 'AlertTriangle', title: 'Merchants em Risco', description: 'CB Ratio, MED Ratio, merchants bloqueados/suspensos', color: 'red' },
        { id: 'financial', icon: 'DollarSign', title: 'Financeiro por Merchant', description: 'Saldos, saques, liquidações por merchant', color: 'emerald' },
        { id: 'custom', icon: 'FileSpreadsheet', title: 'Relatório Customizado', description: 'Crie um relatório com os campos e filtros desejados', color: 'slate' },
      ],

      gapTwoTrendingUpIcons: 'Performance E Growth ambos usam TrendingUp icon — visual confuso',

      fourMockRecentReports: [
        '1: Performance Jan/2026 — 28/01/2026 14:30 — Maria Santos — 2.3 MB',
        '2: Base de Merchants — 27/01/2026 09:15 — João Silva — 890 KB',
        '3: Merchants em Risco — 25/01/2026 16:45 — Ana Costa — 456 KB',
        '4: Crescimento Dez/2025 — 02/01/2026 10:00 — Maria Santos — 1.1 MB',
      ],

      pageHeader: {
        title: 'Relatórios de Merchants',
        subtitle: 'Central de relatórios e análises',
        breadcrumbs: '[Admin Interno → Merchants (List) → Relatórios]',
      },

      availableReportsSection: {
        title: 'h2 "📋 Relatórios Disponíveis"',
        layout: 'grid 1/md:2/lg:3 gap-4',
        cardEach: {
          wrapper: 'Card hover:shadow-md',
          header: 'iconBox 10x10 bg-{color}-100 + report.icon w-5h5 text-{color}-600 — gap: cores tailwind dinâmicas via template literal — funciona apenas se classes safelisted',
          title: 'CardTitle text-base',
          description: 'CardDescription text-sm',
          ctaButton: {
            element: 'Button w-full gap-2 + onClick=handleGenerateReport(id)',
            states: {
              idle: 'BarChart3 + "Gerar Relatório"',
              generating: 'Clock animate-spin + "Gerando..." (disabled)',
            },
          },
        },
      },

      handleGenerateReportFunction: {
        flow: 'setGenerating(reportId) → setTimeout 2000ms → setGenerating(null)',
        comment: '"// Would trigger download here" — gap: NÃO faz download real',
      },

      recentReportsSection: {
        title: 'h2 "🕐 Relatórios Recentes"',
        tableColumns: [
          'Relatório — font-medium',
          'Gerado em — slate-600',
          'Por — User icon + name slate-600',
          'Tamanho — slate-500',
          'Action — Button ghost sm "Baixar" Download',
        ],
        gap: 'Botão "Baixar" SEM onClick',
      },

      knownGapsReports: [
        'Cores dinâmicas bg-{color}-100 podem quebrar se classes não safelisted no Tailwind',
        '2 reports usam mesmo TrendingUp (Performance + Growth) — confuso',
        'Custom report sem builder real — só mostra Card',
        'Generation fake — 2s setTimeout sem download real',
        'Recent Reports botão Baixar SEM onClick',
        'Sem filtros, busca ou paginação no histórico',
        'Sem schedule/cron de relatório recorrente',
      ],
    },

    // ==========================================================================
    // SUB-DOC #6 — AdminIntNewMerchant (Wizard 4-Step)
    // ==========================================================================
    newMerchantMicroscopic: {
      role: 'Wizard 4-step guiado para cadastro de novo merchant — DA mais complexa em UX',

      pageHeader: {
        title: 'Novo Merchant',
        subtitle: 'Cadastrar novo cliente na plataforma',
        breadcrumbs: '[Admin Interno → Merchants (List) → Novo]',
        wrapper: 'space-y-6 pb-20 max-w-4xl mx-auto — max-width único no admin',
      },

      progressStepsBar: {
        layout: 'flex items-center justify-between mb-8',
        fourSteps: [
          { id: 1, title: 'Dados Básicos', icon: 'Building2' },
          { id: 2, title: 'Contato e Endereço', icon: 'User' },
          { id: 3, title: 'Comercial e Métodos', icon: 'Briefcase' },
          { id: 4, title: 'Revisão e Criação', icon: 'CheckCircle' },
        ],
        stepRender: 'Each step → circular w-10h10 + Icon — currentStep>=id ? primary white : slate-100 slate-400 + label "Etapa {id}" + title xs slate-500 — hidden sm:block para text',
        connectorLine: 'flex-1 h-1 mx-4 rounded — currentStep>id ? primary : slate-200',
      },

      formDataState_24Fields: {
        step1: ['personType: pj/pf', 'document', 'legalName', 'tradeName', 'stateRegistration', 'stateRegistrationExempt: bool', 'website'],
        step2: ['contactName', 'contactRole', 'contactEmail', 'contactPhone', 'cep', 'street', 'number', 'complement', 'neighborhood', 'city', 'state'],
        step3: ['segment', 'volumeRange', 'averageTicket', 'salesRep', 'methodCard: bool default true', 'methodPix: default true', 'methodBoleto: default false', 'initialStatus: kyc_pending'],
        step4: ['sendWelcomeEmail: default true', 'createKycTask: default true', 'notifySalesRep: default false'],
        gap: '24 fields TOTAIS no state com funcs updateFormData via spread shallow',
      },

      // STEP 1: Dados Básicos
      step1Card: {
        cardTitle: 'Dados Básicos',
        cardDescription: 'Informações cadastrais da empresa',

        personTypeRadio: {
          label: 'Tipo de Pessoa *',
          twoOptions: ['pj — Pessoa Jurídica (CNPJ)', 'pf — Pessoa Física (CPF)'],
          default: 'pj',
        },

        documentField: {
          label: 'CONDITIONAL "CNPJ" / "CPF" *',
          placeholder: 'CONDITIONAL "00.000.000/0000-00" / "000.000.000-00"',
          searchButton: 'CONDITIONAL personType==="pj" → Button outline com Search/Loader2 (gap: NÃO existe pra CPF)',
          handleCNPJSearch: '(1) IF document.length<14 return / (2) setIsLoadingCNPJ true / (3) await Promise setTimeout 1500 / (4) setCnpjData mock 6 fields / (5) auto-fill legalName + tradeName',
        },

        cnpjDataCard_Conditional: {
          conditional: 'cnpjData state present',
          wrapper: 'Card bg-green-50 border-green-200',
          title: '"📋 Dados da Receita Federal"',
          sixFields: [
            'Razão Social: EMPRESA EXEMPLO LTDA',
            'Nome Fantasia: Loja Exemplo',
            'Situação: Badge bg-green-500 "✅ ATIVA"',
            'Data Abertura: 15/03/2018',
            'Natureza Jurídica: 206-2 - Sociedade Empresária Limitada (col-span-2)',
            'Atividade Principal: 47.11-3-02 - Comércio varejista (col-span-2)',
          ],
        },

        threeMoreFields: [
          'Razão Social * — Input controlled (auto-fill from CNPJ)',
          'Nome Fantasia * — Input controlled (auto-fill)',
          'Inscrição Estadual — Input + Checkbox "Isento de IE" (DISABLES input quando checked)',
          'Website — Input type=url placeholder "https://www.exemplo.com.br"',
        ],
      },

      // STEP 2: Contato e Endereço
      step2Card: {
        cardTitle: 'Contato e Endereço',
        twoSubsections: ['Contato Principal', 'Endereço'],

        contactSection: {
          wrapper: 'border-b pb-4',
          title: 'h3 "Contato Principal"',
          fourFields_grid2: [
            'Nome do Responsável *',
            'Cargo/Função (opcional)',
            'E-mail * — type=email',
            'Telefone * — placeholder "(00) 00000-0000"',
          ],
        },

        addressSection: {
          title: 'h3 "Endereço"',
          firstRow_grid3: [
            'CEP * — Input + onBlur=handleCEPSearch',
          ],
          handleCEPSearchFunction: {
            flow: 'IF cep.length<8 return / (2) "Simulate CEP lookup" — direto auto-fill street="Avenida Paulista" + neighborhood="Bela Vista" + city="São Paulo" + state="SP"',
            gap: 'NÃO usa setIsLoading — apenas atualiza state silenciosamente — feedback ruim',
            gap2: 'NÃO chama API real — mock fixo',
          },

          secondRow_grid4: [
            'Logradouro * — md:col-span-2',
            'Número *',
            'Complemento (opcional)',
          ],

          thirdRow_grid3: [
            'Bairro *',
            'Cidade *',
            'UF * — Select com 27 estados [AC,AL,AP,AM,BA,CE,DF,ES,GO,MA,MT,MS,MG,PA,PB,PR,PE,PI,RJ,RN,RS,RO,RR,SC,SP,SE,TO]',
          ],
        },
      },

      // STEP 3: Comercial e Métodos
      step3Card: {
        cardTitle: 'Comercial e Métodos de Pagamento',
        cardDescription: 'Configurações comerciais e métodos desejados',

        fourFields_grid2: [
          'Segmento de Atuação * — Select 11 SEGMENTS [ecommerce, saas, educacao, marketplace, varejo, servicos, games, viagens, saude, financeiro, outros]',
          'Volume Mensal Estimado * — Select 6 VOLUME_RANGES [<10k, 10k-50k, 50k-100k, 100k-500k, 500k-1M, >1M]',
          'Ticket Médio Estimado * — Input type=number',
          'Comercial Responsável — Select 3 reps (maria/joao/ana)',
        ],

        paymentMethodCards: {
          wrapper: 'space-y-3',
          interactionPattern: 'Card cursor-pointer + onClick toggle — border-{color}-500 bg-{color}-50 IF selected',
          threeCards: [
            {
              method: 'methodCard',
              icon: 'CreditCard 5x5 blue-500',
              title: 'Cartão de Crédito e Débito',
              info: ['Bandeiras: Visa, Mastercard, Elo, Amex, Hiper', 'Taxa padrão: 4.49% + R$ 0,00 (configurável após cadastro)'],
              activeColor: 'blue',
              defaultChecked: true,
            },
            {
              method: 'methodPix',
              icon: 'QrCode 5x5 green-500',
              title: 'PIX',
              info: ['Liquidação: Instantânea (D+0)', 'Taxa padrão: 0.99% (configurável após cadastro)'],
              activeColor: 'green',
              defaultChecked: true,
            },
            {
              method: 'methodBoleto',
              icon: 'FileText 5x5 amber-500',
              title: 'Boleto Bancário',
              info: ['Compensação: D+0 ou D+1', 'Taxa padrão: R$ 2,50 por boleto (configurável após cadastro)'],
              activeColor: 'amber',
              defaultChecked: false,
            },
          ],
          gap: 'Checkbox interno e Card onClick toggle → 2 paths para mesma ação — pode causar bug click duplicado',
        },

        initialStatusRadio: {
          label: 'Status Inicial',
          threeOptions: [
            'lead — "Lead (apenas cadastro, sem operação)"',
            'kyc_pending — "Em Análise (iniciar processo de KYC)" (default)',
            'active — "Ativo (pular KYC - apenas para gerentes)" — text-slate-400 visual disable',
          ],
          gap: 'Status "active" tem text-slate-400 sugerindo disabled mas RadioGroupItem NÃO tem disabled prop — qualquer um pode marcar',
        },
      },

      // STEP 4: Revisão
      step4: {
        layout: 'space-y-4 — sem Card wrapper (apenas 5 cards)',
        fiveReviewCards: [
          {
            title: 'Dados Básicos',
            editButton: 'goes to step 1',
            fields: '[CNPJ, Razão Social, Nome Fantasia, Website (fallback "—")]',
          },
          {
            title: 'Contato',
            editButton: 'goes to step 2',
            fields: '[Responsável + role, E-mail, Telefone]',
          },
          {
            title: 'Endereço',
            editButton: 'goes to step 2',
            render: 'p1: street + number + complement / p2: neighborhood + city + state + CEP',
          },
          {
            title: 'Comercial e Métodos',
            editButton: 'goes to step 3',
            fields: '[Segmento (resolved label), Volume Est. (resolved), Ticket Médio, Comercial (fallback "—"), Métodos badges col-span-2, Status Inicial resolved]',
            methodsBadges: 'Badge "💳 Cartão" / "⚡ PIX" / "📄 Boleto" — só renderiza se selected',
          },
          {
            title: 'Ações Automáticas Após Criação (sem Edit button)',
            threeCheckboxes: [
              'sendWelcomeEmail (default true) — "Enviar e-mail de boas-vindas ao merchant"',
              'createKycTask (default true) — "Criar tarefa de KYC para equipe de compliance"',
              'notifySalesRep (default false) — "Notificar comercial responsável via Slack"',
            ],
          },
        ],
      },

      navigationButtons: {
        wrapper: 'flex justify-between pt-4',
        leftButton: {
          dynamic: 'currentStep>1 → "Voltar" + ChevronLeft / currentStep===1 → "Cancelar" + navigate to MerchantsList',
        },
        rightButton: {
          dynamic: 'currentStep<4 → "Próximo: {STEPS[currentStep]?.title}" + ChevronRight (disabled=!canProceed) / currentStep===4 → "Criar Merchant" + Building2 → handleSubmit',
          gapBugSubtle: 'STEPS[currentStep] retorna o step ATUAL (não o próximo) — label diz "Próximo: Etapa Atual" — bug semântico',
        },
        handleSubmit: 'console.log + navigate to AdminIntMerchantsList — gap: NÃO faz API call real',
      },

      canProceedValidation: {
        step1: 'document && legalName && tradeName',
        step2: 'contactName && contactEmail && contactPhone && cep && street && number',
        step3: 'segment && volumeRange && (methodCard || methodPix || methodBoleto)',
        step4: 'true (sempre permite)',
        gap: 'Step 2 NÃO valida neighborhood/city/state mesmo sendo marked "*" required',
        gap2: 'Step 3 NÃO valida averageTicket apesar do label "*"',
      },

      knownGapsNewMerchant: [
        'CNPJ search é SEMPRE mock fixo "EMPRESA EXEMPLO LTDA"',
        'CEP search SEMPRE retorna Avenida Paulista — útil para teste mas não real',
        'CPF type personType=pf NÃO tem botão Search (apenas CNPJ tem lookup)',
        'Step navigation right button label semantic bug (mostra step atual)',
        'handleSubmit apenas console.log + navigate — não persiste merchant',
        'Validation gaps em Step 2 e Step 3 (campos required* sem validação real)',
        '"active" status disabled visual mas funcionalmente clicável',
        'Sem confirmação antes de Submit (impacto: criação acidental)',
        'Sem suporte a anexar documentos no wizard (KYC fica para depois)',
        'Sem upload de logo no wizard',
        'Sem preview do merchant criado antes de finalizar',
        'salesRep options hardcoded — não vem de uma entidade User filtered',
      ],
    },
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocations: {
      subaccounts: 'pages/AdminIntSubaccounts.jsx (155 linhas)',
      limitRequests: 'pages/AdminIntLimitRequests.jsx (469 linhas)',
      groups: 'pages/AdminIntMerchantGroups.jsx (362 linhas)',
      tags: 'pages/AdminIntMerchantTags.jsx (226 linhas)',
      reports: 'pages/AdminIntMerchantReports.jsx (165 linhas)',
      newMerchant: 'pages/AdminIntNewMerchant.jsx (680 linhas)',
    },

    backendIntegrationMap: {
      subaccounts: 'NENHUMA — mockMarketplaces[3] + mockSubaccounts (de adminInternoMocks)',
      limitRequests: 'COMPLETA — base44.entities.ClientLimitRequest list/filter/update + base44.auth.me() — useQuery + useMutation com queryClient.invalidateQueries',
      groups: 'NENHUMA — mockGroups[6] + setGroups local',
      tags: 'NENHUMA — mockTags[7] + setTags local',
      reports: 'NENHUMA — AVAILABLE_REPORTS[6] hardcoded + recentReports[4] mock',
      newMerchant: 'NENHUMA — handleSubmit faz apenas console.log',
    },

    validationPatterns: {
      limitRequests: 'reviewMutation guards: !decision toast.error / decision==="approved" && !approved_limit toast.error',
      newMerchant: 'canProceed por step com return condicional',
      groups: 'Sem validação',
      tags: 'Sem validação',
    },

    crossPageRelationships: {
      subaccounts_to_merchantProfile: 'Eye click → AdminIntMerchantProfile?id={mp.id} — mas mp.id não existe em mockMerchants',
      limitRequests_to_merchantProfile: 'Botão Eye em approved sem onClick',
      groups_referenced_by: 'MerchantBulkActions email/group selector',
      tags_referenced_by: 'MerchantBulkActions tags selector com 6 tags hardcoded ≠ destas 7 mock',
      newMerchant_destination: 'AdminIntMerchantsList — após criação',
      reports_destination: 'Não navega — apenas simula download',
    },

    knownGapsCrossPage: [
      'Apenas LimitRequests usa SDK base44 real — outras 5 são mocks puros',
      'isSystem flag em Tags vs MerchantBulkActions tags hardcoded — sem fonte única de verdade',
      'Cores dinâmicas bg-{color}-XXX em Reports/Groups/Tags podem quebrar com Tailwind purge',
      'mp.id formato (M-001) ≠ merchant.id formato (12345) — Link entre Subaccounts e MerchantProfile pode falhar',
      'Tags isSystem bloqueio só vale para edit/delete — DELETE physical (nem soft) — perigoso',
      'NewMerchant SEM persistência cria UX falsa — analista cadastra merchant inteiro e some',
      'NewMerchant CPF lookup ausente — apenas CNPJ tem search button (assimétrico)',
      'CEP lookup é silencioso (sem feedback de loading)',
      '24 fields formData via shallow spread — perigoso se algum field for objeto aninhado (não é o caso aqui mas pattern frágil)',
    ],
  },
};

export default AdminIntMerchantsExtrasDoc;