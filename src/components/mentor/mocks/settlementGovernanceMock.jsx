/**
 * Mock Mentor — Wave I.4/I.5/I.6 · Governance Center, Mass Purge, Manual Settlement
 */

export const mockRecalculatePreview = [
  {
    settlement_id: 'STL-2026-05-09-00489',
    merchant: 'Magalu TechStore',
    current_value: 48_225.00,
    new_value: 48_540.00,
    delta: 315.00,
    delta_pct: 0.65,
    significant: false,
  },
  {
    settlement_id: 'STL-2026-05-09-00521',
    merchant: 'ShopExpress',
    current_value: 12_840.00,
    new_value: 11_280.00,
    delta: -1_560.00,
    delta_pct: -12.15,
    significant: true,
    reason: 'Aluguel de terminais que faltava aplicar (3 terminais × R$ 100)',
  },
  {
    settlement_id: 'STL-2026-05-09-00614',
    merchant: 'BigOne Marketplace',
    current_value: 89_120.00,
    new_value: 89_270.00,
    delta: 150.00,
    delta_pct: 0.17,
    significant: false,
  },
];

export const mockGovernanceAuditLog = [
  {
    event_id: 'GOV-2026-05-09-001',
    type: 'recalculate',
    settlements_count: 12,
    operator: 'Ana Costa (Financeiro)',
    approver: '—',
    timestamp: '2026-05-09T08:14:00Z',
    reason: 'Correção de configuração de aluguel após bug detectado',
    impact: '+R$ 4.180,00 ajuste agregado',
    status: 'completed',
  },
  {
    event_id: 'GOV-2026-05-08-014',
    type: 'forced_status',
    settlements_count: 1,
    operator: 'Pedro Lima (Operações Tech)',
    approver: 'Roberto Silva (Gerente Financeiro)',
    timestamp: '2026-05-08T16:42:00Z',
    reason: 'Banco confirmou recebimento por canal alterno após queda da integração',
    impact: 'Settlement marcado como executado · evidência anexa',
    status: 'completed',
  },
  {
    event_id: 'GOV-2026-05-07-009',
    type: 'rollback',
    settlements_count: 1,
    operator: 'Marina Souza (Compliance)',
    approver: 'Diretoria + Roberto Silva',
    timestamp: '2026-05-07T11:18:00Z',
    reason: 'Fraude detectada na conta de destino · cobrança via boleto programada',
    impact: '−R$ 84.300,00 reverso · cobrança em 3 parcelas',
    status: 'completed',
  },
];

export const mockMassPurgePendingState = {
  total_pending: 1_847,
  total_value: 28_492_180.00,
  affected_merchants: 412,
  oldest_pending_days: 2,
  by_type: [
    { type: 'card_credit', count: 892, value: 18_240_000 },
    { type: 'card_debit', count: 412, value: 4_180_000 },
    { type: 'pix', count: 329, value: 3_840_000 },
    { type: 'voucher', count: 124, value: 1_240_180 },
    { type: 'split_repass', count: 90, value: 992_000 },
  ],
  recent_purges: [
    { date: '2026-04-22', operator: 'Ana Costa', count: 234, value: 4_180_000, reason: 'Recuperação após incidente sistêmico de 22/abr' },
    { date: '2026-02-08', operator: 'Pedro Lima', count: 89, value: 1_240_000, reason: 'Manutenção planejada' },
  ],
};

export const mockPaymentTypes = [
  { type_id: 'card_credit', name: 'Cartão de Crédito', status: 'active', settlement_term: 'D+30', method: 'TED/PIX', accounting: '1.1.04.001', count_30d: 12_842, volume_30d: 184_320_000 },
  { type_id: 'card_debit', name: 'Cartão de Débito', status: 'active', settlement_term: 'D+1', method: 'PIX', accounting: '1.1.04.002', count_30d: 8_412, volume_30d: 89_240_000 },
  { type_id: 'pix', name: 'PIX', status: 'active', settlement_term: 'Instantâneo', method: 'PIX', accounting: '1.1.04.003', count_30d: 28_412, volume_30d: 412_840_000 },
  { type_id: 'voucher', name: 'Voucher (Refeição/Alimentação)', status: 'active', settlement_term: 'D+15', method: 'TED', accounting: '1.1.04.004', count_30d: 1_240, volume_30d: 18_400_000 },
  { type_id: 'split_repass', name: 'Repasse Split', status: 'active', settlement_term: 'D+1', method: 'PIX', accounting: '1.1.04.005', count_30d: 894, volume_30d: 12_840_000 },
  { type_id: 'commission', name: 'Comissão Indicador', status: 'active', settlement_term: 'D+5', method: 'PIX', accounting: '2.1.05.001', count_30d: 412, volume_30d: 1_840_000 },
  { type_id: 'boleto_legacy', name: 'Boleto (Legado)', status: 'discontinued', settlement_term: 'D+3', method: 'TED', accounting: '1.1.04.006', count_30d: 0, volume_30d: 0 },
];