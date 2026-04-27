// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — AGENTES IA ADMIN INTERNO (Parte 1/2)
// ----------------------------------------------------------------------------
// Cobre 3 PRIMEIROS agentes do array `aiAgentsAdminInterno` em layout.jsx
// (linhas 415-421), seção sidebar separada renderizada APÓS o `menuItems`:
//
//   1. AdminIntPagSmileCopilot.jsx          (878 linhas) — Hub principal c/ Tabs Dashboard+Settings + Chat + FloatingButton
//   2. AdminIntPagSmileCopilotSettings.jsx  (359 linhas) — Settings standalone 4 Tabs (Geral/Alertas/Relatórios/Notificações)
//   3. AdminIntRecoveryAgent.jsx            (350 linhas) — Hub global de recuperação 3 Tabs + 2 Charts Recharts + 5 merchants + Insight IA
//   4. AdminIntRecoveryAgentSettings.jsx    (366 linhas) — Settings 4 Tabs (Geral/Canais/Thresholds/Notificações) c/ Slider
//   5. AdminIntConverterAgent.jsx           (385 linhas) — Hub global de conversão 3 Tabs + 2 Charts + Devices + Experiments
//   6. AdminIntConverterAgentSettings.jsx   (409 linhas) — Settings 4 Tabs (Global/Experimentos/Monitoramento/Notificações)
//
// PADRÃO TRANSVERSAL CRÍTICO:
// - 6 páginas 100% MOCK — zero entity, zero useQuery, zero SDK
// - 3 hubs (PagSmileCopilot/Recovery/Converter) usam AgentChatInterface + AgentFloatingButton
//   importando processX e quickPrompts de @/components/agents/XChatLogic
// - PagSmileCopilot é DUPLICADO: tem state interno `copilotSettings` Tab "Configurações"
//   E TAMBÉM página separada AdminIntPagSmileCopilotSettings com state idêntico (sem sync)
// - Recovery e Converter SÓ TÊM hub + settings page separada (NÃO duplicam settings inline)
// - Settings pages são sempre `alert()` no save (não toast.success) — gap UX
// - Cada agente tem CORES distintas hardcoded:
//   PagSmile = purple #a855f7 / Recovery = orange #f97316 / Converter = blue #3b82f6
// - Header sempre tem ArrowLeft button para voltar ao hub correspondente
// ============================================================================

export const AdminIntAgentsPart1Doc = {
  pageId: 'AdminIntAgentsPart1',
  pagePaths: [
    '/AdminIntPagSmileCopilot',
    '/AdminIntPagSmileCopilotSettings',
    '/AdminIntRecoveryAgent',
    '/AdminIntRecoveryAgentSettings',
    '/AdminIntConverterAgent',
    '/AdminIntConverterAgentSettings',
  ],
  module: 'Admin Interno',
  section: 'Agentes IA — Parte 1: PagSmile Copilot + Recovery Agent + Converter Agent (3 hubs + 3 settings)',

  explainer: {
    oneLiner:
      'Primeira metade dos 5 Agentes IA do Admin Interno (sidebar separada `aiAgentsAdminInterno` linhas 415-421 do layout.jsx) — 6 páginas (3 hubs + 3 settings) — TODAS 100% MOCK. (1) AdminIntPagSmileCopilot 878L é o agente PRINCIPAL e MAIOR de todos — Header c/ Sparkles purple gradient + título "PagSmile Copilot" + subtítulo "Copiloto Interno para Gestão de Operações" + Badge live "Monitorando 1.247 merchants" pulsante + Button outline "Configurar" → `createPageUrl("AdminIntPagSmileCopilotSettings")` (página separada, MAS state copilotSettings DUPLICADO INLINE no Tab "Configurações" desta mesma página — gap CRÍTICO de duplicação); 6 BLOCOS principais empilhados antes do Tabs final: (a) Card Resumo Executivo grid-5 com 5 KPI boxes (TPV Total R$ 47.3M c/ Badge purple +12.4% TrendingUp / Merchants Ativos 1247 c/ Badge green +23 / Receita R$ 892.450 c/ Badge purple +8.7% / Margem Média 1.89% c/ Badge outline amber -0.02% / Chargeback Ratio 0.87% c/ Badge outline red TrendingUp +0.12%) usando whitespace-nowrap+overflow-hidden+text-ellipsis em todos os labels e truncate nos values; (b) Card Insights Operacionais com 4 cards coloridos por type (warning amber / opportunity purple / success green / info blue/slate-default) cada um com Icon condicional dinâmico (AlertTriangle / Lightbulb / CheckCircle2 / Activity) + Button outline com Link `createPageUrl(insight.actionPage)` que navega para AdminIntRiskDashboard, AdminIntMerchantsList, AdminIntComplianceQueue, AdminIntTransactionsDashboard (4 cross-page links REAIS); (c) grid-2 com Top Merchants por Margem (5 itens hardcoded TechStore/Fashion/GameZone/Pharma/AutoParts c/ rank #N + nome + TPV+Taxa + margem purple bold + ícones trend up/down/stable inline) com Link "Ver todos" → AdminIntClientProfitability + Saúde do Portfólio (4 categorias healthy/attention/critical/blocked c/ barras horizontais coloridas em altura h-8 com `width: ${Math.max(item.data.percentage, 10)}%` — Math.max forçando mínimo 10% pra ficar visível visualmente — count dentro da barra branco bold + GMV à direita); (d) Card Sugestões de Otimização de Taxa Table 8-col com 3 clusters mock (E-commerce Alto Volume +R$ 23.450/mês churn=low / Marketplaces -R$ 8.200/mês churn=high "Retenção de clientes estratégicos" reason / SaaS/Recorrência +R$ 15.780/mês churn=medium) — coloração condicional do Badge taxa sugerida por COMPARAÇÃO numérica `parseFloat(opt.suggestedRate) > parseFloat(opt.currentAvgRate) ? green : amber` + impacto receita green/red por startsWith("+") + churn Badge outline 3 cores + npsImpact green/amber por startsWith("+") + Button "Simular" SEM onClick; (e) Card Alertas em Tempo Real com 3 alerts mock 3 types (critical TechStore volume 300% acima / warning concentração 23% TPV em 3 merchants / info recorde PIX 45.230 transações) usando red/amber/blue color scheme; (f) Tabs PRINCIPAL com 2 tabs "dashboard" (apenas mostra Card "Navegação Rápida" com 4 LinkCards para AdminIntRecoveryAgent / AdminIntDisputeManager / AdminIntIdentityOnboarder / AdminIntConverterAgent — cross-link entre os 5 agentes) e "settings" (DUPLICA toda a config — General+Data Sources / Alerts grid-2 / Reports+Notifications grid-2 + Save button); (g) AgentChatInterface + AgentFloatingButton FIXED position com accentColor="#a855f7" (purple) importando processPagSmileCopilotMessage de @/components/agents/PagSmileCopilotChatLogic — UNICO chat REAL desta entrega; (2) AdminIntPagSmileCopilotSettings 359L é a SEPARATE settings page — Header c/ ArrowLeft → AdminIntPagSmileCopilot + Sparkles purple + 2 buttons Resetar+Salvar; settings state IDÊNTICO ao copilotSettings inline da página principal (16 keys: copilotEnabled / proactiveSuggestions / 4 dataSources / 3 alerts c/ thresholds / 2 reports c/ weeklyReportDay / 4 notifications); 4 Tabs: "general" (Card Configurações Gerais 2 switches + Card Fontes de Dados c/ map de 4 itens (TPV BarChart3 blue / merchant TrendingUp green / revenue TrendingUp emerald / risk AlertTriangle red) — cada um com Icon dinâmico) / "alerts" (3 row Card c/ Switch+Input number disabled-quando-switch-off para Anomalia Volume %/Risco Churn score/Queda Receita %) / "reports" (2 rows Weekly+Monthly c/ Select 5 weekdays disabled-when-switch-off + Switch) / "notifications" (Email Switch + Input emails CONDICIONAL `IF notifyByEmail` em pl-4 border-l-2 blue / Slack Switch + Input webhook CONDICIONAL `IF notifyBySlack` em border-l-2 purple); save button executa `alert("Configurações do PagSmile Copilot salvas com sucesso!")` BROWSER ALERT (não toast.success) — gap UX inconsistente; (3) AdminIntRecoveryAgent 350L é o hub global da recuperação de pagamentos — Header com RefreshCw orange-to-red gradient + Badge "847 merchants ativos" + Button → AdminIntRecoveryAgentSettings; KPI grid-6 hardcoded (GMV em Risco amber R$ 4.2M / GMV Recuperado green R$ 2.3M / Taxa Global 54.8% / Merchants 847 / Comunicações 125.430 toLocaleString / Tempo Médio 1.2h); Tabs principal com 3 tabs "overview"+"merchants"+"scenarios": (a) overview tem grid-2 com LineChart Recharts "Evolução Mensal" (5 meses Set→Jan, 2 lines stroke #94a3b8 atRisk + #2bc196 recovered strokeWidth 2/3) + BarChart Recharts "Performance por Cenário" (5 cenários Saldo Insuficiente/Limite Excedido/PIX Pendente/Abandono/Erro Técnico, 2 bars volume gray + recovered green) + Card Insight IA destaque purple gradient "5 merchants com taxa <40% precisam atenção, recuperação adicional R$ 320.000/mês" + Button → AdminIntMerchantsList; (b) merchants tab Card com Search+Filter button + 5 merchants em rows verticais com Avatar Store + nome bold + "Em risco R$ Xk Recuperado R$ Xk" + rate percent bold + Progress h-2 + statusBadge (excellent green/good blue/average amber/needs_attention red) + Button Eye SEM onClick efetivo; (c) scenarios tab grid-3 cards com 5 cenários reusando scenarioData hardcoded (volume/recovered/rate%) c/ Progress h-2; AgentChatInterface + AgentFloatingButton accentColor="#f97316" (orange) processRecoveryAgentAdminMessage; (4) AdminIntRecoveryAgentSettings 366L — Header amber-orange gradient + ArrowLeft → AdminIntRecoveryAgent + Resetar+Salvar amber-600 (cor diferente do hub que usa orange-to-red); 4 Tabs: "general" 2 switches (Agente Ativo / Retry Automático) + Slider min=1 max=5 step=1 com "{N} tentativas" + Select intervalo 4 opts (15/30/60/120 min) — usa Slider shadcn / "channels" 4 rows com Switch+Badge "Recomendado" green nos canais SMS+WhatsApp (não em E-mail+Push) — taxas de abertura HARDCODED no description ("SMS 98% / Email 45% / WhatsApp 95%") / "thresholds" 3 inputs R$ Mín/Máx/Alta Prioridade + Slider Janela 1-14 dias / "notifications" 3 rows + Input type="time" para summaryTime disabled-when-switch-off; SAVE = `alert()`; (5) AdminIntConverterAgent 385L hub global de conversão de checkout — Header Shuffle blue-indigo gradient + Badge "892 merchants ativos" + Button → AdminIntConverterAgentSettings; KPI grid-4 (Conversão Média green 74.2% +5.8% / Abandono Médio red 25.8% -4.2% — gap visual: -4.2 abandono é POSITIVO mas Badge fica green em ambos / Experimentos Ativos 23 / Revenue Incremental [#2bc196] R$ 1.2M); Tabs 3: (a) overview LineChart Recharts conversão+abandono 5 meses + Card "Performance por Dispositivo" 3 rows (Mobile Smartphone blue 68% tráfego / 72% conv / Desktop Monitor purple 28% / 82% / Tablet Monitor amber 4% / 76%) cada com Progress h-2 + Insight amber "Mobile tem 68% tráfego mas menor conversão" + Card AI Insights purple "PIX First com 245 merchants, recomendar global, +R$ 180k/mês" Button "Aplicar Global" SEM onClick; (b) merchants tab 5 merchants em rows com 4 colunas centro de stats (Conversão green / Abandono red / Lift conditional bg-green-100 OR bg-red-100 por startsWith("+") / status Badge); (c) experiments tab Card "Experimentos Globais" com 4 experimentos (PIX First Global 245 merchants +11.2% winner / 1-Step Layout 178 +7.8% positive / Campos Reduzidos 312 +4.5% positive / Desconto PIX 5% 156 +15.3% winner) styled green-300/blue-200 borders condicionais com IF winner → CheckCircle2 white em circle green; AgentChatInterface accentColor="#3b82f6" (blue) processConverterAgentAdminMessage; (6) AdminIntConverterAgentSettings 409L é A MAIOR settings page — Header Shuffle blue-indigo + Resetar+Salvar blue-600; settings state com 17 keys agrupadas em 5 buckets (Global 4 / A/B Tests 4 / Personalization 2 / Default Rules 3 / Monitoring 4 / Notifications 5); 4 Tabs: "global" tem 2 Cards (Configurações Globais c/ 3 switches + Slider confidenceLevel 90-99% / Regras de Personalização Padrão c/ 3 switches em rows com Smartphone+Clock+Target icons sobre bg-slate-50 estilizado different) / "experiments" (Select max tests 4 opts + Input maxGlobal + Input minSampleSize + Slider duration 3-30 dias + Switch autoStop) / "monitoring" 2 rows complex (Switch + Input number + % suffix) c/ disabled logic similar / "notifications" 4 switches sendo um com Input %+threshold; SAVE = `alert()`; gap CRÍTICO transversal: TODAS as 3 settings pages (PagSmile/Recovery/Converter) salvam com `alert()` browser nativo em vez de toast.success com sonner — UX inconsistente vs resto do app que usa toast. PADRÕES TRANSVERSAIS: (i) 3 hubs (PagSmile/Recovery/Converter) usam mesma tríade AgentChatInterface+AgentFloatingButton+process<X>Message+<x>QuickPrompts importados de @/components/agents/<X>ChatLogic — único do Admin Interno que tem CHAT real funcional via shared component (mas as messages processam mocks); (ii) PagSmileCopilot é o ÚNICO com TabsList incluindo "Configurações" inline duplicando estado da página standalone — gap arquitetural; (iii) cores hardcoded por agente: PagSmile purple #a855f7, Recovery orange #f97316, Converter blue #3b82f6 — sem token design system; (iv) Settings pages padronizadas com 4 Tabs cada (Geral/X/Y/Notificações) mas conteúdo divergente; (v) cross-page navigation REAL entre os hubs via Card "Navegação Rápida" do PagSmileCopilot que tem 4 LinkCards para os outros 4 agentes — funciona como menu intra-agentes; (vi) Recharts usado em 2 das 3 hubs (Recovery + Converter) com LineChart+BarChart, mas PagSmile NÃO usa Recharts (apenas barras CSS divs); (vii) PagSmile, Recovery e Converter exibem Card AI Insights com Sparkles purple gradient + "X merchants/experimentos com Y. Recomendação: Z. Impacto: R$ N" — pattern repetido com Button CTA distinto.',

    pagSmileCopilotMicroscopic: {
      role: 'Hub principal "Copilot Interno" — agente PRIMÁRIO do Admin Interno (renderizado em sidebar separada)',
      menuPosition: 'aiAgentsAdminInterno[0] — array linha 416 do layout.jsx',
      pageHeader: {
        icon: 'Sparkles purple-to-indigo gradient w-14 h-14 com shadow purple-500/25',
        title: '"PagSmile Copilot"',
        subtitle: '"Copiloto Interno para Gestão de Operações"',
        liveBadge: 'div pulsante green com "Monitorando 1.247 merchants" hardcoded',
        actionButton: 'Link → AdminIntPagSmileCopilotSettings (página separada DUPLICADA)',
      },
      stateManagement: {
        selectedPeriod: 'string default "today" — não usado',
        isChatOpen: 'boolean — controla AgentChatInterface',
        isFullscreen: 'boolean — toggle do chat',
        activeTab: 'string default "dashboard" — controla Tabs final (dashboard/settings)',
        copilotSettings: 'object 16 keys DUPLICADO da página de Settings (gap CRÍTICO de sincronização)',
      },
      hardcodedDataSources: {
        executiveSummary: 'object 5 KPIs (TPV R$ 47.3M / Merchants 1247 / Receita R$ 892.450 / Margem 1.89% / Chargeback 0.87%)',
        topMerchantsByMargin: '5 items (TechStore/Fashion/GameZone/Pharma/AutoParts) c/ rank, name, margin, tpv, rate, trend',
        rateOptimizations: '3 clusters c/ taxa atual+sugerida+impacto receita+churn risk+NPS impact',
        operationalInsights: '4 insights c/ type (warning/opportunity/info/success), priority, action, actionPage Link',
        portfolioHealth: '4 categorias (healthy 71.5% / attention 19.6% / critical 6.3% / blocked 2.6%)',
        smartAlerts: '3 alerts (critical/warning/info) c/ timestamp string',
      },
      executiveSummaryGrid: {
        layout: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5 — purple gradient bg sutil',
        boxes5: 'cada com label slate truncate + Badge condicional (purple TrendingUp para positivos / outline para queda) + value 2xl bold',
      },
      operationalInsightsGrid: {
        layout: 'grid-1 lg:grid-2 — 4 insights coloridos por type',
        typeBgColors: {
          warning: 'border-amber + bg-amber-50/50',
          opportunity: 'border-purple + bg-purple-50/50',
          success: 'border-green + bg-green-50/50',
          info: 'border-slate (default fallback)',
        },
        iconPerType: '4 condicionais (AlertTriangle amber / Lightbulb purple / CheckCircle2 green / Activity blue)',
        actionLinks: '[Link → AdminIntRiskDashboard / AdminIntMerchantsList / AdminIntComplianceQueue / AdminIntTransactionsDashboard]',
      },
      twoColumnGrid: {
        leftCard: 'Top Merchants por Margem — 5 items c/ rank #N + Link "Ver todos" → AdminIntClientProfitability',
        rightCard: 'Saúde do Portfólio — 4 categorias com BARRAS HORIZONTAIS h-8 width style inline com Math.max(percentage, 10) — força mínimo 10% para visibilidade',
        portfolioCriticalGap: 'Math.max forçando 10% distorce realidade visual: blocked 2.6% e critical 6.3% renderizam visualmente IGUAIS (10%)',
      },
      rateOptimizationTable: {
        cols: '8 (Cluster / Merchants / Taxa Atual / Taxa Sugerida Badge / Impacto Receita / Risco Churn / Impacto NPS / Ações)',
        suggestedRateColorLogic: 'parseFloat(suggested) > parseFloat(current) ? green : amber',
        revenueColorLogic: 'startsWith("+") ? green-600 : red-600',
        npsColorLogic: 'startsWith("+") ? green-600 : amber-600',
        churnRiskBadge: '3 cores (low green / medium amber / high red)',
        actionGap: 'Button "Simular" SEM onClick',
      },
      smartAlertsCard: '3 alerts coloridos red/amber/blue c/ icon condicional + título bold + message + timestamp slate',
      tabsBottomDuplicate: {
        tabs: ['dashboard', 'settings'],
        dashboardTab: 'Apenas Card "Navegação Rápida" grid-4 com Link Cards para os 4 outros agentes (Recovery/Dispute/Identity/Converter)',
        settingsTab: 'DUPLICA toda a UI da página AdminIntPagSmileCopilotSettings — General+DataSources / Alerts / Reports / Notifications + Save button',
        criticalGap: 'state copilotSettings IDÊNTICO ao state da página separada — sem sync, edits em uma página NÃO refletem na outra',
      },
      agentChat: {
        component: 'AgentChatInterface (shared @/components/agents)',
        agentName: '"pagsmile_copilot"',
        accentColor: '#a855f7 (purple)',
        processor: 'processPagSmileCopilotMessage from @/components/agents/PagSmileCopilotChatLogic',
        floatingButton: 'AgentFloatingButton fixed accentColor=#a855f7',
        welcomeMessage: '"Olá! 👋 Sou o PagSmile Copilot..."',
      },
      knownGapsPagSmileCopilot: [
        'state copilotSettings DUPLICADO entre página principal e settings standalone (sem sync)',
        'Math.max(percentage, 10) força barras pequenas a 10% (distorce dados)',
        '"Simular" button do RateOptimization sem onClick',
        'PageHeader Link Configurar leva à página separada mas inline também tem settings',
        'Período Select state declarado mas não usado',
        'Cross-page links são REAIS (4 ações) — único hub com tantos cross-links',
        'Nenhuma persistência (Save Configurações fake)',
      ],
    },

    pagSmileCopilotSettingsMicroscopic: {
      role: 'Página separada de configurações do PagSmile Copilot (DUPLICA inline tab)',
      menuPosition: 'NÃO está no menu — acessível apenas por Link "Configurar" do hub',
      stateManagement: {
        settings: 'object 16 keys IDÊNTICO ao copilotSettings da página principal',
      },
      header: {
        backButton: 'ArrowLeft Link → AdminIntPagSmileCopilot',
        icon: 'Sparkles purple-indigo gradient',
        title: '"Configurações do PagSmile Copilot"',
        subtitle: '"Análises operacionais, alertas e relatórios"',
        actions: '[Resetar Button outline / Salvar Button purple-600]',
      },
      tabsList: '4 tabs grid-cols-4 (Geral / Alertas / Relatórios / Notificações)',
      generalTab: {
        cards: '2 (Configurações Gerais c/ 2 switches / Fontes de Dados c/ map de 4 itens)',
        dataSourcesMap: '[TPV BarChart3 blue / Saúde TrendingUp green / Receita TrendingUp emerald / Risco AlertTriangle red]',
      },
      alertsTab: '3 rows c/ Switch+Input number disabled-when-switch-off (Anomalia % / Churn score / Queda %)',
      reportsTab: '2 rows c/ Select 5 weekdays + Switch (Weekly) / Switch only (Monthly)',
      notificationsTab: {
        emailRow: 'Switch + IF notifyByEmail → Input emails em pl-4 border-l-2 blue',
        slackRow: 'Switch + IF notifyBySlack → Input webhook em border-l-2 purple',
      },
      saveBehavior: {
        function: 'handleSave',
        action: '`alert("Configurações do PagSmile Copilot salvas com sucesso!")`',
        gap: 'BROWSER ALERT em vez de toast.success com sonner — UX inconsistente vs outras pages',
      },
      knownGapsPagSmileCopilotSettings: [
        'DUPLICA copilotSettings da página principal (sem sync)',
        'Save = browser alert() não toast.success',
        'Sem botão Reset funcional',
        'Sem entity AiAgentConfig usado',
        'Sem persistência',
      ],
    },

    recoveryAgentMicroscopic: {
      role: 'Hub global de recuperação de pagamentos — visão consolidada de todos merchants',
      menuPosition: 'aiAgentsAdminInterno[1] — array linha 417',
      pageHeader: {
        icon: 'RefreshCw orange-to-red gradient w-14 h-14 shadow-orange-500/25',
        title: '"Recovery Agent"',
        subtitle: '"Visão Consolidada - Todos os Merchants"',
        badge: 'Store icon "847 merchants ativos" orange',
        actionButton: 'Link → AdminIntRecoveryAgentSettings',
      },
      stateManagement: {
        selectedMerchant: 'object|null — armazenado em onClick mas não usado para Modal',
        isChatOpen: 'boolean',
        isFullscreen: 'boolean',
      },
      hardcodedDataSources: {
        globalKpis: 'object 6 KPIs (R$ 4.2M risco / R$ 2.3M recuperado / 54.8% taxa / 847 merchants / 125430 comunicações / 1.2h tempo)',
        topMerchants: '5 items c/ name+gmvAtRisk+recovered+rate+status (excellent/good/average/needs_attention)',
        scenarioData: '5 cenários (Saldo Insuficiente/Limite Excedido/PIX Pendente/Abandono/Erro Técnico) — volume+recovered+rate',
        monthlyEvolution: '5 meses Set→Jan c/ atRisk+recovered+rate',
      },
      kpiGrid: {
        layout: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4',
        firstTwoCards: 'amber-50 e green-50 backgrounds — destaque visual',
        otherFourCards: 'background neutro slate',
      },
      tabsContainer: {
        tabs: '3 (overview / merchants / scenarios)',
        overviewTab: {
          chartGrid: 'grid-1 lg:grid-2',
          leftChart: 'LineChart Recharts h=300 — XAxis month / YAxis / 2 Lines (atRisk gray #94a3b8 + recovered green #2bc196 strokeWidth 3)',
          rightChart: 'BarChart Recharts h=300 — XAxis scenario fontSize 10 / YAxis / 2 Bars (volume gray + recovered green)',
          aiInsightCard: 'border-purple-200 + gradient purple-50 → 5 merchants <40% taxa, R$ 320k/mês potencial — Button "Ver Detalhes" → AdminIntMerchantsList',
        },
        merchantsTab: {
          card: 'Search Input + Filter button + 5 merchants rows',
          rowStructure: 'Avatar Store + nome bold + GMV em risco/recuperado + rate% bold + Progress h-2 w-24 + statusBadge + Eye button',
          statusBadgeMap: '[excellent green / good blue / average amber / needs_attention red]',
          gap: 'onClick em row armazena selectedMerchant mas não abre modal/drawer',
        },
        scenariosTab: 'grid-3 cards reutilizando scenarioData c/ Progress h-2',
      },
      agentChat: {
        agentName: '"recovery_agent_admin"',
        accentColor: '#f97316 (orange)',
        processor: 'processRecoveryAgentAdminMessage',
      },
      knownGapsRecoveryAgent: [
        'selectedMerchant state não abre modal/drawer (onClick visual sem efeito)',
        'Search Input em "merchants" tab sem onChange',
        'Filter button sem onClick',
        'Eye button sem onClick',
        'Sem entity Recovery/Retry no schema',
        'KPI activeMerchants 847 vs PagSmileCopilot 1247 — números inconsistentes entre agentes',
      ],
    },

    recoveryAgentSettingsMicroscopic: {
      role: 'Settings standalone do Recovery Agent',
      menuPosition: 'NÃO está no menu — Link do hub apenas',
      stateManagement: {
        settings: 'object 14 keys (4 Global / 4 Channels / 4 Thresholds / 3 Notifications)',
      },
      header: {
        backButton: 'ArrowLeft → AdminIntRecoveryAgent',
        icon: 'RefreshCw amber-to-orange gradient (DIFERENTE do hub que usa orange-to-red)',
        gap: 'Cor do header da settings difere da cor do hub',
        actionButtons: '[Resetar / Salvar amber-600]',
      },
      tabsContainer: {
        tabs: '4 (general/channels/thresholds/notifications)',
        generalTab: {
          fields: '[2 switches (Agente Ativo / Retry Auto) + Slider 1-5 max retries + Select 4 opts intervalo (15/30/60/120 min)]',
          slider: 'shadcn Slider componente',
        },
        channelsTab: {
          fields: '[4 channel rows (SMS / Email / WhatsApp / Push) cada com Switch]',
          recommendedBadge: 'IF SMS or WhatsApp → Badge "Recomendado" green',
          openRatesHardcoded: '"SMS 98% / Email 45% / WhatsApp 95%" — taxas embedadas no description',
        },
        thresholdsTab: {
          fields: '[3 R$ Inputs (mín/máx/alta prioridade) + Slider Janela 1-14 dias]',
          gap: 'Inputs SEM step="0.01" para valores monetários (default integer)',
        },
        notificationsTab: '[3 Switches + Input type="time" para summaryTime disabled-when-switch-off]',
      },
      saveBehavior: '`alert("Configurações salvas com sucesso!")` — não toast',
      knownGapsRecoveryAgentSettings: [
        'Cor inconsistente vs hub (amber vs orange)',
        'Save = browser alert',
        'Inputs R$ sem step decimal',
        'Open rates hardcoded (não vêm de stats reais)',
        'Push Notification "Requer app do merchant" mas PagSmile não tem app',
        'Sem persistência',
      ],
    },

    converterAgentMicroscopic: {
      role: 'Hub global de otimização de conversão de checkout',
      menuPosition: 'aiAgentsAdminInterno[2] — array linha 418',
      pageHeader: {
        icon: 'Shuffle blue-to-indigo gradient',
        title: '"Converter Agent"',
        subtitle: '"Visão Consolidada - Otimização de Checkout"',
        badge: '"892 merchants ativos" blue',
      },
      stateManagement: {
        isChatOpen: 'boolean',
        isFullscreen: 'boolean',
      },
      hardcodedDataSources: {
        globalKpis: 'object 8 keys (avgConversion 74.2%/+5.8% / avgAbandon 25.8%/-4.2% / 892 merchants / 23 experiments / R$ 1.2M revenue / 52s checkout)',
        topMerchants: '5 items c/ conversion+abandon+experiments+lift+status',
        experimentResults: '4 experimentos c/ merchants count + avgLift + status',
        monthlyEvolution: '5 meses Set→Jan c/ conversion+abandon',
        deviceData: '3 devices (Mobile 68%/72% / Desktop 28%/82% / Tablet 4%/76%)',
      },
      kpiGrid: {
        layout: 'grid-2 md:grid-4',
        firstTwoCards: 'green-50 e red-50 — destaque',
        gap: 'Badge abandono "-4.2%" mostrado green (queda é POSITIVA mas Badge cor poderia confundir)',
      },
      tabsContainer: {
        tabs: '3 (overview/merchants/experiments)',
        overviewTab: {
          gridLeft: 'LineChart Recharts c/ 2 Lines (conversion green strokeWidth 3 / abandon red strokeWidth 2)',
          gridRight: 'Card "Performance por Dispositivo" 3 rows com icon condicional (Mobile Smartphone blue / Desktop Monitor purple / Tablet Monitor amber) + Progress h-2 + Insight amber inline "Mobile 68% tráfego mas menor conv"',
          aiInsightCard: 'PIX First 245 merchants +R$ 180k/mês — Button "Aplicar Global" SEM onClick',
        },
        merchantsTab: {
          rowStructure: 'Avatar Store + nome + experiments count + 4 stat columns center (Conversão green / Abandono red / Lift bg-green/red / Status Badge) + Eye button',
          liftColorLogic: 'startsWith("+") ? bg-green-100 : bg-red-100',
        },
        experimentsTab: {
          structure: '4 cards bordered green-300 (winner) ou blue-200 (positive)',
          winnerVisual: 'IF winner → CheckCircle2 white em circle green-500 (8x8)',
          experimentRows: '[name + merchants count / avgLift bold green / statusBadge]',
        },
      },
      agentChat: {
        agentName: '"converter_agent_admin"',
        accentColor: '#3b82f6 (blue)',
        processor: 'processConverterAgentAdminMessage',
      },
      knownGapsConverterAgent: [
        'Search/Filter na tab merchants sem onChange/onClick',
        'Eye button sem onClick',
        '"Aplicar Global" button sem onClick',
        'Sem entity Experiment/ABTest no schema',
        'avgCheckoutTime 52s — declarado em globalKpis mas não exibido na UI',
        'Tablet usa Monitor icon (deveria ter ícone próprio) — 4% tráfego',
      ],
    },

    converterAgentSettingsMicroscopic: {
      role: 'Settings standalone do Converter Agent — A MAIOR settings page',
      menuPosition: 'NÃO está no menu',
      stateManagement: {
        settings: 'object 17 keys (4 Global / 4 Experiments / 2 Personalization / 3 DefaultRules / 4 Monitoring / 5 Notifications)',
      },
      header: {
        icon: 'Shuffle blue-indigo gradient (consistente com hub)',
        title: '"Configurações Globais - Converter Agent"',
        subtitle: '"Parâmetros que afetam todos os merchants"',
        actions: '[Resetar / Salvar blue-600]',
      },
      tabsContainer: {
        tabs: '4 (global/experiments/monitoring/notifications)',
        globalTab: {
          twoCards: '[Configurações Globais c/ 3 switches + Slider confidenceLevel 90-99 / Regras de Personalização Padrão c/ 3 switches em rows com Smartphone+Clock+Target icons]',
          confidenceSliderLayout: 'flex-1 Slider + span w-16 right "{N}%"',
        },
        experimentsTab: {
          fields: '[Select max-tests-per-merchant 4 opts / Input maxGlobal / Input minSample / Slider 3-30 dias / Switch autoStop]',
        },
        monitoringTab: '[2 rows complex (Switch + Input + % suffix + disabled logic)]',
        notificationsTab: '[4 switches sendo um (liftThreshold) com Input %]',
      },
      saveBehavior: '`alert("Configurações globais do Converter Agent salvas!")` — não toast',
      knownGapsConverterAgentSettings: [
        'Save = browser alert',
        'Slider confidenceLevel 90-99% — limites HARDCODED em UI sem opção 80-89%',
        'Sem entity AiAgentConfig usado',
        'Sem teste de configuração antes de salvar',
        'Sem versionamento de regras',
      ],
    },
  },

  technical: {
    fileLocations: {
      pagSmileCopilot: 'pages/AdminIntPagSmileCopilot.jsx (878 linhas — A MAIOR de todas as 5 dos agentes)',
      pagSmileCopilotSettings: 'pages/AdminIntPagSmileCopilotSettings.jsx (359 linhas)',
      recoveryAgent: 'pages/AdminIntRecoveryAgent.jsx (350 linhas)',
      recoveryAgentSettings: 'pages/AdminIntRecoveryAgentSettings.jsx (366 linhas)',
      converterAgent: 'pages/AdminIntConverterAgent.jsx (385 linhas)',
      converterAgentSettings: 'pages/AdminIntConverterAgentSettings.jsx (409 linhas)',
    },
    arrayLocationInLayoutJsx: {
      file: 'layout.jsx',
      block: '`aiAgentsAdminInterno` — linhas 414-421 (DECLARADO FORA do `getAdminInternoMenuItems`)',
      renderingLocation: 'Sidebar dentro de `<ScrollArea>` em condicional `{sidebarOpen && currentModule === "admin-interno" && ...}` linhas 864-908',
      visualSeparation: 'Linha divisória horizontal + label "Agentes IA" purple-400 uppercase tracking-widest (linhas 866-873)',
      iconUsedInSidebar: 'Sparkles purple-to-indigo gradient — TODOS os 5 agentes usam mesmo ícone Sparkles',
    },
    sharedAgentChatPattern: {
      pages: ['PagSmileCopilot', 'RecoveryAgent', 'ConverterAgent'],
      sharedComponents: ['AgentChatInterface', 'AgentFloatingButton'],
      sharedImportsPattern: 'import { processX, xQuickPrompts } from "@/components/agents/XChatLogic"',
      props: '{ agentName, agentDisplayName, agentDescription, quickPrompts, onProcessMessage, welcomeMessage, isOpen, onClose, isFullscreen, onToggleFullscreen, accentColor }',
      accentColors: {
        pagSmile: '#a855f7 (purple)',
        recovery: '#f97316 (orange)',
        converter: '#3b82f6 (blue)',
      },
    },
    saveBehaviorInconsistency: {
      pages: ['PagSmileCopilotSettings', 'RecoveryAgentSettings', 'ConverterAgentSettings'],
      pattern: 'TODAS as 3 settings pages usam `alert("...")` browser nativo',
      gap: 'Resto do app usa toast.success com sonner — UX/visual inconsistente',
    },
    duplicationCriticalPagSmile: {
      issue: 'AdminIntPagSmileCopilot tem Tab "Configurações" inline com state copilotSettings + AdminIntPagSmileCopilotSettings tem state settings — IDÊNTICOS sem sync',
      uniqueIssue: 'Recovery e Converter NÃO têm settings inline — apenas page separada',
      gap: 'Confusão UX: usuário pode editar em 2 lugares e estados não conversam',
    },
    crossPageNavigationFromHub: {
      pagSmile_to_others4: '[Recovery / Dispute / Identity / Converter] via Card "Navegação Rápida"',
      pagSmile_other_links: '[Risk / MerchantsList / ComplianceQueue / TransactionsDashboard / ClientProfitability]',
      recovery_to: '[MerchantsList via "Ver Detalhes" insight]',
      converter_to: 'NENHUMA cross-link real (apenas Settings própria)',
    },
    rechartsUsage: {
      hubsUsing: ['RecoveryAgent (LineChart + BarChart)', 'ConverterAgent (LineChart only)'],
      hubsNotUsing: ['PagSmileCopilot (usa BARRAS CSS divs estilizadas em vez de Recharts)'],
      gap: 'Inconsistência — Portfolio Health do PagSmile poderia usar BarChart Recharts',
    },
    iconColorsHardcoded: {
      pagSmile: 'purple-500 to indigo-600',
      recovery_hub: 'orange-500 to red-500',
      recovery_settings: 'amber-500 to orange-600 (DIFERENTE do hub)',
      converter: 'blue-500 to indigo-600',
      gap: 'Cores hardcoded sem token design system + Recovery hub vs settings divergente',
    },
    knownGapsCrossSection: [
      '6/6 páginas mock — zero entity, zero SDK',
      'PagSmileCopilot tem state DUPLICADO (inline tab + página separada sem sync)',
      'Save em settings = `alert()` browser em vez de toast (3 páginas)',
      'KPI active merchants inconsistente (PagSmile 1247 / Recovery 847 / Converter 892) — mesmos merchants?',
      'PagSmile Math.max(percentage, 10) distorce barras (blocked 2.6% renderiza igual a critical 6.3%)',
      'Recovery hub usa orange-to-red MAS settings usa amber-to-orange (cor inconsistente)',
      'Buttons "Simular" / "Aplicar Global" / "Eye" / "Filter" / Search Inputs SEM onClick em todas as 3 hubs',
      'selectedMerchant state em Recovery não abre nada',
      'Tablet em Converter usa Monitor icon (deveria ter ícone Tablet)',
      'avgCheckoutTime do Converter declarado mas não exibido',
      'Open rates dos canais Recovery hardcoded ("SMS 98%, Email 45%, WhatsApp 95%")',
      'Confidence Level Slider Converter limitado a 90-99% (sem 80-89%)',
      'Sem entity AiAgentConfig/AiAgentLog usados (existem no schema)',
      'Sem versionamento de configurações',
      'Sem teste antes de salvar',
      'Sem histórico de mudanças (meta-auditoria)',
      'AgentChatInterface processa mocks (não há LLM real conectado)',
      'PagSmile NÃO usa Recharts (Portfolio Health são divs CSS) — inconsistência',
      'Push Notification em Recovery menciona "app do merchant" mas PagSmile não tem app',
      'Cross-page navigation REAL apenas no PagSmileCopilot — Recovery e Converter são ilhas',
    ],
  },
};

export default AdminIntAgentsPart1Doc;