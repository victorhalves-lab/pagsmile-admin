// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — RISCO CORE (Admin Interno)
// Fidelidade absoluta a 6 páginas (~1.196 linhas):
//  - AdminIntRiskDashboard.jsx (288 linhas) — KPIs+gráfico CB+4 cards+tabela top5
//  - AdminIntRiskRules.jsx (255 linhas) — CRUD regras + SideDrawer New Rule
//  - AdminIntAntifraud.jsx (74 linhas) — Tabs Regras/Blocklists com DataTable
//  - AdminIntFraudMonitoring.jsx (300 linhas) — análise transações + Dialog modal
//  - AdminIntRiskAlerts.jsx (150 linhas) — alertas ativos + histórico
//  - AdminIntControlLists.jsx (261 linhas) — Tabs Blacklist/Whitelist + 5 stats
// ============================================================================

export const AdminIntRiskCoreDoc = {
  pageId: 'AdminIntRiskCore',
  pagePaths: [
    '/AdminIntRiskDashboard',
    '/AdminIntRiskRules',
    '/AdminIntAntifraud',
    '/AdminIntFraudMonitoring',
    '/AdminIntRiskAlerts',
    '/AdminIntControlLists',
  ],
  module: 'Admin Interno',
  section: 'Risco e Compliance — Core',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      '6 páginas que formam o coração da operação de Risco/Antifraude do Admin Interno: (1) RiskDashboard agrega 5 KPIs (CB Ratio/Fraud Rate/MED Rate/Aprovação/Negação) com tendências pp + gráfico LineChart 6-meses com ReferenceLine y=1 dashed red + 4 sub-cards (Chargebacks/MEDs/Frauds/Merchants em Risco) com Win Rate 90d + Top5 Table de merchants por CB Ratio com 3 status colors; (2) RiskRules é CRUD de regras com 4 mocks (RULE-001 a 004) com category/priority/action/condition em monospace + 4 botões por regra (Edit/Test/Métricas/Pause-Play) + SideDrawer New Rule com radio scope (todos/específicos) + Checkbox "Ativar imediatamente"; (3) Antifraud é página minúscula (74 linhas) com Tabs Regras/Blocklists usando DataTable componente reutilizável + Switch toggle para status; (4) FraudMonitoring é a mais sofisticada — 5 stats coloridos + 5 filtros + 3 transações suspeitas com Score color (≤30 red / ≤60 yellow / >60 green) + Dialog modal "Análise de Fraude" com Score Bar + 5 fatores de risco com pontuação +/- + 3 radio decisions + 3 checkboxes blacklist; (5) RiskAlerts mostra 5 alertas ativos com severity error/warning + histórico tabela com resolvedBy + 3 filtros; (6) ControlLists é o mais comprehensivo com Tabs Blacklist/Whitelist + 6 stats counter (Cartões/CPFs/E-mails/IPs/Devices/Total=591) + 2 tabelas (Cartões + CPFs) + SideDrawer Add com tipo Select (5 opções) + Validade radio (Permanente/Temporária N dias).',

    sixPageOverview: {
      riskDashboard: 'Visão executiva — 5 KPIs + gráfico CB Ratio + 4 cards + top5 merchants',
      riskRules: 'CRUD regras com 4 mocks + SideDrawer Nova Regra com escopo',
      antifraud: 'Página simplificada (74 lines) — apenas Tabs Regras/Blocklists',
      fraudMonitoring: 'A MAIS SOFISTICADA — Score bar + 5 fatores + Dialog 3-radio decision',
      riskAlerts: '5 alertas ativos com severity + histórico tabela com resolvedBy',
      controlLists: 'Tabs Blacklist/Whitelist + 6 stats + SideDrawer Add com 5 tipos',
    },

    // ==========================================================================
    // SUB-DOC #1 — AdminIntRiskDashboard
    // ==========================================================================
    riskDashboardMicroscopic: {
      role: 'Centro nervoso de visibilidade de risco — agrega CB Ratio, fraudes, MEDs, alertas críticos',

      pageHeader: {
        title: 'Dashboard de Risco',
        breadcrumbs: '[Risco e Compliance → Dashboard]',
        actionElement: 'Select w-150 com 3 opções (7d/30d/90d default 30d) — gap: NÃO controla nenhuma data dinamicamente',
      },

      criticalAlertsSection: {
        wrapper: 'Card border-red-200 bg-red-50/50',
        header: 'AlertTriangle red-500 + "Alertas Críticos ({criticalAlerts.length})" + Link "Ver todos →" → AdminIntRiskAlerts',
        content: 'space-y-2 — 3 alertas mock',
        threeCriticalAlerts: [
          { severity: 'error', emoji: '🔴', message: 'CB Ratio da Loja do João atingiu 0,95% (limite: 1%)', time: 'há 2 horas', bg: 'bg-red-100 + text-red-500' },
          { severity: 'error', emoji: '🔴', message: 'Aumento de 150% em negações no merchant Tech Store', time: 'há 4 horas', bg: 'bg-red-100' },
          { severity: 'warning', emoji: '🟡', message: '5 MEDs pendentes de resposta com prazo < 3 dias', time: 'há 1 dia', bg: 'bg-yellow-100 + text-yellow-500' },
        ],
        gap: 'Sem botão para "Resolver" inline — sempre redireciona ao RiskAlerts',
      },

      mainKPIs: {
        layout: 'grid grid-cols-2 md:grid-cols-5 gap-4',
        fiveKPICards: [
          {
            title: 'CB Ratio',
            value: '0,45%',
            badge: '🟢 OK (green-100/green-700)',
            target: 'Meta: <1%',
            trend: 'TrendingDown green-600 -0,05pp',
            border: 'border-green-200',
          },
          {
            title: 'Fraud Rate',
            value: '0,08%',
            badge: '🟢 OK',
            target: 'Meta: <0,1%',
            trend: '→ 0,00pp slate-500 (sem icon)',
            border: 'border-green-200',
          },
          {
            title: 'MED Rate',
            value: '0,02%',
            badge: '🟢 OK',
            target: 'Meta: <0,1%',
            trend: 'TrendingUp red-500 +0,01pp — gap: trend up é red mas badge é green-OK',
            border: 'border-green-200',
          },
          {
            title: 'Aprovação',
            value: '92,3%',
            badge: '🟢 Bom',
            target: 'Meta: >90%',
            trend: 'TrendingUp green-600 +1,2pp',
            border: 'border-green-200',
          },
          {
            title: 'Negação',
            value: '7,7%',
            badge: 'Normal (slate-100/slate-700)',
            target: 'NENHUMA META definida',
            trend: 'NENHUMA trend',
            border: 'sem border especial',
          },
        ],
        gapNoteworthy: 'Apenas Negação não tem trend nem meta — assimétrico',
      },

      cbRatioChart: {
        title: '📈 Evolução do CB Ratio (Últimos 6 meses)',
        height: 250,
        chartType: 'LineChart Recharts',
        sixMockMonths: [
          { month: 'Ago', value: 0.42 },
          { month: 'Set', value: 0.55 },
          { month: 'Out', value: 0.78 },
          { month: 'Nov', value: 0.65 },
          { month: 'Dez', value: 0.52 },
          { month: 'Jan', value: 0.45 },
        ],
        chartConfig: {
          cartesianGrid: 'strokeDasharray="3 3" stroke=#f0f0f0',
          xAxis: 'dataKey=month tick fontSize=12',
          yAxis: 'domain=[0, 1.2] tickFormatter=v→"{v}%" fontSize=12',
          tooltip: 'formatter=v→"{v}%"',
          referenceLine: 'y=1 stroke=#ef4444 strokeDasharray="5 5" label="Limite 1%" fill=#ef4444 fontSize=10',
          line: 'type=monotone stroke=#2bc196 strokeWidth=2 dot fill=#2bc196',
        },
        gap: 'Domínio Y vai até 1.2% mas há valores apenas até 0.78 — espaço vazio em cima',
      },

      fourCardsRow: {
        layout: 'grid grid-cols-1 md:grid-cols-2 gap-6',

        chargebacksCard: {
          icon: 'CreditCard 5x5',
          title: 'Chargebacks',
          ctaLink: 'AdminIntChargebacksList',
          fourLines: [
            'Abertos: 15 (R$ 4.500,00)',
            'Em defesa: 23 (R$ 7.800,00)',
            'Este mês: 45 (R$ 12.300,00)',
            'Win rate (90d): 68% (text-green-600 bold + border-t)',
          ],
        },

        medsCard: {
          icon: 'Banknote 5x5',
          title: 'MEDs (PIX)',
          ctaLink: 'AdminIntMEDsList',
          fourLines: [
            'Abertos: 8 (R$ 2.100,00)',
            'Em contestação: 5 (R$ 1.500,00)',
            'Este mês: 18 (R$ 4.200,00)',
            'Win rate (90d): 72%',
          ],
        },

        fraudCard: {
          icon: 'Shield 5x5',
          title: 'Fraudes Detectadas',
          ctaLink: 'AdminIntFraudMonitoring',
          fourLines: [
            'Hoje: 12 (R$ 3.400,00)',
            'Esta semana: 45 (R$ 15.200,00)',
            'Este mês: 156 (R$ 48.900,00)',
            'Bloqueadas: 89% das tentativas',
          ],
        },

        merchantsRiskCard: {
          icon: 'Eye 5x5',
          title: 'Merchants em Risco',
          ctaLink: 'AdminIntMerchantsList',
          fourLines: [
            '🔴 Alto risco: 3 (text-red-600 bold)',
            '🟡 Médio risco: 8 (text-yellow-600)',
            '🟢 Baixo risco: 234 (text-green-600)',
            'Em monitoramento: 15',
          ],
        },
      },

      topMerchantsCBTable: {
        title: '📋 Top 5 Merchants por CB Ratio',
        usesNativeHTMLTable: 'YES — não usa shadcn Table — usa <table className="w-full text-sm">',
        sixColumns: ['#', 'Merchant', 'CB Ratio (text-right bold)', 'CBs/mês (text-right)', 'TPV/mês (text-right)', 'Status (Badge)'],
        fiveMockMerchants: [
          { name: 'Loja do João', cbRatio: 0.95, cbs: 12, tpv: 126000, status: 'alert', emoji: '🔴 Alerta' },
          { name: 'Tech Store', cbRatio: 0.78, cbs: 8, tpv: 89000, status: 'attention', emoji: '🟡 Atenção' },
          { name: 'Moda Fashion', cbRatio: 0.65, cbs: 5, tpv: 45000, status: 'attention', emoji: '🟡 Atenção' },
          { name: 'Eletrônicos Plus', cbRatio: 0.52, cbs: 4, tpv: 67000, status: 'ok', emoji: '🟢 OK' },
          { name: 'Casa & Jardim', cbRatio: 0.48, cbs: 3, tpv: 34000, status: 'ok', emoji: '🟢 OK' },
        ],
        statusColors: {
          alert: 'bg-red-100 text-red-700',
          attention: 'bg-yellow-100 text-yellow-700',
          ok: 'bg-green-100 text-green-700',
        },
        gap: 'Sem onClick na linha — apenas visualiza, não navega',
        gap2: 'CBs/mês fictício — sem indicação de período exato no header',
      },

      knownGapsRiskDashboard: [
        'Period Select w-150 sem onChange handler — não filtra dados',
        'KPI Negação assimétrico (sem trend, sem meta)',
        'MED Rate trend RED com badge GREEN-OK — confuso',
        'Domínio Y do gráfico (0-1.2%) tem espaço morto no topo',
        'Top5 Table sem ações — apenas exibição',
        'Critical Alerts não-deduplicados (mesmo merchant pode aparecer 2x)',
        'Win rate sempre 90d hardcoded — sem opção de período',
        'Sem export de dados ou snapshot',
      ],
    },

    // ==========================================================================
    // SUB-DOC #2 — AdminIntRiskRules
    // ==========================================================================
    riskRulesMicroscopic: {
      role: 'CRUD de regras de risco em formato condition-action — base do motor antifraude',

      fourMockRules: [
        { id: 'RULE-001', name: 'Valor Alto', category: 'value', priority: 'high', action: 'block', condition: 'SE valor > R$ 5.000 E cliente_novo = true', active: true, triggers30d: 45, blocks: 38, rate: 84 },
        { id: 'RULE-002', name: 'Múltiplas Tentativas', category: 'velocity', priority: 'high', action: 'block', condition: 'SE tentativas_cartao > 3 EM 1 hora', active: true, triggers30d: 89, blocks: 89, rate: 100 },
        { id: 'RULE-003', name: 'BIN Suspeito', category: 'card', priority: 'medium', action: 'manual_review', condition: 'SE bin_country != "BR" E valor > R$ 500', active: true, triggers30d: 156, blocks: 23, rate: 15 },
        { id: 'RULE-004', name: 'Device Novo', category: 'device', priority: 'low', action: 'score', condition: 'SE device_age < 30 dias', active: false, triggers30d: 234, blocks: 0, rate: 0 },
      ],

      threePriorityConfig: {
        high: 'Alta (red-100/red-700)',
        medium: 'Média (yellow-100/yellow-700)',
        low: 'Baixa (slate-100/slate-700)',
      },

      fourActionConfig: {
        block: 'Bloquear',
        manual_review: 'Análise Manual',
        score: 'Adicionar Score',
        alert: 'Alertar',
      },

      pageHeader: {
        title: 'Regras de Risco',
        breadcrumbs: '[Risco e Compliance → Regras]',
        actionElement: 'Button "Nova Regra" Plus → setNewRuleModal(true)',
      },

      fiveStatsRow: {
        layout: 'grid grid-cols-5 gap-4',
        stats: [
          'Total — rules.length=4 (white border)',
          'Ativas — green-50/green-200 border (filter active count = 3)',
          'Inativas — slate-50 (filter !active count = 1)',
          'Disparos (30d) — blue-50/blue-200 (sum triggers30d).toLocaleString()',
          'Bloqueios (30d) — purple-50/purple-200 (sum blocks).toLocaleString()',
        ],
      },

      filtersCard: {
        wrapper: 'Card → flex flex-wrap gap-3',
        threeFilters: [
          'Status Select w-130 (Todas/Ativas/Inativas)',
          'Categoria Select w-150 (Todas/Valor/Velocidade/Cartão/Cliente)',
          'Input "🔍 Buscar regra..." w-200',
        ],
        gap: 'Filters apenas UI — sem onChange/aplicação',
      },

      rulesList: {
        wrapper: 'space-y-3 — cards individuais',
        eachCardSection: {
          headerRow: 'flex items-start justify-between mb-3 — RULE-XXX: Name + Badge ativa/inativa',
          metaRow: 'flex gap-4 text-sm slate-600 → "Categoria: {category}" + Badge prioridade + "Ação: {actionConfig[action]}"',
          conditionBox: 'bg-slate-50 rounded-lg p-3 mb-3 font-mono text-sm — exibe condition string',
          metricsAndActions: {
            layout: 'flex items-center justify-between',
            leftMetrics: 'Disparos (30d): X / Bloqueios: X / Taxa: X%',
            rightActions: '4 botões Edit/Testar/Métricas/Ativar-Desativar',
            buttons: [
              'Editar — outline sm Edit icon — onClick=toast.info("Editor de regra...") (gap: NÃO abre editor real)',
              'Testar — outline sm TestTube icon (gap: SEM onClick)',
              'Métricas — outline sm BarChart3 icon (gap: SEM onClick)',
              'Ativar/Desativar — outline sm Pause/Play CONDITIONAL — onClick=toast.success("Regra desativada/ativada")',
            ],
          },
        },
      },

      newRuleSideDrawer: {
        wrapper: 'SideDrawer size=lg + icon Shield',
        title: 'Nova Regra de Risco',
        footer: '3 buttons — Cancelar (outline) + Testar Regra (outline + TestTube) + Salvar Regra (default + 💾)',

        eightFields: [
          'Nome da regra * — Input placeholder "Ex: Bloqueio de valor alto para cliente novo"',
          'Descrição — Textarea',
          'Categoria — Select 6 options [value, velocity, card, customer, device, geo]',
          'Prioridade — Select 3 options [high/medium/low]',
          'Ação Principal — Select 4 options [block, manual_review, score, alert]',
          'Escopo de Aplicação — radio group [all default checked / specific] — gap: NÃO mostra MultiSelect quando "specific"',
          'Checkbox "Ativar regra imediatamente" — gap: id=activate mas não controlled',
          'GAP: NÃO há editor de condições visual — só campos meta',
        ],

        gapMissingConditionEditor: 'O drawer NÃO tem editor de condições (campo SE valor > X) — campo principal da regra ausente — apenas metadata',
        gap: 'conditions state existe ([{field, operator, value}]) mas SEM UI para construir',
      },

      knownGapsRiskRules: [
        'Botões Testar/Métricas SEM onClick',
        'Editar mostra apenas toast — não abre Drawer com dados',
        'New Rule Drawer SEM editor de condição visual (campo principal!)',
        'conditions state declarado mas não usado em UI',
        'Filters sem onChange handlers',
        'Stats são calculados ao render — sem memoization',
        'Sem confirmation antes de Pausar regra crítica',
        'Sem versionamento ou histórico de mudanças',
      ],
    },

    // ==========================================================================
    // SUB-DOC #3 — AdminIntAntifraud (página minúscula)
    // ==========================================================================
    antifraudMicroscopic: {
      role: 'Página simplificada de antifraude com 2 abas — apenas 74 linhas TOTAIS',

      pageHeader: {
        title: 'Configuração de Antifraude',
        subtitle: 'Regras e Blocklists',
        breadcrumbs: '[Risco (page=AdminIntRisk) → Antifraude (atual)]',
      },

      tabs: {
        defaultValue: '"rules"',
        twoTabs: ['rules — Regras Globais', 'blocklist — Blocklists'],
      },

      rulesTab: {
        cardTitle: 'Regras Ativas',
        topRightAction: 'Button sm "Nova Regra" Plus',
        usesDataTable: 'YES — @/components/common/DataTable',
        threeMockData: [
          { rule: 'Score antifraude < 20', action: 'Bloquear', status: true },
          { rule: 'Valor > R$ 10.000 sem 3DS', action: 'Exigir 3DS', status: true },
          { rule: '>5 tentativas mesmo cartão/hora', action: 'Bloquear', status: true },
        ],
        fourColumns: [
          'Regra (accessorKey rule)',
          'Ação (accessorKey action)',
          'Status (accessorKey status, cell=Switch checked)',
          'Ações (cell=Button ghost Trash2 red-500)',
        ],
        gap: 'Switch sem onCheckedChange — só visual',
        gap2: 'Trash2 sem onClick',
      },

      blocklistTab: {
        cardTitle: 'Blocklist Global',
        topRightAction: 'Button sm "Adicionar" Plus',
        twoMockData: [
          { value: '****1234', type: 'Cartão', reason: 'Fraude Confirmada' },
          { value: '189.123.0.1', type: 'IP', reason: 'Ataque DDoS' },
        ],
        fourColumns: ['Valor', 'Tipo', 'Motivo', 'Ações (Trash2)'],
      },

      knownGapsAntifraud: [
        '74 linhas — página menos comprehensiva que ControlLists/RiskRules',
        'Sobreposição clara com AdminIntControlLists (Blocklists) e AdminIntRiskRules — 3 páginas para fazer coisas similares',
        'Switch toggle sem handler',
        'Trash2 sem onClick',
        'Buttons "Nova Regra" e "Adicionar" sem onClick',
        'Apenas 3 mocks rules + 2 mocks blocklist — superficial',
        'Sem loading/empty states',
        'Sem filtros ou busca',
      ],
    },

    // ==========================================================================
    // SUB-DOC #4 — AdminIntFraudMonitoring (A MAIS SOFISTICADA)
    // ==========================================================================
    fraudMonitoringMicroscopic: {
      role: 'Página MAIS SOFISTICADA do Risk Core — análise individual de transação suspeita com Score + Fatores + Decisão',

      threeMockSuspiciousTransactions: [
        {
          id: 'TXN-123456',
          amount: 2500,
          brand: 'Visa',
          last4: '1234',
          score: 15,
          merchant: 'Tech Store',
          customer: 'João Silva',
          ip: '189.45.123.200',
          alerts: ['Valor alto', 'Novo cliente', 'IP diferente'],
          status: 'under_review',
          scoreLabel: 'Alto Risco (red-100/red-600)',
          emoji: '🔴',
        },
        {
          id: 'TXN-123457',
          amount: 890,
          brand: 'Master',
          last4: '5678',
          score: 35,
          merchant: 'Loja do João',
          customer: 'Maria Santos',
          ip: '177.80.45.100',
          alerts: ['Múltiplas tentativas', 'Device novo'],
          status: 'under_review',
          scoreLabel: 'Médio Risco (yellow-100/yellow-600)',
          emoji: '🟠',
        },
        {
          id: 'TXN-123458',
          amount: 1200,
          brand: 'Elo',
          last4: '9012',
          score: 45,
          merchant: 'Moda Fashion',
          customer: 'Carlos Pereira',
          ip: '200.15.78.90',
          alerts: ['Horário atípico'],
          status: 'under_review',
          scoreLabel: 'Médio Risco',
          emoji: '🟠',
        },
      ],

      scoreFunctions: {
        getScoreColor: 'score≤30 → red-600 bg-red-100 / score≤60 → yellow-600 bg-yellow-100 / score>60 → green-600 bg-green-100',
        getScoreLabel: 'score≤30 → "Alto Risco" / ≤60 → "Médio Risco" / >60 → "Baixo Risco"',
        gap: 'Lógica score INVERTIDA — score baixo = alto risco. Não documentado em UI',
      },

      fiveFraudStats: {
        layout: 'Card "📊 Resumo" + Select "Hoje/7d/30d" no header',
        statsGrid: 'grid grid-cols-5 gap-4',
        fiveStats: [
          'Em Análise — 23 (yellow-100/yellow-700)',
          'Bloqueadas — 45 (red-100/red-700)',
          'Aprovadas — 12 (green-100/green-700)',
          'Confirmadas — 8 (red-200/red-800 — DARKER red)',
          'Valor Total — "R$ 23.400" (slate-100/slate-700)',
        ],
      },

      filtersCard: {
        layout: 'flex flex-wrap gap-3',
        fiveFilters: [
          'Período Select w-120 (Hoje/7d/30d)',
          'Status Select w-140 (Todos/Em Análise/Bloqueadas/Aprovadas)',
          'Merchant Select w-150 placeholder="Merchant" (Todos/Tech Store/Loja do João)',
          'Score Select w-140 placeholder="Score" (Todos/Alto<30/Médio 30-60/Baixo>60)',
          'Button outline "🔍 Filtrar"',
        ],
        gap: 'Botão "Filtrar" sem onClick — apenas visual',
      },

      transactionsList: {
        cardHeader: {
          left: 'AlertTriangle yellow-500 + "Transações em Análise ({count})"',
          right: 'Select w-140 ordenação (Score/Valor/Data)',
        },
        eachItem: {
          wrapper: 'border rounded-lg p-4 hover:bg-slate-50',
          scoreLine: 'span px-2 py-0.5 + emoji + "Score: {score}/100 ({label})"',
          identityLine: 'font-mono "{id} | {currency} | {brand} ****{last4}"',
          metaLine: 'sm slate-500 — "Merchant: {m} | Cliente: {c} | IP: {ip}"',
          alertsBadges: {
            renderRule: 'idx 0 e 1 → red-100/red-700 + 🔴 / idx≥2 → yellow-100/yellow-700 + 🟡',
            gap: 'Cores baseadas em ÍNDICE no array, não em severidade real do alerta',
          },
          fourActions: [
            'Analisar (Eye) outline sm — onClick=setAnalyzeModal(tx) → ABRE DIALOG',
            'Aprovar (Check green-600) outline sm — onClick=toast.success("Transação aprovada!")',
            'Bloquear (X red-600) outline sm — onClick=toast.success("Transação bloqueada!")',
            'Ver regras acionadas (FileText) ghost — gap: SEM onClick',
          ],
        },
      },

      fraudTypesCard: {
        title: '📊 Fraudes Confirmadas (Últimos 30 dias)',
        subTitle: '"Por tipo:"',
        fiveTypes: [
          'Cartão roubado/clonado — 45% (36 casos)',
          'Fraude amigável — 28% (22 casos)',
          'Account takeover — 15% (12 casos)',
          'Teste de cartão — 10% (8 casos)',
          'Outros — 2% (2 casos)',
        ],
        eachBar: {
          structure: 'header line + bar full-width slate-100 + bar fill red-500 width=percentage%',
        },
      },

      analyzeModal: {
        wrapper: 'Dialog max-w-3xl max-h-[90vh] overflow-y-auto',
        title: 'Shield 5x5 + "Análise de Fraude - {analyzeModal?.id}"',
        conditional: 'IF analyzeModal — renderiza 3 sub-Cards',

        scoreCard: {
          title: '📊 Score de Risco',
          progressBar: {
            container: 'flex-1 bg-slate-200 rounded-full h-4',
            fill: 'bg-red-500 h-4 — width=({100-score}%)',
            gap: 'Lógica width=100-score significa fill aumenta com risco — visual correto MAS confuso semanticamente',
          },
          scoreLabel: 'lg bold "{score}/100" + sm font-medium {getScoreColor}',
        },

        riskFactorsCard: {
          title: 'Fatores de Risco',
          fiveHardcodedFactors: [
            '🔴 Valor acima do ticket médio (250% maior) — -20 pts',
            '🔴 Primeiro pedido deste cliente — -15 pts',
            '🔴 IP em região diferente do endereço — -10 pts',
            '🟡 Cartão emitido há menos de 6 meses — -5 pts',
            '🟢 3D Secure autenticado — +10 pts',
          ],
          gap: 'Fatores HARDCODED — não vêm de tx.alerts ou de data dinâmica',
        },

        decisionCard: {
          title: '⚡ Decisão',
          threeRadios: [
            'approve — "Aprovar transação"',
            'block — "Bloquear transação" (default initial state)',
            'info — "Solicitar mais informações ao merchant"',
          ],
          motiveSelect: {
            label: 'Motivo',
            fourOptions: ['Suspeita de cartão clonado', 'Comportamento atípico', 'Múltiplos fatores de risco', 'Outro'],
          },
          observationsTextarea: 'Label "Observações" + Textarea',
          threeBlacklistCheckboxes: [
            'bl_card — "Adicionar cartão à blacklist"',
            'bl_cpf — "Adicionar CPF à blacklist"',
            'bl_device — "Adicionar device à blacklist"',
          ],
        },

        footer: {
          cancelButton: 'outline + onClick=setAnalyzeModal(null)',
          saveButton: '"💾 Salvar Decisão" → toast.success("Decisão salva!") + close',
          gap: 'Salvar SEM validação — pode salvar com decision=block sem motivo',
        },
      },

      knownGapsFraudMonitoring: [
        'Fatores de risco hardcoded — não derivados da transação',
        'Lógica score invertida confusa (baixo=alto risco) sem hint visual',
        'Cores de alerts baseadas em ÍNDICE do array (não severidade real)',
        'Botão "Filtrar" sem onClick',
        'Botão "Ver regras acionadas" sem onClick',
        'Aprovar/Bloquear inline + Modal Salvar Decisão — 2 paths conflitantes',
        'Modal Salvar sem validação obrigatória de motivo',
        '3 checkboxes blacklist sem state controlled',
        'Score progress bar visual width=100-score pode confundir devs',
      ],
    },

    // ==========================================================================
    // SUB-DOC #5 — AdminIntRiskAlerts
    // ==========================================================================
    riskAlertsMicroscopic: {
      role: 'Central de alertas de risco — view+resolve workflow',

      fiveActiveAlerts: [
        { id: 'ALR-001', type: 'cb_ratio', severity: 'error', message: 'CB Ratio da Loja do João atingiu 0,95% (limite: 0,80%)', merchant: 'Loja do João', time: 'há 2 horas', action: 'Investigar transações recentes e aumentar retenção' },
        { id: 'ALR-002', type: 'volume', severity: 'error', message: 'Aumento de volume anormal - Tech Store', merchant: 'Tech Store', time: 'há 4 horas', action: 'Verificar se há promoção ou possível fraude' },
        { id: 'ALR-003', type: 'med', severity: 'warning', message: '5 MEDs pendentes com prazo < 3 dias', merchant: '-', time: 'há 1 dia', action: 'Revisar e responder MEDs urgentes' },
        { id: 'ALR-004', type: 'denial', severity: 'warning', message: 'Taxa de negação alta - Moda Fashion (15%)', merchant: 'Moda Fashion', time: 'há 6 horas', action: 'Analisar causa das negações' },
        { id: 'ALR-005', type: 'fraud', severity: 'error', message: '10 fraudes detectadas em Pet Shop nas últimas 24h', merchant: 'Pet Shop', time: 'há 8 horas', action: 'Investigar padrão de fraude' },
      ],

      fourAlertHistory: [
        { date: '28/01 12:30', alert: 'CB Ratio alto', merchant: 'Loja do João', status: 'active', resolvedBy: null },
        { date: '28/01 10:15', alert: 'Volume anormal', merchant: 'Tech Store', status: 'active', resolvedBy: null },
        { date: '27/01 16:00', alert: 'Negação alta', merchant: 'Moda Fashion', status: 'resolved', resolvedBy: 'Ana P.' },
        { date: '26/01 09:30', alert: 'CB Ratio alto', merchant: 'Tech Store', status: 'resolved', resolvedBy: 'João S.' },
      ],

      pageHeader: {
        title: 'Alertas e Monitoramento',
        breadcrumbs: '[Risco e Compliance → Alertas]',
        actionElement: 'Button outline "Configurar" Settings — gap: SEM onClick',
      },

      activeAlertsCard: {
        title: 'Bell red-500 + "Alertas Ativos ({count})"',
        eachAlert: {
          wrapper: 'border rounded-lg p-4 — error → bg-red-50 border-red-200 / warning → bg-yellow-50 border-yellow-200',
          headerRow: '🔴/🟡 emoji 2xl + bloco mensagem + time slate-500',
          messageBlock: [
            'p font-medium — message text',
            'CONDICIONAL merchant!=="-" → "Merchant: {merchant}"',
            'p sm slate-500 — "Ação recomendada: {action}"',
          ],
          threeActionButtons: [
            'CONDICIONAL merchant!=="-" → "Ver merchant" outline sm Eye + Link → AdminIntMerchantProfile (gap: SEM ?id query — sempre vai ao merchant default)',
            'Marcar como resolvido — outline sm Check — onClick=toast.success("Alerta marcado como resolvido!")',
            'Silenciar 24h — outline sm BellOff — onClick=toast.info("Alerta silenciado por 24h")',
          ],
        },
        gap: 'Resolução é toast-only — alerta NÃO some da lista',
      },

      alertHistoryTable: {
        cardHeader: {
          left: '"📜 Histórico de Alertas"',
          right: '3 Selects — Severidade (Todos/Críticos/Avisos) + Status (Todos/Ativos/Resolvidos) + Período (7d/30d/90d default 7d)',
        },
        usesNativeHTMLTable: 'YES — não usa shadcn Table',
        fiveColumns: ['Data/Hora', 'Alerta', 'Merchant', 'Status', 'Resolvido por'],
        statusBadges: 'active → 🔴 Ativo (red-100/red-700) / resolved → ✅ Resolvido (green-100/green-700)',
        resolvedByCell: 'fallback "-" se !resolvedBy',
        gap: 'Linha SEM onClick — não permite drill-down em alerta histórico',
      },

      knownGapsRiskAlerts: [
        '"Configurar" Settings sem onClick',
        'Resolução por toast — alerta não some da UI',
        '"Ver merchant" Link sem ?id={merchantId} — sempre vai ao default',
        'Filters do Histórico apenas UI — sem aplicação',
        'Sem paginação no histórico (limite implícito 4 mocks)',
        'Sem export de relatório',
        'Sem campo "Notas" ao resolver alerta',
        'Sem prazo de resolução por severidade',
      ],
    },

    // ==========================================================================
    // SUB-DOC #6 — AdminIntControlLists
    // ==========================================================================
    controlListsMicroscopic: {
      role: 'Centro unificado de listas de controle (Blacklist/Whitelist) — 5 tipos: Cartões, CPFs, E-mails, IPs, Devices',

      sixStatsRow: {
        layout: 'grid grid-cols-6 gap-4',
        stats: [
          'Cartões — 234',
          'CPFs — 156',
          'E-mails — 89',
          'IPs — 45',
          'Devices — 67',
          'Total — 591 (blue-50/blue-200 — DESTAQUE)',
        ],
        gap: 'Math: 234+156+89+45+67 = 591 ✓ — checks out',
      },

      pageHeader: {
        title: 'Listas de Controle',
        breadcrumbs: '[Risco e Compliance → Listas]',
      },

      tabsStructure: {
        twoTabs: ['blacklist — Blacklists', 'whitelist — Whitelists'],
      },

      blacklistTab: {
        sequence: 'Stats grid 6-col → Card "Blacklist de Cartões" → Card "Blacklist de CPFs"',

        cardCartoes: {
          icon: 'CreditCard 5x5',
          title: 'Blacklist de Cartões',
          topActions: ['Adicionar (Plus) outline sm → setAddModal(true)', 'Importar (Upload) outline sm — gap: SEM onClick'],
          searchInput: 'Input "🔍 Buscar cartão..." mb-4',
          threeMockEntries: [
            { value: '411111******', reason: 'Fraude confirmada', addedDate: '28/01/2026', addedBy: 'João Silva' },
            { value: '543210******', reason: 'Múltiplos CBs', addedDate: '27/01/2026', addedBy: 'Maria Santos' },
            { value: '401200******', reason: 'Teste de cartão', addedDate: '25/01/2026', addedBy: 'Sistema' },
          ],
          fiveColumns: ['Cartão (font-mono)', 'Motivo', 'Adicionado', 'Por', 'Ações (text-center Trash2 red-600)'],
          paginationFooter: 'p sm slate-500 text-center "Mostrando 1-50 de 234"',
          gap: 'Paginação é apenas texto — sem botões de navegação',
        },

        cardCPFs: {
          icon: 'User 5x5',
          title: 'Blacklist de CPFs',
          topActions: 'Mesmos botões Adicionar+Importar',
          searchInput: 'Input "🔍 Buscar CPF..."',
          twoMockEntries: [
            { value: '123.456.789-00', reason: 'Fraude confirmada', addedDate: '28/01/2026', addedBy: 'João Silva' },
            { value: '987.654.321-00', reason: 'Chargeback', addedDate: '26/01/2026', addedBy: 'Ana Paula' },
          ],
          fiveColumns: 'idem cards table',
          gap: 'NÃO tem texto de paginação — assimétrico vs Cards',
        },

        notRendered: 'gap: Os 3 outros tipos (E-mails/IPs/Devices) APARECEM nos stats mas NÃO têm tabela renderizada',
      },

      whitelistTab: {
        content: 'Card → CardContent py-12 text-center → "Whitelists em desenvolvimento"',
        gap: 'TAB inteira é apenas placeholder',
      },

      addBlacklistSideDrawer: {
        wrapper: 'SideDrawer + icon Plus + iconClassName="bg-red-100 text-red-600"',
        title: 'Adicionar à Blacklist',
        footer: 'Cancelar (outline) + Adicionar ("➕ Adicionar" → toast.success + close)',

        fiveFields: [
          {
            field: 'Tipo',
            type: 'Select',
            default: 'card',
            options: ['Cartão', 'CPF', 'E-mail', 'IP', 'Device'],
          },
          {
            field: 'Valor *',
            type: 'Input',
            placeholder: '"Ex: 411111 (BIN) ou número completo"',
          },
          {
            field: 'Motivo *',
            type: 'Select',
            placeholder: 'Selecione...',
            fiveOptions: ['Fraude confirmada', 'Chargeback', 'Teste de cartão', 'Atividade suspeita', 'Outro'],
          },
          {
            field: 'Observações',
            type: 'Textarea',
            placeholder: 'Detalhes adicionais...',
          },
          {
            field: 'Validade',
            type: 'Radio group + Inline Input',
            options: [
              'permanent (default checked) — "Permanente"',
              'temp — "Temporária:" + Input type=number w-16 default=30 + "dias"',
            ],
            gap: 'Input "30 dias" sem state — não vincula com radio',
          },
        ],
      },

      knownGapsControlLists: [
        '3 tipos (E-mails/IPs/Devices) aparecem em stats mas SEM tabela',
        'Whitelist tab é placeholder vazio',
        'Importar Upload SEM onClick',
        'Paginação só texto em Cards (sem botões)',
        'CPFs sem rodapé de paginação (assimétrico)',
        'Validade Temporária Input sem binding real',
        'Search Input sem onChange',
        'Trash2 toast-only — item NÃO some da lista',
        'addModal e listType states declarados mas listType nunca usado',
        'Sem confirmation antes de remover',
      ],
    },
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocations: {
      riskDashboard: 'pages/AdminIntRiskDashboard.jsx (288 linhas)',
      riskRules: 'pages/AdminIntRiskRules.jsx (255 linhas)',
      antifraud: 'pages/AdminIntAntifraud.jsx (74 linhas — minúscula)',
      fraudMonitoring: 'pages/AdminIntFraudMonitoring.jsx (300 linhas — A MAIS sofisticada)',
      riskAlerts: 'pages/AdminIntRiskAlerts.jsx (150 linhas)',
      controlLists: 'pages/AdminIntControlLists.jsx (261 linhas)',
    },

    backendIntegrationMap: {
      riskDashboard: 'NENHUMA — KPIs hardcoded + cbRatioData[6 meses] + criticalAlerts[3] + topMerchantsByCB[5]',
      riskRules: 'NENHUMA — rules[4 mocks] + conditions state local',
      antifraud: 'NENHUMA — DataTable inline data 3 rules + 2 blocklists',
      fraudMonitoring: 'NENHUMA — 3 suspicious + 5 stats + 5 fraud types + Modal hardcoded factors',
      riskAlerts: 'NENHUMA — 5 active + 4 history',
      controlLists: 'NENHUMA — 3 cards blacklist + 2 cpfs blacklist + 6 stats',
    },

    componentReuse: {
      DataTable: 'AdminIntAntifraud (rules+blocklists)',
      Switch: 'AdminIntAntifraud (status toggle)',
      SideDrawer: 'AdminIntRiskRules (Nova Regra) + AdminIntControlLists (Adicionar Blacklist)',
      Dialog: 'AdminIntFraudMonitoring (Análise de Fraude)',
      Tabs: 'AdminIntAntifraud (rules/blocklist) + AdminIntControlLists (blacklist/whitelist)',
      LineChart: 'AdminIntRiskDashboard (CB Ratio evolução)',
      ReferenceLine: 'AdminIntRiskDashboard (limite 1%)',
      nativeHTMLTable: 'AdminIntRiskDashboard (Top5) + AdminIntRiskAlerts (Histórico) + AdminIntControlLists (Cards/CPFs) — não usa shadcn Table',
    },

    crossPageRelationships: {
      riskDashboard_to: [
        'AdminIntRiskAlerts (Critical Alerts → Ver todos)',
        'AdminIntChargebacksList (Chargebacks card)',
        'AdminIntMEDsList (MEDs card)',
        'AdminIntFraudMonitoring (Fraudes card)',
        'AdminIntMerchantsList (Merchants em Risco card)',
      ],
      riskAlerts_to: 'AdminIntMerchantProfile (Ver merchant — gap: sem ?id)',
      sharedToastBehavior: 'TODAS as 6 páginas usam toast.success/info para feedback de ações sem persistência real',
    },

    knownGapsCrossPage: [
      'NENHUMA destas 6 tem integração SDK base44 — totalmente mockadas',
      'Sobreposição forte entre RiskRules + Antifraud(rules tab) + FraudMonitoring(blacklist actions) + ControlLists — 4 páginas para conceitos similares',
      'Win Rate 90d hardcoded em RiskDashboard — sem fonte única',
      'Severity colors inconsistentes: error=red em alguns, warning=yellow noutros — sem palette compartilhada',
      'Alertas resolvidos via toast NÃO desaparecem da UI (4 páginas com mesmo bug)',
      'Score lógica invertida sem hint visual em 2 lugares (Dashboard top5 e FraudMonitoring)',
      'Botão "Configurar" em RiskAlerts SEM onClick — implícito iria para AdminIntRisk?',
      'Native HTML <table> em 3 páginas mistura padrões (shadcn Table noutras 3) — inconsistência',
      '5 page Risk vs 1 page Compliance — Risk muito mais granular vs Compliance que já documentamos',
    ],
  },
};

export default AdminIntRiskCoreDoc;