import { createPageDoc } from '../../../schema';

export const FinancialOverviewDoc = createPageDoc({
  pageId: 'FinancialOverview',
  pageName: 'Financeiro — Visão Geral',
  route: '/FinancialOverview',
  module: 'Admin Sub — Portal do Merchant',
  section: 'Financeiro',

  purpose:
    'Tela inicial do módulo Financeiro. Apresenta o panorama financeiro do merchant: saldos atuais, agenda de recebíveis, fluxo de caixa projetado, fees pagos e antecipações disponíveis. É o "cockpit financeiro" para o financeiro/CFO do lojista entender liquidez e tomar decisões.',

  userContext:
    'Financeiro/contabilidade do lojista. Quer responder perguntas como: quanto vou receber este mês? quanto já recebi? qual minha taxa real consolidada? vale antecipar? tenho saldo para sacar? Acessa diariamente para reconciliação e semanalmente para planejamento.',

  structure: [
    {
      type: 'header',
      name: 'Cabeçalho',
      description: 'Título "Financeiro" + subtítulo + ações.',
      items: [
        { name: 'Título', description: '"Visão Geral Financeira" em H1.' },
        { name: 'Subtítulo', description: '"Saldos, recebíveis e fluxo de caixa".' },
        { name: 'Seletor de Período', description: 'Dropdown padrão (Hoje, Semana, Mês, Custom).' },
        { name: 'Botão "Sacar"', description: 'Primary verde grande. Leva para /Withdrawals.' },
      ],
    },
    {
      type: 'section',
      name: 'BalanceSummaryCards',
      description: 'Linha de 4 cards principais com saldos atuais.',
      items: [
        {
          type: 'card',
          name: 'Card "Saldo Disponível"',
          description: 'Verde. Valor grande + ícone Wallet + botão pequeno "Sacar". Inclui tooltip "Pronto para saque".',
        },
        {
          type: 'card',
          name: 'Card "A Receber" (Pending)',
          description:
            'Azul. Valor + tooltip "Receberá em D+30 (cartão) ou D+1 (PIX)". Mostra também breakdown por método.',
        },
        {
          type: 'card',
          name: 'Card "Bloqueado" (Rolling Reserve)',
          description: 'Amarelo. Valor + tooltip explicando garantias e rolling reserve.',
        },
        {
          type: 'card',
          name: 'Card "Antecipável"',
          description: 'Roxo. Valor + botão "Antecipar agora" pequeno. Quanto pode ser antecipado.',
        },
      ],
    },
    {
      type: 'section',
      name: 'Fluxo de Caixa Projetado',
      description: 'Gráfico de área grande mostrando projeção dos próximos 90 dias.',
      items: [
        'Eixo X: dias dos próximos 90 dias',
        'Eixo Y: valores em R$',
        'Área verde: entradas projetadas (recebíveis a vencer)',
        'Área vermelha: saídas projetadas (saques agendados, taxas, etc.)',
        'Linha azul: saldo acumulado projetado',
        'Tooltip mostra valores exatos por dia',
      ],
    },
    {
      type: 'section',
      name: 'ReceivablesCalendar',
      description: 'Calendário mensal mostrando recebíveis dia a dia.',
      items: [
        'Header de mês com navegação (anterior/próximo)',
        'Grid 7 colunas (dias da semana)',
        'Cada célula mostra: dia + total a receber naquele dia (formato compacto)',
        'Cores indicam volume: cinza claro=baixo, verde médio, verde escuro=alto',
        'Hover mostra mini lista de recebíveis daquele dia',
        'Click expande lista detalhada lateral',
      ],
    },
    {
      type: 'section',
      name: 'Métricas de Performance Financeira',
      description: 'Grid de 4 cards menores.',
      items: [
        { type: 'card', name: 'Taxa Média Real (MDR%)', description: 'Calculado: total_fees / total_volume. Mostra meta para comparação.' },
        { type: 'card', name: 'Tempo Médio de Liquidação', description: 'Em dias. Útil para planejamento.' },
        { type: 'card', name: 'Total Antecipado no Mês', description: 'Soma das antecipações realizadas.' },
        { type: 'card', name: 'Saques Realizados (mês)', description: 'Count + valor total.' },
      ],
    },
    {
      type: 'section',
      name: 'Acessos Rápidos do Módulo Financeiro',
      description: 'Linha de 6 cards-link grandes para sub-páginas.',
      items: [
        'Card "Extrato Financeiro" → /FinancialStatement',
        'Card "Agenda de Recebíveis" → /ReceivablesAgenda',
        'Card "Antecipação" → /Anticipation',
        'Card "Taxas" → /Fees',
        'Card "Análise de Taxas" → /FeesAnalysis',
        'Card "Gestão de Split" → /SplitManagement',
      ],
    },
    {
      type: 'section',
      name: 'Últimas Movimentações Financeiras',
      description: 'Tabela compacta com últimos 10 lançamentos do extrato.',
      items: [
        'Coluna Data',
        'Coluna Tipo (badge: crédito verde / débito vermelho)',
        'Coluna Categoria (sale, refund, fee, withdrawal, etc.)',
        'Coluna Descrição',
        'Coluna Valor',
        'Coluna Saldo após',
        'Botão "Ver Extrato Completo" → /FinancialStatement',
      ],
    },
  ],

  actions: [
    { name: 'Sacar saldo', flow: 'Botão "Sacar" → /Withdrawals com saldo pré-preenchido.' },
    { name: 'Antecipar recebíveis', flow: 'Botão "Antecipar agora" no card → /Anticipation.' },
    { name: 'Ver extrato', flow: 'Botão "Ver Extrato Completo" → /FinancialStatement.' },
    { name: 'Trocar período', flow: 'Dropdown período → recalcula todos os números.' },
    { name: 'Drill-down em dia', flow: 'Click numa célula do calendário → painel lateral abre com lista detalhada de recebíveis daquele dia.' },
    { name: 'Drill-down em movimentação', flow: 'Click numa linha da tabela → /TransactionDetail relacionado.' },
  ],

  states: [
    { name: 'Loading', description: 'Skeletons em todos os cards e gráficos.' },
    { name: 'Sem movimentações', description: 'Empty state explicando "Comece a transacionar para ver seu fluxo financeiro" + CTA para Payment Links.' },
    { name: 'Operação ativa', description: 'Todos os números preenchidos.' },
    { name: 'Saldo bloqueado total', description: 'Banner amarelo no topo "Sua conta tem saldos bloqueados" + link para entender motivo.' },
  ],

  navigation: [
    { to: '/Withdrawals', via: 'Botão "Sacar" do header / cards' },
    { to: '/Anticipation', via: 'Card "Antecipável" / botão / link' },
    { to: '/FinancialStatement', via: 'Card "Extrato" / link "Ver Extrato Completo"' },
    { to: '/ReceivablesAgenda', via: 'Card "Agenda de Recebíveis"' },
    { to: '/Fees', via: 'Card "Taxas"' },
    { to: '/FeesAnalysis', via: 'Card "Análise de Taxas"' },
    { to: '/SplitManagement', via: 'Card "Gestão de Split"' },
  ],

  dataSources: [
    { entity: 'Subaccount', type: 'Read', description: 'Saldos atuais.', fields: ['balance_available', 'balance_pending_release', 'balance_blocked', 'balance_retained_rr'] },
    { entity: 'Receivable', type: 'List filtrada por janela de 90 dias', description: 'Para calendário e fluxo projetado.' },
    { entity: 'FinancialEntry', type: 'List recente', description: 'Últimas movimentações da tabela.' },
    { entity: 'Transaction', type: 'Aggregate', description: 'Para calcular MDR médio e métricas.' },
  ],

  notes:
    'Tela funciona como hub do módulo Financeiro — usuário entra aqui, vê o panorama, e drill-down nas sub-páginas. Performance crítica: usar cache agressivo. Considerar adicionar exportação geral (PDF executivo do mês) para o financeiro/contadores.',
});

export default FinancialOverviewDoc;