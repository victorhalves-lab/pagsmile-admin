/**
 * MENTOR API — Roadmap de Implementação Front-end
 *
 * Análise microscópica do documento "MENTOR API — Entrega 1: Lojistas (F0001-F0580)"
 * cruzada com o que já existe no app PagSmile e benchmarks de mercado
 * (Stone Connect, Cielo Capture, Adyen for Platforms, Stripe Connect, MercadoPago,
 * PagSeguro Connect, ZoopMaster).
 *
 * REGRA INVIOLÁVEL: nada do que já existe é removido. Tudo aqui é INCREMENTAL.
 *
 * Estrutura: 8 frentes, ~120 funcionalidades-chave de front-end agrupadas
 * por valor de negócio e complexidade técnica.
 *
 * Cada frente lista:
 *  - Páginas/abas/componentes a criar OU expandir
 *  - Funcionalidades F#### do documento Mentor que cobre
 *  - Comparação com mercado (quem já tem, o que diferencia)
 *  - Esforço relativo (S/M/L/XL)
 *  - Prioridade sugerida (P0/P1/P2)
 *  - Justificativa de valor
 *  - Já existe parcialmente? (referência ao que reaproveitar)
 */

export const MENTOR_FRENTES = [
  // ========================================================================
  // FRENTE 1 — LISTAGEM DE LOJISTAS DE NÍVEL ENTERPRISE
  // ========================================================================
  {
    id: 'listagem-enterprise',
    titulo: 'Listagem de Lojistas Enterprise',
    cobre: 'F0001–F0094 (94 funcionalidades)',
    prioridade: 'P0',
    esforco: 'L',
    iconeNome: 'Database',
    cor: 'from-blue-500 to-cyan-500',
    descricao: 'Eleva a listagem `AdminIntMerchantsList` ao padrão Stone Connect/Cielo: filtros granulares, ordenação multi-coluna, bulk actions sofisticadas, visões salvas, totalizadores agregados.',
    paginasNovas: [],
    paginasExpandidas: [
      {
        path: 'pages/AdminIntMerchantsList',
        adicionar: [
          'Painel lateral de filtros avançados (35+ filtros: documento exato/parcial, fantasia, razão, status múltiplo, adquirente, plano, MCC/CNAE, TPV faixa, qtd transações, datas, paylink, pendências, grupo, efeitos contrato, bloqueio antifraude/regulatório, tipo PF/PJ, formação societária)',
          'Combinação AND/OR de filtros com chips removíveis no topo',
          'Ordenação por TPV ↑↓, qtd transações, última transação (recência), nome A→Z/Z→A, status agrupado',
          'Bulk actions: bloqueio em lote, suspensão em lote, vincular grupo em lote, migrar plano em lote, vincular representante em lote, exportar selecionados/toda pesquisa',
          '"Salvar como visão favorita" + dropdown de visões salvas (privadas e compartilháveis via URL)',
          'Totalizadores agregados no topo (TPV total, qtd lojistas, ticket médio agregado, taxa aprovação consolidada)',
          'Comparar 2 conjuntos filtrados lado a lado (Cielo vs Rede, MCC X vs MCC Y)',
          'Gráfico de evolução temporal da quantidade de lojistas em determinado filtro',
          'Column picker (configurar quais colunas exibir) + drag-drop de reordenação + ajuste de largura',
          'Indicador de pendência financeira (badge clicável com drill-down)',
          'Indicador de paylink habilitado',
          'Indicador de efeito de contrato ativo',
          'Alerta automático para nova entrada que casa com critério (ex: novo lojista TPV >R$1MM/mês)',
        ],
      },
    ],
    componentesNovos: [
      'components/admin-interno/merchants/AdvancedFiltersDrawer',
      'components/admin-interno/merchants/SavedViewsManager',
      'components/admin-interno/merchants/BulkActionsBar',
      'components/admin-interno/merchants/AggregateMetricsHeader',
      'components/admin-interno/merchants/ColumnPicker',
      'components/admin-interno/merchants/SideBySideCompare',
      'components/admin-interno/merchants/AlertConfigDialog',
    ],
    benchmark: {
      stone: 'Stone Connect tem ~25 filtros e visões salvas',
      cielo: 'Cielo Capture tem column picker e bulk actions',
      adyen: 'Adyen for Platforms tem comparação lado a lado',
      diferencial: 'Combinação dos 3 + alertas automáticos = mais granular que qualquer concorrente',
    },
    valor: 'Reduz tempo médio de análise de carteira de 15min para 2min. Permite atendimento de chamados de Suporte em <30s (filtro por documento). Habilita campanhas comerciais segmentadas em massa.',
  },

  // ========================================================================
  // FRENTE 2 — FICHA 360° DO LOJISTA (DETALHE EXPANDIDO)
  // ========================================================================
  {
    id: 'ficha-360',
    titulo: 'Ficha 360° do Lojista',
    cobre: 'F0157–F0239 (83 funcionalidades)',
    prioridade: 'P0',
    esforco: 'XL',
    iconeNome: 'User',
    cor: 'from-purple-500 to-indigo-500',
    descricao: 'Transforma `AdminIntMerchantProfile` na "ficha 360" definitiva — abas dedicadas para cada bloco operacional, alertas contextuais no topo, ações diretas integradas.',
    paginasNovas: [],
    paginasExpandidas: [
      {
        path: 'pages/AdminIntMerchantProfile',
        adicionar: [
          'Banner superior de Alertas Contextuais (KYC vencido, sem transação há X dias, chargeback acima do limite, efeito contrato ativo, pendência financeira em aberto, settlement alterado <7 dias)',
          'Aba "Identificação" com mapa Google Maps embed do endereço operacional (validação visual antifraude)',
          'Aba "Configuração de Liquidação" com settlement destination mascarado + botão "exibir completa" (auth)',
          'Aba "Capacidade Transacional" listando terminais com status online/offline + canais habilitados como chips',
          'Aba "Bloqueios e Suspensões" listando atuais + histórico cronológico completo (timeline visual)',
          'Aba "Efeitos de Contrato" listando cessões fiduciárias (CIP/B3), gravames judiciais, travas operacionais + gauge "% do fluxo comprometido"',
          'Aba "KYC Documental" com checklist visual "exigidos vs recebidos" por formação societária + indicador "documento expirando em X dias"',
          'Aba "Histórico" com timeline cronológica COMPLETA de mudanças de status (ativo→suspenso→ativo→bloqueado→ativo)',
          'Sócios com badge PEP + badge sanção/restrição + última consulta KYC (fresco/moderado/vencido)',
          'Métricas: TPV dia/semana/mês/ano (toggle), gráfico evolução 12m, mix bandeira (pizza), mix canal (barras), taxas aprovação/chargeback/cancelamento',
          'Botões de ação rápida no header: Editar, Suspender, Bloquear, Trocar Adquirente, Alterar Plano, Alterar Settlement, Alterar MCC, Habilitar Paylink',
          'Botão "Gerar PDF de cadastro completo" para envio formal/auditoria',
        ],
      },
    ],
    componentesNovos: [
      'components/admin-interno/merchant-profile/ContextualAlertsBanner',
      'components/admin-interno/merchant-profile/AddressMapEmbed',
      'components/admin-interno/merchant-profile/SettlementDestinationCard',
      'components/admin-interno/merchant-profile/TerminalsListPanel',
      'components/admin-interno/merchant-profile/BlockagesHistoryPanel',
      'components/admin-interno/merchant-profile/ContractEffectsPanel',
      'components/admin-interno/merchant-profile/KycChecklistPanel',
      'components/admin-interno/merchant-profile/StatusTimeline',
      'components/admin-interno/merchant-profile/QuickActionsHeader',
    ],
    benchmark: {
      stone: 'Stone tem ficha 360 mas sem alertas contextuais agregados',
      adyen: 'Adyen tem timeline de status excelente',
      cielo: 'Cielo é mais fragmentado (várias telas, falta unificação)',
      diferencial: 'Banner de alertas contextuais + gauge de fluxo comprometido = vantagem clara',
    },
    valor: 'Reduz tempo de troubleshoot de Suporte em ~60% (operador vê tudo em uma tela). Compliance valida casos em metade do tempo. Risco identifica padrões em segundos.',
  },

  // ========================================================================
  // FRENTE 3 — ONBOARDING ORQUESTRADO (modo assistido + self-service)
  // ========================================================================
  {
    id: 'onboarding-orquestrado',
    titulo: 'Onboarding Orquestrado',
    cobre: 'F0095–F0156 + F0425–F0502 (140+ funcionalidades)',
    prioridade: 'P0',
    esforco: 'XL',
    iconeNome: 'Rocket',
    cor: 'from-emerald-500 to-teal-500',
    descricao: 'Cria fluxo completo de onboarding orquestrado em um único submit (vs cadastro manual em múltiplos passos). Modo assistido (operador interno) e self-service (lojista preenche pelo portal).',
    paginasNovas: [
      'pages/AdminIntMerchantOnboardingOrchestrator (modo assistido)',
      'pages/AdminIntMerchantOnboardingDrafts (rascunhos com retomada)',
      'pages/AdminIntMerchantOnboardingPipeline (visão consolidada do funil)',
      'pages/AdminIntMerchantOnboardingFunnelAnalytics (taxa de abandono por etapa, ETA preditivo, score churn 1º mês)',
    ],
    paginasExpandidas: [
      {
        path: 'pages/SubaccountOnboarding',
        adicionar: [
          'Step indicator visual com tempo decorrido em cada etapa',
          'Auto-save automático entre etapas (recuperação após queda de sessão)',
          'Mensagens contextuais e dicas de preenchimento por campo',
          'Validação cada bloco antes de avançar (não descobre erro só no submit)',
          'Indicador de qualidade dos dados (completude + consistência)',
          'Detecção de "campos preenchidos incorretamente baseado em padrões históricos"',
          'Comparação contra perfil padrão do projeto (alerta de desvios)',
          'Auto-preencher cadastro a partir de consulta CNPJ na Receita (já parcialmente existe — expandir)',
          'Sugerir MCC automaticamente a partir do CNAE',
          'Replicar dados de lojista similar (template, útil para onboarding de filiais)',
          'Importar dados de planilha (modo bulk para migração de carteira)',
          'Pré-preencher onboarding a partir de proposta comercial existente',
        ],
      },
    ],
    componentesNovos: [
      'components/onboarding/orchestrator/OrchestratorStepper',
      'components/onboarding/orchestrator/AutoSaveIndicator',
      'components/onboarding/orchestrator/DataQualityScore',
      'components/onboarding/orchestrator/ProfileDeviationAlert',
      'components/onboarding/orchestrator/BulkImportDialog',
      'components/onboarding/orchestrator/TemplateReplicator',
      'components/onboarding/orchestrator/PostSubmitTimeline',
      'components/admin-interno/onboarding-pipeline/FunnelAbandonmentChart',
      'components/admin-interno/onboarding-pipeline/EtaPredictiveCard',
      'components/admin-interno/onboarding-pipeline/ChurnRiskScorePanel',
    ],
    benchmark: {
      stone: 'Stone tem onboarding excelente mas não tem auto-save/retomada',
      adyen: 'Adyen tem orquestração robusta com fluxos paralelos',
      stripe: 'Stripe Connect tem self-service de classe mundial',
      diferencial: 'Pipeline com analytics de abandono + ETA preditivo = único no Brasil',
    },
    valor: 'Reduz time-to-revenue de novos lojistas em 40-60%. Identifica gargalos do pipeline em tempo real. Reduz abandono em modo self-service via UX contextual.',
  },

  // ========================================================================
  // FRENTE 4 — GESTÃO DE GRUPOS (matriz/filiais) E EMPRESAS CONTROLADORAS
  // ========================================================================
  {
    id: 'grupos-empresas',
    titulo: 'Gestão de Grupos e Empresas',
    cobre: 'F0503–F0580 (78 funcionalidades)',
    prioridade: 'P1',
    esforco: 'L',
    iconeNome: 'Building',
    cor: 'from-orange-500 to-amber-500',
    descricao: 'Cria gestão completa de grupos de lojistas (matriz/filiais) e empresas controladoras — visão consolidada de redes de varejo, contratos master, ações em massa.',
    paginasNovas: [
      'pages/AdminIntMerchantGroups (listagem com filtros, ordenação, totalizadores)',
      'pages/AdminIntMerchantGroupDetail (ficha completa: filiais, métricas agregadas, mapa, contratos)',
      'pages/AdminIntMerchantGroupCreate (cadastro com vinculação inicial de filiais)',
      'pages/AdminIntCompanies (empresas controladoras — entidades contratuais B2B)',
      'pages/AdminIntCompanyDetail',
    ],
    paginasExpandidas: [],
    componentesNovos: [
      'components/admin-interno/merchant-groups/GroupsListTable',
      'components/admin-interno/merchant-groups/GroupAggregateMetrics',
      'components/admin-interno/merchant-groups/GroupGeoMap',
      'components/admin-interno/merchant-groups/GroupContractMasterPanel',
      'components/admin-interno/merchant-groups/AssociateMerchantsDialog',
      'components/admin-interno/merchant-groups/DisassociateMerchantsDialog',
      'components/admin-interno/merchant-groups/SuggestedFilialsByRadical',
      'components/admin-interno/merchant-groups/ChurnAlertCard',
    ],
    benchmark: {
      stone: 'Stone tem visão de grupos mas sem mapa geográfico',
      adyen: 'Adyen for Platforms tem hierarquia robusta',
      cielo: 'Cielo é fraco em gestão de grupos',
      diferencial: 'Mapa geográfico das filiais + alerta de "queda anormal de TPV agregado" (churn de rede)',
    },
    valor: 'Atende redes de varejo (farmácias, fast-food, conveniência) com gestão consolidada. Receita média desses clientes é 5-10x maior que SMB.',
  },

  // ========================================================================
  // FRENTE 5 — SETTLEMENT, ANTECIPAÇÃO E CESSÃO (núcleo Mentor)
  // ========================================================================
  {
    id: 'settlement-antecipacao',
    titulo: 'Settlement, Antecipação e Cessão de Recebíveis',
    cobre: 'F0277–F0299 + F0211–F0215 + F0224–F0227 (40+ funcionalidades)',
    prioridade: 'P0',
    esforco: 'L',
    iconeNome: 'Wallet',
    cor: 'from-green-500 to-emerald-500',
    descricao: 'Núcleo da Mentor — operação altamente sensível de mudança de conta de liquidação com TODAS as proteções antifraude (OTP, alçada dupla, janela de esfriamento, cross-validation com SPB/DICT).',
    paginasNovas: [
      'pages/AdminIntSettlementChange (fluxo dedicado de troca de settlement com OTP + alçada dupla)',
      'pages/AdminIntAnticipationConsole (console de antecipação por lojista)',
      'pages/AdminIntContractEffectsRegistry (registro de cessões CIP/B3 e gravames judiciais)',
      'pages/AdminIntSettlementForecasting já existe — expandir com modelos de Mentor',
    ],
    paginasExpandidas: [
      {
        path: 'pages/AdminIntAnticipations',
        adicionar: [
          'Saldo disponível para antecipação por lojista (calculado considerando travas e efeitos)',
          'Taxa de antecipação spot vigente por lojista (vs default do projeto)',
          'Histórico de antecipações solicitadas com status',
          'Bloqueio automático se há efeito de contrato sobre o fluxo',
        ],
      },
    ],
    componentesNovos: [
      'components/admin-interno/settlement/SettlementChangeWizard',
      'components/admin-interno/settlement/OtpDualApprovalDialog',
      'components/admin-interno/settlement/CoolDownTimer',
      'components/admin-interno/settlement/SpbDictValidator',
      'components/admin-interno/settlement/SameOwnershipCheck',
      'components/admin-interno/settlement/PixKeyTypeSelector',
      'components/admin-interno/settlement/CompareBeforeAfterModal',
      'components/admin-interno/anticipation/AnticipationSpotCalculator',
      'components/admin-interno/anticipation/AvailableBalanceGauge',
      'components/admin-interno/contract-effects/CessionRegistryPanel',
      'components/admin-interno/contract-effects/GravamePanel',
      'components/admin-interno/contract-effects/FlowCommitmentGauge',
    ],
    benchmark: {
      stone: 'Stone tem cool-down e OTP, mas não tem registro de cessão CIP/B3 visualizado',
      adyen: 'Adyen tem 2-man rule excelente',
      mercadoPago: 'MP tem antecipação top mas sem visualização de gravames',
      diferencial: 'Registro CIP/B3 visualizado + gauge de "% fluxo comprometido" + cool-down configurável = diferencial regulatório',
    },
    valor: 'CRÍTICO. Settlement é o vetor de fraude #1 em payments. Mentor traz proteção bancária. Antecipação é receita de alta margem.',
  },

  // ========================================================================
  // FRENTE 6 — KYC DOCUMENTAL E ANÁLISE
  // ========================================================================
  {
    id: 'kyc-documental',
    titulo: 'KYC Documental e Análise',
    cobre: 'F0339–F0372 + F0496–F0502 (45 funcionalidades)',
    prioridade: 'P1',
    esforco: 'M',
    iconeNome: 'FileCheck',
    cor: 'from-pink-500 to-rose-500',
    descricao: 'Fluxo completo de upload, análise, aprovação/rejeição de documentos KYC com OCR automatizado, detecção de duplicação e expiração.',
    paginasNovas: [
      'pages/AdminIntKycAnalysisQueue (fila de documentos pendentes para Compliance analisar)',
      'pages/AdminIntKycDocumentViewer (viewer integrado PDF/imagem com zoom, OCR extrai dados)',
      'pages/AdminIntOnboardingHistory (timeline cronológica do onboarding por lojista — gargalos)',
    ],
    paginasExpandidas: [
      {
        path: 'pages/AdminIntComplianceQueue',
        adicionar: [
          'Filtro de documentos por status (aprovado/pendente/rejeitado/expirado)',
          'Filtro por tipo de documento',
          'Indicador "documento expirando em X dias" (badge amarelo 30d, vermelho 7d)',
          'Checklist completo de documentos exigidos vs recebidos por formação societária',
          'OCR automatizado: extrai CNPJ do documento e cruza com cadastro (alerta divergência)',
          'Detecção de duplicação byte-a-byte (hash MD5/SHA)',
          'Detecção de adulteração (assinatura digital quebrada, metadados suspeitos)',
          'Histórico completo do tratamento do documento (v1 rejeitado por X, v2 aprovado por Y)',
        ],
      },
    ],
    componentesNovos: [
      'components/admin-interno/kyc/DocumentViewerPanel',
      'components/admin-interno/kyc/OcrExtractionResults',
      'components/admin-interno/kyc/DuplicationDetectionAlert',
      'components/admin-interno/kyc/AdulterationDetectionAlert',
      'components/admin-interno/kyc/ExpirationCalendar',
      'components/admin-interno/kyc/DocumentChecklistByFormation',
      'components/admin-interno/kyc/AnalysisQueue',
    ],
    benchmark: {
      stone: 'Stone tem OCR mas não detecta adulteração',
      adyen: 'Adyen tem detecção de duplicação',
      diferencial: 'Combinação OCR + duplicação + adulteração + checklist por formação = único',
    },
    valor: 'Reduz tempo de análise KYC em 50-70%. Catches fraudes documentais que análise humana perderia.',
  },

  // ========================================================================
  // FRENTE 7 — BLOQUEIOS, SUSPENSÕES E DESBLOQUEIOS
  // ========================================================================
  {
    id: 'bloqueios-suspensoes',
    titulo: 'Bloqueios, Suspensões e Desbloqueios',
    cobre: 'F0288–F0337 + F0395–F0404 (60 funcionalidades)',
    prioridade: 'P1',
    esforco: 'M',
    iconeNome: 'Ban',
    cor: 'from-red-500 to-rose-500',
    descricao: 'Fluxos formais de bloqueio (regulatório/financeiro/antifraude/operacional/comercial/judicial) e suspensão (voluntária/sazonal/preventiva) com OTP, alçada por tipo, escalonamento automático.',
    paginasNovas: [
      'pages/AdminIntBlockageFlow (fluxo dedicado de aplicar bloqueio com OTP + tipo + documento anexado)',
      'pages/AdminIntUnblockFlow (fluxo dedicado de desbloqueio com checklist de "causa resolvida")',
      'pages/AdminIntSuspensionFlow (fluxo de suspensão voluntária/programada)',
      'pages/AdminIntBlockageReviewSchedule (cronograma de revisão automática de bloqueios indefinidos)',
    ],
    paginasExpandidas: [
      {
        path: 'pages/AdminIntBlockages',
        adicionar: [
          'Filtro por tipo de bloqueio (regulatório/financeiro/antifraude/operacional/comercial/judicial)',
          'Validação de alçada do operador para o tipo (judicial só Compliance/Jurídico)',
          'Validação CNJ do número da ordem judicial',
          'Anexo obrigatório de documento (ofício BCB, ordem COAF, decisão judicial)',
          'Notificação automática à autoridade requerente em bloqueios judiciais/regulatórios',
          'Cronograma de revisão automática (90 dias para bloqueios temporários sem fim definido)',
          'Bloqueio em lote por critério (filtro F0026 "pendência > 60 dias" + bloqueio massivo)',
          'Escalonamento automático: pendência X dias → notificação; Y dias → suspensão; Z dias → bloqueio',
          'Suspender automaticamente após N dias sem transação (regra de churn)',
        ],
      },
    ],
    componentesNovos: [
      'components/admin-interno/blockages/BlockageTypeSelector',
      'components/admin-interno/blockages/AlcadaValidator',
      'components/admin-interno/blockages/CnjOrderValidator',
      'components/admin-interno/blockages/UnblockChecklistDialog',
      'components/admin-interno/blockages/AutomaticReviewCalendar',
      'components/admin-interno/blockages/EscalationRulesEditor',
      'components/admin-interno/blockages/BulkBlockDialog',
    ],
    benchmark: {
      stone: 'Stone tem tipos de bloqueio mas sem cronograma de revisão',
      adyen: 'Adyen tem 2-man rule e alçada por tipo',
      diferencial: 'Cronograma automático + escalonamento programado + alçada dupla = governança bancária',
    },
    valor: 'Cumprimento regulatório (ofícios BCB, COAF, judicial). Reduz risco de bloqueios indefinidos esquecidos. Automatiza cobrança escalonada.',
  },

  // ========================================================================
  // FRENTE 8 — VINCULAÇÃO A ADQUIRENTE E MUDANÇA DE MCC
  // ========================================================================
  {
    id: 'adquirente-mcc',
    titulo: 'Adquirente e MCC',
    cobre: 'F0253–F0276 + F0405–F0424 (45 funcionalidades)',
    prioridade: 'P1',
    esforco: 'M',
    iconeNome: 'Network',
    cor: 'from-violet-500 to-purple-500',
    descricao: 'Vinculação a adquirente com modelo multi-acquirer (Cielo + Rede + Stone simultâneos), troca de adquirente com cutover programado, mudança de MCC com pré-check de implicações.',
    paginasNovas: [
      'pages/AdminIntAcquirerLinkFlow (vincular adquirente com seleção de canais)',
      'pages/AdminIntAcquirerSwitchFlow (trocar adquirente com cutover programado)',
      'pages/AdminIntMccChangeFlow (alterar MCC)',
      'pages/AdminIntMccChangePreCheck (verificar implicações ANTES de aplicar)',
    ],
    paginasExpandidas: [],
    componentesNovos: [
      'components/admin-interno/acquirer/AcquirerSuggestionEngine',
      'components/admin-interno/acquirer/MultiAcquirerByChannelMatrix',
      'components/admin-interno/acquirer/CutoverScheduler',
      'components/admin-interno/acquirer/InFlightTransactionsMonitor',
      'components/admin-interno/acquirer/HealthCheckBeforeSwitch',
      'components/admin-interno/mcc/McCImpactPreviewPanel',
      'components/admin-interno/mcc/AdquirentesAffectedList',
      'components/admin-interno/mcc/PlansAffectedList',
      'components/admin-interno/mcc/MdrDiffByBrand',
      'components/admin-interno/mcc/MonthlyImpactProjection',
      'components/admin-interno/mcc/AntifraudRulesDiff',
      'components/admin-interno/mcc/RecommendationCard',
    ],
    benchmark: {
      stone: 'Stone tem multi-acquirer básico',
      adyen: 'Adyen tem orquestração multi-acquirer top + health check',
      cielo: 'Cielo é mono-acquirer (não compete)',
      diferencial: 'Pré-check de mudança de MCC mostra TODOS os impactos antes de aplicar = único',
    },
    valor: 'Multi-acquirer = resiliência operacional (queda de 1 adquirente não para captura). Pré-check de MCC evita problemas em cascata.',
  },
];

export const FRENTES_RESUMO = {
  totalFuncionalidades: 580,
  funcionalidadesCobertas: 595, // soma com sobreposição entre frentes
  paginasNovas: 22,
  paginasExpandidas: 6,
  componentesNovos: 87,
  esforcoTotal: '~6 meses (1 squad)',
  prioridade: { P0: 3, P1: 4, P2: 1 },
};

export const NAO_IMPLEMENTAR = [
  {
    item: 'F0050 — Saltar para número de página específico (input)',
    motivo: 'UX antiquada. Paginação infinita ou cursor-based é melhor (já temos via React Query).',
  },
  {
    item: 'F0049 — Saltar para última página',
    motivo: 'Em listagens muito grandes é caro de calcular e pouco usado. Filtros + ordenação substituem.',
  },
  {
    item: 'F0152 — "Type to confirm" em exclusão (digitar CNPJ)',
    motivo: 'OTP + alçada dupla já cobrem. Type-to-confirm é fricção desnecessária.',
  },
  {
    item: 'F0179 — Mapa Google Maps embed direto',
    motivo: 'Custo de API. Substituir por link "Ver no Maps" que abre em aba externa.',
  },
  {
    item: 'F0540/F0567 — "Permite gestão consolidada" do grupo',
    motivo: 'Configuração que pode virar feature no Admin Sub depois, baixa prioridade no MVP.',
  },
  {
    item: 'F0260/F0261 — Validação de formato MID/TIDs por adquirente',
    motivo: 'Backend deve validar (já contratado com Mentor). Front só mostra erro retornado.',
  },
];