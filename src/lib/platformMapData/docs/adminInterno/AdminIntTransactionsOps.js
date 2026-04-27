// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — TRANSAÇÕES OPERATIONS (Admin Interno) — Parte 2/2
// Fidelidade absoluta a 6 páginas operacionais (~1.690 linhas):
//  - AdminIntOrchestration.jsx (445 linhas) — 3 Tabs Global/Rules/Merchants + AcquirerCard drag + RuleCard
//  - AdminIntBINAnalysis.jsx (290 linhas) — 3 Tabs BINs/Issuers/Trends + BINRow + IssuerRow + LineChart
//  - AdminIntRetryIntelligence.jsx (528 linhas) — 4 Tabs + AI Insight Banner + Fallback PIX visual flow + 4 RetryRules
//  - AdminIntBatchProcessing.jsx (327 linhas) — 4 OperationCards + Drag&Drop CSV + Progress Bar
//  - AdminIntReconciliation.jsx (142 linhas) — 5 stats coloridos + 3 Tabs (apenas Divergent c/ tabela)
//  - AdminIntTransactionReports.jsx (156 linhas) — Form 3-fields + tabela 4 reports
// ============================================================================

export const AdminIntTransactionsOpsDoc = {
  pageId: 'AdminIntTransactionsOps',
  pagePaths: [
    '/AdminIntOrchestration',
    '/AdminIntBINAnalysis',
    '/AdminIntRetryIntelligence',
    '/AdminIntBatchProcessing',
    '/AdminIntReconciliation',
    '/AdminIntTransactionReports',
  ],
  module: 'Admin Interno',
  section: 'Transações — Operations (Orchestration + BIN + Retry + Batch + Recon + Reports)',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Sextuplo operacional: (1) Orchestration com 4 stats top (4/5 Adquirentes/12 Regras/89.2% Aprov/285ms Latência) + 3 Tabs (Global Priority com filtros Método+Parcelamento + AcquirerCard 5 mocks Cielo/Rede/Stone/GetNet[degraded]/Adyen reordenáveis com GripVertical + position badge + 3 metrics aprov/latency/cost + Edit/Trash hover + Switch enabled - "Como funciona o fallback" infobox blue / Rules com 4 RuleCard (Visa Premium Cielo, Mastercard 2-6x Stone, Débito Rede, High Ticket Internacional Adyen[disabled]) + Search input + 8 conditions help badges - Merchants com 3 MerchantOverrideRow + Warning amber); (2) BIN Analysis com 4 KPIs + 3 Tabs (BINs com 8 rows mostrando approval color-by-rate ≥90 emerald ≥80 amber else red + brand badges + trend up/down icons / Issuers 6 banks com barra horizontal threshold 88/80 / Trends LineChart 4 lines BB/Itaú/Brad/Sant 7 dias com cores brand hex hardcoded #0066CC/#FF6600/#CC0033/#EC0000); (3) Retry Intelligence MAIS COMPLEXA com 6 KPIs + AI Insight Banner purple "Smart Retry IA → +R$85K/mês Ativar Agora" + 4 Tabs (Overview AreaChart Tentativas/Recuperadas + 5 Reasons bars / Rules 4 RetryRuleCard com 3 small KPIs por card maxRetries/successRate/interval + triggers badges + 5 retriable codes 51/61/65/91/96 / Fallback PIX com VISUAL FLOW horizontal 4 boxes Cartão→Outro→Falha→PIX com seta verde teal final + Configurações 3 settings inline (PIX após N falhas / Mensagem Personalizada Switch / Desconto PIX 0/3/5/10%) + Mensagem cliente blue box italic "Ops!..." + Stats 70% conversion + 6 fallback codes / Analysis empty placeholder); (4) Batch Processing com 4 OperationCard cards (Refund/Capture/Cancel/Webhook) selectable + UploadZone drag&drop CSV com state visual hover/dragging/loaded + Format template hint inline + 3 botões (Baixar Template/Validar/Processar Lote) com cascading disabled + 4 batch history mocks com Progress Bar + StatusBadge inline; (5) Reconciliation MINIMALISTA 142 linhas com 5 stats (Conciliadas verde/Pendentes amarelo/Divergentes vermelho/Total cinza/Valor azul) + 3 Tabs apenas Divergent populado com 3 mocks (DIV-001 R$0.50 / DIV-002 sem liquid / DIV-003 sem txId) + Resolver Button SEM onClick; (6) Reports com Form 3-fields (Tipo c/ 7 reports + desc dinâmica abaixo / Período c/ 7 / Format c/ 3 XLSX/CSV/PDF) + tabela 4 mocks reports (3 ready + 1 generating com Clock animate-spin) + ações condicionais por status (Ready=Download+Trash / Generating=dash). PALETA cores 4-7 KPICard (blue/emerald/red/amber/purple/teal/indigo). Switches em TODOS (Acquirer.enabled, Rule.enabled, RetryRule.enabled, Fallback PIX, Mensagem Personalizada).',

    sixPagesOverview: {
      orchestration: 'Roteamento de adquirentes — 5 acq + 4 rules + 3 merchants',
      binAnalysis: 'Performance por BIN/Emissor/Tendência com Recharts',
      retryIntelligence: 'Recovery + Fallback PIX — página mais visualmente rica',
      batchProcessing: 'Operações em massa via CSV upload — 4 ops disponíveis',
      reconciliation: 'Apenas Divergent populado — 2 outras tabs placeholder',
      reports: 'Geração de 7 tipos de relatórios em 3 formatos',
    },

    // ==========================================================================
    // SUB-DOC #1 — AdminIntOrchestration
    // ==========================================================================
    orchestrationMicroscopic: {
      role: 'Centro de roteamento dinâmico de transações entre adquirentes (Cielo/Rede/Stone/GetNet/Adyen) com fallback automático e regras condicionais',

      pageHeader: {
        title: 'Orquestração de Adquirentes',
        subtitle: 'Configure prioridades e regras de roteamento de transações',
        breadcrumbs: '[Transações → Orquestração]',
        actions: [
          'RefreshCw "Sincronizar" outline sm — gap: SEM onClick',
          'Save "Salvar Alterações" bg-#2bc196 — gap: SEM onClick',
        ],
      },

      fourTopStats: {
        layout: 'grid grid-cols-2 md:grid-cols-4 gap-3',
        cards: [
          'Layers blue + Adquirentes Ativos 4/5 (1 degradado=GetNet)',
          'Route purple + Regras Ativas 12 (apenas 4 mostradas)',
          'TrendingUp emerald + Taxa Aprovação Média 89.2% (verde)',
          'Zap amber + Latência Média 285ms',
        ],
      },

      threeTabs: {
        tabsList: ['global (Globe) "Prioridade Global"', 'rules (Route) "Regras de Roteamento"', 'merchants (Users) "Por Merchant"'],

        // ─── TAB 1: GLOBAL PRIORITY ────────────────────────────────────
        globalTab: {
          filters: {
            wrapper: 'Card flex flex-wrap gap-3',
            methodSelect: 'w-140 (Crédito default/Débito/PIX) — selectedMethod state',
            installmentSelect: 'w-140 (Todos default/À Vista 1x/2 a 6x/7 a 12x) — selectedInstallment state',
            addAcquirerButton: 'ml-auto outline sm Plus "Adicionar Adquirente" — gap: SEM onClick',
          },

          priorityListHeader: {
            title: 'ArrowUpDown + "Ordem de Prioridade - Crédito" + IF selectedInstallment !== all → "({installment})"',
            description: 'Arraste para reordenar. O primeiro será chamado sempre que possível.',
            gap: 'Texto "Crédito" hardcoded — não muda com selectedMethod (deveria refletir selecionado)',
          },

          fiveAcquirers: [
            { id: 1, name: 'Cielo', status: 'active', approval: 89, latency: 320, cost: 2.1, enabled: true },
            { id: 2, name: 'Rede', status: 'active', approval: 87, latency: 280, cost: 2.3, enabled: true },
            { id: 3, name: 'Stone', status: 'active', approval: 91, latency: 250, cost: 2.5, enabled: true },
            { id: 4, name: 'GetNet', status: 'degraded', approval: 82, latency: 450, cost: 2.0, enabled: false },
            { id: 5, name: 'Adyen', status: 'active', approval: 93, latency: 180, cost: 2.8, enabled: true },
          ],

          acquirerCard: {
            structure: 'flex items-center gap-3 p-3 + group hover:shadow',
            elements: [
              'GripVertical cursor-grab slate-400 hover:slate-600',
              'position w-8h8 rounded-lg bg-slate-100 + número bold (1/2/3/4/5)',
              'name semibold + Badge status colorido (active emerald/degraded amber/inactive slate)',
              'metrics: Percent + approval% / Clock + latency ms / DollarSign + cost%',
              'Edit + Trash buttons opacity-0 group-hover:opacity-100',
              'Switch checked={enabled}',
            ],
            gap: 'GripVertical visual mas SEM react-dnd ou hello-pangea/dnd implementado — drag não funciona',
            gap2: 'onMove/onRemove/onEdit todos passados como () => {} — handlers vazios',
            gap3: 'Switch onChange ausente — clicar não toggle',
          },

          fallbackInfoBox: {
            wrapper: 'Card gradient blue-50 to indigo-50 border-blue-100',
            icon: 'Zap blue-600 em p-2 bg-blue-100',
            title: 'Como funciona o fallback',
            text: 'Se o adquirente primário recusar ou estiver indisponível, a transação é automaticamente direcionada para o próximo da lista. Você pode configurar regras específicas na aba "Regras de Roteamento".',
          },
        },

        // ─── TAB 2: RULES ──────────────────────────────────────────────
        rulesTab: {
          searchAndAdd: {
            left: 'Input "Buscar regras..." w-250 + Filter outline sm — gap: search SEM filter logic',
            right: 'Plus bg-#2bc196 "Nova Regra" — gap: SEM onClick',
          },

          fourRulesCards: [
            {
              id: 1,
              name: 'Visa Premium para Cielo',
              description: 'Transações Visa acima de R$ 500 são roteadas para Cielo',
              conditions: ['Bandeira: Visa', 'Valor > R$ 500', 'Tipo: Crédito'],
              targetAcquirer: 'Cielo',
              enabled: true,
            },
            {
              id: 2,
              name: 'Mastercard 2-6x para Stone',
              description: 'Parcelamentos de 2 a 6x em Mastercard vão para Stone',
              conditions: ['Bandeira: Mastercard', 'Parcelas: 2-6x'],
              targetAcquirer: 'Stone',
              enabled: true,
            },
            {
              id: 3,
              name: 'Débito para Rede',
              description: 'Todas as transações de débito priorizam Rede',
              conditions: ['Tipo: Débito', 'Todas bandeiras'],
              targetAcquirer: 'Rede',
              enabled: true,
            },
            {
              id: 4,
              name: 'High Ticket Internacional',
              description: 'Transações internacionais acima de R$ 1000',
              conditions: ['Cartão: Internacional', 'Valor > R$ 1000'],
              targetAcquirer: 'Adyen',
              enabled: false,
            },
          ],

          ruleCard: {
            structure: 'p-4 rounded-xl + iconBox emerald-50 IF enabled / slate-100 ELSE + Route icon emerald-600 IF enabled / slate-400 ELSE + Switch + conditions badges + ArrowRight target + Edit+Trash inline',
            gap: 'onEdit/onToggle/onDelete passados como () => {}',
          },

          conditionsHelp: {
            wrapper: 'Card slate-50 border-slate-200',
            title: 'Condições disponíveis para regras:',
            eightBadges: [
              'Bandeira (Visa, MC, Elo...)',
              'Valor da Transação',
              'Número de Parcelas',
              'Tipo (Crédito/Débito)',
              'BIN Range',
              'Cartão Internacional',
              'MCC do Merchant',
              'Horário',
            ],
          },
        },

        // ─── TAB 3: MERCHANTS ──────────────────────────────────────────
        merchantsTab: {
          header: 'p sm "Merchants com configurações de orquestração personalizadas" + Plus outline "Adicionar Override"',

          threeOverrides: [
            { id: 1, name: 'TechStore Ltda', document: '12.345.678/0001-90', primaryAcquirer: 'Stone', rules: 3 },
            { id: 2, name: 'Fashion Hub', document: '98.765.432/0001-10', primaryAcquirer: 'Cielo', rules: 2 },
            { id: 3, name: 'Digital Games', document: '45.678.901/0001-23', primaryAcquirer: 'Adyen', rules: 5 },
          ],

          merchantOverrideRow: {
            structure: 'flex gap-3 p-3 hover:bg-slate-50 + Building2 blue-600 + name + document + primaryAcquirer + "{rules} regras customizadas" + Link AdminIntMerchantProfile?id={merchant.id} → Eye',
          },

          warningAlert: {
            wrapper: 'Card gradient amber-50 to orange-50 border-amber-100',
            icon: 'AlertTriangle amber-600',
            title: 'Atenção',
            text: 'Configurações por merchant sobrescrevem as regras globais. Use com cuidado para não criar conflitos de roteamento.',
          },
        },
      },

      knownGapsOrchestration: [
        'GripVertical cursor-grab mas SEM dnd implementado',
        'Switch enabled sem onChange real',
        'Search rules SEM filter logic',
        'Botões Sincronizar/Salvar/Adicionar Adquirente/Nova Regra/Adicionar Override TODOS sem onClick',
        'AcquirerCard onMove/onRemove/onEdit handlers vazios',
        'RuleCard onEdit/onToggle/onDelete handlers vazios',
        'Texto "Crédito" hardcoded no header — não muda c/ selectedMethod',
        'KPI top "12 Regras" mas só 4 RuleCards visíveis',
        'KPI top "4/5 Adquirentes Ativos" alinhado mas Switch GetNet=false (consistente)',
        'Sem visualização de simulação de impacto antes de salvar',
      ],
    },

    // ==========================================================================
    // SUB-DOC #2 — AdminIntBINAnalysis
    // ==========================================================================
    binAnalysisMicroscopic: {
      role: 'Análise granular de performance por BIN (6 dígitos), emissor (banco) e tendências históricas',

      pageHeader: {
        title: 'Análise de BINs e Emissores',
        breadcrumbs: '[Transações → Análise BIN]',
        actions: ['Download Exportar — gap: SEM onClick', 'RefreshCw icon — gap: SEM onClick'],
      },

      fourKPIs: [
        'CreditCard blue + BINs Únicos 234 + "Processados este mês"',
        'Building emerald + Emissores 48 + "Bancos e fintechs"',
        'CheckCircle2 emerald + Aprovação Média 87.3% +1.2%',
        'AlertTriangle amber + BINs com Alerta 8 + "Abaixo de 80%"',
      ],

      threeTabs: {
        tabsList: ['bins (CreditCard) "Por BIN"', 'issuers (Building) "Por Emissor"', 'trends (TrendingUp) "Tendências"'],

        // ─── TAB 1: BINS ───────────────────────────────────────────────
        binsTab: {
          filters: {
            search: 'Search input "Buscar por BIN, emissor ou bandeira..." → filter REAL aplicado em filteredBINs',
            brandSelect: 'w-130 h-9 (Todas/Visa/Mastercard/Elo) defaultValue all — gap: NÃO entra no filter',
            typeSelect: 'w-130 h-9 (Todos/Crédito/Débito) — gap: NÃO entra no filter',
          },

          eightBINs: [
            { bin: '411111', brand: 'Visa', type: 'Crédito', issuer: 'Banco do Brasil', approval: 92, volume: 'R$ 2.4M', txCount: '12.5K', trend: 'up' },
            { bin: '545454', brand: 'Mastercard', type: 'Crédito', issuer: 'Itaú', approval: 89, volume: 'R$ 1.8M', txCount: '9.2K', trend: 'stable' },
            { bin: '431940', brand: 'Visa', type: 'Débito', issuer: 'Bradesco', approval: 94, volume: 'R$ 1.5M', txCount: '15.8K', trend: 'up' },
            { bin: '523421', brand: 'Mastercard', type: 'Crédito', issuer: 'Santander', approval: 78, volume: 'R$ 980K', txCount: '5.1K', trend: 'down' },
            { bin: '636297', brand: 'Elo', type: 'Crédito', issuer: 'Caixa', approval: 85, volume: 'R$ 720K', txCount: '4.8K', trend: 'up' },
            { bin: '402400', brand: 'Visa', type: 'Crédito', issuer: 'Nubank', approval: 91, volume: 'R$ 650K', txCount: '7.2K', trend: 'up' },
            { bin: '516130', brand: 'Mastercard', type: 'Débito', issuer: 'Inter', approval: 87, volume: 'R$ 520K', txCount: '6.4K', trend: 'stable' },
            { bin: '457661', brand: 'Visa', type: 'Crédito', issuer: 'C6 Bank', approval: 73, volume: 'R$ 380K', txCount: '2.1K', trend: 'down' },
          ],

          binRow: {
            structure: 'flex gap-3 p-3 hover:bg-slate-50 border-b',
            elements: [
              'CreditCard 4x4 slate-600 em bg-slate-100',
              'bin font-mono semibold + brand Badge + type Badge bg-slate-50',
              'issuer 11px slate-500',
              'approval% bold + cor: ≥90 emerald-600 / ≥80 amber-600 / else red-600',
              'volume + txCount slate-700/500',
              'trend icon: up ArrowUpRight emerald / down ArrowDownRight red / stable null',
              'Eye ghost — gap: SEM onClick',
            ],
          },
        },

        // ─── TAB 2: ISSUERS ────────────────────────────────────────────
        issuersTab: {
          sixIssuers: [
            { name: 'Banco do Brasil', bins: 45, approval: 91, volume: 'R$ 8.2M', share: 22 },
            { name: 'Itaú Unibanco', bins: 38, approval: 89, volume: 'R$ 7.5M', share: 20 },
            { name: 'Bradesco', bins: 42, approval: 87, volume: 'R$ 6.8M', share: 18 },
            { name: 'Santander', bins: 28, approval: 82, volume: 'R$ 4.2M', share: 11 },
            { name: 'Nubank', bins: 12, approval: 93, volume: 'R$ 3.8M', share: 10 },
            { name: 'Caixa Econômica', bins: 35, approval: 85, volume: 'R$ 2.9M', share: 8 },
          ],

          issuerRow: {
            structure: 'Building indigo-600 + name + bins ativos + bar w-32 c/ width=approval% e cor threshold (≥88 #10B981 / ≥80 #F59E0B / else #EF4444) + volume + share%',
            gap: 'Sem CTA para drill down em emissor — apenas displays',
          },
        },

        // ─── TAB 3: TRENDS ─────────────────────────────────────────────
        trendsTab: {
          lineChartCard: {
            title: 'Aprovação por Emissor (7 dias)',
            chart: 'LineChart h-320',
            yDomain: '[70, 100] tickFormatter ${v}%',
            sevenDays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            fourLines: [
              'bb stroke #0066CC name="Banco do Brasil" dot r=3',
              'itau stroke #FF6600 name="Itaú"',
              'brad stroke #CC0033 name="Bradesco"',
              'sant stroke #EC0000 name="Santander"',
            ],
            dataMatrix: 'BB 89-93 / Itaú 86-90 / Brad 84-88 / Sant 78-83',
            gap: 'Apenas 4 emissores no chart vs 6 na tab Issuers — Nubank e Caixa ausentes',
          },
        },
      },

      knownGapsBINAnalysis: [
        'Brand+Type Selects sem efeito real no filter',
        'Eye action SEM onClick',
        'Botões Exportar/RefreshCw SEM onClick',
        'IssuerRow sem CTA drill-down',
        'Trends LineChart só 4 emissores (vs 6 issuers da Tab 2)',
        'KPI "BINs com Alerta 8" mas tabela mostra apenas 1 abaixo de 80% (BIN 457661=73%)',
        'Trend "stable" não tem icon visual (só up/down)',
        'BIN 6-digit fixed — não suporta 8-digit (mudança Mastercard 2022+)',
      ],
    },

    // ==========================================================================
    // SUB-DOC #3 — AdminIntRetryIntelligence (página mais rica)
    // ==========================================================================
    retryIntelligenceMicroscopic: {
      role: 'Recuperação inteligente de transações falhadas — retentativas + fallback PIX automatizado',

      pageHeader: {
        title: 'Retry Intelligence',
        subtitle: 'Gestão inteligente de retentativas e recuperação de transações',
        breadcrumbs: '[Transações → Retry Intelligence]',
        actions: [
          'Settings outline "Configurar" — gap: SEM onClick',
          'Sparkles bg-#2bc196 "Otimizar com IA" — gap: SEM onClick',
        ],
      },

      sixTopKPIs: {
        layout: 'grid grid-cols-2 md:grid-cols-6 gap-3',
        cards: [
          'RefreshCw blue + Transações Retriadas 8.2K + "Hoje"',
          'Target emerald + Taxa Recuperação 58% +4%',
          'DollarSign emerald + Volume Recuperado R$ 1.2M + "Este mês"',
          'QrCode teal + Fallback PIX 70% +8% + "Conversão"',
          'Clock amber + Tempo Médio Retry 2.4h',
          'Zap purple + Regras Ativas 3/4',
        ],
      },

      aiInsightBanner: {
        wrapper: 'Card gradient purple-50 to indigo-50 border-purple-100',
        icon: 'Sparkles 5x5 purple-600 em p-2 bg-purple-100',
        title: 'Insight de IA',
        text: 'Ativando o "Smart Retry - IA" você poderia recuperar mais R$ 85K/mês baseado no padrão das suas transações.',
        cta: 'Button bg-purple-600 "Ativar Agora" — gap: SEM onClick',
      },

      fourTabs: {
        tabsList: ['overview "Visão Geral"', 'rules (Settings) "Regras de Retry"', 'pix-fallback (QrCode) "Fallback PIX"', 'analysis (TrendingUp) "Análise"'],

        // ─── TAB 1: OVERVIEW ───────────────────────────────────────────
        overviewTab: {
          twoCharts: {
            hourlyAreaChart: {
              title: 'RefreshCw blue + Retentativas por Hora',
              chart: 'AreaChart c/ defs colorTent #94A3B8 / colorRec #10B981',
              sixHours: '00/04/08/12/16/20',
              twoAreas: ['tentativas slate', 'recuperadas emerald'],
              peak: '16h tentativas=920 recuperadas=644',
            },
            recoveryByReason: {
              title: 'Target emerald + Recuperação por Motivo',
              fiveReasons: [
                { reason: 'Saldo Insuficiente', total: 3240, recovered: 1620, rate: 50, color: '#10B981' },
                { reason: 'Timeout', total: 1850, recovered: 1572, rate: 85, color: '#3B82F6' },
                { reason: 'Erro Processador', total: 920, recovered: 828, rate: 90, color: '#8B5CF6' },
                { reason: 'Limite Excedido', total: 645, recovered: 258, rate: 40, color: '#F59E0B' },
                { reason: 'Cartão Bloqueado', total: 380, recovered: 38, rate: 10, color: '#EF4444' },
              ],
              barRow: 'reason w-28 truncate + bar h-2 width=rate% bg=color + rate% w-12 + recovered.toLocaleString w-20 10px',
            },
          },
        },

        // ─── TAB 2: RULES ──────────────────────────────────────────────
        rulesTab: {
          fourRetryRules: [
            {
              id: 1,
              name: 'Soft Decline - Saldo',
              description: 'Retenta transações recusadas por saldo após intervalo',
              maxRetries: 3,
              interval: '4h',
              successRate: 45,
              triggers: ['Código 51', 'Código 61', 'Insufficient funds'],
              recovered: 'R$ 245K',
              enabled: true,
            },
            {
              id: 2,
              name: 'Timeout & Erros Técnicos',
              description: 'Retentativa imediata para falhas de comunicação',
              maxRetries: 2,
              interval: '30s',
              successRate: 85,
              triggers: ['Timeout', 'Network error', 'Erro 500'],
              recovered: 'R$ 180K',
              enabled: true,
            },
            {
              id: 3,
              name: 'Limite Diário',
              description: 'Tenta novamente no dia seguinte',
              maxRetries: 1,
              interval: '24h',
              successRate: 35,
              triggers: ['Daily limit', 'Código 65'],
              recovered: 'R$ 98K',
              enabled: true,
            },
            {
              id: 4,
              name: 'Smart Retry - IA',
              description: 'Retentativa inteligente baseada em machine learning',
              maxRetries: 2,
              interval: 'Auto',
              successRate: 62,
              triggers: ['Análise preditiva', 'Score de recuperação'],
              recovered: 'R$ 312K',
              enabled: false,
            },
          ],

          retryRuleCard: {
            structure: 'p-4 rounded-xl + iconBox + RefreshCw + name + Switch',
            threeMiniKPIs: 'grid grid-cols-3 gap-3 + maxRetries / successRate% emerald / interval blue (cada em bg-slate-50 rounded text-center)',
            triggers: 'flex gap-1.5 + Badges variant=outline 10px',
            footer: 'DollarSign + Recuperado: bold emerald-600 + Settings "Configurar" — handlers vazios',
          },

          retriableCodesHelp: {
            wrapper: 'Card slate-50 border-slate-200',
            title: 'Códigos de recusa retriáveis (soft declines):',
            fiveBadges: [
              '51 - Saldo Insuficiente',
              '61 - Excede Limite',
              '65 - Limite Diário',
              '91 - Emissor Indisponível',
              '96 - Erro no Sistema',
            ],
          },
        },

        // ─── TAB 3: PIX FALLBACK ───────────────────────────────────────
        pixFallbackTab: {
          fallbackFlowVisualizer: {
            wrapper: 'Card gradient teal-50 to cyan-50 border-teal-100',
            header: 'QrCode teal-600 + "Fallback Automático para PIX" + "Após falhas no cartão, oferece PIX automaticamente ao cliente" + Switch pixFallbackEnabled',
            visualFlow: {
              container: 'flex items-center justify-center gap-2 p-4 bg-white/50 rounded-xl',
              fourBoxesWithArrows: [
                'Box1: CreditCard blue-500 + "1ª Tentativa" + "Cartão" min-w-100',
                'ArrowRight slate-400',
                'Box2: CreditCard amber-500 + "2ª Tentativa" + "Outro Adquirente"',
                'ArrowRight slate-400',
                'Box3: XCircle red-500 + "Falha" red-600 + "Cartão Recusado" border-red-200',
                'ArrowRight teal-500 (DESTAQUE)',
                'Box4: QrCode teal-600 + "Fallback PIX" teal-700 bold + "QR Code Automático" + bg-teal-50 border-2 border-teal-400 min-w-120 (DESTAQUE)',
              ],
            },
          },

          configAndStats: {
            layout: 'grid lg:grid-cols-2 gap-4',

            configCard: {
              title: 'Settings + "Configurações do Fallback"',
              threeSettings: [
                {
                  label: 'Oferecer PIX após',
                  desc: 'Número de tentativas falhas no cartão',
                  control: 'Select pixFallbackAfter (1/2/3 falhas, default 2)',
                },
                {
                  label: 'Mensagem Personalizada',
                  desc: 'Exibir sugestão amigável ao cliente',
                  control: 'Switch defaultChecked',
                },
                {
                  label: 'Desconto PIX',
                  desc: 'Oferecer desconto para incentivar PIX',
                  control: 'Select 4 opções (0/3/5/10% default 0)',
                },
              ],
              messagePreview: {
                wrapper: 'p-3 bg-blue-50 border-blue-100',
                icon: 'MessageSquare blue-600',
                title: 'Mensagem exibida ao cliente:',
                text: 'italic blue-700 — "Ops! Tivemos um problema com seu cartão. Que tal pagar com PIX? É rápido, seguro e seu pedido é confirmado na hora! 🚀"',
                gap: 'Mensagem hardcoded — sem editor para customizar',
              },
            },

            statsCard: {
              title: 'TrendingUp emerald + "Performance do Fallback PIX"',
              twoTopMetrics: 'grid grid-cols-2 + PIX Oferecidos 1.840 / Convertidos 1.288 emerald',
              conversionBar: 'Taxa de Conversão 70% bold emerald + bar h-3 gradient teal→emerald width=70%',
              twoBottomMetrics: 'Volume Recuperado R$ 520K bold emerald / Ticket Médio PIX R$ 403 bold',
            },
          },

          fallbackCodesHelp: {
            title: 'Códigos que ativam o fallback PIX:',
            sixBadges: [
              '51 - Saldo Insuficiente',
              '61 - Excede Limite',
              '65 - Limite Diário',
              '05 - Não Autorizada',
              '14 - Cartão Inválido',
              '57 - Transação não permitida',
            ],
          },
        },

        // ─── TAB 4: ANALYSIS ───────────────────────────────────────────
        analysisTab: {
          empty: 'Card centered + TrendingUp 12x12 slate-300 + h3 "Análise Avançada" + "Relatórios detalhados de performance de retry em desenvolvimento."',
          gap: 'Tab declarada mas sem conteúdo — placeholder',
        },
      },

      knownGapsRetryIntelligence: [
        'Botão "Otimizar com IA" / "Ativar Agora" / "Configurar" SEM onClick',
        'RetryRuleCard onToggle/onEdit handlers vazios',
        'Switches Mensagem Personalizada / Fallback principal sem onChange real',
        'pixFallbackAfter Select state existe mas sem persistência',
        'Mensagem cliente hardcoded sem editor',
        'Tab Analysis vazia (placeholder)',
        'Smart Retry IA enabled=false mas R$ 312K recovered (?)',
        'KPI "Regras Ativas 3/4" coerente com 4 retryRules onde 1 disabled',
        'Tabs Rules e PIX Fallback têm helps de codes diferentes (5 vs 6) — confuso',
        'Visual Flow estático — não anima ou simula',
      ],
    },

    // ==========================================================================
    // SUB-DOC #4 — AdminIntBatchProcessing
    // ==========================================================================
    batchProcessingMicroscopic: {
      role: 'Operações em massa via CSV — refund/capture/cancel/webhook em lote com tracking',

      pageHeader: {
        title: 'Processamento em Lote',
        subtitle: 'Execute operações em massa de forma segura e rastreável',
        breadcrumbs: '[Transações → Processamento em Lote]',
        actions: ['History "Ver Histórico Completo" outline sm — gap: SEM onClick'],
      },

      stateAndFlow: {
        operationType: 'string (refund/capture/cancel/webhook) — controla seleção',
        file: 'File object via drag-drop OR input change',
        isDragging: 'boolean para visual feedback',
      },

      twoColumnLayout: {
        leftColumn: {
          newOperationCard: {
            title: 'Layers #2bc196 + "Nova Operação em Lote"',
            description: 'Selecione o tipo de operação e faça upload do arquivo CSV',

            fourOperations: [
              { id: 'refund', icon: 'RefreshCw', title: 'Estorno em Lote', description: 'Estornar múltiplas transações de uma vez', color: 'purple' },
              { id: 'capture', icon: 'CheckCircle2', title: 'Captura em Lote', description: 'Capturar transações pré-autorizadas', color: 'emerald' },
              { id: 'cancel', icon: 'XCircle', title: 'Cancelamento em Lote', description: 'Cancelar transações pendentes', color: 'red' },
              { id: 'webhook', icon: 'Zap', title: 'Reenvio de Webhooks', description: 'Reenviar notificações para URLs configuradas', color: 'blue' },
            ],

            operationCard: {
              structure: 'p-4 rounded-xl border-2 cursor-pointer + selected → border-#2bc196 bg-#2bc196/5 / unselected → border-slate-200 hover:bg-slate-50',
              elements: [
                'iconBox p-2 + Icon (cor por color)',
                'title sm semibold (#2bc196 IF selected)',
                'description xs slate-500',
                'IF selected → CheckCircle2 5x5 #2bc196 absolute right',
              ],
              gap: 'Cores Tailwind dinâmicas via template literal `bg-${color}-50` — pode ser purgado em produção',
            },

            formatHint: {
              conditional: 'IF operationType selected',
              wrapper: 'p-3 bg-blue-50 border-blue-100',
              icon: 'Info blue-600',
              title: 'Formato esperado:',
              dynamicCode: {
                refund: 'transaction_id,amount,reason',
                capture: 'transaction_id,amount',
                cancel: 'transaction_id,reason',
                webhook: 'transaction_id',
              },
            },
          },
        },

        rightColumn: {
          uploadCard: {
            title: 'FileUp #2bc196 + "Upload de Arquivo"',
            description: 'Arraste ou selecione um arquivo CSV com os IDs das transações',

            dropZone: {
              wrapper: 'border-2 border-dashed rounded-xl p-8 text-center',
              threeStates: [
                'isDragging → border-#2bc196 bg-#2bc196/5',
                'file loaded → border-emerald-300 bg-emerald-50',
                'default → border-slate-200 hover:border-slate-300',
                'IF !operationType → opacity-50 pointer-events-none',
              ],
              fileLoadedState: 'FileSpreadsheet 12x12 emerald-500 + name semibold + size KB + "Remover arquivo" Button red',
              defaultState: 'Upload 12x12 + "Arraste o arquivo CSV aqui" / "Solte o arquivo aqui" + "ou clique para selecionar" + Input hidden + label htmlFor "Selecionar Arquivo"',

              dropHandlers: {
                handleDragOver: 'preventDefault + setIsDragging(true)',
                handleDragLeave: 'setIsDragging(false)',
                handleDrop: 'preventDefault + IF type=text/csv OR endsWith(.csv) → setFile + toast.success / ELSE toast.error("Apenas arquivos CSV são aceitos")',
              },
            },

            threeButtons: [
              {
                button: 'Baixar Template outline sm',
                disabled: '!operationType',
                onClick: 'toast.info("Download do template iniciado")',
                gap: 'NÃO baixa arquivo real — apenas toast',
              },
              {
                button: 'Validar outline sm CheckCircle2',
                disabled: '!file || !operationType',
                onClick: 'toast.success("Validação concluída! 150 registros encontrados.")',
                gap: 'Não valida nada — toast hardcoded "150 registros"',
              },
              {
                button: 'Processar Lote bg-#2bc196 Zap (full width)',
                disabled: '!file || !operationType',
                onClick: 'toast.success("Lote enviado para processamento!")',
                gap: 'Não envia para nada — toast only',
              },
            ],
          },
        },
      },

      historyCard: {
        title: 'History slate-500 + "Histórico de Processamentos"',
        rightLabel: 'span xs slate-500 "Últimos 30 dias"',

        sevenColumnsTable: [
          'ID do Lote — font-mono xs [#2bc196]',
          'Data/Hora',
          'Operação — font-medium',
          'Usuário — slate-500',
          {
            header: 'Progresso (text-center)',
            cell: 'Progress h-1.5 value=(success/total)*100 + "{success}/{total}" + IF failed>0 → "{failed} falhas" red-500',
          },
          'Status — StatusBadge inline (4 estados: completed/processing/failed/pending)',
          'Ações — Eye ghost h-7 w-7 — gap: SEM onClick',
        ],

        fourBatchMocks: [
          { id: 'LOT-001', date: '28/01/2026 14:32', operation: 'Estorno', user: 'admin@pagsmile.com', total: 150, success: 148, failed: 2, status: 'completed' },
          { id: 'LOT-002', date: '27/01/2026 10:15', operation: 'Webhook', user: 'ops@pagsmile.com', total: 500, success: 500, failed: 0, status: 'completed' },
          { id: 'LOT-003', date: '26/01/2026 16:45', operation: 'Captura', user: 'admin@pagsmile.com', total: 75, success: 75, failed: 0, status: 'completed' },
          { id: 'LOT-004', date: '25/01/2026 09:20', operation: 'Estorno', user: 'finance@pagsmile.com', total: 200, success: 195, failed: 5, status: 'completed' },
        ],

        statusBadgeInline: {
          fourStatuses: [
            'completed CheckCircle2 emerald',
            'processing RefreshCw blue + animate-spin',
            'failed XCircle red',
            'pending Clock amber',
          ],
          gap: 'Mocks só têm "completed" — sem exemplo de processing/failed/pending visível',
          gap2: 'Bug no statusBadge component: const { config } = ... || config.pending — config é redeclarada mesmo sendo undefined no fallback (pode crashar se status inválido)',
        },
      },

      knownGapsBatchProcessing: [
        'Tailwind dinâmico bg-${color}-50 / text-${color}-600 — risco de purge em produção',
        'StatusBadge component bug: fallback config.pending circular reference',
        'Baixar Template não baixa arquivo real',
        'Validar não valida (toast hardcoded "150 registros")',
        'Processar Lote não envia (toast only)',
        '4 mocks todos status=completed',
        'Botão "Ver Histórico Completo" SEM onClick',
        'Eye action no histórico SEM onClick',
        'Sem visualização de erros do CSV (linhas com falha)',
        'Sem confirmação dupla antes de processar (ações destrutivas)',
        'Sem preview dos primeiros registros do CSV',
        'CSV format só uma coluna obrigatória — sem exemplo completo',
      ],
    },

    // ==========================================================================
    // SUB-DOC #5 — AdminIntReconciliation
    // ==========================================================================
    reconciliationMicroscopic: {
      role: 'Conciliação entre transações registradas e arquivos de liquidação dos adquirentes',

      pageHeader: {
        title: 'Conciliação',
        breadcrumbs: '[Transações → Conciliação]',
      },

      fiveStatsBar: {
        layout: 'grid grid-cols-2 md:grid-cols-5 gap-4',
        stats: [
          'Conciliadas — bg-green-50 + 12.340 verde + 99.1%',
          'Pendentes — bg-yellow-50 + 103 amarelo + 0.8%',
          'Divergentes — bg-red-50 + 12 vermelho + 0.1%',
          'Total — bg-slate-50 + 12.455',
          'Valor Conciliado — bg-blue-50 + R$ 2.543.890,00 azul',
        ],
        gap: '99.1+0.8+0.1=100% perfeito mas hardcoded — sem indicador de variação',
      },

      threeTabs: {
        defaultValue: 'divergent',
        triggers: [
          'reconciled "Conciliadas"',
          'pending "Pendentes"',
          'divergent "Divergências" + IF stats.divergent>0 → Badge destructive count',
        ],

        // ─── TAB 1: DIVERGENT (única populada) ────────────────────────
        divergentTab: {
          headerLeft: 'AlertTriangle red-500 + "Divergências Encontradas"',
          headerRight: 'Download outline sm "Exportar" — gap: SEM onClick',

          sevenColumnsTable: [
            'ID Div. — font-mono xs',
            'Transação — font-mono xs (mostra "-" se null)',
            'Adquirente',
            'Valor TXN — text-right (formatCurrency ou "-")',
            'Valor Liquidado — text-right',
            'Diferença — text-right bold red-600',
            {
              header: 'Ação (text-center)',
              cell: 'Button outline sm "Resolver" — gap: SEM onClick',
            },
          ],

          threeMockDivergences: [
            { id: 'DIV-001', txId: 'TXN-12345', acquirer: 'Cielo', txValue: 100, liquidValue: 99.50, diff: 0.50, scenario: 'TX existe + valor liquidado menor (taxa cobrada extra)' },
            { id: 'DIV-002', txId: 'TXN-12400', acquirer: 'Rede', txValue: 250, liquidValue: null, diff: 250, scenario: 'TX existe + sem liquidação (não pagou)' },
            { id: 'DIV-003', txId: null, acquirer: 'Stone', txValue: null, liquidValue: 75, diff: 75, scenario: 'Sem TX + valor liquidado (transação fantasma)' },
          ],

          rowHover: 'border-b hover:bg-red-50',
        },

        // ─── TAB 2: RECONCILED (placeholder) ──────────────────────────
        reconciledTab: {
          empty: 'Card py-12 text-center "{N} transações conciliadas com sucesso"',
        },

        // ─── TAB 3: PENDING (placeholder) ─────────────────────────────
        pendingTab: {
          empty: 'Card py-12 text-center "{N} transações aguardando arquivo de liquidação"',
        },
      },

      knownGapsReconciliation: [
        'Apenas Divergent populado — outras 2 tabs são placeholders',
        'Resolver Button SEM onClick (ação crítica financeira)',
        'Exportar SEM onClick',
        'Sem filtros (período/adquirente/range valor)',
        'Sem upload de arquivo de liquidação',
        'Sem visualização do detalhe da divergência (raw rows do arquivo)',
        '3 mocks ilustram cenários mas sem mecanismo de resolução real',
        'Página 142 linhas — uma das menores do Admin Interno',
        'Diferença sempre red-600 mesmo quando favorável (DIV-003 R$75 a favor)',
        'Sem audit trail de quem resolveu cada divergência',
      ],
    },

    // ==========================================================================
    // SUB-DOC #6 — AdminIntTransactionReports
    // ==========================================================================
    reportsListMicroscopic: {
      role: 'Geração on-demand de 7 tipos de relatórios em 3 formatos com fila de processamento',

      pageHeader: {
        title: 'Relatórios de Transações',
        breadcrumbs: '[Transações → Relatórios]',
      },

      generateForm: {
        wrapper: 'Card + CardHeader "Gerar Novo Relatório"',
        threeFieldsGrid: {
          layout: 'grid grid-cols-3 gap-4',

          typeField: {
            label: 'Tipo',
            select: 'placeholder Selecione...',
            sevenReportTypes: [
              { value: 'daily', label: 'Resumo Diário', desc: 'Volume, TPV, taxas por dia' },
              { value: 'merchant', label: 'Performance por Merchant', desc: 'Métricas por merchant' },
              { value: 'approval', label: 'Taxa de Aprovação', desc: 'Análise de aprovações/negativas' },
              { value: 'method', label: 'Transações por Método', desc: 'Breakdown por método de pagamento' },
              { value: 'denials', label: 'Análise de Negativas', desc: 'Detalhamento de recusas' },
              { value: 'reconciliation', label: 'Conciliação', desc: 'Relatório de conciliação' },
              { value: 'disputes', label: 'Chargebacks/MEDs', desc: 'Contestações do período' },
            ],
            descBelow: 'IF reportType selected → p text-xs slate-500 "{desc}"',
          },

          periodField: {
            label: 'Período',
            select: 'placeholder Selecione...',
            sevenOptions: ['today', 'yesterday', '7d', '30d', 'month', 'lastmonth', 'custom'],
            gap: 'custom NÃO abre date picker — só value sem efeito',
          },

          formatField: {
            label: 'Formato',
            select: 'defaultValue=xlsx',
            threeOptions: ['xlsx (Excel)', 'csv', 'pdf'],
          },
        },

        generateButton: {
          element: 'Button FileText "Gerar Relatório"',
          disabled: '!reportType || !period',
          onClick: 'toast.success("Relatório gerado!")',
          gap: 'Toast-only — sem geração real do arquivo',
        },
      },

      generatedReportsTable: {
        title: 'Relatórios Gerados',

        sixColumns: [
          'ID — font-mono xs',
          'Nome — font-medium',
          'Período',
          'Gerado',
          {
            header: 'Status',
            cell: 'IF ready → Badge green CheckCircle "Pronto" / ELSE Badge blue Clock animate-spin "Gerando"',
          },
          {
            header: 'Ações (text-center)',
            cells: [
              'IF ready → Download Button → toast.success(Download iniciado!) + Trash2 red-600 → toast.success(Relatório excluído!)',
              'IF generating → "-" slate-400',
            ],
          },
        ],

        fourMockReports: [
          { id: 'REL-001', name: 'Resumo Diário', period: '28/01/2026', generated: '14:30', status: 'ready', format: 'XLSX' },
          { id: 'REL-002', name: 'Performance por Merchant', period: 'Jan/2026', generated: '10:00', status: 'ready', format: 'XLSX' },
          { id: 'REL-003', name: 'Análise de Negativas', period: '7 dias', generated: 'Ontem', status: 'ready', format: 'PDF' },
          { id: 'REL-004', name: 'Conciliação', period: '27/01/2026', generated: '08:00', status: 'generating', format: 'XLSX' },
        ],

        gap: 'Format column existe nos mocks mas NÃO é renderizada na tabela (apenas declarada)',
      },

      knownGapsReports: [
        '"Gerar Relatório" só toast — não gera arquivo',
        'Period "custom" SEM date picker',
        'Download SEM file real (apenas toast)',
        'Trash2 SEM confirmação antes de excluir',
        'Format dos mocks não renderizada',
        'Sem filtros na lista de reports gerados (data/tipo/usuário)',
        'Sem paginação',
        'Sem indicador de tamanho do arquivo',
        'Sem expiração visível (relatórios antigos ficam para sempre?)',
        'Sem agendamento recorrente (apenas on-demand)',
        '4 mocks todos do mesmo dia/mês — sem variação temporal',
      ],
    },
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocations: {
      orchestration: 'pages/AdminIntOrchestration.jsx (445 linhas)',
      binAnalysis: 'pages/AdminIntBINAnalysis.jsx (290 linhas)',
      retryIntelligence: 'pages/AdminIntRetryIntelligence.jsx (528 linhas — mais rica)',
      batchProcessing: 'pages/AdminIntBatchProcessing.jsx (327 linhas)',
      reconciliation: 'pages/AdminIntReconciliation.jsx (142 linhas — minimalista)',
      reports: 'pages/AdminIntTransactionReports.jsx (156 linhas)',
    },

    backendIntegrationMap: {
      orchestration: 'NENHUMA — 5 acquirers + 4 rules + 3 overrides hardcoded',
      binAnalysis: 'NENHUMA — 8 BINs + 6 issuers + approvalTrend hardcoded',
      retryIntelligence: 'NENHUMA — 5 reasons + 6 hours + 4 retryRules + pixFallbackStats hardcoded',
      batchProcessing: 'NENHUMA — 4 batches + 4 operations + handlers toast-only',
      reconciliation: 'NENHUMA — stats + 3 divergences hardcoded',
      reports: 'NENHUMA — 4 reports + 7 types + handlers toast-only',
    },

    componentReuseMap: {
      KPICard: 'INLINE em Orchestration (não usa) / BINAnalysis (4 cores) / Retry (6 cores) — não consolidado',
      AcquirerCard: 'inline component em Orchestration apenas',
      RuleCard: 'inline em Orchestration',
      RetryRuleCard: 'inline em Retry',
      OperationCard: 'inline em Batch',
      'BINRow / IssuerRow': 'inline em BINAnalysis',
      MerchantOverrideRow: 'inline em Orchestration',
      StatusBadge: 'inline em Batch + Reports (não compartilha o common StatusBadge!)',
    },

    crossPageRelationships: {
      orchestration_to_merchant: 'Tab Merchants → Link AdminIntMerchantProfile?id={merchant.id}',
      retry_codes_match_orchestration: 'Códigos 51/61/65 aparecem em Retry rules + Fallback PIX',
      reports_to_reconciliation: 'Reports type "reconciliation" referencia AdminIntReconciliation',
      reports_to_disputes: 'Reports type "disputes" referencia AdminIntChargebacksList/MEDsList (cross-section Risco)',
      batch_no_links: 'Batch processing isolado — não linka para tx individuais',
    },

    knownGapsCrossPage: [
      'KPICard duplicado em 5+ páginas (Dashboard/List/BIN/Retry com 4-7 cores cada)',
      'StatusBadge inline em Batch+Reports — não usa o common StatusBadge da Conciliation/Detail',
      'Tailwind classes dinâmicas em OperationCard (Batch) — risco de purge',
      'Toast-only handlers em TODAS as 6 páginas (Sync/Save/Generate/Process/Resolve/Download)',
      'Switches em Orchestration+Retry sem onChange real',
      'GripVertical em Orchestration sem dnd implementado',
      'Códigos de recusa repetidos: 51/61/65 em Retry/Fallback/Reports — duplicação',
      'BIN 6-digit fixed (Mastercard 8-digit não suportado)',
      'Reconciliation Tabs Pending+Reconciled vazias (placeholders)',
      'Reports Period "custom" sem date picker',
      'Sem audit trail visível em Batch/Reconciliation/Reports',
      'Operations destrutivas (Batch refund/cancel) sem confirm dialog',
      'Reports format declarado mas não renderizado',
      'Tab Analysis em Retry vazia',
    ],
  },
};

export default AdminIntTransactionsOpsDoc;