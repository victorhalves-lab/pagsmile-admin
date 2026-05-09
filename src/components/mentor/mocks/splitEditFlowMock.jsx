/**
 * Mock Mentor — Split Edit Flow (F2908-F2922)
 * Cobertura: PUT /split/{id} com aviso prévio contratual + cutover programado
 */

export const mockCurrentSplitState = {
  split_id: 'SPL-MKT-2024-00489',
  split_name: 'Split Marketplace Magalu — Vendedor TechStore',
  status: 'active',
  vigency_end: '2027-02-28',
  rule_type: 'percentage',
  owner_share: 10,
  merchant_share: 89.5,
  additional_share: 0.5,
  fixed_amount: null,
  charge_processing_fee: 'liquid',
  applicable_brands: ['visa', 'mastercard', 'elo', 'amex'],
  applicable_types: ['credit_card'],
  min_amount: null,
  max_amount: null,
  recipients: [
    { name: 'Magalu (owner)', value: 10, type: 'percentage' },
    { name: 'TechStore (merchant)', value: 89.5, type: 'percentage' },
    { name: 'Bruno Magalhães (indicador)', value: 0.5, type: 'percentage' },
  ],
  tpv_30d: 7_052_000,
  contract_notice_clause: {
    has_clause: true,
    notice_days: 30,
    contract_reference: 'Cláusula 4.2 do Contrato MLU-TS-2024-031',
    last_amendment: '2024-03-01',
  },
};

export const CHANGE_SENSITIVITY = {
  owner_share: { level: 'high', label: 'Distribuição de receita (owner %)', requires_notice: true },
  merchant_share: { level: 'high', label: 'Distribuição de receita (merchant %)', requires_notice: true },
  charge_processing_fee: { level: 'high', label: 'Tratamento da MDR (bruto/líquido)', requires_notice: true },
  fixed_amount: { level: 'high', label: 'Valor fixo do split', requires_notice: true },
  applicable_brands: { level: 'medium', label: 'Bandeiras aceitas', requires_notice: false },
  applicable_types: { level: 'medium', label: 'Tipos de transação aceitos', requires_notice: false },
  min_amount: { level: 'medium', label: 'Valor mínimo aplicável', requires_notice: false },
  max_amount: { level: 'medium', label: 'Valor máximo aplicável', requires_notice: false },
  recipients_additional: { level: 'low', label: 'Beneficiários adicionais', requires_notice: false },
  vigency_end: { level: 'low', label: 'Data de fim de vigência', requires_notice: false },
};