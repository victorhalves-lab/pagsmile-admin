// Mock — Helena/Sentinel V4 Analyses
// 4 chamadas paralelas, 7 dimensões: PRH, RPF, RPJ, AML, Reputação, Endereço, Transacional

const day = 24 * 3600 * 1000;
const isoOffset = (n) => new Date(Date.now() - n * day).toISOString();

export const mockHelenaAnalyses = [
  {
    id: 'ha_001',
    analysis_id: 'HEL-2026-001234',
    onboarding_case_id: 'oc_m_001',
    model_used: 'sentinel_v4',
    analysis_type: 'initial',
    status: 'completed',
    started_at: isoOffset(2),
    completed_at: isoOffset(2),
    duration_seconds: 18.4,
    parallel_calls: 4,
    decision_recommendation: 'manual_review',
    confidence_score: 72,
    narrative_summary: 'Empresa consolidada com 8 anos, perfil financeiro saudável, mas volume declarado supera projeção BDC em 340%. Recomendação: solicitar comprovação de faturamento.',
    narrative: 'A análise Sentinel V4 sobre TechMart Marketplace S.A. (CNPJ 34.567.890/0001-12) consolidou 8 datasets BigDataCorp em 4 chamadas paralelas (18.4s). DIMENSÃO PRH (Pesquisa Histórica): empresa ativa há 8.3 anos, sem alterações societárias suspeitas. DIMENSÃO RPJ (Risco PJ): score Serasa Empresarial 850+, sem protestos, ações judiciais zeradas. DIMENSÃO AML: nenhum vínculo COAF, OFAC limpo. DIMENSÃO Endereço: validado, ocupação corporativa há 6 anos. DIMENSÃO Reputação: 4.7★ ReclameAqui (412 avaliações). RED FLAG: Volume mensal declarado de R$ 2.4M supera projeção BDC (R$ 540K) em 340%. RED FLAG: UBO Pedro Almeida tem vínculo PEP indireto (irmão é vereador municipal). Recomenda-se análise manual com solicitação de últimos 12 demonstrativos financeiros.',
    red_flags: [
      { code: 'VOL_DIVERGENCE', severity: 'high', title: 'Divergência de volume', description: 'Volume declarado 340% acima da projeção BDC', evidence: 'Declarado: R$ 2.4M/mês | BDC: R$ 540K/mês' },
      { code: 'UBO_PEP_INDIRECT', severity: 'medium', title: 'UBO com PEP indireto', description: 'Pedro Almeida (UBO 51%) — irmão vereador', evidence: 'Dataset COAF + bdc_relationships' },
    ],
    green_flags: [
      { code: 'COMPANY_AGE', severity: 'positive', title: 'Empresa consolidada', description: '8.3 anos de atividade contínua' },
      { code: 'CLEAN_OFAC', severity: 'positive', title: 'OFAC/Sanções limpos', description: 'Nenhum vínculo identificado' },
    ],
    recommendations: [
      { action: 'Solicitar últimos 12 DREs', priority: 'high', rationale: 'Justificar divergência de volume' },
      { action: 'Declaração PEP do UBO', priority: 'medium', rationale: 'Vínculo familiar com agente público' },
    ],
    documents_to_request: ['DRE 12 meses', 'Balanço patrimonial', 'Declaração PEP UBO'],
    tokens_used: 18420,
    cost_estimate: 0.42,
    created_date: isoOffset(2),
  },
  {
    id: 'ha_002',
    analysis_id: 'HEL-2026-001235',
    onboarding_case_id: 'oc_m_002',
    model_used: 'sentinel_v4',
    analysis_type: 'initial',
    status: 'completed',
    started_at: isoOffset(5),
    completed_at: isoOffset(5),
    duration_seconds: 12.1,
    parallel_calls: 4,
    decision_recommendation: 'approve',
    confidence_score: 94,
    narrative_summary: 'Loja Express — 12 anos, score Serasa 880, todas as dimensões verdes. Aprovação automática recomendada.',
    red_flags: [],
    green_flags: [
      { code: 'EXCELLENT_SCORE', severity: 'positive', title: 'Score Serasa excepcional', description: '880 pontos' },
      { code: 'STABLE_ADDRESS', severity: 'positive', title: 'Endereço estável', description: '5+ anos no mesmo local' },
    ],
    tokens_used: 11200,
    cost_estimate: 0.26,
    created_date: isoOffset(5),
  },
  {
    id: 'ha_003',
    analysis_id: 'HEL-2026-001236',
    onboarding_case_id: 'oc_m_003',
    model_used: 'sentinel_v4',
    status: 'completed',
    started_at: isoOffset(8),
    completed_at: isoOffset(8),
    duration_seconds: 22.3,
    decision_recommendation: 'reject',
    confidence_score: 98,
    narrative_summary: 'PayCorp — UBO em sanções OFAC ATIVAS. Recusa automática. Bloqueio imediato + relatório COAF.',
    red_flags: [
      { code: 'OFAC_ACTIVE', severity: 'critical', title: 'Sanção OFAC ativa', description: 'UBO José Silva — SDN List', evidence: 'OFAC List ID #12345' },
      { code: 'NEW_CNPJ', severity: 'high', title: 'CNPJ recente', description: 'Empresa criada há 2 meses' },
      { code: 'SHARED_ADDRESS', severity: 'high', title: 'Endereço compartilhado', description: '12 outras empresas no mesmo CEP' },
    ],
    tokens_used: 24100,
    cost_estimate: 0.58,
    created_date: isoOffset(8),
  },
];