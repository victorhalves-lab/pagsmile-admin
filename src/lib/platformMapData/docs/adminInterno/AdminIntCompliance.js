// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /AdminIntCompliance + sub-rotas Compliance
// Fidelidade absoluta:
//  - pages/AdminIntCompliance.jsx (121 linhas — Hub com 12 abas)
//  - components/admin-interno/compliance/ComplianceDashboard.jsx (413 linhas)
//  - components/admin-interno/compliance/ComplianceQueue.jsx (370 linhas)
//  - pages/AdminIntComplianceQueue/Review/Submissions (wrappers finos)
// ============================================================================

export const AdminIntComplianceDoc = {
  pageId: 'AdminIntCompliance',
  pagePath: '/AdminIntCompliance',
  module: 'Admin Interno',
  parentPage: null,

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Hub central de Compliance/KYC/KYB com 12 abas (Tabs controlado via useState activeTab inicial="dashboard") — cada aba renderiza um componente especializado em components/admin-interno/compliance/. Página principal é Wrapper PageHeader "KYC Compliance / Central de Compliance, KYC/KYB e Análise de Risco com Helena IA" + Tabs flex-wrap responsivo (icon visível sempre, label oculto em mobile via hidden sm:inline).',

    twelveTabsMicroscopic: [
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', renders: 'ComplianceDashboard (413 linhas)' },
      { id: 'queue', label: 'Fila de Compliance', icon: 'Users', renders: 'ComplianceQueue (370 linhas)' },
      { id: 'review', label: 'Análise Manual', icon: 'FileSearch', renders: 'ManualReviewQueue' },
      { id: 'submissions', label: 'Submissões', icon: 'FileText', renders: 'AllSubmissionsList' },
      { id: 'revalidation', label: 'Revalidação', icon: 'RefreshCw', renders: 'RevalidationManager' },
      { id: 'special', label: 'Análises Especiais', icon: 'Zap', renders: 'SpecialAnalysisHub' },
      { id: 'forms', label: 'Gestão de Forms', icon: 'Settings2', renders: 'QuestionnaireManager' },
      { id: 'docs', label: 'Documentos', icon: 'FolderOpen', renders: 'DocumentsRepository' },
      { id: 'rules', label: 'Regras', icon: 'Settings2 (gap: ÍCONE DUPLICADO com forms)', renders: 'RulesAndWorkflows' },
      { id: 'audit', label: 'Auditoria', icon: 'History', renders: 'AuditHistory' },
      { id: 'helena', label: 'Helena IA', icon: 'Brain', renders: 'HelenaTraining' },
      { id: 'link', label: 'Link do Formulário', icon: 'Link2', renders: 'FormLinkGenerator' },
    ],

    // ==========================================================================
    // SUB-DOC #1 — ComplianceDashboard (aba "dashboard")
    // ==========================================================================
    complianceDashboardMicroscopic: {
      role: 'Dashboard com KPIs+Insights Helena+Funnel+Distribuições+Tendências+Causas Reprovação+Distribuição Risco',

      mockKPIData: {
        totalSubmissions: 1247,
        aiApproved: 892,
        aiRejected: 156,
        manualReview: 199,
        avgAiTime: '2.3s',
        avgManualTime: '4.2h',
        avgRiskScore: 72,
        pendingDocs: 34,
      },

      fourGradientKPICards: {
        totalSubmissoesBlue: 'gradient blue-50→white + border-blue-100 + FileText 6x6 blue-600 + value 3xl bold + "+12% vs mês anterior" green TrendingUp',
        aprovadasHelenaGreen: 'gradient green-50→white + CheckCircle2 + "{aiApproved/total*100}.toFixed(1)% automático" — calc dinâmico',
        emAnaliseManualAmber: 'gradient amber-50→white + Users + "{manualReview/total*100}% do total"',
        reprovadasHelenaRed: 'gradient red-50→white + XCircle + "{aiRejected/total*100}% rejeitado"',
        cardClassPattern: 'bg-gradient-to-br from-{cor}-50 to-white dark:from-{cor}-900/20 dark:to-slate-900 border-{cor}-100 dark:border-{cor}-800',
      },

      fourMetricImpactCards: {
        component: 'MetricImpactCard (de @/components/common) com props metricName/before/after/unit/description/target',
        tempoConclusao: 'before=7 after=0.5 unit=" dias" target=0.25 — "Redução de 93% no tempo de onboarding"',
        taxaConversao: 'before=35 after=85 unit="%" target=90 — "Aumento de 142% na conclusão"',
        npsProcesso: 'before=20 after=82 unit=" pts" target=80 — "Satisfação excepcional"',
        custoOnboarding: 'before=150 after=5 unit=" R$" target=3 — "Redução de 96.7% em custos"',
      },

      fourSecondRowKPIs: {
        layoutPattern: 'icon 10x10 rounded-lg colored bg + texto "Title sm slate-500" + "Value xl bold"',
        tempoMedioIA: '2.3s — Zap purple-100/600',
        tempoMedioManual: '4.2h — Timer indigo-100/600',
        scoreMedioCarteira: '72 — Target cyan-100/600',
        docsPendentes: '34 — FileText orange-100/600',
      },

      helenaInsightsCard: {
        wrapper: 'border-purple-200 + gradient from-purple-50/50 to-white',
        title: 'iconBox 8x8 gradient-br purple-500→indigo-600 + Sparkles white + "Helena Insights & Alertas"',
        description: '"Alertas e recomendações em tempo real da IA"',
        gridLayout: 'grid-cols-1 md:2 gap-3',
        fourAlerts: [
          { type: 'warning (Clock amber)', message: '"12 submissões aguardando análise manual há mais de 24h"', action: 'Ver fila' },
          { type: 'info (Brain blue)', message: '"Taxa de aprovação automática aumentou 8% esta semana"', action: 'Ver métricas' },
          { type: 'critical (AlertTriangle red)', message: '"3 merchants com score crítico detectados hoje"', action: 'Analisar' },
          { type: 'success (TrendingUp green)', message: '"Tempo médio de análise manual reduziu 15%"', action: 'Detalhes' },
        ],
        renderEachAlert: 'p-3 rounded-lg border + bg condicional 4 variants — Button ghost xs com action + ArrowRight 3x3',
        gap: 'TODOS os 4 botões SEM onClick — apenas visuais',
      },

      funnelChart: {
        component: 'BarChart layout=vertical h-[280px]',
        funnelData: [
          'Submissões: 1247 (#3b82f6)',
          'Análise IA: 1213 (#8b5cf6)',
          'Aprovadas IA: 892 (#2bc196)',
          'Manual Review: 199 (#f59e0b)',
          'Aprovadas Final: 1048 (#10b981)',
        ],
        gap: 'Funnel inconsistente — "Aprovadas Final" 1048 > "Aprovadas IA" 892 + "Manual Review" 199 = 1091 — mock data com somatórios incorretos',
        barRender: 'Cell por entry com fill=entry.fill + radius=[0,4,4,0] (right-rounded apenas)',
      },

      statusDistributionPieChart: {
        component: 'RechartsPie alias (PieChart renomeado para evitar conflito com lucide PieChart)',
        innerRadius: 60, outerRadius: 100, paddingAngle: 5,
        threeStatuses: [
          'Aprovado IA: 892 (#2bc196)',
          'Reprovado IA: 156 (#ef4444)',
          'Review Manual: 199 (#f59e0b)',
        ],
        label: '({name} {(percent*100).toFixed(0)}%)',
      },

      trendChart: {
        component: 'LineChart h-[280px]',
        sixMonths: [
          'Jul: ia=120, manual=45',
          'Ago: 145, 38',
          'Set: 168, 42',
          'Out: 189, 35',
          'Nov: 210, 28',
          'Dez: 234, 22',
        ],
        twoLines: '"ia" stroke=#2bc196 strokeWidth=2 + "manual" stroke=#f59e0b strokeWidth=2',
      },

      rejectionReasonsBarChart: {
        layout: 'vertical h-[280px]',
        topFive: [
          'Documento Inválido: 45',
          'Dados Inconsistentes: 38',
          'Alto Risco Fraude: 32',
          'PEP Não Declarado: 24',
          'Atividade Suspeita: 17',
        ],
        bar: 'fill=#ef4444 radius=[0,4,4,0]',
      },

      riskDistributionCustomBars: {
        notRecharts: 'Componente CUSTOM — não usa recharts',
        layout: 'grid-cols-4 gap-4 — 4 colunas iguais center-aligned',
        fourRanges: [
          'Baixo (80-100): 456 clientes (#2bc196)',
          'Médio (60-79): 389 (#f59e0b)',
          'Alto (40-59): 267 (#f97316)',
          'Crítico (0-39): 135 (#ef4444)',
        ],
        renderEach: 'div h-32 com bg color20% (alpha) + barra interna w-16 rounded-t com height={(count/500)*100}% + bg color sólido',
        gap: 'Hardcoded denominator 500 — se algum count exceder 500 quebra a barra (mas atualmente max é 456 OK)',
      },
    },

    // ==========================================================================
    // SUB-DOC #2 — ComplianceQueue (aba "queue")
    // ==========================================================================
    complianceQueueMicroscopic: {
      role: 'Fila de submissões compliance — busca + filtros + bulk actions + tabela com checkboxes/score Helena/dropdown ações',

      hookUseQuery: {
        importedButUnused: true,
        gap: 'useQuery e base44 importados mas NÃO chamados — comentário "Usando mock data - em produção usaria a query real" + queueData=mockQueueData fixo',
      },

      mockQueueData: {
        fiveItems: [
          { id: 'sub_001', business: 'Tech Solutions Ltda', cnpj: '12.345.678/0001-90', type: 'kyb_enterprise', status: 'pending', helena_score: null, time_in_queue: '2h', source: 'commercial', analyst: null },
          { id: 'sub_002', business: 'E-commerce ABC', cnpj: '98.765.432/0001-99', type: 'kyc_full', status: 'ai_analyzing', helena_score: null, time_in_queue: '3h', source: 'self_service', analyst: null },
          { id: 'sub_003', business: 'Loja Rápida ME', cnpj: '11.222.333/0001-50', type: 'kyc_pix', status: 'manual_review', helena_score: 58, time_in_queue: '24h', source: 'self_service', analyst: 'maria@pagsmile.com' },
          { id: 'sub_004', business: 'Café Gourmet SA', cnpj: '44.555.666/0001-22', type: 'kyc_full', status: 'documents_requested', helena_score: 72, time_in_queue: '48h (>24h ALERTA)', source: 'commercial', analyst: 'joao@pagsmile.com' },
          { id: 'sub_005', business: 'Digital Services', cnpj: '77.888.999/0001-33', type: 'kyb_enterprise', status: 'pending', helena_score: null, time_in_queue: '4h', source: 'form_link', analyst: null },
        ],
      },

      eightStatusConfigs: {
        pending: 'slate-100/700 + Clock — "Pendente"',
        ai_analyzing: 'blue-100/700 + Brain — "Analisando (Helena)"',
        ai_approved: 'green-100/700 + CheckCircle2 — "Aprovado (Helena)"',
        ai_rejected: 'red-100/700 + XCircle — "Reprovado (Helena)"',
        manual_review: 'amber-100/700 + User — "Análise Manual"',
        documents_requested: 'purple-100/700 + AlertTriangle — "Docs Solicitados"',
        approved: 'emerald-100/700 + CheckCircle2 — "Aprovado"',
        rejected: 'red-100/700 + XCircle — "Reprovado"',
        gap: '"approved"/"rejected" finais NÃO têm filter selecionável (só pending/ai_analyzing/manual_review/documents_requested no Select)',
      },

      fourTypeLabels: {
        kyc_full: 'KYC Completo',
        kyc_pix: 'KYC Pix',
        kyc_card: 'KYC Cartão (não usado nos mocks)',
        kyb_enterprise: 'KYB Empresa',
      },

      threeSourceLabels: {
        commercial: 'Comercial',
        self_service: 'Self-Service',
        form_link: 'Link Externo',
      },

      threeFilterStates: {
        searchTerm: 'Input com Search icon left — placeholder "Buscar por empresa ou CNPJ..." — match: business_name?.toLowerCase().includes OR document?.includes (sem lowercase no document — pode falhar com "1" mas não com "0001")',
        statusFilter: 'Select w-48 — "Todos os Status" + 4 individuais',
        selectedItems: 'Array de IDs — bulk selection',
      },

      fiveSummaryCards: {
        layoutGrid: 'grid-cols-2 md:5',
        pendentes: 'Card slate-50 + count filtered status=pending (atual: 2)',
        analisando: 'Card blue-50 + count ai_analyzing blue-600 (1)',
        manualReview: 'Card amber-50 + count manual_review amber-600 (1)',
        docsPendentes: 'Card purple-50 + count documents_requested purple-600 (1)',
        gt24hNaFila: 'Card red-50 + count time_in_queue>24 red-600 (1: sub_004 com 48h)',
      },

      bulkActionsConditional: {
        showWhen: 'selectedItems.length > 0',
        twoButtons: [
          'Button outline "Enviar Lembretes ({count})" — Mail icon — gap: SEM onClick',
          'Button outline "Atribuir Analista" — User icon — gap: SEM onClick',
        ],
        alwaysShown: 'Button outline "Exportar" — Download icon — gap: SEM onClick',
      },

      tableNineColumns: {
        col1Checkbox: 'w-12 — header com toggleSelectAll funcional + indeterminate via length===filteredData.length',
        col2Empresa: 'iconBox 8x8 + Building2 + business_name bold + document xs',
        col3Tipo: 'Badge outline xs com typeLabels[type]',
        col4Status: 'getStatusBadge(status) — Badge color + Icon 3x3 + label',
        col5ScoreHelena: 'getScoreColor logic — null=slate-400/null exibe "-" / >=80 emerald-600 bold / >=60 amber-600 medium / <60 red-600 bold',
        col6TempoNaFila: 'Clock + count + "h" — se >24 cor red-500/600 bold',
        col7Origem: 'Badge secondary xs com sourceLabels[source]',
        col8Analista: 'analyst.split("@")[0] (apenas username) ou italic "Não atribuído"',
        col9Acoes: 'Eye icon (sempre) + Play purple-600 (apenas se status=pending) + DropdownMenu MoreHorizontal',
      },

      rowConditionalStyling: 'TableRow com bg-red-50/50 se time_in_queue>24h',

      dropdownMenuActions: [
        '"Ver Detalhes" — gap: SEM onClick',
        '"Atribuir Analista" — gap: SEM onClick',
        '"Solicitar Documentos" — gap: SEM onClick',
        '"Enviar Lembrete" — gap: SEM onClick',
      ],

      twoFunctionalToggles: {
        toggleSelectAll: 'Funcional: vazio → selecionar todos filtered / cheio → limpar — usa length comparison',
        toggleSelectItem: 'Funcional: includes → remove / !includes → push',
      },
    },

    // ==========================================================================
    // SUB-DOC #3 — Wrapper Pages (Queue/Review/Submissions standalone)
    // ==========================================================================
    standaloneWrapperPages: {
      pattern: 'Páginas /AdminIntComplianceQueue, /AdminIntComplianceReview, /AdminIntComplianceSubmissions são WRAPPERS DE 20 LINHAS cada que renderizam o mesmo componente da aba correspondente',
      
      adminIntComplianceQueuePage: {
        path: '/AdminIntComplianceQueue',
        renders: '<ComplianceQueue />',
        pageHeader: 'title="Fila de Compliance" + subtitle="Gerencie a fila de análise de compliance KYC/KYB" + breadcrumbs Admin Interno > KYC Compliance > Fila',
        gap: 'Breadcrumbs usam href= (não page=) — INCONSISTENTE com PageHeader que usa page=',
      },

      adminIntComplianceReviewPage: {
        path: '/AdminIntComplianceReview',
        renders: '<ManualReviewQueue />',
        pageHeader: 'title="Análise Manual" + subtitle="Revisão manual de submissões encaminhadas pela Helena" + breadcrumbs Admin Interno > KYC Compliance > Análise Manual',
      },

      adminIntComplianceSubmissionsPage: {
        path: '/AdminIntComplianceSubmissions',
        renders: '<AllSubmissionsList />',
        pageHeader: 'title="Submissões" + subtitle="Histórico completo de todas as submissões de compliance" + breadcrumbs Admin Interno > KYC Compliance > Submissões',
      },

      crossPageGap: 'Existem 2 caminhos para chegar à mesma fila: /AdminIntCompliance?aba=queue OU /AdminIntComplianceQueue — duplicação de UX/SEO',
    },
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocations: {
      hubPage: 'pages/AdminIntCompliance.jsx (121 linhas)',
      complianceDashboard: 'components/admin-interno/compliance/ComplianceDashboard.jsx (413 linhas)',
      complianceQueue: 'components/admin-interno/compliance/ComplianceQueue.jsx (370 linhas)',
      manualReviewQueue: 'components/admin-interno/compliance/ManualReviewQueue.jsx (não documentado neste doc)',
      allSubmissionsList: 'components/admin-interno/compliance/AllSubmissionsList.jsx (não documentado neste doc)',
      revalidationManager: 'components/admin-interno/compliance/RevalidationManager.jsx',
      specialAnalysisHub: 'components/admin-interno/compliance/SpecialAnalysisHub.jsx',
      questionnaireManager: 'components/admin-interno/compliance/QuestionnaireManager.jsx',
      documentsRepository: 'components/admin-interno/compliance/DocumentsRepository.jsx',
      rulesAndWorkflows: 'components/admin-interno/compliance/RulesAndWorkflows.jsx',
      auditHistory: 'components/admin-interno/compliance/AuditHistory.jsx',
      helenaTraining: 'components/admin-interno/compliance/HelenaTraining.jsx',
      formLinkGenerator: 'components/admin-interno/compliance/FormLinkGenerator.jsx',
      wrappers: '3 páginas wrapper standalone (Queue/Review/Submissions) ~20 linhas cada',
    },

    backendIntegration: {
      hubPage: 'NENHUMA — apenas state management de tab',
      complianceDashboard: 'NENHUMA — TODOS os mocks hardcoded no início do arquivo',
      complianceQueue: 'PARCIAL — useQuery e base44 importados mas NÃO chamados; queueData = mockQueueData; isLoading = false',
      gap: 'Comentário literal no código: "Usando mock data - em produção usaria a query real"',
    },

    componentStateHub: {
      activeTab: { initial: "'dashboard'", purpose: '1 de 12 abas' },
    },

    componentStateQueue: {
      searchTerm: 'string — busca por business_name + document',
      statusFilter: "'all' default — match exato com status",
      selectedItems: 'Array de IDs — bulk select',
    },

    helperFunctionsQueue: {
      filteredData: 'queueData.filter(item) — match search OR cnpj && match status',
      toggleSelectAll: 'flip vazio<->todos filtered',
      toggleSelectItem: 'flip individual com includes',
      getStatusBadge: 'lookup statusConfig + Badge color + Icon + label',
      getScoreColor: 'null=slate-400 / >=80=emerald-600 bold / >=60=amber-600 medium / <60=red-600 bold',
    },

    knownGapsHubLevel: [
      'Tabs.id "forms" e "rules" usam o MESMO ICON Settings2 — confusão visual',
      '12 abas com flex-wrap em mobile pode quebrar para 3 linhas',
      'Tabs SEM persist no URL (?tab=) — refresh perde a aba',
      'Hidden sm:inline esconde labels em mobile — só mostra ícones (sem tooltip)',
    ],

    knownGapsDashboardLevel: [
      'TODOS os dados são hardcoded mocks',
      'Funnel data inconsistente (Aprovadas Final 1048 ≠ Aprovadas IA 892 + outros)',
      'TODOS os 4 botões "action" dos Helena Insights SEM onClick',
      'riskDistribution height calc usa /500 hardcoded — quebra se count>500',
      'Pie label sobrepõe valores quando 3+ slices pequenas',
      'avgRiskScore=72 mas riskDistribution maior é Baixo(80-100)=456 — distribuição inconsistente com média',
    ],

    knownGapsQueueLevel: [
      'useQuery e base44 importados mas NÃO usados',
      'Status filter Select tem só 4 opções (pending/ai_analyzing/manual_review/documents_requested) — falta ai_approved/ai_rejected/approved/rejected',
      'TODOS os botões de ação SEM onClick: Enviar Lembretes / Atribuir Analista / Exportar / Eye / Play / DropdownMenu items',
      'Bulk actions limitados a 2 (Lembretes/Atribuir) — sem aprovar/rejeitar em massa',
      'document?.includes case-sensitive — pesquisa "abc" não acharia maiúsculas',
      'time_in_queue tipo number representando "horas" — mas mock {sub_004:48} = 48h ou 2 dias?',
      'analyst.split("@")[0] quebra se email vazio mas analyst=truthy não-email',
      'Checkbox indeterminate state não suportado — só checked/unchecked binary',
      'date-fns/locale ptBR importado mas NÃO usado — created_date renderiza como string ISO',
    ],

    relationshipsToOtherPages: {
      adminIntComplianceQueuePage: '/AdminIntComplianceQueue — wrapper standalone do mesmo componente',
      adminIntComplianceReviewPage: '/AdminIntComplianceReview — wrapper de ManualReviewQueue',
      adminIntComplianceSubmissionsPage: '/AdminIntComplianceSubmissions — wrapper de AllSubmissionsList',
      adminIntComplianceForms: '/AdminIntComplianceForms — caminho alternativo para QuestionnaireManager (aba forms)',
      adminIntComplianceDocs: '/AdminIntComplianceDocs — caminho alternativo para DocumentsRepository',
      adminIntComplianceRules: '/AdminIntComplianceRules — caminho alternativo para RulesAndWorkflows',
      adminIntComplianceAudit: '/AdminIntComplianceAudit — caminho alternativo para AuditHistory',
      adminIntComplianceHelena: '/AdminIntComplianceHelena — caminho alternativo para HelenaTraining',
      adminIntComplianceFormLink: '/AdminIntComplianceFormLink — caminho alternativo para FormLinkGenerator',
      adminIntKYCQueue: '/AdminIntKYCQueue — fila legacy possivelmente sobreposta',
      adminIntKycAnalysis: '/AdminIntKycAnalysis — análise de KYC individual',
      adminIntCompliancePLD: '/AdminIntPLD — relacionada à camada PLD/AML',
    },
  },
};

export default AdminIntComplianceDoc;