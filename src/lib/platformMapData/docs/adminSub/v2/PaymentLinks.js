import { createPageDoc } from '../../../schema';

export const PaymentLinksDoc = createPageDoc({
  pageId: 'PaymentLinks',
  pageName: 'Links de Pagamento',
  route: '/PaymentLinks',
  module: 'Admin Sub — Portal do Merchant',
  section: 'Links de Pagamento',

  purpose:
    'Lista e gerenciamento de todos os links de pagamento que o merchant criou. Links de pagamento são URLs públicas customizadas que o lojista compartilha com clientes (WhatsApp, redes sociais, e-mail) para receber pagamentos sem precisar de site/app próprio. Esta tela é o ponto central para criar, editar, monitorar performance e desativar links.',

  userContext:
    'Merchant que vende sem site próprio ou que usa links como complemento. Tipicamente: infoprodutores, prestadores de serviço, lojinhas de Instagram, vendas pontuais. Acessa diariamente para criar novos links de produtos/serviços e para monitorar quais estão convertendo.',

  structure: [
    {
      type: 'header',
      name: 'Cabeçalho da Página',
      description: 'Título + ações principais.',
      items: [
        { name: 'Título "Links de Pagamento"', description: 'H1 com badge de contagem total.' },
        { name: 'Subtítulo', description: 'Texto cinza: "Crie e gerencie links de cobrança"' },
        {
          name: 'Botão "Criar Link"',
          description: 'Primary verde grande com ícone +. Leva para /PaymentLinkCreate (wizard).',
        },
        {
          name: 'Botão "Vitrine de Links"',
          description:
            'Outline. Leva para gerenciar páginas vitrine (PaymentLinkShowcase) que agrupam vários links em uma loja virtual simples.',
        },
      ],
    },
    {
      type: 'section',
      name: 'Cards de Resumo',
      description: 'Linha de 4 cards com KPIs agregados de todos os links.',
      items: [
        { type: 'card', name: 'Total de Links Ativos', description: 'Count de links com status="active".' },
        { type: 'card', name: 'Total Arrecadado', description: 'Soma de total_collected de todos os links (formatado em R$).' },
        { type: 'card', name: 'Total de Visualizações', description: 'Soma de views_count.' },
        { type: 'card', name: 'Taxa de Conversão Média', description: 'Média ponderada de conversion_rate. Cor verde se acima de 3%, amarela se entre 1-3%, vermelha abaixo.' },
      ],
    },
    {
      type: 'section',
      name: 'Filtros e Busca',
      description: 'Barra horizontal com controles para filtrar a lista.',
      items: [
        { type: 'field', name: 'Campo de busca', description: 'Input com ícone de lupa. Busca por nome, descrição ou slug.' },
        {
          type: 'field',
          name: 'Filtro por Status',
          description: 'Dropdown: Todos, Rascunho, Ativo, Inativo, Expirado, Esgotado.',
        },
        {
          type: 'field',
          name: 'Filtro por Tipo',
          description: 'Dropdown: Todos, Valor Fixo, Aberto, Mínimo (referente a value_type).',
        },
        {
          type: 'field',
          name: 'Ordenação',
          description: 'Dropdown: Mais Recentes, Mais Antigos, Maior Receita, Mais Vendas.',
        },
        {
          name: 'Toggle de visualização',
          description: 'Botões "Grid" e "Lista" para alternar layout (default: Grid).',
        },
      ],
    },
    {
      type: 'section',
      name: 'Grid de Links (visualização padrão)',
      description: 'Grid responsivo de cards (3 colunas em desktop, 2 em tablet, 1 em mobile).',
      items: [
        {
          type: 'card',
          name: 'Card de Link Individual',
          description: 'Card compacto com preview visual do link.',
          items: [
            'Imagem principal (main_image_url) ocupando topo do card. Fallback: gradient com inicial do nome.',
            'Badge de status no canto superior direito (verde=ativo, cinza=rascunho, amarelo=expirado, vermelho=esgotado).',
            'Nome do link (h3 bold)',
            'Valor (formatado em R$, ou "Valor aberto" se value_type=open)',
            'Métricas inline: ícone de olho + views_count, ícone de carrinho + usage_count, %  de conversão',
            'Botão "Copiar link" com ícone',
            'Menu de 3 pontos: Editar, Visualizar Página, Estatísticas, Duplicar, Desativar, Excluir',
          ],
        },
      ],
    },
    {
      type: 'section',
      name: 'Lista de Links (visualização alternativa)',
      description: 'Tabela densa para quem prefere ver mais links de uma vez.',
      items: [
        'Coluna Imagem (thumbnail pequeno)',
        'Coluna Nome + Slug',
        'Coluna Valor',
        'Coluna Status (badge)',
        'Coluna Visualizações',
        'Coluna Vendas',
        'Coluna Total Arrecadado',
        'Coluna Conversão %',
        'Coluna Ações (3 dots)',
      ],
    },
    {
      type: 'section',
      name: 'Estado vazio (primeiro acesso)',
      description: 'Quando merchant nunca criou link nenhum.',
      items: [
        'Ilustração grande de um link estilizado',
        'Título "Crie seu primeiro link de pagamento"',
        'Texto explicativo curto sobre o que são links',
        'Lista de 3 vantagens com ícones (sem precisar de site, compartilhável, configurável)',
        'CTA grande "Criar Meu Primeiro Link" → /PaymentLinkCreate',
        'Link secundário "Ver tutorial" (opcional)',
      ],
    },
  ],

  actions: [
    {
      name: 'Criar novo link',
      flow:
        'Clica "Criar Link" → navega para /PaymentLinkCreate (wizard multi-step) → ao finalizar, volta para esta tela com novo link no topo.',
      outcome: 'Novo registro PaymentLink criado com status="draft" inicialmente.',
    },
    {
      name: 'Editar link existente',
      flow: 'Menu 3 pontos no card → "Editar" → leva para /PaymentLinkCreate?id=<link_id> em modo edição.',
    },
    {
      name: 'Copiar URL do link',
      flow:
        'Clica botão "Copiar link" → URL é copiada para clipboard → toast verde "Link copiado!" aparece por 2s.',
    },
    {
      name: 'Visualizar página pública',
      flow: 'Menu 3 pontos → "Visualizar Página" → abre nova aba com URL pública do link (preview do checkout).',
    },
    {
      name: 'Ver estatísticas detalhadas',
      flow:
        'Menu 3 pontos → "Estatísticas" → abre drawer lateral com gráficos: views vs conversões ao longo do tempo, dispositivos usados, origem (UTM), ticket médio.',
    },
    {
      name: 'Duplicar link',
      flow: 'Menu 3 pontos → "Duplicar" → modal de confirmação → cria cópia idêntica com nome "[Original] - Cópia" em status="draft".',
    },
    {
      name: 'Desativar link',
      flow:
        'Menu 3 pontos → "Desativar" → modal de confirmação ("Tem certeza? O link parará de aceitar pagamentos") → muda status para "inactive". Não pode ser revertido para clientes que já têm a URL salva.',
    },
    {
      name: 'Excluir link',
      flow:
        'Menu 3 pontos → "Excluir" → modal vermelho de confirmação dupla (digite "EXCLUIR" para confirmar) → remove permanentemente. Histórico de transações relacionadas é preservado.',
    },
    {
      name: 'Trocar visualização',
      flow: 'Clica botões "Grid" / "Lista" no header → muda layout instantaneamente. Preferência salva localmente.',
    },
  ],

  states: [
    {
      name: 'Loading',
      description: 'Skeleton de cards/linhas enquanto carrega.',
    },
    {
      name: 'Vazio (primeiro uso)',
      description: 'Estado especial educativo com ilustração e CTA destacado.',
    },
    {
      name: 'Vazio com filtros',
      description: 'Mensagem "Nenhum link encontrado para os filtros aplicados" + botão "Limpar".',
    },
    {
      name: 'Operação normal',
      description: 'Grid/lista populada com cards de links + cards de resumo no topo.',
    },
    {
      name: 'Link expirado',
      description:
        'Card mostrado em opacidade reduzida com badge amarelo "Expirado". Clicando aparece modal sugerindo "Renovar" (mudar expiration_date).',
    },
    {
      name: 'Link esgotado',
      description: 'Card com badge vermelho "Esgotado" quando usage_count atingiu usage_limit_count ou stock=0.',
    },
  ],

  navigation: [
    { to: '/PaymentLinkCreate', via: 'Botão "Criar Link" / menu "Editar"' },
    { to: '/PaymentLinkShowcaseList (futuro)', via: 'Botão "Vitrine de Links"' },
    { to: 'EXTERNO: <slug>.pagsmile.com', via: 'Ação "Visualizar Página" do menu 3 pontos' },
    { to: 'Mesma página com drawer aberto', via: 'Ação "Estatísticas"' },
  ],

  dataSources: [
    {
      entity: 'PaymentLink',
      type: 'List ordenada por created_date desc, paginada',
      description: 'Fonte principal da lista.',
      fields: [
        'name',
        'description',
        'main_image_url',
        'value_type',
        'amount',
        'status',
        'url',
        'slug',
        'views_count',
        'usage_count',
        'total_collected',
        'conversion_rate',
        'expiration_date',
        'usage_limit_count',
        'stock',
      ],
    },
  ],

  notes:
    'O grid layout deve ter aspect ratio consistente nas imagens (object-cover). Cards devem ter hover state com leve elevação. Considerar adicionar drag-and-drop para reordenar links manualmente em fase futura. A tela é uma das mais usadas — tracking de uso aqui é crítico para entender adoção.',
});

export default PaymentLinksDoc;