// Mock data for the "future admin" prototype — UI-only.

export const inboxItems = [
  { id: 'inb-001', type: 'dispute', severity: 'critical', title: 'Chargeback #CB-9821 — prazo encerra em 6h', subtitle: 'Visa · R$ 2.890,00 · cliente: maria.silva@gmail.com', deadline: new Date(Date.now() + 1000 * 60 * 60 * 6), source: 'DisputeDashboard', actions: [{ label: 'Contestar', primary: true }, { label: 'Aceitar', variant: 'ghost' }] },
  { id: 'inb-002', type: 'pre_chargeback', severity: 'high', title: '3 pré-chargebacks Ethoca aguardando ação', subtitle: 'Total R$ 4.120,00 · janela 24h', deadline: new Date(Date.now() + 1000 * 60 * 60 * 22), source: 'PreChargebacks', actions: [{ label: 'Reembolsar todos', primary: true }, { label: 'Revisar', variant: 'ghost' }] },
  { id: 'inb-003', type: 'kyc', severity: 'high', title: 'KYC pendente: 2 documentos vencidos', subtitle: 'Cartão CNPJ vencido · Comprovante endereço', deadline: new Date(Date.now() + 1000 * 60 * 60 * 72), source: 'ComplianceOnboardingStart', actions: [{ label: 'Reenviar', primary: true }] },
  { id: 'inb-004', type: 'withdrawal', severity: 'medium', title: 'Saque R$ 28.500 aguarda 2ª aprovação', subtitle: 'Solicitado por João Silva · 4h atrás', deadline: null, source: 'Withdrawals', actions: [{ label: 'Aprovar', primary: true }, { label: 'Rejeitar', variant: 'destructive' }] },
  { id: 'inb-005', type: 'subscription', severity: 'medium', title: '12 assinaturas com cartão expirando em 7 dias', subtitle: 'MRR em risco: R$ 4.890,00', deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), source: 'Subscriptions', actions: [{ label: 'Disparar campanha', primary: true }] },
  { id: 'inb-006', type: 'retry', severity: 'medium', title: 'Retentativa falhando: 8 ocorrências', subtitle: 'Plano "Pro Mensal" · soft decline 51', deadline: null, source: 'Recurrence', actions: [{ label: 'Ver dunning', primary: true }] },
  { id: 'inb-007', type: 'risk', severity: 'high', title: 'Alerta antifraude: 4 transações alto risco', subtitle: 'Score > 85 · não bloqueadas', deadline: new Date(Date.now() + 1000 * 60 * 60 * 4), source: 'AdminIntFraudMonitoring', actions: [{ label: 'Revisar', primary: true }] },
  { id: 'inb-008', type: 'webhook', severity: 'low', title: 'Webhook /orders falhando há 2h', subtitle: 'api.minhaloja.com — 23 entregas pendentes', deadline: null, source: 'Webhooks', actions: [{ label: 'Reenviar', primary: true }, { label: 'Logs', variant: 'ghost' }] },
  { id: 'inb-009', type: 'compliance', severity: 'high', title: 'VDMP: ratio chargeback 0.95%', subtitle: 'Visa · faltam 0.05 pp p/ Early Warning', deadline: null, source: 'AdminIntCompliance', actions: [{ label: 'Plano de ação', primary: true }] },
  { id: 'inb-010', type: 'coupon', severity: 'low', title: 'Cupom NATAL10 sem uso há 14 dias', subtitle: '0 conversões · expira 31/12', deadline: null, source: 'CouponList', actions: [{ label: 'Pausar', primary: true }] },
];

export const auditEvents = [
  { id: 'aud-001', actor: 'João Silva', actorEmail: 'joao@pagsmile.com', action: 'updated', object: 'AntifraudRule', objectName: 'Regra "Alto Valor BR"', diff: { score_threshold: { from: 80, to: 75 } }, ip: '189.45.12.8', location: 'São Paulo, BR', userAgent: 'Chrome 124 · macOS', createdAt: new Date(Date.now() - 1000 * 60 * 8), severity: 'medium' },
  { id: 'aud-002', actor: 'Maria Santos', actorEmail: 'maria@pagsmile.com', action: 'approved', object: 'Withdrawal', objectName: 'Saque #WD-7821 — R$ 28.500', diff: { status: { from: 'pending', to: 'approved' } }, ip: '177.18.4.221', location: 'Rio de Janeiro, BR', userAgent: 'Chrome 124 · Windows', createdAt: new Date(Date.now() - 1000 * 60 * 32), severity: 'high' },
  { id: 'aud-003', actor: 'João Silva', actorEmail: 'joao@pagsmile.com', action: 'created', object: 'ApiKey', objectName: 'sk_live_***f72a (Production)', diff: null, ip: '189.45.12.8', location: 'São Paulo, BR', userAgent: 'Chrome 124 · macOS', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), severity: 'critical' },
  { id: 'aud-004', actor: 'Sistema', actorEmail: 'system@pagsmile', action: 'auto_approved', object: 'Anticipation', objectName: 'Antecipação D+1 R$ 12.890', diff: { status: { from: 'pending', to: 'approved' } }, ip: '—', location: '—', userAgent: 'PagSmile Worker', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), severity: 'low' },
  { id: 'aud-005', actor: 'Carlos Lima', actorEmail: 'carlos@pagsmile.com', action: 'updated', object: 'Subaccount', objectName: 'Loja Modas SP — limite mensal', diff: { limit_monthly: { from: 200000, to: 500000 } }, ip: '186.219.8.40', location: 'BH, BR', userAgent: 'Safari 17 · iOS', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), severity: 'high' },
  { id: 'aud-006', actor: 'João Silva', actorEmail: 'joao@pagsmile.com', action: 'deleted', object: 'Webhook', objectName: 'webhook_legacy_v1', diff: null, ip: '189.45.12.8', location: 'São Paulo, BR', userAgent: 'Chrome 124 · macOS', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), severity: 'medium' },
  { id: 'aud-007', actor: 'Maria Santos', actorEmail: 'maria@pagsmile.com', action: 'login', object: 'Session', objectName: 'Login bem-sucedido', diff: null, ip: '177.18.4.221', location: 'Rio de Janeiro, BR', userAgent: 'Chrome 124 · Windows', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26), severity: 'low' },
];

export const documents = [
  { id: 'doc-001', name: 'Recibo TXN-9821', type: 'receipt', module: 'Transações', date: new Date(Date.now() - 1000 * 60 * 12), size: '124 KB', format: 'PDF' },
  { id: 'doc-002', name: 'Extrato Abril 2026', type: 'statement', module: 'Financeiro', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), size: '892 KB', format: 'PDF' },
  { id: 'doc-003', name: 'Comprovante Saque WD-7720', type: 'withdrawal', module: 'Saques', date: new Date(Date.now() - 1000 * 60 * 60 * 32), size: '88 KB', format: 'PDF' },
  { id: 'doc-004', name: 'Fatura PagSmile #INV-1041', type: 'invoice', module: 'Faturamento', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), size: '210 KB', format: 'PDF' },
  { id: 'doc-005', name: 'Contestação CB-9821', type: 'evidence', module: 'Disputas', date: new Date(Date.now() - 1000 * 60 * 60 * 5), size: '1.2 MB', format: 'PDF' },
  { id: 'doc-006', name: 'Contrato adesão PagSmile', type: 'contract', module: 'Compliance', date: new Date('2025-08-12'), size: '420 KB', format: 'PDF' },
  { id: 'doc-007', name: 'Relatório Mensal Executivo', type: 'report', module: 'Relatórios', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), size: '1.8 MB', format: 'PDF' },
  { id: 'doc-008', name: 'NF-e Tarifas Abril', type: 'tax', module: 'Fiscal', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9), size: '64 KB', format: 'XML' },
];

export const teamMembers = [
  { id: 'usr-1', name: 'João Silva', email: 'joao@pagsmile.com', initials: 'JS', role: 'admin', roleLabel: 'Admin', mfa: true, lastLogin: new Date(Date.now() - 1000 * 60 * 8), status: 'active' },
  { id: 'usr-2', name: 'Maria Santos', email: 'maria@pagsmile.com', initials: 'MS', role: 'risk_analyst', roleLabel: 'Analista de Risco', mfa: true, lastLogin: new Date(Date.now() - 1000 * 60 * 32), status: 'active' },
  { id: 'usr-3', name: 'Carlos Lima', email: 'carlos@pagsmile.com', initials: 'CL', role: 'finance', roleLabel: 'Financeiro', mfa: false, lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 8), status: 'active' },
  { id: 'usr-4', name: 'Ana Costa', email: 'ana@pagsmile.com', initials: 'AC', role: 'operations', roleLabel: 'Operações', mfa: true, lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), status: 'active' },
  { id: 'usr-5', name: 'Pedro Alves', email: 'pedro@pagsmile.com', initials: 'PA', role: 'viewer', roleLabel: 'Visualizador', mfa: false, lastLogin: null, status: 'pending' },
];

export const rolesMatrix = [
  { module: 'Transações', admin: true, finance: true, risk_analyst: true, operations: true, viewer: 'read' },
  { module: 'Reembolsos', admin: true, finance: true, risk_analyst: true, operations: false, viewer: false },
  { module: 'Saques', admin: true, finance: true, risk_analyst: false, operations: 'request', viewer: 'read' },
  { module: 'Disputas', admin: true, finance: 'read', risk_analyst: true, operations: true, viewer: 'read' },
  { module: 'Antifraude', admin: true, finance: false, risk_analyst: true, operations: false, viewer: false },
  { module: 'Cupons', admin: true, finance: false, risk_analyst: false, operations: true, viewer: 'read' },
  { module: 'Configurações', admin: true, finance: false, risk_analyst: false, operations: false, viewer: false },
  { module: 'API Keys', admin: true, finance: false, risk_analyst: false, operations: false, viewer: false },
];

export const developerMetrics = {
  uptime: 99.97, avgLatency: 142, totalRequests24h: 184217, errorRate: 0.04, webhookSuccessRate: 99.4, webhookPending: 23,
  topEndpoints: [
    { path: 'POST /v1/charges', count: 89412, avgLatency: 187, errorRate: 0.02 },
    { path: 'GET /v1/transactions', count: 42100, avgLatency: 92, errorRate: 0.01 },
    { path: 'POST /v1/refunds', count: 18840, avgLatency: 312, errorRate: 0.21 },
    { path: 'GET /v1/balance', count: 12700, avgLatency: 64, errorRate: 0.00 },
    { path: 'POST /v1/webhooks', count: 8120, avgLatency: 88, errorRate: 0.05 },
  ],
  recentLogs: [
    { id: 'log-1', method: 'POST', path: '/v1/charges', status: 200, latency: 142, time: new Date(Date.now() - 1000 * 12) },
    { id: 'log-2', method: 'GET', path: '/v1/transactions', status: 200, latency: 88, time: new Date(Date.now() - 1000 * 38) },
    { id: 'log-3', method: 'POST', path: '/v1/refunds', status: 422, latency: 210, time: new Date(Date.now() - 1000 * 65) },
    { id: 'log-4', method: 'POST', path: '/v1/charges', status: 200, latency: 174, time: new Date(Date.now() - 1000 * 92) },
    { id: 'log-5', method: 'GET', path: '/v1/balance', status: 200, latency: 49, time: new Date(Date.now() - 1000 * 120) },
    { id: 'log-6', method: 'POST', path: '/v1/charges', status: 500, latency: 4211, time: new Date(Date.now() - 1000 * 180) },
    { id: 'log-7', method: 'POST', path: '/v1/webhooks', status: 200, latency: 92, time: new Date(Date.now() - 1000 * 240) },
  ],
};

export const playbooks = [
  { id: 'pb-saas', title: 'SaaS B2B', icon: 'Repeat', color: 'from-violet-500 to-indigo-600', summary: 'Recorrência mensal, dunning agressivo, antecipação D+1, antifraude permissivo.', presets: ['Plano padrão: cobrança mensal, dia 1', 'Dunning: 5 retentativas + email + SMS', 'Antecipação automática D+1', 'Cartão principal · PIX secundário', 'MDR otimizado parcelado 1x', 'Antifraude score 70 (permissivo)', 'Webhooks: invoice.paid, subscription.*'], tags: ['MRR', 'Churn', 'Trial 7d'], timeToApply: '5 min' },
  { id: 'pb-ecommerce', title: 'E-commerce B2C', icon: 'ShoppingBag', color: 'from-orange-500 to-pink-600', summary: 'Pagamento único, antifraude rigoroso, parcelamento 12x, PIX com desconto.', presets: ['PIX (5% desconto) + cartão até 12x', 'Antifraude score 50 (rigoroso)', 'Reembolso auto se chargeback < R$ 50', 'Pré-chargeback Ethoca: reembolso auto', 'Antecipação manual sob demanda', 'Webhooks: charge.*, dispute.created'], tags: ['Conversão', 'Antifraude', 'Parcelamento'], timeToApply: '4 min' },
  { id: 'pb-marketplace', title: 'Marketplace', icon: 'Network', color: 'from-emerald-500 to-cyan-600', summary: 'Split automático, gestão de subcontas, KYC obrigatório, rolling reserve.', presets: ['Split: 90% vendedor / 10% plataforma', 'Onboarding subcontas: KYC + liveness', 'Rolling reserve: 5% por 30 dias', 'Limites por subconta automáticos', 'Repasse condicionado a entrega', 'Webhooks: transfer.*, account.*, dispute.*'], tags: ['Split', 'KYC', 'Subcontas'], timeToApply: '8 min' },
  { id: 'pb-infoproduct', title: 'Infoproduto', icon: 'GraduationCap', color: 'from-amber-500 to-red-600', summary: 'Order bump, upsell, link de pagamento, alta conversão.', presets: ['Checkout 1-step com order bump', 'Links curtos com slug customizado', 'Cupom + UTM tracking automático', 'Antifraude score 60 (médio)', 'Webhooks → Hotmart/Eduzz', 'Suporte WhatsApp na thank-you page'], tags: ['Conversão', 'Upsell', 'Link rápido'], timeToApply: '3 min' },
];

export const notificationChannels = [
  { id: 'email', name: 'E-mail', enabled: true, address: 'joao@pagsmile.com', verified: true },
  { id: 'sms', name: 'SMS', enabled: true, address: '+55 11 99999-1234', verified: true },
  { id: 'push', name: 'Push (in-app)', enabled: true, address: 'Browser desktop', verified: true },
  { id: 'whatsapp', name: 'WhatsApp', enabled: false, address: '+55 11 99999-1234', verified: false },
  { id: 'slack', name: 'Slack', enabled: false, address: '— não conectado', verified: false },
  { id: 'webhook', name: 'Webhook', enabled: true, address: 'https://api.minhaloja.com/hooks', verified: true },
];

export const notificationEvents = [
  { id: 'charge_succeeded', category: 'Transações', label: 'Cobrança aprovada', description: 'Cobrança confirmada', channels: ['email', 'webhook'] },
  { id: 'charge_failed', category: 'Transações', label: 'Cobrança recusada', description: 'Cobrança falhou', channels: ['email', 'webhook'] },
  { id: 'dispute_opened', category: 'Disputas', label: 'Disputa aberta', description: 'Novo chargeback ou pré-CB', channels: ['email', 'sms', 'push', 'webhook'] },
  { id: 'dispute_deadline', category: 'Disputas', label: 'Prazo de disputa próximo', description: '48h antes do deadline', channels: ['email', 'sms', 'push'] },
  { id: 'withdrawal_pending', category: 'Financeiro', label: 'Saque aguardando aprovação', description: 'Solicitação criada', channels: ['email', 'push'] },
  { id: 'mrr_drop', category: 'Recorrência', label: 'Queda anormal de MRR', description: 'MRR caiu > 5% em 24h', channels: ['email', 'push'] },
  { id: 'fraud_alert', category: 'Risco', label: 'Alerta antifraude', description: 'Transação alto risco', channels: ['email', 'sms', 'push'] },
  { id: 'kyc_pending', category: 'Compliance', label: 'KYC pendente', description: 'Documentos vencidos', channels: ['email'] },
];