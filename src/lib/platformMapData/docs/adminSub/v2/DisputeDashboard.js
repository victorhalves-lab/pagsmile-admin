import { createPageDoc } from '../../../schema';

export const DisputeDashboardDoc = createPageDoc({
  pageId: 'DisputeDashboard',
  pageName: 'Dashboard de Disputas',
  route: '/DisputeDashboard',
  module: 'Admin Sub — Portal do Merchant',
  section: 'Disputas',

  purpose:
    'Visão central de gestão de disputas (chargebacks e pré-chargebacks). Mostra KPIs críticos (chargeback ratio, pré-CBs evitados, valor protegido), status de compliance com bandeiras (VDMP/VFMP/ECM/EFM), tendências e ações recomendadas pelo agente de IA. É a tela que o time de risco/financeiro usa para monitorar saúde de disputas.',

  userContext:
    'Risk manager ou financeiro do lojista preocupado com chargeback ratio e fraude. Tipicamente um e-commerce maduro que precisa monitorar compliance com bandeiras (Visa/Mastercard) e evitar entrar em programas de monitoramento (VDMP/ECM). Acessa pelo menos semanalmente.',

  structure: [
    {
      type: 'header',
      name: 'Cabeçalho',
      description: 'Título + subtítulo + ações.',
      items: [
        { name: 'Título', description: '"Dashboard de Disputas".' },
        { name: 'Subtítulo', description: '"Monitore chargebacks e ações preventivas".' },
        { name: 'Botão "Configurar Agente"', description: 'Outline com Sparkles. Leva para /DisputeManagerSettings.' },
        { name: 'Botão "Exportar Relatório"', description: 'Outline. Gera relatório PDF executivo.' },
      ],
    },
    {
      type: 'section',
      name: 'DisputeKPICards (cards principais)',
      description: 'Grid de 4 cards principais com métricas críticas.',
      items: [
        {
          type: 'card',
          name: 'Chargeback Ratio',
          description:
            'Valor % grande em destaque. Ícone DisputeRatioGauge (gauge visual mostrando posição relativa às metas das bandeiras). Cor: verde se < 0.9%, amarelo se 0.9-1%, vermelho se >= 1%.',
        },
        {
          type: 'card',
          name: 'Pré-CBs Evitados',
          description: 'Quantidade de pré-chargebacks resolvidos antes de virarem chargeback de fato. Verde.',
        },
        {
          type: 'card',
          name: 'Valor Protegido',
          description: 'Soma de R$ "salva" pelo agente de IA (disputas ganhas + pré-CBs evitados).',
        },
        {
          type: 'card',
          name: 'Win Rate',
          description: '% de disputas contestadas que foram ganhas pelo merchant.',
        },
      ],
    },
    {
      type: 'card',
      name: 'AgentDashboardSummary (Card do Agente IA)',
      description:
        'Card destacado com gradient verde/azul mostrando atividade do agente Dispute Manager. Inclui: avatar do agente, descrição curta, métricas semanais (disputas processadas, ações tomadas automaticamente, recomendações pendentes), botão "Ver Detalhe do Agente".',
    },
    {
      type: 'card',
      name: 'ComplianceOverview (Status com Bandeiras)',
      description:
        'Card crítico mostrando status de compliance da operação com programas de monitoramento das bandeiras.',
      items: [
        {
          type: 'section',
          name: 'Visa',
          description: 'Linha com logo Visa + nível atual (Normal / Early Warning / VDMP) + ratio atual + ratio limite.',
        },
        {
          type: 'section',
          name: 'Mastercard',
          description: 'Linha com logo Mastercard + nível atual (Normal / ECM / EFM) + ratio atual + limite.',
        },
        {
          name: 'Indicador de Tendência',
          description: 'Seta + texto: "Tendência: subindo / estável / descendo nos últimos 30 dias".',
        },
        {
          name: 'Botão "Plano de Ação"',
          description:
            'Aparece se está em early warning ou pior. Abre drawer com sugestões automáticas (ex: "Ative 3DS em todas as transações > R$ 200").',
        },
      ],
    },
    {
      type: 'section',
      name: 'DisputeTrendChart (Gráfico de Tendência)',
      description: 'Gráfico de linhas com 3 séries ao longo do tempo (últimos 90 dias).',
      items: [
        'Série 1: Chargebacks recebidos por semana',
        'Série 2: Disputas ganhas',
        'Série 3: Pré-CBs evitados',
        'Tooltip mostra valores exatos',
        'Legend interativo (toggle séries)',
      ],
    },
    {
      type: 'section',
      name: 'Tabela "Disputas Abertas"',
      description: 'Lista das disputas que precisam de ação.',
      items: [
        'Coluna Tipo (chargeback / alert_ethoca / alert_verifi / retrieval)',
        'Coluna Reason Code + Descrição',
        'Coluna Valor',
        'Coluna Bandeira',
        'Coluna Win Probability (%)',
        'Coluna Recomendação IA (badge: contest / accept)',
        'Coluna Deadline (com countdown se urgente)',
        'Coluna Ações (botão "Analisar" → /Chargebacks/:id ou /PreChargebacks/:id)',
      ],
    },
    {
      type: 'section',
      name: 'Acessos Rápidos do Módulo',
      description: 'Linha de 4 cards-link.',
      items: [
        'Card "Pré-Chargebacks" → /PreChargebacks',
        'Card "Chargebacks" → /Chargebacks',
        'Card "MEDs" → /MEDDashboard',
        'Card "Configurações Antifraude" → /SettingsPage com aba antifraude',
      ],
    },
  ],

  actions: [
    { name: 'Analisar disputa', flow: 'Click "Analisar" na tabela → leva para /Chargebacks/:id ou /PreChargebacks/:id.' },
    { name: 'Acionar plano de ação', flow: 'Botão "Plano de Ação" → drawer lateral com checklist de ações sugeridas + links diretos para configurações relevantes.' },
    { name: 'Configurar agente', flow: 'Botão "Configurar Agente" → /DisputeManagerSettings.' },
    { name: 'Exportar relatório executivo', flow: 'Botão exportar → modal pergunta período → gera PDF com todas as métricas, gráficos e top 10 reason codes.' },
  ],

  states: [
    { name: 'Loading', description: 'Skeletons.' },
    { name: 'Operação saudável', description: 'Compliance Overview todo verde, ratio baixo, sem disputas abertas. Card amigável "Tudo certo!".' },
    { name: 'Early warning', description: 'Compliance amarelo, banner alerta no topo, plano de ação proeminente.' },
    { name: 'Em programa (VDMP/ECM)', description: 'Compliance vermelho, banner crítico vermelho no topo, plano de ação obrigatório.' },
    { name: 'Sem disputas (operação nova)', description: 'KPIs zerados, mensagem educativa "Você ainda não recebeu disputas — siga as boas práticas".' },
  ],

  navigation: [
    { to: '/Chargebacks', via: 'Card "Chargebacks" / link na tabela' },
    { to: '/PreChargebacks', via: 'Card "Pré-Chargebacks" / link na tabela' },
    { to: '/MEDDashboard', via: 'Card "MEDs"' },
    { to: '/DisputeManagerSettings', via: 'Botão "Configurar Agente"' },
    { to: '/SettingsPage?tab=antifraud', via: 'Card "Configurações Antifraude"' },
  ],

  dataSources: [
    { entity: 'Dispute', type: 'List + aggregations', description: 'Fonte principal para tabela e KPIs.' },
    { entity: 'ComplianceStatus', type: 'List filtrado por mês corrente', description: 'Para card Compliance Overview com Visa/Mastercard.' },
    { entity: 'DisputeAgentConfig', type: 'Read', description: 'Status e métricas do agente IA.' },
    { entity: 'Transaction', type: 'Aggregate', description: 'Para calcular ratios (chargebacks / total transactions).' },
  ],

  notes:
    'Compliance com bandeiras é o ponto MAIS CRÍTICO desta tela — entrar em VDMP/ECM gera multas pesadas e pode até resultar em descredenciamento. Os ratios devem ser destacados visualmente. O plano de ação automático é diferenciador competitivo. Considerar push notification quando ratio sobe de nível.',
});

export default DisputeDashboardDoc;