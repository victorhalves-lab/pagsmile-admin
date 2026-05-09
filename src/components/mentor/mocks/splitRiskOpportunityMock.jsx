/**
 * Mock Mentor — Split Risk & Opportunity Analyzer (F2860-F2871, F2929-F2937)
 * Painel global de risco/oportunidade da carteira de splits
 */

export const mockPortfolioStats = {
  total_splits: 47,
  active_splits: 38,
  total_owner_revenue_30d: 482_700, // BRL/mês
  weighted_health_score: 78, // média ponderada por TPV
  predicted_revenue_next_30d: 461_300, // -4.4%
  predicted_delta_pct: -4.4,
};

// Splits classificados por categoria de risco/oportunidade
export const mockSplitsAnalysis = [
  // RISCO — Receita declinante
  {
    split_id: 'SPL-MKT-2024-00321',
    split_name: 'Split Marketplace ModaPlus — Vendedor TopShoes',
    owner_share: 8,
    tpv_30d: 1_240_000,
    tpv_90d_avg: 2_180_000,
    tpv_trend_pct: -43.1,
    owner_revenue_30d: 99_200,
    health_score: 38,
    classification: 'declining_revenue',
    severity: 'high',
    diagnosis: 'TPV caiu 43% em 90 dias · ticket médio caindo · sazonalidade não justifica',
    suggested_actions: [
      'Reunião comercial com TopShoes para entender queda',
      'Revisar mix de bandeiras aceitas (3DS impactando aprovação)',
      'Avaliar campanhas de retenção',
    ],
    estimated_impact: -38_400,
  },
  {
    split_id: 'SPL-AFF-2024-00098',
    split_name: 'Comissão Indicador Pereira & Cia',
    owner_share: 1.2,
    tpv_30d: 320_000,
    tpv_90d_avg: 580_000,
    tpv_trend_pct: -44.8,
    owner_revenue_30d: 3_840,
    health_score: 32,
    classification: 'declining_revenue',
    severity: 'medium',
    diagnosis: 'Indicador inativo há 60 dias · não traz novos merchants desde fev/2026',
    suggested_actions: [
      'Contato comercial para reengajar indicador',
      'Avaliar redução de comissão vigente',
      'Considerar encerramento se não houver retomada em 30d',
    ],
    estimated_impact: -2_660,
  },
  // OPORTUNIDADE — Subutilizado (poderia render mais)
  {
    split_id: 'SPL-MKT-2024-00489',
    split_name: 'Split Marketplace Magalu — Vendedor TechStore',
    owner_share: 10,
    tpv_30d: 7_052_000,
    tpv_90d_avg: 6_120_000,
    tpv_trend_pct: 15.2,
    owner_revenue_30d: 705_200,
    health_score: 92,
    classification: 'undervalued',
    severity: 'high',
    diagnosis: 'Crescimento consistente +15% · merchant pagaria até 12% · ainda em 10%',
    suggested_actions: [
      'Renegociar para 11.5-12% no próximo ciclo contratual',
      'Adicionar bandeiras premium (Hipercard, Diners) ao escopo',
      'Avaliar split escalonado para incentivar volume ainda maior',
    ],
    estimated_impact: 105_780,
  },
  {
    split_id: 'SPL-MKT-2024-00712',
    split_name: 'Split Marketplace ShopExpress — Vendedor LiveBeauty',
    owner_share: 7,
    tpv_30d: 2_840_000,
    tpv_90d_avg: 2_410_000,
    tpv_trend_pct: 17.8,
    owner_revenue_30d: 198_800,
    health_score: 88,
    classification: 'undervalued',
    severity: 'medium',
    diagnosis: 'Performance acima da média · benchmark setor: 9-10% para esta vertical',
    suggested_actions: [
      'Renegociar para 8.5% no aniversário do contrato (jul/2026)',
      'Apresentar pacote de antecipação como compensação',
    ],
    estimated_impact: 42_600,
  },
  // RISCO — Concentração crítica
  {
    split_id: 'SPL-MKT-2023-00088',
    split_name: 'Split Marketplace BigOne — Único Seller',
    owner_share: 12,
    tpv_30d: 9_840_000,
    tpv_90d_avg: 9_220_000,
    tpv_trend_pct: 6.7,
    owner_revenue_30d: 1_180_800,
    health_score: 71,
    classification: 'concentration_risk',
    severity: 'high',
    diagnosis: 'Representa 32% da receita total de splits · perda do merchant = impacto crítico',
    suggested_actions: [
      'Diversificar carteira buscando merchants similares',
      'Negociar contrato de exclusividade ou multa rescisória',
      'Reforçar relacionamento comercial (account management dedicado)',
    ],
    estimated_impact: 0,
  },
  // OPORTUNIDADE — Beneficiário inativo (limpeza)
  {
    split_id: 'SPL-AFF-2024-00231',
    split_name: 'Comissão Broker Tradicional XYZ',
    owner_share: 0.5,
    tpv_30d: 0,
    tpv_90d_avg: 12_000,
    tpv_trend_pct: -100,
    owner_revenue_30d: 0,
    health_score: 12,
    classification: 'inactive',
    severity: 'low',
    diagnosis: 'Sem TPV há 30+ dias · indicador desligou parceria em mar/2026',
    suggested_actions: [
      'Encerrar split (irreversível) para limpeza da carteira',
      'Arquivar contrato no repositório documental',
    ],
    estimated_impact: 0,
  },
  // RISCO — Bandeira em desativação
  {
    split_id: 'SPL-MKT-2024-00501',
    split_name: 'Split Marketplace Magalu — ModaFashion',
    owner_share: 9.5,
    tpv_30d: 4_120_000,
    tpv_90d_avg: 4_020_000,
    tpv_trend_pct: 2.5,
    owner_revenue_30d: 391_400,
    health_score: 65,
    classification: 'config_drift',
    severity: 'medium',
    diagnosis: 'Aceita Hipercard que será descontinuada em ago/2026 · 8% do volume',
    suggested_actions: [
      'Remover Hipercard do escopo no próximo ciclo',
      'Comunicar merchant sobre a mudança',
    ],
    estimated_impact: -31_300,
  },
];

export const CLASSIFICATION_META = {
  declining_revenue: {
    label: 'Receita declinante',
    icon: 'TrendingDown',
    color: 'red',
    description: 'TPV caindo 20%+ em 90 dias',
  },
  undervalued: {
    label: 'Subutilizado',
    icon: 'TrendingUp',
    color: 'emerald',
    description: 'Oportunidade de renegociação',
  },
  concentration_risk: {
    label: 'Risco de concentração',
    icon: 'AlertTriangle',
    color: 'amber',
    description: 'Representa 20%+ da carteira',
  },
  inactive: {
    label: 'Inativo',
    icon: 'PowerOff',
    color: 'slate',
    description: 'Sem TPV há 30+ dias',
  },
  config_drift: {
    label: 'Drift de configuração',
    icon: 'AlertCircle',
    color: 'amber',
    description: 'Configuração divergente do recomendado',
  },
};