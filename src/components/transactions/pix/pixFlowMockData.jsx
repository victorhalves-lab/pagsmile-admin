/**
 * Mock data para PIX Automático, Biometria e Open Finance Hub.
 * Substitua por dados reais quando o backend estiver disponível.
 */

export const MANDATE_MOCK = [
  { id: 'm_001', customer: 'Maria Santos', plan: 'Premium Mensal', amount: 99.9, status: 'active', bank: 'Itaú', created_at: '2026-01-15', last_charge: '2026-05-01', next_charge: '2026-06-01', successful_charges: 4, failed_charges: 0 },
  { id: 'm_002', customer: 'João Pedro', plan: 'Básico', amount: 39.9, status: 'active', bank: 'Bradesco', created_at: '2026-02-10', last_charge: '2026-05-10', next_charge: '2026-06-10', successful_charges: 3, failed_charges: 1 },
  { id: 'm_003', customer: 'Ana Costa', plan: 'Premium Anual', amount: 999.0, status: 'revoked', bank: 'Nubank', created_at: '2025-11-22', last_charge: '2026-04-22', next_charge: null, successful_charges: 5, failed_charges: 0, revoked_at: '2026-05-05', revoke_reason: 'customer_request' },
  { id: 'm_004', customer: 'Carlos Lima', plan: 'Premium Mensal', amount: 99.9, status: 'active', bank: 'BTG', created_at: '2026-03-05', last_charge: '2026-05-05', next_charge: '2026-06-05', successful_charges: 2, failed_charges: 0 },
  { id: 'm_005', customer: 'Roberta Silva', plan: 'Premium Mensal', amount: 99.9, status: 'failed', bank: 'Inter', created_at: '2026-04-01', last_charge: '2026-05-01', next_charge: '2026-06-01', successful_charges: 0, failed_charges: 2 },
];

export const MANDATE_COHORT_MOCK = [
  { month: 'Jan', m1: 100, m2: 92, m3: 88, m4: 85, m5: 83 },
  { month: 'Fev', m1: 100, m2: 94, m3: 90, m4: 87, m5: null },
  { month: 'Mar', m1: 100, m2: 91, m3: 86, m4: null, m5: null },
  { month: 'Abr', m1: 100, m2: 95, m3: null, m4: null, m5: null },
  { month: 'Mai', m1: 100, m2: null, m3: null, m4: null, m5: null },
];

export const REVOCATION_REASONS = [
  { reason: 'Solicitação do cliente', count: 12, color: '#64748b' },
  { reason: 'Cartão recusado / sem saldo', count: 8, color: '#f59e0b' },
  { reason: 'Mudança de banco', count: 5, color: '#3b82f6' },
  { reason: 'Cancelamento de assinatura', count: 3, color: '#ef4444' },
];

export const BIOMETRIC_CONVERSION_BY_BANK = [
  { bank: 'Nubank', sessions: 1240, authorized: 1142, paid: 1098, conversion: 88.5 },
  { bank: 'Itaú', sessions: 980, authorized: 856, paid: 821, conversion: 83.8 },
  { bank: 'Bradesco', sessions: 765, authorized: 645, paid: 612, conversion: 80.0 },
  { bank: 'BTG', sessions: 432, authorized: 398, paid: 389, conversion: 90.0 },
  { bank: 'Inter', sessions: 521, authorized: 442, paid: 421, conversion: 80.8 },
  { bank: 'Santander', sessions: 389, authorized: 312, paid: 295, conversion: 75.8 },
];

export const BIOMETRIC_FAILURES = [
  { reason: 'Timeout biometria', count: 45, pct: 32 },
  { reason: 'Banco indisponível', count: 38, pct: 27 },
  { reason: 'Consentimento negado', count: 28, pct: 20 },
  { reason: 'Saldo insuficiente', count: 19, pct: 14 },
  { reason: 'Outro', count: 10, pct: 7 },
];

export const FLOW_COMPARISON = {
  manual: { conversion: 62, avg_journey: 185000, ticket_avg: 124, fraud_rate: 0.3 },
  biometric: { conversion: 89, avg_journey: 12000, ticket_avg: 218, fraud_rate: 0.02 },
  automatic: { success_rate_1st: 94, success_rate_3rd: 99.2, churn_monthly: 4.5 },
};

export const OF_CONSENTS_MOCK = [
  { id: 'c_001', customer: 'Maria Santos', bank: 'Itaú', status: 'active', purpose: 'PIX Automático', created_at: '2026-01-15', expires_at: '2027-01-15', usage_count: 4 },
  { id: 'c_002', customer: 'João Pedro', bank: 'Bradesco', status: 'active', purpose: 'PIX Biometria', created_at: '2026-04-20', expires_at: '2026-05-20', usage_count: 12 },
  { id: 'c_003', customer: 'Ana Costa', bank: 'Nubank', status: 'revoked', purpose: 'PIX Automático', created_at: '2025-11-22', expires_at: '2026-11-22', usage_count: 5 },
  { id: 'c_004', customer: 'Carlos Lima', bank: 'BTG', status: 'active', purpose: 'PIX Biometria', created_at: '2026-05-01', expires_at: '2026-06-01', usage_count: 3 },
  { id: 'c_005', customer: 'Roberta Silva', bank: 'Inter', status: 'expired', purpose: 'PIX Automático', created_at: '2025-04-01', expires_at: '2026-04-01', usage_count: 11 },
];

export const OF_BANK_HEALTH = [
  { bank: 'Itaú', code: '341', uptime: 99.8, avg_latency_ms: 1200, status: 'healthy' },
  { bank: 'Bradesco', code: '237', uptime: 98.9, avg_latency_ms: 1800, status: 'healthy' },
  { bank: 'Nubank', code: '260', uptime: 99.9, avg_latency_ms: 950, status: 'healthy' },
  { bank: 'BTG', code: '208', uptime: 99.6, avg_latency_ms: 1100, status: 'healthy' },
  { bank: 'Inter', code: '077', uptime: 96.2, avg_latency_ms: 2400, status: 'degraded' },
  { bank: 'Santander', code: '033', uptime: 92.1, avg_latency_ms: 4200, status: 'incident' },
  { bank: 'Caixa', code: '104', uptime: 95.5, avg_latency_ms: 3100, status: 'degraded' },
  { bank: 'Banco do Brasil', code: '001', uptime: 99.4, avg_latency_ms: 1500, status: 'healthy' },
];

export const OF_LIVE_JOURNEYS = [
  { id: 'j_001', customer: 'Cliente ***42', bank: 'Itaú', step: 'authorizing', flow: 'biometric', started_ms_ago: 3200 },
  { id: 'j_002', customer: 'Cliente ***18', bank: 'Nubank', step: 'paid', flow: 'biometric', started_ms_ago: 11500 },
  { id: 'j_003', customer: 'Cliente ***91', bank: 'Bradesco', step: 'consent', flow: 'automatic', started_ms_ago: 8200 },
  { id: 'j_004', customer: 'Cliente ***07', bank: 'BTG', step: 'authorizing', flow: 'biometric', started_ms_ago: 5400 },
  { id: 'j_005', customer: 'Cliente ***33', bank: 'Inter', step: 'failed', flow: 'biometric', started_ms_ago: 28000 },
];