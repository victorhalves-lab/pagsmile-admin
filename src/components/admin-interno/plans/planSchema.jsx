/**
 * Schema completo de Plano de Taxas (Fee Plan).
 * Modelo único usado no admin interno (criação/edição) e na seleção pelo cliente.
 */

export const PAYMENT_METHOD_GROUPS = {
  CARD: 'card',
  PIX: 'pix',
  BOLETO: 'boleto',
};

/**
 * Cria um plano vazio com defaults conservadores (PagSmile-friendly).
 */
export function createEmptyPlan() {
  return {
    // Identificação
    name: '',
    code: '',
    description: '',
    type: 'padrao', // padrao | enterprise | custom
    status: 'draft', // draft | active | archived
    tpv_suggested: '',
    popular: false,

    // ===== CARTÃO =====
    card: {
      mdr_1x: 3.99,            // MDR à vista
      mdr_2_6x: 4.49,          // MDR 2x a 6x
      mdr_7_12x: 5.49,         // MDR 7x a 12x
      gateway_approved: 0.49,  // R$ por transação aprovada
      gateway_declined: 0.00,  // R$ por transação recusada
      threeds_per_auth: 0.30,  // R$ por autenticação 3DS
      threeds_only_authenticated: true, // cobrar 3DS só nas autenticadas
      antifraud_per_tx: 0.70,  // R$ por análise antifraude
      pre_chargeback_alert: 8.00, // R$ por alerta de pré-CB
      chargeback_fee: 30.00,   // R$ multa por CB
      reserve_pct: 10.00,      // Rolling reserve %
      reserve_days: 60,        // Prazo de retenção
    },

    // ===== PIX =====
    pix: {
      rate_pct: 0.99,          // % sobre valor
      fixed_fee: 0.00,         // R$ fixo
      antifraud_per_tx: 0.08,  // R$ antifraude PIX
      reserve_pct: 5.00,       // Retenção PIX %
    },

    // ===== BOLETO =====
    boleto: {
      fixed_fee: 2.90,         // R$ por boleto emitido
      paid_fee: 0.00,          // R$ adicional por boleto pago
    },

    // ===== ANTECIPAÇÃO =====
    anticipation: {
      settlement_term: 'D+30', // Prazo padrão de liquidação
      rate_monthly: 1.99,      // Taxa de antecipação ao mês
      fee_per_op: 0.20,        // R$ fixo por operação
      d1_rate: 2.29,           // Taxa para D+1 (se ofertado)
      d2_rate: 1.99,           // Taxa para D+2
    },
  };
}

/**
 * Catálogo das categorias de custo para visualização tabular
 * (usado no PlanFullSummary).
 */
export const COST_CATEGORIES = [
  {
    id: 'card',
    label: 'Cartão de Crédito',
    icon: '💳',
    items: [
      { key: 'card.mdr_1x', label: 'MDR à vista (1x)', unit: '%' },
      { key: 'card.mdr_2_6x', label: 'MDR parcelado 2x–6x', unit: '%' },
      { key: 'card.mdr_7_12x', label: 'MDR parcelado 7x–12x', unit: '%' },
    ],
  },
  {
    id: 'pix',
    label: 'PIX',
    icon: '⚡',
    items: [
      { key: 'pix.rate_pct', label: 'Taxa PIX', unit: '%' },
      { key: 'pix.fixed_fee', label: 'Taxa fixa PIX', unit: 'R$' },
    ],
  },
  {
    id: 'anticipation',
    label: 'Antecipação',
    icon: '⏱️',
    items: [
      { key: 'anticipation.rate_monthly', label: 'Taxa de antecipação (a.m.)', unit: '%' },
      { key: 'anticipation.fee_per_op', label: 'Tarifa por operação', unit: 'R$' },
    ],
  },
  {
    id: 'per_tx',
    label: 'Custos por transação',
    icon: '🔧',
    items: [
      { key: 'card.gateway_approved', label: 'Gateway (aprovada)', unit: 'R$' },
      { key: 'card.gateway_declined', label: 'Gateway (recusada)', unit: 'R$' },
      { key: 'card.threeds_per_auth', label: '3DS (autenticação)', unit: 'R$' },
      { key: 'card.antifraud_per_tx', label: 'Antifraude (cartão)', unit: 'R$' },
      { key: 'pix.antifraud_per_tx', label: 'Antifraude (PIX)', unit: 'R$' },
    ],
  },
  {
    id: 'risk',
    label: 'Risco & Chargeback',
    icon: '🛡️',
    items: [
      { key: 'card.pre_chargeback_alert', label: 'Alerta de pré-chargeback', unit: 'R$' },
      { key: 'card.chargeback_fee', label: 'Multa por chargeback', unit: 'R$' },
      { key: 'card.reserve_pct', label: 'Rolling reserve (cartão)', unit: '%' },
      { key: 'pix.reserve_pct', label: 'Retenção PIX', unit: '%' },
    ],
  },
];

/**
 * Helper: acessa caminhos aninhados ('card.mdr_1x' → plan.card.mdr_1x)
 */
export function getByPath(obj, path) {
  return path.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
}

/**
 * Formata valor conforme unidade.
 */
export function formatUnit(value, unit) {
  if (value == null || value === '') return '—';
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  if (unit === '%') return `${n.toFixed(2)}%`;
  if (unit === 'R$') return `R$ ${n.toFixed(2).replace('.', ',')}`;
  return String(value);
}

/**
 * Templates pré-definidos.
 */
export const PLAN_TEMPLATES = {
  starter: {
    name: 'Starter',
    code: 'STARTER',
    description: 'Para quem está começando',
    type: 'padrao',
    card: { mdr_1x: 4.99, mdr_2_6x: 5.49, mdr_7_12x: 6.49, gateway_approved: 0.49, gateway_declined: 0, threeds_per_auth: 0.30, threeds_only_authenticated: true, antifraud_per_tx: 0.79, pre_chargeback_alert: 8, chargeback_fee: 30, reserve_pct: 10, reserve_days: 60 },
    pix: { rate_pct: 1.49, fixed_fee: 0, antifraud_per_tx: 0.08, reserve_pct: 5 },
    boleto: { fixed_fee: 3.90, paid_fee: 0 },
    anticipation: { settlement_term: 'D+30', rate_monthly: 2.59, fee_per_op: 0.30, d1_rate: 2.89, d2_rate: 2.59 },
  },
  growth: {
    name: 'Growth',
    code: 'GROWTH',
    description: 'Para negócios em expansão',
    type: 'padrao',
    popular: true,
    card: { mdr_1x: 3.99, mdr_2_6x: 4.49, mdr_7_12x: 5.49, gateway_approved: 0.39, gateway_declined: 0, threeds_per_auth: 0.30, threeds_only_authenticated: true, antifraud_per_tx: 0.59, pre_chargeback_alert: 8, chargeback_fee: 25, reserve_pct: 7, reserve_days: 45 },
    pix: { rate_pct: 0.99, fixed_fee: 0, antifraud_per_tx: 0.08, reserve_pct: 5 },
    boleto: { fixed_fee: 2.90, paid_fee: 0 },
    anticipation: { settlement_term: 'D+15', rate_monthly: 2.29, fee_per_op: 0.20, d1_rate: 2.49, d2_rate: 2.29 },
  },
  pro: {
    name: 'Pro',
    code: 'PRO',
    description: 'Solução completa',
    type: 'padrao',
    card: { mdr_1x: 3.29, mdr_2_6x: 3.79, mdr_7_12x: 4.79, gateway_approved: 0.29, gateway_declined: 0, threeds_per_auth: 0.20, threeds_only_authenticated: true, antifraud_per_tx: 0.49, pre_chargeback_alert: 6, chargeback_fee: 20, reserve_pct: 5, reserve_days: 30 },
    pix: { rate_pct: 0.89, fixed_fee: 0, antifraud_per_tx: 0.06, reserve_pct: 3 },
    boleto: { fixed_fee: 2.50, paid_fee: 0 },
    anticipation: { settlement_term: 'D+7', rate_monthly: 1.99, fee_per_op: 0.20, d1_rate: 2.19, d2_rate: 1.99 },
  },
  enterprise: {
    name: 'Enterprise',
    code: 'ENTERPRISE',
    description: 'Custom para alto volume',
    type: 'enterprise',
    card: { mdr_1x: 2.79, mdr_2_6x: 3.19, mdr_7_12x: 3.99, gateway_approved: 0.19, gateway_declined: 0, threeds_per_auth: 0.15, threeds_only_authenticated: true, antifraud_per_tx: 0.39, pre_chargeback_alert: 5, chargeback_fee: 15, reserve_pct: 0, reserve_days: 0 },
    pix: { rate_pct: 0.59, fixed_fee: 0, antifraud_per_tx: 0.05, reserve_pct: 0 },
    boleto: { fixed_fee: 1.90, paid_fee: 0 },
    anticipation: { settlement_term: 'D+2', rate_monthly: 1.49, fee_per_op: 0.15, d1_rate: 1.79, d2_rate: 1.49 },
  },
};