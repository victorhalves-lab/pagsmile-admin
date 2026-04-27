// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — DISPUTE MANAGER (INTERNO) — Entrega 12
// ----------------------------------------------------------------------------
// Cobre o 4º agente do array `aiAgentsAdminInterno` em layout.jsx (linhas 415-421)
//
//   1. AdminIntDisputeManager.jsx          (700 linhas) — Hub global de disputas/chargebacks
//   2. AdminIntDisputeManagerSettings.jsx  (430 linhas) — Settings standalone 5 Tabs
//
// CONTEXTO IMPORTANTE — POR QUE ESTE AGENTE É CRÍTICO:
// - É o ÚNICO agente do Admin Interno que lida com disputes/chargebacks (área financeira sensível)
// - É o ÚNICO da Parte 2 (Dispute Manager + Identity Onboarder) que tem SideDrawer "Nova Regra"
// - É o ÚNICO hub com 5 Tabs (vs 3 dos demais Recovery/Converter, vs 2 do PagSmile no nível principal)
// - Tem state DUPLICADO (igual PagSmile) entre Hub Tab "rules" e página standalone (sem sync)
// - Cor identitária HARDCODED: vermelho-laranja (red-500 to orange-500), accentColor #ef4444
//
// COMPARAÇÃO COM CONTRAPARTE EXTERNA (DisputeManager subaccount):
// - DisputeManager público (subaccount/merchant) tem visão por dispute individual
// - DisputeManager INTERNO é VISÃO CONSOLIDADA cross-merchant (palavra "Global", "Visão Consolidada")
// - Schemas: usa Dispute entity (existe completa no schema), mas NÃO usa via SDK
// ============================================================================

export const AdminIntDisputeManagerDoc = {
  pageId: 'AdminIntDisputeManager',
  pagePaths: [
    '/AdminIntDisputeManager',
    '/AdminIntDisputeManagerSettings',
  ],
  module: 'Admin Interno',
  section: 'Agentes IA — Dispute Manager (Hub + Settings)',

  explainer: {
    oneLiner:
      'Quarto agente IA do Admin Interno (sidebar separada `aiAgentsAdminInterno[3]` — layout.jsx linha 419) — 2 páginas (1 hub + 1 settings) AMBAS 100% MOCK — gestão consolidada cross-merchant de disputas e chargebacks. (1) **AdminIntDisputeManager 700L** é o HUB principal com a maior quantidade de Tabs (5) entre todos os agentes do Admin Interno: Header com Gavel red-to-orange gradient (cor identitária do agente, `bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/25`) + título "Dispute Manager" + subtítulo "Visão Consolidada - Gestão de Disputas e Chargebacks" + Badge red "156 disputas abertas" usando AlertCircle icon + Button outline "Configurar" via Link → AdminIntDisputeManagerSettings (página separada MAS com state DUPLICADO no Tab "Regras e Automações" deste mesmo Hub — mesmo gap arquitetural do PagSmileCopilot); state local pequeno: isChatOpen+isFullscreen pro chat, showNewRule pro SideDrawer, e settings (14 keys: agentEnabled / autoContestHighProbability / minWinProbabilityForAutoContest 85% / enableAutoAcceptGlobal / globalAutoAcceptMaxValue R$ 100 / escalateHighValue / globalHighValueThreshold R$ 10000 / monitorChargebackRatio / ratioAlertThreshold 1.0 / ratioCriticalThreshold 1.5 / autoBlockAboveCritical FALSE default / notifyNewDispute / notifyHighValue / highValueNotificationThreshold R$ 5000); 5 fontes de dados HARDCODED dentro do componente: globalKpis (847 totalDisputes / 156 openDisputes / R$ 2.8M valueAtRisk / 68.5% globalWinRate / 7.2 dias avgResolutionTime / R$ 1.92M potentialRecovery), topMerchants (5 items: GameZone Digital 45 disputas R$ 234k 52% winRate 1.8% ratio CRITICAL / TechStore 32 R$ 178k 72% 0.9% GOOD / Fashion Express 28 R$ 145k 68% 1.1% ATTENTION / Pharma Online 18 R$ 92k 78% 0.6% EXCELLENT / Auto Parts 15 R$ 87k 45% 1.5% CRITICAL), disputeTypes (5: Fraude 312/R$1.2M/58% / Produto não recebido 245/R$0.8M/72% / Não reconhece 178/R$0.5M/65% / Duplicada 67/R$0.2M/85% / Outros 45/R$0.1M/70%), monthlyEvolution (5 meses Set→Jan com disputes/won/ratio crescendo até Dez 1.12% e caindo Jan 0.95%), urgentDisputes (3 mocks CB-001 GameZone R$ 12.500 2d 78% / CB-002 Fashion R$ 8.900 3d 65% / CB-003 TechStore R$ 15.200 1d 82%); CONSTANTE COLORS local `[#ef4444, #f59e0b, #3b82f6, #22c55e, #8b5cf6]` para PieChart com 5 cores fixas; KPI grid-cols-2 md:grid-cols-3 lg:grid-cols-6 com 6 cards (Total Disputas neutral / Valor em Risco red-50 / Win Rate Global green-50 / Tempo Médio neutral / Recuperação Potencial usando bg-[#2bc196]/10 c/ Zap icon / Urgentes amber-50 c/ contador dinâmico `urgentDisputes.length` + texto "prazo < 3 dias"); BLOCO DESTAQUE CRÍTICO RENDER CONDICIONAL `{urgentDisputes.length > 0 && (...)}`: Card border-red-200 bg-red-50/50 com AlertTriangle red + título "Disputas Urgentes - Ação Necessária" e grid-3 com 3 cards minor (ID + Badge outline red Xd deadline + merchant + R$ value toLocaleString + Badge green winProb%) — esta SEÇÃO É EXIBIDA APENAS SE EXISTEM URGENTES (boa prática mas com mock estático sempre tem 3); Tabs principal grid-cols-5 com 5 tabs únicas no ecosistema dos agentes (overview / merchants / types / ai / rules); (a) overview tem grid-1 lg:grid-2 com LineChart Recharts h=300 "Evolução Mensal" 2 linhas (disputes red strokeWidth 2 + won green strokeWidth 2) + PieChart Recharts h=300 "Distribuição por Tipo" usando dataKey="count" nameKey="type" outerRadius 100 com label callback `({ type, percent }) => ${type} ${(percent * 100).toFixed(0)}%` e cells iterando COLORS array via `index % COLORS.length` — único agente do Admin Interno que usa PieChart Recharts; (b) merchants tab tem Card c/ Search Input + Filter Button + 5 merchants em rows com STYLING CONDICIONAL crítico: `merchant.status === "critical" ? "border-red-200 bg-red-50/50" : ""` (apenas critical recebe destaque visual) — Store icon + nome + "X disputas • R$ Yk" + 4 cols stats (Win Rate green / CB Ratio com COLORAÇÃO CONDICIONAL `merchant.ratio > 1.2 ? "text-red-600" : "text-slate-900"` / statusBadge / Eye Button SEM onClick); (c) types tab grid-3 cards reutilizando disputeTypes data; (d) ai tab é o INSIGHT GRID — Card único border-purple-200 bg-gradient-purple-50 + Header c/ Brain purple-indigo gradient + título "Análise Inteligente de Disputas" + grid-2 com 4 sub-cards inner brancos cada um com (icon Lucide + título h4 + parágrafo c/ <strong> tag): Merchants em Risco "2 merchants ratio >1.5%, GameZone requer ação imediata" / Oportunidade Contestação "23 disputas >80% prob aguardando, R$ 145.000 potencial" / Padrão Identificado "+34% disputas Produto não recebido em janeiro, revisar tracking" / Dossiês Pendentes "8 dossiês prontos, prazo médio 4 dias" — TODOS HARDCODED, sem fonte real; (e) rules é o tab MAIS RICO e DUPLICADO da settings standalone — header com "Nova Regra" Button c/ onClick `setShowNewRule(true)` que abre SideDrawer + 4 Automation Rules em rows com STYLING CONDICIONAL `rule.status === "active" ? border-green-200 bg-green-50/50 : border-slate-200 bg-slate-50` + Zap icon condicional verde/cinza + nome + condition em font-mono (DSL pseudo-código tipo `valor < 100 AND motivo = "desistência"`) + ação + Badge "Ativa/Inativa" + Switch (NÃO TEM onCheckedChange — switch decorativo sem efeito sobre rule.status real) + Settings Button SEM onClick; após Automation Rules vem grid-2 c/ DUPLICAÇÃO COMPLETA do conteúdo da página Settings standalone: Card "Automação de Contestação" (4 controles inline: 2 Switches Agente Ativo+Auto Contestar / Slider 70-95% step 5 disabled-when-switch-off / Input number Auto-Aceitar R$) + Card "Monitoramento de Ratio" (1 Switch + 2 Sliders min=5 max=20 step=1 PARA threshold alerta E min=10 max=30 step=1 PARA critical com TRUQUE MATEMÁTICO inline `value=[settings.ratioAlertThreshold * 10]` E `onValueChange=([v]) => setSettings(... v / 10)` ou seja: para representar percentual fracionário 0.5%-2.0% no Slider que só aceita inteiros, MULTIPLICA POR 10 no display e DIVIDE POR 10 ao salvar — gap de UX porque Slider mostra 5-20 mas label diz 0.5%-2.0%, comportamento NÃO replicado na página Settings standalone que usa Input number step="0.1" — INCONSISTÊNCIA TOTAL entre as 2 abordagens UX) + 1 Switch destacado bg-red-50 "Bloquear Acima do Crítico"; após o grid-2 vem Button "Salvar Configurações" red-600 SEM onClick efetivo (nem alert nem toast); SideDrawer "Nova Regra de Automação" size="lg" com 3 fields (Nome / Condição em font-mono c/ placeholder DSL exemplo `valor < 100 AND motivo = "desistência"` / Action Select c/ 5 opts auto_accept/auto_contest/escalate/block/notify) + alerta amber inline "Regras são executadas automaticamente. Teste antes de ativar." — Save Button apenas fecha o drawer (`setShowNewRule(false)`) sem persistir; AgentChatInterface c/ accentColor="#ef4444" (red) processDisputeManagerAdminMessage de @/components/agents/DisputeManagerChatLogic + AgentFloatingButton fixed; (2) **AdminIntDisputeManagerSettings 430L** é A SEGUNDA MAIOR settings page dos agentes (atrás apenas do ConverterAgentSettings 409L em quantidade de campos 17 mas com mais Tabs aqui): Header c/ ArrowLeft Link → AdminIntDisputeManager + Gavel red-to-orange gradient (consistente com Hub) + título "Configurações Globais - Dispute Manager" + 2 Buttons Resetar+Salvar red-600; settings state com 19 KEYS — A MAIOR collection state de TODAS as settings pages do Admin Interno (Global 3 / Auto-accept 3 c/ autoAcceptIfNoEvidence / Escalation 3 c/ escalateToComplianceAbove R$ 50000 / SLA 3 c/ slaResponseHours 48h e slaEscalationHours 24h e autoAssignAnalyst / Ratio 4 / Notifications 5 c/ digestTime 08:00); 5 Tabs grid-cols-5 (automation/sla/ratio/escalation/notifications) — TAMBÉM ÚNICA settings page com 5 Tabs (vs 4 das demais): (a) "automation" tab tem único Card c/ 5 controles (2 Switches genéricos + Slider confidence 70-95% step=5 c/ display flex-1+span w-16 right "{N}%" — padrão visualmente idêntico ao ConverterAgentSettings — + 1 Switch Auto-Aceitar + Input R$ Max disabled-when-switch-off); (b) "sla" tab é TAB EXCLUSIVA deste agente entre todos — não existe SLA tab em outros settings — Card c/ 2 Inputs number "horas" + Switch Atribuição Automática Analista; (c) "ratio" tab usa Inputs number step="0.1" PARA threshold (DIFERENTE do Hub Tab que usa Slider*10 hack) + Switch destacado bg-red-50 "Bloquear Acima do Crítico" c/ disabled-when-monitor-off; (d) "escalation" tab é TAB EXCLUSIVA c/ 1 Switch + 2 Inputs R$ (Supervisor R$ 10000 / Compliance R$ 50000) — Compliance threshold é HARDCODED como NÃO disabled mesmo escalateHighValue=false (gap potencial mas funcional); (e) "notifications" tab c/ 4 rows: 1 Switch / 1 Switch+Input com R$ disabled / 1 Switch / 1 Switch+Input type="time" disabled; saveBehavior é `alert("Configurações globais do Dispute Manager salvas!")` browser nativo — IGUAL aos outros settings (PagSmile/Recovery/Converter) — gap UX transversal já documentado. PADRÕES TRANSVERSAIS DESTE AGENTE: (i) ÚNICO agente do Admin Interno que usa Gavel icon (semanticamente representa "julgamento" de disputas); (ii) ÚNICO hub c/ 5 Tabs e Tab "AI Insights" exclusiva (Recovery+Converter têm "Visão Geral" inicial c/ AI Insight Card inline mas não tab dedicada); (iii) ÚNICO hub que usa SideDrawer (showNewRule + size="lg" + Action Select c/ 5 opts) — Recovery+Converter+PagSmile não têm forms de criação inline; (iv) ÚNICO hub c/ Slider HACK matemático *10 ÷ 10 para representar fracionários em Slider integer (gap de UX vs settings standalone que usa step="0.1"); (v) state settings DUPLICADO entre Hub e Settings page (15 keys do Hub overlap com 19 keys da Settings) sem sync; (vi) Hub e Settings page mantêm a MESMA cor (red-to-orange) — diferente de Recovery onde houve divergência (orange-to-red vs amber-to-orange); (vii) automationRules array NÃO tem `onCheckedChange` no Switch — switches são DECORATIVOS só (ao alternar, nada acontece no estado da rule); (viii) urgentDisputes block é renderizado condicionalmente (`length > 0`) — boa prática rara entre os agentes; (ix) styling CONDICIONAL pelo status critical em merchants rows é único (Recovery+Converter não destacam visualmente status crítico no row container); (x) PieChart usa cells iteradas com COLORS array — único do Admin Interno (PagSmile/Recovery/Converter usam apenas LineChart+BarChart); (xi) 4 AI Insights na tab "ai" são organizadas em grid-2 com 4 sub-cards distintos — pattern usado APENAS aqui (PagSmile faz cards similares mas sob heading "Insights Operacionais" no nível principal, não em tab dedicada).',

    hubMicroscopic: {
      role: 'Hub global consolidado de gestão de disputas e chargebacks cross-merchant',
      menuPosition: '`aiAgentsAdminInterno[3]` — array linha 419 do layout.jsx — 4º agente da sidebar separada',
      uniqueAmongAgents: '5 Tabs (vs 3 dos outros) + AI Insights tab dedicada + SideDrawer Nova Regra + Slider hack *10÷10',

      pageHeader: {
        icon: 'Gavel red-500 to orange-500 gradient w-14 h-14 com shadow-red-500/25',
        title: '"Dispute Manager"',
        subtitle: '"Visão Consolidada - Gestão de Disputas e Chargebacks"',
        liveBadge: 'Badge red bg-red-100 com AlertCircle icon + "{globalKpis.openDisputes} disputas abertas" — único Badge entre agentes que usa AlertCircle (PagSmile usa pulse div / Recovery e Converter usam Store icon)',
        actionButton: 'Link → AdminIntDisputeManagerSettings (página separada com state que DUPLICA Tab "rules" do Hub)',
      },

      stateManagement: {
        isChatOpen: 'boolean — controla AgentChatInterface',
        isFullscreen: 'boolean — toggle fullscreen do chat',
        showNewRule: 'boolean — controla SideDrawer "Nova Regra de Automação" — ÚNICO state desta natureza entre os 5 agentes',
        settings: 'object 14 keys — DUPLICADO da página Settings standalone (mas com 5 keys A MENOS — Settings tem 19 keys porque inclui SLA tab + Escalation tab que não estão no Hub Tab)',
      },

      hardcodedDataSources: {
        globalKpis: '6 KPIs (847 totalDisputes / 156 openDisputes / R$ 2.8M valueAtRisk / 68.5% globalWinRate / 7.2 dias avgResolutionTime / R$ 1.92M potentialRecovery)',
        topMerchants: '5 items mais ricos do array (todos os outros agentes têm 5 — mas aqui CADA item tem 6 fields: name+disputes+value+winRate+ratio+status — o único que tem ratio explícito)',
        disputeTypes: '5 categorias (Fraude 312 / Produto não recebido 245 / Não reconhece 178 / Duplicada 67 / Outros 45) c/ value (M) + winRate per categoria',
        monthlyEvolution: '5 meses Set→Jan c/ disputes+won+ratio — ratio cresce até Dez 1.12% e cai pra 0.95% em Jan',
        urgentDisputes: '3 mocks com deadline em DIAS (1-3d) e winProb% — usado tanto no KPI Urgentes contador quanto no bloco condicional',
        automationRules: '4 mocks (2 active + 1 active + 1 INACTIVE c/ "Alertar ratio crítico") — único agente com mock de regras CRUD-like',
        COLORS_ARRAY: '`[#ef4444, #f59e0b, #3b82f6, #22c55e, #8b5cf6]` — constante local para PieChart cells via `index % COLORS.length`',
      },

      kpiGrid: {
        layout: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6 — IDÊNTICO ao Recovery (também 6 KPIs)',
        styling: 'whitespace-nowrap+overflow-hidden+text-ellipsis em todos os labels + truncate em todos os values — boa prática consistente',
        cardCount: 6,
        cardColors: {
          totalDisputes: 'neutral (slate)',
          valueAtRisk: 'bg-red-50 border-red-200 — destaque crítico',
          winRateGlobal: 'bg-green-50 border-green-200 — destaque positivo',
          avgResolutionTime: 'neutral',
          potentialRecovery: 'bg-[#2bc196]/10 border-[#2bc196]/20 — usa COR DA MARCA PagSmile (não red, não green) para "potencial não capturado"',
          urgentes: 'bg-amber-50 border-amber-200 c/ contador DINÂMICO `urgentDisputes.length` + texto "prazo < 3 dias"',
        },
      },

      conditionalUrgentBlock: {
        renderCondition: '`{urgentDisputes.length > 0 && (...)}` — RENDER CONDICIONAL — boa prática (mas mock sempre tem 3)',
        cardStyling: 'border-red-200 bg-red-50/50',
        header: 'AlertTriangle red + h3 "Disputas Urgentes - Ação Necessária"',
        grid: 'grid-cols-1 md:grid-cols-3 — 3 cards minor por dispute',
        cardFields: '[ID + Badge outline red "{deadline}d" / merchant nome / R$ value toLocaleString + Badge green "{winProb}% prob."]',
        gap: 'Cards SEM onClick — não navegam para detalhe',
      },

      tabsContainer: {
        tabsList: 'grid-cols-5 — ÚNICO entre os 5 agentes IA do Admin Interno (Recovery=3 / Converter=3 / PagSmile=2 no nível principal / Identity=??)',
        tabs: ['overview', 'merchants', 'types', 'ai', 'rules'],

        overviewTab: {
          chartGrid: 'grid-1 lg:grid-2',
          leftChart: {
            type: 'LineChart Recharts h=300',
            data: 'monthlyEvolution',
            xAxis: 'dataKey="month"',
            lines: '[disputes stroke=#ef4444 strokeWidth 2 / won stroke=#22c55e strokeWidth 2]',
          },
          rightChart: {
            type: 'PieChart Recharts h=300 — ÚNICO PieChart entre todos os agentes do Admin Interno',
            data: 'disputeTypes',
            keys: '{ dataKey: "count", nameKey: "type" }',
            geometry: '{ cx: "50%", cy: "50%", outerRadius: 100 }',
            label: '({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%` — callback inline',
            cells: '`{disputeTypes.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}`',
            uniqueness: 'PieChart com cells iteradas é PADRÃO ÚNICO deste agente — outros agentes usam apenas LineChart e BarChart',
          },
        },

        merchantsTab: {
          card: 'Search Input w-64 c/ icon overlay + Filter Button outline icon — ambos SEM onChange/onClick',
          rowsArray: 'topMerchants 5 items',
          rowConditionalStyling: '`merchant.status === "critical" ? "border-red-200 bg-red-50/50" : ""` — destaque visual EXCLUSIVO para critical (não para attention amber)',
          rowFields: 'Store icon + nome bold + "X disputas • R$ Yk" subtitle',
          rightSection: '4 cols (winRate text-green / ratio com COLORAÇÃO CONDICIONAL `ratio > 1.2 ? text-red-600 : text-slate-900` / statusBadge / Eye Button SEM onClick)',
          ratioColorThreshold: '> 1.2% = red — threshold visual hardcoded inline JSX',
          gap: 'Eye button sem onClick / Search e Filter sem behavior',
        },

        typesTab: {
          grid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 — 5 cards mas grid-3 cria 2ª linha com 2 cards',
          eachCard: '[type título / Quantidade count / Valor R$ XM / Win Rate Badge green + Progress h-2]',
        },

        aiTab: {
          uniqueness: 'TAB DEDICADA "AI Insights" — ÚNICA entre os 5 agentes (PagSmile faz Insights no nível principal; Recovery+Converter inline em "overview"; Identity ainda não documentada)',
          cardOuter: 'border-purple-200 bg-gradient-to-r from-purple-50 to-transparent — purple destaque',
          headerInner: 'Brain icon purple-indigo gradient w-12 h-12 + h3 "Análise Inteligente de Disputas" + p subtitle',
          gridInner: 'grid-cols-1 md:grid-cols-2 — 4 sub-cards inner',
          subCard1_MerchantsRisk: 'AlertTriangle red + h4 "Merchants em Risco" + "2 merchants ratio >1.5%, GameZone requer ação imediata"',
          subCard2_Opportunity: 'CheckCircle2 green + "Oportunidade de Contestação" + "23 disputas >80% prob aguardando, R$ 145.000 potencial"',
          subCard3_Pattern: 'TrendingUp blue + "Padrão Identificado" + "+34% disputas Produto não recebido em janeiro, revisar tracking"',
          subCard4_Dossiers: 'FileText purple + "Dossiês Pendentes" + "8 dossiês prontos, prazo médio 4 dias"',
          allHardcoded: 'Todas as 4 mensagens são strings literais — sem fonte LLM ou cálculo real',
        },

        rulesTab: {
          uniqueness: 'TAB que mistura LISTA de regras + DUPLICAÇÃO inline da settings standalone',

          newRuleHeader: 'CardHeader com h2+description + Button red-600 "Nova Regra" c/ onClick `setShowNewRule(true)` que abre SideDrawer',

          automationRulesList: {
            count: 4,
            rowConditionalStyling: '`rule.status === "active" ? border-green-200 bg-green-50/50 : border-slate-200 bg-slate-50` — destaque verde para active',
            rowStructure: '[Zap icon condicional green/slate / nome + condition em FONT-MONO + ação prefixada "→ "]',
            conditionDsl: 'String pseudo-código tipo `valor < 100 AND motivo = "desistência"` ou `win_probability >= 85%` — DSL SIMULADA, sem parser real',
            rightSection: '[Badge "Ativa/Inativa" / Switch SEM onCheckedChange — DECORATIVO / Settings Button SEM onClick]',
            gap: 'Switch sem onCheckedChange — toggle não muda rule.status (nada acontece)',
          },

          duplicatedSettingsGrid: {
            uniqueness: 'DUPLICAÇÃO COMPLETA do conteúdo da página Settings standalone DENTRO desta tab — mesmo gap do PagSmileCopilot',
            grid: 'grid-1 lg:grid-2',
            leftCard: {
              title: '"Automação de Contestação"',
              fields: '[Switch agentEnabled / Switch autoContestHighProbability / Slider 70-95 step 5 disabled-when-switch-off / Input R$ globalAutoAcceptMaxValue]',
            },
            rightCard: {
              title: '"Monitoramento de Ratio"',
              fields: '[Switch monitorChargebackRatio / Slider HACK *10 ÷10 alertThreshold / Slider HACK criticalThreshold / Switch destacado bg-red-50 autoBlockAboveCritical]',
              sliderHack: 'CRÍTICO — Sliders shadcn aceitam apenas inteiros, mas threshold é fracionário (0.5%-2.0%). Solução inline: `value=[settings.ratioAlertThreshold * 10]` E `onValueChange=([v]) => setSettings(... v / 10)`. UX: usuário arrasta valores 5-20 enquanto label exibe `{settings.ratioAlertThreshold}%` (0.5-2.0). NÃO REPLICADO na Settings standalone que usa Input number step="0.1" — 2 abordagens diferentes para o mesmo dado.',
            },
          },

          saveButton: 'Button red-600 "Salvar Configurações" SEM onClick efetivo (nem alert nem toast) — gap UX',
        },
      },

      sideDrawer: {
        component: 'SideDrawer (shared @/components/common/SideDrawer)',
        controlState: 'showNewRule + setShowNewRule',
        size: 'lg',
        title: '"Nova Regra de Automação"',
        description: '"Configure uma regra para gestão automática de disputas"',
        icon: 'Zap',
        footerButtons: '[Cancelar outline / Salvar Regra red-600 — ambos apenas fecham drawer sem persistir]',
        bodyFields: [
          'Input "Nome da Regra *"',
          'Input "Condição (expressão)" font-mono c/ placeholder DSL exemplo `valor < 100 AND motivo = "desistência"`',
          'Select "Ação" 5 opts (auto_accept / auto_contest / escalate / block / notify)',
          'Alert amber inline "Regras são executadas automaticamente. Teste antes de ativar." c/ AlertTriangle icon',
        ],
        uniqueness: 'ÚNICO SideDrawer entre os 5 agentes IA do Admin Interno — Recovery+Converter+PagSmile não têm forms de criação inline',
        gap: 'Save fecha drawer sem persistir (sem mutation, sem useState array push)',
      },

      agentChat: {
        component: 'AgentChatInterface (shared @/components/agents)',
        agentName: '"dispute_manager_admin"',
        agentDisplayName: '"Dispute Manager"',
        agentDescription: '"Visão consolidada de disputas"',
        accentColor: '#ef4444 (red-500) — DIFERENTE da cor do Hub gradient (red-500 to orange-500), usa apenas o início',
        processor: 'processDisputeManagerAdminMessage from @/components/agents/DisputeManagerChatLogic',
        floatingButton: 'AgentFloatingButton fixed accentColor=#ef4444',
        welcomeMessage: '"Olá! 👋 Sou o Dispute Manager na visão Admin..."',
        quickPrompts: 'disputeManagerAdminQuickPrompts (mock)',
      },

      knownGapsHub: [
        'state settings DUPLICADO entre Hub Tab "rules" e página standalone (sem sync — edits não conversam)',
        'Hub Tab "rules" usa Slider HACK *10÷10 ENQUANTO Settings standalone usa Input step="0.1" — 2 UX diferentes para o mesmo dado',
        'automationRules array Switch SEM onCheckedChange — toggle decorativo sem mudar rule.status',
        'Settings Button (icon) ao lado do Switch nas regras SEM onClick',
        'Eye Button na tab merchants SEM onClick',
        'Search Input + Filter Button na tab merchants SEM onChange/onClick',
        '"Salvar Configurações" Button no fim da tab "rules" SEM onClick efetivo (nem alert nem toast)',
        'SideDrawer "Nova Regra" Salvar apenas fecha drawer (sem persistir, sem array push)',
        'Cards de urgentDisputes SEM onClick — não navegam para detalhe da disputa',
        'AI Insights na tab "ai" são 100% strings hardcoded — sem fonte LLM real ou cálculo',
        'COLORS array hardcoded local em vez de design tokens',
        'Threshold ratio > 1.2% para colorir red é hardcoded inline JSX (não vem de settings.ratioAlertThreshold = 1.0)',
        'KPI globalKpis.totalDisputes 847 vs Recovery activeMerchants 847 — números coincidentes mas semânticas diferentes (disputas vs merchants)',
        'Sem entity Dispute usada via SDK (entity existe completa no schema com 30+ fields)',
        'Sem ComplianceStatus entity (relevante para disputes) usada',
        'Sem MED entity usada (relevante para PIX disputes)',
        'AgentChatInterface processa mocks (sem LLM real)',
        'Sem persistência de regras (CRUD não funcional)',
      ],
    },

    settingsMicroscopic: {
      role: 'Página standalone de configurações globais do Dispute Manager',
      menuPosition: 'NÃO está no menu — acessível apenas por Link "Configurar" do Hub',
      uniqueness: 'ÚNICA settings page com 5 Tabs (vs 4 das demais Recovery/Converter/PagSmile)',

      stateManagement: {
        settings: 'object com 19 KEYS — A MAIOR collection state de TODAS as settings pages do Admin Interno',
        keysBreakdown: {
          global_3: 'agentEnabled / autoContestHighProbability / minWinProbabilityForAutoContest',
          autoAccept_3: 'enableAutoAcceptGlobal / globalAutoAcceptMaxValue / autoAcceptIfNoEvidence (NOVO — não existe no Hub)',
          escalation_3: 'escalateHighValue / globalHighValueThreshold / escalateToComplianceAbove (NOVO — Compliance threshold R$ 50000)',
          sla_3: 'slaResponseHours 48h / slaEscalationHours 24h / autoAssignAnalyst (TODOS NOVOS — não existem no Hub)',
          ratio_4: 'monitorChargebackRatio / ratioAlertThreshold / ratioCriticalThreshold / autoBlockAboveCritical',
          notifications_5: 'notifyNewDispute / notifyHighValue / highValueNotificationThreshold / notifyRatioAlert (NOVO) / dailyDigest+digestTime "08:00" (NOVOS)',
        },
        gap: '5 keys exclusivas da Settings (autoAcceptIfNoEvidence, escalateToComplianceAbove, slaResponseHours, slaEscalationHours, autoAssignAnalyst, notifyRatioAlert, dailyDigest, digestTime) — usuário só vê estes campos se acessar a página standalone, NÃO via Hub Tab "rules"',
      },

      header: {
        backButton: 'ArrowLeft Link → AdminIntDisputeManager',
        icon: 'Gavel red-500 to orange-500 gradient — IDÊNTICO ao Hub (consistência cromática — diferente do Recovery onde divergiu)',
        title: '"Configurações Globais - Dispute Manager"',
        subtitle: '"Parâmetros de disputas para toda a plataforma"',
        actions: '[Resetar Button outline (sem reset funcional) / Salvar Button red-600]',
      },

      tabsContainer: {
        tabsList: 'grid-cols-5 (automation/sla/ratio/escalation/notifications) — ÚNICA settings com 5 Tabs',

        automationTab: {
          card: 'Card "Automação de Contestação"',
          fields: [
            'Switch Agente Ativo Globalmente',
            'Switch Contestar Automaticamente (Alta Probabilidade)',
            'Slider 70-95 step=5 disabled-when-switch-off c/ display flex-1+span w-16 right "{N}%" (PADRÃO IDÊNTICO ao ConverterAgentSettings)',
            'Switch Habilitar Auto-Aceitar Globalmente',
            'Input number Valor Máximo Global Auto-Aceitar c/ R$ prefix disabled-when-switch-off',
          ],
        },

        slaTab: {
          uniqueness: 'TAB EXCLUSIVA deste agente — não existe SLA tab em outros settings (Recovery+Converter+PagSmile)',
          card: 'Card "Acordos de Nível de Serviço (SLA)"',
          fields: [
            'Input number "Tempo Máximo de Resposta Inicial" (horas) c/ description "Tempo máximo para primeira ação"',
            'Input number "Tempo para Escalonamento Automático" (horas) c/ description "Se não houver ação, escala para supervisor"',
            'Switch "Atribuição Automática de Analista" c/ description "Distribui disputas automaticamente"',
          ],
          businessLogicGap: 'SLA timers declarados (48h+24h) mas sem cron job ou backend que execute escalation real',
        },

        ratioTab: {
          card: 'Card "Monitoramento de Chargeback Ratio"',
          fields: [
            'Switch Monitorar Ratio',
            'Input number step="0.1" Threshold de Alerta % disabled-when-switch-off (DIFERENTE do Hub que usa Slider*10 hack)',
            'Input number step="0.1" Threshold Crítico % disabled-when-switch-off',
            'Switch destacado bg-red-50 "Bloquear Acima do Crítico" disabled-when-switch-off',
          ],
          uxInconsistency: 'Settings usa Input step="0.1" enquanto Hub Tab "rules" usa Slider matemático *10÷10 — 2 paradigmas diferentes para o mesmo dado fracionário',
        },

        escalationTab: {
          uniqueness: 'TAB EXCLUSIVA deste agente — não existe em outras settings',
          card: 'Card "Regras de Escalonamento"',
          fields: [
            'Switch Escalar Valores Altos',
            'Input R$ Threshold de Valor Alto (Supervisor) — disabled-when-switch-off — default R$ 10000',
            'Input R$ Threshold para Compliance — NÃO disabled mesmo se escalateHighValue=false (gap potencial mas funciona) — default R$ 50000',
          ],
          businessLogic: 'Hierarquia: < R$ 10k = analista / R$ 10k-50k = supervisor / > R$ 50k = compliance',
        },

        notificationsTab: {
          card: 'Card "Notificações da Equipe"',
          fields: [
            'Switch Nova Disputa Recebida (notifyNewDispute)',
            'Row dupla Switch + Input R$ disabled-when-switch-off (Disputa de Alto Valor)',
            'Switch Alerta de Ratio (notifyRatioAlert) — chave que NÃO existe no Hub state',
            'Row dupla Switch + Input type="time" disabled-when-switch-off (Digest Diário c/ digestTime "08:00")',
          ],
          uniqueKeys: 'notifyRatioAlert, dailyDigest, digestTime são EXCLUSIVAS desta página (Hub não tem)',
        },
      },

      saveBehavior: {
        function: 'handleSave',
        action: '`alert("Configurações globais do Dispute Manager salvas!")` browser nativo',
        gap: 'IGUAL aos outros 3 settings (PagSmile/Recovery/Converter) — todos usam alert() em vez de toast.success com sonner — gap UX transversal',
      },

      knownGapsSettings: [
        'state DUPLICADO de 14 keys com Hub Tab "rules" (sem sync — edits não conversam)',
        '5 keys EXCLUSIVAS da Settings que não existem no Hub Tab "rules" (autoAcceptIfNoEvidence, escalateToComplianceAbove, sla*, autoAssignAnalyst, notifyRatioAlert, dailyDigest+digestTime) — usuário só vê esses campos se entrar na página standalone',
        'Settings ratio Tab usa Input step="0.1" enquanto Hub usa Slider*10÷10 — 2 paradigmas inconsistentes',
        'Save = browser alert() em vez de toast',
        'Resetar Button SEM onClick funcional',
        'SLA timers declarados mas sem cron/backend para enforcement',
        'escalateToComplianceAbove Input NÃO disabled mesmo quando escalateHighValue=false (potencialmente problemático)',
        'Sem entity AiAgentConfig usado para persistir',
        'Sem versionamento de regras',
        'Sem teste pré-save',
      ],
    },
  },

  technical: {
    fileLocations: {
      hub: 'pages/AdminIntDisputeManager.jsx (700 linhas — 2ª maior dos hubs IA atrás do PagSmileCopilot 878L)',
      settings: 'pages/AdminIntDisputeManagerSettings.jsx (430 linhas — 2ª maior dos settings atrás do ConverterAgentSettings 409L)',
    },

    arrayLocationInLayoutJsx: {
      file: 'layout.jsx',
      block: '`aiAgentsAdminInterno` — linhas 414-421 (DECLARADO FORA do `getAdminInternoMenuItems`)',
      indexInArray: '3 (4º item, posição 0-indexed)',
      renderingLocation: 'Sidebar dentro de `<ScrollArea>` em condicional `{sidebarOpen && currentModule === "admin-interno" && ...}` linhas 864-908',
      visualSeparation: 'Linha divisória horizontal + label "Agentes IA" purple-400 uppercase tracking-widest (linhas 866-873)',
      iconUsedInSidebar: 'Sparkles purple-to-indigo gradient — TODOS os 5 agentes usam mesmo ícone Sparkles na sidebar',
    },

    sharedAgentChatPattern: {
      sharedComponents: ['AgentChatInterface', 'AgentFloatingButton'],
      sharedImports: '`import { processDisputeManagerAdminMessage, disputeManagerAdminQuickPrompts } from "@/components/agents/DisputeManagerChatLogic"`',
      props: '{ agentName="dispute_manager_admin", agentDisplayName="Dispute Manager", agentDescription="Visão consolidada de disputas", quickPrompts, onProcessMessage, welcomeMessage, isOpen, onClose, isFullscreen, onToggleFullscreen, accentColor="#ef4444" }',
      consistencyWithOthers: 'Mesmo pattern dos 4 outros agentes (PagSmile/Recovery/Converter + Identity ainda não documentado)',
    },

    saveBehaviorInconsistency: {
      pages: ['DisputeManager (Hub Tab rules SEM onClick)', 'DisputeManagerSettings (alert() browser)'],
      pattern: 'Hub Tab rules tem Save Button SEM onClick / Settings page usa alert() browser',
      gap: 'Hub é PIOR que Settings (zero feedback) — Settings é igual aos outros 3 settings (alert vs toast)',
    },

    duplicationCriticalDisputeManager: {
      issue: 'Hub Tab "rules" duplica 14 keys do state da Settings standalone (de 19 keys totais) — 5 keys SÓ EXISTEM na Settings (SLA + Escalation + 3 notifications)',
      uniqueAspect: 'Hub usa Slider*10÷10 hack para ratio thresholds, Settings usa Input step="0.1" — 2 UX paradigms divergentes para mesmos campos',
      gap: 'Edição em uma página NÃO reflete na outra — usuário pode confundir qual é a fonte de verdade',
      comparisonWithPagSmile: 'PagSmile DUPLICA 100% das settings (mesmas 16 keys); DisputeManager DUPLICA PARCIALMENTE (14/19 keys) com paradigm differente em ratio',
    },

    crossPageNavigation: {
      hubToSettings: 'Link "Configurar" Button outline header → AdminIntDisputeManagerSettings',
      settingsToHub: 'ArrowLeft Link header → AdminIntDisputeManager',
      noOtherCrossLinks: 'Hub NÃO linka para outras páginas do Admin Interno (vs PagSmileCopilot que tem 4 cross-links + Recovery que tem 1)',
      isolation: 'Dispute Manager Hub é uma ILHA — não navega para AdminIntChargebacksList nem AdminIntPreChargebacks nem AdminIntDisputeContestation que existem no Admin Interno',
    },

    rechartsUsage: {
      hubUses: 'LineChart (overview tab) + PieChart (overview tab) — ÚNICO dos agentes que usa PieChart',
      noBarChart: 'Diferentemente de Recovery (BarChart no overview) e Converter (sem BarChart) — Dispute usa apenas Line+Pie',
    },

    iconColorsHardcoded: {
      hubGradient: 'red-500 to orange-500',
      settingsGradient: 'red-500 to orange-500 (CONSISTENTE com Hub — diferente do Recovery onde houve divergência)',
      buttonsAccent: 'red-600 (Salvar/Save buttons)',
      chatAccentColor: '#ef4444 (red-500)',
      gap: 'Cores hardcoded sem token design system, mas internamente CONSISTENTES',
    },

    sliderHackUnique: {
      issue: 'Slider shadcn aceita apenas inteiros — para representar fracionários 0.5%-2.0% no Hub Tab "rules":',
      hack: '`value=[settings.ratioAlertThreshold * 10]` no display + `onValueChange=([v]) => setSettings(... v / 10)` no save',
      ranges: 'min=5 max=20 step=1 para alerta (representa 0.5-2.0%) / min=10 max=30 step=1 para critical (representa 1.0-3.0%)',
      uxIssue: 'Label exibe `{settings.ratioAlertThreshold}%` (0.5-2.0) MAS Slider mostra valores inteiros 5-20 — usuário pode se confundir',
      inconsistencyWithSettings: 'Settings standalone usa Input number step="0.1" — abordagem mais clara, contradiz a do Hub',
    },

    knownGapsCrossSection: [
      '2/2 páginas mock — zero entity Dispute usada (entity existe completa com 30+ fields no schema)',
      'state settings DUPLICADO Hub Tab "rules" (14 keys) vs Settings standalone (19 keys) sem sync',
      '5 keys EXCLUSIVAS da Settings standalone (autoAcceptIfNoEvidence, escalateToComplianceAbove, slaResponseHours, slaEscalationHours, autoAssignAnalyst, notifyRatioAlert, dailyDigest, digestTime) — usuário só descobre esses parâmetros entrando na página standalone',
      'Slider HACK *10÷10 no Hub vs Input step="0.1" na Settings — 2 paradigmas para mesmo dado',
      'Hub Save Button "Salvar Configurações" SEM onClick — pior UX que Settings que usa alert',
      'Settings save = browser alert() — gap consistente entre os 4 settings dos agentes (PagSmile/Recovery/Converter/Dispute)',
      'Switch das automationRules SEM onCheckedChange — DECORATIVO',
      'Settings Button (icon) das automationRules SEM onClick',
      'SideDrawer "Nova Regra" Salvar apenas fecha sem persistir',
      'Cards urgentDisputes SEM onClick — não navegam para detalhe',
      'Eye/Search/Filter buttons na tab merchants SEM behavior',
      '4 AI Insights são strings hardcoded — sem LLM real ou cálculo',
      'COLORS array hardcoded local em vez de design tokens',
      'Threshold ratio > 1.2% para colorir red é hardcoded inline JSX (não vem de settings.ratioAlertThreshold = 1.0)',
      'KPI globalKpis.totalDisputes 847 vs Recovery activeMerchants 847 — coincidência suspeita entre agentes',
      'Sem entity Dispute / ComplianceStatus / MED usadas via SDK',
      'Sem cross-link para AdminIntChargebacksList / AdminIntPreChargebacks / AdminIntDisputeContestation que existem no Admin Interno (Hub é uma ilha)',
      'Sem persistência de regras CRUD (showNewRule fecha sem push)',
      'Sem cron job/backend para SLA enforcement (timers declarados sem execução real)',
      'AgentChatInterface processa mocks (sem LLM real conectado)',
      'Resetar buttons (Hub e Settings) SEM onClick funcional',
      'escalateToComplianceAbove Input NÃO disabled mesmo se escalateHighValue=false (gap potencial)',
      'urgentDisputes block é renderizado condicionalmente (length > 0) — boa prática mas mock sempre tem 3',
    ],
  },
};

export default AdminIntDisputeManagerDoc;