// Mock data for Spread MDR matrix (F1521-F1565)

export const CARD_BRANDS = {
  visa: { label: 'Visa', icon: '💳', color: 'bg-blue-100 text-blue-700' },
  mastercard: { label: 'Mastercard', icon: '🔴', color: 'bg-red-100 text-red-700' },
  elo: { label: 'Elo', icon: '🟡', color: 'bg-yellow-100 text-yellow-700' },
  amex: { label: 'Amex', icon: '🔵', color: 'bg-blue-100 text-blue-700' },
  hipercard: { label: 'Hipercard', icon: '🟠', color: 'bg-orange-100 text-orange-700' },
};

export const PAYMENT_MODALITIES = {
  credit_1x: { label: 'Crédito 1x', short: 'C1' },
  credit_2_6x: { label: 'Crédito 2-6x', short: 'C2-6' },
  credit_7_12x: { label: 'Crédito 7-12x', short: 'C7-12' },
  credit_13_18x: { label: 'Crédito 13-18x', short: 'C13-18' },
  debit: { label: 'Débito', short: 'D' },
  prepaid: { label: 'Pré-pago', short: 'P' },
};

export const CHANNELS_FOR_MDR = {
  pos: { label: 'POS', short: 'POS' },
  ecommerce: { label: 'E-commerce', short: 'EC' },
  paylink: { label: 'Pay Link', short: 'PL' },
  recurrence: { label: 'Recorrência', short: 'REC' },
};

// Matriz: cada célula é uma combinação (brand × modality × channel)
export const MOCK_SPREAD_MDR = [
  // Visa Crédito 1x
  { id: 'mdr_001', project_id: 'prj_001', brand: 'visa', modality: 'credit_1x', channel: 'ecommerce', mdr_base: 1.99, spread: 0.91, mdr_min: 2.90, observed_avg: 3.15, plans_using: 12, merchants_count: 1840, monthly_tpv: 320_000_000, last_modified: '2026-04-22T10:30:00' },
  { id: 'mdr_002', project_id: 'prj_001', brand: 'visa', modality: 'credit_1x', channel: 'pos', mdr_base: 1.79, spread: 0.71, mdr_min: 2.50, observed_avg: 2.75, plans_using: 8, merchants_count: 920, monthly_tpv: 180_000_000, last_modified: '2026-04-22T10:30:00' },
  { id: 'mdr_003', project_id: 'prj_001', brand: 'visa', modality: 'credit_1x', channel: 'paylink', mdr_base: 2.09, spread: 0.91, mdr_min: 3.00, observed_avg: 3.25, plans_using: 6, merchants_count: 540, monthly_tpv: 78_000_000, last_modified: '2026-04-22T10:30:00' },
  // Visa Crédito 2-6x
  { id: 'mdr_004', project_id: 'prj_001', brand: 'visa', modality: 'credit_2_6x', channel: 'ecommerce', mdr_base: 2.49, spread: 1.21, mdr_min: 3.70, observed_avg: 3.95, plans_using: 12, merchants_count: 1840, monthly_tpv: 215_000_000, last_modified: '2026-04-22T10:30:00' },
  { id: 'mdr_005', project_id: 'prj_001', brand: 'visa', modality: 'credit_2_6x', channel: 'pos', mdr_base: 2.29, spread: 1.21, mdr_min: 3.50, observed_avg: 3.78, plans_using: 8, merchants_count: 920, monthly_tpv: 95_000_000, last_modified: '2026-04-22T10:30:00' },
  // Visa Crédito 7-12x
  { id: 'mdr_006', project_id: 'prj_001', brand: 'visa', modality: 'credit_7_12x', channel: 'ecommerce', mdr_base: 3.49, spread: 1.41, mdr_min: 4.90, observed_avg: 5.18, plans_using: 10, merchants_count: 1240, monthly_tpv: 142_000_000, last_modified: '2026-04-22T10:30:00' },
  // Visa Débito
  { id: 'mdr_007', project_id: 'prj_001', brand: 'visa', modality: 'debit', channel: 'ecommerce', mdr_base: 0.89, spread: 0.41, mdr_min: 1.30, observed_avg: 1.42, plans_using: 12, merchants_count: 1840, monthly_tpv: 88_000_000, last_modified: '2026-04-22T10:30:00' },
  { id: 'mdr_008', project_id: 'prj_001', brand: 'visa', modality: 'debit', channel: 'pos', mdr_base: 0.69, spread: 0.31, mdr_min: 1.00, observed_avg: 1.12, plans_using: 8, merchants_count: 920, monthly_tpv: 145_000_000, last_modified: '2026-04-22T10:30:00' },
  // Mastercard Crédito 1x
  { id: 'mdr_009', project_id: 'prj_001', brand: 'mastercard', modality: 'credit_1x', channel: 'ecommerce', mdr_base: 1.95, spread: 0.95, mdr_min: 2.90, observed_avg: 3.18, plans_using: 12, merchants_count: 1820, monthly_tpv: 310_000_000, last_modified: '2026-04-22T10:30:00' },
  { id: 'mdr_010', project_id: 'prj_001', brand: 'mastercard', modality: 'credit_1x', channel: 'pos', mdr_base: 1.75, spread: 0.75, mdr_min: 2.50, observed_avg: 2.78, plans_using: 8, merchants_count: 900, monthly_tpv: 175_000_000, last_modified: '2026-04-22T10:30:00' },
  { id: 'mdr_011', project_id: 'prj_001', brand: 'mastercard', modality: 'credit_2_6x', channel: 'ecommerce', mdr_base: 2.45, spread: 1.25, mdr_min: 3.70, observed_avg: 3.92, plans_using: 12, merchants_count: 1820, monthly_tpv: 210_000_000, last_modified: '2026-04-22T10:30:00' },
  { id: 'mdr_012', project_id: 'prj_001', brand: 'mastercard', modality: 'credit_7_12x', channel: 'ecommerce', mdr_base: 3.45, spread: 1.45, mdr_min: 4.90, observed_avg: 5.20, plans_using: 10, merchants_count: 1220, monthly_tpv: 138_000_000, last_modified: '2026-04-22T10:30:00' },
  { id: 'mdr_013', project_id: 'prj_001', brand: 'mastercard', modality: 'debit', channel: 'ecommerce', mdr_base: 0.85, spread: 0.45, mdr_min: 1.30, observed_avg: 1.45, plans_using: 12, merchants_count: 1820, monthly_tpv: 86_000_000, last_modified: '2026-04-22T10:30:00' },
  // Elo
  { id: 'mdr_014', project_id: 'prj_001', brand: 'elo', modality: 'credit_1x', channel: 'ecommerce', mdr_base: 2.19, spread: 1.21, mdr_min: 3.40, observed_avg: 3.65, plans_using: 9, merchants_count: 1240, monthly_tpv: 92_000_000, last_modified: '2026-04-22T10:30:00' },
  { id: 'mdr_015', project_id: 'prj_001', brand: 'elo', modality: 'credit_2_6x', channel: 'ecommerce', mdr_base: 2.69, spread: 1.51, mdr_min: 4.20, observed_avg: 4.45, plans_using: 9, merchants_count: 1240, monthly_tpv: 65_000_000, last_modified: '2026-04-22T10:30:00' },
  { id: 'mdr_016', project_id: 'prj_001', brand: 'elo', modality: 'debit', channel: 'pos', mdr_base: 0.95, spread: 0.55, mdr_min: 1.50, observed_avg: 1.62, plans_using: 7, merchants_count: 720, monthly_tpv: 38_000_000, last_modified: '2026-04-22T10:30:00' },
  // Amex
  { id: 'mdr_017', project_id: 'prj_001', brand: 'amex', modality: 'credit_1x', channel: 'ecommerce', mdr_base: 3.49, spread: 1.41, mdr_min: 4.90, observed_avg: 5.12, plans_using: 4, merchants_count: 320, monthly_tpv: 42_000_000, last_modified: '2026-04-22T10:30:00' },
  { id: 'mdr_018', project_id: 'prj_001', brand: 'amex', modality: 'credit_2_6x', channel: 'ecommerce', mdr_base: 3.99, spread: 1.71, mdr_min: 5.70, observed_avg: 5.95, plans_using: 4, merchants_count: 320, monthly_tpv: 28_000_000, last_modified: '2026-04-22T10:30:00' },
  // Hipercard
  { id: 'mdr_019', project_id: 'prj_001', brand: 'hipercard', modality: 'credit_1x', channel: 'pos', mdr_base: 2.39, spread: 1.21, mdr_min: 3.60, observed_avg: 3.82, plans_using: 5, merchants_count: 380, monthly_tpv: 18_000_000, last_modified: '2026-04-22T10:30:00' },
];

// Evolução temporal de spreads — F1535
export const MOCK_SPREAD_EVOLUTION = [
  { month: '2024-06', avg_spread: 0.95, total_spread_revenue: 8_400_000 },
  { month: '2024-09', avg_spread: 0.98, total_spread_revenue: 9_100_000 },
  { month: '2024-12', avg_spread: 1.02, total_spread_revenue: 10_200_000 },
  { month: '2025-03', avg_spread: 1.05, total_spread_revenue: 11_400_000 },
  { month: '2025-06', avg_spread: 1.08, total_spread_revenue: 12_100_000 },
  { month: '2025-09', avg_spread: 1.12, total_spread_revenue: 13_200_000 },
  { month: '2025-12', avg_spread: 1.15, total_spread_revenue: 14_100_000 },
  { month: '2026-03', avg_spread: 1.18, total_spread_revenue: 15_400_000 },
];

// Comparativo entre projetos similares — F1559
export const MOCK_INTER_PROJECT_BENCHMARK = [
  { project_name: 'Mentor BR (atual)', avg_spread: 1.18, monthly_revenue: 15_400_000, margin: 0.245, current: true },
  { project_name: 'Mentor MX', avg_spread: 1.42, monthly_revenue: 8_200_000, margin: 0.281 },
  { project_name: 'Mentor CO', avg_spread: 1.35, monthly_revenue: 4_100_000, margin: 0.272 },
  { project_name: 'Pagsmile Acquirer BR', avg_spread: 0.95, monthly_revenue: 22_500_000, margin: 0.198 },
  { project_name: 'Setor (média 5 maiores)', avg_spread: 1.12, monthly_revenue: 18_000_000, margin: 0.230 },
];

// Planos abaixo do mínimo — F1545
export const MOCK_PLANS_BELOW_MINIMUM = [
  { plan_id: 'plan_087', plan_name: 'Plano Black Friday Especial', merchants: 42, brand: 'visa', modality: 'credit_2_6x', current_mdr: 3.45, new_min: 3.70, gap: -0.25 },
  { plan_id: 'plan_104', plan_name: 'Promo Q1 2026', merchants: 28, brand: 'mastercard', modality: 'credit_2_6x', current_mdr: 3.50, new_min: 3.70, gap: -0.20 },
  { plan_id: 'plan_119', plan_name: 'Parceria Bradesco', merchants: 12, brand: 'visa', modality: 'credit_7_12x', current_mdr: 4.65, new_min: 4.90, gap: -0.25 },
];

export const fmt = (v) => {
  if (v == null) return '—';
  if (Math.abs(v) >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1)}mi`;
  if (Math.abs(v) >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}k`;
  return `R$ ${v.toFixed(2)}`;
};

export const SPREAD_POLICY = {
  spread_min: 0.20,
  spread_max: 3.00,
  spread_alert_threshold: 2.00, // alerta se acima
};