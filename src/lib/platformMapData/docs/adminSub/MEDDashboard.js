// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /MEDDashboard
// ============================================================================
// Arquivo dedicado, fidelidade absoluta a pages/MEDDashboard.jsx (715 linhas).
// Cada KPI, cada filtro, cada coluna da tabela, cada estado do dialog,
// cada lógica de prazo (8h MED é único!), cada motivo regulatório — documentado.
// ============================================================================

export const MEDDashboardDoc = {
  pageId: 'MEDDashboard',
  pagePath: '/MEDDashboard',
  module: 'Disputas',
  parentPage: 'DisputeDashboard',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Centro de gestão do MED (Mecanismo Especial de Devolução) — instrumento REGULATÓRIO do Bacen exclusivo para PIX, onde bancos emissores podem solicitar devolução de transações suspeitas de fraude/falha operacional, exigindo resposta do merchant em janelas DRASTICAMENTE curtas (8h tipicamente) sob risco de devolução automática.',

    whatIsMED: {
      definition:
        'MED = Mecanismo Especial de Devolução. Instituído pela Resolução BCB 103/2021. Permite que o PSP do pagador (banco emissor) solicite ao PSP recebedor (banco do merchant via PagSmile) a devolução de um Pix nos casos previstos: fraude, falha operacional ou erro do usuário.',
      regulatoryBase: 'Banco Central do Brasil — Manual Operacional do Pix, capítulo do MED',
      uniqueFromCB:
        'Diferente de chargeback de cartão (Visa/MC), MED é processo REGULADO pelo Bacen com prazos rígidos do SPI (Sistema de Pagamentos Instantâneos). Não há "contestação" como no CB — o merchant ACEITA, RECUSA ou ACEITA PARCIALMENTE.',
      timing:
        'Janela típica de 8 HORAS para resposta após recebimento. Expirado = devolução automática a critério do PSP recebedor.',
    },

    threeReasonCategories: {
      fraud: {
        legalLabel: 'fraud',
        meaning: 'Cliente alega que NÃO autorizou o Pix — possível conta comprometida, golpe do Pix',
        difficultyToReject: 'ALTA — bancos costumam ser firmes em casos de fraude reportada',
        commonScenarios: 'Golpe do falso emprego, falso boleto, sequestro digital, phishing',
      },
      operational_failure: {
        meaning: 'Falha operacional do PSP/sistema — duplicidade, valor errado, beneficiário errado',
        difficultyToReject: 'BAIXA — geralmente o merchant tem evidências',
      },
      user_request: {
        meaning: 'Solicitação do usuário — desistência, arrependimento, divergência comercial',
        difficultyToReject: 'MÉDIA — depende se já houve entrega/uso do produto',
      },
      other: { meaning: 'Casos atípicos — fallback' },
    },

    threePossibleResponses: {
      accept: {
        what: 'Aceitar integralmente o MED — devolver 100% do valor',
        when: 'Fraude confirmada, falha sistêmica óbvia, primeiro-strike de boa fé',
        outcome: 'Status "accepted" + accepted_amount = requested_amount + Pix de devolução enviado',
      },
      partially_accept: {
        what: 'Aceitar parcialmente — devolver MENOS que o solicitado',
        when: 'Cliente recebeu produto/serviço parcial',
        outcome: 'Status "partially_accepted" + accepted_amount < requested_amount',
        rule: 'Sistema deduz: se acceptedAmount < requestedAmount → status vira partially_accepted automaticamente',
      },
      reject: {
        what: 'Recusar o MED com justificativa fundamentada',
        when: 'Cliente recebeu o produto, valor já reembolsado de outra forma, fraude da PARTE do cliente',
        outcome: 'Status "rejected" — banco emissor pode escalar para o Bacen ou abrir processo formal',
        risk: 'Recusas em série podem virar fiscalização/sanção do PSP recebedor pelo Bacen',
      },
    },

    coreCapabilities: [
      '4 KPIs com border-l-4 colorido: Pendentes (amber) | Aceitas (verde) | Recusadas (red) | Total (verde-marca)',
      'Banner de urgência: alertas com prazo < 4h ganham flag vermelha "X urgente(s) - prazo expirando"',
      'Filtros: busca livre + status (6 opções) + motivo (4 opções)',
      'Tabs separando Pendentes / Resolvidas / Todas com contador dinâmico',
      'Tabela 7 colunas com prazo dinâmico (verde/amber/vermelho/expirado)',
      'Dialog completo de detalhes — histórico transação + solicitante + motivo + decisão (input valor + textarea)',
      'Mock data embarcado: 4 MEDs de exemplo cobrindo todos os status',
    ],

    crucialRegulatoryContext: {
      bcbInstruction: 'Resolução BCB nº 103, de 24/05/2021 — instituiu o MED no SPI',
      slaPenalty:
        'PSP que recusa MED de forma injustificada pode sofrer notificação do Bacen + multas + potencial descredenciamento do SPI',
      asymmetry:
        'O MED protege o consumidor — merchant tem que provar inocência. É o oposto da lógica de chargeback antigo.',
    },
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/MEDDashboard.jsx',
    totalLines: 715,

    imports: {
      reactQuery: ['useQuery', 'useMutation', 'useQueryClient'],
      base44: 'base44.entities.MED — list/update',
      uiComponents: [
        'PageHeader (shared)',
        'Card+CardContent+CardHeader+CardTitle+CardDescription',
        'Button', 'Input', 'Badge',
        'Tabs+TabsContent+TabsList+TabsTrigger',
        'Select stack', 'Dialog stack', 'Textarea',
        'Table stack', 'Skeleton',
      ],
      utilities: ['date-fns: format, differenceInHours, isPast', 'date-fns/locale: ptBR', 'cn (lib/utils)', 'formatCurrency (components/utils)', 'toast (sonner)'],
      lucideIcons: [
        'Search — input de busca',
        'Clock — KPI Pendentes (amber) + status pending',
        'CheckCircle — KPI Aceitas + status accepted/partially_accepted',
        'XCircle — KPI Recusadas + status rejected',
        'AlertTriangle — banner urgência + status expired',
        'FileText — tab "Todas"',
        'Eye — botão Ver detalhes + status analyzing',
        'Filter — importado, não usado',
        'Download — botão Exportar header',
        'RefreshCw — botão Atualizar (invalida cache)',
        'QrCode — KPI Total (cor marca) + ícone do MED',
        'Timer — ícone de prazo nas células',
        'ArrowDownCircle/TrendingUp/TrendingDown/BarChart3 — importados sem uso',
      ],
    },

    mockData: {
      structure: 'Array de 4 MEDs cobrindo todos os status principais',
      meds: [
        { id: '1', med_id: 'MED-2024-001234', amount: 1500, reason: 'fraud', status: 'pending', purpose: 'MED novo dentro do prazo' },
        { id: '2', med_id: 'MED-2024-001235', amount: 3200.5, reason: 'operational_failure', status: 'analyzing', purpose: 'MED em análise por analista' },
        { id: '3', med_id: 'MED-2024-001230', amount: 850, reason: 'fraud', status: 'accepted', accepted_amount: 850, purpose: 'MED resolvido positivamente' },
        { id: '4', med_id: 'MED-2024-001228', amount: 2100, reason: 'user_request', status: 'rejected', purpose: 'MED recusado com justificativa' },
      ],
      fallbackLogic:
        'queryFn: const data = await base44.entities.MED.list("-created_date", 100); return data.length > 0 ? data : mockMEDs',
    },

    statusConfig: {
      pending: { label: 'Pendente', color: 'bg-amber-100 text-amber-800', icon: 'Clock' },
      analyzing: { label: 'Em Análise', color: 'bg-blue-100 text-blue-800', icon: 'Eye' },
      accepted: { label: 'Aceita', color: 'bg-green-100 text-green-800', icon: 'CheckCircle' },
      partially_accepted: { label: 'Parcialmente Aceita', color: 'bg-teal-100 text-teal-800', icon: 'CheckCircle' },
      rejected: { label: 'Recusada', color: 'bg-red-100 text-red-800', icon: 'XCircle' },
      expired: { label: 'Expirada', color: 'bg-gray-100 text-gray-800', icon: 'AlertTriangle' },
    },

    reasonConfig: {
      fraud: { label: 'Fraude', color: 'text-red-600' },
      operational_failure: { label: 'Falha Operacional', color: 'text-orange-600' },
      user_request: { label: 'Solicitação do Usuário', color: 'text-blue-600' },
      other: { label: 'Outro', color: 'text-gray-600' },
    },

    internalSubcomponents: {
      MEDKPICards: {
        signature: '({ meds }) => Grid de 4 cards',
        layout: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6',
        urgentLogic: 'urgentMEDs = pendingMEDs.filter(m => hoursLeft <= 4 && hoursLeft > 0)',
        cards: [
          { name: 'Pendentes', border: 'amber-500', filter: "status IN ['pending','analyzing']", extraAlert: 'urgentes <4h pulsam vermelho' },
          { name: 'Aceitas', border: 'green-500', filter: "status IN ['accepted','partially_accepted']", subValue: 'sum((accepted_amount || requested_amount))' },
          { name: 'Recusadas', border: 'red-500', filter: "status === 'rejected'", subValue: '`${(rej/total*100).toFixed(1)}% do total`' },
          { name: 'Total', border: '[#2bc196]', value: 'meds.length', subValue: '"Últimos 30 dias" (estático — gap)' },
        ],
      },

      MEDDetailDialog: {
        signature: '({ med, open, onOpenChange, onAction }) => Dialog | null',
        guards: 'if (!med) return null',
        maxWidth: 'max-w-2xl max-h-[90vh] overflow-y-auto',
        localState: {
          responseReason: { initial: "''", purpose: 'Texto da justificativa' },
          acceptedAmount: { initial: 'med?.requested_amount || 0', purpose: 'Valor a devolver' },
        },
        timeCalculations: {
          hoursLeft: 'differenceInHours(deadline_at, now)',
          isExpired: 'isPast(deadline_at)',
          isUrgent: 'hoursLeft <= 4 && hoursLeft > 0',
        },
        sections: [
          'Header: QrCode + "Detalhes da MED - {med_id}"',
          'Status & Prazo Bar: 2 badges (status + reason) + Timer com cor dinâmica',
          'Grid 2 cols: Transação Original (end_to_end_id, valor, comerciante) | Solicitante (PSP, pagador, doc mascarado)',
          'Motivo: card slate-50 com reason_description',
          'Datas: grid 2 cols com format(received_at) e format(deadline_at) ptBR',
          'Bloco Decisão CONDICIONAL (status pending/analyzing && !isExpired): Input number + Textarea justificativa',
          'Resposta Anterior CONDICIONAL (response_date): histórico do que foi feito',
        ],
        footer: {
          alwaysButton: '"Fechar" (variant outline)',
          conditionalButtons: {
            renderIf: '(status IN [pending, analyzing]) && !isExpired',
            rejectButton: 'destructive + XCircle + "Recusar" (disabled se !responseReason.trim())',
            acceptButton: 'bg-[#2bc196] + CheckCircle + "Aceitar" (disabled se !responseReason || amount<=0)',
          },
        },
      },

      MEDTable: {
        signature: '({ meds, isLoading, onViewDetails }) => Card>Table | LoadingState | EmptyState',
        loadingState: 'Card com 3 Skeletons h-16 w-full',
        emptyState: 'QrCode 12x12 opacity-50 + "Nenhuma MED encontrada"',
        columns: [
          'MED ID: med_id (font-medium) + transaction_id truncado (...15) mono',
          'Comerciante: merchant_name + payer_name',
          'Valor: formatCurrency(requested_amount) font-semibold',
          'Motivo: Badge OUTLINE com reasonConfig.color',
          'Status: Badge com statusConfig.color + StatusIcon 3x3 + label',
          'Prazo: Timer 4x4 + texto colorido (gray/red/slate)',
          'Ações: Button ghost sm + Eye + "Ver" (stopPropagation)',
        ],
        rowInteraction: 'cursor-pointer + hover:bg-slate-50 + onClick row → onViewDetails(med)',
      },
    },

    componentState: {
      searchTerm: { initial: "''" },
      statusFilter: { initial: "'all'" },
      reasonFilter: { initial: "'all'" },
      selectedMED: { initial: 'null' },
      detailDialogOpen: { initial: 'false' },
    },

    backendIntegration: {
      queryMEDs: {
        queryKey: "['meds']",
        queryFn: 'base44.entities.MED.list("-created_date", 100) com fallback para mockMEDs',
      },
      updateMutation: {
        mutationFn: '({ id, updates }) => base44.entities.MED.update(id, updates)',
        onSuccess: 'invalidateQueries(["meds"]) + toast.success + setDetailDialogOpen(false)',
        onError: 'toast.error("Erro ao atualizar MED: " + err.message)',
      },
    },

    handleMEDActionLogic: {
      signature: '(med, status, acceptedAmount, responseReason) => void',
      baseUpdates: '{ status, response_date: now ISO, response_reason }',
      conditionalUpdates: {
        condition: "status IN ['accepted', 'partially_accepted']",
        autoCoercion:
          'AUTO-COERÇÃO: se acceptedAmount < requested_amount → status="partially_accepted", senão "accepted"',
        criticalDetail:
          'Mesmo se usuário clicar em "Aceitar", sistema corrige para "partially_accepted" se valor digitado for menor — lógica defensiva correta semanticamente.',
      },
    },

    filteringLogic: {
      filteredMEDs: {
        chain: '4 condições AND',
        searchMatch: 'OR em [med_id, transaction_id, merchant_name, payer_name].toLowerCase()',
        statusMatch: 'statusFilter === "all" || med.status === statusFilter',
        reasonMatch: 'reasonFilter === "all" || med.reason === reasonFilter',
      },
      tabsSplit: {
        pendingMEDs: "filter status IN ['pending','analyzing']",
        resolvedMEDs: "filter status NOT IN ['pending','analyzing']",
      },
    },

    layout: {
      pageHeader: {
        title: '"Gestão de MEDs"',
        subtitle: '"Mecanismo Especial de Devolução - Gerencie solicitações de devolução Pix"',
        breadcrumbs: [{ label: 'Disputas', page: 'DisputeDashboard' }, { label: 'MEDs', page: 'MEDDashboard' }],
        actions: ['Exportar (gap: sem onClick)', 'Atualizar (invalidateQueries)'],
      },
      filtersCard: {
        layout: 'flex flex-col md:flex-row gap-4',
        searchInput: { width: 'flex-1', placeholder: 'Buscar por ID, transação, comerciante ou pagador...', padding: 'pl-10' },
        statusSelect: { width: 'w-[180px]', options: 7 },
        reasonSelect: { width: 'w-[180px]', options: 5 },
      },
      tabsLayout: {
        defaultValue: 'pending',
        triggers: [
          'pending: Clock + "Pendentes ({count})"',
          'resolved: CheckCircle + "Resolvidas ({count})"',
          'all: FileText + "Todas ({count})"',
        ],
      },
    },

    knownGaps: [
      'Mock data embarcado no arquivo de produção',
      'Botão "Exportar" sem onClick',
      'Subtitle "Últimos 30 dias" hardcoded',
      'Filter (lucide), ArrowDownCircle, TrendingUp, TrendingDown, BarChart3 importados sem uso',
      'Sem ação "Iniciar análise" (transição pending → analyzing)',
      'Sem ANEXO DE EVIDÊNCIAS na recusa',
      'Sem timeline de eventos do MED',
      'Analista atribuído não exibido na tabela',
      'pix_return_id sem link clicável',
      'Mutation toast usa string concat em vez de i18n',
    ],

    relationshipsToOtherPages: {
      disputeDashboard: '/DisputeDashboard — pai do módulo',
      transactions: '/TransactionDetail — gap: link da transaction_id',
      pixTransactions: '/PixTransactions — origem das MEDs',
    },
  },
};

export default MEDDashboardDoc;