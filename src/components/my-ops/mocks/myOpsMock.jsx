// Mock data for Entrega 10 — Operacional Self-Service (Admin Sub)
// MyLimitRequest · MyFraudAlerts · MyWebhookReplay · MyRollingReserve

export const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(v || 0);

// ============== MY LIMIT REQUEST ==============
export const myLimitsCurrent = {
  per_transaction: 50000,
  daily: 500000,
  monthly: 10000000,
  pix_per_transaction: 25000,
  pix_daily: 200000,
  utilization_30d: 68,
  avg_daily_use: 340000,
  peak_daily_use: 487000
};

export const myLimitRequests = [
  { id: 'lr_001', requested_at: '2026-04-15T14:22:00', type: 'monthly', current: 8000000, requested: 12000000, status: 'approved', approved_at: '2026-04-16T10:15:00', justification: 'Crescimento sazonal — campanha Dia das Mães', analyst_note: 'Aprovado: histórico positivo, ratio 0.08%' },
  { id: 'lr_002', requested_at: '2026-05-08T09:30:00', type: 'daily', current: 500000, requested: 750000, status: 'in_analysis', justification: 'Black Friday — preparação para volume sazonal', estimated_response: '2026-05-12' },
  { id: 'lr_003', requested_at: '2026-03-20T16:00:00', type: 'pix_daily', current: 150000, requested: 200000, status: 'approved', approved_at: '2026-03-21T11:00:00', justification: 'Aumento de uso PIX nas vendas', analyst_note: 'Aprovado parcialmente' }
];

export const limitTypeLabels = {
  per_transaction: 'Por transação (cartão)',
  daily: 'Diário (cartão)',
  monthly: 'Mensal (cartão)',
  pix_per_transaction: 'Por transação (PIX)',
  pix_daily: 'Diário (PIX)'
};

// ============== MY FRAUD ALERTS ==============
export const myFraudKpis = {
  alerts_30d: 23,
  active_alerts: 4,
  blocked_amount_30d: 18420.50,
  saved_chargebacks_estimated: 12,
  fraud_ratio: 0.18,
  industry_benchmark: 0.42,
  top_score_today: 87,
  rules_active: 14
};

export const myFraudAlerts = [
  { id: 'fa_001', detected_at: '2026-05-10T08:42:00', transaction_id: 'tx_card_44521', amount: 3850.00, score: 92, severity: 'high', card_brand: 'visa', card_last4: '4421', customer_email: 'suspeito@temp***.com', ip: '45.123.89.221', country: 'BR', city: 'Manaus', triggers: ['velocity_anomaly', 'new_device', 'high_amount_first_purchase'], action_taken: 'blocked', status: 'open' },
  { id: 'fa_002', detected_at: '2026-05-10T07:15:00', transaction_id: 'tx_card_44488', amount: 1240.00, score: 76, severity: 'medium', card_brand: 'mastercard', card_last4: '8821', customer_email: 'cliente@example.com', ip: '189.45.123.10', country: 'BR', city: 'São Paulo', triggers: ['multiple_attempts', '3ds_failed'], action_taken: 'review', status: 'pending' },
  { id: 'fa_003', detected_at: '2026-05-09T22:33:00', transaction_id: 'tx_card_44321', amount: 580.00, score: 68, severity: 'medium', card_brand: 'visa', card_last4: '1199', customer_email: 'novo@example.com', ip: '177.99.88.42', country: 'BR', city: 'Recife', triggers: ['cross_country_velocity'], action_taken: 'approved_with_3ds', status: 'resolved' },
  { id: 'fa_004', detected_at: '2026-05-09T18:11:00', transaction_id: 'tx_card_44285', amount: 12480.00, score: 88, severity: 'high', card_brand: 'visa', card_last4: '7733', customer_email: 'pj@empresa.com.br', ip: '189.45.123.99', country: 'BR', city: 'São Paulo', triggers: ['high_amount', 'new_customer'], action_taken: 'blocked', status: 'open' }
];

export const triggerLabels = {
  velocity_anomaly: 'Anomalia de velocidade',
  new_device: 'Dispositivo novo',
  high_amount_first_purchase: 'Valor alto na 1ª compra',
  multiple_attempts: 'Múltiplas tentativas',
  '3ds_failed': '3DS falhou',
  cross_country_velocity: 'Velocidade entre países',
  high_amount: 'Valor alto',
  new_customer: 'Cliente novo'
};

export const myFraudRules = [
  { id: 'rule_01', name: 'Bloquear se score > 90', condition: 'fraud_score > 90', action: 'block', active: true, triggers_30d: 8 },
  { id: 'rule_02', name: 'Forçar 3DS se score 70-89', condition: '70 <= fraud_score <= 89', action: 'force_3ds', active: true, triggers_30d: 42 },
  { id: 'rule_03', name: 'Bloquear cartões pré-pagos > R$ 500', condition: 'card_type=prepaid AND amount > 500', action: 'block', active: true, triggers_30d: 3 },
  { id: 'rule_04', name: 'Revisar IPs do exterior', condition: 'country != BR', action: 'review', active: false, triggers_30d: 0 }
];

// ============== MY WEBHOOK REPLAY ==============
export const myWebhookKpis = {
  total_endpoints: 4,
  active_endpoints: 4,
  success_rate_24h: 96.4,
  failed_24h: 47,
  avg_response_ms: 380,
  total_sent_30d: 184250,
  pending_retry: 12,
  unhealthy_endpoints: 1
};

export const myWebhookEndpoints = [
  { id: 'wh_001', name: 'Endpoint Principal — Pedidos', url: 'https://api.techshop.com.br/webhooks/pagsmile', events: ['payment.approved', 'payment.refused', 'payment.refunded'], status: 'healthy', success_rate: 99.2, avg_latency: 280, last_call: '2026-05-10T09:42:11' },
  { id: 'wh_002', name: 'Endpoint PIX', url: 'https://api.techshop.com.br/webhooks/pix', events: ['pix.received', 'pix.refunded'], status: 'healthy', success_rate: 99.8, avg_latency: 220, last_call: '2026-05-10T09:38:22' },
  { id: 'wh_003', name: 'Endpoint Subscriptions', url: 'https://api.techshop.com.br/webhooks/subscriptions', events: ['subscription.charged', 'subscription.failed'], status: 'attention', success_rate: 87.4, avg_latency: 1820, last_call: '2026-05-10T09:15:00' },
  { id: 'wh_004', name: 'Endpoint Disputas', url: 'https://api.techshop.com.br/webhooks/disputes', events: ['dispute.opened', 'dispute.lost', 'dispute.won'], status: 'healthy', success_rate: 100, avg_latency: 410, last_call: '2026-05-09T22:00:00' }
];

export const myFailedWebhooks = [
  { id: 'fw_001', event: 'payment.approved', endpoint_name: 'Endpoint Principal', timestamp: '2026-05-10T09:30:00', status_code: 502, error: 'Bad Gateway', attempts: 3, payload_size_kb: 4.2, can_retry: true, transaction_id: 'tx_card_44521' },
  { id: 'fw_002', event: 'subscription.failed', endpoint_name: 'Endpoint Subscriptions', timestamp: '2026-05-10T08:55:00', status_code: 504, error: 'Gateway Timeout', attempts: 5, payload_size_kb: 2.8, can_retry: true, subscription_id: 'sub_8841' },
  { id: 'fw_003', event: 'subscription.failed', endpoint_name: 'Endpoint Subscriptions', timestamp: '2026-05-10T08:33:00', status_code: 500, error: 'Internal Server Error', attempts: 4, payload_size_kb: 2.8, can_retry: true, subscription_id: 'sub_8821' },
  { id: 'fw_004', event: 'pix.received', endpoint_name: 'Endpoint PIX', timestamp: '2026-05-09T18:12:00', status_code: 0, error: 'Connection Refused', attempts: 5, payload_size_kb: 1.4, can_retry: false, transaction_id: 'tx_pix_8821' }
];

// ============== MY ROLLING RESERVE ==============
export const myReserveKpis = {
  current_retention: 5.0,
  retained_total: 184520.00,
  released_30d: 142380.00,
  pending_release: 42140.00,
  next_release_date: '2026-05-15',
  next_release_amount: 38420.00,
  retention_period_days: 30,
  contractual_basis: 'Cláusula 7.3 do contrato'
};

export const myReserveTimeline = [
  { date: '10/04', retained: 8420, released: 7820, balance: 184520 },
  { date: '15/04', retained: 9240, released: 8820, balance: 184940 },
  { date: '20/04', retained: 7840, released: 7240, balance: 185540 },
  { date: '25/04', retained: 8920, released: 8320, balance: 186140 },
  { date: '30/04', retained: 9420, released: 8920, balance: 186640 },
  { date: '05/05', retained: 7820, released: 7420, balance: 187040 },
  { date: '10/05', retained: 8520, released: 0, balance: 195560 }
];

export const myReserveScheduledReleases = [
  { id: 'rel_001', date: '2026-05-15', amount: 38420.00, transactions_count: 287, status: 'scheduled' },
  { id: 'rel_002', date: '2026-05-22', amount: 41280.00, transactions_count: 312, status: 'scheduled' },
  { id: 'rel_003', date: '2026-05-29', amount: 39820.00, transactions_count: 298, status: 'scheduled' },
  { id: 'rel_004', date: '2026-06-05', amount: 42140.00, transactions_count: 318, status: 'scheduled' }
];

export const myReserveHistory = [
  { month: 'Dez/25', retained: 168200, released: 165400 },
  { month: 'Jan/26', retained: 178400, released: 168200 },
  { month: 'Fev/26', retained: 182300, released: 178400 },
  { month: 'Mar/26', retained: 186100, released: 182300 },
  { month: 'Abr/26', retained: 188400, released: 186100 },
  { month: 'Mai/26', retained: 95560, released: 142380 }
];