import { createPageDoc } from '../../../schema';

export const AdminIntComplianceQueueDoc = createPageDoc({
  pageId: 'AdminIntComplianceQueue',
  pageName: 'Admin Interno — Fila de Compliance',
  route: '/AdminIntComplianceQueue',
  module: 'Admin Interno',
  section: 'Compliance',

  purpose:
    'Fila de trabalho da equipe de Compliance. Lista todas as submissões de KYC/KYB pendentes de análise manual, ordenadas por SLA, com indicação visual de prioridade (alto valor, alto risco), score da IA Helena e botões de ação rápida (aprovar, recusar, pedir mais documentos). É o "kanban diário" do compliance officer.',

  userContext:
    'Compliance officer interno PagSmile responsável por aprovar/recusar abertura de contas. Tem fila diária de 20-100 submissões para analisar. Usa filtros para priorizar (deadlines, alto valor, alto risco), abre cada submissão para análise detalhada, e bate metas de SLA (responder em até X horas).',

  structure: [
    {
      type: 'header',
      name: 'Cabeçalho',
      description: 'Topo com KPIs da fila + ações.',
      items: [
        { name: 'Título', description: '"Fila de Compliance".' },
        { name: 'Subtítulo dinâmico', description: 'Mostra "X submissões pendentes / Y dentro do SLA / Z em atraso".' },
        { name: 'Botão "Atualizar"', description: 'Ícone Refresh. Recarrega fila do servidor.' },
        { name: 'Botão "Filtros Salvos"', description: 'Dropdown com filtros pré-configurados (Meus, Alta Prioridade, Vencendo Hoje, etc.).' },
        { name: 'Botão "Helena IA"', description: 'Roxo. Abre painel lateral com agente Helena para sugestões/dúvidas.' },
      ],
    },
    {
      type: 'section',
      name: 'Cards de SLA',
      description: 'Linha de 4 cards com semáforo do SLA.',
      items: [
        { type: 'card', name: 'No SLA (verde)', description: 'Count de submissões dentro do prazo confortável.' },
        { type: 'card', name: 'Atenção (amarelo)', description: 'Count das que vencem em < 4h.' },
        { type: 'card', name: 'Crítico (laranja)', description: 'Count das que vencem em < 1h.' },
        { type: 'card', name: 'Em Atraso (vermelho)', description: 'Count das que ESTOURARAM o SLA.' },
      ],
    },
    {
      type: 'section',
      name: 'Filtros + Ordenação',
      description: 'Barra horizontal compacta.',
      items: [
        { type: 'field', name: 'Atribuída a', description: 'Multi-select: Eu, Não atribuída, Outros analistas.' },
        { type: 'field', name: 'Tipo', description: 'PIX-only / KYC Completo.' },
        { type: 'field', name: 'Score Helena', description: 'Slider de score 0-100. Útil para focar nos casos limítrofes.' },
        { type: 'field', name: 'Recomendação Helena', description: 'Multi-select: Aprovar, Revisar, Recusar.' },
        { type: 'field', name: 'MCC', description: 'Autocomplete.' },
        { type: 'field', name: 'Volume Estimado', description: 'Range de TPV mensal estimado.' },
        { type: 'field', name: 'Estado', description: 'UF do CNPJ.' },
        {
          type: 'field',
          name: 'Ordenação',
          description: 'Dropdown: Por SLA (default), Mais recente, Maior volume estimado, Maior score Helena.',
        },
      ],
    },
    {
      type: 'table',
      name: 'Tabela da Fila',
      description: 'Lista priorizada com indicadores visuais ricos.',
      items: [
        {
          name: 'Coluna Prioridade',
          description: 'Badge colorido pequeno: 🔴 atrasada, 🟠 crítica, 🟡 atenção, 🟢 ok.',
        },
        { name: 'Coluna SLA Restante', description: 'Countdown com horas:minutos. Cor muda conforme proximidade.' },
        {
          name: 'Coluna Comerciante',
          description: 'business_name + CNPJ + ícone PF/PJ.',
        },
        { name: 'Coluna Tipo', description: 'Badge: KYC PIX-only ou KYC Completo.' },
        { name: 'Coluna Score Helena', description: 'Gauge ou número grande com cor (verde >70, amarelo 40-70, vermelho <40).' },
        { name: 'Coluna Recomendação IA', description: 'Badge: Aprovar / Revisar / Recusar.' },
        { name: 'Coluna Red Flags', description: 'Ícone alert + contagem de flags. Hover mostra lista.' },
        { name: 'Coluna Volume Estimado (mensal)', description: 'R$ formatado.' },
        { name: 'Coluna MCC', description: 'Código + tooltip descrição.' },
        { name: 'Coluna Atribuída a', description: 'Avatar do analista ou "—" se não atribuída.' },
        { name: 'Coluna Submetido em', description: 'Data + hora.' },
        {
          name: 'Coluna Ações Rápidas',
          description:
            'Botão "Analisar" → /AdminIntComplianceReview/:id. Menu 3 dots: Atribuir a mim, Atribuir a outro, Pedir documentos, Aprovar (atalho), Recusar (atalho).',
        },
      ],
    },
    {
      type: 'section',
      name: 'Barra de Ações em Massa',
      description: 'Aparece com submissões selecionadas.',
      items: [
        'Botão "Atribuir em massa"',
        'Botão "Pedir documentos em massa" (template padrão)',
        'Botão "Aprovar selecionadas" (apenas se Helena recomendou aprovar TODAS)',
      ],
    },
  ],

  actions: [
    {
      name: 'Atribuir submissão a si',
      flow:
        'Menu 3 dots → "Atribuir a mim" → submissão fica reservada para o usuário, marcada na coluna "Atribuída a".',
    },
    {
      name: 'Analisar submissão (fluxo principal)',
      flow:
        'Click "Analisar" → leva para /AdminIntComplianceReview/:id (tela detalhada com TODOS os dados, documentos, justificativa Helena, ações).',
    },
    {
      name: 'Aprovar atalho (sem entrar)',
      flow:
        'Menu 3 dots → "Aprovar (atalho)" → modal de confirmação rápida com motivo opcional → aprova diretamente. Disponível apenas se Helena recomendou aprovar.',
    },
    {
      name: 'Pedir documentos adicionais',
      flow:
        'Menu 3 dots → "Pedir documentos" → modal com checkbox de docs faltantes (inferidos pela Helena) + textarea de mensagem → envia email automático ao merchant.',
    },
    {
      name: 'Consultar Helena',
      flow: 'Botão "Helena IA" → painel lateral abre com chat → analyst pergunta caso → Helena retorna análise/sugestão.',
    },
    {
      name: 'Filtrar para minha fila',
      flow: 'Filtros Salvos → "Minhas Submissões" → mostra apenas atribuídas ao usuário logado.',
    },
  ],

  states: [
    { name: 'Loading', description: 'Skeleton da tabela.' },
    { name: 'Fila vazia', description: 'Mensagem "Sem submissões pendentes 🎉" — celebração rara.' },
    { name: 'Fila normal', description: 'Tabela populada com priorização visual.' },
    {
      name: 'Crisis mode (>20 atrasadas)',
      description: 'Banner vermelho gigante "ATENÇÃO: Fila em situação crítica" + sugestão de redistribuir.',
    },
  ],

  navigation: [
    { to: '/AdminIntComplianceReview/:id', via: 'Botão "Analisar"' },
    { to: '/AdminIntComplianceHelena', via: 'Sugestões de treinar a IA' },
    { to: '/AdminIntCompliance', via: 'Voltar ao dashboard de compliance' },
  ],

  dataSources: [
    {
      entity: 'ComplianceSubmission',
      type: 'List paginada filtrada por status=pending',
      description: 'Fonte principal.',
      fields:
        'submission_id, subaccount_id, type, ai_score, ai_recommendation, ai_red_flags, sla_deadline, assigned_to, submitted_at, mcc, estimated_volume',
    },
    { entity: 'Subaccount', type: 'Lookup por subaccount_id', description: 'Para enriquecer com business_name e dados básicos.' },
    { entity: 'UserProfile', type: 'Lookup por assigned_to', description: 'Para mostrar avatar do analista responsável.' },
  ],

  notes:
    'Tela de uso intensivo (analista passa 6+ horas/dia aqui). Performance e ergonomia são críticas. Considerar atalhos de teclado: A=atribuir a mim, S=analisar, R=recusar atalho. Som notification ao chegar nova submissão urgente. SLA tracking deve ser real-time (websocket ou polling 30s).',
});

export default AdminIntComplianceQueueDoc;