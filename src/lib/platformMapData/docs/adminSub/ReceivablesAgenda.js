// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /ReceivablesAgenda
// ============================================================================
// Arquivo dedicado, fidelidade absoluta a pages/ReceivablesAgenda.jsx (394 linhas).
// Cada filtro, cada KPI, cada coluna da tabela, cada lógica D+N, cada status,
// cada item do Calendar, cada barra do chart — documentado individualmente.
// ============================================================================

export const ReceivablesAgendaDoc = {
  pageId: 'ReceivablesAgenda',
  pagePath: '/ReceivablesAgenda',
  module: 'Financeiro',
  parentPage: 'FinancialOverview',

  // ==========================================================================
  // CAMADA EXPLAINER
  // ==========================================================================
  explainer: {
    oneLiner:
      'Agenda visual de recebíveis FUTUROS — calendário interativo + gráfico de barras + tabela detalhada com até 500 lançamentos previstos, mostrando para cada parcela: data de liquidação prevista (D+N), método (cartão/PIX), bruto/taxa/líquido, status (agendado/liquidado/antecipado/bloqueado) e flag is_anticipatable, com CTA principal direcionando para /Anticipation.',

    whatIsAReceivable: {
      definition:
        'Receivable é cada UNIDADE de liquidação de uma transação aprovada. Uma venda à vista no PIX gera 1 receivable. Uma venda parcelada em 6x no cartão gera 6 receivables (uma para cada parcela em D+30, D+60, ... D+180).',
      schema:
        'Entity Receivable: { transaction_id, settlement_date, gross_amount, fee_amount, net_amount, status, payment_method, installment_number, total_installments, is_anticipatable }',
      relationship: 'N receivables : 1 transaction (cardinalidade)',
    },

    fourStatuses: {
      scheduled: { label: 'Agendado', color: 'blue', icon: 'Clock', meaning: 'Aguardando settlement_date para liquidação automática' },
      settled: { label: 'Liquidado', color: 'green', icon: 'CheckCircle2', meaning: 'Já caiu no saldo disponível — não aparece nesta agenda (filtro futuro)' },
      anticipated: { label: 'Antecipado', color: 'purple', icon: 'Zap', meaning: 'Merchant pagou taxa para receber antes do prazo' },
      blocked: { label: 'Bloqueado', color: 'red', icon: 'Lock', meaning: 'Travado por chargeback/fraude/judicial' },
    },

    threeKPIs: {
      totalToReceive: 'Total a Receber — sum(net_amount) de todos os receivables filtrados',
      anticipatable: 'Disponível para Antecipação — sum(net_amount) onde is_anticipatable=true (subset do total)',
      averageTicket: 'Ticket Médio — total/count (gap: divisão por zero protegida)',
    },

    fourFilters: {
      period: 'Período (Select com 6 opções: Todos / Próximos 7/15/30/60/90 dias)',
      method: 'Método (3 opções: Todos / Cartão / Pix) — filtra payment_method',
      onlyAnticipatable: 'Switch Apenas antecipáveis — filtra is_anticipatable=true',
      selectedDate: 'Filtro implícito por click no Calendar — Badge removível com X',
    },

    threeViewModes: {
      calendar: 'ReceivablesCalendar (componente externo) — dia do mês com totais visualmente',
      chart: 'BarChart Recharts — fluxo dos próximos 30 dias agrupados por data',
      table: 'Tabela detalhada com 8 colunas — top 50 entries',
    },

    coreCapabilities: [
      '3 KPI Cards: Total / Anticipatable (purple) / Ticket Médio',
      'Filters Card com 4 controles + Badge clicável de data selecionada',
      'Grid 2 cols: Calendar (componente) + BarChart',
      'Tabela 8 colunas: Data | Transação | Método | Parcela | Bruto | Taxa | Líquido | Status',
      'D+N visualizado abaixo da data (ex: D+30, D+60)',
      'Click em dia do calendário filtra a tabela para aquela data específica',
      'Botão "Antecipar" no header (purple-600) → /Anticipation',
    ],

    economicLogic: {
      whyAnticipate:
        'Vendas no cartão liquidam em D+30 (à vista) ou em parcelas mensais. Merchant que precisa de capital de giro paga taxa (~2-3% ao mês) para antecipar.',
      tradeoff:
        'is_anticipatable=false = adquirente bloqueou (geralmente reserva técnica ou risco de chargeback alto). Merchant não pode escolher.',
    },
  },

  // ==========================================================================
  // CAMADA TÉCNICA
  // ==========================================================================
  technical: {
    fileLocation: 'pages/ReceivablesAgenda.jsx',
    totalLines: 394,

    imports: {
      react: ['useState', 'useMemo'],
      reactQuery: ['useQuery'],
      base44: 'base44.entities.Receivable',
      navigation: ['Link', 'createPageUrl from ../utils'],
      sharedComponents: ['PageHeader', 'ReceivablesCalendar (components/financial)'],
      uiComponents: ['Card+CardContent+CardHeader+CardTitle', 'Button', 'Badge', 'Input (importado sem uso)', 'Label', 'Switch', 'Select stack', 'Table stack'],
      utilities: ['cn (lib/utils)', 'date-fns: format, differenceInDays, addDays', 'date-fns/locale: ptBR'],
      recharts: ['BarChart', 'Bar', 'XAxis', 'YAxis', 'CartesianGrid', 'Tooltip', 'ResponsiveContainer'],
      lucideIcons: [
        'Calendar — KPI Total + Empty state',
        'Zap — KPI Antecipável (purple) + botão Antecipar header + status anticipated',
        'Filter — header dos filtros',
        'CreditCard — método cartão',
        'QrCode — método PIX (verde)',
        'Clock — status scheduled',
        'CheckCircle2 — status settled',
        'Lock — status blocked',
        'BarChart3 — KPI Ticket Médio',
        'Download — botão Exportar (gap: sem onClick)',
      ],
      localUtility: { formatCurrency: 'Definida INLINE — gap (duplica utils)' },
      constants: {
        statusConfig: 'Object: scheduled (blue Clock) / settled (green CheckCircle2) / anticipated (purple Zap) / blocked (red Lock)',
      },
    },

    componentState: {
      selectedDate: { initial: 'null', purpose: 'Filtro implícito por click no Calendar' },
      periodFilter: { initial: "'all'", purpose: 'Janela de dias (all/7/15/30/60/90)' },
      methodFilter: { initial: "'all'", purpose: 'Método: all/card/pix' },
      onlyAnticipatable: { initial: 'false', purpose: 'Switch para mostrar apenas is_anticipatable=true' },
    },

    backendIntegration: {
      query: {
        queryKey: "['receivables']",
        queryFn: 'base44.entities.Receivable.list("settlement_date", 500)',
        ordering: 'Por settlement_date ASC (note: SEM o "-" — ascendente, do mais próximo ao mais distante)',
      },
    },

    filtersAndCalculations: {
      filteredReceivables: {
        function: 'useMemo dependente de [receivables, periodFilter, methodFilter, onlyAnticipatable, selectedDate, today]',
        chain: '5 condições AND',
        criticalFilters: [
          "rec.status === 'scheduled' && settlementDate >= today (apenas FUTUROS scheduled)",
          'periodFilter !== "all" → daysToSettle <= parseInt(periodFilter)',
          'methodFilter !== "all" → rec.payment_method === methodFilter',
          'onlyAnticipatable && !rec.is_anticipatable → exclui',
          'selectedDate && rec.settlement_date !== selectedDate → exclui',
        ],
      },

      totals: {
        function: 'useMemo dependente de [filteredReceivables]',
        derived: {
          total: 'reduce sum net_amount',
          anticipatable: 'filter is_anticipatable → reduce sum net_amount',
          count: 'filteredReceivables.length',
        },
      },

      chartData: {
        function: 'useMemo dependente de [filteredReceivables]',
        groupingLogic: 'forEach: grouped[date] = { date, value (sum net), count }',
        sortingAndSlicing: 'Object.values + sort por date (localeCompare) + slice(0, 30) — apenas 30 primeiros dias',
        labelMapping: 'map: { ...d, label: format(date, "dd/MM") }',
      },
    },

    layout: {
      rootContainer: 'div className="space-y-6"',

      pageHeader: {
        title: '"Agenda de Recebíveis"',
        subtitle: '"Visualize seus recebíveis futuros e solicite antecipação"',
        breadcrumbs: [{ label: 'Financeiro', href: 'Financial' }, { label: 'Agenda de Recebíveis' }],
        actions: 'Button bg-purple-600 hover:bg-purple-700 + asChild + Link Anticipation + Zap + "Antecipar"',
      },

      summaryCards: {
        layout: 'grid grid-cols-1 md:grid-cols-3 gap-4',
        cards: [
          {
            name: 'Total a Receber',
            iconBox: 'p-2 bg-blue-100 + Calendar 5x5 blue-600',
            label: 'text-sm gray-500 "Total a Receber"',
            value: 'text-xl font-bold formatCurrency(totals.total)',
            extraText: 'text-xs gray-500 "{count} recebíveis"',
          },
          {
            name: 'Disponível para Antecipação',
            color: 'bg-purple-50 border-purple-200',
            iconBox: 'bg-purple-100 + Zap 5x5 purple-600',
            label: 'text-sm purple-700',
            value: 'text-xl font-bold purple-700 formatCurrency(totals.anticipatable)',
          },
          {
            name: 'Ticket Médio',
            iconBox: 'p-2 bg-green-100 + BarChart3 5x5 green-600',
            value: 'formatCurrency(count > 0 ? total/count : 0)',
            zeroProtection: 'count > 0 ? ... : 0 — evita NaN',
          },
        ],
      },

      filtersCard: {
        wrapper: 'Card → CardContent p-4',
        layout: 'flex flex-wrap items-center gap-4',
        leadIcon: 'Filter 4x4 gray-500 + "Filtros:" text-sm font-medium',

        periodSelect: {
          width: 'w-[160px]',
          options: ['Todos (all)', 'Próximos 7 dias', '15 dias', '30 dias', '60 dias', '90 dias'],
        },

        methodSelect: {
          width: 'w-[140px]',
          options: ['Todos', 'Cartão (card)', 'Pix (pix)'],
        },

        anticipatableSwitch: {
          layout: 'flex items-center gap-2 + Switch + Label "Apenas antecipáveis"',
        },

        selectedDateBadge: {
          renderIf: 'selectedDate !== null',
          layout: 'Badge variant=secondary gap-1',
          content: 'format(date, "dd/MM/yyyy") + button "×" → setSelectedDate(null)',
        },
      },

      gridCalendarChart: {
        layout: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
        leftColumn: {
          component: 'ReceivablesCalendar',
          props: {
            receivables: 'filteredReceivables',
            onDayClick: 'setSelectedDate',
            selectedDate: 'selectedDate',
          },
          purpose: 'Componente externo — calendário visual com totais por dia',
        },
        rightColumn: {
          card: {
            title: 'CardTitle text-lg "Fluxo de Recebíveis"',
            chart: {
              height: 'h-[300px]',
              BarChart: {
                data: 'chartData (top 30 dias)',
                CartesianGrid: 'strokeDasharray="3 3" stroke="#f0f0f0"',
                XAxis: 'dataKey=label tick fontSize=11',
                YAxis: 'tickFormatter k formatado',
                Tooltip: 'formatCurrency + labelFormatter "Data: {label}"',
                Bar: 'dataKey=value, fill=#3b82f6 (azul), radius=[4,4,0,0]',
              },
            },
          },
        },
      },

      receivablesList: {
        wrapper: 'Card → CardHeader + CardContent p-0',
        header: {
          left: 'CardTitle text-lg "Lista de Recebíveis"',
          right: 'Button outline sm + Download + "Exportar" (gap: sem onClick)',
        },
        body: {
          wrapper: 'border rounded-lg overflow-hidden + Table',
          headers: ['Data Liquidação', 'Transação', 'Método', 'Parcela', 'Bruto (right)', 'Taxa (right)', 'Líquido (right)', 'Status'],
          tableHeaderClass: 'bg-gray-50',
          rowsLimit: 'filteredReceivables.slice(0, 50) — máximo 50 linhas (gap: sem paginação)',
          columns: [
            {
              name: 'Data Liquidação',
              render: '2 linhas: format(dd/MM/yyyy) font-medium + "D+{daysToSettle}" text-xs gray-500',
            },
            {
              name: 'Transação',
              render: 'transaction_id?.slice(0, 12) + "..." em font-mono text-sm',
            },
            {
              name: 'Método',
              render: 'flex gap-1: ícone (CreditCard gray ou QrCode green) + payment_method capitalize',
            },
            {
              name: 'Parcela',
              renderConditional: 'installment_number && total_installments → Badge outline "X/Y", senão "-"',
            },
            { name: 'Bruto', alignment: 'right', render: 'formatCurrency(gross_amount)' },
            { name: 'Taxa', alignment: 'right', render: 'red-600 + "-{formatCurrency(fee_amount)}"' },
            { name: 'Líquido', alignment: 'right', render: 'font-semibold formatCurrency(net_amount)' },
            {
              name: 'Status',
              render: 'Badge gap-1 com config.color + StatusIcon 3x3 + config.label (default scheduled se status undefined)',
            },
          ],
          emptyState: {
            renderIf: 'filteredReceivables.length === 0',
            content: 'Calendar 12x12 gray-300 + "Nenhum recebível encontrado com os filtros selecionados"',
          },
        },
      },
    },

    knownGaps: [
      'Botão "Exportar" sem onClick implementado',
      'Tabela limitada a 50 linhas — sem paginação',
      'Input (lucide ui) e addDays (date-fns) importados mas não usados',
      'formatCurrency redefinida inline em vez de importar centralizada',
      'Filtro selectedDate compara strings exatas (rec.settlement_date !== selectedDate) — pode falhar com timezone',
      'breadcrumbs.href "Financial" — página com esse nome talvez não exista',
      'Chart limitado a 30 primeiros dias — não há toggle para ver 60/90 dias',
      'Sem ordenação clicável nas colunas da tabela',
      'Sem busca por transaction_id na tabela',
      'Sem indicador de "última atualização" / refresh manual',
      'Não diferencia visualmente recebíveis recém-criados',
      'Tooltip do chart só mostra valor — poderia mostrar count também',
      'D+N pode ficar "D+0" quando settle = hoje — display estranho',
      'transaction_id slice(0, 12) sem link clicável para /TransactionDetail',
    ],

    relationshipsToOtherPages: {
      financialOverview: '/FinancialOverview — pai do módulo, breadcrumbs e Quick Link',
      anticipation: '/Anticipation — destino do CTA "Antecipar" (purple-600)',
      transactionDetail: '/TransactionDetail — gap: deveria ter link da transaction_id',
      financialStatement: '/FinancialStatement — visão histórica complementar (passado vs futuro)',
      splitManagement: '/SplitManagement — recebíveis com splits aparecem aqui (cada split = 1 receivable)',
    },
  },
};

export default ReceivablesAgendaDoc;