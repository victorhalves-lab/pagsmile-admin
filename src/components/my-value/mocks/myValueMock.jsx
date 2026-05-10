// Mock data for Entrega 9 — Diferencial Competitivo (Admin Sub)
// MyOrchestrationView · MyPricingTransparency · MyReconciliationCenter · MyCheckupCenter · MyCommunicationsCenter

export const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(v || 0);

export const formatPct = (v) => `${(v || 0).toFixed(2)}%`;

// ============== MY ORCHESTRATION VIEW ==============
export const myOrchestrationKpis = {
  global_approval_rate: 94.2,
  total_routed_30d: 48720,
  total_volume_30d: 8420500.00,
  primary_acquirer_share: 68,
  failover_events_30d: 312,
  retry_recovered: 187,
  retry_recovered_brl: 28940.00
};

export const myAcquirerHealth = [
  { acquirer: 'Cielo', role: 'primary', share: 68, approval_rate: 95.8, latency_ms: 1240, status: 'healthy', volume_30d: 5725940.00, transactions_30d: 33129, last_incident: null },
  { acquirer: 'Stone', role: 'failover', share: 22, approval_rate: 93.4, latency_ms: 1420, status: 'healthy', volume_30d: 1852510.00, transactions_30d: 10718, last_incident: '2026-04-22' },
  { acquirer: 'Rede', role: 'failover_secondary', share: 10, approval_rate: 91.2, latency_ms: 1680, status: 'attention', volume_30d: 842050.00, transactions_30d: 4873, last_incident: '2026-05-02' }
];

export const myRoutingRules = [
  { id: 'rule_01', priority: 1, name: 'Cartão Crédito 1-3x → Cielo', method: 'card_credit', installments: '1-3', primary: 'Cielo', secondary: 'Stone', active: true },
  { id: 'rule_02', priority: 2, name: 'Cartão Crédito 4-12x → Stone', method: 'card_credit', installments: '4-12', primary: 'Stone', secondary: 'Cielo', active: true },
  { id: 'rule_03', priority: 3, name: 'Crédito > R$ 5k → Cielo (low MDR)', method: 'card_credit', condition: 'amount > 5000', primary: 'Cielo', secondary: 'Stone', active: true },
  { id: 'rule_04', priority: 4, name: 'PIX → Banco Topázio', method: 'pix', primary: 'Banco Topázio', secondary: 'Stone PIX', active: true },
  { id: 'rule_05', priority: 5, name: 'Boleto → Bradesco', method: 'boleto', primary: 'Bradesco', secondary: 'Itaú', active: true }
];

export const myMethodBreakdown = [
  { method: 'PIX IN', volume: 4850000, share: 57.6, approval: 98.2, avg_ticket: 285.40 },
  { method: 'Cartão Crédito', volume: 2940000, share: 34.9, approval: 91.8, avg_ticket: 412.30 },
  { method: 'Cartão Débito', volume: 420500, share: 5.0, approval: 95.4, avg_ticket: 89.50 },
  { method: 'Boleto', volume: 210000, share: 2.5, approval: 87.2, avg_ticket: 580.00 }
];

export const myFailoverEvents = [
  { id: 'fo_01', timestamp: '2026-05-09T14:22:11', from: 'Cielo', to: 'Stone', reason: 'timeout > 5s', transactions: 18, recovered_brl: 4280.50 },
  { id: 'fo_02', timestamp: '2026-05-08T09:15:33', from: 'Cielo', to: 'Stone', reason: 'temporary_decline', transactions: 7, recovered_brl: 1650.00 },
  { id: 'fo_03', timestamp: '2026-05-05T22:48:00', from: 'Stone', to: 'Rede', reason: 'gateway_down', transactions: 42, recovered_brl: 12340.00 }
];

// ============== MY PRICING TRANSPARENCY ==============
export const myPricingKpis = {
  contracted_mdr_avg: 2.85,
  effective_mdr_30d: 2.91,
  total_fees_30d: 245182.40,
  spread_vs_market: -0.15,
  drift_alerts: 3,
  recovery_potential: 4287.50,
  next_review_date: '2026-08-15'
};

export const myMdrMatrix = [
  { method: 'Crédito 1x', visa: 1.99, mastercard: 1.99, elo: 2.10, amex: 2.85, hipercard: 2.50 },
  { method: 'Crédito 2-6x', visa: 2.85, mastercard: 2.85, elo: 2.95, amex: 3.45, hipercard: 3.20 },
  { method: 'Crédito 7-12x', visa: 3.45, mastercard: 3.45, elo: 3.55, amex: 3.95, hipercard: 3.80 },
  { method: 'Débito', visa: 1.20, mastercard: 1.20, elo: 1.30, amex: null, hipercard: 1.40 },
  { method: 'PIX', visa: null, mastercard: null, elo: null, amex: null, hipercard: null, fixed: 0.99 },
  { method: 'Boleto', visa: null, mastercard: null, elo: null, amex: null, hipercard: null, fixed: 3.50 }
];

export const myFeeDecomposition = [
  { component: 'Interchange (Bandeira)', value: 1.45, share: 50.9, description: 'Pago à bandeira do cartão (Visa/Master/Elo)' },
  { component: 'Spread Adquirente', value: 0.85, share: 29.8, description: 'Margem da adquirente (Cielo/Stone)' },
  { component: 'Spread PagSmile', value: 0.45, share: 15.8, description: 'Nossa margem operacional' },
  { component: 'Custos Bandeira', value: 0.10, share: 3.5, description: 'Taxas regulatórias da bandeira' }
];

export const myPricingHistory = [
  { month: 'Dez/25', contracted: 2.85, effective: 2.92, market_avg: 3.05 },
  { month: 'Jan/26', contracted: 2.85, effective: 2.88, market_avg: 3.02 },
  { month: 'Fev/26', contracted: 2.85, effective: 2.85, market_avg: 3.01 },
  { month: 'Mar/26', contracted: 2.85, effective: 2.95, market_avg: 3.04 },
  { month: 'Abr/26', contracted: 2.85, effective: 2.97, market_avg: 3.06 },
  { month: 'Mai/26', contracted: 2.85, effective: 2.91, market_avg: 3.06 }
];

export const myInstallmentSimulation = [
  { installments: 1, amount: 1000, mdr_pct: 1.99, fee: 19.90, net: 980.10, rav_pct: 0, rav_brl: 0, total_cost: 19.90 },
  { installments: 3, amount: 1000, mdr_pct: 2.85, fee: 28.50, net: 971.50, rav_pct: 1.85, rav_brl: 18.50, total_cost: 47.00 },
  { installments: 6, amount: 1000, mdr_pct: 2.85, fee: 28.50, net: 971.50, rav_pct: 3.20, rav_brl: 32.00, total_cost: 60.50 },
  { installments: 12, amount: 1000, mdr_pct: 3.45, fee: 34.50, net: 965.50, rav_pct: 5.40, rav_brl: 54.00, total_cost: 88.50 }
];

// ============== MY RECONCILIATION CENTER ==============
export const myReconciliationKpis = {
  conciliation_rate: 99.2,
  total_transactions_30d: 48720,
  conciliated: 48330,
  pending_review: 312,
  divergent: 78,
  total_divergent_brl: 12480.50,
  recovered_30d: 8920.00
};

export const myReconciliationFiles = [
  { id: 'rec_01', date: '2026-05-09', acquirer: 'Cielo', file_name: 'EEVD_20260509.txt', records: 12480, conciliated: 12450, divergent: 30, status: 'completed', divergent_brl: 4820.00 },
  { id: 'rec_02', date: '2026-05-09', acquirer: 'Stone', file_name: 'STONE_DETAIL_20260509.csv', records: 4520, conciliated: 4505, divergent: 15, status: 'completed', divergent_brl: 1980.50 },
  { id: 'rec_03', date: '2026-05-08', acquirer: 'Cielo', file_name: 'EEVD_20260508.txt', records: 11920, conciliated: 11910, divergent: 10, status: 'completed', divergent_brl: 1240.00 },
  { id: 'rec_04', date: '2026-05-08', acquirer: 'Banco Topázio', file_name: 'PIX_20260508.json', records: 18500, conciliated: 18495, divergent: 5, status: 'completed', divergent_brl: 320.00 },
  { id: 'rec_05', date: '2026-05-07', acquirer: 'Stone', file_name: 'STONE_DETAIL_20260507.csv', records: 4280, conciliated: 4263, divergent: 17, status: 'review', divergent_brl: 4120.00 }
];

export const myDivergences = [
  { id: 'div_01', transaction_id: 'tx_card_44521', date: '2026-05-09', acquirer: 'Cielo', expected: 285.40, received: 285.00, difference: -0.40, type: 'value_mismatch', severity: 'low', status: 'open' },
  { id: 'div_02', transaction_id: 'tx_card_44488', date: '2026-05-09', acquirer: 'Cielo', expected: 1240.00, received: 1198.40, difference: -41.60, type: 'fee_mismatch', severity: 'medium', status: 'open' },
  { id: 'div_03', transaction_id: 'tx_card_44321', date: '2026-05-08', acquirer: 'Stone', expected: 580.00, received: null, difference: -580.00, type: 'missing_settlement', severity: 'high', status: 'investigating' },
  { id: 'div_04', transaction_id: 'tx_pix_88421', date: '2026-05-09', acquirer: 'Banco Topázio', expected: 320.00, received: 320.00, difference: 0, type: 'date_mismatch', severity: 'low', status: 'open' }
];

// ============== MY CHECKUP CENTER ==============
export const myCheckupKpis = {
  health_score: 92,
  status: 'healthy',
  last_run: '2026-05-10T06:00:00',
  next_scheduled: '2026-05-11T06:00:00',
  checks_passed: 47,
  checks_warning: 3,
  checks_failed: 0,
  total_checks: 50
};

export const myCheckupCategories = [
  { category: 'Configuração de Pagamento', checks: 12, passed: 12, warning: 0, failed: 0, status: 'healthy' },
  { category: 'Webhooks & Integrações', checks: 8, passed: 7, warning: 1, failed: 0, status: 'attention' },
  { category: 'Compliance & Documentação', checks: 10, passed: 9, warning: 1, failed: 0, status: 'attention' },
  { category: 'Segurança da Conta', checks: 8, passed: 8, warning: 0, failed: 0, status: 'healthy' },
  { category: 'Performance Transacional', checks: 7, passed: 6, warning: 1, failed: 0, status: 'attention' },
  { category: 'Estratégia Antifraude', checks: 5, passed: 5, warning: 0, failed: 0, status: 'healthy' }
];

export const myCheckupItems = [
  { id: 'chk_01', category: 'Webhooks & Integrações', name: 'Endpoint de webhook PIX respondeu lento (>3s) em 12% das chamadas', severity: 'warning', recommendation: 'Considere otimizar o tempo de resposta do seu endpoint /webhook/pix para evitar reprocessamentos.', impact: 'medium' },
  { id: 'chk_02', category: 'Compliance & Documentação', name: 'Comprovante de Endereço expirado há 0 dias', severity: 'warning', recommendation: 'Reenvie o documento atualizado no Centro de Compliance para evitar bloqueios preventivos.', impact: 'high' },
  { id: 'chk_03', category: 'Performance Transacional', name: 'Taxa de aprovação Mastercard 2.5pp abaixo do benchmark', severity: 'warning', recommendation: 'Revise estratégia 3DS e configurações antifraude para esta bandeira.', impact: 'medium' },
  { id: 'chk_04', category: 'Configuração de Pagamento', name: 'PIX, Cartão e Boleto configurados corretamente', severity: 'passed', recommendation: null, impact: null },
  { id: 'chk_05', category: 'Segurança da Conta', name: 'MFA ativo para todos administradores', severity: 'passed', recommendation: null, impact: null }
];

export const myCheckupHistory = [
  { date: '2026-05-10', score: 92, passed: 47, warning: 3, failed: 0 },
  { date: '2026-05-09', score: 90, passed: 46, warning: 4, failed: 0 },
  { date: '2026-05-08', score: 88, passed: 45, warning: 4, failed: 1 },
  { date: '2026-05-07', score: 85, passed: 43, warning: 5, failed: 2 },
  { date: '2026-05-06', score: 87, passed: 44, warning: 6, failed: 0 }
];

// ============== MY COMMUNICATIONS CENTER ==============
export const myCommsKpis = {
  total_sent_30d: 87420,
  delivery_rate: 98.4,
  open_rate: 42.1,
  total_email: 52400,
  total_sms: 18920,
  total_whatsapp: 16100,
  failed_24h: 12,
  pending_actions: 2
};

export const myCommsLogs = [
  { id: 'log_01', timestamp: '2026-05-10T09:42:00', channel: 'email', recipient: 'cliente@example.com', subject: 'Comprovante de pagamento — Pedido #1234', status: 'delivered', opened: true, opened_at: '2026-05-10T09:48:21', template: 'payment_receipt' },
  { id: 'log_02', timestamp: '2026-05-10T09:38:00', channel: 'whatsapp', recipient: '+5511***4421', subject: 'Confirmação de pagamento PIX', status: 'delivered', opened: true, opened_at: '2026-05-10T09:39:15', template: 'pix_confirmation' },
  { id: 'log_03', timestamp: '2026-05-10T09:22:00', channel: 'sms', recipient: '+5511***5588', subject: 'Código de verificação: 8421', status: 'delivered', opened: null, template: 'otp_code' },
  { id: 'log_04', timestamp: '2026-05-10T08:55:00', channel: 'email', recipient: 'admin@oldmail.com', subject: 'Webhook falhou — Retry necessário', status: 'failed', failure_reason: 'mailbox_full', template: 'webhook_failure' },
  { id: 'log_05', timestamp: '2026-05-10T08:33:00', channel: 'email', recipient: 'cliente2@example.com', subject: 'Boleto disponível para pagamento', status: 'delivered', opened: false, template: 'boleto_issued' }
];

export const myCommsTemplates = [
  { id: 'tpl_01', name: 'Comprovante de Pagamento', channel: 'email', category: 'transactional', usage_30d: 32400, open_rate: 64.2, customizable: true, language: 'pt-BR' },
  { id: 'tpl_02', name: 'Confirmação PIX', channel: 'whatsapp', category: 'transactional', usage_30d: 14200, open_rate: 89.4, customizable: true, language: 'pt-BR' },
  { id: 'tpl_03', name: 'Código OTP', channel: 'sms', category: 'security', usage_30d: 18920, open_rate: null, customizable: false, language: 'pt-BR' },
  { id: 'tpl_04', name: 'Boleto Emitido', channel: 'email', category: 'transactional', usage_30d: 8420, open_rate: 38.4, customizable: true, language: 'pt-BR' },
  { id: 'tpl_05', name: 'Lembrete de Vencimento', channel: 'email', category: 'transactional', usage_30d: 5240, open_rate: 42.1, customizable: true, language: 'pt-BR' },
  { id: 'tpl_06', name: 'Cobrança em Atraso', channel: 'whatsapp', category: 'recovery', usage_30d: 1900, open_rate: 78.4, customizable: true, language: 'pt-BR' }
];

export const myCommsChannels = [
  { channel: 'Email', sent: 52400, delivered: 51578, opened: 22063, failed: 822, delivery_rate: 98.4, open_rate: 42.8 },
  { channel: 'SMS', sent: 18920, delivered: 18793, failed: 127, delivery_rate: 99.3, open_rate: null },
  { channel: 'WhatsApp', sent: 16100, delivered: 15962, opened: 14266, failed: 138, delivery_rate: 99.1, open_rate: 89.4 }
];

export const channelLabels = {
  email: { label: 'Email', icon: 'Mail', color: 'bg-blue-100 text-blue-700' },
  sms: { label: 'SMS', icon: 'MessageSquare', color: 'bg-purple-100 text-purple-700' },
  whatsapp: { label: 'WhatsApp', icon: 'MessageCircle', color: 'bg-green-100 text-green-700' }
};