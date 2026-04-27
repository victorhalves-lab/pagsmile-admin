import { createPageDoc } from '../../../schema';

export const IBExtractDoc = createPageDoc({
  pageId: 'IBExtract',
  pageName: 'Internet Banking — Extrato',
  route: '/IBExtract',
  module: 'Internet Banking',
  section: 'Extrato',

  purpose:
    'Extrato bancário completo do merchant. Lista TODAS as movimentações da conta digital (PIX in/out, taxas, ajustes, reembolsos) com filtros avançados, busca textual, agrupamento por dia e ações de exportação. É a tela de fonte da verdade financeira para reconciliação.',

  userContext:
    'Financeiro/contabilidade do lojista fazendo conciliação bancária ou auditoria. Precisa cruzar com extratos contábeis, identificar movimentações específicas, exportar em formato bancário (OFX, CSV) e baixar comprovantes individuais. Acessa periodicamente (geralmente semanalmente para fechamento).',

  structure: [
    {
      type: 'header',
      name: 'Cabeçalho da Página',
      description: 'Topo da tela com identidade visual do módulo IB.',
      items: [
        { name: 'Título "Extrato"', description: 'H1 grande.' },
        { name: 'Subtítulo', description: '"Todas as movimentações da sua conta".' },
        { name: 'Botão "Exportar"', description: 'Outline. Dropdown de formatos: PDF, CSV, OFX (formato bancário padrão).' },
        { name: 'Botão "Filtros Avançados"', description: 'Outline com ícone Filter. Toggle do painel de filtros expansível.' },
      ],
    },
    {
      type: 'card',
      name: 'Card Resumo do Período',
      description: 'Card escuro gradient (igual estética IB) com totais.',
      items: [
        'Saldo no início do período (label + valor)',
        'Total de entradas (verde, com ícone seta down)',
        'Total de saídas (vermelho, com ícone seta up)',
        'Saldo no fim do período (destaque, fonte grande)',
        'Indicador de variação (percentual + direção)',
      ],
    },
    {
      type: 'section',
      name: 'Barra de Filtros Rápidos',
      description: 'Linha horizontal com chips clicáveis de período predefinido.',
      items: [
        'Chip "Hoje"',
        'Chip "7 dias" (default)',
        'Chip "30 dias"',
        'Chip "Mês Atual"',
        'Chip "Mês Passado"',
        'Chip "Personalizado" (abre date range picker)',
      ],
    },
    {
      type: 'section',
      name: 'Painel de Filtros Avançados (expansível)',
      description: 'Painel oculto por padrão. Ao expandir, mostra grid de filtros.',
      items: [
        { type: 'field', name: 'Data De/Até', description: 'Date range picker.' },
        { type: 'field', name: 'Tipo', description: 'Multi-select: Crédito, Débito.' },
        {
          type: 'field',
          name: 'Categoria',
          description: 'Multi-select: PIX-In, PIX-Out, Taxa, Ajuste, Reembolso, Antecipação, Saque.',
        },
        { type: 'field', name: 'Faixa de Valor', description: 'Slider mín/máx.' },
        { type: 'field', name: 'Busca Textual', description: 'Input que busca em descrição/destinatário/ID.' },
        { name: 'Botões', description: '"Aplicar" e "Limpar" no rodapé do painel.' },
      ],
    },
    {
      type: 'section',
      name: 'Lista de Movimentações Agrupada por Dia',
      description:
        'Lista vertical com seções por dia (sticky headers) para fácil escaneamento visual. Padrão de extrato bancário tradicional.',
      items: [
        {
          name: 'Header de Dia (sticky)',
          description:
            'Header cinza claro com data formatada longa (ex: "Hoje, 27 de Janeiro de 2026") + saldo do final do dia à direita.',
        },
        {
          type: 'list',
          name: 'Itens do dia',
          description: 'Lista de transações daquele dia.',
          items: [
            {
              name: 'Linha de Movimentação',
              description: 'Layout: avatar circular com ícone (verde=crédito, vermelho=débito) + bloco central (descrição em bold + sub-descrição cinza com nome do contraparte ou categoria + horário) + valor à direita (verde + ou vermelho - + saldo após em pequeno).',
            },
            {
              name: 'Click expande detalhes',
              description: 'Ao clicar, expande inline mostrando: ID da transação, E2EID se PIX, banco contraparte, taxa cobrada (se houver), botões "Ver Comprovante" + "Repetir" + "Compartilhar".',
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      name: 'Paginação / Carregamento Infinito',
      description: 'No rodapé da lista. "Carregando mais..." com spinner ao chegar próximo do fim, ou botão "Carregar mais 50".',
    },
  ],

  actions: [
    { name: 'Trocar período rápido', flow: 'Click num chip → recalcula extrato.' },
    { name: 'Filtrar avançado', flow: 'Toggle painel → preenche → Aplicar → lista atualiza.' },
    { name: 'Buscar textualmente', flow: 'Digita no campo de busca → filtra em tempo real (debounce 300ms).' },
    { name: 'Expandir movimentação', flow: 'Click numa linha → expande inline com detalhes e ações.' },
    {
      name: 'Ver comprovante',
      flow: 'Botão "Ver Comprovante" na linha expandida → abre /IBProofs com filtro pré-aplicado, ou modal direto.',
    },
    { name: 'Repetir movimentação', flow: 'Botão "Repetir" → preenche /IBPixSend com mesmo destinatário e valor.' },
    {
      name: 'Exportar extrato',
      flow:
        'Botão "Exportar" → dropdown formato → modal com opção de período e colunas → gera arquivo → download.',
    },
  ],

  states: [
    { name: 'Loading', description: 'Skeleton da lista e do card de resumo.' },
    { name: 'Sem movimentações', description: 'Empty state ilustrado: "Nenhuma movimentação no período" + sugestão de ampliar filtro.' },
    { name: 'Operação normal', description: 'Lista populada + resumo correto.' },
    {
      name: 'Período muito longo',
      description: 'Se filtro pega > 1 ano, banner amarelo avisa "Considere períodos menores para melhor performance" + sugestão de exportar.',
    },
  ],

  navigation: [
    { to: '/IBProofs', via: 'Botão "Ver Comprovante" / nome da movimentação' },
    { to: '/IBPixSend', via: 'Botão "Repetir" — preenche destinatário e valor' },
    { to: '/IBHome', via: 'Menu lateral / botão Voltar' },
  ],

  dataSources: [
    {
      entity: 'FinancialEntry',
      type: 'List paginada com filtros',
      description: 'Fonte principal — todos os lançamentos contábeis.',
      fields: ['type', 'category', 'amount', 'balance_after', 'description', 'reference_id', 'created_date'],
    },
    {
      entity: 'Transaction',
      type: 'Lookup quando entry tem reference_type=transaction',
      description: 'Para enriquecer com dados de PIX (E2EID, banco contraparte).',
    },
  ],

  notes:
    'O agrupamento por dia é a chave para usabilidade — usuários esperam ver extrato bancário tradicional, não tabela genérica. Performance: paginação obrigatória do servidor; usar virtual scroll se lista > 200 itens. Formato OFX é importante para integração com sistemas contábeis dos lojistas (Sage, Conta Azul, Granatum).',
});

export default IBExtractDoc;