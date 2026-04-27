// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — RELATÓRIOS (Admin Interno)
// ----------------------------------------------------------------------------
// Cobre as 6 PÁGINAS da seção "Relatórios" do menu lateral, EXATAMENTE na
// ordem em que aparecem em layout.jsx (linhas 316-328):
//
//   1. AdminIntReportsHub.jsx          (333 linhas) — Central c/ Favoritos+Recentes+Catálogo+Agendados
//   2. AdminIntReportsOperational.jsx  (314 linhas) — 4 Tabs (Summary/TPV/Conversion/Methods)
//   3. AdminIntReportsFinancial.jsx    (303 linhas) — 3 Tabs (Settlement/Receivables/DRE)
//   4. AdminIntReportsRisk.jsx         (334 linhas) — 3 Tabs (Chargebacks/CB Ratio/Fraud)
//   5. AdminIntReportsCustom.jsx       (306 linhas) — Construtor visual sem drag&drop real
//   6. AdminIntAnalytics.jsx           (296 linhas) — BI 5 Tabs c/ 4 placeholders
//
// PADRÃO TRANSVERSAL DA SEÇÃO INTEIRA:
// - 100% MOCK (zero SDK/persistência) — toda "geração" usa toast.success fake
// - Modais Dialog padronizados c/ Period Select + Format Select (xlsx/csv/pdf)
// - Recharts em 4 das 6 (Operational/Risk/Analytics/Financial-DRE)
// - Sem busca de dados via base44.entities — 100% array hardcoded no topo do arquivo
// - Sem schema validation — formatCurrency local em CADA arquivo (DRY violation)
// ============================================================================

export const AdminIntReportsDoc = {
  pageId: 'AdminIntReports',
  pagePaths: [
    '/AdminIntReportsHub',
    '/AdminIntReportsOperational',
    '/AdminIntReportsFinancial',
    '/AdminIntReportsRisk',
    '/AdminIntReportsCustom',
    '/AdminIntAnalytics',
  ],
  module: 'Admin Interno',
  section: 'Relatórios — 6 páginas (Hub → Operacionais → Financeiros → Risco → Customizados → Analytics)',

  explainer: {
    oneLiner:
      'Seção "Relatórios" do menu lateral do Admin Interno (layout.jsx linhas 316-328) com 6 páginas TODAS 100% mock — nenhuma SDK/persistência real. (1) ReportsHub 333L é a central de comando — Search Card único topo c/ Input lupa absolute (sem onChange real funcional, só searchQuery state — não filtra os 3 arrays mock abaixo), Card "Relatórios Favoritos" Star yellow c/ grid-3 c/ 3 itens hardcoded (TPV Diário/Liquidação/CB Ratio) cada um com icon BarChart3+DollarSign+Shield + Button "Gerar" full-width que abre setGenerateModal, Card "Relatórios Recentes" Clock c/ 3 mocks (Extrato Liquidação 245KB / Transações Sem 04 1.2MB / CBs Dezembro 520KB) com Button "Baixar" outline SEM onClick, Card "📋 Catálogo de Relatórios" Tabs all/operational/financial/risk c/ ReportRow component inline mostrando name+description+Star fav (toast.success fake) + Button "Gerar" — tab "all" mostra os 3 grupos empilhados (operational 5 itens / financial 4 itens / risk 4 itens), Card "Relatórios Agendados" Calendar c/ Button Plus "Agendar" (abre setScheduleModal) + 3 mocks (TPV 08:00 equipe@/Liquidação Segundas 09:00 financeiro@/CB Ratio Dia 1 às 10:00 risco@) com Button Settings sem onClick, Dialog Generate c/ DialogTitle DINÂMICO "Gerar Relatório: {generateModal?.name}" + Period Select 5-opções (today/7d/30d/month/custom) + Formato Select 3-opções (xlsx/csv/pdf) + Confirmar=toast.success fake, Dialog Schedule c/ Relatório Select 3-opções hardcoded + Frequência Select 3-opções (daily/weekly/monthly) + Email Input livre + Confirmar=toast.success "Agendamento criado!"; (2) ReportsOperational 314L é 4 Tabs sobre transações operacionais — Header c/ Period Select 3-opções (7d/30d/90d) + Button "Exportar Todos" (que abre o mesmo Dialog), 4 Tabs: tab "summary" Table 7-col Período/Total/Aprovadas green/Negadas red/Taxa(Badge >=90 green else yellow)/TPV/Ticket Médio com tfoot SOMA REAL via reduce + linha hardcoded 90.6%/761 — gap: tfoot calcula gross/net mas Taxa+Ticket são strings hardcoded (não recalcula); tab "tpv" BarChart Recharts stackId="a" 4 cores (Crédito blue / Débito purple / PIX emerald / Boleto amber) + Table 6-col com Total calculado via expression inline; tab "conversion" 5 estágios (15000→14800→14200→14200→12850) renderizados como divs com marginLeft/Right INCREMENTAL (idx*20px) simulando funil + linha "Perda: X (Y%)" condicional + green Card final "Taxa de Conversão Global: 85,7%"; tab "methods" PieChart 4 fatias hardcoded (Crédito 58 blue / PIX 25 emerald / Débito 12 purple / Boleto 5 amber) + lateral Cards lista; (3) ReportsFinancial 303L é 3 Tabs financeiros — tab "settlement" Table 9-col c/ MDR red negativo / OutrasFees red / CBs red condicional / Líquido green / Status Badge ("settled"=green / pending=yellow), tfoot c/ colSpan=2 e SOMA REAL via reduce de TODOS os campos numéricos; tab "receivables" Table 6-col com Antecipável Badge "✅ Sim" green / "❌ Não" slate, tfoot c/ totais reduce; tab "dre" P&L em DESENHO — H4 RECEITAS green-700 c/ 7 itens (├── prefix tree-style) + Total Receitas verde / H4 CUSTOS red-700 c/ 5 itens + Total negativo red / "RESULTADO OPERACIONAL" calculado dinamicamente (totalRevenue-totalCosts) c/ Margem percentual border-t-4 double — gap: cálculos reais MAS dados mock; (4) ReportsRisk 334L é 3 Tabs risco — tab "chargebacks" tem DOIS Cards: primeiro "📊 Chargebacks por Motivo" Table 5-col com Win Rate Badge (>=70 green / >=50 yellow / else red), segundo "📋 Lista de Chargebacks" Table 7-col com Status Badge 4 estados (open=yellow / in_contest=blue / won=green / lost=red); tab "cbRatio" Table 6-col c/ row.status="critical" aplicando bg-red-50 NA LINHA INTEIRA + Tendência icon (TrendingUp red / TrendingDown green / "→" stable) + ratioStatusConfig c/ emojis 🟢🟡🔴; tab "fraud" BarChart 2 series (blocked yellow / confirmed red) + Table 6-col c/ Fraud Rate calculado e Valor Evitado green com tfoot reduce e fraud rate hardcoded "0.29%"; (5) ReportsCustom 306L é o ÚNICO realmente "interativo" mas SEM drag&drop real — state pesado: reportName/dataSource/selectedFields[]/filters[]/groupBy/orderBy/orderDir, Card "📂 Fonte de Dados" Select 6-opções (transactions/merchants/chargebacks/meds/settlements/withdrawals) — gap: apenas transactions/merchants/chargebacks têm fields definidos no fieldsBySource (meds/settlements/withdrawals quebram silenciosamente retornando array vazio), lista de checkboxes dinâmica via toggleField; Card "📋 Campos Selecionados" mostra ordem 1./2./3. com GripVertical "cursor-move" mas SEM react-dnd ou pangea/dnd implementado (visual fake) — Trash2 remove via toggleField; Card "🔍 Filtros" array com addFilter/removeFilter/updateFilter — Select operator 7-opções (equals/not_equals/greater/less/between/contains/in) + Input value + IF operator==="between" mostra segundo Input value2; Card "📊 Agrupamento e Ordenação" Group By Select c/ "Nenhum" value=null (CRÍTICO: shadcn Select NÃO ACEITA value=null oficialmente — pode quebrar em edge cases), Order By + Direção asc/desc, 2 checkboxes "Incluir totais" / "Incluir subtotais por grupo" SEM state (não controlados); footer Buttons Pré-visualizar=toast.info "Preview seria exibido aqui" + Gerar=toast.success — gap: PageHeader recebe `actionElement` prop mas o componente PageHeader oficial usa `actions` (prop name errado, button do Salvar ao topo NÃO renderiza); (6) Analytics 296L é Business Intelligence c/ 5 Tabs MAS APENAS "overview" populada — tab "overview" tem 5 seções stack: AreaChart "Evolução do TPV (12 meses)" Recharts c/ 12 pontos + Badge "+12% vs mês anterior" hardcoded, grid-2 lado-a-lado: "Distribuição por Método" PieChart 4-cores idêntico ao Operational + "Top 10 Merchants" lista vertical numerada 1.-10. com TPV+pct, grid-2 lado-a-lado: "Taxa de Aprovação" BarChart vertical layout c/ 4 métodos (Crédito 91.2 / Débito 94.5 / PIX 99.2 / Boleto 72.3) + Média hardcoded "92,3%" + "Indicadores de Risco" 3 Cards green (CB Ratio 0,45% / Fraud Rate 0,08% / MED Rate 0,02%) + grid-2 Win Rate CB 68% / Win Rate MED 72% + texto "Merchants em alerta: 3", último Card "✨ Previsões e Tendências" purple Sparkles c/ 3 cards predição (TPV blue 52M+7,2% / Novos merchants purple 15-20 / CB Ratio expected green 0,42%) + Alert amber "Sazonalidade de Carnaval pode aumentar fraudes em 15%"; tabs "transactions"/"merchants"/"risk"/"trends" são PLACEHOLDERS literais com texto centralizado "Dashboard de X detalhado" — 4/5 tabs do Analytics são VAZIAS. Há também acoplamento crítico de cores entre Hub catálogo + Operational tabs + Risk tabs + Analytics — operam isoladamente sem componente compartilhado.',

    reportsHubMicroscopic: {
      role: 'Central de comando da seção — entrada principal (route default da sidebar)',
      menuPosition: 'Linha 321 do layout.jsx — t("menu_admin.reports_hub")',
      breadcrumbs: '[Relatórios]',
      stateManagement: {
        searchQuery: 'string controlado mas NUNCA usado para filtrar nada',
        scheduleModal: 'boolean — abre Dialog Schedule',
        generateModal: 'object|null — abre Dialog Generate dinamicamente preenchido',
      },
      hardcodedDataSources: {
        favoriteReports: '3 itens (TPV Diário/BarChart3 / Liquidação/DollarSign / CB Ratio/Shield)',
        recentReports: '3 itens c/ size em KB/MB',
        scheduledReports: '3 itens c/ schedule + email',
        reportCatalog: 'Object com 3 keys: operational(5 itens) / financial(4 itens) / risk(4 itens) — TOTAL 13 relatórios catalogados',
      },
      cards: {
        searchCard: {
          element: 'Input c/ Search lupa absolute left-3',
          gap: 'searchQuery armazenado mas NÃO filtra nada — input é decorativo',
        },
        favoritesCard: {
          title: 'Star yellow-500 + "Relatórios Favoritos"',
          layout: 'grid grid-cols-3 gap-4',
          itemTemplate: 'div p-4 border rounded-lg HOVER + onClick=setGenerateModal',
          itemContent: 'Avatar circular blue-100 c/ icon dinâmico + name + category + Button "Gerar" w-full',
        },
        recentCard: {
          title: 'Clock + "Relatórios Recentes"',
          itemTemplate: 'flex items-center justify-between p-3 border rounded-lg',
          itemContent: 'FileText icon + name + "Gerado: {date} • {size}" + Button "Baixar" Download SEM onClick',
          gap: 'Button Baixar SEM onClick — ação morta',
        },
        catalogCard: {
          title: '"📋 Catálogo de Relatórios"',
          tabs: '4 tabs (all/operational/financial/risk) com defaultValue="all"',
          tabAll: 'Renderiza os 3 grupos empilhados em ordem fixa (Operacionais → Financeiros → Risco) cada um com h4+icon e box border rounded-lg',
          ReportRow: {
            inline: true,
            structure: 'flex justify-between p-3 border-b last:border-0 hover:bg-slate-50',
            actions: '[Star fav (showFavorite default true) + Button "Gerar" → setGenerateModal(report)]',
            favoriteHandler: 'toast.success("Adicionado aos favoritos!") — NÃO persiste',
          },
        },
        scheduledCard: {
          title: 'Calendar + "Relatórios Agendados"',
          headerAction: 'Button Plus "Agendar" → setScheduleModal(true)',
          itemTemplate: 'flex justify-between p-3 border rounded-lg',
          itemContent: 'Calendar blue + name + "{schedule} • {email}" + Button Settings (gear icon) sem onClick',
          gap: 'Button Settings sem onClick — não permite editar agendamento',
        },
      },
      generateDialog: {
        title: 'DINÂMICO: "Gerar Relatório: {generateModal?.name}"',
        fields: [
          'Período Select defaultValue="30d" c/ 5 opções (today/7d/30d/month/custom)',
          'Formato Select defaultValue="xlsx" c/ 3 opções (xlsx/csv/pdf)',
        ],
        cancelHandler: 'setGenerateModal(null)',
        generateHandler: 'toast.success("Relatório gerado!") + setGenerateModal(null) — FAKE',
      },
      scheduleDialog: {
        title: '"Agendar Relatório"',
        fields: [
          'Relatório Select c/ placeholder "Selecione..." e 3 opções (tpv/settlement/cb)',
          'Frequência Select 3-opções (daily/weekly/monthly)',
          'E-mail Input livre placeholder="email@pagsmile.com"',
        ],
        gap: 'Selects de Relatório+Frequência sem default value — pode submeter vazio sem validação',
        scheduleHandler: 'toast.success("Agendamento criado!") + setScheduleModal(false) — FAKE',
      },
      knownGapsHub: [
        'searchQuery decorativo — sem filtragem real',
        'Button "Baixar" do Recent SEM onClick',
        'Button Settings do Scheduled SEM onClick',
        'Star toggle não persiste favorito',
        '3 dialogs dependem de toast.success fake — nada vai pro backend',
        'Catálogo c/ 13 relatórios mas página tem somente 3 favoritos+3 recentes+3 agendados (números desconectados — não conta os 13 do catálogo como geradores)',
        'Dialog Schedule sem validação obrigatória',
        'Tab all do catálogo duplica conteúdo das outras 3 tabs',
      ],
    },

    reportsOperationalMicroscopic: {
      role: 'Drill-down operacional — 4 Tabs c/ Recharts em 2 delas',
      menuPosition: 'Linha 322 — t("menu_admin.operational")',
      breadcrumbs: '[Relatórios → Operacionais]',
      stateManagement: {
        generateModal: 'string|null (identificador da tab atual)',
        period: 'string default "30d" — Select c/ 3 opções (7d/30d/90d)',
      },
      headerToolbar: {
        leftSide: 'Period Select 3-opções (7d/30d/90d)',
        rightSide: 'Button outline "Exportar Todos" Download — abre Dialog c/ generateModal="summary"',
      },
      tabs: {
        defaultValue: 'summary',
        items: [
          { id: 'summary', label: 'Resumo de Transações', icon: '📊' },
          { id: 'tpv', label: 'TPV por Período', icon: '📈' },
          { id: 'conversion', label: 'Análise de Conversão', icon: '🔄' },
          { id: 'methods', label: 'Métodos de Pagamento', icon: '💳' },
        ],
      },
      tabSummary: {
        table: '7-col native HTML (NÃO shadcn Table) — Período/Total/Aprovadas green/Negadas red/Taxa Badge/TPV/Ticket Médio',
        rateBadge: 'IF rate>=90 → green-100/700 / ELSE yellow-100/700',
        tfoot: 'Soma REAL via reduce dos campos numéricos (total/approved/denied/tpv) MAS Taxa "90.6%" e Ticket "761" são HARDCODED inconsistentes',
        gap: 'Taxa+Ticket no tfoot não recalculam — divergem dos dados se mock mudar',
      },
      tabTPV: {
        chart: 'BarChart Recharts altura h-80 c/ stackId="a" 4 séries — credit blue / debit purple / pix emerald / boleto amber',
        table: '6-col abaixo c/ Total calculado inline via row.credit + row.debit + row.pix + row.boleto',
        gap: 'Total inline NÃO usa reduce — faz por linha apenas',
      },
      tabConversion: {
        layout: 'NÃO USA Recharts — Funil simulado com divs INCREMENTAL marginLeft/Right (idx*20px)',
        items: '5 estágios (15000→14800→14200→14200→12850 c/ rates 100/98.7/94.7/94.7/85.7)',
        ultimoEstagio: 'IF idx===conversionData.length-1 → bg-green-50 border-green-200 + text-green-700',
        perdas: 'Texto inline "Perda: X (Y.Y%)" calculado em runtime entre estágios consecutivos',
        arrowSeparator: '↓ slate-400 entre estágios',
        bottomCard: 'green Box hardcoded "Taxa de Conversão Global: 85,7%"',
        gap: 'NÃO renderiza Funnel/FunnelChart do Recharts apesar de importado no top — código morto',
      },
      tabMethods: {
        layout: 'grid-2 (PieChart altura h-64 + lista vertical lateral)',
        chart: 'PieChart Recharts c/ 4 fatias outerRadius=80 + label inline "{name}: {value}%"',
        list: '4 cards lateral c/ swatch color box w-4 h-4 + name + value%',
      },
      generateDialog: {
        identical_to_hub: true,
        differences: 'Period Select 3-opções (7d/30d/90d) em vez de 5 do Hub',
      },
      knownGapsOperational: [
        'tfoot de Summary com Taxa/Ticket hardcoded (não recalcula)',
        'TabConversion importa FunnelChart/Funnel do Recharts mas NÃO usa (código morto)',
        'Funil renderizado via divs com margin incremental — não é gráfico real',
        'Period Select header não filtra os dados mock (decorativo)',
        'PieChart label inline pode quebrar em telas pequenas',
        'Button "Gerar Relatório" em cada Tab abre o mesmo Dialog (sem distinção real)',
      ],
    },

    reportsFinancialMicroscopic: {
      role: 'Drill-down financeiro — 3 Tabs c/ ÚNICO P&L visualmente desenhado',
      menuPosition: 'Linha 323 — t("menu.financial")',
      breadcrumbs: '[Relatórios → Financeiros]',
      stateManagement: {
        generateModal: 'string|null',
        period: 'string default "30d" c/ 3 opções (7d/30d/month)',
      },
      tabs: {
        defaultValue: 'settlement',
        items: [
          { id: 'settlement', label: 'Extrato de Liquidação', icon: '💰' },
          { id: 'receivables', label: 'Posição de Recebíveis', icon: '📅' },
          { id: 'dre', label: 'DRE Operacional', icon: '📊' },
        ],
      },
      tabSettlement: {
        table: '9-col Data/Merchant/Qtd/Bruto/MDR red(-)/Outras red(-)/CBs red conditional/Líquido green/Status Badge',
        statusConfig: '{ settled: "Liquidado" green, pending: "Pendente" yellow }',
        cbsConditional: 'IF row.chargebacks>0 → mostra "-{formatCurrency}" red / ELSE "-"',
        tfoot: 'colSpan=2 "TOTAL" + reduce para qty/gross/mdr/otherFees/chargebacks/net + última cell vazia',
        gap: 'tfoot é 100% calculado dinamicamente (BOM) — diferente do Operational que tem hardcoded',
      },
      tabReceivables: {
        table: '6-col Data/Merchant/Bruto/Taxas red(-)/Líquido/Antecipável Badge',
        antecipableBadge: 'IF anticipable=true → "✅ Sim" green / ELSE "❌ Não" slate',
        tfoot: 'colSpan=2 + reduce para gross/fees/net + última cell vazia',
      },
      tabDRE: {
        layout: 'P&L visualmente desenhado em SECTIONS verticais',
        revenuesSection: {
          title: 'h4 RECEITAS green-700',
          itemTemplate: '"├── {name}" tree-style prefix + value formatted',
          items: '7 (MDR Crédito 450k / MDR Débito 85k / Taxa PIX 45k / Taxa Boleto 12k / Taxa Antecipação 35k / Taxa Saque 5k / Outras 3k)',
          totalBox: 'green-50 px-3 c/ "TOTAL RECEITAS" font-bold green-700',
        },
        costsSection: {
          title: 'h4 CUSTOS red-700',
          itemTemplate: '"├── {name}" + value red',
          items: '5 (Custo Adquirente 280k / Antifraude 25k / Bancário 8k / CBs Absorvidos 15k / Outros 12k)',
          totalBox: 'red-50 px-3 c/ "TOTAL CUSTOS" red-700',
        },
        resultSection: {
          divider: 'border-t-4 border-double pt-4',
          resultBox: 'blue-50 c/ "RESULTADO OPERACIONAL" + valor calculado runtime (totalRevenue-totalCosts)',
          marginText: 'centro "Margem Operacional: {margin}%" — calculado (operationalResult/totalRevenue*100).toFixed(1)',
        },
      },
      generateDialog: {
        period_select: 'default "month" c/ 4 opções (7d/30d/month/lastMonth) — DIFERE do Operational',
      },
      knownGapsFinancial: [
        'DRE 100% calculado runtime — único cálculo verdadeiro da seção Reports',
        'P&L NÃO usa entity FinancialEntry do schema — todos números hardcoded',
        'Settlement/Receivables status enum no mock NÃO casa com Settlement entity schema',
        'Antecipável Badge usa emojis ✅/❌ inline (acessibilidade)',
        'Period Select diferente entre Hub/Operational/Financial (lastMonth só aqui)',
      ],
    },

    reportsRiskMicroscopic: {
      role: 'Drill-down de risco — 3 Tabs c/ destaque visual em CB Ratio crítico',
      menuPosition: 'Linha 324 — t("menu_admin.risk")',
      breadcrumbs: '[Relatórios → Risco]',
      stateManagement: {
        generateModal: 'string|null',
        period: 'string default "30d"',
      },
      tabs: {
        defaultValue: 'chargebacks',
        items: [
          { id: 'chargebacks', label: 'Chargebacks', icon: '📊' },
          { id: 'cbRatio', label: 'CB Ratio por Merchant', icon: '📊' },
          { id: 'fraud', label: 'Análise de Fraudes', icon: '🛡️' },
        ],
      },
      tabChargebacks: {
        twoCards: true,
        firstCard: {
          title: '"📊 Chargebacks por Motivo - Janeiro 2026"',
          table: '5-col Motivo/Qtd/Valor/%/Win Rate Badge',
          winRateBadge: 'IF winRate>=70 green / >=50 yellow / else red',
          tfoot: 'TOTAL c/ reduce qty+value mas % "100%" e WinRate "64%" hardcoded',
        },
        secondCard: {
          title: '"📋 Lista de Chargebacks"',
          table: '7-col ID font-mono/Data/Merchant/Valor/Motivo/Bandeira/Status Badge',
          statusConfig4: '{ open: yellow, in_contest: blue, won: green, lost: red }',
          gap: 'Sem tfoot — diferente do primeiro Card',
        },
      },
      tabCBRatio: {
        title: '"📊 CB Ratio por Merchant"',
        table: '6-col Merchant/Transações/Chargebacks/CB Ratio/Status Badge/Tendência',
        rowHighlight: 'IF row.status==="critical" → bg-red-50 NA LINHA INTEIRA',
        ratioStatusConfig: '{ ok: "🟢 OK" green, warning: "🟡 Atenção" yellow, critical: "🔴 Crítico" red }',
        trendIcon: 'TrendingUp red (up) / TrendingDown green (down) / "→" slate (stable)',
        gap: 'Ícone trend invertido semanticamente — TrendingUp em CB ratio é RUIM (deveria ser red — está correto), MAS TrendingDown como "good" pode confundir gestores',
      },
      tabFraud: {
        title: '"🛡️ Análise de Fraudes"',
        chart: 'BarChart Recharts altura h-64 c/ 2 séries (blocked yellow / confirmed red)',
        table: '6-col Período/Tentativas/Bloqueadas yellow/Confirm. red/Fraud Rate/Valor Evitado green',
        tfoot: 'TOTAL c/ reduce nas 4 col numéricas + Fraud Rate "0.29%" HARDCODED',
        gap: 'Fraud Rate hardcoded no tfoot — soma weighted average não calculada',
      },
      generateDialog: {
        period_select: 'default "30d" c/ 3 opções (7d/30d/90d)',
        title: '"Gerar Relatório de Risco"',
      },
      knownGapsRisk: [
        'tfoots híbridos — algumas células reduce, outras hardcoded',
        'Reason codes mock não casam com Dispute.reason_code do schema (formato "Fraude (83)" vs ints)',
        'Win Rate badge thresholds (70/50) inconsistentes com Dispute Manager (geralmente usa 60)',
        'Card "📋 Lista de Chargebacks" sem filtros — só lista 5 mocks fixos',
        'Trend stable usa "→" texto unicode — sem ícone consistente',
        'BarChart Fraud com 2 series mas faltam Tentativas/Avoided no chart (só na table)',
      ],
    },

    reportsCustomMicroscopic: {
      role: 'Construtor visual de relatórios customizados — ÚNICA página realmente interativa',
      menuPosition: 'Linha 325 — t("menu_admin.custom")',
      breadcrumbs: '[Relatórios → Customizados]',
      stateManagement: {
        reportName: 'string controlado',
        dataSource: 'string default "transactions"',
        selectedFields: 'array default 5 fields da transactions',
        filters: 'array default [{field:"created_at", operator:"between", value:"", value2:""}]',
        groupBy: 'string',
        orderBy: 'string default "created_at"',
        orderDir: 'string default "desc"',
      },
      hardcodedDataSources: {
        sources: '6 (transactions/merchants/chargebacks/meds/settlements/withdrawals)',
        fieldsBySource_partial: 'APENAS 3 dos 6 têm fields definidos: transactions(14)/merchants(9)/chargebacks(7)',
        gap: 'meds/settlements/withdrawals = SELECTOR mostra mas availableFields=[] silencioso → Cards "Campos disponíveis" e "Selecionados" vazios',
      },
      pageHeader: {
        title: '"Construtor de Relatórios"',
        actionElementProp: 'PageHeader recebe `actionElement` (prop name ERRADO — componente usa `actions`)',
        gap: 'Button "Salvar" no header NÃO RENDERIZA por causa do prop errado',
      },
      sections: {
        nameInput: 'Input livre placeholder "Ex: Transações aprovadas por merchant"',
        dataSourceCard: {
          title: '"📂 Fonte de Dados"',
          left: 'Select 6 opções',
          fieldsList: 'border rounded-lg max-h-64 overflow-y-auto + Checkboxes dinâmicos via toggleField',
        },
        selectedFieldsCard: {
          title: '"📋 Campos Selecionados"',
          subtitle: '"Arraste os campos para ordenar"',
          itemTemplate: 'GripVertical cursor-move + "{idx+1}. {label}" + Trash2 red',
          gap: 'GripVertical é DECORATIVO — não há react-dnd ou pangea/dnd implementado',
          emptyState: 'Texto "Selecione campos à esquerda"',
        },
        filtersCard: {
          title: '"🔍 Filtros"',
          itemTemplate: 'Select Field 180px + Select Operator 140px + Input value flex-1 + IF between → "e" + Input value2',
          operators7: ['equals', 'not_equals', 'greater', 'less', 'between', 'contains', 'in'],
          actions: '[addFilter Button outline Plus / removeFilter Button ghost Trash2 red]',
        },
        groupOrderCard: {
          title: '"📊 Agrupamento e Ordenação"',
          groupBy: 'Select c/ "Nenhum" value=null — ⚠️ shadcn Select não aceita null oficialmente',
          orderBy: 'Select dos availableFields',
          direction: 'Select asc/desc',
          checkboxes: '2 ("Incluir totais" / "Incluir subtotais por grupo") SEM state controlado',
          gap1: 'Checkboxes não controlados — não persistem',
          gap2: 'value=null no Select pode lançar warning no console',
        },
      },
      footerActions: {
        preview: 'toast.info("Preview seria exibido aqui") — Eye icon',
        generate: 'toast.success("Relatório gerado com sucesso!") — FileText icon',
      },
      knownGapsCustom: [
        'GripVertical cursor-move VISUAL fake — sem drag&drop',
        'PageHeader com prop errado (actionElement vs actions) → Salvar não renderiza',
        '3 das 6 dataSources sem fields (meds/settlements/withdrawals)',
        'value=null no Select pode quebrar',
        '2 checkboxes "Incluir totais" sem state',
        'Filtros sem botão "Limpar todos"',
        'Sem botão "Salvar como template"',
        'Sem botão "Carregar relatório existente"',
        'Sem validação de reportName obrigatório',
        'Botão Pré-visualizar nem abre dialog/modal — só toast',
        'fieldsBySource não tem todas as colunas do schema das entidades',
      ],
    },

    analyticsMicroscopic: {
      role: 'BI / Analytics — 5 Tabs MAS APENAS overview implementada',
      menuPosition: 'Linha 326 — t("menu_admin.analytics_bi")',
      breadcrumbs: '[Relatórios → Analytics]',
      stateManagement: {
        period: 'string default "30d" c/ 4 opções (7d/30d/90d/12m)',
      },
      tabs: {
        defaultValue: 'overview',
        items: [
          { id: 'overview', label: 'Visão Geral', status: 'POPULADA' },
          { id: 'transactions', label: 'Transações', status: 'PLACEHOLDER' },
          { id: 'merchants', label: 'Merchants', status: 'PLACEHOLDER' },
          { id: 'risk', label: 'Risco', status: 'PLACEHOLDER' },
          { id: 'trends', label: 'Tendências', status: 'PLACEHOLDER' },
        ],
        gap: '4/5 tabs são literalmente "<p>Dashboard de X detalhado</p>" centralizado — código incompleto',
      },
      tabOverview: {
        sections: [
          {
            id: 'tpvEvolution',
            title: '📈 Evolução do TPV (Últimos 12 meses)',
            chart: 'AreaChart Recharts altura h-72 c/ stroke+fill blue fillOpacity=0.2 e 12 pontos hardcoded',
            footer: 'Texto "TPV atual: 48,5M" + Badge "+12% vs mês anterior" green TrendingUp',
          },
          {
            id: 'methodsAndTopMerchants',
            layout: 'grid-2',
            left: 'Distribuição por Método PieChart 4 fatias (mesmo da Operational tab methods)',
            right: 'Top 10 Merchants lista numerada 1.-10. c/ name + TPV + Badge pct',
          },
          {
            id: 'approvalAndRisk',
            layout: 'grid-2',
            left: 'Taxa de Aprovação BarChart vertical layout c/ XAxis type=number 0-100 + 4 métodos + Média "92,3%"',
            right: 'Indicadores de Risco — 3 Cards green flat (CB Ratio 0,45% / Fraud Rate 0,08% / MED Rate 0,02%) + grid-2 Win Rate (CB 68% / MED 72%) + texto "Merchants em alerta: 3"',
          },
          {
            id: 'predictions',
            title: '✨ Previsões e Tendências (Sparkles purple)',
            cards3: '[TPV blue 52M+7,2% / Novos merchants purple 15-20 / CB Ratio expected green 0,42% TrendingDown]',
            alertBox: 'amber border AlertTriangle "Sazonalidade de Carnaval pode aumentar fraudes em 15%"',
          },
        ],
      },
      knownGapsAnalytics: [
        '4/5 tabs PLACEHOLDER — funcionalidade incompleta',
        'Sem header action button (Period Select isolado em row própria)',
        'Sem Generate/Schedule dialog — não permite exportar',
        'TPV Evolution +12% hardcoded mesmo se data mudar',
        'Indicadores de Risco TODOS green hardcoded (sem lógica real)',
        '"Merchants em alerta: 3" texto hardcoded — não vincula a entity',
        'Predições purple Sparkles sugere IA mas é mock total',
        'Carnaval alert hardcoded — não tem rules engine',
        'AreaChart sem second series (sem comparação YoY)',
        'PieChart Distribuição por Método é IDÊNTICA à do Operational tab methods (cópia)',
        'Top 10 não tem Link → MerchantProfile',
      ],
    },
  },

  technical: {
    fileLocations: {
      reportsHub: 'pages/AdminIntReportsHub.jsx (333 linhas)',
      reportsOperational: 'pages/AdminIntReportsOperational.jsx (314 linhas)',
      reportsFinancial: 'pages/AdminIntReportsFinancial.jsx (303 linhas)',
      reportsRisk: 'pages/AdminIntReportsRisk.jsx (334 linhas)',
      reportsCustom: 'pages/AdminIntReportsCustom.jsx (306 linhas)',
      analytics: 'pages/AdminIntAnalytics.jsx (296 linhas)',
    },
    menuOrderInLayoutJsx: {
      file: 'layout.jsx',
      block: 'getAdminInternoMenuItems(t) — id="reports" — linhas 316-328',
      submenu: [
        { line: 321, page: 'AdminIntReportsHub', label: 't("menu_admin.reports_hub")' },
        { line: 322, page: 'AdminIntReportsOperational', label: 't("menu_admin.operational")' },
        { line: 323, page: 'AdminIntReportsFinancial', label: 't("menu.financial")' },
        { line: 324, page: 'AdminIntReportsRisk', label: 't("menu_admin.risk")' },
        { line: 325, page: 'AdminIntReportsCustom', label: 't("menu_admin.custom")' },
        { line: 326, page: 'AdminIntAnalytics', label: 't("menu_admin.analytics_bi")' },
      ],
    },
    sharedDialogPattern: {
      pages: ['Hub', 'Operational', 'Financial', 'Risk'],
      structure: 'Dialog c/ DialogTitle + Period Select + Format Select (xlsx/csv/pdf) + Cancelar/Gerar buttons',
      duplicatedAcross: '4 páginas — código copy-paste sem componente compartilhado',
      periodOptions: 'Variam por página: Hub(5)/Operational(3)/Financial(4)/Risk(3) — falta de padronização',
    },
    sharedFormatCurrency: {
      duplicated: 'Cada página declara seu próprio formatCurrency local (4 deles compactos / 2 não)',
      gap: 'Operational+Analytics usam notation:"compact" / Financial+Risk usam padrão sem compact — inconsistência visual',
    },
    rechartsUsage: {
      operational: ['BarChart (TPV stack)', 'PieChart (methods)'],
      financial: 'NENHUM — DRE é desenho com divs',
      risk: ['BarChart (fraud)'],
      analytics: ['AreaChart (TPV)', 'PieChart (methods - clone)', 'BarChart vertical (approval)'],
      hub: 'NENHUM — só listas e cards',
      custom: 'NENHUM — apenas form builder',
    },
    crossPageNavigation: {
      reportsHub: 'Cards "Favoritos" abrem Dialog Generate dentro da própria página — sem navegação',
      reportsOperational: 'Sem cross-page navigation',
      reportsFinancial: 'Sem cross-page navigation',
      reportsRisk: 'Sem cross-page navigation',
      reportsCustom: 'Sem cross-page navigation',
      analytics: 'Top 10 Merchants SEM Link → MerchantProfile (gap)',
      gap: 'A seção INTEIRA é isolada — nenhum drill-down para entidades reais',
    },
    knownGapsCrossSection: [
      'TODA a seção Reports é 100% mock — zero integração com entidades reais (Transaction/Settlement/Dispute/etc)',
      'Dialog Generate/Schedule duplicado em 4 páginas (sem componente comum)',
      'Period Select com opções diferentes por página (sem padronização)',
      'formatCurrency declarado local em cada arquivo (DRY violation x6)',
      'tfoots híbridos — algumas células reduce, outras hardcoded',
      'searchQuery do Hub sem filtragem',
      'Nenhuma página persiste relatórios gerados (sem entity Report)',
      'Botões "Baixar"/"Settings" do Hub sem onClick',
      'Custom: drag&drop fake (GripVertical decorativo)',
      'Custom: 3 das 6 dataSources sem fields',
      'Custom: PageHeader prop name errado — Salvar não renderiza',
      'Analytics: 4/5 tabs vazias',
      'Analytics: Sem botão de exportar/agendar',
      'Analytics: Top 10 sem Link → MerchantProfile',
      'Reports tab "all" do Hub Catálogo duplica 3 outras tabs',
      'Funnel chart (Operational) NÃO usa Recharts FunnelChart importado — código morto',
      'Risk: Reason codes em formato string "Fraude (83)" não casam com Dispute schema',
      'Financial: P&L não usa entity FinancialEntry',
      'Sem busca/filtro avançado em nenhuma das 6 páginas',
      'Sem agendamento por entidade Webhook ou backend (apenas mock)',
    ],
  },
};

export default AdminIntReportsDoc;