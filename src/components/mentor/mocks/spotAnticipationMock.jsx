// Mock data centralizado para domínio Antecipação Spot Mentor
// Cobre: ORIGEM 173-178 (F3276 → F3441)

export const spotAnticipationKPIs = {
  total_today: 47,
  total_today_value: 2_345_678.90,
  total_month: 1_234,
  total_month_value: 45_890_123.45,
  revenue_pagsmile_month: 524_321.10, // taxa retida
  success_rate: 98.7, // % executadas com sucesso
  avg_time_create_to_execute_minutes: 142, // 2h22min
  pending_over_24h: 3,
  failed_today: 2,
  exposure_aggregate: 12_456_789.00, // exposição agregada PagSmile→lojistas
  registradora_pending: 5,
  approval_pending: 2,
  reversed_month: 1,
};

export const spotAnticipationsList = [
  {
    id: 'SPOT-2026-001234',
    external_ref: 'PEDIDO-98765',
    bank_ref: 'PIX-E2E-A1B2C3D4E5F6',
    merchant: { name: 'Tech Solutions Ltda', fantasy: 'TechSol', cnpj: '12.345.678/0001-90', id: 'sub_abc123' },
    created_at: '2026-05-09T09:15:23Z',
    dt_payment: '2026-05-12',
    executed_at: '2026-05-12T10:23:45Z',
    vl_ordered: 150_000.00,
    rt_spot_anticipation: 1.99, // % ao mês
    rate_value: 1_819.95,
    iof: 58.20,
    total: 148_121.85,
    status: 'executed',
    sub_status: null,
    method: 'pix',
    bank: 'Itaú',
    avg_term_days: 18.3,
    receivables_count: 47,
    project: 'PagSmile BR',
    health_score: 96,
    sla_adherence: 'ok',
    registradora_status: 'registered',
    registradora_id: 'CIP-REG-789456123',
  },
  {
    id: 'SPOT-2026-001235',
    external_ref: null,
    bank_ref: null,
    merchant: { name: 'E-commerce ABC', fantasy: 'ABC Store', cnpj: '23.456.789/0001-01', id: 'sub_def456' },
    created_at: '2026-05-09T11:42:10Z',
    dt_payment: '2026-05-12',
    executed_at: null,
    vl_ordered: 80_000.00,
    rt_spot_anticipation: 2.49,
    rate_value: 1_240.50,
    iof: 28.10,
    total: 78_731.40,
    status: 'in_execution',
    sub_status: null,
    method: 'pix',
    bank: 'Bradesco',
    avg_term_days: 22.1,
    receivables_count: 89,
    project: 'PagSmile BR',
    health_score: 82,
    sla_adherence: 'warning',
    registradora_status: 'registered',
    registradora_id: 'CIP-REG-789456124',
  },
  {
    id: 'SPOT-2026-001236',
    external_ref: 'CAP-GIRO-2026-Q2',
    bank_ref: null,
    merchant: { name: 'Café Gourmet SA', fantasy: 'Café Gourmet', cnpj: '34.567.890/0001-12', id: 'sub_ghi789' },
    created_at: '2026-05-08T16:30:00Z',
    dt_payment: '2026-05-09',
    executed_at: null,
    vl_ordered: 45_000.00,
    rt_spot_anticipation: 1.89,
    rate_value: 467.78,
    iof: 16.15,
    total: 44_516.07,
    status: 'failed',
    sub_status: 'bank_rejected',
    method: 'ted',
    bank: 'Santander',
    avg_term_days: 16.5,
    receivables_count: 34,
    project: 'PagSmile BR',
    health_score: 32,
    sla_adherence: 'critical',
    registradora_status: 'registered',
    registradora_id: 'CIP-REG-789456120',
  },
  {
    id: 'SPOT-2026-001237',
    external_ref: null,
    bank_ref: null,
    merchant: { name: 'Loja do João', fantasy: 'Loja do João', cnpj: '45.678.901/0001-23', id: 'sub_jkl012' },
    created_at: '2026-05-09T14:50:11Z',
    dt_payment: '2026-05-10',
    executed_at: null,
    vl_ordered: 750_000.00, // ALTO VALOR — disparou alçada
    rt_spot_anticipation: 1.49,
    rate_value: 6_843.75,
    iof: 287.50,
    total: 742_868.75,
    status: 'pending_approval',
    sub_status: 'awaiting_executive',
    method: 'pix',
    bank: 'BB',
    avg_term_days: 24.5,
    receivables_count: 412,
    project: 'PagSmile BR',
    health_score: 88,
    sla_adherence: 'ok',
    registradora_status: 'pending',
    registradora_id: null,
  },
  {
    id: 'SPOT-2026-001238',
    external_ref: 'AUTO-WORKFLOW',
    bank_ref: 'PIX-E2E-X9Y8Z7W6V5U4',
    merchant: { name: 'Pet Shop Premium', fantasy: 'Pet Premium', cnpj: '56.789.012/0001-34', id: 'sub_mno345' },
    created_at: '2026-05-08T08:20:45Z',
    dt_payment: '2026-05-09',
    executed_at: '2026-05-09T09:15:00Z',
    vl_ordered: 25_000.00,
    rt_spot_anticipation: 2.19,
    rate_value: 297.46,
    iof: 9.05,
    total: 24_693.49,
    status: 'executed',
    sub_status: null,
    method: 'pix',
    bank: 'Nubank',
    avg_term_days: 16.3,
    receivables_count: 28,
    project: 'PagSmile BR',
    health_score: 94,
    sla_adherence: 'ok',
    registradora_status: 'registered',
    registradora_id: 'CIP-REG-789456118',
  },
  {
    id: 'SPOT-2026-001239',
    external_ref: null,
    bank_ref: null,
    merchant: { name: 'Fashion Store', fantasy: 'Fashion', cnpj: '67.890.123/0001-45', id: 'sub_pqr678' },
    created_at: '2026-05-09T15:05:00Z',
    dt_payment: '2026-05-12',
    executed_at: null,
    vl_ordered: 12_500.00,
    rt_spot_anticipation: 2.79,
    rate_value: 290.81,
    iof: 4.51,
    total: 12_204.68,
    status: 'created',
    sub_status: null,
    method: 'pix',
    bank: 'Inter',
    avg_term_days: 25.0,
    receivables_count: 18,
    project: 'PagSmile BR',
    health_score: 91,
    sla_adherence: 'ok',
    registradora_status: 'pending',
    registradora_id: null,
  },
];

export const statusConfig = {
  created: { label: 'Criada', color: 'bg-slate-100 text-slate-700', dotColor: 'bg-slate-500' },
  in_validation: { label: 'Em Validação', color: 'bg-blue-100 text-blue-700', dotColor: 'bg-blue-500' },
  validated: { label: 'Validada', color: 'bg-cyan-100 text-cyan-700', dotColor: 'bg-cyan-500' },
  pending_approval: { label: 'Aguardando Aprovação', color: 'bg-amber-100 text-amber-700', dotColor: 'bg-amber-500' },
  in_execution: { label: 'Em Execução', color: 'bg-yellow-100 text-yellow-700', dotColor: 'bg-yellow-500' },
  executed: { label: 'Executada', color: 'bg-green-100 text-green-700', dotColor: 'bg-green-500' },
  failed: { label: 'Falhou', color: 'bg-red-100 text-red-700', dotColor: 'bg-red-500' },
  reverted: { label: 'Revertida', color: 'bg-purple-100 text-purple-700', dotColor: 'bg-purple-500' },
};

// Available value (ORIGEM 173) com decomposição completa
export const availableValueMock = {
  merchant_id: 'sub_abc123',
  merchant_name: 'Tech Solutions Ltda',
  available_value: 145_000.00,
  decomposition: [
    { label: 'Total de recebíveis em aberto', value: 250_000.00, type: 'positive' },
    { label: 'Recebíveis já antecipados anteriormente', value: -80_000.00, type: 'negative' },
    { label: 'Recebíveis em chargeback ativo', value: -5_000.00, type: 'negative' },
    { label: 'Recebíveis cedidos a terceiros', value: -20_000.00, type: 'negative' },
    { label: 'Limite de exposição não atingido', value: 0, type: 'neutral' },
  ],
  current_rate: 1.99,
  exposure_limit: 500_000.00,
  exposure_current: 320_000.00,
  exposure_utilization_pct: 64,
  receivables_distribution: [
    { range: 'D+1', count: 12, value: 18_500.00 },
    { range: 'D+2 a D+7', count: 45, value: 67_300.00 },
    { range: 'D+8 a D+15', count: 38, value: 41_200.00 },
    { range: 'D+16 a D+30', count: 28, value: 18_000.00 },
  ],
  // F3289 — projeção futura (diferencial Mentor)
  future_projection: [
    { date: '2026-05-10', projected_available: 152_000 },
    { date: '2026-05-16', projected_available: 178_500 },
    { date: '2026-05-23', projected_available: 195_000 },
    { date: '2026-06-08', projected_available: 220_000 },
  ],
  recent_anticipations: [
    { id: 'SPOT-2026-001100', date: '2026-04-25', value: 50_000, status: 'executed' },
    { id: 'SPOT-2026-001050', date: '2026-04-12', value: 75_000, status: 'executed' },
    { id: 'SPOT-2026-001000', date: '2026-03-30', value: 30_000, status: 'executed' },
  ],
};

// Recebíveis selecionados (mock detalhado para ficha 360)
export const sampleReceivables = Array.from({ length: 47 }, (_, i) => ({
  id: `tx_${String(i + 1).padStart(6, '0')}`,
  capture_date: '2026-04-20',
  gross_value: Math.round((1500 + Math.random() * 3000) * 100) / 100,
  mdr: 89.50,
  net_value: 0,
  natural_settlement_date: '2026-05-20',
  days_anticipated: Math.round(8 + Math.random() * 20),
  brand: ['visa', 'mastercard', 'elo'][i % 3],
  nsu: `NSU${100000 + i}`,
  terminal: `T${(i % 5) + 1}`,
  liquidation_status: i % 15 === 0 ? 'in_chargeback' : (i % 7 === 0 ? 'liquidated' : 'pending'),
})).map(r => ({ ...r, net_value: r.gross_value - r.mdr }));

// Histórico de eventos (timeline da ficha 360)
export const sampleTimeline = [
  { type: 'created', date: '2026-05-09T09:15:23Z', author: 'maria.silva@pagsmile.com', description: 'Antecipação criada via Backoffice Mentor' },
  { type: 'validation_started', date: '2026-05-09T09:15:25Z', author: 'system', description: 'Validações iniciadas' },
  { type: 'validation_completed', date: '2026-05-09T09:15:32Z', author: 'system', description: 'Validações concluídas com sucesso' },
  { type: 'registradora_registered', date: '2026-05-09T09:15:45Z', author: 'system', description: 'Registrada em CIP — ID CIP-REG-789456123' },
  { type: 'queued', date: '2026-05-09T09:15:50Z', author: 'system', description: 'Em fila de execução' },
  { type: 'execution_started', date: '2026-05-12T10:20:00Z', author: 'system', description: 'Transferência PIX disparada' },
  { type: 'executed', date: '2026-05-12T10:23:45Z', author: 'system', description: 'Transferência confirmada — E2E A1B2C3D4E5F6' },
];

// Cenários alternativos para simulador (F3299 — comparação)
export const simulatorScenarios = [
  { label: 'Cenário atual', value: 100_000, term: 18.3, rate_pct: 1.99, rate_value: 1213.30, iof: 38.80, net: 98_747.90, recommended: false },
  { label: 'Antecipar R$ 80k', value: 80_000, term: 16.8, rate_pct: 1.99, rate_value: 970.64, iof: 28.40, net: 79_001.00, recommended: true, savings: 'Economiza R$ 242,66 em taxa' },
  { label: 'Antecipar R$ 120k', value: 120_000, term: 19.2, rate_pct: 1.99, rate_value: 1530.24, iof: 49.20, net: 118_420.56, recommended: false },
  { label: 'Aguardar 7 dias', value: 100_000, term: 11.3, rate_pct: 1.99, rate_value: 749.30, iof: 24.10, net: 99_226.60, recommended: true, savings: 'Recebíveis mais próximos = menor taxa' },
];

// Notas administrativas
export const sampleNotes = [
  { id: 'note_1', author: 'carlos.financeiro@pagsmile.com', date: '2026-05-12T11:30:00Z', category: 'financial_review', text: 'Antecipação conferida em conciliação diária. Valor bate com extrato.', visibility: 'public' },
  { id: 'note_2', author: 'ana.cs@pagsmile.com', date: '2026-05-09T15:45:00Z', category: 'support', text: 'Lojista solicitou esclarecimento sobre cálculo da taxa via WhatsApp. Compartilhado breakdown completo. Lojista confirmou entendimento.', visibility: 'public' },
];

// Aprovações pendentes (Governance Center)
export const pendingApprovals = [
  { id: 'SPOT-2026-001237', merchant: 'Loja do João', value: 750_000, requester: 'maria.silva@pagsmile.com', requested_at: '2026-05-09T14:50:11Z', reason: 'Valor acima de R$ 500k — alçada Diretor Financeiro', sla_remaining_hours: 18 },
  { id: 'SPOT-2026-001240', merchant: 'Mega Varejo Ltda', value: 1_200_000, requester: 'pedro.fin@pagsmile.com', requested_at: '2026-05-09T13:20:00Z', reason: 'Valor acima de R$ 1MM — alçada CFO', sla_remaining_hours: 16 },
];

// Reversões (Governance Center)
export const reversalsHistory = [
  { id: 'REV-001', anticipation_id: 'SPOT-2026-000987', merchant: 'X-Store', value: 35_000, reversed_at: '2026-05-05T14:00:00Z', operator: 'maria.silva@pagsmile.com', approver: 'cfo@pagsmile.com', reason: 'Erro operacional — antecipação duplicada' },
];

// Registradoras
export const registradorasStatus = [
  { name: 'CIP', code: 'cip', status: 'operational', registered_today: 47, pending: 2, failed_today: 0, last_sync: '2026-05-09T15:00:00Z' },
  { name: 'B3', code: 'b3', status: 'operational', registered_today: 12, pending: 1, failed_today: 0, last_sync: '2026-05-09T15:02:00Z' },
  { name: 'TAG', code: 'tag', status: 'degraded', registered_today: 8, pending: 5, failed_today: 2, last_sync: '2026-05-09T13:30:00Z' },
  { name: 'CERC', code: 'cerc', status: 'operational', registered_today: 23, pending: 0, failed_today: 0, last_sync: '2026-05-09T15:05:00Z' },
];