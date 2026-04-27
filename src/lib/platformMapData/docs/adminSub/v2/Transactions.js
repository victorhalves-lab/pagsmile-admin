import { createPageDoc } from '../../../schema';

export const TransactionsDoc = createPageDoc({
  pageId: 'Transactions',
  pageName: 'Transações',
  route: '/Transactions',
  module: 'Admin Sub — Portal do Merchant',
  section: 'Transações',

  purpose:
    'Hub central de todas as transações do merchant. Permite navegar entre visões diferenciadas por método (cartão/PIX), analisar recusas e acessar o agente IA de recuperação de pagamentos. É o ponto de entrada para investigar qualquer transação individual ou em grupo.',

  userContext:
    'Merchant operacional ou financeiro precisando: investigar uma venda específica, conferir recebimentos, entender por que transações foram recusadas, ou ativar tentativas de recuperação automática. Também usado para auditoria e reconciliação manual.',

  structure: [
    {
      type: 'header',
      name: 'Cabeçalho da Página',
      description: 'Topo com título, breadcrumb e botão de exportação.',
      items: [
        { name: 'Título "Transações"', description: 'H1 bold.' },
        { name: 'Breadcrumb', description: 'Home > Transações' },
        { name: 'Botão "Exportar"', description: 'Outline com ícone Download. Exporta dados da aba ativa em CSV/Excel.' },
      ],
    },
    {
      type: 'tabs',
      name: 'Sistema de Abas',
      description: 'Navegação principal — 5 abas, cada uma renderiza um sub-componente diferente.',
      items: [
        {
          type: 'tab',
          name: 'Aba "Todas" (default)',
          description:
            'Visão consolidada de todas as transações independente do método. Usa o componente AllTransactionsView (filtros avançados, tabela paginada, ações em massa).',
        },
        {
          type: 'tab',
          name: 'Aba "Cartão"',
          description: 'Apenas transações de cartão. Inclui filtros específicos por bandeira, parcelas, e métricas de aprovação por bandeira.',
        },
        {
          type: 'tab',
          name: 'Aba "PIX"',
          description:
            'Apenas transações PIX. Inclui filtros por tipo (in/out), status do QR Code e métricas específicas (tempo de pagamento, expiração).',
        },
        {
          type: 'tab',
          name: 'Aba "Análise de Recusas"',
          description:
            'Ícone de alerta. Tela analítica com agrupamentos das principais causas de recusas (motivo, bandeira, BIN), gráficos e recomendações de ações para reduzir recusas.',
        },
        {
          type: 'tab',
          name: 'Aba "Recovery Agent"',
          description:
            'Ícone Sparkles + Badge "AI" verde. Aba especial que mostra o painel do agente de IA de recuperação: campanhas ativas, taxa de recuperação, valor recuperado.',
        },
      ],
    },
    {
      type: 'section',
      name: 'Conteúdo da aba "Todas" (AllTransactionsView)',
      description: 'Componente principal com 4 partes: cards de resumo, filtros, tabela e ações em massa.',
      items: [
        {
          type: 'card',
          name: 'Cards de Resumo (TransactionSummaryCards)',
          description:
            'Linha de 4 cards mostrando: Total de Transações, Volume Total, Ticket Médio, Taxa de Aprovação — calculados sobre o resultado filtrado.',
        },
        {
          type: 'section',
          name: 'Painel de Filtros Avançados',
          description: 'Barra de filtros expansível com múltiplos critérios.',
          items: [
            'Filtro por período (de/até com calendário)',
            'Filtro por status (multi-select: aprovada, recusada, pendente, estornada, etc.)',
            'Filtro por método (cartão/PIX/boleto)',
            'Filtro por valor (range mín/máx)',
            'Filtro por cliente (busca por nome/email/CPF)',
            'Filtro por ID de transação',
            'Botões "Aplicar" e "Limpar"',
          ],
        },
        {
          type: 'table',
          name: 'Tabela de Transações',
          description: 'Tabela densa, paginada (50/página), com seleção múltipla.',
          items: [
            'Coluna ID (com cópia ao clicar)',
            'Coluna Data/Hora',
            'Coluna Cliente (nome + documento mascarado)',
            'Coluna Método (ícone Cartão/PIX + bandeira)',
            'Coluna Valor (formatado em R$)',
            'Coluna Status (badge colorido)',
            'Coluna Ações (3 dots: ver detalhe, estornar, baixar comprovante)',
          ],
        },
        {
          type: 'section',
          name: 'Ações em Massa',
          description: 'Aparece quando >= 1 transação está selecionada. Barra fixa no rodapé.',
          items: [
            'Mostra contador "X transações selecionadas"',
            'Botão "Estornar selecionadas"',
            'Botão "Exportar selecionadas"',
            'Botão "Ações em lote" (modal com mais opções)',
          ],
        },
      ],
    },
    {
      type: 'section',
      name: 'Conteúdo da aba "Cartão" (CardTransactionsView)',
      description: 'Mesma estrutura da aba Todas, mas com:',
      items: [
        'Filtro adicional por Bandeira (Visa, Mastercard, Elo, Amex, Hipercard)',
        'Filtro adicional por Parcelas (1x, 2-6x, 7-12x)',
        'Filtro adicional por Adquirente',
        'Card extra mostrando "Aprovação por Bandeira" (mini gráfico)',
      ],
    },
    {
      type: 'section',
      name: 'Conteúdo da aba "PIX" (PixTransactionsView)',
      description: 'Mesma estrutura da aba Todas, mas com:',
      items: [
        'Toggle "PIX-In / PIX-Out / Todos"',
        'Filtro por status de QR Code (ativo, pago, expirado)',
        'Card extra mostrando "Tempo médio até pagamento"',
        'Coluna adicional na tabela: "End-to-End ID" (E2EID)',
      ],
    },
    {
      type: 'section',
      name: 'Conteúdo da aba "Análise de Recusas" (DeclineAnalysisView)',
      description: 'Visão analítica focada em entender por que recusas acontecem.',
      items: [
        'Card "Top 10 Motivos de Recusa" — lista ordenada com volume e %',
        'Gráfico de Barras "Recusas por Bandeira"',
        'Heatmap "Recusas por BIN" (top 50 BINs problemáticos)',
        'Painel "Recomendações de Ação" — sugestões automáticas (ex: ativar 3DS, ajustar antifraude)',
        'Tabela detalhada paginada com filtros por motivo',
      ],
    },
    {
      type: 'section',
      name: 'Conteúdo da aba "Recovery Agent" (PaymentRecoveryAgentView)',
      description: 'Painel do agente de IA que tenta recuperar transações recusadas/perdidas.',
      items: [
        'Hero com avatar do agente + descrição do que ele faz',
        'Cards de métricas: "Tentativas no mês", "Recuperadas", "Valor recuperado", "Taxa de sucesso"',
        'Tabela de campanhas ativas (transações em recuperação ativa)',
        'Botão "Configurar Agente" (leva para /RecoveryAgent — settings)',
        'Botão "Ver Histórico Completo"',
      ],
    },
  ],

  actions: [
    {
      name: 'Filtrar transações',
      flow: 'Abre painel de filtros → escolhe critérios → clica Aplicar → tabela e cards de resumo recalculam.',
    },
    {
      name: 'Investigar transação individual',
      flow: 'Clica numa linha da tabela ou no menu de 3 pontos → "Ver Detalhe" → navega para /TransactionDetail com ID na URL.',
    },
    {
      name: 'Estornar transação',
      flow:
        'Menu 3 pontos → "Estornar" → modal pede confirmação e valor (total ou parcial) → confirmar → chama API de estorno → atualiza status na tabela.',
    },
    {
      name: 'Exportar resultados',
      flow:
        'Clica botão "Exportar" no header → modal pergunta formato (CSV/Excel) e período → gera arquivo no servidor → download.',
    },
    {
      name: 'Ação em massa',
      flow:
        'Marca checkboxes na tabela → barra inferior aparece → escolhe ação (estornar, exportar) → confirma → executa para todas selecionadas.',
    },
    {
      name: 'Ativar Recovery Agent',
      flow: 'Vai para aba Recovery Agent → clica "Configurar Agente" → leva para tela de settings com toggle de ativação e regras.',
    },
  ],

  states: [
    {
      name: 'Loading inicial',
      description: 'Skeleton na tabela e cards. Spinner discreto no header de cada aba.',
    },
    {
      name: 'Vazio (sem transações)',
      description:
        'EmptyState ilustrado com texto "Nenhuma transação ainda" + CTA "Criar Link de Pagamento" ou "Configurar Checkout".',
    },
    {
      name: 'Vazio com filtro',
      description: 'Mostra mensagem "Nenhum resultado para os filtros aplicados" + botão "Limpar Filtros".',
    },
    {
      name: 'Estado normal',
      description: 'Tabela populada, cards com números, filtros aplicáveis.',
    },
    {
      name: 'Erro de carregamento',
      description: 'Card vermelho com mensagem de erro e botão "Tentar Novamente".',
    },
  ],

  navigation: [
    { to: '/TransactionDetail/:id', via: 'Click em linha da tabela ou ação "Ver Detalhe"' },
    { to: '/CardTransactions', via: 'Aba Cartão (rota dedicada também existe)' },
    { to: '/PixTransactions', via: 'Aba PIX (rota dedicada também existe)' },
    { to: '/DeclineAnalysis', via: 'Aba Análise de Recusas (rota dedicada também existe)' },
    { to: '/RecoveryAgent', via: 'Botão "Configurar Agente" na aba Recovery Agent' },
  ],

  dataSources: [
    {
      entity: 'Transaction',
      type: 'List/Filter paginado',
      description: 'Fonte principal. Filtros aplicados via query params.',
      fields: 'Todos os campos da entity',
    },
    {
      entity: 'Customer',
      type: 'Read (lookup por documento)',
      description: 'Para enriquecer linhas com nome/email do cliente.',
    },
  ],

  notes:
    'Cada aba tem rota dedicada também (/CardTransactions, /PixTransactions, etc.) que mostra apenas o conteúdo da aba sem o wrapper de tabs — usado quando o merchant clica em links diretos do menu lateral. A página principal /Transactions com tabs é o hub recomendado. Performance: usar paginação no servidor com lazy load.',
});

export default TransactionsDoc;