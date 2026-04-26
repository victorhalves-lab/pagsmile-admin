// ============================================================================
// DOCUMENTAÇÃO MICROSCÓPICA — /Reports
// Fidelidade absoluta a pages/Reports.jsx (610 linhas).
// ============================================================================

export const ReportsDoc = {
  pageId: 'Reports',
  pagePath: '/Reports',
  module: 'Analytics',
  parentPage: null,

  explainer: {
    oneLiner:
      'Hub central de relatórios e analytics — PageHeader com Select de período (7d/30d/90d/mês) + Botões "Agendar" e "Exportar PDF", 4 Tabs (Vendas/Financeiro/Performance/Disputas) cada uma com KPIs específicos e charts (BarChart vendas por dia, PieChart métodos pagamento, LineChart fluxo financeiro, breakdown motivos de recusa, taxa por hora 24h), grid de 4 categorias com 15 relatórios disponíveis, Dialog de agendamento de envio recorrente.',

    fourTabsConcept: {
      sales: '4 KPIs (GMV/Transações/Ticket Médio/Taxa Aprovação) + BarChart Vendas por Dia + PieChart Métodos',
      financial: '4 KPIs (Vendas Líquidas/Taxas MDR/Estornos/Taxa Média) + LineChart Fluxo 30 dias',
      performance: 'Breakdown Motivos de Recusa (5 razões mock) + BarChart Taxa Aprovação por Hora (24h)',
      disputes: '4 KPIs (Total/Em Aberto/Taxa Vitória/Valor em Risco)',
    },

    fourReportCategories: {
      sales: { icon: 'TrendingUp emerald', count: 4, reports: ['Resumo de Vendas', 'Vendas por Dia', 'Vendas por Hora', 'Vendas por Canal'] },
      financial: { icon: 'DollarSign blue', count: 4, reports: ['Resumo Financeiro', 'Relatório de Taxas', 'Agenda de Recebíveis', 'Relatório de Saques'] },
      performance: { icon: 'BarChart3 purple', count: 4, reports: ['Taxa de Aprovação', 'Análise de Recusas', 'Conversão de Checkout', 'Conversão de Pix'] },
      disputes: { icon: 'ShieldAlert red', count: 3, reports: ['Resumo de Disputas', 'Chargebacks por Motivo', 'Relatório de Compliance'] },
    },

    fivePaletteColors: ['#00D26A emerald', '#3B82F6 blue', '#F59E0B amber', '#EF4444 red', '#8B5CF6 purple'],

    scheduleDialog: {
      frequency: 'Select [Diário/Semanal/Mensal]',
      time: 'Input type="time" default 09:00',
      recipients: 'Input separados por vírgula',
      format: 'Select [PDF/Excel/CSV]',
    },
  },

  technical: {
    fileLocation: 'pages/Reports.jsx',
    totalLines: 610,

    imports: {
      react: ['useState'],
      reactQuery: ['useQuery'],
      base44: 'base44.entities.Transaction.list("-created_date", 500) + Dispute.list("-created_date", 100)',
      uiComponents: ['Button', 'Badge', 'Tabs stack', 'Card stack', 'Input', 'Label', 'Select stack', 'Dialog stack', 'Checkbox (sem uso)'],
      utilities: ['cn', 'sonner toast', 'date-fns format/subDays/startOfMonth/endOfMonth', 'ptBR'],
      lucideIcons: 'FileText, Download, Calendar, TrendingUp, DollarSign, CreditCard, ShieldAlert, BarChart3, PieChart (sem uso), Clock, Mail, Plus (sem uso), Filter (sem uso), RefreshCw (sem uso)',
      recharts: 'LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend',
      sharedComponents: ['PageHeader', 'DataTable (importado sem uso)'],
      constants: { COLORS: "['#00D26A', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']", reportCategories: '4 objetos com 15 relatórios' },
    },

    componentState: {
      dateRange: { initial: "'30d'", purpose: 'Period filter (gap: NÃO filtra dados)' },
      isScheduleOpen: { initial: 'false' },
      scheduleConfig: { initial: '{ frequency: daily, time: 09:00, recipients: "", format: pdf }' },
    },

    derivedCalculations: {
      approvedTxns: 'transactions.filter(t => t.status === "approved")',
      totalGMV: 'reduce sum amount',
      totalFees: 'reduce sum fee_amount',
      avgTicket: 'totalGMV / approvedTxns.length (zero protection)',
      approvalRate: '(approvedTxns/transactions * 100).toFixed(1)',
      salesByDay: '30 dias derivados via subDays + filter por toDateString — gap timezone',
      paymentMethods: '[{Cartão: cardTxns sum}, {Pix: pixTxns sum}] — gap: filter por t.type mas Transaction usa t.method',
      declineReasons: 'Array hardcoded 5 razões 35/25/20/12/8%',
      disputes: 'openDisputes (received/in_analysis/in_contestation), wonDisputes, lostDisputes, disputeWinRate',
    },

    helperFunctions: {
      handleExport: '(format) => toast.success(`Exportando em ${format.toUpperCase()}...`) — gap: NÃO exporta',
      handleSchedule: '() => toast + close — gap: não persiste',
    },

    layout: {
      pageHeader: {
        title: '"Relatórios"',
        subtitle: '"Analytics e relatórios detalhados"',
        breadcrumbs: [{ label: 'Analytics', page: 'Analytics' }, { label: 'Relatórios', page: 'Reports' }],
        actions: 'Period Select w-36 + Button outline "Agendar" + Button bg-#00D26A "Exportar"',
      },

      tabSales: {
        kpis: [
          'GMV Total (DollarSign emerald)',
          'Transações (CreditCard blue)',
          'Ticket Médio (TrendingUp purple)',
          'Taxa Aprovação (BarChart3 emerald — value emerald-600)',
        ],
        charts: [
          'BarChart Vendas por Dia: data salesByDay, fill=#00D26A radius=[4,4,0,0]',
          'PieChart Métodos: innerRadius=60 outerRadius=80 paddingAngle=5 + COLORS por index',
        ],
      },

      tabFinancial: {
        kpis: [
          'Vendas Líquidas (totalGMV - totalFees emerald-600)',
          'Taxas MDR (totalFees gray-900)',
          'Estornos (R$ 0 hardcoded red-600)',
          'Taxa Média ((fees/gmv*100).toFixed(2)% gray-900)',
        ],
        chart: 'LineChart Fluxo 30 dias: stroke=#00D26A strokeWidth=2 dot=false',
      },

      tabPerformance: {
        declineReasonsCard: 'space-y-3 — para cada item: name + count(%) + Progress bg-red-500 width=%',
        approvalByHourCard: 'BarChart 24h — data Math.random*20+75 (regenera a cada render — gap), fill=#3B82F6, yAxis=[0,100]',
      },

      tabDisputes: {
        kpis: ['Total Disputas (gray-900)', 'Em Aberto (yellow-600)', 'Taxa Vitória (emerald-600)', 'Valor em Risco (red-600)'],
      },

      availableReportsSection: {
        title: '"Todos os Relatórios"',
        grid: 'grid grid-cols-1 md:grid-cols-2 gap-4',
        cardHeader: 'icon color-coded por category (emerald/blue/purple/red bg-100 + text-600)',
        renderEachReport: 'button w-full + report.name + description + Download icon → toast.info("Abrindo: ${name}") (gap: não abre)',
      },

      scheduleDialog: {
        renderIf: 'isScheduleOpen',
        size: 'max-w-md',
        title: '"Agendar Envio de Relatório"',
        body: 'Frequency Select + Time Input + Recipients Input + Format Select',
        footer: 'outline Cancelar + bg-#00D26A "Mail + Agendar" → handleSchedule (toast only)',
      },
    },

    knownGaps: [
      'DataTable, Checkbox, Plus, Filter, RefreshCw, PieChart (lucide) importados sem uso',
      'Period Select NÃO filtra dados — todos queries trazem máximo fixo',
      'handleExport e handleSchedule apenas toast — não exportam/persistem',
      'declineReasons hardcoded — não vem de dados reais',
      'Taxa Aprovação por Hora usa Math.random — chart muda a cada render',
      'KPI Estornos sempre R$ 0,00 hardcoded',
      'Botões clicáveis dos relatórios disparam apenas toast.info',
      'salesByDay usa toDateString — possíveis timezone issues',
      'cardTxns/pixTxns: filter por t.type mas Transaction usa t.method (credit_card/debit_card/pix) — possível mismatch',
      'Sem comparação YoY, sem variação % nos KPIs',
      'Sem skeleton loading durante useQuery',
      'Botão "Exportar" só PDF mas dialog tem Excel/CSV',
      'Sem filtro avançado por subaccount/plano/canal',
    ],

    relationshipsToOtherPages: {
      customDashboards: '/CustomDashboards — irmão do módulo Analytics',
      transactions: '/Transactions — fonte de Vendas',
      financialOverview: '/FinancialOverview — espelho da tab Financeiro',
      declineAnalysis: '/DeclineAnalysis — drill-down dos motivos',
      chargebacks: '/Chargebacks — fonte da tab Disputas',
      adminIntReports: '/AdminIntReports — visão admin interno',
    },
  },
};

export default ReportsDoc;