import { createPageDoc } from '../../../schema';

export const CustomersDoc = createPageDoc({
  pageId: 'Customers',
  pageName: 'Clientes',
  route: '/Customers',
  module: 'Admin Sub — Portal do Merchant',
  section: 'Clientes',

  purpose:
    'CRM básico do merchant. Lista todos os clientes que já transacionaram (extraídos automaticamente das transações), com segmentação automática (novo, recorrente, VIP, em risco, inativo), métricas individuais (total gasto, ticket médio, frequência) e ferramentas de exportação. Clicar em um cliente leva para o perfil 360º.',

  userContext:
    'Merchant fazendo análise de base, ações de marketing, ou suporte. Tipicamente: gestor querendo identificar VIPs para campanhas, financeiro reconciliando pagamentos por cliente, ou suporte buscando histórico de um comprador específico.',

  structure: [
    {
      type: 'header',
      name: 'Cabeçalho da Página',
      description: 'Título + ações.',
      items: [
        { name: 'Título "Clientes"', description: 'H1 + contagem total entre parênteses.' },
        { name: 'Subtítulo', description: '"Sua base de clientes consolidada"' },
        {
          name: 'Botão "Exportar CSV"',
          description: 'Outline. Exporta clientes filtrados em CSV com todas as colunas.',
        },
        {
          name: 'Botão "Importar Clientes"',
          description: 'Outline. Abre modal para upload de planilha (futuro).',
        },
      ],
    },
    {
      type: 'section',
      name: 'Cards de Segmentação',
      description: 'Linha de cards clicáveis que filtram a lista por segmento.',
      items: [
        {
          type: 'card',
          name: 'Card "Total"',
          description: 'Número grande de clientes únicos. Cor azul.',
        },
        {
          type: 'card',
          name: 'Card "Novos" (segment="new")',
          description: 'Clientes da última 30 dias com 1 compra. Cor cinza.',
        },
        {
          type: 'card',
          name: 'Card "Recorrentes" (segment="recurring")',
          description: 'Mais de 1 compra. Cor azul claro.',
        },
        {
          type: 'card',
          name: 'Card "VIPs" (segment="vip")',
          description: 'Clientes com total_spent acima do top 5% da base. Cor dourada/amarela com ícone estrela.',
        },
        {
          type: 'card',
          name: 'Card "Em Risco" (segment="at_risk")',
          description:
            'Clientes recorrentes que não compram há 60+ dias. Cor laranja. Tooltip explica critério.',
        },
        {
          type: 'card',
          name: 'Card "Inativos" (segment="inactive")',
          description: 'Sem compras há 180+ dias. Cor cinza escuro.',
        },
      ],
    },
    {
      type: 'section',
      name: 'Filtros e Busca',
      description: 'Barra horizontal com controles refinados.',
      items: [
        {
          type: 'field',
          name: 'Busca livre',
          description: 'Input grande com lupa. Procura em nome, email, CPF/CNPJ ou telefone.',
        },
        {
          type: 'field',
          name: 'Filtro por Tipo de Documento',
          description: 'Dropdown: Todos, Pessoa Física (CPF), Pessoa Jurídica (CNPJ).',
        },
        {
          type: 'field',
          name: 'Filtro por Método Preferido',
          description: 'Dropdown: Todos, Cartão, PIX.',
        },
        {
          type: 'field',
          name: 'Filtro por Tags',
          description: 'Multi-select chip de tags customizadas que o merchant criou.',
        },
        {
          type: 'field',
          name: 'Range de Total Gasto',
          description: 'Slider duplo mín/máx com formato R$.',
        },
        {
          name: 'Botão "Limpar Filtros"',
          description: 'Ghost. Reseta todos os filtros para padrão.',
        },
      ],
    },
    {
      type: 'table',
      name: 'Tabela de Clientes',
      description: 'Tabela densa, paginada (50/página), com seleção múltipla.',
      items: [
        {
          name: 'Coluna Cliente',
          description: 'Avatar (gerado da inicial) + nome em bold + email cinza menor abaixo.',
        },
        {
          name: 'Coluna Documento',
          description: 'CPF/CNPJ formatado com máscara, mascarado parcialmente (ex: 123.***.789-**).',
        },
        {
          name: 'Coluna Segmento',
          description: 'Badge colorido com nome do segmento (cores conforme cards de cima).',
        },
        {
          name: 'Coluna Total de Compras',
          description: 'Número de purchases.',
        },
        {
          name: 'Coluna Total Gasto',
          description: 'Valor formatado em R$, em bold.',
        },
        {
          name: 'Coluna Ticket Médio',
          description: 'Valor calculado = total_spent / total_purchases.',
        },
        {
          name: 'Coluna Última Compra',
          description: 'Data formatada relativa (ex: "Há 3 dias", "Ontem").',
        },
        {
          name: 'Coluna Método Preferido',
          description: 'Ícone (Cartão ou PIX) + label.',
        },
        {
          name: 'Coluna Risco',
          description:
            'Indicador visual baseado em risk_score, chargebacks_count e refunds_count. Pode ser ícone de escudo verde/amarelo/vermelho.',
        },
        {
          name: 'Coluna Tags',
          description: 'Chips horizontais das tags do cliente (até 3 visíveis, +N para o resto).',
        },
        {
          name: 'Coluna Ações',
          description: 'Menu 3 pontos: Ver Perfil, Adicionar Tag, Bloquear, Excluir.',
        },
      ],
    },
    {
      type: 'section',
      name: 'Barra de Ações em Massa',
      description: 'Aparece fixa no rodapé quando >= 1 cliente está selecionado.',
      items: [
        'Contador "X clientes selecionados"',
        'Botão "Adicionar Tag" → modal com input de tag',
        'Botão "Exportar CSV" → exporta apenas selecionados',
        'Botão "Bloquear" (com confirmação)',
        'Botão "Cancelar Seleção" (limpa)',
      ],
    },
  ],

  actions: [
    {
      name: 'Filtrar por segmento',
      flow: 'Clica num card de segmento → tabela filtra automaticamente. Card fica destacado com borda colorida.',
    },
    {
      name: 'Buscar cliente específico',
      flow: 'Digita no campo de busca → tabela filtra em tempo real (debounce 300ms).',
    },
    {
      name: 'Ver perfil completo do cliente',
      flow: 'Clica no nome do cliente ou em "Ver Perfil" no menu de ações → navega para /CustomerDetail/:id.',
    },
    {
      name: 'Adicionar tag a clientes',
      flow:
        'Marca checkboxes → barra de ações aparece → clica "Adicionar Tag" → modal pede tag (autocomplete com tags existentes ou criar nova) → confirma → tags aplicadas.',
    },
    {
      name: 'Exportar base completa',
      flow:
        'Clica "Exportar CSV" no header → modal pergunta colunas a incluir e formato → gera arquivo → download automático.',
    },
    {
      name: 'Bloquear cliente',
      flow:
        'Menu 3 pontos → "Bloquear" → modal de confirmação com motivo (textarea) → cliente fica marcado e novas tentativas de compra são recusadas automaticamente. Aparece no Blocklist.',
    },
  ],

  states: [
    {
      name: 'Loading',
      description: 'Skeleton da tabela e cards de segmento.',
    },
    {
      name: 'Sem clientes (operação nova)',
      description:
        'EmptyState com ilustração de pessoas, texto "Sua base de clientes aparecerá aqui assim que receber pagamentos" + CTA "Criar Link de Pagamento".',
    },
    {
      name: 'Vazio com filtros',
      description: 'Mensagem clara "Nenhum cliente encontrado" + botão "Limpar Filtros".',
    },
    {
      name: 'Operação normal',
      description: 'Cards populados, tabela paginada com clientes.',
    },
    {
      name: 'Cliente em risco/bloqueado',
      description: 'Linhas pintadas com fundo amarelinho/vermelhinho conforme segment="at_risk" ou bloqueio.',
    },
  ],

  navigation: [
    { to: '/CustomerDetail/:id', via: 'Click no nome do cliente ou em "Ver Perfil"' },
    { to: '/Blocklist (futuro)', via: 'Após bloquear, link no toast' },
    { to: '/PaymentLinkCreate', via: 'CTA do empty state' },
  ],

  dataSources: [
    {
      entity: 'Customer',
      type: 'List/Filter paginado',
      description: 'Fonte principal — clientes derivados das transações.',
      fields: [
        'name',
        'email',
        'document',
        'document_type',
        'phone',
        'total_purchases',
        'total_spent',
        'average_ticket',
        'first_purchase_date',
        'last_purchase_date',
        'segment',
        'risk_score',
        'chargebacks_count',
        'refunds_count',
        'preferred_payment_method',
        'tags',
      ],
    },
  ],

  notes:
    'Os segmentos são calculados automaticamente pelo backend baseado em padrões de compra e atualizados periodicamente. O merchant não escolhe o segmento manualmente, mas pode adicionar tags customizadas ortogonais. A tela suporta listas grandes (>10k clientes) — paginação obrigatória do servidor. Considerar adicionar drag-and-drop de colunas para reordenar.',
});

export default CustomersDoc;