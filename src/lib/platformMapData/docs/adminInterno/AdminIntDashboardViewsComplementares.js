// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /AdminIntDashboard (Views Complementares)
// 5 views v3 restantes — Card (257) / Pix (286) / Boleto (272) /
// Technical (286) / Alerts (302) — total ~1400 linhas analisadas com
// fidelidade absoluta (mock data, status colors, tabs, callbacks, gaps).
// ============================================================================

export const AdminIntDashboardViewsComplementaresDoc = {
  pageId: 'AdminIntDashboardViewsComplementares',
  pagePath: '/AdminIntDashboard (sub-views)',
  module: 'Admin Interno',
  parentPage: 'AdminIntDashboard',

  explainer: {
    oneLiner:
      'Complemento microscópico das 5 views v3 finais do dashboard interno (Cartão / PIX / Boleto / Técnico / Alertas). Cada view tem KPIs únicos, charts especializados, tabelas comparativas e seções específicas — Cartão foca em bandeiras+adquirentes+parcelamento+motivos de negação, PIX em tipos+PSP+devoluções+MEDs+horário, Boleto em funil+aging+regras de compensação, Técnico em infra+providers+webhooks+health-checks, Alertas (única view com STATE INTERATIVO real) usa 3 sub-tabs (Alertas/Incidentes/Regras) e tem handler funcional acknowledge.',

    // ==========================================================================
    // CARD VIEW — TPV Cartão
    // ==========================================================================
    cardViewMicroscopic: {
      role: 'Análise de cartão — bandeiras, adquirentes, parcelamento, motivos de negação',
      iconColor: 'bg-blue-100 + text-blue-600 (CardKPICard tem cor fixa azul para todos KPIs)',
      sixKPIs: {
        tpv: '8.750.000 (currency, +12.5%) — CreditCard',
        transactions: '58.340 (number, +8.3%) — CreditCard',
        ticketMedio: '150 (currency, sem trend) — CreditCard',
        aprovacao: '94.2% (percent, +1.2pp up) — CheckCircle',
        cbRatio: '0.72% (percent, -0.08pp down, subtitle "Limite: 0.90%") — AlertTriangle',
        parcelaMedia: '3.2 (number, subtitle "parcelas") — Clock',
      },
      gridResponsive: 'grid-cols-1 md:2 lg:3 xl:6 — em XL todos numa linha',
      brandColors: {
        Visa: '#1A1F71',
        Mastercard: '#EB001B',
        Elo: '#00A4E0',
        Amex: '#006FCF',
        Hiper: '#822124',
      },
      brandPerformanceCard: {
        fiveBrands: [
          'Visa: 45% share, 95.1% aprovação, 0.68% CB, R$3.94M TPV',
          'Mastercard: 35%, 93.8%, 0.75%, R$3.06M',
          'Elo: 12%, 91.2%, 0.92% (red — supera 0.90), R$1.05M',
          'Amex: 5%, 89.5%, 0.62%, R$437.5k',
          'Hiper: 3%, 88.0%, 1.05% (red), R$262.5k',
        ],
        renderEachBrand: 'div p-3 border rounded — left: iconBox 10x10 com bg color brand 15% opacity + CreditCard color brand + name + share — right: aprovação % + CB Ratio (red>=0.90 / amber>=0.65 / green<0.65)',
      },
      acquirerPerformanceCard: {
        chart: 'BarChart layout=vertical h-[200px] — domain=[85,100] — Bar dataKey=aprovacao fill=#10B981 radius=[0,4,4,0]',
        innerTable: '4 colunas (Adquirente, Share %, Latência ms Badge, Taxa Erro %) — Badge latência: <300 default / <500 secondary / >=500 destructive',
        fourAcquirers: ['Adyen 45%/95.1%/198ms/0.02%', 'Stone 35%/94.8%/234ms/0.05%', 'Rede 15%/91.2%/345ms/0.12%', 'GetNet 5%/93.5%/267ms/0.08%'],
      },
      installmentDistributionCard: {
        chart: 'BarChart h-[200px] — Bar dataKey=tpv fill=#3B82F6 radius=[4,4,0,0]',
        threeFaixas: [
          '1x: R$3.94M (45% TPV) ticket R$120 (32.812 txns)',
          '2-6x: R$3.32M (38%) ticket R$280 (11.875 txns)',
          '7-12x: R$1.49M (17%) ticket R$650 (2.288 txns)',
        ],
        belowList: 'pipe-separated: faixa | share% TPV | Ticket | count txns',
      },
      denialReasonsCard: {
        sixReasons: [
          'Saldo/Limite insuficiente: 38% (2.218)',
          'Cartão bloqueado: 22% (1.287)',
          'Antifraude recusou: 18% (1.053)',
          'Dados inválidos: 12% (702)',
          'Timeout: 6% (351)',
          'Outros: 4% (234)',
        ],
        progressLogic: 'h-2 bg-slate-100 + bar h-full bg-red-500 com width=percent + opacity=1-(index*0.15) — fading do mais critico para menos',
      },
    },

    // ==========================================================================
    // PIX VIEW — TPV PIX
    // ==========================================================================
    pixViewMicroscopic: {
      role: 'Análise PIX — tipos, PSPs, devoluções (voluntárias e MEDs), horário',
      sevenKPIs: {
        layoutGrid: 'grid-cols-1 md:2 lg:4 xl:7 — única view com 7 colunas',
        tpv: '3.125.000 (+18.2%) — QrCode default',
        transactions: '41.667 (+15.6%) — Zap default',
        ticketMedio: '75 (sem trend) — QrCode default',
        taxaSucesso: '99.1% (+0.3pp) — CheckCircle variant=success (bg-green-50 border-green-200)',
        tempoMedioPagamento: '"2m 15s" (text não-formatado, subtitle "até pagamento") — Clock',
        taxaExpiracao: '12.5% (-2.1pp down) — Clock',
        medRatio: '0.08% (subtitle "Limite: 0.20%") — variant condicional: <0.10 success / senão warning',
      },
      pixKPICardComponent: {
        threeVariants: 'default(white) / success(green-50 border-green-200) / warning(amber-50 border-amber-200)',
        layout: 'p-4 (não pt-6 como CardKPICard) + título XS truncate + valor XL (não 2xl) bold truncate',
        iconColors: 'default slate-500 / success green-600 / warning amber-600',
      },
      pixTypePerformanceCard: {
        chart: 'BarChart vertical h-[200px] — domain=[0,100] — Bar dataKey=sucesso fill=#10B981',
        fourTipos: [
          'QR Dinâmico: R$2.5M (80% share) 99.3% sucesso 2m15s tempo (33.333 txns)',
          'Copia e Cola: R$468k (15%) 98.8% 3m45s (6.250)',
          'QR Estático: R$125k (4%) 98.5% 1m30s (1.667)',
          'PIX Cobrança: R$31k (1%) 97.2% — (417)',
        ],
        belowList: 'icon QrCode green + name | share | TPV | tempoMedio',
      },
      pspPerformanceCard: {
        twoPSPs: [
          'PSP A (Itaú): 70% share, 99.2% sucesso, 856ms latência, 0.01% erro',
          'PSP B (Bradesco): 30%, 98.9%, 923ms, 0.03%',
        ],
        chart: 'PieChart h-[150px] — innerRadius=40 outerRadius=60 paddingAngle=2 — label `${name.split(" ")[0]} ${share}%` (truncado)',
        pixColors: '[#10B981, #34D399, #6EE7B7, #A7F3D0] — escala de verde',
        pspDetailRow: '4 colunas — Sucesso (green) | Latência ms | Erro % — cada uma com subtitle xs',
      },
      devolucoesVoluntariasCard: {
        header: 'RefreshCw 5x5 blue-500 + "Devoluções Voluntárias"',
        description: '234 devoluções • R$45.600',
        fourReasons: [
          'Cancelamento de pedido: 45%',
          'Erro de valor: 30%',
          'Duplicidade: 15%',
          'Outros: 10%',
        ],
        progressBar: 'h-2 bg-slate-100 + bar bg-blue-500 width=percent (sem opacity fading)',
      },
      medsCard: {
        header: 'AlertTriangle 5x5 amber-500 + "MEDs (Mecanismo Especial de Devolução)"',
        description: '33 MEDs • R$12.500',
        fourStatus: [
          'Bloqueio Cautelar: 5 (Badge destructive)',
          'Em Análise: 12 (Badge secondary)',
          'Devolvido: 10 (Badge default)',
          'Encerrado: 6 (Badge outline)',
        ],
      },
      hourlyTrendCard: {
        sevenHoras: '00h(85k/1133), 06h(120k/1600), 09h(280k/3733), 12h(420k/5600), 15h(380k/5067), 18h(450k/6000 — pico), 21h(320k/4267)',
        chart: 'BarChart h-[200px] — Bar dataKey=tpv fill=#10B981 radius=[4,4,0,0]',
      },
    },

    // ==========================================================================
    // BOLETO VIEW
    // ==========================================================================
    boletoViewMicroscopic: {
      role: 'Análise Boleto — funil emissão→liquidação, aging pendentes/vencidos, regras compensação',
      iconColor: 'bg-amber-100 + text-amber-600 (BoletoKPICard tem cor fixa âmbar)',
      sixKPIs: {
        tpv: '625.000 (+5.2% up) — FileText',
        boletosEmitidos: '2.500 (+8.1% up) — FileText',
        boletosPagos: '1.713 (sem trend) — CheckCircle',
        taxaConversao: '68.5% (+2.3pp, subtitle "Meta: 70%") — TrendingUp',
        tempoMedioPagamento: '"2.3 dias" (text) — Clock',
        ticketMedio: '365 (currency) — Banknote',
      },
      conversionFunnelCard: {
        funnelData: '4 etapas — Emitidos 2500 #3B82F6 / Pagos 1700 #10B981 / Compensados 1675 #059669 / Liquidados 1650 #047857',
        renderLogic: 'percent = (step.value / funnelData[0].value) * 100 (relativo ao primeiro) — dropoff = prevPercent - percent',
        eachStep: 'name + value bold + Badge percent (default>=90 / secondary>=70 / destructive<70) + dropoff red xs + h-3 bg-slate-100 progressbar com fill backgroundColor=step.fill',
        dropoffShown: '-32.0% (Emitidos→Pagos), -1.0% (Pagos→Compensados), -1.0% (Compensados→Liquidados)',
      },
      bankPerformanceCard: {
        twoBanks: [
          'Itaú: 60% volume, 69.3% conversão, 2.1 dias tempo, 1.1s latência, 0.02% erro',
          'Bradesco: 40%, 67.0%, 2.5 dias, 1.4s, 0.05%',
        ],
        renderEach: 'p-4 border + Banknote amber-500 + name bold + Badge share% — grid-cols-4 metrics: Conversão (green), Tempo Médio dias, Latência s, Taxa Erro %',
      },
      agingPendentesCard: {
        priorityColors: {
          high: 'bg-orange-100 border-orange-200 text-orange-700',
          medium: 'bg-yellow-100 border-yellow-200 text-yellow-700',
          normal: 'bg-green-100 border-green-200 text-green-700',
          low: 'bg-blue-100 border-blue-200 text-blue-700',
        },
        fourFaixas: [
          'Vence Hoje: 145 boletos R$52.925 (high orange)',
          'Vence Amanhã: 198 R$72.270 (medium yellow)',
          'Vence em 2-7 dias: 312 R$113.880 (normal green)',
          'Vence em 8-30 dias: 145 R$52.925 (low blue)',
        ],
      },
      agingVencidosCard: {
        fiveFaixas: [
          '1-7 dias: 89 boletos R$32.485 — 35% prob. recuperação',
          '8-15 dias: 56 R$20.440 — 20%',
          '16-30 dias: 34 R$12.410 — 10%',
          '31-60 dias: 23 R$8.395 — 5%',
          '> 60 dias: 18 R$6.570 — 2%',
        ],
        renderEach: 'flex-1 left: faixa + count + Progress h-2 + recuperacao% xs w-12 + "Prob. recuperação" — right: value bold ml-4',
      },
      compensacaoRulesCard: {
        header: 'Calendar 5x5 blue-500 + "Regras de Compensação Bancária"',
        gridLayout: 'grid-cols-1 md:2 lg:4 — 4 cards iguais bg-slate-50',
        fourRules: [
          'Pagamento até 13h30 → D+0 (mesmo dia útil)',
          'Pagamento após 13h30 → D+1 (próximo dia útil)',
          'Pagamento em feriado → D+1 (próximo dia útil)',
          'Pagamento fim de semana → D+1 (segunda-feira)',
        ],
        renderEach: 'p-4 bg-slate-50 — condition sm slate-500 + result lg bold green-600 + description xs slate-400',
      },
    },

    // ==========================================================================
    // TECHNICAL VIEW
    // ==========================================================================
    technicalViewMicroscopic: {
      role: 'Saúde técnica da plataforma — infra, providers, health checks, webhooks',
      fiveInfraKPIs: {
        layoutGrid: 'grid-cols-1 md:2 lg:5 — 5 KPIs em uma linha',
        disponibilidade: '99.98% (status getter: >=99.9 ok / >=99 warn / <99 error) — sem threshold',
        latenciaMedia: '245ms (threshold 500, getter: <500 ok / <750 warn / >=750 error)',
        latenciaP95: '456ms (threshold 800)',
        latenciaP99: '892ms (threshold 1500)',
        taxaErroGlobal: '0.12% (threshold 0.5, getter: <0.5 ok / <1 warn / >=1 error)',
        getStatusByTitle: 'Lookup do status pelo título: includes("Disponibilidade") / includes("Latência") / includes("Erro") — gap: matching frágil por string',
        threeStatusColors: 'ok(green-200/50), warn(yellow-200/50), error(red-200/50)',
      },
      infraKPICardComponent: {
        valueFormat: 'value < 10 ? toFixed(2) : toFixed(0) — mistura inteiros e decimais',
        thresholdLabel: '"Meta: < {threshold}{unit}" se threshold definido',
      },
      latencyByProviderChart: {
        height: 'h-[250px]',
        fourLines: 'Adyen #10B981, Stone #3B82F6, Rede #F59E0B, PIX #8B5CF6 — strokeWidth=2 dot=false',
        domain: '[0, 1200]',
        legendBelow: '4 itens flex justify-center gap-4',
      },
      healthChecksCard: {
        header: 'Server 5x5 green-500 + "Health Checks"',
        sixEndpoints: [
          'API Gateway: 45ms 28/01 14:32:45 ok',
          'Database Primary: 12ms ok',
          'Database Replica: 15ms ok',
          'Redis Cache: 3ms ok',
          'Message Queue: 8ms ok',
          'S3 Storage: 89ms ok',
        ],
        renderEach: 'p-2 bg-slate-50 + StatusIcon color status + endpoint name + responseTime + lastCheck',
      },
      providerStatusCard: {
        statusConfig: {
          ok: 'CheckCircle green',
          warn: 'AlertTriangle yellow',
          slow: 'Clock orange',
          error: 'XCircle red',
          down: 'WifiOff gray',
        },
        tenProviders: {
          adquirentes: '4 — Adyen ok 198ms 0.02% 100%, Stone ok 234ms 0.05% 100%, Rede SLOW 456ms 0.12% 99.8%, GetNet ok 267ms 0.08% 100%',
          psps: '2 — Itaú(PIX) ok 856ms 0.01% 100%, Bradesco(PIX) WARN 1023ms 0.03% 99.9%',
          antifraude: '2 — SEON ok 145ms 0.01% 100%, Nethone ok 178ms 0.02% 100%',
          preCB: '2 — Ethoca ok 234ms 0.00% 100%, Verifi ok 289ms 0.01% 100%',
        },
        providerStatusRow: {
          left: 'iconBox p-2 bg color status + StatusIcon + name + type xs',
          right: '3 metrics center: latência (>500 orange / >300 yellow / <=300 green) | erro (>0.1 red / <=0.1 green) | uptime (<99.9 yellow / >=99.9 green) + Badge status final',
        },
      },
      webhooksCard: {
        header: 'RefreshCw 5x5 purple-500 + "Webhooks e Callbacks"',
        fiveStats: [
          'Enviados: 45.678 (default)',
          'Entregues: 45.234 (green-600)',
          'Em Retry: 312 (yellow-600)',
          'Falhas: 132 (red-600)',
          'Taxa Entrega: 99.03% (blue-600)',
        ],
        retryPolicy: '5 Badges outline em sequência: 1ª Imediato → 2ª 5min → 3ª 30min → 4ª 2h → 5ª 12h — separados por "→"',
        gap: 'webhookStats hardcoded — não vem do entity Webhook',
      },
    },

    // ==========================================================================
    // ALERTS VIEW — A ÚNICA INTERATIVA
    // ==========================================================================
    alertsViewMicroscopic: {
      role: 'Centro de alertas e incidentes — única view com state INTERATIVO real (acknowledge funcional)',
      hasInteractivity: true,
      onlyViewWithState: 'useState(activeAlerts) + handleAcknowledge funcional',

      fourSummaryKPIs: {
        criticalCount: 'derived: filter(type==="critical" && !acknowledged).length — Card border-red-200 bg-red-50 (condicional) + AlertCircle red',
        warningCount: 'derived filter warning && !acknowledged — yellow',
        openIncidents: 'derived filter status !== resolved — orange',
        autoResolution: '62% hardcoded — green',
        gap: 'Initial: critical=2 (id 1,2 mas id 2 acknowledged=true→count=1), warning=2 (id 3,4), info=1 — exibe 1 critical + 2 warning + 2 abertos',
      },

      threeSubTabs: {
        alerts: { icon: 'Bell', badge: 'destructive criticalCount+warningCount (3)' },
        incidents: { icon: 'AlertTriangle', badge: 'secondary openIncidents (2)' },
        rules: { icon: 'Settings', badge: 'sem' },
      },

      alertsTab: {
        header: 'CardTitle "Alertas Ativos" + Button outline Filter "Filtrar" (gap: SEM onClick)',
        fiveMockAlerts: [
          'critical AlertCircle: "CB Ratio > 0.85%" — Loja Suspeita ultrapassou — 5min — NOT acknowledged',
          'critical AlertCircle: "Latência Adquirente > SLA" — Rede 456ms (SLA 300ms) — 12min — acknowledged ✓',
          'warning AlertTriangle: "MED Ratio > 0.15%" — 3 merchants acima — 1h — NOT acknowledged',
          'warning AlertTriangle: "Webhook Delivery < 95%" — 93.2% — 2h — NOT acknowledged',
          'info Bell: "Novo merchant ativado" — Tech Store — 3h — acknowledged ✓',
        ],
        alertItemComponent: {
          layout: 'flex items-start gap-4 p-4 border + bgLight color severity + opacity-60 se acknowledged',
          iconBox: 'p-2 rounded-lg color severity + Icon white',
          rightSide: 'title font-medium + time xs slate-500 right + message + Button "Reconhecer" CheckCircle (apenas se !acknowledged)',
          functional: 'onAcknowledge(id) → setActiveAlerts(prev.map(a => a.id===id ? {...a, acknowledged:true} : a)) — TOTALMENTE FUNCIONAL',
        },
      },

      incidentsTab: {
        header: 'CardTitle "Incidentes" + Button "Novo Incidente" Plus (gap: SEM onClick)',
        threeMockIncidents: [
          'INC-001 P1 (red Crítico) "Indisponibilidade Rede" RESOLVED — 28/01 10:30→10:45 TTR 15min — João Silva',
          'INC-002 P2 (orange Alto) "Degradação PIX Bradesco" IN_PROGRESS — 28/01 14:00 — Maria Santos',
          'INC-003 P3 (yellow Médio) "Falha Webhook Merchant X" OPEN — 28/01 13:45 — sem owner',
        ],
        severityConfig: {
          P1: 'bg-red-500 Crítico',
          P2: 'bg-orange-500 Alto',
          P3: 'bg-yellow-500 Médio',
          P4: 'bg-blue-500 Baixo',
        },
        statusConfig: {
          open: 'bg-red-100 text-red-700 Aberto',
          in_progress: 'bg-yellow-100 text-yellow-700 Em Andamento',
          resolved: 'bg-green-100 text-green-700 Resolvido',
        },
        incidentRowComponent: {
          left: 'Badge severity color + title + id • "Aberto em" openedAt',
          right: '"👤 owner" se exists + "TTR: ttm" green-600 se exists + Badge status + Button ghost Eye (gap: SEM onClick)',
        },
        belowMetrics: {
          mttr: 'Mean Time To Resolve — P1 15min / P2 1h 30min / P3 4h (Badges outline)',
          mtta: 'Mean Time To Acknowledge — Critical 3min / Warning 15min',
          autoResolution: '62% green-600 lg bold',
        },
      },

      rulesTab: {
        header: 'CardTitle "Regras de Alerta" + Button "Nova Regra" Plus (gap: SEM onClick)',
        sevenRules: [
          'Latência Adquirente > SLA: > 500ms — CRITICAL',
          'Taxa de Erro > 0.5%: > 0.5% — CRITICAL',
          'Webhook Delivery < 95%: < 95% — CRITICAL',
          'CB Ratio Merchant > 0.85%: > 0.85% — WARNING',
          'CB Ratio Global > 0.75%: > 0.75% — WARNING',
          'MED Ratio > 0.15%: > 0.15% — WARNING',
          'Uptime Provider < 99.9%: < 99.9% — WARNING',
        ],
        renderEach: 'checkbox readOnly checked={enabled} (gap: readOnly — não toggle) + name + Threshold xs + Badge severity (CRITICAL destructive / WARNING secondary)',
        gap: 'Todas 7 enabled=true — sem variação visual + checkbox NÃO funcional',
      },
    },
  },

  technical: {
    fileLocations: {
      cardView: 'components/admin-interno/dashboard/v3/CardView.jsx (257 linhas)',
      pixView: 'components/admin-interno/dashboard/v3/PixView.jsx (286 linhas)',
      boletoView: 'components/admin-interno/dashboard/v3/BoletoView.jsx (272 linhas)',
      technicalView: 'components/admin-interno/dashboard/v3/TechnicalView.jsx (286 linhas)',
      alertsView: 'components/admin-interno/dashboard/v3/AlertsView.jsx (302 linhas)',
    },

    backendIntegration: 'NENHUMA — TODAS as 5 views usam dados HARDCODED mock — sem queries entity (Transaction, Webhook, etc.) sem subscriptions sem refetch',

    statelessVsStateful: {
      stateless: '4 views (Card/Pix/Boleto/Technical) — render direto de constantes mock no top do arquivo, sem useState',
      stateful: '1 view (Alerts) — useState(alerts) + handleAcknowledge funcional + Tabs defaultValue="alerts" (não controlado)',
    },

    knownGapsByView: {
      cardView: [
        'Comentário PieChart importado mas NÃO usado',
        'Comentário Cell importado mas NÃO usado',
        'Comentário Legend importado mas NÃO usado',
        'denialReasons opacity fading via index*0.15 — última (Outros 4%) tem opacity 0.25 difícil de ver',
        'BRAND_COLORS hardcoded — falta para "Hipercard" formal (apenas "Hiper")',
      ],
      pixView: [
        'LineChart e Line importados mas NÃO usados',
        'PixKPICard só permite truncate — sem tooltip ao truncar',
        'pspPerformance label split(" ")[0] mostra apenas primeira palavra ("PSP" repetido para A e B — colide visual)',
        'Devoluções voluntárias header sub mistura count+value sem clareza',
        'MEDs Bloqueio Cautelar Badge destructive para count=5 — ambíguo (é o count em vermelho, não a severidade)',
      ],
      boletoView: [
        'FunnelChart e Funnel importados mas NÃO usados (tem implementação manual)',
        'LabelList, Cell importados mas NÃO usados',
        'agingPendentes último item "Vence em 8-30 dias" = 145/52925 (mesmos números do "Vence Hoje") — mock duplicado',
        'compensacaoRules são informativas — sem fonte de verdade vinculada à API',
      ],
      technicalView: [
        'AreaChart e Area importados mas NÃO usados',
        'getStatus matching por title.includes — quebra se i18n traduzir',
        'value.toFixed(value < 10 ? 2 : 0) — disponibilidade 99.98 cai em <10? não — mantém 2 decimais OK; mas confuso semanticamente',
        'WebhookStats hardcoded — não vem do entity Webhook',
        'Adyen/Stone/Rede/GetNet status all "ok" exceto Rede="slow" mas latência 198/234/345/267ms — Rede só seria slow >500ms (inconsistente)',
      ],
      alertsView: [
        'Botão Filter SEM onClick',
        'Botão "Novo Incidente" Plus SEM onClick',
        'Botão "Nova Regra" Plus SEM onClick',
        'Botão Eye dos incidents SEM onClick',
        'Checkbox das rules readOnly + sempre checked — NÃO funcional',
        'Tabs defaultValue não controlado — perde ao remontar',
        'Mock incidents.openedAt formato BR "28/01" — ano não especificado',
        'mtta/mttr hardcoded como strings — sem cálculo real',
      ],
    },

    crossViewKnownGaps: [
      'TODAS as 5 views usam mock — Period+Compare do parent dashboard NÃO se propaga (gap principal)',
      'Imports de recharts não-usados poluem 4 dos 5 arquivos (PieChart/Cell/Legend/Funnel/LabelList/AreaChart/Area/LineChart)',
      'Cores customizadas inline (#1A1F71 etc.) — não usam tokens do design system PagSmile (#2bc196)',
      'Acessibilidade: progress bars custom sem role=progressbar nem aria-valuenow',
      'Dark mode parcial — alguns variants têm dark: mas não todos (BoletoKPICard sem dark; CardKPICard sem dark)',
    ],

    relationshipsToOtherPages: {
      cardView: '/AdminIntChargebacksList (CB Ratio drilldown), /AdminIntBINAnalysis (BIN drilldown)',
      pixView: '/AdminIntMEDsList (MED drilldown), /AdminIntPreChargebacks',
      boletoView: '/AdminIntTransactions com filter method=boleto',
      technicalView: '/AdminIntWebhooks (drilldown webhook stats), /AdminIntSystemLogs',
      alertsView: '/AdminIntRiskAlerts (drilldown alertas), /AdminIntAudit (incidentes auditados)',
    },
  },
};

export default AdminIntDashboardViewsComplementaresDoc;