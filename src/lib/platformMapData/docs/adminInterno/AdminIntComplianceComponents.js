// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — Componentes do Hub /AdminIntCompliance
// Fidelidade absoluta a 5 sub-componentes principais (~2.130 linhas analisadas):
//  - ManualReviewQueue.jsx (557 linhas)
//  - AllSubmissionsList.jsx (691 linhas)
//  - HelenaTraining.jsx (216 linhas)
//  - RulesAndWorkflows.jsx (369 linhas)
//  - FormLinkGenerator.jsx (400 linhas)
// ============================================================================

export const AdminIntComplianceComponentsDoc = {
  pageId: 'AdminIntComplianceComponents',
  pagePath: '/AdminIntCompliance (sub-components)',
  module: 'Admin Interno',
  parentPage: 'AdminIntCompliance',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Documentação microscópica dos 5 componentes principais do Hub Compliance: ManualReviewQueue (fila de análise manual com modal Dialog 6xl + 4 sub-tabs Helena/Dados/Documentos/Histórico + 3 botões decisão Aprovar/Reprovar/Solicitar Docs + Simular Escalação + Document Viewer modal aninhado), AllSubmissionsList (lista paginada 10/página com 5 stats + 3 filtros + Dialog 5xl + 4 sub-tabs Helena/Questionário/Documentos/Timeline timeline-based), HelenaTraining (KPIs ML 96/94/95 + LineChart 6 meses + Dataset + Retreinamento + 4 Capacidades), RulesAndWorkflows (CRUD regras com 5 tipos + 4 stats + lista expansível + Modal Editor + DecisionFlowVisualizer), FormLinkGenerator (gerador com 4 form types + Tabs Generate/History + clipboard funcional + toast + 4-step "Como Funciona" + lista de links com copy disabled se expired).',

    fiveComponentsOverview: {
      manualReviewQueue: 'Fila de análise manual — 3 mocks scores 45/52/38 → todos manual_review',
      allSubmissionsList: 'Lista completa — 5 mocks com status variados (manual_review/approved/rejected/approved/documents_requested)',
      helenaTraining: 'Métricas Machine Learning + retreinamento simulado',
      rulesAndWorkflows: '4 regras mock + editor com conditions/actions',
      formLinkGenerator: 'Gerador de URLs externos para questionários',
    },

    // ==========================================================================
    // SUB-DOC #1 — ManualReviewQueue
    // ==========================================================================
    manualReviewQueueMicroscopic: {
      role: 'Fila ESPECÍFICA de submissões em manual_review encaminhadas pela Helena (sub-set da ComplianceQueue)',

      threeMockSubmissions: {
        sub001: {
          business: 'Tech Solutions LTDA',
          cnpj: '12.345.678/0001-90',
          type: 'kyc_full',
          score: 45,
          status: 'manual_review',
          recommendation: 'Requer verificação de endereço e validação de sócios',
          redFlags: ['Endereço inconsistente', 'Sócio com restrição', 'MCC incompatível'],
          reason: 'Score abaixo do threshold (45 < 60)',
          timeInQueue: 4.5,
          analyst: null,
          documents: [
            'Contrato Social: approved (contract)',
            'Comprovante Endereço: pending (address)',
            'RG Sócio 1: approved (id)',
            'RG Sócio 2: approved (id)',
          ],
          helenaJustification: 'Markdown completo com Resumo Executivo + Pontos de Atenção (3) + Documentos Analisados (4) + Score Detalhado (4 dimensões) + Recomendação',
        },
        sub002: {
          business: 'Comércio Digital ME',
          cnpj: '98.765.432/0001-10',
          type: 'kyc_pix',
          score: 52,
          recommendation: 'Verificar faturamento declarado vs. porte da empresa',
          redFlags: ['Faturamento incompatível', 'Empresa recente'],
          timeInQueue: 8.2,
          analyst: 'maria.silva@pagsmile.com',
          documents: ['Contrato Social: approved', 'CNPJ: approved'],
        },
        sub003: {
          business: 'Loja Virtual Express',
          cnpj: '11.222.333/0001-44',
          type: 'kyc_full',
          score: 38,
          recommendation: 'Alto risco - múltiplas inconsistências detectadas',
          redFlags: ['PEP detectado', 'Endereço compartilhado suspeito', 'Histórico negativo'],
          timeInQueue: 26.5,
          gap: '>24h ALERTA — text-red-600 + bg-red-50/50 row',
          analyst: null,
          documents: ['Contrato Social: pending', 'Comprovante Endereço: rejected'],
        },
      },

      threeFilterStates: {
        searchTerm: 'Match business_name?.toLowerCase().includes OR document?.includes',
        filterScore: '4 opções: all / critical(<40) / high(40-59) / medium(60-79) — gap: NÃO tem opção "low (80+)" pois ninguém em manual_review tem score>=80',
      },

      fourQueueStats: {
        layout: 'grid-cols-4 gap-4',
        naFila: '{mockSubmissions.length}=3 — amber Clock',
        riscoCritico: '{filter score<40}.length=1 (sub003) — red AlertTriangle',
        comAnalista: '{filter assigned_analyst}.length=1 (sub002) — blue User',
        tempoMedio: '{(reduce sum / length).toFixed(1)}h = ((4.5+8.2+26.5)/3).toFixed(1) = 13.1h — purple Clock',
      },

      submissionsTable: {
        eightColumns: ['Empresa (Building2 + name)', 'CNPJ (font-mono xs)', 'Tipo (Badge outline kyc_full/kyc_pix)', 'Score Helena (getScoreBadge 4 ranges)', 'Recomendação Helena (Sparkles purple + line-clamp-2 max-w-xs)', 'Tempo na Fila (Clock + h, red>24h)', 'Analista (Badge blue username ou outline "Não atribuído")', 'Ações (Button bg-#2bc196 "Analisar" Eye)'],
        getScoreBadgeFourRanges: {
          baixoRisco: '>=80 green-100/700 — "Baixo Risco ({score})"',
          medio: '>=60 amber-100/700 — "Médio ({score})"',
          alto: '>=40 orange-100/700 — "Alto ({score})"',
          critico: '<40 red-100/700 — "Crítico ({score})"',
        },
      },

      analysisDialog: {
        wrapper: 'Dialog max-w-6xl max-h-[90vh] overflow-hidden flex flex-col — open={!!selectedSubmission}',
        header: 'Building2 + business_name + Badge outline cnpj — DialogDescription "Análise detalhada de compliance"',
        fourSubTabs: {
          helena: { icon: 'Sparkles', label: 'Parecer Helena', defaultActive: true },
          data: { icon: 'FileText', label: 'Dados do Cliente', state: 'PLACEHOLDER ("Dados do questionário serão exibidos aqui")' },
          documents: { icon: 'FileText (DUPLICADO com data)', label: 'Documentos', state: 'FUNCIONAL — lista docs com status badge + Eye/Download' },
          history: { icon: 'Clock', label: 'Histórico', state: 'PLACEHOLDER ("Histórico de ações será exibido aqui")' },
        },
        scrollArea: 'ScrollArea wrapping toda a área de tabs — flex-1 mt-4',

        helenaTabContent: {
          scoreCard: 'Card gradient purple-50→white border-purple-200 col-span-1 — score 4xl bold purple-600 + getScoreBadge',
          redFlagsCard: 'Card col-span-2 — flex-wrap Badges red-100/700 + Flag 3x3 + flag text',
          parecerCompleto: 'Card border-purple-200 — header com iconBox 6x6 gradient purple-500→indigo-600 + Sparkles white — content: pre whitespace-pre-wrap font-sans bg-slate-50 p-4 com helena_justification (markdown raw)',
          notasAnalistaCard: 'Card MessageSquare + "Notas do Analista" — Textarea min-h-[100px] CONTROLLED via analystNotes state',
          gap: 'analystNotes state existe mas SEM submit — só local no dialog',
        },

        documentsTabContent: {
          eachDocRow: 'flex items-center justify-between p-3 border rounded-lg — left: FileText 5x5 + name bold + type xs — right: getStatusBadge + Button "Ver Validação IA" Eye + Button Download icon',
          documentViewerDialog: 'Aninhado — abre DocumentUploadSimulator dentro de Dialog max-w-2xl',
          gap: 'documentType prop pode ser undefined → fallback "CNH" hardcoded ("setSelectedDocument?.type || \\"CNH\\"")',
        },

        dialogFooter: {
          layout: 'flex items-center justify-between w-full',
          leftButtons: [
            'Button outline "Cancelar" — onClick funcional setSelectedSubmission(null)',
            'Button outline "Simular Escalação" AlertTriangle — onClick abre EscalationSimulator (FUNCIONAL)',
          ],
          rightButtons: [
            'Button outline amber-600 "Solicitar Documentos" Send — gap: SEM onClick',
            'Button outline red-600 "Reprovar" XCircle — gap: SEM onClick',
            'Button bg-green-600 "Aprovar" CheckCircle2 — gap: SEM onClick',
          ],
        },

        documentViewerModal: 'Dialog aninhado max-w-2xl — DocumentUploadSimulator componente externo',
        escalationSimulator: 'Componente externo EscalationSimulator com open/onOpenChange',
      },
    },

    // ==========================================================================
    // SUB-DOC #2 — AllSubmissionsList
    // ==========================================================================
    allSubmissionsListMicroscopic: {
      role: 'Lista PAGINADA completa de TODAS as submissões (status variados, não só manual_review)',

      fiveMockSubmissionsExpanded: [
        'SUB001: Tech Solutions LTDA / kyc_full / manual_review / score=45',
        'SUB002: Comércio Digital ME / kyc_pix / approved (auto Helena 85) — decision_date 2024-01-27T10:15:03 (3s após submit!)',
        'SUB003: Loja Virtual Express / kyc_full / rejected (auto Helena 22) — 4 red flags críticos',
        'SUB004: Startup Inovação SA / kyc_full / approved (manual após score 72) — analyst carlos.oliveira',
        'SUB005: E-commerce Plus LTDA / kyc_pix / documents_requested / score 58 / analyst ana.costa',
      ],

      questionnaireDataExpanded: 'sub001 tem objeto completo: razao_social/nome_fantasia/cnpj/data_abertura/capital_social/faturamento_mensal/tipo_empresa/atividade_principal/mcc/endereco{6 fields}/socios[2 com cpf+participacao] — outros têm apenas razao_social+cnpj',

      fiveStatsCards: {
        total: '{allSubmissions.length}=5 — Card default',
        aprovados: '{filter status=approved}=2 (sub002+sub004) — green-50/200/600',
        rejeitados: '{filter status=rejected}=1 (sub003) — red-50/200/600',
        emAnalise: '{filter status=manual_review}=1 (sub001) — amber-50/200/600',
        aguardandoDocs: '{filter status=documents_requested}=1 (sub005) — blue-50/200/600',
      },

      threeFilters: {
        searchTerm: 'Triple match: business_name OR document OR id (case-insensitive nos 2 primeiros, case-sens no document)',
        filterStatus: '5 opções: all/approved/rejected/manual_review/documents_requested — gap: NÃO inclui pending/ai_analyzing/ai_approved/ai_rejected',
        filterType: '4 opções: all/kyc_full/kyc_pix/kyc_card',
        gap: 'Botão "Exportar" Download SEM onClick',
      },

      eightStatusBadges: {
        getStatusBadgeAll: '8 keys: pending(slate Clock), ai_analyzing(purple Sparkles), ai_approved(green CheckCircle2), ai_rejected(red XCircle), manual_review(amber User), approved(green CheckCircle2), rejected(red XCircle), documents_requested(blue FileText)',
        gap: 'ai_approved e approved usam EXATAMENTE A MESMA cor green-100/700 — confusão visual',
        gap2: 'ai_rejected e rejected também duplicados',
      },

      paginationLogic: {
        itemsPerPage: 10,
        totalPages: 'Math.ceil(filteredSubmissions.length / 10) — com 5 itens = 1 página',
        paginationFooter: 'flex justify-between — texto "Mostrando 1 a {min(10, total)} de {total} resultados" + Button ChevronLeft (disabled page=1) + "Página X de Y" + Button ChevronRight',
      },

      formatDate: '`new Date(dateString).toLocaleString("pt-BR", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" })`',

      submissionsTable: {
        nineColumns: ['ID (font-mono xs)', 'Empresa (Building2 + name)', 'CNPJ', 'Tipo', 'Data Submissão (formatDate)', 'Status (getStatusBadge)', 'Score Helena (getScoreBadge SIMPLIFICADO — sem "Baixo Risco" prefixo, só número)', 'Analista (username ou "-")', 'Ações (Eye + "Ver Detalhes")'],
        getScoreBadgeSimpler: 'AllSubmissions tem versão simplificada: green/amber/orange/red apenas com {score} — sem prefixo "Baixo Risco/Médio/Alto/Crítico"',
      },

      detailDialog: {
        wrapper: 'max-w-5xl (5xl, NÃO 6xl como ManualReview)',
        header: 'Building2 + business_name + getStatusBadge inline — desc: ID + CNPJ',
        fourSubTabs: ['Parecer Helena', 'Questionário', 'Documentos', 'Timeline'],
        helenaTabContent: 'Score card 4xl + Red Flags (mostra Badge green CheckCircle2 "Nenhum red flag identificado" se vazio) + Parecer pre-wrap',
        questionnaireTab: 'grid-cols-2 — Object.entries(questionnaire_data) — KEY UPPERCASE underscore→space + value (typeof object → JSON.stringify, else String())',
        documentsTab: 'docs com status badge + uploaded_at formatDate + Eye',
        timelineTab: {
          fourEvents: [
            '1. Questionário submetido (Blue FileText) — submission_date',
            '2. Análise Helena concluída (Purple Sparkles) — Score: {n}',
            '3 (CONDICIONAL se decision_date): Status final (green CheckCircle2 OU red XCircle) — decision_date + " por " analyst.username',
          ],
          gap: 'Timeline NÃO mostra eventos intermediários (atribuição analista, solicitação docs, etc.)',
        },
      },
    },

    // ==========================================================================
    // SUB-DOC #3 — HelenaTraining
    // ==========================================================================
    helenaTrainingMicroscopic: {
      role: 'Métricas de qualidade do modelo ML Helena + retreinamento + capacidades',

      threePerformanceKPIs: {
        layout: 'grid md:3 gap-4',
        accuracy: { value: '96%', delta: '+4% vs 6 meses', icon: 'Target', color: 'green-100/600 + gradient green-50→white' },
        recall: { value: '94%', delta: '+6% vs 6 meses', icon: 'CheckCircle2', color: 'blue-100/600 + gradient blue-50→white' },
        f1Score: { value: '95%', delta: '+5% vs 6 meses', icon: 'Brain', color: 'purple-100/600 + gradient purple-50→white' },
        valueSize: 'text-4xl font-bold',
      },

      performanceLineChart: {
        title: 'BarChart3 5x5 purple-600 + "Evolução de Performance do Modelo"',
        height: 300,
        domain: '[85, 100]',
        sixMonths: 'Ago/Set/Out/Nov/Dez/Jan — accuracy 92→96, recall 88→94, f1 90→95',
        threeLines: 'accuracy(#2bc196), recall(#3b82f6), f1(#8b5cf6) — strokeWidth=2',
      },

      datasetCard: {
        header: 'Database 5x5 blue-600 + "Dataset de Treinamento"',
        fourBadges: [
          'Conversas de KYC Reais → Badge bg-blue-600 "10M conversas"',
          'Casos de Fraude → Badge bg-red-600 "50K casos"',
          'Regulações Brasileiras → Badge bg-green-600 "Completo"',
          'Best Practices → Badge bg-purple-600 "20 países"',
        ],
        gap: 'trainingStats.regulations="Circular 3.978, Lei 9.613/98, CVM 617" mas NÃO É EXIBIDO no UI — apenas "Completo"',
      },

      retreinamentoCard: {
        header: 'RefreshCw 5x5 purple-600',
        info: '"Último Retreinamento: 2026-01-25" + "Próximo Agendado: 2026-02-01"',
        infoBox: 'p-3 bg-purple-50 — "Frequência: Retreino diário com novos dados" + "Modo: Incremental com validação A/B"',
        ctaButton: 'SimulatedActionButton "Simular Retreinamento" RefreshCw outline w-full — actionLabel="Retreinamento iniciado (simulado)"',
        gap: 'Conflito: card diz "Retreino diário com novos dados" mas dates indicam GAP de 7 dias entre last(25) e next(2026-02-01) — semana, não diário',
      },

      capacidadesCard: {
        header: 'Brain 5x5 purple-600 + gradient purple-50/50→white',
        gridLayout: 'grid md:2 gap-3',
        fourCapacidades: [
          'Detecção de Evasão — "Identifica quando merchant tenta evitar perguntas"',
          'Explicação Regulatória — "Explica requirements em linguagem simples"',
          'Negociação Suave — "Convence merchants relutantes"',
          'Educação Contextual — "Ensina sobre compliance durante o processo"',
        ],
        renderEach: 'flex items-start gap-3 p-3 border bg-white + CheckCircle2 5x5 purple-600 mt-0.5 + label sm bold + desc xs slate-500',
      },
    },

    // ==========================================================================
    // SUB-DOC #4 — RulesAndWorkflows
    // ==========================================================================
    rulesAndWorkflowsMicroscopic: {
      role: 'CRUD de regras de automação compliance — auto-approve / auto-reject / manual-review / docs / notification',

      fiveTypeConfigs: {
        auto_approve: 'green-100/700 CheckCircle2 — "Auto-Aprovação"',
        auto_reject: 'red-100/700 AlertTriangle — "Auto-Rejeição"',
        manual_review: 'amber-100/700 User — "Análise Manual"',
        request_documents: 'blue-100/700 Filter — "Solicitar Docs" — gap: NÃO usado nos mocks',
        notification: 'purple-100/700 Bell — "Notificação" — gap: NÃO usado nos mocks',
      },

      fourMockRules: {
        rule001: {
          name: 'Auto-Aprovação Score Alto',
          desc: 'Aprova automaticamente quando Helena Score >= 80',
          type: 'auto_approve',
          priority: 1,
          conditions: '[helena_score greater_than 80]',
          actions: '[set_status: ai_approved]',
          executions: 892,
        },
        rule002: {
          name: 'Rejeição Automática Score Crítico',
          desc: 'Score < 30',
          type: 'auto_reject',
          priority: 1,
          conditions: '[helena_score less_than 30]',
          actions: '[set_status: ai_rejected]',
          executions: 156,
        },
        rule003: {
          name: 'Análise Manual Faixa Intermediária',
          desc: 'Scores 30-80',
          type: 'manual_review',
          priority: 2,
          conditions: '[helena_score>30, helena_score<80] (logic AND)',
          actions: '[set_status: manual_review, send_notification: manual_review_needed]',
          executions: 199,
          gap: 'logic_operator="AND" só presente nesta regra — outras com 1 condição não usam',
        },
        rule004: {
          name: 'Atribuição Automática para Analista Senior',
          desc: 'PEP detectado',
          type: 'manual_review',
          priority: 1,
          conditions: '[helena_red_flags contains "PEP detectado"]',
          actions: '[assign_analyst: senior_analyst, add_flag: PEP_DETECTED]',
          executions: 24,
        },
      },

      headerSection: {
        leftSide: 'h3 "Regras de Compliance" + p "Automatize decisões com regras configuráveis"',
        rightButton: 'Button "Nova Regra" Plus — onClick=openEditor() FUNCIONAL — abre Modal Editor com selectedRule=null',
      },

      fourStatsCards: {
        layout: 'grid-cols-4',
        autoAprovacao: '{filter type=auto_approve}.length=1 (rule001) — green',
        autoRejeicao: '{filter type=auto_reject}.length=1 (rule002) — red',
        revisaoManual: '{filter type=manual_review}.length=2 (rule003+rule004) — amber',
        regrasAtivas: '{filter status=active}.length=4 (todas active) — blue',
      },

      ruleListEachCard: {
        layout: 'flex items-start justify-between',
        leftSection: 'iconBox 10x10 type color + Icon — name bold + Badge type color + Badge outline "Prioridade {n}" + desc — GitBranch + "{n} condição(ões) • {m} ação(ões)" + Button ghost "Ver Fluxo" — execution_stats xs',
        rightSection: '3 Buttons ghost — Edit (FUNCIONAL → openEditor(rule)) + Pause/Play (gap: SEM onClick — só visual color toggle) + Trash2 red-600 (gap: SEM onClick)',
      },

      flowVisualizerModal: {
        wrapper: 'Dialog max-w-2xl — open via setVisualizerOpen(true) na "Ver Fluxo"',
        title: '"Fluxo de Decisão: {selectedRule?.name}"',
        component: 'DecisionFlowVisualizer com prop rule={ condition: conditions.map join " AND ", action: actions[0]?.action_type }',
        gap: 'apenas actions[0] — múltiplas ações IGNORADAS (rule003 tem 2 actions, só primeira é mostrada)',
      },

      ruleEditorModal: {
        wrapper: 'Dialog max-w-4xl — title condicional "Nova Regra" OU "Editar Regra: {name}"',
        nameField: 'Input defaultValue=selectedRule?.name (uncontrolled)',
        typeField: 'Select 5 opções (auto_approve/reject/manual_review/request_documents/notification)',
        descField: 'Textarea defaultValue=selectedRule?.description',
        conditionsCard: {
          wrapper: 'Card border-blue-200 bg-blue-50/50',
          threeFields: '[Field Select 4 opções (helena_score/helena_red_flags/document_count/time_in_queue), Operator Select 5 opções (equals/not_equals/greater_than/less_than/contains), Value Input]',
          addButton: 'Button outline "Adicionar Condição" Plus — gap: SEM onClick',
        },
        actionsCard: {
          wrapper: 'Card border-green-200 bg-green-50/50',
          actionTypeSelect: '5 opções (set_status/send_notification/assign_analyst/request_document/add_flag)',
          gap: 'NÃO mostra os parâmetros da action (parameters object) — só tipo',
          addButton: 'Button outline "Adicionar Ação" Plus — gap: SEM onClick',
        },
        footer: 'Button outline "Cancelar" + SimulatedActionButton "Salvar Regra" CheckCircle2 actionLabel="Regra salva com sucesso" onSimulatedAction=closeEditor',
        gap: 'Editor é majoritariamente VISUAL — só Cancel/SimulatedSave funcionam, todos add buttons SEM onClick — não persiste regra real',
      },
    },

    // ==========================================================================
    // SUB-DOC #5 — FormLinkGenerator
    // ==========================================================================
    formLinkGeneratorMicroscopic: {
      role: 'Gerador de URLs externos para questionários compliance — clientes preenchem sem login prévio',

      headerInfoCard: {
        wrapper: 'Card border-blue-200 + gradient blue-50→white',
        iconBox: '12x12 rounded-xl bg-blue-100 + Link2 6x6 blue-600',
        title: '"Link do Formulário de Compliance"',
        description: '"Gere links únicos para enviar aos clientes preencherem o questionário de compliance. Os clientes podem acessar e preencher o formulário sem precisar criar conta previamente. Após a submissão, eles entrarão automaticamente na fila de análise."',
      },

      twoTabs: {
        generate: { icon: 'Sparkles', label: 'Gerar Novo Link' },
        history: { icon: 'Clock', label: 'Links Gerados' },
      },

      generateTab: {
        layoutGrid: 'grid lg:2 gap-6 — left: form / right: result+how-it-works',

        formCardLeft: {
          fourFormTypes: [
            'kyc_full: "KYC Completo (Pix + Cartão)" — "Questionário completo para operação com todos os meios"',
            'kyc_pix: "KYC Pix Only" — "Questionário simplificado para operação apenas com Pix"',
            'kyc_card: "KYC Cartão" — "Questionário para operação com cartão de crédito"',
            'kyb_enterprise: "KYB Enterprise" — "Questionário completo para grandes empresas"',
          ],
          fields: [
            'linkName Input "Ex: Campanha Janeiro, Parceiro ABC..." (CONTROLLED via useState)',
            'selectedFormType Select com 4 opções — render label bold + description xs',
            'hasExpiration Switch + (conditional) Input type=date',
            'hasMaxUses Switch + (conditional) Input type=number "Ex: 100"',
            'utmSource Input "Ex: email, whatsapp, parceiro_xyz"',
          ],
          ctaButton: 'Button bg-#2bc196 "Gerar Link" Link2 — onClick=handleGenerateLink FUNCIONAL',
        },

        handleGenerateLinkFunction: {
          generates: '`lnk_${Date.now()}` ID + URL random Math.random().toString(36).substr(2,9) + short URL substr(2,6)',
          fields: 'name=linkName||"Link sem nome" / form_type=selectedFormType / created_date=ISO split[0] / expires_at=hasExpiration?expirationDate:null / max_uses=hasMaxUses?parseInt(maxUses):null / status=active',
          toast: 'sonner toast.success "Link gerado com sucesso!"',
          state: 'setGeneratedLink(newLink) — guarda apenas o último gerado, não persiste no histórico',
          gap: 'utmSource é state mas NÃO inclui no objeto generatedLink — desperdiçado',
        },

        rightSideConditional: {
          ifGenerated: {
            successCard: 'Card border-green-200 bg-green-50/50 — header "Link Gerado com Sucesso!" Check 5x5',
            twoLinkInputs: [
              'Link Completo Input readOnly + Button copy — handleCopyLink(generatedLink.url, "full")',
              'Link Curto Input readOnly + Button copy — handleCopyLink(generatedLink.short_url, "short")',
            ],
            copyFeedback: 'copiedId state — Check green se id matches, Copy default — reset 2000ms timeout',
            threeShareButtons: [
              'QR Code (gap: SEM onClick — não gera QR real)',
              'Enviar por Email (gap: SEM onClick)',
              'WhatsApp (gap: SEM onClick)',
            ],
          },
          ifNotGenerated: {
            placeholderCard: 'Card border-dashed — center py-12 — circular bg-slate-100 16x16 + Link2 8x8 slate-400 + "Nenhum link gerado" + "Configure as opções e clique em \\"Gerar Link\\""',
          },
        },

        howItWorksCard: {
          fourSteps: [
            '1 (blue circle): Gere o link — "Escolha o tipo de formulário e configure as opções"',
            '2 (blue): Envie ao cliente — "Por email, WhatsApp ou qualquer canal"',
            '3 (blue): Cliente preenche — "Sem necessidade de criar conta antes"',
            '4 (GREEN circle, sucesso): Entra na fila — "A submissão aparece automaticamente na Fila de Compliance"',
          ],
        },
      },

      historyTab: {
        threeMockGeneratedLinks: [
          'lnk_001: "Campanha Q1 2026" / kyc_full / 45 usos sem max / criado 2026-01-15 expira 2026-03-31 / active',
          'lnk_002: "Parceiro XYZ" / kyc_pix / 12/100 usos / criado 2026-01-20 sem expiração / active',
          'lnk_003: "Evento Fintech 2026" / kyb_enterprise / 78 usos sem max / criado 2026-01-10 expirou 2026-01-25 / EXPIRED',
        ],
        renderEach: 'flex items-center justify-between p-4 border — left: iconBox 10x10 + FileText + name+getStatusBadge + short_url + 3 metas (Users+uses+/max?, Clock+criado, "Expira em" se exists) — right: 3 Buttons',
        rightButtons: [
          'Copy/Check button — onClick=handleCopyLink(short_url, link.id) FUNCIONAL — disabled={status!=="active"}',
          'Eye button — gap: SEM onClick',
          'Settings button — gap: SEM onClick',
        ],
        getStatusBadgeBinary: 'apenas 2 estados: active(green) ou expired(slate) — sem suspended/disabled',
      },
    },

    // ==========================================================================
    // SUB-DOC #6 — RestComponentsBriefly (5 não documentados em microscopia)
    // ==========================================================================
    fiveRemainingComponents: {
      revalidationManager: 'components/admin-interno/compliance/RevalidationManager.jsx — Gestão de revalidação periódica de KYC (não detalhado nesta análise)',
      specialAnalysisHub: 'components/admin-interno/compliance/SpecialAnalysisHub.jsx — Hub para análises especiais (PEP, Sanções, etc.)',
      questionnaireManager: 'components/admin-interno/compliance/QuestionnaireManager.jsx — Editor visual de questionários compliance',
      documentsRepository: 'components/admin-interno/compliance/DocumentsRepository.jsx — Repositório central de documentos KYC',
      auditHistory: 'components/admin-interno/compliance/AuditHistory.jsx — Histórico imutável de ações de compliance',
    },
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocations: {
      manualReviewQueue: 'components/admin-interno/compliance/ManualReviewQueue.jsx (557 linhas)',
      allSubmissionsList: 'components/admin-interno/compliance/AllSubmissionsList.jsx (691 linhas)',
      helenaTraining: 'components/admin-interno/compliance/HelenaTraining.jsx (216 linhas)',
      rulesAndWorkflows: 'components/admin-interno/compliance/RulesAndWorkflows.jsx (369 linhas)',
      formLinkGenerator: 'components/admin-interno/compliance/FormLinkGenerator.jsx (400 linhas)',
    },

    backendIntegration: {
      manualReviewQueue: 'NENHUMA — mockSubmissions hardcoded (3 itens)',
      allSubmissionsList: 'NENHUMA — allSubmissions hardcoded (5 itens)',
      helenaTraining: 'NENHUMA — performanceData + trainingStats hardcoded',
      rulesAndWorkflows: 'NENHUMA — mockRules hardcoded (4 itens) + setRules state local',
      formLinkGenerator: 'NENHUMA — generatedLinks hardcoded (3 itens) + handleGenerateLink usa Math.random',
    },

    componentStateMap: {
      manualReviewQueue: 'searchTerm, filterScore, selectedSubmission, analystNotes (Textarea), escalationModalOpen, documentViewerOpen, selectedDocument',
      allSubmissionsList: 'searchTerm, filterStatus, filterType, selectedSubmission, currentPage (paginação)',
      helenaTraining: 'isRetraining (declarado mas NÃO USADO no JSX — gap)',
      rulesAndWorkflows: 'rules, editorOpen, selectedRule, visualizerOpen',
      formLinkGenerator: 'activeTab, selectedFormType, linkName, hasExpiration, expirationDate, hasMaxUses, maxUses, utmSource, copiedId, generatedLink',
    },

    importedButUnused: {
      manualReviewQueue: ['useQuery', 'base44', 'ScrollArea (utilizado)', 'date-fns format', 'date-fns ptBR'],
      allSubmissionsList: ['MoreHorizontal', 'AlertTriangle', 'Calendar', 'ExternalLink', 'Filter', 'Download (usado mas botão SEM onClick)'],
      helenaTraining: ['Progress', 'AlertTriangle', 'Cpu', 'Zap'],
      rulesAndWorkflows: ['Settings'],
      formLinkGenerator: ['Share2', 'ExternalLink'],
    },

    knownGapsByComponent: {
      manualReviewQueue: [
        'TODOS os 3 botões finais SEM onClick: Solicitar Documentos / Reprovar / Aprovar',
        'analystNotes Textarea SEM submit',
        'Tab "Dados do Cliente" e "Histórico" são PLACEHOLDERS literais',
        'documentType fallback "CNH" hardcoded',
        'Filter "Mais filtros" Button SEM onClick',
        'date-fns importado mas NÃO usado',
        'useQuery+base44 importados mas NÃO usados — diferença com ComplianceQueue (que tem comentário explicativo) — aqui SEM comentário',
        'mockSubmissions tem helena_justification de tamanho VARIÁVEL (sub001 35+ linhas, sub002 15 linhas, sub003 20 linhas) — UI deve scrollar',
      ],
      allSubmissionsList: [
        'Botão "Exportar" Download SEM onClick',
        'Tab Documentos: Botão "Ver" Eye SEM onClick',
        'Filter Status NÃO inclui pending/ai_analyzing/ai_approved/ai_rejected — mas getStatusBadge SUPORTA',
        'getStatusBadge tem 8 keys mas só 5 são filtráveis',
        'Pagination com 5 itens e 10/page = sempre 1 página — paginação inútil com mocks atuais',
        'Timeline tab NÃO mostra atribuições intermediárias',
        'questionnaire_data render genérico via Object.entries — endereço {logradouro/numero/bairro/cidade/estado/cep} aparece como JSON.stringify (feio)',
        'sub002 decision_date 3 segundos após submit — irrealista mas indica auto-approve',
      ],
      helenaTraining: [
        'isRetraining state declarado mas NÃO usado no JSX',
        'trainingStats.regulations text "Circular 3.978, Lei 9.613/98, CVM 617" NÃO É EXIBIDO (só "Completo")',
        'Conflito frequência: card diz "diário" mas dates indicam 7 dias entre treinamentos',
        'KPIs hardcoded como "96%/94%/95%" mas performanceData.Jan = "accuracy 96, recall 94, f1 95" — inconsistência se data muda',
        '4 Capacidades hardcoded inline (não vem de array externo)',
        'Sem comparação A/B — apenas mensagem "Modo: Incremental com validação A/B"',
      ],
      rulesAndWorkflows: [
        'Pause/Play e Trash2 buttons SEM onClick (só Edit funcional)',
        'Editor "Adicionar Condição" e "Adicionar Ação" buttons SEM onClick',
        'DecisionFlowVisualizer só recebe actions[0] — múltiplas actions IGNORADAS',
        'Editor é majoritariamente visual — SimulatedActionButton só fecha modal, não persiste',
        'Editor fields uncontrolled (defaultValue) — não captura mudanças no state',
        'request_documents e notification types NÃO usados nos 4 mocks (só auto_approve/auto_reject/manual_review)',
        'logic_operator "AND" só presente em rule003 — outras regras com 1 condition não usam — UI não mostra OR alternativo',
      ],
      formLinkGenerator: [
        'utmSource state existe mas NÃO É INCLUÍDO no objeto generatedLink',
        '3 Share Buttons (QR Code/Email/WhatsApp) SEM onClick',
        'Eye/Settings da history SEM onClick',
        'Math.random URL — não validado contra colisões',
        'generatedLink só guarda 1 — links anteriores são perdidos (não vão pra history mock)',
        'history mock fixo + generatedLink novo NÃO concatenam — usuário gera link mas não vê na aba history',
        'getStatusBadge binário (active/expired) — sem suspended/disabled/quota_reached',
        'Switch hasExpiration sem validação — pode gerar link com hasExpiration=true mas expirationDate=""',
        'Toast.success em copy mas Toast.success duplicado em handleGenerateLink — UX repetitivo',
      ],
    },

    crossComponentKnownGaps: [
      'TODOS os 5 componentes usam mocks — sem persistência real',
      'Helena justifications são markdown como <pre> — sem react-markdown rendering (formatação ## headers vira texto raw)',
      'Score badge SEMÂNTICA inconsistente: ManualReviewQueue usa "Baixo Risco/Médio/Alto/Crítico" + score / AllSubmissionsList só score',
      'Documentos status: AllSubmissionsList tem 3 (approved/rejected/pending) mas ManualReviewQueue declara getStatusBadge com mesmas 3 — duplicação',
      'AssignedAnalyst sempre split("@")[0] — quebra se email empresa for "joao.silva@empresa.com.br" → mostra apenas "joao.silva"',
      'Helena_red_flags array livre (string[]) — sem severity/category — todas Badge red uniforme',
    ],

    relationshipsToOtherPages: {
      complianceHub: '/AdminIntCompliance — pai principal — todas estas abas vivem dentro do hub',
      complianceQueue: '/AdminIntComplianceQueue — wrapper standalone',
      complianceReview: '/AdminIntComplianceReview — wrapper para ManualReviewQueue',
      complianceSubmissions: '/AdminIntComplianceSubmissions — wrapper para AllSubmissionsList',
      complianceHelena: '/AdminIntComplianceHelena — wrapper para HelenaTraining',
      complianceRules: '/AdminIntComplianceRules — wrapper para RulesAndWorkflows',
      complianceFormLink: '/AdminIntComplianceFormLink — wrapper para FormLinkGenerator',
      kycAnalysis: '/AdminIntKycAnalysis — drilldown análise individual KYC',
      kycQueue: '/AdminIntKYCQueue — fila legacy possivelmente sobreposta',
      pld: '/AdminIntPLD — relacionada PLD/AML (Section 8 dos questionários)',
    },
  },
};

export default AdminIntComplianceComponentsDoc;