// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /AdminIntDashboard (Admin Interno PagSmile)
// Fidelidade absoluta a pages/AdminIntDashboard.jsx (258 linhas) +
// 5 views v3 documentadas microscopicamente (Executive 287 / Operational 264 /
// Financial 211 / PL 223 / Risk 317 linhas) — total ~1300 linhas analisadas.
// ============================================================================

export const AdminIntDashboardDoc = {
  pageId: 'AdminIntDashboard',
  pagePath: '/AdminIntDashboard',
  module: 'Admin Interno',
  parentPage: null,

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Dashboard executivo do back-office PagSmile — Wrapper com PageHeader + linha de status (Last Update / Next In Xs / bolinha verde pulsante), 4 controls (Period Select 8 opções / Compare With Select 4 opções / Export DropdownMenu PDF/Excel/CSV / Refresh icon / Settings icon), Banner DIA Insights gradient emerald-blue com 4 alertas executivos sumarizados, e TabsList com 10 views agrupadas em 3 blocos visuais separados por dividers verticais — Visões Consolidadas (5: Executiva/Operacional/Financeira/PL/Risco) | Visões por Método (3: Cartão/PIX/Boleto) | Técnico e Alertas (2: Técnico/Alertas com Badge contador 3). Auto-refresh a cada 30 segundos via setInterval 1000ms decrementando contador.',

    threeBlockTabSections: {
      consolidatedViews: '5 tabs — Executiva (LayoutDashboard), Operacional (Activity), Financeira (Wallet), P&L (TrendingUp), Risco (ShieldAlert)',
      methodViews: '3 tabs — Cartão (CreditCard blue-500), PIX (QrCode green-500), Boleto (FileText amber-500)',
      technicalAlerts: '2 tabs — Técnico (Server), Alertas (Bell + Badge destructive count -top-1 -right-1 absolute)',
    },

    autoRefreshMechanism: {
      pattern: 'useEffect setInterval 1000ms decrementing nextRefresh',
      countdown: '30s ↓ 29s ↓ ... 1s → set lastUpdate(new Date()) + reset 30',
      manualRefresh: 'Button RefreshCw → setIsRefreshing(true) + setLastUpdate + setNextRefresh(30) + setTimeout(false, 1000)',
      visualSpinner: 'animate-spin via className condicional `${isRefreshing ? "animate-spin" : ""}`',
    },

    diaInsightsBannerStructure: {
      gradient: 'from-emerald-500/10 to-blue-500/10 + border-emerald-500/20',
      iconBox: 'p-2 bg-white dark:bg-slate-800 rounded-lg + Sparkles emerald-500',
      title: 'h3 "DIA Insights — Análises do dia"',
      fourAlerts: '⚠️ 3 merchants high CB / 📈 TPV +15% above average / 🔔 12 KYCs pendentes / 💰 R$ 890k saques pendentes',
      cta: 'Button ghost emerald "Ver Detalhes"',
    },

    eightPeriodOptions: ['today', 'yesterday', 'last7', 'last30', 'thisMonth', 'lastMonth', 'thisYear', 'custom'],

    fourCompareOptions: ['previous (period anterior)', 'lastYear (mesmo período ano anterior)', 'meta (goal)', 'none (sem comparação)'],

    threeExportFormats: ['PDF', 'Excel', 'CSV'],

    // ==========================================================================
    // SUB-DOCUMENTAÇÃO MICROSCÓPICA — 5 VIEWS V3 PRINCIPAIS
    // ==========================================================================

    executiveViewMicroscopic: {
      role: 'C-Level overview — 6 KPIs estratégicos + 3 charts + tabela comparativa',
      sixMockKPIs: {
        tpvTotal: '12.500.000 (+15.3% trend up) — DollarSign',
        receitaBruta: '437.500 (+12.8% trend up) — TrendingUp',
        taxaAprovacao: '94.2% (+1.2pp trend up) — CheckCircle — format=percent',
        cbRatio: '0.72% (-0.08% trend down) — passed to RiskIndicator',
        medRatio: '0.08% (+0.02% trend up) — passed to RiskIndicator',
        merchantsAtivos: '1.248 (+45 trend up) — CreditCard — format=number suffix=" contas"',
      },
      kpiCardComponent: {
        formats: '"currency" (formatCurrency), "percent" (toFixed(2)+%), "number" (toLocaleString pt-BR + suffix/prefix)',
        coloring: 'isPositive=trend==="up" → text-green-600 + bg-green-100; senão red-600 + bg-red-100',
        trendLabel: '{abs(change).toFixed(2)}{format==="percent"?"pp":"%"} vs período anterior',
      },
      threeCharts: {
        tpvTrendAreaChart: {
          colSpan: 'lg:col-span-2',
          height: 'h-[300px]',
          data: 'tpvTrendData (7 dias 22/01-28/01) — cartao/pix/boleto',
          gradients: '3 linearGradients ids: colorCartao(#3B82F6), colorPix(#10B981), colorBoleto(#F59E0B)',
          areas: '3 Areas type=monotone com stroke + fillOpacity=1 + fill=url(#color)',
          tickFormatter: '`${(v/1000000).toFixed(1)}M`',
          tooltip: 'formatCurrency(v)',
        },
        methodDistributionPieChart: {
          height: 'h-[200px]',
          innerRadius: '50',
          outerRadius: '80',
          paddingAngle: '2',
          data: 'methodDistribution [Cartão 70% blue, PIX 25% green, Boleto 5% amber]',
          legendBelow: 'flex justify-center gap-4 — bolinha colorida + name {value}%',
        },
        riskIndicator: {
          component: 'RiskIndicator local',
          cbRatioLogic: '<0.65 Normal green / <0.85 Atenção yellow / >=0.85 Crítico red',
          medRatioLogic: '<0.10 Normal green / <0.20 Atenção yellow / >=0.20 Crítico red',
          renderEach: 'p-3 bg-slate-50 + label xs + valor lg-bold + Badge color status',
        },
      },
      comparisonTable: {
        colSpan: 'lg:col-span-2',
        columns: ['Método', 'TPV', 'Transações', 'Ticket Médio', 'Aprovação', 'Receita'],
        renderRow: 'icon método (CreditCard blue / QrCode green / FileText amber) + name + valores formatCurrency + Badge aprovação default(>=90)/secondary(>=70)/destructive + receita green-600',
      },
    },

    operationalViewMicroscopic: {
      role: 'Operações em tempo real — TPS/Latência/Erro com auto-refresh 1s + Live Feed',
      threeRealtimeKPIs: {
        currentTPS: { initial: '42.5', unit: 'tx/s', icon: 'Zap', threshold: '>100=warning' },
        latency: { initial: '245ms', unit: 'ms', icon: 'Clock', thresholds: '<300 excellent / <500 normal / <1000 warning / >=1000 critical' },
        errorRate: { initial: '0.12%', unit: '%', icon: 'AlertCircle', thresholds: '<0.1 excellent / <0.3 normal / <0.5 warning / >=0.5 critical' },
      },
      realtimeKPICardComponent: {
        statusColors: '4 variants — excellent(green-100/700/200), normal(blue-100/700/200), warning(yellow-100/700/200), critical(red-100/700/200)',
        wrapper: 'border-2 + status adaptive',
        layout: 'Title + value 3xl bold + unit sm opacity-75 + Icon 8x8 opacity-50',
      },
      autoRefreshLogic: {
        useEffect: 'setInterval 1000ms — TPS += random(-5..5), latency += random(-25..25) min 100, errorRate += random(-0.05..0.05) clamped 0-1, tpsData rolls 60 entries',
        animationFlow: 'tpsData renderiza atualizado em cada tick — chart smooth movement',
      },
      twoCharts: {
        tpsAreaChart: {
          height: 'h-[200px]',
          duration: '60 segundos rolantes',
          gradient: 'colorTPS #3B82F6 stopOpacity 0.3 → 0',
          xAxis: 'tick={false} (escondido)',
          yAxis: 'domain=[0, 100]',
        },
        latencyByAcquirerLineChart: {
          height: 'h-[200px]',
          data: 'latencyData 7 pontos 14:00-14:30',
          threeAcquirers: 'Adyen (#10B981), Stone (#3B82F6), Rede (#F59E0B)',
          line: 'type=monotone strokeWidth=2 dot={false}',
          legendBelow: 'flex justify-center gap-4 — bolinha colorida + name',
        },
      },
      liveFeedSection: {
        header: 'Activity 5x5 green-500 animate-pulse + "Live Feed de Transações" + sub + Button outline "Pausar"',
        gap: 'Botão "Pausar" SEM onClick',
        maxHeight: 'max-h-[400px] overflow-y-auto',
        liveFeedItem: {
          left: 'time fontMono w-16 + methodIcon (CreditCard blue/QrCode green/FileText amber) + id font-medium + merchant xs gray',
          right: 'value formatCurrency + Badge color-coded + Button ghost Eye',
          fourStatuses: 'approved(CheckCircle green), paid(CheckCircle green), denied(XCircle red), pending(Clock amber)',
          animation: 'animate-in fade-in-50 duration-300',
        },
        eightMockTransactions: 'TXN-001 a TXN-008/PIX-002/PIX-005/PIX-007/BOL-004 — alternando merchants (Loja ABC, Store XYZ, Tech Corp, Empresa 123, Fashion Store)',
      },
    },

    financialViewMicroscopic: {
      role: 'Tesouraria PagSmile — saldos, recebíveis, fila de saques',
      sixFinancialKPIs: {
        saldoTotalMerchants: '8.750.000 (default) — Wallet — "Disponível + Retido"',
        saldoDisponivel: '7.500.000 (success green) — Unlock — "Pronto para saque"',
        saldoRetido: '1.250.000 (warning amber) — Lock — "Rolling Reserve"',
        liquidarHoje: '2.340.000 (default) — Calendar — "Cartão D+30, PIX D+0"',
        saquesPendentes: '890.000 (warning amber) — Clock — "23 solicitações"',
        sacadoHoje: '1.560.000 (success green) — Banknote — "Já executados"',
      },
      fourVariantsKPI: {
        default: 'border-slate-200 + bg-slate-100 icon',
        success: 'border-green-200 + bg-green-50/50 + bg-green-100 icon green-600',
        warning: 'border-amber-200 + bg-amber-50/50 + bg-amber-100 icon amber-600',
        danger: 'border-red-200 + bg-red-50/50 + bg-red-100 icon red-600',
      },
      agendaRecebiveisCard: {
        headerIcon: 'Calendar 5x5 blue-500 + "Agenda de Recebíveis (Cartão)"',
        description: 'Próximos 7 dias de liquidação',
        chart: 'BarChart h-[250px] data=7 dias — Bar dataKey=liquido fill=#10B981 radius=[4,4,0,0]',
        innerTable: '5 colunas (Data/Bruto/Taxas/Líquido/Merchants) — slice(0,5) — Taxas red-500 com prefix "-" + Líquido green-600',
      },
      filaSaquesPendentesCard: {
        headerIcon: 'Banknote 5x5 green-500',
        description: '{count} solicitações aguardando aprovação',
        headerActions: [
          'Button outline + XCircle + "Rejeitar" — gap: SEM onClick',
          'Button bg-green-600 + CheckCircle + "Aprovar" — gap: SEM onClick',
        ],
        renderEachSaque: {
          left: 'Checkbox + name + id • bank',
          right: 'value formatCurrency bold + requestedAt xs gray',
          gap: 'Checkbox SEM onChange — não seleciona realmente',
        },
        fiveMockSaques: [
          'SAQ-001 Loja ABC R$45k Itaú 28/01 10:30',
          'SAQ-002 Tech Store R$128k Bradesco 28/01 09:45',
          'SAQ-003 Fashion Shop R$67.5k Santander 28/01 09:15',
          'SAQ-004 Marketplace X R$234k Itaú 28/01 08:30',
          'SAQ-005 Store 123 R$18.5k Nubank 27/01 18:45',
        ],
      },
    },

    plViewMicroscopic: {
      role: 'P&L da operação — Receita vs Custo vs Margem detalhado por método',
      fourPLSummary: {
        receitaBruta: '437.500 (+12.8%) — variant=revenue (border-l-blue-500)',
        custoTotal: '196.875 (+11.2%) — variant=cost (border-l-red-500)',
        margemBruta: '240.625 (+14.5%) — variant=margin (border-l-green-500)',
        margemPercent: '55% (+1.2pp) — Card border-l-purple-500 (custom inline, não usa PLCard)',
      },
      threePLByMethod: {
        cartao: 'Receita 306.250 / Custo 153.125 / Margem 153.125 / 50% — Badge secondary',
        pix: 'Receita 93.750 / Custo 31.250 / Margem 62.500 / 66.7% — Badge default',
        boleto: 'Receita 37.500 / Custo 12.500 / Margem 25.000 / 66.7% — Badge default',
      },
      threeCharts: {
        plByMethodHorizontalBar: {
          layout: 'vertical (BarChart layout="vertical")',
          height: 'h-[250px]',
          xAxis: 'type=number tickFormatter `${(v/1000).toFixed(0)}k`',
          yAxis: 'type=category dataKey=method width=60',
          threeBars: 'receita(#3B82F6), custo(#EF4444), margem(#10B981) — radius=[0,4,4,0]',
          legendInline: 'Below — para cada método: icon + name + Badge "Margem {%}" default(>=60)/secondary',
        },
        monthlyTrendBar: {
          height: 'h-[300px]',
          dataPoints: '5 meses (Set/Out/Nov/Dez/Jan)',
          threeBars: 'receita/custo/margem com mesmas cores e radius=[4,4,0,0]',
        },
        custoBreakdownCartaoPie: {
          fourCosts: ['Interchange 60% (#3B82F6)', 'Taxa Adquirente 25% (#10B981)', 'Antifraude 10% (#F59E0B)', 'Pré-Chargeback 5% (#EF4444)'],
          height: 'h-[250px]',
          innerRadius: '60', outerRadius: '100',
          label: '({name} {percent}%)',
          twoColLayout: 'grid lg:grid-cols-2 — pie left + lista detalhada right (cor + name + percent + value bold)',
        },
      },
    },

    riskViewMicroscopic: {
      role: 'Centro de comando de risco — gauges + tendências + programas + lista merchants alerta',
      fourRiskGauges: {
        cbRatio: { value: '0.72%', threshold: '0.90%', maxValue: 2, status: 'attention (yellow)', icon: 'CreditCard' },
        medRatio: { value: '0.08%', threshold: '0.20%', maxValue: 0.5, status: 'normal (green)', icon: 'QrCode' },
        fraudRate: { value: '0.15%', threshold: '0.50%', maxValue: 1, status: 'normal (green)', icon: 'ShieldAlert' },
        merchantsEmAlerta: '12 (Card custom não-Gauge — bg-slate-100 + 2 Badges: 3 críticos destructive + 9 atenção secondary)',
      },
      riskGaugeComponent: {
        threeStatusColors: 'normal(green-100/700/500), attention(yellow-100/700/500), critical(red-100/700/500)',
        layout: 'Title sm + value 3xl bold + unit + Icon 6x6 right',
        progressBar: '0 ↔ Limite (red-600 font-medium label) ↔ maxValue + h-2 bg-white/50 rounded-full + fill width=percent',
        bottomBar: 'Badge color status + "{((threshold-value)/threshold*100).toFixed(0)}% da margem"',
      },
      programCardComponent: {
        twoPrograms: {
          vdmp: 'border-l-blue-500 (Visa) — 2 merchants Standard / Multa USD 50 / Próxima Avaliação 28/02/2026',
          ecm: 'border-l-red-500 (Mastercard) — 1 merchant Excessive / Multa USD 75 / Próxima Avaliação 28/02/2026',
        },
        logos: 'Wikipedia URLs externas para Visa SVG e Mastercard SVG — gap: dependência de CDN externa',
      },
      twoTrendCharts: {
        cbTrendArea: {
          height: 'h-[200px]',
          gradient: 'colorCB #EF4444 0.3→0',
          dataPoints: '5 pontos (01/01-28/01) — 0.65/0.68/0.75/0.78/0.72',
          referenceLine: 'y=0.90 stroke=#EF4444 dash 5 5 + label "Limite VDMP"',
        },
        medTrendArea: {
          height: 'h-[200px]',
          gradient: 'colorMED #10B981 0.3→0',
          dataPoints: '5 pontos — 0.05/0.06/0.07/0.09/0.08',
          referenceLine: 'y=0.20 stroke=#F59E0B dash 5 5 + label "Limite"',
        },
      },
      merchantsEmAlertaTable: {
        header: 'AlertTriangle 5x5 amber-500 + "Merchants em Alerta" + "Merchants com CB Ratio acima de 0.65%" + Button outline "Ver Todos"',
        sixColumns: ['Merchant (name + id)', 'CB Ratio (>=0.90 red, senão amber, bold)', 'TPV (formatCurrency)', 'Programa (Badge destructive ou —)', 'Status (Badge crítico destructive / atenção secondary)', 'Ação (Button ghost Eye)'],
        fiveMockMerchants: [
          'MER-001 Loja Suspeita 1.25% critical VDMP R$450k',
          'MER-002 Store XYZ 0.98% critical ECM R$320k',
          'MER-003 E-commerce ABC 0.92% critical VDMP R$280k',
          'MER-004 Fashion Store 0.78% warning — R$190k',
          'MER-005 Tech Corp 0.75% warning — R$560k',
        ],
      },
    },
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/AdminIntDashboard.jsx',
    totalLines: 258,

    imports: {
      react: ['useState', 'useEffect'],
      i18n: 'useTranslation from react-i18next',
      sharedComponents: ['PageHeader'],
      uiComponents: ['Tabs+TabsContent+TabsList+TabsTrigger', 'Button', 'Badge', 'Select stack', 'DropdownMenu stack'],
      lucideIcons: 'RefreshCw, Calendar as CalendarIcon, Download, LayoutDashboard, Activity, Wallet, TrendingUp, ShieldAlert, CreditCard, QrCode, FileText, Server, Bell, Sparkles, Settings',
      v3Views: 'ExecutiveView, OperationalView, FinancialView, PLView, RiskView, CardView, PixView, BoletoView, TechnicalView, AlertsView (todos de @/components/admin-interno/dashboard/v3/)',
    },

    componentState: {
      activeTab: { initial: "'executiva'", purpose: '1 de 10 — executiva/operacional/financeira/pl/risco/cartao/pix/boleto/tecnico/alertas' },
      period: { initial: "'today'", purpose: 'Period filter (gap: NÃO aplicado nas views — mock-only)' },
      compareWith: { initial: "'previous'", purpose: 'Compare period (gap: NÃO aplicado)' },
      isRefreshing: { initial: 'false', purpose: 'Animação spin do Refresh button' },
      lastUpdate: { initial: 'new Date()', purpose: 'Timestamp da última atualização' },
      nextRefresh: { initial: '30', purpose: 'Contador segundos até próximo auto-refresh' },
    },

    backendIntegration: 'NENHUMA — TODAS as 5 views v3 usam dados HARDCODED mock',

    autoRefreshUseEffect: {
      logic: 'setInterval 1000ms → setNextRefresh(prev => prev <= 1 ? (setLastUpdate(new Date()), 30) : prev - 1)',
      cleanup: 'clearInterval(interval) on unmount',
      gap: 'Apenas decrementa contador — NÃO refaz fetch nem dispara nada nas views (que já têm seus próprios setIntervals: OperationalView 1s)',
    },

    helperFunctions: {
      handleRefresh: 'setIsRefreshing(true) + setLastUpdate(new Date()) + setNextRefresh(30) + setTimeout(() => setIsRefreshing(false), 1000)',
      alertCount: 'const hardcoded = 3 — comentário "Mock - would come from real data"',
    },

    layout: {
      pageHeaderRow: {
        wrapper: 'flex flex-col lg:flex-row lg:items-center justify-between gap-4',
        leftSide: {
          pageHeader: {
            title: 't("admin_interno.dashboard")',
            subtitle: 't("admin_interno.subtitle")',
            breadcrumbs: 'Admin Interno > Dashboard',
          },
          statusLine: 'flex items-center gap-4 text-sm slate-500 — "Last update: {time}" • "Next in {N}s" • bolinha 2x2 green animate-pulse',
        },
        rightSide: {
          periodSelect: 'w-[160px] + CalendarIcon mr-2 + 8 SelectItems',
          compareSelect: 'w-[180px] + 4 SelectItems',
          exportDropdown: 'Button outline icon Download → DropdownMenuContent [PDF/Excel/CSV] (gap: TODOS sem onClick)',
          refreshButton: 'Button outline icon — RefreshCw com animate-spin condicional + disabled isRefreshing',
          settingsButton: 'Button outline icon Settings — gap: SEM onClick',
        },
      },

      diaInsightsBanner: {
        wrapper: 'bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/20 rounded-xl p-4',
        layout: 'flex items-center justify-between',
        leftContent: 'iconBox p-2 bg-white shadow-sm + Sparkles 5x5 emerald-500 + h3 title + p alertas',
        rightCTA: 'Button ghost emerald-600 hover:emerald-700 hover:bg-emerald-50 — "Ver Detalhes" — gap: SEM onClick',
      },

      tabsListStructure: {
        wrapper: 'flex flex-wrap h-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl',
        block1Consolidated: '5 TabsTriggers — gap-2 py-2.5 px-4 + icons',
        divider1: 'div w-px h-6 bg-slate-300 mx-1 self-center',
        block2Methods: '3 TabsTriggers com icons coloridos por método',
        divider2: 'div w-px h-6 bg-slate-300 mx-1 self-center',
        block3TechAlerts: {
          tecnico: 'Server icon',
          alertas: 'Bell icon + Badge destructive absolute -top-1 -right-1 h-5 w-5 p-0 text-[10px] — alertCount=3',
        },
      },

      tabsContent: {
        animation: 'animate-in fade-in-50 duration-300 (todas as 10)',
        renderEach: 'switch baseado em activeTab → renderiza componente v3 correspondente',
      },
    },

    knownGaps: [
      'TODAS as 5 views v3 usam dados HARDCODED mock — sem queries backend',
      'Period Select e Compare Select setados mas NÃO aplicados nas views (apenas mudam state)',
      'Export DropdownMenu items SEM onClick — não exporta',
      'Settings button SEM onClick',
      '"Ver Detalhes" do banner DIA SEM onClick',
      '"Pausar" do Live Feed (Operational) SEM onClick',
      '"Aprovar" e "Rejeitar" da Fila de Saques (Financial) SEM onClick',
      'Checkbox da Fila de Saques SEM onChange — não seleciona realmente',
      '"Ver Todos" e Eye buttons da tabela Merchants em Alerta (Risk) SEM onClick',
      'alertCount = 3 hardcoded — comentário no código admite "would come from real data"',
      'Auto-refresh apenas decrementa contador — NÃO dispara nada nas views (cada view tem seu próprio setInterval)',
      'Últimas 5 views (Card/Pix/Boleto/Technical/Alerts) NÃO documentadas neste doc — entrarão em complemento',
      'Logos Visa/Mastercard via Wikipedia CDN — risco de quebra externa',
      'OperationalView.errorRate clamp errado: Math.max(0, Math.min(1, ...)) clampa em 0-1 mas exibe como % — confusão semântica',
      'tpsData tick={false} em XAxis — perde contexto temporal visual',
    ],

    relationshipsToOtherPages: {
      adminIntTransactionsDashboard: '/AdminIntTransactionsDashboard — drill-down operacional',
      adminIntFinancialDashboard: '/AdminIntFinancialDashboard — drill-down financeiro',
      adminIntRiskDashboard: '/AdminIntRiskDashboard — drill-down risco',
      adminIntMerchantProfile: '/AdminIntMerchantProfile — Eye/Ver dos merchants em alerta apontaria pra cá',
      adminIntWithdrawalApprovals: '/AdminIntWithdrawalApprovals — alvo dos botões Aprovar/Rejeitar da Fila',
      adminIntPagSmileCopilot: '/AdminIntPagSmileCopilot — DIA Insights "Ver Detalhes" deveria abrir aqui',
      dashboard: '/Dashboard — versão merchant (mais simples) deste mesmo conceito',
    },
  },
};

export default AdminIntDashboardDoc;