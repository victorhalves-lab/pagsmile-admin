import { createPageDoc } from '../../../schema';

export const DashboardDoc = createPageDoc({
  pageId: 'Dashboard',
  pageName: 'Dashboard Executivo',
  route: '/Dashboard',
  module: 'Admin Sub — Portal do Merchant',
  section: 'Dashboard',

  purpose:
    'Tela inicial do Portal do Merchant após o login. Apresenta uma visão executiva consolidada do negócio do lojista — volume de vendas (GMV), métricas de performance (taxa de aprovação, ticket médio), saldo disponível, gráficos comparativos e acessos rápidos. É o "cockpit" diário do merchant para entender saúde da operação.',

  userContext:
    'Merchant logado (dono/gestor da empresa que usa a PagSmile). Acessa diariamente para acompanhar números do dia/semana/mês. Pode ser o financeiro buscando saldo, o operacional analisando taxa de aprovação, ou o gestor verificando comparativo mês-a-mês. Personalizável por perfil de usuário (ações rápidas customizáveis).',

  structure: [
    {
      type: 'header',
      name: 'Cabeçalho da Página',
      description: 'Topo fixo com título, subtítulo e controles globais de período/customização.',
      items: [
        {
          name: 'Título "Dashboard Executivo"',
          description: 'Texto bold tamanho grande, alinhado à esquerda.',
        },
        {
          name: 'Subtítulo descritivo',
          description: 'Texto cinza menor explicando que é a visão geral do negócio.',
        },
        {
          type: 'field',
          name: 'Seletor de Período (dropdown)',
          description:
            'Dropdown com ícone de calendário. Opções: Hoje, Ontem, Últimos 7 dias (padrão), Este Mês, Mês Passado, Últimos 90 dias.',
        },
        {
          name: 'Botão "Personalizar"',
          description: 'Botão outline com ícone de engrenagem. Abre modal de customização do dashboard (futuro).',
        },
      ],
    },
    {
      type: 'section',
      name: 'Quick Actions Personalizáveis',
      description:
        'Linha horizontal de atalhos rápidos para tarefas comuns do merchant. Customizável — o usuário escolhe quais ações aparecem.',
      items: [
        'Atalhos típicos: "Criar Link de Pagamento", "Ver Saques", "Conciliação", "Disputas Abertas"',
        'Cada atalho é um card pequeno com ícone colorido + label',
        'Botão "+" no final permite adicionar nova ação',
      ],
    },
    {
      type: 'section',
      name: 'GMV Cards (Volume Total Movimentado)',
      description: 'Grid de 6 cards principais comparando volume em diferentes janelas de tempo.',
      items: [
        {
          type: 'card',
          name: 'Card "Hoje"',
          description: 'GMV do dia + variação % vs ontem (verde se subiu, vermelho se caiu) + breakdown Cartão/PIX.',
        },
        {
          type: 'card',
          name: 'Card "Ontem"',
          description: 'GMV de ontem para comparação direta.',
        },
        {
          type: 'card',
          name: 'Card "Últimos 7 dias"',
          description: 'Total acumulado da semana + variação vs semana anterior.',
        },
        {
          type: 'card',
          name: 'Card "Mês Atual"',
          description:
            'GMV mês-a-data + barra de progresso (% do mês decorrido) + projeção do total mensal baseado em ritmo atual.',
        },
        {
          type: 'card',
          name: 'Card "Mês Passado"',
          description: 'GMV total do mês anterior fechado para comparação.',
        },
      ],
    },
    {
      type: 'section',
      name: 'Transaction Metrics Cards',
      description:
        'Linha de cards menores mostrando métricas de quantidade de transações: total, aprovadas, recusadas, em processamento.',
      items: [
        'Card "Total de Transações" — número grande + ícone',
        'Card "Aprovadas" — quantidade + % do total + cor verde',
        'Card "Recusadas" — quantidade + % + cor vermelha',
        'Card "Em Processamento" — quantidade + ícone de loading',
      ],
    },
    {
      type: 'section',
      name: 'Performance Indicators',
      description:
        'Indicadores chave de performance (KPIs): Taxa de Aprovação, Ticket Médio, Taxa de Chargeback, Tempo Médio de Liquidação.',
      items: [
        'Cada KPI é um card com: valor grande + meta (target) + indicador de tendência (seta up/down)',
        'Cores baseadas em performance vs meta: verde acima, vermelho abaixo',
      ],
    },
    {
      type: 'card',
      name: 'Balance Card (Saldo Detalhado)',
      description:
        'Card largo (full-width) com 3 saldos lado a lado: Disponível para Saque (grande, destaque), Pendente de Liberação, Bloqueado.',
      items: [
        'Saldo Disponível: número grande em verde + botão "Sacar Agora"',
        'Saldo Pendente: número médio + tooltip explicando D+30',
        'Saldo Bloqueado: número médio + tooltip explicando motivo (rolling reserve, garantias)',
      ],
    },
    {
      type: 'card',
      name: 'Volume Chart (Gráfico de Vendas)',
      description:
        'Gráfico de linhas/barras grande comparando Volume Cartão vs PIX ao longo do tempo. Possui seletor de período próprio (sobrescreve o global).',
      items: [
        'Linha verde para PIX, linha azul para Cartão',
        'Eixo X: dias/semanas/meses dependendo do período',
        'Eixo Y: valores em R$ formatados',
        'Tooltip ao passar o mouse mostra valores exatos',
      ],
    },
    {
      type: 'tabs',
      name: 'Tabs de Visões Detalhadas',
      description: 'Sistema de abas para navegar entre 4 visões diferentes do dashboard.',
      items: [
        {
          type: 'tab',
          name: 'Aba "Executiva" (default)',
          description: 'Visão geral para C-Level. Inclui métricas de conversão, gráfico de métodos de pagamento (pizza), gráfico de aprovação por bandeira (barras com meta) e métricas comparativas mês a mês.',
        },
        {
          type: 'tab',
          name: 'Aba "Performance Cartão"',
          description: 'Análise específica de transações de cartão: taxa de aprovação por bandeira, análise de recusas, performance por adquirente.',
        },
        {
          type: 'tab',
          name: 'Aba "Performance PIX"',
          description:
            'Análise específica de PIX: cards de fluxo PIX-In/PIX-Out (entradas vs saídas), métricas PIX, heatmaps de volume e aprovação por hora/dia.',
        },
        {
          type: 'tab',
          name: 'Aba "Analytics Avançado"',
          description: 'Visão exploratória: heatmap geográfico/temporal + análise profunda de recusas.',
        },
      ],
    },
    {
      type: 'section',
      name: 'Rodapé com Recent Transactions + Alerts',
      description: 'Layout em 2 colunas (3 colunas no grid, recent ocupa 2).',
      items: [
        {
          type: 'card',
          name: 'Card "Transações Recentes" (col-span 2)',
          description: 'Lista das últimas transações com ID, valor, status, data. Clicar leva para Transaction Detail.',
        },
        {
          type: 'card',
          name: 'Card "Alertas" (col-span 1)',
          description:
            'Painel lateral com alertas relevantes: chargebacks novos, transações suspeitas, vencimento de documentos, pré-chargebacks.',
        },
      ],
    },
  ],

  actions: [
    {
      name: 'Trocar período de análise',
      flow: 'Clica no dropdown de período no header → escolhe nova janela → todos os números/gráficos da página recalculam.',
    },
    {
      name: 'Personalizar dashboard',
      flow: 'Clica no botão "Personalizar" → abre modal de configuração → escolhe quais cards/seções aparecem → salva preferências no perfil.',
    },
    {
      name: 'Sacar saldo disponível',
      flow: 'Clica no botão "Sacar Agora" no Balance Card → leva para /Withdrawals com saldo pré-preenchido.',
    },
    {
      name: 'Drill-down em transações',
      flow: 'Clica em qualquer linha de Transações Recentes → abre /TransactionDetail com detalhes completos.',
    },
    {
      name: 'Trocar visão (tabs)',
      flow: 'Clica em uma das 4 abas → conteúdo da seção troca instantaneamente sem reload.',
    },
    {
      name: 'Exportar/exportar gráfico',
      flow: 'Cada ChartCard tem ação de exportar (3 dots) → permite baixar como PNG ou CSV.',
    },
  ],

  states: [
    {
      name: 'Loading inicial',
      description: 'Skeletons cinzas em todos os cards enquanto carregam transações e disputas.',
    },
    {
      name: 'Sem transações ainda',
      description:
        'Cards mostram zeros e gráficos mostram placeholder "Sem dados ainda — comece a transacionar para ver suas métricas". Pode aparecer call-to-action para criar primeiro link de pagamento.',
    },
    {
      name: 'Estado normal (operação ativa)',
      description: 'Todos os números preenchidos, gráficos com dados reais, alertas relevantes na coluna lateral.',
    },
    {
      name: 'Compliance pendente',
      description:
        'Banner amarelo no topo (controlado pelo Layout) avisando "Complete seu Compliance!" com botão direto para o fluxo. Aparece se a Subaccount do usuário tem status pending_compliance.',
    },
  ],

  navigation: [
    { to: '/Withdrawals', via: 'Botão "Sacar Agora" no Balance Card' },
    { to: '/TransactionDetail/:id', via: 'Click em transação na lista de Recent Transactions' },
    { to: '/Transactions', via: 'Link "Ver Todas" no card de Recent Transactions' },
    { to: '/ComplianceOnboardingStart', via: 'Banner de compliance pendente (quando aplicável)' },
    { to: 'Variável', via: 'Quick Actions customizáveis levam para diferentes telas' },
  ],

  dataSources: [
    {
      entity: 'Transaction',
      type: 'List (limit 200, ordenado por created_date desc)',
      description: 'Base para todos os cálculos de GMV, taxa de aprovação, ticket médio, métricas de cartão/PIX.',
      fields: ['amount', 'status', 'method', 'created_date', 'card', 'pix'],
    },
    {
      entity: 'Dispute',
      type: 'Filter por status="open"',
      description: 'Usado para popular o painel de alertas com chargebacks abertos.',
      fields: ['status', 'amount', 'transaction_id', 'reason_description'],
    },
    {
      entity: 'Subaccount',
      type: 'Read (current user)',
      description: 'Usado para calcular saldos disponível/pendente/bloqueado e checar status de compliance.',
      fields: ['balance_available', 'balance_pending_release', 'balance_blocked', 'status'],
    },
    {
      entity: 'UserPreferences',
      type: 'Read/Update',
      description: 'Salva customizações do dashboard (Quick Actions ativas, ordem dos cards).',
    },
  ],

  notes:
    'É a tela mais visitada do Portal do Merchant. Performance é crítica — usar React Query com cache agressivo. Os números mostrados nos GMV Cards são parcialmente mockados no MVP (multiplicações sobre o GMV real); em produção, virão de agregações pré-calculadas no backend. O sistema de tabs deve preservar a aba ativa durante a sessão.',
});

export default DashboardDoc;