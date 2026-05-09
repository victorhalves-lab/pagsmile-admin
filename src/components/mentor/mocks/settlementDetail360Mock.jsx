/**
 * Mock Mentor — Wave I.1/I.2/I.3 · Ficha 360 do Settlement
 * Inclui dados completos do pagamento: identidade, lojista, conta, transações,
 * decomposição financeira, timeline, parcelas, estornos, score, riscos
 */

export const mockSettlementDetail = {
  settlement_id: 'STL-2026-05-09-00489',
  internal_id: 'a8f3c192-7b4e-4d28-92a1-c0f8e3b41095',
  status: 'in_execution',
  sub_status: 'awaiting_bank_confirmation',
  bank_reference: null,
  type: 'card_credit',
  origin: 'automatic',

  // Lojista destinatário
  merchant: {
    merchant_id: 'M-00489',
    fantasy_name: 'Magalu TechStore',
    legal_name: 'Magalu TechStore Comércio LTDA',
    document: '14.123.456/0001-78',
    status: 'active',
    csm: 'Carolina Santos',
    csm_email: 'csm@pagsmile.com',
    segment: 'E-commerce eletrônicos',
    size: 'Enterprise (Top 50)',
    risk_score: 18,
    relationship_status: 'healthy',
  },

  // Conta bancária
  bank_account: {
    bank_name: 'Itaú Unibanco',
    bank_code: '341',
    agency: '0001',
    account_number: '12345-6',
    account_type: 'checking',
    account_holder: 'Magalu TechStore Comércio LTDA',
    holder_document: '14.123.456/0001-78',
    registered_at: '2024-03-12',
    last_validated_at: '2026-04-22',
    validation_status: 'validated',
    recent_changes: [], // sem mudanças recentes
  },

  // Cálculo financeiro
  financial: {
    gross_amount: 50_000.00,
    mdr_amount: 1_200.00,
    mdr_avg_rate: 2.4,
    anticipation_fee: 75.00,
    anticipation_volume: 30_000.00,
    terminal_rental: 300.00,
    terminals_charged: 3,
    terminal_unit_price: 100.00,
    chargebacks_deducted: 350.00,
    chargebacks_count: 2,
    adjustments: 150.00,
    adjustments_note: 'Chargeback de mês anterior revertido pela bandeira',
    net_amount: 48_225.00,
    expected_net: 48_225.00,
    has_anomaly: false,
  },

  // Datas
  dates: {
    created_at: '2026-05-09T03:14:32Z',
    validation_completed_at: '2026-05-09T03:14:58Z',
    queued_at: '2026-05-09T03:15:02Z',
    execution_started_at: '2026-05-09T03:15:14Z',
    expected_execution_at: '2026-05-09T08:00:00Z',
    actual_execution_at: null,
    sla_target_hours: 6,
    sla_status: 'within_sla',
  },

  execution_method: 'PIX',
  installments_count: 0, // pagamento único — em casos de parcelado, > 0

  // Score Mentor
  health_score: 87,
  risks: [
    {
      level: 'low',
      type: 'high_value',
      description: 'Valor 12% acima da média histórica do lojista (R$ 43k)',
      action: 'Validar com Customer Success antes da execução',
    },
  ],
  proactive_suggestions: [
    'Pagamento próximo do horário de execução previsto · monitorar fila bancária',
    'Lojista Top 50 · validar disponibilidade do gerente CS para acompanhamento',
  ],

  // Notas administrativas
  admin_notes: [
    {
      author: 'Ana Costa (Financeiro)',
      timestamp: '2026-05-09T03:20:15Z',
      category: 'financial_review',
      visibility: 'team',
      content: 'Revisado · cálculo bate com TPV agregado das transações da janela. Aluguel descontado conforme contrato (3 terminais ativos).',
    },
    {
      author: 'Pedro Lima (CS)',
      timestamp: '2026-05-09T04:02:48Z',
      category: 'customer_success',
      visibility: 'team',
      content: 'Lojista informado por WhatsApp · valor confirmado.',
    },
  ],
};

export const mockAggregatedTransactions = [
  { txn_id: 'TXN-89012451', captured_at: '2026-05-08T14:32:00Z', amount: 1240.00, mdr: 29.76, net: 1210.24, brand: 'visa', terminal: 'TRM-001', nsu: '892341', auth_code: '512AB7' },
  { txn_id: 'TXN-89012452', captured_at: '2026-05-08T14:48:00Z', amount: 890.00, mdr: 21.36, net: 868.64, brand: 'mastercard', terminal: 'TRM-001', nsu: '892342', auth_code: '512AB8' },
  { txn_id: 'TXN-89012453', captured_at: '2026-05-08T15:12:00Z', amount: 4_500.00, mdr: 108.00, net: 4_392.00, brand: 'visa', terminal: 'TRM-002', nsu: '892343', auth_code: '512AB9' },
  { txn_id: 'TXN-89012454', captured_at: '2026-05-08T15:34:00Z', amount: 2_100.00, mdr: 50.40, net: 2_049.60, brand: 'elo', terminal: 'TRM-002', nsu: '892344', auth_code: '512ABA' },
  { txn_id: 'TXN-89012455', captured_at: '2026-05-08T16:02:00Z', amount: 6_200.00, mdr: 148.80, net: 6_051.20, brand: 'visa', terminal: 'TRM-003', nsu: '892345', auth_code: '512ABB' },
  { txn_id: 'TXN-89012456', captured_at: '2026-05-08T16:30:00Z', amount: 980.00, mdr: 23.52, net: 956.48, brand: 'mastercard', terminal: 'TRM-001', nsu: '892346', auth_code: '512ABC' },
];

export const mockTimeline = [
  { timestamp: '2026-05-09T03:14:32Z', type: 'created', label: 'Pagamento criado pelo motor de agregação', author: 'Sistema', details: '6 transações agregadas · valor bruto R$ 50.000,00' },
  { timestamp: '2026-05-09T03:14:58Z', type: 'validated', label: 'Validações pré-execução concluídas', author: 'Sistema', details: 'Conta bancária OK · regras OK · integridade OK' },
  { timestamp: '2026-05-09T03:15:02Z', type: 'queued', label: 'Entrou na fila de execução', author: 'Sistema' },
  { timestamp: '2026-05-09T03:15:14Z', type: 'in_execution', label: 'Transferência PIX disparada ao Itaú', author: 'Sistema', details: 'Aguardando confirmação do banco' },
  { timestamp: '2026-05-09T03:20:15Z', type: 'note_added', label: 'Nota administrativa adicionada', author: 'Ana Costa (Financeiro)' },
];

// Wave I.2 — Parcelas (settlement parcelado em 12x para demo de cenário)
export const mockSettlementInstallments = {
  total_installments: 12,
  paid_installments: 4,
  total_value: 12_000.00,
  paid_value: 4_000.00,
  pending_value: 8_000.00,
  installments: [
    { number: 1, total: 12, expected_at: '2026-02-09', actual_at: '2026-02-09', amount: 1_000.00, status: 'paid', method: 'PIX' },
    { number: 2, total: 12, expected_at: '2026-03-09', actual_at: '2026-03-09', amount: 1_000.00, status: 'paid', method: 'PIX' },
    { number: 3, total: 12, expected_at: '2026-04-09', actual_at: '2026-04-09', amount: 1_000.00, status: 'paid', method: 'PIX' },
    { number: 4, total: 12, expected_at: '2026-05-09', actual_at: '2026-05-09', amount: 1_000.00, status: 'paid', method: 'PIX' },
    { number: 5, total: 12, expected_at: '2026-06-09', actual_at: null, amount: 1_000.00, status: 'scheduled', method: 'PIX' },
    { number: 6, total: 12, expected_at: '2026-07-09', actual_at: null, amount: 1_000.00, status: 'scheduled', method: 'PIX' },
    { number: 7, total: 12, expected_at: '2026-08-09', actual_at: null, amount: 1_000.00, status: 'scheduled', method: 'PIX' },
    { number: 8, total: 12, expected_at: '2026-09-09', actual_at: null, amount: 1_000.00, status: 'scheduled', method: 'PIX' },
    { number: 9, total: 12, expected_at: '2026-10-09', actual_at: null, amount: 1_000.00, status: 'scheduled', method: 'PIX' },
    { number: 10, total: 12, expected_at: '2026-11-09', actual_at: null, amount: 1_000.00, status: 'scheduled', method: 'PIX' },
    { number: 11, total: 12, expected_at: '2026-12-09', actual_at: null, amount: 1_000.00, status: 'scheduled', method: 'PIX' },
    { number: 12, total: 12, expected_at: '2027-01-09', actual_at: null, amount: 1_000.00, status: 'scheduled', method: 'PIX' },
  ],
  installments_at_risk: [],
  avg_amount: 1_000.00,
  avg_interval_days: 30,
};

// Wave I.3 — Estornos relacionados
export const mockSettlementRefunds = [
  {
    refund_id: 'RFD-2026-04-1289',
    type: 'chargeback',
    transaction_id: 'TXN-89004821',
    chargeback_id: 'CB-2026-04-0188',
    amount: 280.00,
    reason: 'Fraude confirmada (Visa Reason Code 10.4)',
    status: 'collected',
    created_at: '2026-04-22T11:14:00Z',
    collection_method: 'discount_next_settlement',
    collected_at: '2026-05-09T03:14:32Z',
  },
  {
    refund_id: 'RFD-2026-04-1290',
    type: 'chargeback',
    transaction_id: 'TXN-89004901',
    chargeback_id: 'CB-2026-04-0192',
    amount: 70.00,
    reason: 'Não reconhecido (Visa Reason Code 13.1)',
    status: 'collected',
    created_at: '2026-04-25T08:42:00Z',
    collection_method: 'discount_next_settlement',
    collected_at: '2026-05-09T03:14:32Z',
  },
];

export const mockRefundsKPIs = {
  total_refunds: 2,
  total_refunded: 350.00,
  refund_rate: 0.7, // % sobre o pagamento
  pending_collection: 0,
};