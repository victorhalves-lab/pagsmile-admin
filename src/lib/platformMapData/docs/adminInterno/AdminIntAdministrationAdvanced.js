// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — ADMINISTRAÇÃO AVANÇADA (Admin Interno)
// ----------------------------------------------------------------------------
// Cobre as ÚLTIMAS 5 páginas da seção "Administração" do menu lateral,
// EXATAMENTE na ordem em que aparecem em layout.jsx (linhas 357-361):
//
//   1. AdminIntMCCs.jsx          (189 linhas) — Catálogo MCCs c/ KPICard + Insights + Table 5 MCCs + Modal Novo
//   2. AdminIntMCCsAnalysis.jsx  (489 linhas — A ÚNICA NÃO-MOCK da seção inteira) — useQuery + Subaccount entity + KPIs computados + Detail Modal
//   3. AdminIntPartners.jsx      (129 linhas) — DataTable + 5 partners + Modal Novo Parceiro 6 fields
//   4. AdminIntFeePlans.jsx      (137 linhas) — 4 plan cards (Starter/Growth/Pro/Enterprise) + SideDrawer Novo Plano
//   5. AdminIntAiAgents.jsx      (100 linhas — A MENOR DA SEÇÃO) — Stats grid-4 + 3 AgentCards (PRISCILA/HELENA/DIA)
//
// PADRÃO TRANSVERSAL CRÍTICO DA SEÇÃO INTEIRA:
// - 4 das 5 são 100% MOCK / 1 é REAL (MCCsAnalysis usa entity Subaccount com filter status=active)
// - MCCsAnalysis É A EXCEÇÃO — única página em TODA Administração (Core+Advanced) que faz SDK call real
// - 3 navegações cross-page: AdminIntMCCs → AdminIntMCCDetail / AdminIntPartners → AdminIntPartnerDetail / AdminIntFeePlans → AdminIntFeePlanDetail (estas detail pages NÃO estão na seção do menu — são órfãs cliques internos)
// - Insights diários hardcoded em MCCs com Link para AdminIntMccIrregularities (também órfã)
// - AdminIntAiAgents não tem onClick em NENHUM botão (Configurar/Logs apenas visuais)
// ============================================================================

export const AdminIntAdministrationAdvancedDoc = {
  pageId: 'AdminIntAdministrationAdvanced',
  pagePaths: [
    '/AdminIntMCCs',
    '/AdminIntMCCsAnalysis',
    '/AdminIntPartners',
    '/AdminIntFeePlans',
    '/AdminIntAiAgents',
  ],
  module: 'Admin Interno',
  section: 'Administração — Parte 2: MCCs → MCCsAnalysis → Partners → FeePlans → AiAgents',

  explainer: {
    oneLiner:
      'Segunda metade da seção "Administração" (layout.jsx linhas 357-361) — 5 páginas cobrindo gestão DE CATÁLOGO/PARCERIA/PLANOS/IA. (1) AdminIntMCCs 189L é o catálogo de Merchant Category Codes — Header c/ Tag icon + Button "Novo MCC" → setNewMCCModal(true), Insights Card top em bg-blue-50 com 3 mensagens hardcoded (🏷️ "5 merchants podem estar com MCC incorreto" + Link `createPageUrl("AdminIntMccIrregularities")` que NAVEGA mas a página AdminIntMccIrregularities NÃO ESTÁ NO MENU — é órfã / 📊 "MCC 5411 (Supermercados) tem margem 15% abaixo do esperado" / 💰 "MCC 5734 (Software) é o mais rentável: margem média 1.45%"), KPIs grid-6 usando o componente shared `KPICard` de `@/components/dashboard/KPICard` (única página da seção que IMPORTA KPICard externo) com 6 cards: MCCs Ativos 45 / Top MCC 5411 Supermercados / TPV Total R$ 85M com change=+12% / Margem Média 0.95% com change=-5% trend=down / Irregularidades 5 com border-l-4 border-l-amber-500 (props className passado no spread) / Alto Risco 3 com border-l-4 border-l-red-500; Catálogo Card com Search Input controlado + Button outline "Filtros" SEM onClick + Table shadcn 7-col (Código font-mono+font-medium / Descrição / Merchants count / Risco Badge via getRiskBadge helper inline 3 cores low=green/medium=yellow/high=red / Interchange / TPV format prefix "R$ " / Ações 2 ghost buttons — Eye com asChild+Link `createPageUrl("AdminIntMCCDetail", {code: mcc.code})` que passa CODE como query param + Settings ghost SEM onClick) com 5 MCCs hardcoded (5411 Supermercados low / 5734 Software low / 5812 Restaurantes low / 5651 Roupas medium / 7995 Apostas e Loterias HIGH RESTRICTED 2.50% interchange — única non-active); Modal "Novo MCC" Dialog (não SideDrawer) com 4 fields (Código maxLength=4 / Descrição / Categoria Select 5opts varejo/serviços/alimentação/tecnologia/entretenimento / Nível de Risco Select 3opts default low) + Interchange Base Input number step=0.01 + footer toast.success fake; (2) AdminIntMCCsAnalysis 489L é A ÚNICA PÁGINA DA SEÇÃO INTEIRA QUE USA SDK REAL — `useQuery({queryKey: ["mcc-analysis-subaccounts"], queryFn: () => base44.entities.Subaccount.filter({status: "active"}, "-total_volume", 500)})` retorna até 500 subaccounts ativos ordenados por total_volume desc; tem 2 components inline (KPICard local DIFERENTE do importado em outras páginas — esse aceita {title, value, subtitle, icon: Icon, color, trend} com div p-2 rounded-lg color + Icon white + tem trend opcional / ComplianceStatusBadge inline com 4 status configurados (compliant green CheckCircle / potential_deviation orange AlertTriangle / under_review blue Clock / not_registered slate XCircle) com fallback para not_registered se status não existir; KPIs computados via React.useMemo em function dependente de subaccounts: total=length / compliant=filter mcc_compliance_status==="compliant" / deviations=filter potential_deviation / underReview / notRegistered=filter !status OR not_registered (DUPLA VERIFICAÇÃO null-safe) / totalImpact=reduce somando mcc_impact_revenue || 0 / complianceRate=(compliant/total*100).toFixed(1) — fallback 0 se total=0; KPI grid-6 com 6 cards (Total Merchants slate / Conformes green + subtitle "{rate}% do total" / Possíveis Desvios orange / Em Revisão blue / Não Registrados slate-400 / Impacto Estimado red + subtitle "Em receita perdida"); Filtros Card com Search Input + Status Select 5opts (filtro ATIVO REAL que aplica 4 conditions OR no business_name+document+mcc_declared+mcc_observed); Table com ScrollArea h-[500px] (única página com scroll lock) e 7 colunas (Merchant nome+document / CNAE Declarado Badge outline font-mono OR "-" / MCC Declarado Badge primary OR "-" / MCC Observado Badge condicional bg-orange se declared!==observed ELSE bg-green / Status via ComplianceStatusBadge / Impacto orange-600 formatado OR "-" / Ações Eye→handleViewDetails(merchant)) — render condicional 3-states: isLoading TableRow colSpan=7 "Carregando..." / filteredSubaccounts.length===0 "Nenhum merchant encontrado" / ELSE map com hover:bg-slate; Detail Modal max-w-2xl com 5 SEÇÕES verticais: (a) Merchant Info grid-2 box bg-slate-50 (Razão Social / CNPJ font-mono / TPV Total formatCurrency / Status badge), (b) MCC Comparison grid-2 com 2 sub-Cards (Declarado: CNAE outline + MCC primary / Observado: CNAE outline + MCC condicional orange OR green se mismatch), (c) AI Analysis Card CONDICIONAL `IF mcc_ai_justification` com header "🤖 Análise da IA" + paragraph slate-600, (d) Impact Box CONDICIONAL DUPLA `IF impact && impact !== 0` com bg-orange-50 + DollarSign icon + valor bold orange-700, (e) Last Analysis CONDICIONAL `IF mcc_last_analyzed_date` com Date.toLocaleString("pt-BR"), (f) footer com Button "Fechar" + Button "Ver Perfil Completo" SEM onClick efetivo (gap navigation); (3) AdminIntPartners 129L é A MENOR depois de AiAgents — usa DataTable de @/components/common/DataTable (TanStack-style com columns/data/cell render functions), 5 partners hardcoded (Adyen Adquirente prioridade 1 R$ 45M 2.15% / Stone prioridade 2 / Cielo prioridade 3 / Konduto Antifraude TPV "-" custo "R$ 0.06/tx" prio 1 / Banco Central PSP Pix R$ 0.00 — única com cost gratuito), columns array 7 fields (Parceiro span font-bold / Tipo / Status SEMPRE renderiza Badge "Ativo" green hardcoded IGNORANDO o data — gap visual / TPV Mês com cell condicional `i.getValue() === "-" ? "-" : `R$ ${i.getValue()}`` / Custo / Prioridade / Ações asChild Link → `createPageUrl("AdminIntPartnerDetail")` SEM passar id do parceiro — gap CRÍTICO de navegação); Modal "Novo Parceiro" Dialog max-w-lg com 6 fields (Nome / Tipo Select 5opts acquirer/antifraud/psp/gateway/processor / Prioridade Select 3opts default 1 / Status Select 3opts default active / API Endpoint / API Key type=password) + footer toast fake; (4) AdminIntFeePlans 137L exibe 4 plan cards em grid-4 — Header c/ DOIS botões (variant outline "Simulador" → asChild Link createPageUrl("AdminIntPriceSimulator") órfã navegação + "Novo Plano" Plus → setNewPlanModal(true)), Cards layout grid-1/2/4 cada com hover:shadow-lg + cursor-pointer + group, conteúdo: header com Badge type "Padrão" outline + Title group-hover:text-primary + BarChart2 icon que muda bg-slate→primary/10 no hover, body com 4 lines flex justify-between (Cartão 1x font-bold / Pix font-bold / Prazo / Rolling Reserve) + footer border-t com merchants count + Button ghost "Detalhes Eye" → asChild Link `createPageUrl("AdminIntFeePlanDetail", {id: plan.code})` (PASSA ID, diferente de Partners!), 4 plans hardcoded em escala progressiva (Starter 4.99% card+1.49% pix+RR 5%+D+30+89 merchants / Growth 3.99%+0.99%+3%+D+15+156 / Pro 3.29%+0.89%+2%+D+15+98 / Enterprise 2.79%+0.59%+0%+D+2+23 — Enterprise tem RR ZERO, único); SideDrawer "Novo Plano de Taxas" (não Dialog) com 7 fields organizados (Nome / Código / Tipo Select 3opts default padrao / grid-2 Taxa Cartão 1x + Taxa PIX number step=0.01 / grid-2 Rolling Reserve number step=1 + Prazo Liquidação Select 3opts d2/d15/d30 default d15) + footer toast fake; (5) AdminIntAiAgents 100L é a MENOR PÁGINA da seção inteira — sem useState, sem state algum, completamente estática; AgentCard component inline reutilizável recebe (name, role, status, metrics, icon: Icon, color) com layout flex justify-between header (icon p-2 rounded color background + Title + role) + Badge status (active=bg-green-100 text-green-700 / inactive=secondary com emoji 🟢 ON / ⚫ OFF) + body com metrics.map (label/value), footer 2 buttons "Configurar" e "Logs" 50% width cada — TODOS SEM onClick (gap CRÍTICO: nenhum botão funciona); Stats grid-4 acima dos cards com 4 mini-cards hardcoded (Agentes Ativos 3 / Análises Hoje 856 / Taxa Sucesso 98% green / Tempo Médio 1.2s); 3 AgentCards renderizados (PRISCILA Pricing Intelligence purple Target — 45 análises 94% precisão 38 leads / HELENA KYC Analysis blue ShieldCheck — 28 análises 72% auto-aprovação 4.5s tempo / DIA Copiloto Inteligente emerald Brain — 783 interações 4.5/5 satisfação 156 insights gerados); gap PESADO: NÃO usa o pattern AiAgentConfig do schema (existe entity AiAgentConfig na seção referenciada em outras páginas), NÃO LINKA para AdminIntCommercialInsights ou AdminIntCopilot ou AdminIntPagSmileCopilotSettings que são onde os AGENTES REALMENTE são configurados, hardcoded como showcase visual.',

    mccsMicroscopic: {
      role: 'Catálogo de MCCs (Merchant Category Codes) — taxonomia de categorias',
      menuPosition: 'Linha 357 do layout.jsx — t("menu_admin.mccs")',
      breadcrumbs: '[Administração → MCCs]',
      stateManagement: {
        searchTerm: 'string — Search Input controlado (mas .filter NÃO aplicado na render)',
        newMCCModal: 'boolean — Modal Novo MCC',
      },
      hardcodedDataSources: {
        kpis: '6 itens (MCCs Ativos 45 / Top 5411 Supermercados / TPV R$85M +12% / Margem 0.95% -5% / Irregularidades 5 amber border / Alto Risco 3 red border)',
        mccs: '5 entries (5411 Supermercados / 5734 Software / 5812 Restaurantes / 5651 Roupas / 7995 Apostas RESTRICTED — única não-active)',
      },
      kpiCardImport: {
        component: '@/components/dashboard/KPICard',
        gap: 'ÚNICA página da seção que usa KPICard externo — outras 4 fazem inline',
        propsExpanded: 'Spread {...kpi} permite passar `className` extra (border-l-4 border-l-amber/red para diferenciar)',
      },
      insightsCard: {
        position: 'top — antes dos KPIs',
        background: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100',
        items3: [
          '🏷️ "5 merchants podem estar com MCC incorreto" + Link createPageUrl("AdminIntMccIrregularities")',
          '📊 "MCC 5411 (Supermercados) tem margem 15% abaixo do esperado"',
          '💰 "MCC 5734 (Software) é o mais rentável: margem média 1.45%"',
        ],
        gap: 'Página AdminIntMccIrregularities NÃO está no menu lateral (órfã) — Link sem destino visível ao usuário no menu',
      },
      catalogTable: {
        type: 'Table shadcn 7-col',
        cols: '[Código font-mono+font-medium / Descrição / Merchants count / Risco Badge / Interchange / TPV / Ações]',
        riskBadgeHelper: {
          inline: true,
          name: 'getRiskBadge',
          rule: '{low: green / medium: yellow / high: red / DEFAULT: gray label=raw}',
        },
        actions: '[Eye asChild → AdminIntMCCDetail?code={mcc.code} / Settings ghost SEM onClick]',
        gap: 'Search Input controlado mas filtro .filter() NÃO aplicado nas mccs renderizadas / Filtros button SEM onClick',
      },
      newMCCModal: {
        type: 'Dialog (não SideDrawer)',
        fields: '[Código maxLength=4 / Descrição / grid-2(Categoria 5opts / Risco 3opts default low) / Interchange Base number step=0.01]',
        submit: 'toast.success("MCC cadastrado com sucesso!") fake',
      },
      knownGapsMCCs: [
        'Search Input controlado mas .filter() não aplicado',
        'Filtros button sem onClick',
        'Settings action ghost sem onClick',
        'Link Insights → AdminIntMccIrregularities órfã (não está no menu)',
        'AdminIntMCCDetail também não está no menu',
        'KPI Margem Média format quebrado: value="0.95" suffix="%" mas falta `.` decimal indicator',
        'Sem entity MCC no schema (existe MCC entity referenciada mas não usada aqui)',
        'Sem export do catálogo',
      ],
    },

    mccsAnalysisMicroscopic: {
      role: 'ÚNICA PÁGINA DA SEÇÃO ADMINISTRAÇÃO QUE USA SDK REAL — análise de conformidade MCC/CNAE',
      menuPosition: 'Linha 358 — t("menu_admin.mccs_analysis")',
      breadcrumbs: '[Admin Interno → Administração → Análise de MCCs]',
      crossSectionUniqueness: 'É A ÚNICA das 13 páginas da seção Administração que faz queryFn real — Core (8 páginas) e outras 4 da Avançada (MCCs/Partners/FeePlans/AiAgents) são todas mock',
      stateManagement: {
        searchTerm: 'string — controla 4-OR search no business_name+document+mcc_declared+mcc_observed',
        statusFilter: 'string default "all" — 5 opts (all/compliant/potential_deviation/under_review/not_registered)',
        selectedMerchant: 'object|null — merchant para Detail Modal',
        isModalOpen: 'boolean',
      },
      sdkCall: {
        type: '@tanstack/react-query useQuery',
        queryKey: '["mcc-analysis-subaccounts"]',
        queryFn: 'base44.entities.Subaccount.filter({status: "active"}, "-total_volume", 500)',
        limit: 500,
        sort: '"-total_volume" descendente',
        gap: 'Hard limit 500 — para PagSmile com >500 active subaccounts, alguns ficam fora do dashboard',
      },
      inlineComponents: {
        KPICard: {
          differentFromOtherPages: 'INLINE diferente do @/components/dashboard/KPICard usado em AdminIntMCCs — duplicação',
          props: '{title, value, subtitle, icon: Icon, color, trend}',
          structure: 'Card → div flex justify-between → texts left + Icon p-2 rounded color',
        },
        ComplianceStatusBadge: {
          props: '{status}',
          configMap: '{compliant: green CheckCircle / potential_deviation: orange AlertTriangle / under_review: blue Clock / not_registered: slate XCircle}',
          fallback: 'cfg = config[status] || config.not_registered',
        },
      },
      kpisComputed: {
        method: 'React.useMemo dependent on subaccounts',
        items: [
          'total = subaccounts.length',
          'compliant = filter status==="compliant"',
          'deviations = filter status==="potential_deviation"',
          'underReview = filter status==="under_review"',
          'notRegistered = filter !status OR ==="not_registered" — DUPLA verificação null-safe',
          'totalImpact = reduce sum(mcc_impact_revenue || 0)',
          'complianceRate = total>0 ? (compliant/total*100).toFixed(1) : 0',
        ],
        kpiGrid6: 'Total slate / Conformes green + sub `${rate}% do total` / Possíveis Desvios orange / Em Revisão blue / Não Registrados slate-400 / Impacto Estimado red + sub "Em receita perdida"',
      },
      filtering: {
        active: true,
        rule: 'matchesSearch (4 OR conditions) AND matchesStatus (special handling para not_registered que checa null OR ==="not_registered")',
      },
      mainTable: {
        scroll: 'ScrollArea h-[500px] — única página com scroll lock',
        cols: '[Merchant name+document / CNAE Declarado Badge outline / MCC Declarado Badge primary / MCC Observado Badge CONDICIONAL bg-orange se declared!==observed ELSE bg-green / Status / Impacto orange-600 / Ações Eye→handleViewDetails]',
        emptyStates: '[isLoading: "Carregando..." / length===0: "Nenhum merchant encontrado" / ELSE: render]',
        gap: 'Sem ação Bulk para corrigir MCCs em lote',
      },
      detailModal: {
        size: 'max-w-2xl',
        sections5_with_conditional: [
          'Merchant Info grid-2 (Razão Social / CNPJ font-mono / TPV formatCurrency / Status Badge)',
          'MCC Comparison grid-2 sub-Cards (Declarado vs Observado — Observado MCC tem cor condicional orange/green)',
          'AI Analysis CONDICIONAL `IF mcc_ai_justification` (single block "🤖 Análise da IA")',
          'Impact Box CONDICIONAL DUPLA `IF impact && impact !== 0` (bg-orange-50)',
          'Last Analysis CONDICIONAL `IF mcc_last_analyzed_date` (Date.toLocaleString)',
        ],
        footer: '[Fechar / Ver Perfil Completo SEM onClick — gap CRÍTICO de navegação]',
      },
      knownGapsMCCsAnalysis: [
        'Hard limit 500 subaccounts (não pagina)',
        '"Ver Perfil Completo" button sem onClick — não navega para AdminIntMerchantProfile',
        'Sem ação Bulk para corrigir MCCs',
        'Sem botão "Forçar nova análise IA"',
        'Sem export real (botão visual)',
        'Sem indicador "última análise + cron próxima"',
        'KPICard inline duplicado vs MCCs.jsx (componente shared não usado)',
      ],
    },

    partnersMicroscopic: {
      role: 'Gestão de parceiros e provedores (Adquirentes/Antifraude/PSP)',
      menuPosition: 'Linha 359 — t("menu_admin.partners")',
      breadcrumbs: '[Administração → Parceiros]',
      stateManagement: {
        newPartnerModal: 'boolean — Modal Novo Parceiro',
      },
      hardcodedDataSources: {
        partners: '5 (Adyen Adquirente prio1 R$45M 2.15% / Stone prio2 / Cielo prio3 / Konduto Antifraude TPV "-" R$0.06/tx / BC PSP Pix R$0.00)',
      },
      dataTableUsage: {
        component: '@/components/common/DataTable (TanStack-style)',
        gap: 'ÚNICA página da seção Administração que usa DataTable shared — outras 4 (MCCs/MCCsAnalysis/FeePlans/AiAgents) usam Table shadcn / Cards / Custom inline',
      },
      columns7: {
        cols: [
          'Parceiro — span font-bold + i.getValue()',
          'Tipo — raw',
          'Status — SEMPRE renderiza Badge "Ativo" green HARDCODED (ignora data)',
          'TPV Mês — cell condicional getValue==="-" ? "-" : `R$ ${getValue()}`',
          'Custo Médio — raw',
          'Prioridade — raw',
          'Ações — asChild Link createPageUrl("AdminIntPartnerDetail") SEM ID — gap CRÍTICO',
        ],
        criticalBugs: [
          'Status SEMPRE Badge "Ativo" green — ignora data.status (testing/inactive não aparecem)',
          'Action Link SEM ID — todas as 5 rows linkam para o mesmo /AdminIntPartnerDetail sem context',
        ],
      },
      newPartnerModal: {
        type: 'Dialog max-w-lg',
        fields: '[Nome / Tipo 5opts (acquirer/antifraud/psp/gateway/processor) / grid-2(Prioridade 3opts def 1 / Status 3opts def active) / API Endpoint / API Key type=password]',
        submit: 'toast.success("Parceiro cadastrado com sucesso!") fake',
      },
      knownGapsPartners: [
        'Status column ignora dados (sempre Badge "Ativo")',
        'AdminIntPartnerDetail Link sem ID — não há context',
        'AdminIntPartnerDetail não está no menu lateral (órfã)',
        'Sem entity Partner no schema',
        'Sem analytics de uptime/SLA por parceiro',
        'Sem orchestration rules',
        'Duplica AdminIntIntegrations — duas páginas com providers similares (Acquirers/Antifraude/PSP)',
      ],
    },

    feePlansMicroscopic: {
      role: 'Catálogo de planos de taxas — 4 tiers (Starter/Growth/Pro/Enterprise)',
      menuPosition: 'Linha 360 — t("menu_admin.fee_plans")',
      breadcrumbs: '[Administração → Planos]',
      stateManagement: {
        newPlanModal: 'boolean — SideDrawer Novo Plano',
      },
      hardcodedDataSources: {
        plans: '4 tiers em escala progressiva (Starter 4.99/1.49/RR5%/D+30/89 / Growth 3.99/0.99/3%/D+15/156 / Pro 3.29/0.89/2%/D+15/98 / Enterprise 2.79/0.59/0%/D+2/23 — Enterprise zera RR)',
      },
      pageHeaderActions: {
        twoButtons: '[outline "Simulador" asChild Link AdminIntPriceSimulator / "Novo Plano" Plus → setNewPlanModal]',
        gap: 'AdminIntPriceSimulator ÓRFÃ — não está no menu lateral',
      },
      planCardsGrid: {
        layout: 'grid-1 md:2 lg:4',
        hover: 'hover:shadow-lg + cursor-pointer + group (icon muda bg-slate→primary/10)',
        body: '[Cartão 1x font-bold / Pix font-bold / Prazo / Rolling Reserve]',
        footer: '[merchants count text-xs / Button ghost "Detalhes Eye" asChild → AdminIntFeePlanDetail?id={code}]',
        gap: 'AdminIntFeePlanDetail também ÓRFÃ — não está no menu',
        positiveCompare: 'PASSA ID via createPageUrl({id: plan.code}) — diferente de Partners que NÃO passa ID',
      },
      newPlanSideDrawer: {
        type: 'SideDrawer (não Dialog)',
        gap: 'Inconsistência — outras 4 páginas da Administração Avançada usam Dialog',
        fields7: '[Nome / Código / Tipo 3opts def padrao / grid-2 Cartão 1x + PIX number step=0.01 / grid-2 RR number step=1 + Prazo 3opts d2/d15/d30 def d15]',
        submit: 'toast.success("Plano criado com sucesso!") fake',
      },
      knownGapsFeePlans: [
        '2 navegações órfãs (Simulador e Detail)',
        'Sem entity FeePlan/RatePlan usada',
        'Sem comparativo entre planos',
        'Sem hist de migrações de merchants entre planos',
        'Sem A/B testing de pricing',
        'SideDrawer inconsistente vs outras páginas',
        'merchants count hardcoded — não vem de query',
      ],
    },

    aiAgentsMicroscopic: {
      role: 'Showcase visual de 3 agentes de IA — A MENOR PÁGINA DA SEÇÃO',
      menuPosition: 'Linha 361 — t("menu_admin.ai_agents")',
      breadcrumbs: '[Administração → Agentes IA]',
      stateManagement: 'NENHUM — completamente estática (zero useState)',
      hardcodedDataSources: {
        statsGrid4: '[Agentes Ativos 3 / Análises Hoje 856 / Taxa Sucesso 98% green / Tempo Médio 1.2s]',
        agents3: '[PRISCILA Pricing Intelligence purple Target / HELENA KYC Analysis blue ShieldCheck / DIA Copiloto Inteligente emerald Brain]',
      },
      agentCardInline: {
        component: 'AgentCard recebe (name, role, status, metrics, icon: Icon, color)',
        structure: 'Card → header flex justify-between (icon p-2 colored + Title + role) + Badge (active=green com 🟢 ON / ELSE secondary com ⚫ OFF) → body metrics.map + footer 2 buttons "Configurar"+"Logs" SEM onClick',
        criticalGap: 'TODOS os botões SEM onClick — Configurar e Logs apenas visuais',
      },
      threeAgents: {
        priscila: '{name: PRISCILA, role: "Pricing Intelligence", color: bg-purple-500, metrics: [Análises 45, Precisão 94%, Leads 38]}',
        helena: '{name: HELENA, role: "KYC Analysis", color: bg-blue-500, metrics: [Análises 28, Auto-aprovação 72%, Tempo 4.5s]}',
        dia: '{name: DIA, role: "Copiloto Inteligente", color: bg-emerald-500, metrics: [Interações 783, Satisfação 4.5/5, Insights 156]}',
      },
      crossPageGap: {
        priscilaTrueLocation: 'PRISCILA (Pricing) é gerenciada em AdminIntCommercialInsights (Comercial)',
        helenaTrueLocation: 'HELENA (KYC) é gerenciada em AdminIntComplianceHelena (Compliance)',
        diaTrueLocation: 'DIA (Copilot) é gerenciada em AdminIntPagSmileCopilot/Settings (Análise+Insights)',
        gap: 'Página AiAgents é apenas SHOWCASE — não navega/gerencia nada real',
      },
      knownGapsAiAgents: [
        'Página 100% mock — zero state, zero SDK',
        'Configurar/Logs buttons SEM onClick (gap CRÍTICO)',
        'Não usa entity AiAgentConfig (existe no schema)',
        'Não navega para páginas reais de cada agente',
        'Stats hardcoded — não computado',
        'Sem histórico de execuções',
        'Sem AiAgentLog usage (existe no schema)',
        'Sem ação Pause/Resume',
        'Sem versionamento de prompt/modelo',
      ],
    },
  },

  technical: {
    fileLocations: {
      adminIntMCCs: 'pages/AdminIntMCCs.jsx (189 linhas)',
      adminIntMCCsAnalysis: 'pages/AdminIntMCCsAnalysis.jsx (489 linhas — MAIOR e ÚNICA real)',
      adminIntPartners: 'pages/AdminIntPartners.jsx (129 linhas)',
      adminIntFeePlans: 'pages/AdminIntFeePlans.jsx (137 linhas)',
      adminIntAiAgents: 'pages/AdminIntAiAgents.jsx (100 linhas — MENOR)',
    },
    menuOrderInLayoutJsx: {
      file: 'layout.jsx',
      block: 'getAdminInternoMenuItems(t) — id="admin" — linhas 357-361',
      submenu: [
        { line: 357, page: 'AdminIntMCCs', label: 't("menu_admin.mccs")' },
        { line: 358, page: 'AdminIntMCCsAnalysis', label: 't("menu_admin.mccs_analysis")' },
        { line: 359, page: 'AdminIntPartners', label: 't("menu_admin.partners")' },
        { line: 360, page: 'AdminIntFeePlans', label: 't("menu_admin.fee_plans")' },
        { line: 361, page: 'AdminIntAiAgents', label: 't("menu_admin.ai_agents")' },
      ],
    },
    realVsMock: {
      real: ['AdminIntMCCsAnalysis — useQuery + base44.entities.Subaccount.filter'],
      mock: ['AdminIntMCCs', 'AdminIntPartners', 'AdminIntFeePlans', 'AdminIntAiAgents'],
      summary: 'APENAS 1 das 5 páginas faz SDK call real (MCCsAnalysis). Combinado com Core: 1 das 13 da Administração inteira é real',
    },
    crossPageOrphanRoutes: {
      issue: 'Páginas de detalhe LINKADAS mas ÓRFÃS no menu lateral',
      orphanPages: [
        'AdminIntMccIrregularities — linkada por Insights de MCCs',
        'AdminIntMCCDetail — linkada por Eye action de MCCs',
        'AdminIntPartnerDetail — linkada por Settings action de Partners (sem ID)',
        'AdminIntFeePlanDetail — linkada por Detalhes de FeePlans (com ID)',
        'AdminIntPriceSimulator — linkada por Simulador button',
      ],
      gap: 'Usuário não consegue acessar via menu — só via cliques internos',
    },
    componentsSharedUsage: {
      KPICard: {
        externalImport: 'AdminIntMCCs usa @/components/dashboard/KPICard',
        inlineDuplicate: 'AdminIntMCCsAnalysis tem KPICard inline DIFERENTE (props diferentes)',
        gap: 'Duas implementações de KPICard na mesma seção — falta consolidação',
      },
      DataTable: {
        usage: 'Apenas AdminIntPartners',
        gap: 'Outras páginas usam Table shadcn ou Cards — DataTable shared subutilizado',
      },
      SideDrawer: {
        usage: 'Apenas AdminIntFeePlans (Modal Novo Plano)',
        otherPagesUseDialog: '4 outras páginas da Administração Avançada usam Dialog',
      },
    },
    sdkPatternComparison: {
      mccsAnalysis_useQuery: 'queryKey ["mcc-analysis-subaccounts"] / queryFn .filter({status: "active"}, "-total_volume", 500)',
      others: 'Zero useQuery — array hardcoded inline em const',
    },
    breadcrumbInconsistency: {
      mccsAnalysis: '[Admin Interno → Administração → Análise de MCCs] — TEM "Admin Interno"',
      others4: '[Administração → X] — SEM "Admin Interno"',
      gap: 'Inconsistência — apenas MCCsAnalysis segue o padrão completo',
    },
    knownGapsCrossSection: [
      '4/5 páginas mock — apenas MCCsAnalysis usa SDK',
      '5 páginas órfãs no menu (Detail/Simulator/Irregularities) — só acessíveis por clique interno',
      'AiAgents 100% showcase — Configurar/Logs sem onClick',
      'Partners.Status column SEMPRE Badge "Ativo" hardcoded (ignora data)',
      'Partners action Link SEM ID — todas linkam para mesma URL',
      'KPICard duplicado (external em MCCs vs inline em MCCsAnalysis)',
      'Insights MCCs com Link para AdminIntMccIrregularities (órfã)',
      'AiAgents NÃO LINKA para páginas reais de gestão de cada agente (PRISCILA → CommercialInsights / HELENA → ComplianceHelena / DIA → PagSmileCopilot)',
      'Templates DUPLICA CommTemplates (já apontado em Core)',
      'Partners DUPLICA Integrations (já apontado em Core)',
      'AiAgents DUPLICA partes de várias outras páginas',
      'Search Input MCCs controlado mas .filter() não aplicado',
      'MCCs.Filtros button sem onClick',
      'MCCsAnalysis.Ver Perfil Completo button sem onClick',
      'FeePlans 2 botões com Link órfão (Simulador + Detalhes)',
      'Sem entity MCC/Partner/FeePlan/AiAgentConfig usado',
      'Breadcrumbs inconsistentes (apenas MCCsAnalysis tem Admin Interno)',
      'SideDrawer apenas FeePlans (vs Dialog das outras 4)',
      'DataTable apenas Partners (vs Table/Cards das outras 4)',
      'AiAgents zero useState (vs todas as outras 4 com state)',
    ],
  },
};

export default AdminIntAdministrationAdvancedDoc;