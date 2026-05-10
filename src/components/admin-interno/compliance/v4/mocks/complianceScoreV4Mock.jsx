// Mock — Compliance Score V4 (modelo determinístico)
// 13 dimensões, 22-39 datasets BDC, 10 bandas (B01-B10)

export const mockComplianceScores = [
  {
    id: 'cs_001',
    score_id: 'SCO-2026-001234',
    onboarding_case_id: 'oc_m_001',
    model_version: 'v4.0',
    model_type: 'v4_merchant_card',
    final_score: 67,
    final_band: 'B05',
    final_category: 'medium',
    decision: 'manual_review',
    dimensions: {
      prh: { score: 78, weight: 0.10, evidence: 'Empresa ativa há 8 anos' },
      rpj: { score: 82, weight: 0.15, evidence: 'Serasa 850, sem protestos' },
      rpf: { score: 70, weight: 0.10, evidence: 'UBOs limpos majoritariamente' },
      aml: { score: 65, weight: 0.15, evidence: 'PEP indireto identificado' },
      reputacao: { score: 85, weight: 0.08, evidence: 'ReclameAqui 4.7★' },
      endereco: { score: 90, weight: 0.07, evidence: 'Endereço validado' },
      transacional: { score: 45, weight: 0.15, evidence: 'Volume divergente' },
      regulatorio: { score: 88, weight: 0.05, evidence: 'Sem multas' },
      operacional: { score: 75, weight: 0.05, evidence: 'CNAE coerente' },
      financeiro: { score: 68, weight: 0.05, evidence: 'Margem operacional OK' },
      vinculos: { score: 60, weight: 0.03, evidence: 'PEP indireto UBO' },
      patrimonio: { score: 72, weight: 0.01, evidence: 'Patrimônio coerente' },
      atividade: { score: 80, weight: 0.01, evidence: '8 anos no segmento' },
    },
    datasets_used: [
      { dataset_name: 'basic_data', weight: 0.05, score_contribution: 4.0, status: 'ok' },
      { dataset_name: 'kyc_data', weight: 0.10, score_contribution: 7.5, status: 'ok' },
      { dataset_name: 'pep_data', weight: 0.15, score_contribution: 9.7, status: 'ok' },
      { dataset_name: 'sanctions', weight: 0.20, score_contribution: 19.0, status: 'ok' },
      { dataset_name: 'financial_data', weight: 0.15, score_contribution: 9.0, status: 'ok' },
      { dataset_name: 'media_profile_data', weight: 0.05, score_contribution: 4.2, status: 'ok' },
      { dataset_name: 'address_data', weight: 0.05, score_contribution: 4.5, status: 'ok' },
      { dataset_name: 'criminal_data', weight: 0.10, score_contribution: 8.0, status: 'ok' },
    ],
    is_final: false,
    calculated_at: new Date().toISOString(),
  },
];