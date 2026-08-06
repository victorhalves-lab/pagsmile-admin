// Mocks para a visão 360º de um cliente individual
export const customer360Full = {
  id: 'cu1',
  name: 'Fernanda Carvalho',
  email: 'fernanda.carvalho@email.com',
  phone: '+55 11 99736-4799',
  document: '123.456.789-09',
  birthdate: '1991-04-12',
  city: 'São Paulo · SP',
  avatar_letter: 'F',
  rfv: { label: 'Campeã', color: '#2bc196', bg: '#dcfce7', score: 92 },
  level: { name: 'Diamante', color: '#2bc196', points: 6566 },
  channels: ['Aplicativo', 'Site', 'WhatsApp'],
  tags: ['VIP', 'Aniversariante', 'Alta frequência'],
  first_purchase: '2023-09-14',
  lifecycle_days: 692,
  metrics: {
    total_spent: 6566.40,
    orders: 192,
    avg_ticket: 34.20,
    avg_cycle_days: 34,
    last_purchase: '2024-09-25',
    items_per_order: 2.4,
    favorite_channel: 'Aplicativo',
    preferred_payment: 'PIX',
    returns: 3,
    return_rate: 1.56,
  },
  rfv_scores: {
    recency: 5, // dias desde última compra (escala 1-5)
    frequency: 5, // número de compras
    monetary: 5, // valor gasto
    rfv_combined: 5.0,
  },
  loyalty: {
    points_balance: 6566,
    points_earned_ytd: 1820,
    points_redeemed_ytd: 420,
    tier_progress: 78,
    tier_next: 'Diamante Elite',
    tier_remaining: 434,
    cashback_earned: 328.30,
    rewards_redeemed: 7,
  },
  predictions: {
    churn_probability: 8,
    ltv_projected: 8420,
    next_purchase_eta: 12,
    recommended_actions: [
      { type: 'winback', title: 'Enviar cupom de recompra 15%', rationale: 'Cliente em ciclo de recompra próximo' },
      { type: 'upsell', title: 'Ofertar produto premium', rationale: 'Ticket médio sugere capacidade de upsell' },
      { type: 'referral', title: 'Convidar para MGM', rationale: 'Alta satisfação e frequência' },
    ],
  },
};

// Jornada de compras (timeline)
export const customerPurchases = [
  { id: 'p1', date: '2024-09-25', channel: 'Aplicativo', items: 3, value: 68.40, coupon: 'NAT05', status: 'aprovado' },
  { id: 'p2', date: '2024-09-14', channel: 'Aplicativo', items: 2, value: 74.57, coupon: 'NAT05', status: 'aprovado' },
  { id: 'p3', date: '2024-08-30', channel: 'Site', items: 4, value: 112.20, coupon: null, status: 'aprovado' },
  { id: 'p4', date: '2024-08-12', channel: 'Aplicativo', items: 2, value: 54.80, coupon: 'VIP10', status: 'aprovado' },
  { id: 'p5', date: '2024-07-28', channel: 'Site', items: 1, value: 38.90, coupon: null, status: 'aprovado' },
  { id: 'p6', date: '2024-07-10', channel: 'WhatsApp', items: 3, value: 89.40, coupon: null, status: 'aprovado' },
  { id: 'p7', date: '2024-06-22', channel: 'Aplicativo', items: 2, value: 61.20, coupon: 'NAT05', status: 'aprovado' },
  { id: 'p8', date: '2024-06-05', channel: 'Site', items: 5, value: 148.75, coupon: null, status: 'reembolsado' },
];

// Comunicações recebidas
export const customerCommunications = [
  { id: 'c1', date: '2024-09-26', channel: 'WhatsApp', campaign: 'TAPIOCA [10% OFF]', opened: true, clicked: true, converted: false },
  { id: 'c2', date: '2024-09-19', channel: 'WhatsApp', campaign: 'TAPIOCA [10% OFF]', opened: true, clicked: true, converted: true },
  { id: 'c3', date: '2024-09-10', channel: 'Email', campaign: 'Brigadeiro de Pistache', opened: true, clicked: false, converted: false },
  { id: 'c4', date: '2024-08-28', channel: 'Push', campaign: 'Clientes aniversariantes', opened: true, clicked: true, converted: true },
  { id: 'c5', date: '2024-08-15', channel: 'WhatsApp', campaign: 'CREME DE NOZES', opened: false, clicked: false, converted: false },
  { id: 'c6', date: '2024-07-22', channel: 'Email', campaign: '2 Pras Di Matteo', opened: true, clicked: true, converted: false },
];

// Segmentos atribuídos
export const customerSegments = [
  { name: 'Campeões', type: 'RFV', auto: true, since: '2024-09-26' },
  { name: 'Aniversariantes de Abril', type: 'Comportamental', auto: true, since: '2024-03-01' },
  { name: 'Alta frequência (>10 compras/mês)', type: 'Comportamental', auto: true, since: '2024-01-15' },
  { name: 'VIP Diamante', type: 'Fidelidade', auto: true, since: '2023-12-01' },
  { name: 'Lista de reativação Q4', type: 'Campanha', auto: false, since: '2024-09-20' },
];

// Timeline completa (eventos mistos)
export const customerTimelineFull = [
  { type: 'whatsapp', title: 'Recebeu WhatsApp', desc: 'Campanha: TAPIOCA [10% OFF] · abriu e clicou', date: '2024-09-26 14:22', campaign: 'TAPIOCA [10% OFF]' },
  { type: 'rfv_change', title: 'Mudou status RFV', desc: 'De: Fiéis → Para: Campeã', date: '2024-09-26 01:05' },
  { type: 'purchase', title: 'Realizou compra', desc: 'Canal: Aplicativo · R$ 68,40 · cupom NAT05', date: '2024-09-25 22:08', coupon: 'NAT05', value: 68.40 },
  { type: 'points', title: 'Pontos creditados', desc: '+68 pontos (compra)', date: '2024-09-25 22:08' },
  { type: 'email', title: 'Recebeu Email', desc: 'Campanha: Brigadeiro de Pistache · abriu', date: '2024-09-10 09:15' },
  { type: 'purchase', title: 'Realizou compra', desc: 'Canal: Aplicativo · R$ 74,57 · cupom NAT05', date: '2024-09-14 18:51', coupon: 'NAT05', value: 74.57 },
  { type: 'whatsapp', title: 'Recebeu WhatsApp', desc: 'Campanha: TAPIOCA [10% OFF] · abriu, clicou e converteu', date: '2024-09-19 18:44', campaign: 'TAPIOCA [10% OFF]' },
  { type: 'segment', title: 'Entrou em segmento', desc: 'Lista de reativação Q4 (atribuição manual)', date: '2024-09-20 11:00' },
  { type: 'reward', title: 'Resgatou recompensa', desc: 'Brinde: Tapioca grátis', date: '2024-08-30 15:20' },
  { type: 'rfv_change', title: 'Mudou status RFV', desc: 'De: Promissora → Para: Fiéis', date: '2024-08-15 01:13' },
];

// Gasto mensal (últimos 8 meses)
export const customerMonthlySpend = [
  { month: 'fev', value: 198.40 },
  { month: 'mar', value: 312.80 },
  { month: 'abr', value: 245.60 },
  { month: 'mai', value: 428.90 },
  { month: 'jun', value: 367.20 },
  { month: 'jul', value: 289.40 },
  { month: 'ago', value: 512.80 },
  { month: 'set', value: 368.40 },
];