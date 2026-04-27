import { createPageDoc } from '../../../schema';

export const AdminIntDashboardDoc = createPageDoc({
  pageId: 'AdminIntDashboard',
  pageName: 'Admin Interno — Dashboard',
  route: '/AdminIntDashboard',
  module: 'Admin Interno',
  section: 'Dashboard',

  purpose:
    'Tela inicial do back-office da PagSmile (uso interno). Mostra a SAÚDE GLOBAL DA OPERAÇÃO da empresa: GMV total agregado de todos os merchants, P&L da PagSmile, alertas críticos, performance técnica do gateway, comparativo de custos por adquirente e métricas de risco. Tem múltiplas "lentes" (executiva, operacional, financeira, comercial, técnica, risco) selecionáveis.',

  userContext:
    'Funcionário interno PagSmile — pode ser C-Level (lente Executiva), gerente operacional (Operacional), CFO/Financeiro (P&L, custos), comercial (pipeline de novos clientes), eng/tech (uptime, latência), risco/compliance (fraude, chargebacks). Cada perfil tem uma lente padrão pré-selecionada.',

  structure: [
    {
      type: 'header',
      name: 'Cabeçalho do Dashboard',
      description: 'Topo com identidade visual roxa do Admin Interno + controles globais.',
      items: [
        { name: 'Título', description: '"Admin Interno — Visão Global" em H1.' },
        { name: 'Subtítulo dinâmico', description: 'Texto cinza variando conforme lente ativa.' },
        {
          name: 'Seletor de Lente (Tabs ou Dropdown)',
          description: 'Permite trocar entre 7+ visões diferentes do mesmo dashboard.',
        },
        { name: 'Seletor de Período', description: 'Hoje, Ontem, 7d, 30d, 90d, Custom.' },
        { name: 'Botão "Exportar Relatório"', description: 'Outline. Gera PDF executivo da lente atual.' },
        {
          name: 'Botão "PagSmile Copilot"',
          description:
            'Outline com ícone Sparkles roxo. Abre painel lateral com agente de IA interno (PagSmile Copilot) para análises ad-hoc.',
        },
      ],
    },
    {
      type: 'tabs',
      name: 'Sistema de Lentes (8 visões)',
      description: 'Navegação principal — cada aba é um sub-componente diferente.',
      items: [
        {
          type: 'tab',
          name: 'Aba "Executiva" (default para C-Level)',
          description:
            'KPIs C-Level: GMV total, take rate, margem, número de merchants ativos, churn, NPS estimado. Gráficos comparativos mês-a-mês e ano-a-ano.',
        },
        {
          type: 'tab',
          name: 'Aba "P&L"',
          description:
            'Demonstração financeira da PagSmile. Receita por categoria (MDR, taxa fixa, antecipação, etc.) menos custos diretos (interchange, scheme, etc.) = margem bruta. Tendências, drill-down por adquirente.',
        },
        {
          type: 'tab',
          name: 'Aba "Operacional"',
          description:
            'Métricas operacionais: filas de compliance, KYC pendentes, disputas em análise, MEDs abertos, suporte tickets, blocagens ativas.',
        },
        {
          type: 'tab',
          name: 'Aba "Financeira"',
          description:
            'Visão financeira interna: float total da operação, saldos a liquidar, antecipações concedidas, saques agendados, conciliação pendente, exposição a chargebacks.',
        },
        {
          type: 'tab',
          name: 'Aba "Cartão"',
          description:
            'Performance específica de cartão: aprovação por bandeira/adquirente/BIN, tempo médio de autorização, recusas técnicas vs comerciais, distribuição por parcelas.',
        },
        {
          type: 'tab',
          name: 'Aba "PIX"',
          description: 'Performance PIX: volume in/out, latência, falhas, distribuição por PSP, fraudes específicas.',
        },
        {
          type: 'tab',
          name: 'Aba "Boleto" (futuro)',
          description: 'Volume de boletos emitidos, taxa de pagamento, idade média até pagamento.',
        },
        {
          type: 'tab',
          name: 'Aba "Risco"',
          description: 'Vista da equipe de risco: chargeback ratio global, top 10 merchants com problema, alertas, fraudes detectadas, scores médios.',
        },
        {
          type: 'tab',
          name: 'Aba "Técnica"',
          description: 'Uptime do gateway, latência p50/p95/p99, taxa de erro 5xx, throughput de transações por segundo, status de integrações com adquirentes.',
        },
        {
          type: 'tab',
          name: 'Aba "Alertas"',
          description: 'Hub central de alertas críticos: anomalias detectadas pela IA, thresholds estourados, merchants em risco iminente.',
        },
      ],
    },
    {
      type: 'section',
      name: 'Lente Executiva (default)',
      description: 'Conteúdo da aba Executiva.',
      items: [
        {
          type: 'section',
          name: 'KPI Cards Principais',
          description: 'Grid de 6 cards.',
          items: [
            'GMV Total (mês) + variação vs mês anterior',
            'Receita PagSmile (take rate × GMV) + margem',
            'Número de Merchants Ativos + variação',
            'Churn Rate (mês)',
            'Taxa de Aprovação Global',
            'Disputas Abertas (count)',
          ],
        },
        {
          type: 'section',
          name: 'Gráfico GMV Histórico',
          description: 'Linha com últimos 12 meses + projeção próximo mês.',
        },
        {
          type: 'section',
          name: 'Top 10 Merchants por GMV',
          description: 'Tabela compacta com nome, GMV, take rate, status.',
        },
        {
          type: 'section',
          name: 'Mapa de Brasil (volume por estado)',
          description: 'Heatmap geográfico mostrando concentração de transações.',
        },
      ],
    },
    {
      type: 'card',
      name: 'PagSmile Copilot Inline',
      description:
        'Card destacado roxo no rodapé com chamada à ação. Mostra última análise do agente + botão "Pergunte ao Copilot...".',
    },
  ],

  actions: [
    { name: 'Trocar lente', flow: 'Click numa aba → conteúdo troca instantaneamente. Lente preferida é salva por usuário.' },
    { name: 'Trocar período', flow: 'Dropdown → recalcula KPIs e gráficos.' },
    { name: 'Drill-down em merchant', flow: 'Click no nome de merchant na lista → /AdminIntMerchantProfile/:id (visão 360º).' },
    { name: 'Acionar PagSmile Copilot', flow: 'Botão no header ou card inline → abre painel lateral com chat de IA contextual.' },
    { name: 'Exportar relatório', flow: 'Botão exportar → modal pergunta lente + período → gera PDF executivo com gráficos e KPIs.' },
    { name: 'Investigar alerta', flow: 'Click num alerta → leva para tela de origem (ex: chargeback abriu, vai para /AdminIntChargebacksList).' },
  ],

  states: [
    { name: 'Loading', description: 'Skeletons.' },
    { name: 'Operação saudável', description: 'KPIs em verde, sem alertas críticos.' },
    {
      name: 'Anomalia detectada',
      description: 'Banner vermelho/laranja no topo com descrição do problema (ex: "Aprovação caiu 15% nas últimas 6h") + botão "Investigar".',
    },
    { name: 'Manutenção programada', description: 'Banner azul informativo se há janela de manutenção.' },
  ],

  navigation: [
    { to: '/AdminIntMerchantProfile/:id', via: 'Click em merchant na lista' },
    { to: '/AdminIntChargebacksList', via: 'Card de disputas / alerta' },
    { to: '/AdminIntComplianceQueue', via: 'Aba Operacional → "Fila de Compliance"' },
    { to: '/AdminIntFinancialDashboard', via: 'Aba Financeira → drill-down' },
    { to: '/AdminIntPagSmileCopilot', via: 'Card Copilot ou botão header' },
  ],

  dataSources: [
    { entity: 'Subaccount', type: 'Aggregate', description: 'Para contagem de merchants ativos, distribuição.' },
    { entity: 'Transaction', type: 'Aggregate global (sem filtro de merchant)', description: 'Para GMV global, taxas, métricas técnicas.' },
    { entity: 'Dispute', type: 'Aggregate', description: 'Para chargeback ratio global e contagem.' },
    { entity: 'FinancialEntry', type: 'Aggregate', description: 'Para P&L interno.' },
    { entity: 'AiAgentLog', type: 'List recente', description: 'Para mostrar últimas análises do PagSmile Copilot.' },
  ],

  notes:
    'É a tela mais "rica" e densa do sistema inteiro. Performance é crítica — usar agregações pré-calculadas no backend, NUNCA agregar live. Considerar adicionar customização total: usuário pode arrastar e soltar widgets para montar sua própria lente. Cores roxas (#A855F7 família) são identidade visual exclusiva do Admin Interno e não devem aparecer em Admin Sub.',
});

export default AdminIntDashboardDoc;