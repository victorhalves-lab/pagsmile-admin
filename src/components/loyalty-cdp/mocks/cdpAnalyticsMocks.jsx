// Mocks adicionais para as novas views de CDP/CRM

export const cdpDashboardKpis = {
  total_customers: 22982,
  total_customers_pct: 82.74,
  messages_sent: 96822,
  messages_sent_pct: 89.84,
  conversions: 11282,
  conversions_pct: 11.65,
  revenue: 514000,
  revenue_pct: 49.9,
  recovered_customers: 917,
  recovered_revenue: 40652,
  recurring_customers: 3191,
  recurring_revenue: 155204,
};

// Dados de cohort mensais expandidos (12 meses)
export const cohortRetentionData = [
  { month: 'set/2023', customers: 2910, m1: 38, m2: 37, m3: 34, m4: 34, m5: 31, m6: 30, m7: 28, m8: 29, m9: 26, m10: 26, m11: 24, m12: 25 },
  { month: 'out/2023', customers: 1273, m1: 29, m2: 27, m3: 25, m4: 21, m5: 20, m6: 19, m7: 19, m8: 18, m9: 16, m10: 16, m11: 17, m12: null },
  { month: 'nov/2023', customers: 1131, m1: 22, m2: 19, m3: 19, m4: 17, m5: 15, m6: 17, m7: 14, m8: 14, m9: 13, m10: 14, m11: null, m12: null },
  { month: 'dez/2023', customers: 1024, m1: 18, m2: 15, m3: 15, m4: 11, m5: 14, m6: 11, m7: 12, m8: 10, m9: null, m10: null, m11: null, m12: null },
  { month: 'jan/2024', customers: 1075, m1: 15, m2: 10, m3: 11, m4: 11, m5: 10, m6: 11, m7: 9, m8: null, m9: null, m10: null, m11: null, m12: null },
  { month: 'fev/2024', customers: 833, m1: 15, m2: 14, m3: 12, m4: 13, m5: 11, m6: 9, m7: 10, m8: null, m9: null, m10: null, m11: null, m12: null },
  { month: 'mar/2024', customers: 682, m1: 14, m2: 14, m3: 13, m4: 11, m5: 10, m6: 10, m7: null, m8: null, m9: null, m10: null, m11: null, m12: null },
  { month: 'abr/2024', customers: 688, m1: 14, m2: 13, m3: 11, m4: 10, m5: 9, m6: null, m7: null, m8: null, m9: null, m10: null, m11: null, m12: null },
  { month: 'mai/2024', customers: 904, m1: 14, m2: 9, m3: 8, m4: 7, m5: null, m6: null, m7: null, m8: null, m9: null, m10: null, m11: null, m12: null },
  { month: 'jun/2024', customers: 599, m1: 15, m2: 12, m3: 11, m4: null, m5: null, m6: null, m7: null, m8: null, m9: null, m10: null, m11: null, m12: null },
  { month: 'jul/2024', customers: 677, m1: 8, m2: 7, m3: null, m4: null, m5: null, m6: null, m7: null, m8: null, m9: null, m10: null, m11: null, m12: null },
  { month: 'ago/2024', customers: 453, m1: 13, m2: null, m3: null, m4: null, m5: null, m6: null, m7: null, m8: null, m9: null, m10: null, m11: null, m12: null },
  { month: 'set/2024', customers: 492, m1: null, m2: null, m3: null, m4: null, m5: null, m6: null, m7: null, m8: null, m9: null, m10: null, m11: null, m12: null },
];

// Taxa de recompra (1ª para 2ª, 2ª para 3ª, etc.)
export const repurchaseRateData = [
  { label: '1ª p/ 2ª', rate: 55.02, total: 17857, pct_customers: 55.02 },
  { label: '2ª p/ 3ª', rate: 75.06, total: 9650, pct_customers: 41.97 },
  { label: '3ª p/ 4ª', rate: 82.11, total: 7924, pct_customers: 34.47 },
  { label: '4ª p/ 5ª', rate: 85.03, total: 6808, pct_customers: 29.62 },
  { label: '5ª p/ 6ª', rate: 88.91, total: 6054, pct_customers: 26.33 },
  { label: '6ª p/ 7ª', rate: 90.47, total: 5477, pct_customers: 23.82 },
  { label: '7ª p/ 8ª', rate: 91.02, total: 4989, pct_customers: 21.70 },
  { label: '8ª p/ 9ª', rate: 92.38, total: 4608, pct_customers: 20.04 },
  { label: '9ª p/ 10ª', rate: 92.73, total: 4273, pct_customers: 18.59 },
];

// Tempo entre compras
export const timeBetweenPurchasesData = [
  { label: '1ª p/ 2ª', avg_days: 128.18, median_days: 34, total: 12857 },
  { label: '2ª p/ 3ª', avg_days: 88.35, median_days: 25, total: 9630 },
  { label: '3ª p/ 4ª', avg_days: 71.78, median_days: 20, total: 7924 },
  { label: '4ª p/ 5ª', avg_days: 58.51, median_days: 18, total: 6808 },
  { label: '5ª p/ 6ª', avg_days: 54.96, median_days: 16, total: 6054 },
  { label: '6ª p/ 7ª', avg_days: 49.47, median_days: 15, total: 5477 },
  { label: '7ª p/ 8ª', avg_days: 45.02, median_days: 14, total: 4989 },
  { label: '8ª p/ 9ª', avg_days: 42.31, median_days: 13, total: 4608 },
  { label: '9ª p/ 10ª', avg_days: 39.88, median_days: 12, total: 4273 },
  { label: '10ª p/ 11ª', avg_days: 37.91, median_days: 12, total: 3950 },
];

// Evolução de vendas por mês
export const salesEvolutionData = [
  { month: 'abr/2024', new_customers: 936, returning: 3093, total: 4029, PoP: 3.58 },
  { month: 'mai/2024', new_customers: 743, returning: 3572, total: 4315, PoP: 7.10 },
  { month: 'jun/2024', new_customers: 512, returning: 3524, total: 4036, PoP: 6.47 },
  { month: 'jul/2024', new_customers: 620, returning: 3504, total: 4124, PoP: 2.18 },
  { month: 'ago/2024', new_customers: 406, returning: 3244, total: 3650, PoP: -11.49 },
  { month: 'set/2024', new_customers: 402, returning: 3613, total: 4015, PoP: 10.00 },
  { month: 'out/2024', new_customers: 28, returning: 189, total: 217, PoP: 94.60 },
];

// Canais de venda por mês
export const salesChannelsData = [
  { month: 'abr/2024', site: 2078, loja: 1073, ifood: 517, app: 383 },
  { month: 'mai/2024', site: 2222, loja: 1102, ifood: 648, app: 343 },
  { month: 'jun/2024', site: 2009, loja: 1114, ifood: 557, app: 356 },
  { month: 'jul/2024', site: 2077, loja: 1084, ifood: 823, app: 340 },
  { month: 'ago/2024', site: 2010, loja: 997, ifood: 301, app: 342 },
  { month: 'set/2024', site: 2106, loja: 1312, ifood: 369, app: 228 },
  { month: 'out/2024', site: 113, loja: 85, ifood: 22, app: 17 },
];

// RFV Simplificado (barras)
export const rfvSimplifiedData = [
  { status: 'Campeões', count: 214, pct: 3.93, color: '#2bc196' },
  { status: 'Fiéis', count: 1612, pct: 7.01, color: '#3b82f6' },
  { status: 'Promissores', count: 820, pct: 3.57, color: '#8b5cf6' },
  { status: 'Em risco', count: 13105, pct: 57.02, color: '#f59e0b' },
  { status: 'Perdidos', count: 7231, pct: 31.48, color: '#ef4444' },
];

// RFV Detalhado (treemap / grid posicional)
export const rfvDetailedData = [
  // { name, r, f_v, count, pct, color }
  { name: 'Campeões', r: 5, fv: 5, count: 214, pct: 0.99, color: '#2bc196', bg: '#dcfce7' },
  { name: 'Fiéis', r: 5, fv: 4, count: 1615, pct: 7.03, color: '#3b82f6', bg: '#dbeafe' },
  { name: 'Não perder', r: 5, fv: 2, count: 251, pct: 1.10, color: '#f59e0b', bg: '#fef3c7' },
  { name: 'Em risco', r: 4, fv: 3, count: 11498, pct: 50.49, color: '#f59e0b', bg: '#fef3c7' },
  { name: 'Atenção', r: 3, fv: 3, count: 624, pct: 2.74, color: '#8b5cf6', bg: '#ede9fe' },
  { name: 'Potencial fiéis', r: 3, fv: 4, count: 740, pct: 3.25, color: '#8b5cf6', bg: '#ede9fe' },
  { name: 'Perdidos', r: 2, fv: 1, count: 7184, pct: 31.54, color: '#ef4444', bg: '#fee2e2' },
  { name: 'Hibernados', r: 2, fv: 2, count: 430, pct: 1.89, color: '#94a3b8', bg: '#f1f5f9' },
  { name: 'Prestes a hibernar', r: 2, fv: 3, count: 189, pct: 0.83, color: '#f97316', bg: '#fff7ed' },
  { name: 'Promissores', r: 1, fv: 4, count: 4, pct: 0.02, color: '#06b6d4', bg: '#cffafe' },
  { name: 'Clientes recentes', r: 1, fv: 5, count: 6, pct: 0.03, color: '#f59e0b', bg: '#fef9c3' },
];

// Timeline de eventos de cliente (enriquecida)
export const customerTimelineEvents = [
  { type: 'whatsapp', title: 'Recebeu um WhatsApp', desc: 'Campanha: TAPIOCA [10% OFF]', date: '2024-09-26 14:22', campaign: 'TAPIOCA [10% OFF]' },
  { type: 'rfv_change', title: 'Mudou status RFV', desc: 'Clientes campeões', date: '2024-09-26 01:05' },
  { type: 'purchase', title: 'Realizou uma compra', desc: 'Canal: aplicativo · R$ 68,40', date: '2024-09-25 22:08', coupon: 'NAT05' },
  { type: 'rfv_change', title: 'Mudou status RFV', desc: 'Clientes fiéis', date: '2024-09-23 01:13' },
  { type: 'whatsapp', title: 'Recebeu um WhatsApp', desc: 'Campanha: TAPIOCA [10% OFF]', date: '2024-09-19 18:44', campaign: 'TAPIOCA [10% OFF]' },
  { type: 'purchase', title: 'Realizou uma compra', desc: 'Canal: aplicativo · R$ 74,57', date: '2024-09-14 18:51', coupon: 'NAT05' },
  { type: 'whatsapp', title: 'Recebeu um WhatsApp', desc: 'Campanha: TAPIOCA [10% OFF]', date: '2024-09-13 17:32', campaign: 'TAPIOCA [10% OFF]' },
];

// Performance de campanhas (tabela detalhada)
export const campaignPerformanceData = [
  { name: '2 Pras Di Matteo', audience: 13887, clients_eligible: 404, msgs_eligible: 494, msgs_sent: 487, conversions: 51, conv_unique: 4, conv_coupon: 77, revenue: 2625.47, cost: 18.55, roas: '1 CLIER' },
  { name: 'BRI CADEIRO E SEGUNDO GRÁTIS – AVISO', audience: 14361, clients_eligible: 76, msgs_eligible: 70, msgs_sent: 78, conversions: 5, conv_unique: 5, conv_coupon: 30, revenue: 210.00, cost: 5.20, roas: null },
  { name: 'Brigadeiro de Pistache', audience: 177, clients_eligible: 203, msgs_eligible: 266, msgs_sent: 268, conversions: 60, conv_unique: 40, conv_coupon: 76, revenue: 8026.92, cost: 192.53, roas: 5.47 },
  { name: 'CREME DE NOZES – CAMPÕES', audience: 100, clients_eligible: 416, msgs_eligible: 942, msgs_sent: 302, conversions: 200, conv_unique: 125, conv_coupon: 100, revenue: 16864.76, cost: 148.22, roas: 13.96 },
  { name: 'Clientes aniversariantes', audience: 0, clients_eligible: 445, msgs_eligible: 449, msgs_sent: 616, conversions: 97, conv_unique: 10, conv_coupon: 77, revenue: 2307.09, cost: 28.14, roas: 1.77 },
];