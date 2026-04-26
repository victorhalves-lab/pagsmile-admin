// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /Chargebacks
// ============================================================================
// Arquivo dedicado, fidelidade absoluta ao código real de pages/Chargebacks.jsx.
// Cada KPI, cada filtro, cada thresholds de cor de prob ganho, cada coluna,
// cada seção do dialog de detalhes, cada recomendação de IA — documentado.
// ============================================================================

export const ChargebacksDoc = {
  pageId: 'Chargebacks',
  pagePath: '/Chargebacks',
  module: 'Disputas',
  parentPage: 'DisputeDashboard',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Centro de gestão de CHARGEBACKS FORMAIS — disputas já abertas pelo banco emissor onde o merchant tem janela de 7-14 dias para submeter evidências e contestar, com apoio de IA que estima probabilidade de ganho e recomenda contestar/aceitar.',

    whatIsAChargeback: {
      definition:
        'É uma reversão FORMAL de uma transação iniciada pelo titular do cartão diretamente com o banco emissor, alegando que a cobrança é incorreta, fraudulenta ou que o produto/serviço não foi entregue conforme prometido.',
      timelinePhases: {
        opened: 'Banco abre o CB → status "received". Merchant tem 7-14 dias para responder.',
        contestation: 'Merchant submete evidências → status "in_contestation". Bandeira analisa.',
        decision: 'Bandeira decide → "won" (merchant ganha) ou "lost" (merchant perde). Aceito = merchant não contestou.',
      },
      cost: {
        ifLost: 'Valor da transação ESTORNADO + fee fixo $15-50 + impacto no ratio (que pode levar a programas regulatórios)',
        ifWon: 'Valor preservado + sem fee + sem impacto no ratio',
        ifAccepted: 'Mesmo que perder, mas sem o desgaste do processo — escolha pragmática para casos com baixa probabilidade',
      },
    },

    reasonCodeCategories: {
      fraud: {
        meaning: 'Cliente alega que NÃO fez a transação (cartão clonado/roubado, CNP fraude)',
        difficultyToContest: 'ALTA — burden of proof é do merchant, precisa de 3DS, AVS, IP, dispositivo, log de entrega',
      },
      consumer: {
        meaning: 'Cliente recebeu mas reclama (item diferente, não recebeu, qualidade)',
        difficultyToContest: 'MÉDIA — precisa de prova de entrega + comunicação prévia',
      },
      authorization: {
        meaning: 'Problema técnico de autorização (transação duplicada, expirada)',
        difficultyToContest: 'BAIXA — geralmente erro do adquirente, evidência fácil',
      },
      processing: {
        meaning: 'Erro de processamento (valor errado, moeda errada)',
        difficultyToContest: 'BAIXA — erro técnico documentado',
      },
    },

    coreCapabilities: [
      '5 KPIs: Abertos | Em Contestação | Ganhos | Perdidos | Win Rate (com Progress bar)',
      'Filtros: busca livre por dispute_id/transaction_id/ARN/cliente + status + bandeira + categoria',
      'Tabela rica com 10 colunas incluindo Reason Code, Bandeira (cor por brand), Probabilidade de Ganho com barra visual',
      'Click na linha abre dialog completo com 6 seções de detalhes',
      'Recomendação da IA destacada em gradient roxo (contestar/aceitar) com justificativa',
      'CTA principal "Contestar Chargeback" leva para /DisputeContestation',
    ],

    aiRecommendationLogic: {
      contest: 'IA analisa win_probability, valor, reason_code histórico do merchant — recomenda contestar quando ROI esperado > 0',
      accept: 'Probabilidade < threshold + valor baixo → aceitar economiza tempo administrativo',
    },
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/Chargebacks.jsx',
    totalLines: 594,

    imports: {
      reactQuery: ['useQuery'],
      base44: 'base44.entities.Dispute.filter({ type: "chargeback" }, "-created_date")',
      lucideIcons: [
        'Search — input de busca',
        'Eye — botão ver detalhes',
        'FileText — KPI Em Contestação + botão contestar (roxo)',
        'CheckCircle2 — KPI Ganhos + ícone status "won"',
        'XCircle — KPI Perdidos + ícone status "lost"',
        'Clock — ícones de prazo e status pending',
        'CreditCard — ícone bandeira na tabela',
        'TrendingUp — KPI Win Rate + ícone probabilidade',
        'Bot — não usado ativamente',
        'AlertTriangle — KPI Abertos (amber) + categoria fraud',
        'Shield — ícone do header do dialog',
        'Calendar — ícone ARN no detalhes',
        'User — ícone cliente no detalhes',
        'Hash — ícone transação no detalhes',
        'DollarSign — ícone valor no detalhes',
        'ArrowRight — não usado ativamente',
        'Sparkles — ícone Recomendação IA (roxo)',
        'ChevronRight — botão Contestar (final)',
      ],
      uiComponents: ['Card+CardContent', 'Button', 'Badge', 'Input', 'Select stack', 'Dialog stack', 'Progress', 'Table stack', 'Skeleton'],
      utilities: ['cn', 'format/differenceInDays date-fns'],
      navigation: ['Link', 'createPageUrl from @/components/utils'],
      sharedComponents: ['PageHeader'],
    },

    // ------------------------------------------------------------------------
    // CONFIGURAÇÕES DE STATUS, CATEGORIA, BANDEIRA
    // ------------------------------------------------------------------------
    configurationConstants: {
      statusConfig: {
        received: { label: 'Recebido', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: 'Clock', meaning: 'Acabou de chegar, merchant precisa decidir contestar ou aceitar' },
        in_analysis: { label: 'Em Análise', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: 'Search', meaning: 'Time interno do merchant analisando antes de decidir' },
        in_contestation: { label: 'Em Contestação', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: 'FileText', meaning: 'Evidências submetidas, aguarda decisão da bandeira' },
        won: { label: 'Ganho', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: 'CheckCircle2', meaning: 'Vitória — receita preservada' },
        lost: { label: 'Perdido', color: 'bg-red-100 text-red-700 border-red-200', icon: 'XCircle', meaning: 'Derrota — valor estornado + fee' },
        accepted: { label: 'Aceito', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: 'CheckCircle2', meaning: 'Merchant escolheu não contestar' },
        expired: { label: 'Expirado', color: 'bg-slate-100 text-slate-500 border-slate-200', icon: 'Clock', meaning: 'Prazo expirou sem ação — vira derrota automática' },
      },
      reasonCategoryConfig: {
        fraud: { label: 'Fraude', color: 'bg-red-100 text-red-700', icon: 'AlertTriangle' },
        consumer: { label: 'Consumidor', color: 'bg-blue-100 text-blue-700', icon: 'User' },
        authorization: { label: 'Autorização', color: 'bg-amber-100 text-amber-700', icon: 'Shield' },
        processing: { label: 'Processamento', color: 'bg-purple-100 text-purple-700', icon: 'Clock' },
      },
      cardBrandConfig: {
        visa: { label: 'Visa', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
        mastercard: { label: 'Mastercard', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
        elo: { label: 'Elo', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
        amex: { label: 'Amex', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
        hipercard: { label: 'Hipercard', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
      },
    },

    // ------------------------------------------------------------------------
    // SUBCOMPONENTES INTERNOS
    // ------------------------------------------------------------------------
    internalSubcomponents: {
      WinProbabilityBadge: {
        signature: '({ probability }) => component',
        nullCase: 'Renderiza "-" cinza quando probability undefined/null',
        thresholds: [
          { range: '>= 60', barColor: 'bg-emerald-500', textColor: 'text-emerald-600', meaning: 'Alta confiança — vale contestar' },
          { range: '30-59', barColor: 'bg-amber-500', textColor: 'text-amber-600', meaning: 'Incerto — depende do valor' },
          { range: '< 30', barColor: 'bg-red-500', textColor: 'text-red-600', meaning: 'Baixa — provavelmente aceitar' },
        ],
        layout: 'flex gap-2: barra w-16 h-2 com fill colorida + label percentual',
        widthCalc: 'inline style width: `${probability}%`',
      },

      DeadlineBadge: {
        signature: '({ deadline }) => Badge | "-"',
        differenceFromPreCB: 'Usa differenceInDays (não Hours) — porque CB tem janela em DIAS, não horas',
        states: [
          { condition: '!deadline', render: '"-" cinza' },
          { condition: 'daysLeft < 0', render: 'Badge slate + "Expirado"' },
          { condition: 'daysLeft <= 3', render: 'Badge red ANIMATE-PULSE + "{N}d restantes"' },
          { condition: 'daysLeft <= 7', render: 'Badge amber + "{N}d restantes"' },
          { condition: 'else', render: 'Badge emerald + "{N}d restantes"' },
        ],
      },

      KPICard: { same: 'Mesmo padrão de PreChargebacks, com paletas: default, purple, green, red, amber' },
      EmptyState: { message: '"Nenhum chargeback encontrado" — neutro (cinza Shield, não verde celebrativo)' },
      TableSkeleton: '5 linhas com 6 skeletons cada',
    },

    // ------------------------------------------------------------------------
    // ESTADO LOCAL
    // ------------------------------------------------------------------------
    componentState: {
      searchTerm: { initial: "''" },
      filters: { initial: "{ status: 'all', brand: 'all', category: 'all' }" },
      selectedDispute: { initial: 'null', purpose: 'Controla dialog de detalhes (open quando !== null)' },
    },

    // ------------------------------------------------------------------------
    // QUERIES E FILTRAGEM
    // ------------------------------------------------------------------------
    queryAndFiltering: {
      query: { queryKey: "['chargebacks']", queryFn: 'base44.entities.Dispute.filter({ type: "chargeback" }, "-created_date")' },
      filteredDisputes: {
        chain: '4 condições AND',
        guards: '!d → false (defensivo)',
        statusMatch: 'filter exato status',
        brandMatch: 'filter exato card_brand',
        categoryMatch: 'filter exato reason_category',
        searchMatch: 'OR em [dispute_id, transaction_id, arn, customer_name, customer_email] (toLowerCase)',
      },
    },

    // ------------------------------------------------------------------------
    // CÁLCULO DE KPIs
    // ------------------------------------------------------------------------
    kpiCalculations: {
      openDisputes: { filter: "['received', 'in_analysis'].includes(status)", meaning: 'Aguardando decisão do merchant' },
      inContestation: { filter: "status === 'in_contestation'", meaning: 'Já submetidas, aguarda bandeira' },
      won: { filter: "status === 'won'" },
      lost: { filter: "status === 'lost' || status === 'accepted'", meaning: 'Inclui aceitos como "loss" semântica' },
      winRate: {
        formula: '(won + lost) > 0 ? (won / (won + lost)) * 100 : 0',
        rounding: '.toFixed(1)',
        denominatorLogic: 'Apenas casos JÁ DECIDIDOS — exclui em-andamento',
      },
    },

    // ------------------------------------------------------------------------
    // LAYOUT
    // ------------------------------------------------------------------------
    layout: {
      pageHeader: {
        title: '"Chargebacks"',
        subtitle: '"Gerencie e conteste chargebacks recebidos"',
        breadcrumbs: [{ label: 'Disputas', page: 'DisputeDashboard' }, { label: 'Chargebacks' }],
        noActions: 'Header SEM botões de ação — todas as ações estão nas linhas/dialog',
      },

      kpiCards: {
        layout: 'grid 1/2/5 cols (sm/lg)',
        cards: [
          { title: 'Abertos', value: 'openDisputes.length', subValue: 'soma R$ openDisputes', color: 'amber' },
          { title: 'Em Contestação', value: 'inContestation.length', subValue: 'soma R$', color: 'purple' },
          { title: 'Ganhos', value: 'won.length', subValue: 'soma R$', color: 'green' },
          { title: 'Perdidos', value: 'lost.length', subValue: 'soma R$', color: 'red' },
          {
            name: 'Win Rate Card (custom — não usa KPICard)',
            layout: 'Card slate-50 → space-y-3',
            elements: ['header com label uppercase + TrendingUp 16px', 'valor text-2xl bold', '<Progress value={parseFloat(winRate)} h-2 />'],
          },
        ],
      },

      filters: {
        wrapper: 'Card → CardContent p-4 → flex flex-wrap gap-4',
        searchInput: { width: 'flex-1 min-w-[200px] max-w-md', icon: 'Search 16px slate-400 absolute left-3', placeholder: 'Buscar por ID, ARN, cliente...', bg: 'slate-50 border-slate-200 focus:bg-white' },
        statusSelect: { width: 'w-44', options: ['Todos Status', 'Recebido', 'Em Análise', 'Em Contestação', 'Ganho', 'Perdido', 'Aceito'] },
        brandSelect: { width: 'w-44', options: ['Todas Bandeiras', 'Visa', 'Mastercard', 'Elo', 'Amex'], gap: 'Hipercard ausente' },
        categorySelect: { width: 'w-44', options: ['Todas Categorias', 'Fraude', 'Consumidor', 'Autorização', 'Processamento'] },
      },

      tableColumns: [
        { name: 'ID Chargeback', render: 'dispute_id em font-mono text-sm font-medium' },
        { name: 'Transação', render: 'Link mono azul para /TransactionDetail?id={transaction_id} — stopPropagation no onClick para não disparar row click' },
        { name: 'Valor', render: 'formatCurrency(amount) font-semibold' },
        {
          name: 'Reason Code',
          render: '2 linhas: Badge OUTLINE com cor da CATEGORIA (não do status!) + reason_description truncate 120px',
          colorMapping: 'reasonCategoryConfig[reason_category].color',
        },
        {
          name: 'Bandeira',
          render: 'Badge OUTLINE com bg+color da brand + CreditCard icon + label',
          colorPerBrand: 'cardBrandConfig[card_brand]',
        },
        { name: 'Data', render: "format(opened_date, 'dd/MM/yy') ou '-'" },
        { name: 'Prazo', render: '<DeadlineBadge deadline={deadline_date} />' },
        { name: 'Status', render: 'Badge OUTLINE com statusConfig color + ícone + label' },
        { name: 'Prob. Ganho', render: '<WinProbabilityBadge probability={win_probability} />' },
        {
          name: 'Ações',
          alignment: 'text-right',
          buttons: [
            { icon: 'Eye slate-500', onClick: 'handleViewDetails (com stopPropagation)' },
            {
              icon: 'FileText purple-600',
              renderIf: '["received", "in_analysis"].includes(status)',
              link: '/DisputeContestation?id={id}',
              stopPropagation: 'sim — evita disparar row click',
            },
          ],
        },
      ],

      tableInteractions: {
        rowClick: 'cursor-pointer + onClick={() => handleViewDetails(row)} — clicar em qualquer parte da linha abre dialog',
        nestedClickHandling: 'Link da Transação e botão Eye usam e.stopPropagation() para não conflitar com row click',
      },
    },

    // ------------------------------------------------------------------------
    // DIALOG DE DETALHES (6 seções)
    // ------------------------------------------------------------------------
    dialogDetails: {
      maxWidth: 'max-w-2xl',
      header: {
        layout: 'flex gap-3 com ícone 40x40 purple-100 + Shield purple-600 + texto duplo',
        title: '"Detalhes do Chargeback"',
        subtitle: 'dispute_id (mono)',
      },
      sections: [
        {
          name: 'Section 1 — Main Info (grid 2 cols)',
          left: 'Card slate-50: Hash + UPPERCASE label "Transação" + transaction_id mono',
          right: 'Card slate-50: DollarSign + UPPERCASE "Valor" + formatCurrency text-xl bold',
        },
        {
          name: 'Section 2 — ARN & Deadline (grid 2 cols)',
          left: 'Card slate-50: Calendar + "ARN" + arn mono (Acquirer Reference Number — ID universal da transação)',
          right: 'Card slate-50: Clock + "Prazo" + <DeadlineBadge />',
        },
        {
          name: 'Section 3 — Reason Code',
          layout: 'card border + AlertTriangle amber + label',
          render: 'Badge com cor da categoria + reason_code | reason_description ao lado',
        },
        {
          name: 'Section 4 — Customer',
          layout: 'card border + User azul + label',
          render: 'customer_name + customer_email (text-sm gray)',
        },
        {
          name: 'Section 5 — Win Probability',
          layout: 'card border + TrendingUp emerald + label',
          render: '<WinProbabilityBadge probability={win_probability} />',
        },
        {
          name: 'Section 6 — AI Recommendation (CONDICIONAL)',
          renderIf: 'selectedDispute?.ai_recommendation',
          layout: 'card GRADIENT purple-50→indigo-50 com border-purple-200',
          icon: 'Sparkles purple-600',
          label: '"Recomendação da IA" (purple-700)',
          badge: {
            contest: 'bg-emerald-100 text-emerald-700 → "Contestar"',
            accept: 'bg-slate-100 text-slate-700 → "Aceitar"',
          },
          reasoning: 'ai_recommendation_reason em parágrafo purple-700 (se existir)',
          purpose: 'Decisão-suporte — IA analisa probabilidade × valor × histórico e dá recomendação clara',
        },
      ],
      footer: {
        cancelButton: '"Fechar" outline',
        contestButton: {
          renderIf: '["received", "in_analysis"].includes(status)',
          label: '"Contestar Chargeback"',
          icon: 'FileText à esquerda + ChevronRight à direita',
          color: 'bg-purple-600 hover:bg-purple-700',
          link: 'Link wrapper para /DisputeContestation?id={id}',
        },
      },
    },

    // ------------------------------------------------------------------------
    // GAPS & OPORTUNIDADES
    // ------------------------------------------------------------------------
    knownGaps: [
      'Sem botão de export (CSV/PDF) — relatórios financeiros frequentemente exigem',
      'Sem ação de "Aceitar" rápida na tabela — força ir até o /DisputeContestation',
      'Bandeira "hipercard" no config mas não no filtro Select',
      'Sem filtro por valor (range mín-máx) — útil para priorizar high-value',
      'Sem filtro por probabilidade de ganho — útil para focar nos vencíveis',
      'Sem ordenação clicável nas colunas — apenas ordenação backend fixa',
      'Sem batch actions — não dá para selecionar múltiplos e contestar/aceitar em lote',
      'Bot e ArrowRight importados mas não usados',
      'Dialog não mostra histórico de evidências já submetidas (se in_contestation)',
      'AI recommendation aparece SÓ no dialog — não na tabela como hint visual',
      'Sem timeline de eventos do chargeback',
      'Sem link para /MEDDashboard ou /DisputeContestation a partir do header',
    ],

    relationshipsToOtherPages: {
      disputeDashboard: '/DisputeDashboard — quick action vermelho',
      disputeContestation: '/DisputeContestation?id={id} — destino do botão "Contestar" (FileText roxo) e link no dialog',
      transactionDetail: '/TransactionDetail?id={transaction_id} — link na coluna Transação',
      disputeManagerSettings: '/DisputeAgentSettings — onde se configura a IA que gera as ai_recommendations',
    },
  },
};

export default ChargebacksDoc;