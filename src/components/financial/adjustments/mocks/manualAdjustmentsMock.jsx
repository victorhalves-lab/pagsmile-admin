// Mock data — Manual Adjustments (Wave K)
export const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export const ADJUSTMENT_STATUS = {
  draft: { label: 'Rascunho', color: 'bg-slate-100 text-slate-700' },
  pending_approval: { label: 'Pendente L2', color: 'bg-amber-100 text-amber-700' },
  approved: { label: 'Aprovado', color: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-700' },
  reversed: { label: 'Estornado', color: 'bg-violet-100 text-violet-700' },
  executed: { label: 'Executado', color: 'bg-blue-100 text-blue-700' },
};

export const ADJUSTMENT_TYPES = {
  credit: { label: 'Crédito', icon: '+', color: 'bg-emerald-100 text-emerald-700' },
  debit: { label: 'Débito', icon: '−', color: 'bg-red-100 text-red-700' },
};

export const ADJUSTMENT_REASONS = {
  CHARGEBACK_REVERSAL: { label: 'Estorno chargeback', category: 'dispute', color: 'bg-blue-100 text-blue-700' },
  FEE_REFUND: { label: 'Devolução tarifa', category: 'fee', color: 'bg-emerald-100 text-emerald-700' },
  COMMERCIAL_BONUS: { label: 'Bônus comercial', category: 'commercial', color: 'bg-violet-100 text-violet-700' },
  OPERATIONAL_ERROR: { label: 'Erro operacional', category: 'operational', color: 'bg-amber-100 text-amber-700' },
  DUPLICATE_CHARGE: { label: 'Cobrança duplicada', category: 'operational', color: 'bg-amber-100 text-amber-700' },
  MDR_ADJUSTMENT: { label: 'Ajuste de MDR', category: 'fee', color: 'bg-emerald-100 text-emerald-700' },
  COMPLIANCE_FINE: { label: 'Multa compliance', category: 'compliance', color: 'bg-red-100 text-red-700' },
  PARTNERSHIP_REBATE: { label: 'Rebate parceria', category: 'commercial', color: 'bg-violet-100 text-violet-700' },
};

export const REASON_CODES = Object.keys(ADJUSTMENT_REASONS).map(code => ({
  code, ...ADJUSTMENT_REASONS[code],
}));

export const ADJUSTMENTS_KPIS = {
  total_credit: 145_820,
  total_debit: 89_340,
  net_impact: 56_480,
  pending_approval: 7,
  applied_count: 42,
  reverted_count: 3,
  avg_amount: 2_340,
};

export const TOP_REASONS_PARETO = [
  { reason: 'CHARGEBACK_REVERSAL', label: 'Estorno chargeback', value: 58_400, count: 18 },
  { reason: 'FEE_REFUND', label: 'Devolução tarifa', value: 32_100, count: 14 },
  { reason: 'OPERATIONAL_ERROR', label: 'Erro operacional', value: 21_800, count: 9 },
  { reason: 'COMMERCIAL_BONUS', label: 'Bônus comercial', value: 18_400, count: 6 },
  { reason: 'DUPLICATE_CHARGE', label: 'Cobrança duplicada', value: 14_460, count: 5 },
];

const merchants = [
  { id: 'mer_001', name: 'E-commerce XYZ Ltda', cnpj: '12.345.678/0001-90' },
  { id: 'mer_002', name: 'PetShop Premium', cnpj: '98.765.432/0001-10' },
  { id: 'mer_003', name: 'Fashion Online ME', cnpj: '11.222.333/0001-44' },
  { id: 'mer_004', name: 'SaaS Cloud BR', cnpj: '55.666.777/0001-88' },
  { id: 'mer_005', name: 'Mega Lojas SA', cnpj: '22.333.444/0001-55' },
];

const reasonKeys = Object.keys(ADJUSTMENT_REASONS);
const statuses = ['executed', 'executed', 'executed', 'pending_approval', 'approved', 'rejected', 'reversed'];

export const MOCK_ADJUSTMENTS = Array.from({ length: 35 }).map((_, i) => {
  const reasonKey = reasonKeys[i % reasonKeys.length];
  const reasonObj = ADJUSTMENT_REASONS[reasonKey];
  const isCredit = i % 3 !== 0;
  const amount = 100 + Math.random() * 9900;
  const merchant = merchants[i % merchants.length];
  const status = statuses[i % statuses.length];
  const createdAt = new Date(Date.now() - i * 86400000).toISOString();
  return {
    id: `ADJ-${String(202600 + i).padStart(6, '0')}`,
    merchant,
    type: isCredit ? 'credit' : 'debit',
    amount: Number(amount.toFixed(2)),
    reason: reasonKey,
    reason_code: reasonKey,
    reason_label: reasonObj.label,
    category: reasonObj.category,
    status,
    created_at: createdAt,
    executed_at: status === 'executed' ? createdAt : null,
    created_by: ['ana.silva@pagsmile.com', 'bruno.costa@pagsmile.com', 'carla.dias@pagsmile.com'][i % 3],
    approved_by: i % 4 === 0 ? null : 'gestor.l2@pagsmile.com',
    description: `Ajuste referente a ${reasonObj.label.toLowerCase()} — ticket #${10000 + i}`,
    merchant_visible_note: isCredit ? `Crédito: ${reasonObj.label}` : `Débito: ${reasonObj.label}`,
    evidence_count: (i % 3) + 1,
  };
});