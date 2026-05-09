/**
 * Mock Mentor — Wave H.7 · Governança Admin Interno de Splits
 * Visão regulatória/de risco do PSP sobre TODOS os splits configurados em todas as subcontas
 * Pontos críticos: KYC dos beneficiários, concentração de risco, irregularidades, auditoria
 */

export const mockGovernanceKPIs = {
  total_splits_active: 1_287,
  total_merchants_with_splits: 412,
  total_recipients_unique: 3_840,
  tpv_split_30d: 42_180_000,
  flagged_splits: 23,
  unverified_recipients: 87,
  config_drift_count: 14,
  weighted_compliance_score: 87,
};

export const mockGovernanceFlags = [
  {
    flag_id: 'GOV-2026-0019',
    severity: 'critical',
    type: 'kyc_failure',
    title: 'Beneficiário sem KYC válido em split ativo',
    description:
      'Split SPL-MKT-2024-00712 da subconta TopShoes envia 12% para CPF 042.***.***-91 com KYC expirado há 45 dias',
    split_id: 'SPL-MKT-2024-00712',
    merchant: 'TopShoes Brasil',
    recipient: 'CPF 042.***.***-91',
    detected_at: '2026-05-08T09:14:00Z',
    regulatory_reference: 'BCB Resolução 4.658/2018, Art. 3º · KYC obrigatório p/ beneficiários PEP',
    suggested_action: 'Suspender split até regularização do KYC do beneficiário',
  },
  {
    flag_id: 'GOV-2026-0021',
    severity: 'high',
    type: 'concentration_risk',
    title: 'Concentração crítica em único beneficiário',
    description:
      'Beneficiário único concentra 38% de toda receita de splits do PSP · risco de continuidade',
    split_id: 'SPL-MKT-2023-00088',
    merchant: 'BigOne Marketplace',
    recipient: 'CNPJ 14.***.***/0001-**',
    detected_at: '2026-05-07T15:30:00Z',
    regulatory_reference: 'Política interna PagSmile · Limite por beneficiário 25%',
    suggested_action: 'Acionar compliance comercial · diversificação obrigatória em 60d',
  },
  {
    flag_id: 'GOV-2026-0024',
    severity: 'high',
    type: 'pep_unflagged',
    title: 'Beneficiário identificado como PEP sem flag',
    description:
      'Sistema cruzou base PEP e identificou beneficiário Marcos R. Silva sem marcação na cadastral',
    split_id: 'SPL-MKT-2024-00501',
    merchant: 'ModaFashion BR',
    recipient: 'Marcos R. Silva',
    detected_at: '2026-05-08T03:22:00Z',
    regulatory_reference: 'COAF Circular 4.001/2020 · Identificação PEP obrigatória',
    suggested_action: 'Atualizar flag PEP + acionar compliance KYC',
  },
  {
    flag_id: 'GOV-2026-0028',
    severity: 'medium',
    type: 'config_drift',
    title: 'Split com configuração divergente do padrão setor',
    description:
      'Split entre vertical "saúde estética" com 25% para indicador supera benchmark setorial (12-15%)',
    split_id: 'SPL-AFF-2024-00321',
    merchant: 'Clínica BellaSkin',
    recipient: 'Captador FastLeads',
    detected_at: '2026-05-06T11:48:00Z',
    regulatory_reference: 'Conselho Federal de Medicina · Vedação a captação de pacientes (Res. 1.974/11)',
    suggested_action: 'Acionar compliance comercial · risco regulatório CFM',
  },
  {
    flag_id: 'GOV-2026-0031',
    severity: 'medium',
    type: 'sanctions_screening',
    title: 'Beneficiário em watchlist OFAC',
    description: 'Match parcial (78%) com lista OFAC SDN · revisão manual obrigatória',
    split_id: 'SPL-MKT-2024-00098',
    merchant: 'GlobalShop Imports',
    recipient: 'Foreign Recipient LLC',
    detected_at: '2026-05-05T14:00:00Z',
    regulatory_reference: 'OFAC SDN List · BCB Carta-Circular 4.001',
    suggested_action: 'Bloqueio preventivo + due diligence reforçada',
  },
  {
    flag_id: 'GOV-2026-0033',
    severity: 'low',
    type: 'fee_structure',
    title: 'Quem paga o MDR não declarado',
    description:
      'Split sem clara atribuição de quem paga o MDR · inferência automática divergente do contrato',
    split_id: 'SPL-MKT-2024-00489',
    merchant: 'Magalu TechStore',
    recipient: '—',
    detected_at: '2026-05-04T08:00:00Z',
    regulatory_reference: 'BCB Circular 3.978/2020 · Transparência tarifária',
    suggested_action: 'Solicitar revisão contratual ao merchant',
  },
];

export const mockSeverityCounts = {
  critical: mockGovernanceFlags.filter((f) => f.severity === 'critical').length,
  high: mockGovernanceFlags.filter((f) => f.severity === 'high').length,
  medium: mockGovernanceFlags.filter((f) => f.severity === 'medium').length,
  low: mockGovernanceFlags.filter((f) => f.severity === 'low').length,
};

export const mockTypeCounts = {
  kyc_failure: { label: 'KYC Falho', count: 1, color: 'red' },
  concentration_risk: { label: 'Concentração', count: 1, color: 'amber' },
  pep_unflagged: { label: 'PEP Não-Marcado', count: 1, color: 'red' },
  config_drift: { label: 'Drift Config', count: 1, color: 'amber' },
  sanctions_screening: { label: 'OFAC/Sanções', count: 1, color: 'red' },
  fee_structure: { label: 'MDR Indefinido', count: 1, color: 'blue' },
};

export const mockRegulatoryReports = [
  {
    report_id: 'COAF-MAY-2026',
    type: 'COAF Mensal',
    period: 'maio/2026',
    status: 'pending_review',
    splits_affected: 12,
    deadline: '2026-06-10',
  },
  {
    report_id: 'BCB-Q1-2026',
    type: 'BCB Trimestral · Splits & Sub-credenciamento',
    period: 'Q1 2026',
    status: 'submitted',
    splits_affected: 1287,
    deadline: '2026-04-30',
    submitted_at: '2026-04-28T18:30:00Z',
  },
  {
    report_id: 'OFAC-MAY-2026',
    type: 'OFAC Watchlist Cross-Check',
    period: 'maio/2026',
    status: 'in_progress',
    splits_affected: 8,
    deadline: '2026-05-15',
  },
];

export const mockTopMerchantsBySplitTPV = [
  { rank: 1, merchant: 'BigOne Marketplace', tpv: 9_840_000, splits: 1, recipients: 1, compliance_score: 71 },
  { rank: 2, merchant: 'Magalu TechStore', tpv: 7_052_000, splits: 1, recipients: 3, compliance_score: 92 },
  { rank: 3, merchant: 'ShopExpress', tpv: 4_840_000, splits: 12, recipients: 47, compliance_score: 88 },
  { rank: 4, merchant: 'ModaFashion BR', tpv: 4_120_000, splits: 1, recipients: 2, compliance_score: 65 },
  { rank: 5, merchant: 'TopShoes Brasil', tpv: 1_240_000, splits: 1, recipients: 2, compliance_score: 38 },
];