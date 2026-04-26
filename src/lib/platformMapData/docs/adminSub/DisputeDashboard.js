// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /DisputeDashboard
// ============================================================================
// Arquivo dedicado, fidelidade absoluta ao código real de pages/DisputeDashboard.jsx.
// Cada gauge, cada threshold, cada KPI calculado, cada query, cada quick-action,
// cada cor, cada lógica de negócio bandeira-específica — documentado individualmente.
// ============================================================================

export const DisputeDashboardDoc = {
  pageId: 'DisputeDashboard',
  pagePath: '/DisputeDashboard',
  module: 'Disputas',
  parentPage: null,

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Painel-cockpit central do módulo de Disputas — apresenta em UMA tela o estado de saúde da operação contra chargebacks: ratios regulatórios das bandeiras, KPIs de volume/valor, tendência histórica, status de compliance Visa/Mastercard, atividade do agente IA e atalhos para as 3 áreas críticas (Pré-Chargebacks, Chargebacks, Configuração do Agente).',

    whyDisputesIsCritical: {
      financialImpact:
        'Cada chargeback custa MUITO mais que o valor disputado: além do estorno integral, há fee de US$15-50 cobrado pelo adquirente, possível perda do produto/serviço já entregue, e o pior — entrada em programas de monitoramento (VDMP/VFMP/ECM/EFM) com multas mensais de até US$25k.',
      regulatoryRisk:
        'Visa e Mastercard impõem THRESHOLDS HARD: se ratio CB > 0.9% (Visa) ou > 1.0% (Mastercard) por 2-3 meses consecutivos → entra em programa. Se persiste → suspensão da capacidade de processar essa bandeira. Para um e-commerce, isso é game over.',
      operationalRisk:
        'Disputas exigem AÇÃO em janelas curtas: pré-chargeback (Ethoca/Verifi) tem 24-72h para reembolsar e evitar virar CB. Chargeback formal tem 7-14 dias para responder com evidências. Perder o prazo = perda automática.',
    },

    threeLayersOfDefense: {
      layer1_prevention: {
        what: 'Pré-Chargebacks (alertas Ethoca/Verifi)',
        action: 'Reembolsar proativamente ANTES de virar CB formal — paga a transação mas evita o CB no histórico',
        kpiTracked: 'preventionRate (% de pré-CBs que foram reembolsados a tempo)',
        idealRange: '> 70% — alguns ficam em "ignore" estrategicamente',
      },
      layer2_contestation: {
        what: 'Chargebacks formais já abertos',
        action: 'Submeter evidências (recibo, AVS, IP, log de entrega) na janela de 7-14 dias',
        kpiTracked: 'winRate (% de contestações ganhas)',
        idealRange: '> 50% é considerado bom — depende muito da qualidade das evidências',
      },
      layer3_compliance: {
        what: 'Monitoramento contínuo de ratios vs thresholds das bandeiras',
        action: 'Manter ratio abaixo de Early Warning (0.65% Visa, 0.8% MC) — ANTES de chegar em Standard/Excessive',
        kpiTracked: 'visaRatio, mcRatio, visaFraudRatio, mcFraudRatio',
        idealRange: 'Verde (< Early Warning) sempre; Amarelo é alerta; Vermelho é crise',
      },
    },

    coreCapabilities: [
      'Card "Indicadores Críticos de Ratio" — 4 gauges com thresholds Visa/MC para CB e Fraude',
      'Status agregado em badge no header do card (Normal/Alerta/Em Programa) — semáforo executivo',
      'KPIs operacionais em DisputeKPICards (volume aberto, valor aberto, em contestação, win rate, etc.)',
      'Gráfico de tendência de ratio nos últimos 6 meses com linhas de threshold sobrepostas',
      'Visão geral do compliance Visa/Mastercard com alertas por bandeira',
      'Resumo do agente IA (Dispute Manager) — estatísticas de uso e toggle on/off direto',
      '3 quick actions coloridos para Pré-Chargebacks (laranja), Chargebacks (vermelho), Agente IA (roxo)',
    ],

    whoUsesIt: [
      'Head de Risco: monitora ratios diariamente e age antes de cair em programa',
      'Time Financeiro: estima provisão de R$ retidos para disputas em curso',
      'Time Anti-Fraude: vê se ratio de fraude (VFMP/EFM) está controlado',
      'CEO/COO: status executivo da exposição ao risco regulatório',
    ],

    crucialContextRegulatoryPrograms: {
      vdmp: 'Visa Dispute Monitoring Program — gatilho ratio CB > 0.9% E volume > 100 disputas/mês',
      vfmp: 'Visa Fraud Monitoring Program — gatilho fraud ratio > 0.75% E volume > $75k em fraude',
      ecm: 'Mastercard Excessive Chargeback Merchant — gatilho > 1.0% por 2 meses consecutivos',
      efm: 'Mastercard Excessive Fraud Merchant — gatilho fraud ratio > 0.5% E volume > $50k',
      whyDualThresholds:
        'Existem 2 níveis: Early Warning (preventivo) e Standard/Excessive (punitivo). Esta dashboard mostra os 2 thresholds para cada gauge.',
    },
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/DisputeDashboard.jsx',
    totalLines: 279,

    imports: {
      react: 'React',
      i18n: 'useTranslation (react-i18next) — usa chaves: disputes.title, common.export, reports.title',
      reactQuery: 'useQuery (3 queries paralelas: disputes, compliance, agentConfig)',
      base44: 'base44.entities.Dispute / ComplianceStatus / DisputeAgentConfig',
      sharedComponents: ['PageHeader (header consistente)'],
      domainComponents: [
        'DisputeRatioGauge (semicírculo gauge com thresholds dual)',
        'DisputeTrendChart (line chart histórico com linhas de threshold)',
        'ComplianceOverview (resumo Visa/MC compliance status)',
        'AgentDashboardSummary (stats + toggle do agente IA)',
        'DisputeKPICards (KPIs em grid)',
      ],
      uiComponents: ['Card+CardContent+CardHeader+CardTitle', 'Badge', 'Button', 'Tabs (importado, não usado)'],
      navigation: ['Link (react-router-dom)', 'createPageUrl from @/utils'],
      lucideIcons: [
        'AlertTriangle — quick action Pré-Chargebacks (laranja)',
        'Shield — badge de status compliance + quick action Chargebacks (vermelho)',
        'TrendingUp — quick action Dispute Manager (roxo)',
        'ArrowRight — seta nos quick actions',
        'RefreshCcw — importado, não usado ativamente',
        'Download — botão de export no header',
        'FileText — botão de relatórios no header',
      ],
    },

    queries: {
      disputes: {
        queryKey: "['disputes']",
        queryFn: "base44.entities.Dispute.list('-created_date', 100)",
        defaultData: '[]',
        purpose: 'Última centena de disputas. Limite 100 — gap se merchant tem volume > 100/dia.',
      },
      complianceData: {
        queryKey: "['compliance']",
        queryFn: 'base44.entities.ComplianceStatus.list()',
        purpose: 'Lista de registros de status por bandeira (Visa CB, Visa Fraude, MC CB, MC Fraude).',
      },
      agentConfigs: {
        queryKey: "['disputeAgentConfig']",
        queryFn: 'base44.entities.DisputeAgentConfig.list()',
        unwrapping: 'agentConfig = agentConfigs[0] || {} — assume UMA config global. Fallback objeto vazio.',
      },
    },

    kpiCalculation: {
      function: 'calculateKPIs() → objeto kpiData',
      timing: 'Roda a cada render (não memoizado — gap menor de performance)',
      classifications: {
        openDisputes: "['received', 'in_analysis', 'in_contestation', 'pending'].includes(status)",
        preCBs: "['alert_ethoca', 'alert_verifi'].includes(type) && !['reimbursed', 'won', 'lost'].includes(status)",
        inContestation: "status === 'in_contestation'",
        won: "status === 'won'",
        lost: "status === 'lost' || status === 'accepted'",
        reimbursedPreCBs: "alert type && status === 'reimbursed'",
      },
      derivedMetrics: {
        totalOpenDisputes: 'openDisputes.length',
        totalOpenValue: 'sum(openDisputes.amount || 0)',
        activePreChargebacks: 'preCBs.length',
        avgPreCBDeadline: 'média em dias (com Math.max(0, diff) para evitar negativos)',
        provisionAmount: 'totalOpenValue * 0.7 (heurística — gap: deveria usar winRate histórico)',
        winRate: '(won + lost) > 0 ? (won / (won + lost)) * 100 : 0',
        preventionRate: '(reimbursedPreCBs / total preCBs+reimbursed) * 100',
        avgResponseTime: '4 horas (HARDCODED — placeholder)',
        recoveredValue: 'sum(won.amount)',
        lostValue: 'sum(lost.amount)',
      },
    },

    ratioCalculations: {
      visaTxCount: 10000,
      mcTxCount: 8000,
      gapNote: 'HARDCODED MOCK — em produção precisa fetch real de Transaction.filter({card.brand, status: approved}) do mês corrente',
      formulas: {
        visaRatio: '(visaDisputes / 10000) * 100',
        mcRatio: '(mcDisputes / 8000) * 100',
        visaFraudRatio: '(visaFraud / 10000) * 100',
        mcFraudRatio: '(mcFraud / 8000) * 100',
      },
    },

    trendDataMock: {
      structure: '6 pontos: { month, visaRatio, mastercardRatio }',
      hybridLogic: 'Os 5 primeiros meses são MOCK fixos. O último (Jan) usa o cálculo REAL com fallback para mock.',
      passedTo: 'DisputeTrendChart com thresholdWarning=0.65 e thresholdCritical=0.9 (Visa)',
    },

    programStatusFunction: {
      logic: 'inProgram (red) > warning (yellow) > normal (green) — qualquer bandeira em programa pinta tudo de vermelho',
      iconInBadge: 'Shield 12px à esquerda do label',
    },

    handleToggleAgent: {
      signature: '(enabled: boolean) => Promise<void>',
      implementation: 'await base44.entities.DisputeAgentConfig.update(agentConfig.id, { is_agent_enabled: enabled })',
      gap: 'Não invalida queryClient após update — UI pode ficar stale. Não cobre caso !agentConfig.id (primeira vez).',
    },

    layout: {
      rootContainer: '<div className="space-y-6">',
      pageHeader: {
        title: "t('disputes.title')",
        subtitle: "t('disputes.title') — gap: subtitle igual ao title",
        actions: ['Button outline + Download', 'Button outline + FileText'],
        actionsGap: 'Ambos os botões SEM onClick implementado',
      },
    },

    cardCriticalRatioIndicators: {
      header: '"Indicadores Críticos de Ratio" + Badge Status (programStatus)',
      bodyLayout: 'grid grid-cols-2 md:grid-cols-4 gap-6',
      gauges: [
        { label: 'Ratio CB Visa', value: 'visaRatio', warning: 0.65, critical: 0.9, max: 2, program: 'VDMP' },
        { label: 'Ratio CB Mastercard', value: 'mcRatio', warning: 0.8, critical: 1.0, max: 2, program: 'ECM' },
        { label: 'Fraude Visa (VFMP)', value: 'visaFraudRatio', warning: 0.5, critical: 0.75, max: 1.5, program: 'VFMP' },
        { label: 'Fraude MC (EFM)', value: 'mcFraudRatio', warning: 0.35, critical: 0.5, max: 1, program: 'EFM — mais rigoroso' },
      ],
    },

    kpiCards: {
      component: 'DisputeKPICards',
      props: '{ data: kpiData, isLoading: loadingDisputes }',
    },

    chartsAndComplianceRow: {
      layout: 'grid lg:grid-cols-2 gap-6',
      leftColumn: 'DisputeTrendChart com thresholds Visa por padrão (gap: deveria ter toggle Visa/MC)',
      rightColumn: 'ComplianceOverview',
    },

    agentSummary: {
      component: 'AgentDashboardSummary',
      props: '{ config: agentConfig, onToggleAgent: handleToggleAgent, isLoading: loadingAgent }',
    },

    quickActions: {
      layout: 'grid md:grid-cols-3 gap-4',
      cards: [
        {
          target: 'PreChargebacks',
          colorScheme: 'orange',
          icon: 'AlertTriangle',
          subtitle: '`${kpiData.activePreChargebacks} alertas ativos`',
          urgency: 'Janela 24-72h, ação reversível',
        },
        {
          target: 'Chargebacks',
          colorScheme: 'red',
          icon: 'Shield',
          subtitle: '`${kpiData.inContestationCount} em contestação`',
          urgency: 'CB já formalizado, em jogo evidências e prazos',
        },
        {
          target: 'DisputeAgentSettings',
          colorScheme: 'purple',
          icon: 'TrendingUp',
          subtitle: '"Configurar agente IA"',
          urgency: 'Configuração estratégica de longo prazo',
        },
      ],
    },

    knownGaps: [
      'visaTxCount e mcTxCount HARDCODED (10000/8000) — ratios baseados em números falsos',
      'trendData mistura mock fixo (5 meses) com dado real (1 mês)',
      'subtitle do PageHeader é igual ao title',
      'Botões Download e FileText sem onClick',
      'avgResponseTime hardcoded em 4 horas',
      'provisionAmount usa multiplicador 0.7 hardcoded',
      'handleToggleAgent não invalida cache nem trata caso !agentConfig.id',
      'loadingCompliance não passa para ComplianceOverview',
      'Tabs e RefreshCcw importados mas não usados',
      'Limite de 100 disputas pode ser insuficiente — paginação ausente',
      'calculateKPIs() não memoizada',
      'Não há filtro de período (30/60/90 dias)',
    ],

    relationshipsToOtherPages: {
      preChargebacks: '/PreChargebacks — quick action laranja',
      chargebacks: '/Chargebacks — quick action vermelho',
      disputeAgentSettings: '/DisputeAgentSettings — config do agente IA',
      disputeContestation: '/DisputeContestation — submissão de evidências',
      medDashboard: '/MEDDashboard — MEDs (categoria correlata mas separada)',
    },
  },
};

export default DisputeDashboardDoc;