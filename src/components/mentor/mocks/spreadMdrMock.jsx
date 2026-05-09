// Mock data for Spread MDR Matrix (F1521-F1565)

export const CARD_BRANDS = {
  visa: { label: 'Visa', color: 'bg-blue-600 text-white', icon: '💳' },
  mastercard: { label: 'Mastercard', color: 'bg-orange-600 text-white', icon: '💳' },
  elo: { label: 'Elo', color: 'bg-yellow-500 text-white', icon: '💳' },
  amex: { label: 'Amex', color: 'bg-cyan-700 text-white', icon: '💳' },
  hipercard: { label: 'Hipercard', color: 'bg-red-600 text-white', icon: '💳' },
};

export const MODALITIES = {
  debit: { label: 'Débito', color: 'bg-emerald-100 text-emerald-700' },
  credit_1x: { label: 'Crédito à vista', color: 'bg-blue-100 text-blue-700' },
  credit_2_6x: { label: 'Crédito 2-6x', color: 'bg-violet-100 text-violet-700' },
  credit_7_12x: { label: 'Crédito 7-12x', color: 'bg-pink-100 text-pink-700' },
};

export const CHANNELS = {
  pos: { label: 'POS', icon: '🏪' },
  ecommerce: { label: 'E-commerce', icon: '🌐' },
  paylink: { label: 'Pay Link', icon: '🔗' },
  recurrence: { label: 'Recorrência', icon: '🔁' },
};

// Cada cell representa o spread MDR mínimo cobrado pela PagSmile naquela combinação
// MDR efetivo = MDR base bandeira (interchange + brand fee) + Spread PagSmile
export const MOCK_SPREAD_MDR = [
  // VISA
  { id: 'mdr_001', project_id: 'prj_001', brand: 'visa', modality: 'debit', channel: 'pos', spread: 0.45, mdr_base: 0.95, last_modified: '2026-04-12T10:00:00', applied_count: 4250 },
  { id: 'mdr_002', project_id: 'prj_001', brand: 'visa', modality: 'debit', channel: 'ecommerce', spread: 0.55, mdr_base: 1.05, last_modified: '2026-04-12T10:00:00', applied_count: 8120 },
  { id: 'mdr_003', project_id: 'prj_001', brand: 'visa', modality: 'credit_1x', channel: 'pos', spread: 0.85, mdr_base: 1.55, last_modified: '2026-04-12T10:00:00', applied_count: 12400 },
  { id: 'mdr_004', project_id: 'prj_001', brand: 'visa', modality: 'credit_1x', channel: 'ecommerce', spread: 1.15, mdr_base: 1.95, last_modified: '2026-05-01T14:00:00', applied_count: 18900 },
  { id: 'mdr_005', project_id: 'prj_001', brand: 'visa', modality: 'credit_2_6x', channel: 'ecommerce', spread: 1.45, mdr_base: 2.45, last_modified: '2026-05-01T14:00:00', applied_count: 9200 },
  { id: 'mdr_006', project_id: 'prj_001', brand: 'visa', modality: 'credit_7_12x', channel: 'ecommerce', spread: 1.95, mdr_base: 2.95, last_modified: '2026-05-01T14:00:00', applied_count: 6100 },
  // MASTERCARD
  { id: 'mdr_007', project_id: 'prj_001', brand: 'mastercard', modality: 'debit', channel: 'pos', spread: 0.45, mdr_base: 0.98, last_modified: '2026-04-12T10:00:00', applied_count: 3920 },
  { id: 'mdr_008', project_id: 'prj_001', brand: 'mastercard', modality: 'debit', channel: 'ecommerce', spread: 0.55, mdr_base: 1.08, last_modified: '2026-04-12T10:00:00', applied_count: 7600 },
  { id: 'mdr_009', project_id: 'prj_001', brand: 'mastercard', modality: 'credit_1x', channel: 'pos', spread: 0.85, mdr_base: 1.58, last_modified: '2026-04-12T10:00:00', applied_count: 11800 },
  { id: 'mdr_010', project_id: 'prj_001', brand: 'mastercard', modality: 'credit_1x', channel: 'ecommerce', spread: 1.15, mdr_base: 1.98, last_modified: '2026-05-01T14:00:00', applied_count: 17200 },
  { id: 'mdr_011', project_id: 'prj_001', brand: 'mastercard', modality: 'credit_2_6x', channel: 'ecommerce', spread: 1.45, mdr_base: 2.48, last_modified: '2026-05-01T14:00:00', applied_count: 8800 },
  { id: 'mdr_012', project_id: 'prj_001', brand: 'mastercard', modality: 'credit_7_12x', channel: 'ecommerce', spread: 1.95, mdr_base: 2.98, last_modified: '2026-05-01T14:00:00', applied_count: 5800 },
  // ELO
  { id: 'mdr_013', project_id: 'prj_001', brand: 'elo', modality: 'credit_1x', channel: 'ecommerce', spread: 1.35, mdr_base: 2.15, last_modified: '2026-03-20T09:00:00', applied_count: 4200 },
  { id: 'mdr_014', project_id: 'prj_001', brand: 'elo', modality: 'credit_2_6x', channel: 'ecommerce', spread: 1.75, mdr_base: 2.85, last_modified: '2026-03-20T09:00:00', applied_count: 2100 },
  // AMEX
  { id: 'mdr_015', project_id: 'prj_001', brand: 'amex', modality: 'credit_1x', channel: 'ecommerce', spread: 1.85, mdr_base: 3.25, last_modified: '2026-02-15T11:30:00', applied_count: 1800 },
  { id: 'mdr_016', project_id: 'prj_001', brand: 'amex', modality: 'credit_2_6x', channel: 'ecommerce', spread: 2.25, mdr_base: 3.85, last_modified: '2026-02-15T11:30:00', applied_count: 950 },
  // HIPERCARD
  { id: 'mdr_017', project_id: 'prj_001', brand: 'hipercard', modality: 'credit_1x', channel: 'ecommerce', spread: 1.55, mdr_base: 2.45, last_modified: '2026-03-20T09:00:00', applied_count: 1200 },
  // PAYLINK + RECORRÊNCIA — alguns spreads diferenciados
  { id: 'mdr_018', project_id: 'prj_001', brand: 'visa', modality: 'credit_1x', channel: 'paylink', spread: 1.25, mdr_base: 1.95, last_modified: '2026-04-22T10:30:00', applied_count: 3400 },
  { id: 'mdr_019', project_id: 'prj_001', brand: 'visa', modality: 'credit_1x', channel: 'recurrence', spread: 0.95, mdr_base: 1.95, last_modified: '2026-04-12T10:00:00', applied_count: 5200 },
  { id: 'mdr_020', project_id: 'prj_001', brand: 'mastercard', modality: 'credit_1x', channel: 'recurrence', spread: 0.95, mdr_base: 1.98, last_modified: '2026-04-12T10:00:00', applied_count: 4900 },
];

export const MOCK_SPREAD_MDR_EVOLUTION = Array.from({ length: 18 }, (_, i) => {
  const month = new Date(2024, 11 + i, 1).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
  return {
    month,
    visa_credit_ec: 1.15 + (Math.sin(i / 3) * 0.1) + (i > 12 ? 0.05 : 0),
    mastercard_credit_ec: 1.15 + (Math.sin(i / 3 + 0.3) * 0.1) + (i > 12 ? 0.05 : 0),
    elo_credit_ec: 1.35 + (Math.sin(i / 4) * 0.08),
    benchmark_market: 1.45 + (Math.sin(i / 5) * 0.05),
  };
});

export const MOCK_PLANS_BELOW_MIN = [
  {
    plan_id: 'plan_001',
    plan_name: 'Plano Premium PJ Visa',
    merchant_count: 12,
    affected_combinations: ['visa·credit_1x·ecommerce'],
    plan_spread: 1.05,
    minimum_spread: 1.15,
    delta_pp: -0.10,
    estimated_revenue_loss: -42_000,
  },
  {
    plan_id: 'plan_002',
    plan_name: 'Acordo enterprise Casas Bahia',
    merchant_count: 1,
    affected_combinations: ['mastercard·credit_2_6x·ecommerce', 'visa·credit_2_6x·ecommerce'],
    plan_spread: 1.30,
    minimum_spread: 1.45,
    delta_pp: -0.15,
    estimated_revenue_loss: -85_000,
  },
];

export const MOCK_INTER_PROJECTS_BENCHMARK = [
  { project: 'PagSmile Brasil', spread_avg: 1.18, position: 1, current: true },
  { project: 'PagSmile México', spread_avg: 1.42, position: 2, current: false },
  { project: 'PagSmile Argentina', spread_avg: 1.35, position: 3, current: false },
  { project: 'Cliente XPTO White-label', spread_avg: 1.68, position: 4, current: false },
];

export const fmtPP = (v) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}pp`;