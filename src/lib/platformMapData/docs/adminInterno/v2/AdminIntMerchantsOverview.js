import { createPageDoc } from '../../../schema';

export const AdminIntMerchantsOverviewDoc = createPageDoc({
  pageId: 'AdminIntMerchantsOverview',
  pageName: 'Admin Interno — Gestão Comerciantes & Subcontas',
  route: '/AdminIntMerchantsOverview',
  module: 'Admin Interno',
  section: 'Comerciantes',

  purpose:
    'Hub central da gestão de merchants e subcontas. Lista todos os merchants cadastrados com status, métricas operacionais (GMV, churn risk, compliance status) e ferramentas de gestão em massa (suspender, ativar, ajustar limites, atribuir grupo). É a tela onde o time de operações trabalha o dia inteiro.',

  userContext:
    'Funcionário de operações/comercial/risco PagSmile precisando: encontrar um merchant específico, monitorar saúde de sub-contas, executar ações em lote (ex: aplicar nova taxa para grupo de merchants), priorizar atendimento aos top 100 ou aos em risco. Tela de uso intensivo (SAC, monitoramento, comercial).',

  structure: [
    {
      type: 'header',
      name: 'Cabeçalho',
      description: 'Título + ações principais.',
      items: [
        { name: 'Título', description: '"Comerciantes & Subcontas".' },
        { name: 'Subtítulo', description: '"Gestão completa da base de clientes PagSmile".' },
        { name: 'Botão "Novo Comerciante"', description: 'Primary roxo. Leva para /AdminIntNewMerchant (wizard).' },
        { name: 'Botão "Importar em Lote"', description: 'Outline. Abre modal de upload CSV.' },
        { name: 'Botão "Exportar"', description: 'Outline. Exporta lista filtrada em CSV/Excel.' },
      ],
    },
    {
      type: 'section',
      name: 'MerchantSummary (Cards de KPIs)',
      description: 'Linha de 6 cards com agregações.',
      items: [
        { type: 'card', name: 'Total de Merchants', description: 'Count + variação vs mês anterior.' },
        { type: 'card', name: 'Ativos', description: 'Count com status=active.' },
        { type: 'card', name: 'Em Onboarding', description: 'Count com status pending_compliance/pending_documents/under_review.' },
        { type: 'card', name: 'Suspensos', description: 'Count com status=suspended/blocked.' },
        { type: 'card', name: 'GMV Total (mês)', description: 'Soma de GMV de todos os merchants no mês.' },
        { type: 'card', name: 'Em Risco', description: 'Count com risk_status=high/critical. Cor vermelha.' },
      ],
    },
    {
      type: 'section',
      name: 'MerchantFilters (Painel de Filtros)',
      description: 'Barra horizontal com filtros + painel expansível.',
      items: [
        { type: 'field', name: 'Busca Universal', description: 'Input grande. Busca por nome, CNPJ, email, ID.' },
        {
          type: 'field',
          name: 'Status',
          description: 'Multi-select: Ativo, Pendente Compliance, Pendente Docs, Em Análise, Suspenso, Bloqueado.',
        },
        { type: 'field', name: 'Plano', description: 'Multi-select: Starter, Growth, Pro, Instant, Enterprise, Custom.' },
        { type: 'field', name: 'MCC', description: 'Autocomplete com lista de MCCs.' },
        { type: 'field', name: 'Risk Level', description: 'Multi-select: Low, Medium, High, Critical.' },
        {
          type: 'field',
          name: 'Compliance Status',
          description: 'Multi-select: Compliant, Pending Docs, Under Review, Non-compliant.',
        },
        { type: 'field', name: 'Range de GMV Mensal', description: 'Slider mín/máx em R$.' },
        { type: 'field', name: 'Tags Customizadas', description: 'Multi-select com tags criadas pelo time interno.' },
        { type: 'field', name: 'Grupo Comercial', description: 'Dropdown com grupos pré-definidos.' },
        { name: 'Botão "Aplicar"', description: 'Primary roxo.' },
        { name: 'Botão "Salvar Filtros"', description: 'Outline — salva combinação atual como filtro reutilizável.' },
      ],
    },
    {
      type: 'table',
      name: 'MerchantTable (Tabela Principal)',
      description: 'Tabela densa com seleção múltipla, ordenação por coluna, paginação 50/página.',
      items: [
        { name: 'Coluna Checkbox', description: 'Seleção individual + cabeçalho seleciona tudo da página.' },
        { name: 'Coluna ID', description: 'subaccount_id curto + ícone de copiar.' },
        {
          name: 'Coluna Comerciante',
          description: 'Avatar gerado + business_name em bold + legal_name em cinza menor abaixo.',
        },
        { name: 'Coluna Documento', description: 'CPF/CNPJ formatado.' },
        { name: 'Coluna Status', description: 'Badge colorido (verde/amarelo/vermelho conforme status).' },
        { name: 'Coluna Plano', description: 'Badge com nome do plano + ícone.' },
        { name: 'Coluna Compliance', description: 'Badge + ícone (escudo verde/amarelo/vermelho).' },
        { name: 'Coluna MCC', description: 'Código + descrição curta com tooltip.' },
        { name: 'Coluna GMV (Mês)', description: 'Valor formatado em R$. Ordenável.' },
        { name: 'Coluna TPV Lifetime', description: 'Total transacionado desde o início.' },
        { name: 'Coluna Saldo Disponível', description: 'Valor que pode ser sacado.' },
        { name: 'Coluna Risk Level', description: 'Indicador visual colorido.' },
        { name: 'Coluna CB Ratio', description: 'Taxa de chargeback. Vermelho se > 0.9%.' },
        { name: 'Coluna Última Atividade', description: 'Data formatada relativa.' },
        { name: 'Coluna Tags', description: 'Chips de tags (até 3 visíveis).' },
        {
          name: 'Coluna Ações',
          description:
            'Menu 3 pontos: Ver Perfil 360º, Editar Limites, Editar Taxas, Suspender, Bloquear, Adicionar Tag, Adicionar Nota, Atribuir Grupo, Resetar Senha, Excluir.',
        },
      ],
    },
    {
      type: 'section',
      name: 'MerchantBulkActions (Barra de Ações em Massa)',
      description: 'Barra fixa no rodapé que aparece quando >= 1 merchant selecionado.',
      items: [
        'Contador "X comerciantes selecionados"',
        'Botão "Aplicar Tag em massa"',
        'Botão "Mudar Plano em massa"',
        'Botão "Aplicar Taxa em massa"',
        'Botão "Adicionar a Grupo"',
        'Botão "Suspender em massa" (com confirmação dupla)',
        'Botão "Exportar Selecionados"',
        'Botão "Cancelar Seleção"',
      ],
    },
    {
      type: 'section',
      name: 'MerchantPagination',
      description: 'Rodapé com paginação clássica + seletor de itens por página (25/50/100/200).',
    },
  ],

  actions: [
    { name: 'Buscar merchant', flow: 'Digita na busca universal → resultados em tempo real (debounce).' },
    { name: 'Aplicar filtros avançados', flow: 'Expande painel → preenche → Aplicar → tabela e cards de KPI atualizam.' },
    { name: 'Salvar filtro frequente', flow: 'Após configurar filtros → "Salvar Filtros" → nome do filtro → fica disponível em dropdown rápido.' },
    {
      name: 'Ver perfil 360º do merchant',
      flow: 'Click no nome ou em "Ver Perfil" → /AdminIntMerchantProfile/:id (tela com 20+ tabs).',
    },
    {
      name: 'Suspender merchant individual',
      flow: 'Menu 3 dots → "Suspender" → modal pede motivo (textarea obrigatória) → confirma → status muda → notificação para o merchant.',
    },
    {
      name: 'Ação em massa (bulk)',
      flow:
        'Marca checkboxes → barra inferior aparece → escolhe ação → modal de confirmação → executa em background com progresso visual → toast de conclusão.',
    },
    {
      name: 'Criar novo merchant',
      flow: 'Botão "Novo Comerciante" → /AdminIntNewMerchant (wizard interno simplificado, sem KYC obrigatório).',
    },
    {
      name: 'Importar lista CSV',
      flow:
        'Botão "Importar em Lote" → modal de upload → preview das colunas → mapeamento de campos → validação → confirma → cria todos em background.',
    },
  ],

  states: [
    { name: 'Loading', description: 'Skeleton da tabela e cards.' },
    {
      name: 'Operação ativa',
      description: 'Cards com números agregados + tabela com merchants paginados.',
    },
    { name: 'Vazio com filtros', description: 'Mensagem "Nenhum merchant encontrado para os filtros aplicados" + botão "Limpar Filtros".' },
    { name: 'Seleção ativa', description: 'Linhas selecionadas com fundo roxo claro + barra de ações em massa fixa no rodapé.' },
  ],

  navigation: [
    { to: '/AdminIntMerchantProfile/:id', via: 'Click em nome de merchant ou ação "Ver Perfil"' },
    { to: '/AdminIntNewMerchant', via: 'Botão "Novo Comerciante"' },
    { to: '/AdminIntSubaccountFullDetail/:id', via: 'Drill-down em subconta específica' },
    { to: '/AdminIntMerchantGroups', via: 'Filtro "Grupo Comercial" / ação "Atribuir Grupo"' },
    { to: '/AdminIntMerchantTags', via: 'Gerenciar tags disponíveis' },
  ],

  dataSources: [
    {
      entity: 'Subaccount',
      type: 'List paginada com filtros server-side',
      description: 'Fonte principal.',
      fields:
        'TODOS os campos da entity (business_name, document, status, selected_plan, compliance_status, mcc, ai_compliance_score, total_volume, balance_available, risk_status, risk_score, etc.)',
    },
    { entity: 'Transaction', type: 'Aggregate por subaccount_id', description: 'Para colunas de GMV mensal e CB ratio.' },
    { entity: 'AuditLog', type: 'Para "última atividade"', description: 'Última ação registrada na conta.' },
  ],

  notes:
    'Tela com performance crítica: usuários fazem operações o dia todo aqui. Filtros server-side obrigatórios. Cache curto (30s). Ações em massa devem ser idempotentes e ter rollback. Considerar adicionar atalhos de teclado (J/K para navegar, X para selecionar, etc.) para power users.',
});

export default AdminIntMerchantsOverviewDoc;