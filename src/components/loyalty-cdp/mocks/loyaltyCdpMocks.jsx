// Mock data para o protótipo de Loyalty + CDP/CRM (sem integração)

export const loyaltyKpis = {
  active_members: 18432,
  points_issued: 9450000,
  points_redeemed: 3120000,
  redemption_rate: 33.0,
  engagement_rate: 64.2,
  rewards_delivered: 8740,
  cashback_paid: 128400,
  avg_points_per_member: 513,
  mrr_subscription: 18400,
};

export const membersEvolution = [
  { month: 'Fev', members: 8200, active: 4100 },
  { month: 'Mar', members: 9800, active: 5300 },
  { month: 'Abr', members: 11200, active: 6500 },
  { month: 'Mai', members: 13100, active: 7900 },
  { month: 'Jun', members: 14900, active: 9100 },
  { month: 'Jul', members: 16700, active: 10500 },
  { month: 'Ago', members: 18432, active: 11800 },
];

export const loyaltyFunnel = [
  { stage: 'Cadastrados', value: 18432, pct: 100 },
  { stage: 'Pontuaram', value: 11800, pct: 64 },
  { stage: 'Acumularam 500+ pts', value: 8200, pct: 44 },
  { stage: 'Resgataram', value: 6090, pct: 33 },
];

export const levelsDistribution = [
  { level: 'Bronze', members: 8200, color: '#cd7f32' },
  { level: 'Prata', members: 5400, color: '#94a3b8' },
  { level: 'Ouro', members: 3100, color: '#f59e0b' },
  { level: 'Diamante', members: 1732, color: '#2bc196' },
];

export const levelsConfig = [
  { id: 1, name: 'Bronze', threshold: '0 pontos', benefits: ['1 pt por R$1', 'Acesso ao catálogo básico'], color: '#cd7f32' },
  { id: 2, name: 'Prata', threshold: '1.000 pontos', benefits: ['1,2 pts por R$1', 'Frete grátis acima R$150', 'Resgate antecipado'], color: '#94a3b8' },
  { id: 3, name: 'Ouro', threshold: '5.000 pontos', benefits: ['1,5 pts por R$1', 'Frete grátis ilimitado', 'Cashback 2%', 'Prioridade SAC'], color: '#f59e0b' },
  { id: 4, name: 'Diamante', threshold: '15.000 pontos', benefits: ['2 pts por R$1', 'Frete grátis ilimitado', 'Cashback 5%', 'Acesso VIP a lançamentos', 'Concierge'], color: '#2bc196' },
];

export const rewardsCatalog = [
  { id: 'rw1', name: 'Desconto R$20', points: 800, type: 'desconto', redeemed: 1240, stock: null, status: 'ativo' },
  { id: 'rw2', name: 'Frete Grátis (3 usos)', points: 500, type: 'frete', redeemed: 3100, stock: null, status: 'ativo' },
  { id: 'rw3', name: 'Produto Brinde - Camiseta', points: 2500, type: 'produto', redeemed: 430, stock: 120, status: 'ativo' },
  { id: 'rw4', name: 'Cashback R$50', points: 4000, type: 'cashback', redeemed: 280, stock: null, status: 'ativo' },
  { id: 'rw5', name: 'Experiência - Jantar para 2', points: 12000, type: 'experiencia', redeemed: 38, stock: 15, status: 'ativo' },
  { id: 'rw6', name: 'Gift Card R$100', points: 9000, type: 'giftcard', redeemed: 190, stock: 50, status: 'ativo' },
];

export const missions = [
  { id: 'm1', name: 'Primeira compra', reward: 100, completions: 4200, status: 'ativa' },
  { id: 'm2', name: '3 compras em 30 dias', reward: 250, completions: 2100, status: 'ativa' },
  { id: 'm3', name: 'Indique um amigo', reward: 500, completions: 980, status: 'ativa' },
  { id: 'm4', name: 'Avalie um produto', reward: 50, completions: 6500, status: 'ativa' },
  { id: 'm5', name: 'Gaste R$500 em 1 mês', reward: 800, completions: 1340, status: 'pausada' },
];

export const mgmStats = {
  invitations_sent: 4200,
  invitations_converted: 1680,
  conversion_rate: 40.0,
  points_to_referrer: 840000,
  points_to_referee: 168000,
  top_referrers: [
    { name: 'Ana Costa', invites: 42, converted: 18, points: 9000 },
    { name: 'Bruno Lima', invites: 31, converted: 12, points: 6000 },
    { name: 'Carla Dias', invites: 28, converted: 11, points: 5500 },
  ],
};

export const subscriptions = {
  plan_name: 'Prime+',
  price_monthly: 19.90,
  active_subscribers: 924,
  mrr: 18374,
  churn_30d: 4.2,
  benefits: ['Frete grátis ilimitado', '2 pts por R$1', 'Cashback 5%', 'Acesso VIP a lançamentos'],
};

export const giftCards = {
  issued: 2300,
  redeemed: 1640,
  outstanding_balance: 66000,
  formats: [
    { value: 50, points: 4500, sold: 820 },
    { value: 100, points: 9000, sold: 940 },
    { value: 200, points: 18000, sold: 540 },
  ],
};

export const accelerators = [
  { id: 'a1', name: '2x pontos em Beleza', scope: 'Categoria: Beleza', multiplier: 2, period: '01/08 a 31/08', status: 'ativa', points_issued: 420000 },
  { id: 'a2', name: 'Quartas em Dobro', scope: 'Todas as quartas', multiplier: 2, period: 'Recorrente', status: 'ativa', points_issued: 210000 },
  { id: 'a3', name: 'Black Friday 5x', scope: 'Todo o catálogo', multiplier: 5, period: '24/11 a 30/11', status: 'programada', points_issued: 0 },
];

export const loyaltyProgramConfig = {
  type: 'Híbrido (Pontos + Níveis + Cashback)',
  base_rule: '1 ponto por R$1',
  points_validity_days: 365,
  omnichannel: true,
  channels: ['Online', 'Loja Física (PDV)', 'iFood'],
  multiplier_default: 1,
};

// ===== CDP / CRM =====

export const cdpKpis = {
  total_customers: 42100,
  messages_sent: 284000,
  conversions: 8420,
  revenue_generated: 1240000,
  active_campaigns: 18,
  automation_flows: 12,
};

export const revenueComposition = [
  { name: 'Recovery', value: 420000, color: '#2bc196' },
  { name: 'Recurring', value: 510000, color: '#002443' },
  { name: 'New', value: 310000, color: '#5cf7cf' },
];

export const revenueByChannel = [
  { channel: 'Email', revenue: 540000 },
  { channel: 'WhatsApp', revenue: 380000 },
  { channel: 'SMS', revenue: 180000 },
  { channel: 'Push', revenue: 140000 },
];

export const campaignList = [
  { id: 'c1', name: 'Carrinho Abandonado', segment: 'Recência alta', channel: 'Email', status: 'ativa', sent: 12000, conv: 840, revenue: 124000 },
  { id: 'c2', name: 'VIP Diamante - Lançamento', segment: 'Nível Diamante', channel: 'WhatsApp', status: 'ativa', sent: 1732, conv: 410, revenue: 98000 },
  { id: 'c3', name: 'Reativação 90d', segment: 'Inativo 90d', channel: 'SMS', status: 'ativa', sent: 8400, conv: 520, revenue: 61000 },
  { id: 'c4', name: 'Aniversário do Mês', segment: 'Aniversário', channel: 'Email', status: 'ativa', sent: 4200, conv: 310, revenue: 38000 },
  { id: 'c5', name: 'Black Friday Teaser', segment: 'Todos', channel: 'Push', status: 'programada', sent: 0, conv: 0, revenue: 0 },
  { id: 'c6', name: 'Cashback Expirando', segment: 'Cashback > R$20', channel: 'WhatsApp', status: 'pausada', sent: 2100, conv: 180, revenue: 22000 },
];

export const customers360 = [
  { id: 'cu1', name: 'Ana Costa', email: 'ana@email.com', phone: '(11) 99999-1234', last_purchase: '2026-08-01', total_spent: 4280, orders: 34, rfv: 'Champion', points: 4280, level: 'Diamante' },
  { id: 'cu2', name: 'Bruno Lima', email: 'bruno@email.com', phone: '(21) 98888-2345', last_purchase: '2026-07-22', total_spent: 1820, orders: 12, rfv: 'Loyal', points: 1820, level: 'Ouro' },
  { id: 'cu3', name: 'Carla Dias', email: 'carla@email.com', phone: '(31) 97777-3456', last_purchase: '2026-05-15', total_spent: 640, orders: 5, rfv: 'At Risk', points: 640, level: 'Prata' },
  { id: 'cu4', name: 'Diego Souza', email: 'diego@email.com', phone: '(41) 96666-4567', last_purchase: '2026-08-04', total_spent: 890, orders: 8, rfv: 'Promising', points: 890, level: 'Prata' },
  { id: 'cu5', name: 'Elaine Rocha', email: 'elaine@email.com', phone: '(51) 95555-5678', last_purchase: '2026-02-10', total_spent: 210, orders: 2, rfv: 'Hibernating', points: 210, level: 'Bronze' },
  { id: 'cu6', name: 'Felipe Alves', email: 'felipe@email.com', phone: '(61) 94444-6789', last_purchase: '2026-07-30', total_spent: 5600, orders: 41, rfv: 'Champion', points: 5600, level: 'Diamante' },
];

export const rfvMatrix = [
  { segment: 'Champion', count: 1840, pct: 16, action: 'Recompense, peça reviews' },
  { segment: 'Loyal', count: 3200, pct: 28, action: 'Upsell, produtos premium' },
  { segment: 'Promising', count: 2100, pct: 18, action: 'Onboarding, 1ª recompra' },
  { segment: 'At Risk', count: 1900, pct: 17, action: 'Reativação com cupom' },
  { segment: 'Hibernating', count: 2400, pct: 21, action: 'Win-back agressivo' },
];

export const cohortData = [
  { cohort: 'Jan', m0: 100, m1: 62, m2: 48, m3: 39, m4: 34 },
  { cohort: 'Fev', m0: 100, m1: 58, m2: 44, m3: 36, m4: null },
  { cohort: 'Mar', m0: 100, m1: 65, m2: 51, m3: null, m4: null },
  { cohort: 'Abr', m0: 100, m1: 54, m2: null, m3: null, m4: null },
];

export const segments = [
  { id: 's1', name: 'VIP Diamante', size: 1732, criteria: 'Nível = Diamante', campaign_active: 2 },
  { id: 's2', name: 'Inativo 90 dias', size: 4200, criteria: 'Última compra > 90d', campaign_active: 1 },
  { id: 's3', name: 'Alto Valor', size: 3100, criteria: 'Gasto > R$3.000/ano', campaign_active: 3 },
  { id: 's4', name: 'Aniversário do mês', size: 1200, criteria: 'Mês nascimento = atual', campaign_active: 1 },
  { id: 's5', name: 'Carrinho abandonado 24h', size: 890, criteria: 'Carrinho > 24h sem finalizar', campaign_active: 1 },
];

export const automations = [
  { id: 'au1', name: 'Carrinho Abandonado', trigger: 'Carrinho abandonado', steps: 3, status: 'ativa', conversions: 840 },
  { id: 'au2', name: 'Boas-vindas', trigger: '1º cadastro', steps: 4, status: 'ativa', conversions: 1200 },
  { id: 'au3', name: 'Reativação 60d', trigger: 'Inativo 60d', steps: 2, status: 'ativa', conversions: 410 },
  { id: 'au4', name: 'Aniversário', trigger: 'Aniversário', steps: 2, status: 'ativa', conversions: 310 },
  { id: 'au5', name: 'Cashback expira em 7d', trigger: 'Cashback expira', steps: 2, status: 'pausada', conversions: 180 },
];

// ===== ADMIN INTERNO (Governança) =====

export const adminIntLoyaltyKpis = {
  merchants_with_program: 142,
  total_members_platform: 1240000,
  points_issued_platform: 312000000,
  points_redeemed_platform: 98000000,
  redemption_rate_platform: 31.4,
  revenue_via_loyalty: 8400000,
  top_merchants: [
    { name: 'Moda Express', members: 18432, engagement: 64.2, revenue: 1240000 },
    { name: 'Edu+ Cursos', members: 9800, engagement: 58.1, revenue: 620000 },
    { name: 'TechStore BR', members: 14300, engagement: 71.5, revenue: 980000 },
    { name: 'Beauty Club', members: 22100, engagement: 69.0, revenue: 1510000 },
  ],
};

export const adminIntCdpKpis = {
  merchants_active_cdp: 98,
  messages_sent_platform: 8400000,
  conversions_platform: 242000,
  revenue_generated_platform: 28400000,
  sms_cost_monthly: 42000,
  whatsapp_cost_monthly: 68000,
  top_merchants: [
    { name: 'Moda Express', sent: 284000, conv: 8420, revenue: 1240000 },
    { name: 'TechStore BR', sent: 198000, conv: 6100, revenue: 980000 },
    { name: 'Beauty Club', sent: 340000, conv: 11200, revenue: 1510000 },
  ],
};

// ===== Promoções (Compre +, Progressivo, Compre Junto) =====

export const promotionsList = [
  { id: 'p1', name: 'Leve 3 Pague 2', type: 'compre_mais', scope: 'Categoria: Camisetas', discount: '1 grátis a cada 3', period: '01/08 a 31/08', status: 'ativa', uses: 420, revenue: 68000 },
  { id: 'p2', name: 'Desconto Progressivo por Valor', type: 'progressivo', scope: 'Todo catálogo', discount: '5% > R$200, 10% > R$500', period: 'Recorrente', status: 'ativa', uses: 1840, revenue: 210000 },
  { id: 'p3', name: 'Compre Junto - Kit Skincare', type: 'compre_junto', scope: 'Produtos: Sabonete+Tônico+Hidratante', discount: '15% no bundle', period: '01/07 a 30/09', status: 'ativa', uses: 340, revenue: 42000 },
  { id: 'p4', name: 'Leve 2 Pague 1 - Meias', type: 'compre_mais', scope: 'Categoria: Meias', discount: '1 grátis a cada 2', period: 'Recorrente', status: 'pausada', uses: 980, revenue: 31000 },
  { id: 'p5', name: 'Desconto Progressivo por Itens', type: 'progressivo', scope: 'Categoria: Livros', discount: '3+ itens = 12%', period: '01/08 a 15/08', status: 'programada', uses: 0, revenue: 0 },
  { id: 'p6', name: 'Compre Junto - Café + Caneca', type: 'compre_junto', scope: 'Produtos: Café 500g + Caneca', discount: '20% no bundle', period: 'Recorrente', status: 'ativa', uses: 210, revenue: 18000 },
];