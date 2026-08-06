// Mock data rico para o configurador de fidelidade (sem integração)
// Suporta: Pontos, Cashback, Níveis, Híbrido — com regras por escopo e builder de condições

// ===== Catálogo de canais (omnichannel externo, não só foodtech) =====
export const channelsCatalog = [
  { id: 'ecommerce', name: 'E-commerce / Online', icon: 'Globe', group: 'Próprio' },
  { id: 'pdv', name: 'Loja Física (PDV)', icon: 'Store', group: 'Próprio' },
  { id: 'app', name: 'App Próprio', icon: 'Smartphone', group: 'Próprio' },
  { id: 'whatsapp', name: 'WhatsApp Commerce', icon: 'MessageSquare', group: 'Conversacional' },
  { id: 'moto', name: 'Venda por Telefone (MOTO)', icon: 'Phone', group: 'Conversacional' },
  { id: 'ifood', name: 'iFood', icon: 'Utensils', group: 'Marketplace' },
  { id: 'mercadolivre', name: 'Mercado Livre', icon: 'ShoppingBag', group: 'Marketplace' },
  { id: 'amazon', name: 'Amazon', icon: 'Package', group: 'Marketplace' },
  { id: 'instagram', name: 'Instagram Shopping', icon: 'Instagram', group: 'Social Commerce' },
  { id: 'facebook', name: 'Facebook Shop', icon: 'Facebook', group: 'Social Commerce' },
  { id: 'b2b', name: 'Portal B2B', icon: 'Building2', group: 'B2B' },
  { id: 'afiliados', name: 'Afiliados', icon: 'Users', group: 'B2B' },
];

// ===== Tipos de programa e seus campos condicionais =====
export const programTypes = [
  { id: 'pontos', name: 'Pontos', description: 'Acumule pontos e troque por recompensas', color: '#2bc196' },
  { id: 'cashback', name: 'Cashback', description: 'Devolva % do valor em crédito', color: '#5cf7cf' },
  { id: 'niveis', name: 'Níveis / Tiers', description: 'Tiers por engajamento com benefícios escalonados', color: '#002443' },
  { id: 'hibrido', name: 'Híbrido', description: 'Pontos + Níveis + Cashback combinados', color: '#8b5cf6' },
];

// ===== Configuração por tipo (estado mock) =====
export const programConfigState = {
  type: 'hibrido',
  pontos: {
    base_rate: 1, // pts por R$1
    rounding: 'down', // down | up | nearest
    min_purchase_to_earn: 0,
    validity_days: 365,
    expiry_policy: 'rolling', // rolling | fixed | never
    earn_on: ['subtotal'], // subtotal | shipping | fees
    bonus_first_purchase: 0,
  },
  cashback: {
    base_rate: 2, // %
    cap_per_transaction: 50, // R$
    cap_monthly: 200, // R$
    expiration_days: 90,
    payout_method: 'next_purchase', // next_purchase | account_credit | withdrawable | statement
    earn_on: ['subtotal'],
    tiered: true,
    exclude_categories: ['gift_cards'],
  },
  niveis: {
    criteria: 'points', // points | spend | orders | hybrid
    upgrade: 'auto', // auto | manual
    downgrade_after_days: 180, // inatividade para rebaixar
    grace_period_days: 30,
    reset_policy: 'lifetime', // lifetime | annual | rolling_12m
    notify_on_upgrade: true,
    notify_on_downgrade: true,
  },
  hibrido: {
    cashback_counts_toward_tier: true,
    points_counts_toward_tier: true,
    cashback_earns_points: false,
    points_redeem_reduces_tier: false,
  },
};

// ===== Builder de condições: atributos e operadores =====
export const conditionAttributes = [
  { id: 'channel', name: 'Canal', type: 'select', options: 'channels' },
  { id: 'category', name: 'Categoria', type: 'text' },
  { id: 'segment', name: 'Segmento', type: 'select', options: 'segments' },
  { id: 'level', name: 'Nível', type: 'select', options: 'levels' },
  { id: 'payment_method', name: 'Método de Pagamento', type: 'select', options: 'paymentMethods' },
  { id: 'cart_value', name: 'Valor do Carrinho', type: 'number' },
  { id: 'items_count', name: 'Qtd. de Itens', type: 'number' },
  { id: 'day_of_week', name: 'Dia da Semana', type: 'select', options: 'weekdays' },
  { id: 'time_window', name: 'Faixa de Horário', type: 'select', options: 'timeWindows' },
  { id: 'customer_tag', name: 'Tag do Cliente', type: 'text' },
];

export const operators = {
  select: [
    { id: 'in', name: 'é um de' },
    { id: 'not_in', name: 'não é nenhum de' },
  ],
  text: [
    { id: 'equals', name: 'igual a' },
    { id: 'not_equals', name: 'diferente de' },
    { id: 'contains', name: 'contém' },
  ],
  number: [
    { id: 'gt', name: 'maior que' },
    { id: 'gte', name: 'maior ou igual a' },
    { id: 'lt', name: 'menor que' },
    { id: 'lte', name: 'menor ou igual a' },
    { id: 'between', name: 'entre' },
  ],
};

export const optionSets = {
  channels: channelsCatalog.map((c) => ({ id: c.id, name: c.name })),
  segments: [
    { id: 'champion', name: 'Champion' },
    { id: 'loyal', name: 'Loyal' },
    { id: 'promising', name: 'Promising' },
    { id: 'at_risk', name: 'At Risk' },
    { id: 'hibernating', name: 'Hibernating' },
  ],
  levels: [
    { id: 'bronze', name: 'Bronze' },
    { id: 'prata', name: 'Prata' },
    { id: 'ouro', name: 'Ouro' },
    { id: 'diamante', name: 'Diamante' },
  ],
  paymentMethods: [
    { id: 'credit_card', name: 'Cartão de Crédito' },
    { id: 'pix', name: 'PIX' },
    { id: 'boleto', name: 'Boleto' },
    { id: 'debit_card', name: 'Cartão de Débito' },
  ],
  weekdays: [
    { id: 'mon', name: 'Segunda' }, { id: 'tue', name: 'Terça' }, { id: 'wed', name: 'Quarta' },
    { id: 'thu', name: 'Quinta' }, { id: 'fri', name: 'Sexta' }, { id: 'sat', name: 'Sábado' }, { id: 'sun', name: 'Domingo' },
  ],
  timeWindows: [
    { id: 'morning', name: 'Manhã (06-12h)' },
    { id: 'afternoon', name: 'Tarde (12-18h)' },
    { id: 'evening', name: 'Noite (18-24h)' },
    { id: 'night', name: 'Madrugada (00-06h)' },
  ],
};

// ===== Tipos de ação/recompensa das regras =====
export const rewardTypes = [
  { id: 'earn_multiplier', name: 'Multiplicador de pontos', unit: 'x' },
  { id: 'earn_bonus', name: 'Pontos bônus fixos', unit: 'pts' },
  { id: 'cashback_override', name: 'Cashback sobrescrito', unit: '%' },
  { id: 'cashback_bonus', name: 'Cashback bônus', unit: '%' },
];

// ===== Regras de acumulação (mock existentes) =====
export const earningRules = [
  {
    id: 'er1', name: '2x pontos no PIX', type: 'earn_multiplier', status: 'ativa', priority: 10,
    scope: 'Todos os canais',
    conditions: [{ attribute: 'payment_method', operator: 'in', value: ['pix'] }],
    action: { type: 'earn_multiplier', value: 2, unit: 'x' },
    validity: { start: '2026-01-01', end: '2026-12-31' },
  },
  {
    id: 'er2', name: '3x pontos categoria Beleza', type: 'earn_multiplier', status: 'ativa', priority: 20,
    scope: 'Categoria: Beleza',
    conditions: [{ attribute: 'category', operator: 'equals', value: 'Beleza' }],
    action: { type: 'earn_multiplier', value: 3, unit: 'x' },
    validity: { start: '2026-08-01', end: '2026-08-31' },
  },
  {
    id: 'er3', name: 'Bônus 500 pts primeira compra', type: 'earn_bonus', status: 'ativa', priority: 5,
    scope: 'Novos clientes',
    conditions: [{ attribute: 'segment', operator: 'in', value: ['promising'] }],
    action: { type: 'earn_bonus', value: 500, unit: 'pts' },
    validity: { start: '2026-01-01', end: null },
  },
  {
    id: 'er4', name: 'Cashback 5% em marketplaces', type: 'cashback_override', status: 'pausada', priority: 15,
    scope: 'iFood + Mercado Livre',
    conditions: [{ attribute: 'channel', operator: 'in', value: ['ifood', 'mercadolivre'] }],
    action: { type: 'cashback_override', value: 5, unit: '%' },
    validity: { start: '2026-06-01', end: '2026-09-30' },
  },
];

// ===== Níveis — schema de criação =====
export const levelFields = {
  thresholdTypes: [
    { id: 'points', name: 'Pontos acumulados' },
    { id: 'spend', name: 'Gasto total (R$)' },
    { id: 'orders', name: 'Nº de pedidos' },
  ],
  benefitTypes: [
    { id: 'earn_multiplier', name: 'Multiplicador de pontos', unit: 'x' },
    { id: 'cashback_rate', name: 'Taxa de cashback', unit: '%' },
    { id: 'free_shipping', name: 'Frete grátis' },
    { id: 'priority_support', name: 'Atendimento prioritário' },
    { id: 'exclusive_rewards', name: 'Recompensas exclusivas' },
    { id: 'discount_percent', name: 'Desconto permanente', unit: '%' },
    { id: 'early_access', name: 'Acesso antecipado a lançamentos' },
    { id: 'concierge', name: 'Concierge / Gerente dedicado' },
  ],
};

// ===== Configuração de cashback (mock) =====
export const cashbackConfig = {
  base_rate: 2,
  cap_per_transaction: 50,
  cap_monthly: 200,
  expiration_days: 90,
  payout_method: 'next_purchase',
  tiered_rates: [
    { level: 'Bronze', rate: 1 },
    { level: 'Prata', rate: 2 },
    { level: 'Ouro', rate: 3 },
    { level: 'Diamante', rate: 5 },
  ],
  exclude_categories: ['gift_cards', 'promo_items'],
  min_purchase: 0,
};

// ===== Regras de desconto/oferta (mock existentes) =====
export const discountRuleTypes = [
  { id: 'percent', name: 'Percentual', unit: '%' },
  { id: 'fixed', name: 'Valor fixo', unit: 'R$' },
  { id: 'fixed_shipping', name: 'Frete fixo', unit: 'R$' },
  { id: 'free_shipping', name: 'Frete grátis', unit: '' },
  { id: 'bogo', name: 'Compre + Pague -', unit: '' },
  { id: 'progressive', name: 'Progressivo', unit: '' },
  { id: 'bundle', name: 'Compre Junto (Bundle)', unit: '' },
];

export const discountRules = [
  {
    id: 'd1', name: '10% off acima de R$500', type: 'percent', status: 'ativa', priority: 10,
    scope: 'Todo catálogo',
    conditions: [{ attribute: 'cart_value', operator: 'gte', value: 500 }],
    action: { type: 'percent', value: 10, unit: '%' },
    limits: { max_discount: 100, stackable: false, uses_per_customer: 1, total_uses: 5000 },
    channels: ['ecommerce', 'app'],
    validity: { start: '2026-01-01', end: '2026-12-31' },
    performance: { uses: 3284, revenue: 184000, avg_discount: 42.50, conversion_lift: 18.4 },
  },
  {
    id: 'd2', name: 'Frete grátis Diamante', type: 'free_shipping', status: 'ativa', priority: 5,
    scope: 'Todos os canais',
    conditions: [{ attribute: 'level', operator: 'in', value: ['diamante'] }],
    action: { type: 'free_shipping', value: 0, unit: '' },
    limits: { max_discount: null, stackable: true, uses_per_customer: null, total_uses: null },
    channels: ['ecommerce', 'pdv', 'app'],
    validity: { start: '2026-01-01', end: null },
    performance: { uses: 12840, revenue: 0, avg_discount: 18.90, conversion_lift: 12.1 },
  },
  {
    id: 'd3', name: 'Leve 3 Pague 2 - Camisetas', type: 'bogo', status: 'ativa', priority: 20,
    scope: 'Categoria: Camisetas',
    conditions: [{ attribute: 'category', operator: 'equals', value: 'Camisetas' }],
    action: { type: 'bogo', value: '3 por 2', unit: '' },
    limits: { max_discount: null, stackable: false, uses_per_customer: 5, total_uses: 10000 },
    channels: ['ecommerce', 'pdv'],
    validity: { start: '2026-08-01', end: '2026-08-31' },
    performance: { uses: 420, revenue: 68000, avg_discount: 28.00, conversion_lift: 24.7 },
  },
  {
    id: 'd4', name: 'R$20 off Instagram (1ª compra)', type: 'fixed', status: 'programada', priority: 15,
    scope: 'Social Commerce',
    conditions: [{ attribute: 'channel', operator: 'in', value: ['instagram'] }],
    action: { type: 'fixed', value: 20, unit: 'R$' },
    limits: { max_discount: 20, stackable: false, uses_per_customer: 1, total_uses: 2000 },
    channels: ['instagram'],
    validity: { start: '2026-09-01', end: '2026-09-30' },
    performance: { uses: 0, revenue: 0, avg_discount: 0, conversion_lift: 0 },
  },
];