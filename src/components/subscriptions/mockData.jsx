export const mockPlans = [
  {
    id: 'plan_basic', plan_id: 'plan_basic', name: 'Basic', description: 'Para começar',
    benefits: ['Até 100 transações', 'Suporte email', '1 usuário'],
    amount: 59, frequency: 'monthly', trial_days: 7, payment_methods: ['card'],
    status: 'active', visibility: 'public', is_popular: false,
    current_subscribers: 120, mrr: 7080, churn_rate: 6.2, ltv: 580, plan_health: 72,
  },
  {
    id: 'plan_starter', plan_id: 'plan_starter', name: 'Starter', description: 'Para crescer',
    benefits: ['Até 1.000 transações', 'Suporte chat', '3 usuários', 'Webhooks'],
    amount: 149, frequency: 'monthly', trial_days: 14, payment_methods: ['card', 'pix'],
    status: 'active', visibility: 'public', is_popular: true,
    current_subscribers: 186, mrr: 27768, churn_rate: 4.1, ltv: 1430, plan_health: 88,
  },
  {
    id: 'plan_pro', plan_id: 'plan_pro', name: 'Pro', description: 'Para escalar',
    benefits: ['Transações ilimitadas', 'Suporte prioritário', '10 usuários', 'API completa'],
    amount: 449, frequency: 'monthly', trial_days: 14, payment_methods: ['card', 'pix'],
    status: 'active', visibility: 'public', is_popular: false,
    current_subscribers: 59, mrr: 26691, churn_rate: 2.3, ltv: 7300, plan_health: 91,
  },
  {
    id: 'plan_premium', plan_id: 'plan_premium', name: 'Premium', description: 'Enterprise',
    benefits: ['Tudo do Pro', 'Account Manager', 'SLA 99.9%'],
    amount: 1500, frequency: 'monthly', trial_days: 0, payment_methods: ['card'],
    status: 'active', visibility: 'private', is_popular: false,
    current_subscribers: 12, mrr: 18000, churn_rate: 0.8, ltv: 53000, plan_health: 95,
  },
];

const baseSubs = [
  { name: 'Ana Costa', email: 'ana@empresa.com', plan: 'Pro', plan_id: 'plan_pro', amount: 449, status: 'active', method: 'card', last4: '4242', age_months: 8, engagement: 78, health: 'healthy' },
  { name: 'Bruno Lima', email: 'bruno@startup.io', plan: 'Starter', plan_id: 'plan_starter', amount: 149, status: 'active', method: 'pix', age_months: 14, engagement: 82, health: 'healthy' },
  { name: 'Carla Souza', email: 'carla@loja.com', plan: 'Basic', plan_id: 'plan_basic', amount: 59, status: 'trial', method: 'card', last4: '1881', age_months: 0, engagement: 55, health: 'attention' },
  { name: 'Diego Ferreira', email: 'diego@agencia.com', plan: 'Pro', plan_id: 'plan_pro', amount: 449, status: 'delinquent', method: 'card', last4: '0005', age_months: 4, engagement: 28, health: 'risk', failed: 2 },
  { name: 'Eduarda Mendes', email: 'edu@varejo.com', plan: 'Starter', plan_id: 'plan_starter', amount: 149, status: 'paused', method: 'card', last4: '1234', age_months: 6, engagement: 12, health: 'risk' },
  { name: 'Felipe Rocha', email: 'felipe@tech.com', plan: 'Premium', plan_id: 'plan_premium', amount: 1500, status: 'active', method: 'card', last4: '9991', age_months: 22, engagement: 95, health: 'healthy' },
  { name: 'Gabriela Alves', email: 'gabi@boutique.com', plan: 'Starter', plan_id: 'plan_starter', amount: 149, status: 'active', method: 'card', last4: '4848', age_months: 11, engagement: 68, health: 'healthy', discount: 10 },
  { name: 'Henrique Dias', email: 'hdias@negocio.com', plan: 'Basic', plan_id: 'plan_basic', amount: 59, status: 'cancelled', method: 'card', last4: '0102', age_months: 3, engagement: 18, health: 'risk' },
  { name: 'Isabela Pinto', email: 'isa@ecommerce.com', plan: 'Pro', plan_id: 'plan_pro', amount: 449, status: 'active', method: 'card', last4: '7766', age_months: 16, engagement: 88, health: 'healthy' },
  { name: 'João Silva', email: 'joao@digital.com', plan: 'Starter', plan_id: 'plan_starter', amount: 149, status: 'delinquent', method: 'card', last4: '5151', age_months: 5, engagement: 42, health: 'attention', failed: 1 },
];

export const mockSubscriptions = baseSubs.map((b, i) => {
  const start = new Date();
  start.setMonth(start.getMonth() - b.age_months);
  const next = new Date();
  next.setDate(next.getDate() + Math.floor(Math.random() * 30));
  const cardExpiry = new Date();
  cardExpiry.setMonth(cardExpiry.getMonth() + (i % 5 === 0 ? 1 : 24));
  return {
    id: `sub_${i + 1}`,
    subscription_id: `SUB-${String(1000 + i).padStart(5, '0')}`,
    customer_name: b.name,
    customer_email: b.email,
    customer_avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(b.name)}&background=2bc196&color=fff`,
    plan_name: b.plan,
    plan_id: b.plan_id,
    amount: b.amount,
    billing_cycle: 'monthly',
    status: b.status,
    health_status: b.health,
    payment_method: b.method,
    card_last_four: b.last4,
    card_brand: 'visa',
    card_expiry: cardExpiry.toISOString().slice(0, 7),
    start_date: start.toISOString(),
    next_billing_date: next.toISOString(),
    trial_end_date: b.status === 'trial' ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() : null,
    current_cycle: b.age_months + 1,
    failed_attempts: b.failed || 0,
    engagement_score: b.engagement,
    discount_pct: b.discount,
    total_paid: b.amount * (b.age_months || 1),
    origin: ['Direto', 'Checkout', 'Link', 'API'][i % 4],
    tags: i % 3 === 0 ? ['VIP'] : i % 4 === 0 ? ['Trial', 'Novo'] : [],
  };
});

export const defaultSavedViews = [
  { id: 'all', label: 'Todas', filters: {} },
  { id: 'at_risk', label: 'Em risco', filters: { health: 'risk' } },
  { id: 'trial_expiring', label: 'Trial expirando 7d', filters: { trial_expiring_days: 7 } },
  { id: 'churned', label: 'Cancelados', filters: { status: 'cancelled' } },
];

export const mockPendingActions = [
  { sub_id: 'sub_3', label: 'Convert trial', type: 'trial' },
  { sub_id: 'sub_7', label: 'Renovar desconto', type: 'discount' },
];

export const mockCharges = [
  { id: 'ch_1', date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), subscription_id: 'SUB-01001', customer: 'Ana Costa', amount: 449, method: 'card', last_four: '4242', status: 'approved', attempts: 1 },
  { id: 'ch_2', date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), subscription_id: 'SUB-01004', customer: 'Diego Ferreira', amount: 449, method: 'card', last_four: '0005', status: 'pending_retry', attempts: 2, fail_reason: 'Saldo insuficiente' },
  { id: 'ch_3', date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), subscription_id: 'SUB-01010', customer: 'João Silva', amount: 149, method: 'card', last_four: '5151', status: 'failed', attempts: 1, fail_reason: 'Cartão recusado' },
  { id: 'ch_4', date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), subscription_id: 'SUB-01006', customer: 'Felipe Rocha', amount: 1500, method: 'card', last_four: '9991', status: 'approved', attempts: 1 },
  { id: 'ch_5', date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), subscription_id: 'SUB-01002', customer: 'Bruno Lima', amount: 149, method: 'pix', status: 'approved', attempts: 1 },
];