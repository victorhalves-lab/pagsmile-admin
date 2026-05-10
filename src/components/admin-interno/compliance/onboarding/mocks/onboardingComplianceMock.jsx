// Mocks para o Compliance Onboarding (replicado do app pagsmile-onboarding)

const now = Date.now();
const hoursAgo = (h) => new Date(now - h * 3600 * 1000).toISOString();
const daysAgo = (d) => new Date(now - d * 24 * 3600 * 1000).toISOString();

const merchantTypes = ['Marketplace', 'Ecommerce', 'SaaS', 'Gateway', 'Lite', 'PIX Only'];
const segments = ['Varejo', 'Educação', 'Tecnologia', 'Serviços', 'Saúde', 'Alimentação'];
const statuses = ['Aprovado', 'Recusado', 'Manual', 'Em Análise', 'Pendente'];
const iaDecisions = ['Aprovado', 'Recusado', 'Manual'];

const fakeMerchants = [
  'TechPay Solutions Ltda', 'MercadoVerde S/A', 'EduCash Pagamentos', 'FastFood Express',
  'Saúde Digital ME', 'BookStore Online', 'AgroPlus Comércio', 'Fitness Pro Studio',
  'Beauty Express LTDA', 'Auto Parts Brasil', 'Pet Shop Carinho', 'Cloud Services BR',
  'GameStore Digital', 'Consultoria ABC', 'Restaurante Sabor', 'Fashion Hub Online',
  'Construtora Vista', 'Imobiliária Casa Já', 'Logística Sul', 'Marketing Plus',
  'Studio Foto', 'Academia Forma', 'Padaria do Bairro', 'Farmácia Vida',
  'Posto Combustível BR', 'Eventos Premium', 'Turismo Aventura', 'Jardinagem Verde',
];

const flags = [
  'Documento ilegível', 'CNPJ inativo na Receita', 'Sócio com pendência judicial',
  'Endereço divergente', 'PEP detectado', 'Sanção internacional',
  'Score de crédito baixo', 'Atividade não compatível com MCC',
  'Comprovante de endereço vencido', 'Foto facematch falhou',
];

export const mockOnboardingCases = Array.from({ length: 28 }, (_, i) => {
  const status = statuses[i % statuses.length];
  const iaDecision = iaDecisions[i % iaDecisions.length];
  const isFinal = status === 'Aprovado' || status === 'Recusado';
  const riskScore = Math.floor(Math.random() * 100);
  const createdH = Math.random() * 24 * 30;
  return {
    id: `case_${i + 1}`,
    case_id: `CASE-${String(2026000 + i).padStart(7, '0')}`,
    merchantName: fakeMerchants[i % fakeMerchants.length],
    merchantType: merchantTypes[i % merchantTypes.length],
    segment: segments[i % segments.length],
    contactEmail: `contato${i + 1}@empresa.com.br`,
    cnpj: `${10 + i}.${100 + i}.${200 + i}/0001-${String(50 + i).padStart(2, '0')}`,
    status,
    iaDecision,
    riskScore,
    helenaScore: Math.max(0, Math.min(100, riskScore + (Math.random() * 20 - 10))),
    created_date: hoursAgo(createdH),
    updated_date: hoursAgo(Math.max(0, createdH - Math.random() * 12)),
    finalDecisionDate: isFinal ? hoursAgo(Math.max(0, createdH - 6)) : null,
    manualReviewDate: iaDecision === 'Manual' ? hoursAgo(Math.max(0, createdH - 4)) : null,
    assignedAnalyst: iaDecision === 'Manual' ? ['Ana Silva', 'Carlos Lima', 'Júlia Costa'][i % 3] : null,
    flags: status === 'Recusado' || iaDecision === 'Manual' ? flags.slice(0, 2 + (i % 3)) : [],
  };
});

export const mockHelenaAnalyses = mockOnboardingCases.map((c, i) => ({
  id: `helena_${i + 1}`,
  case_id: c.case_id,
  status: 'completed',
  decision: c.iaDecision === 'Aprovado' ? 'APPROVED' : c.iaDecision === 'Recusado' ? 'REJECTED' : 'MANUAL_REVIEW',
  processing_time_ms: 1500 + Math.random() * 4000,
  red_flags: c.flags,
  risk_factors: c.flags.slice(0, 1),
  analyst_feedback: i % 4 === 0 ? 'agree' : i % 4 === 1 ? 'disagree' : null,
  created_date: c.created_date,
}));

export const mockDocumentUploads = Array.from({ length: 45 }, (_, i) => ({
  id: `doc_${i + 1}`,
  validationStatus: ['Pendente', 'Validado', 'Reprovado'][i % 3],
  type: ['CNPJ', 'Contrato Social', 'Comprovante Endereço', 'RG Sócio'][i % 4],
  case_id: mockOnboardingCases[i % mockOnboardingCases.length].case_id,
}));

export const mockAnalytics = [
  ...Array.from({ length: 320 }, () => ({ eventType: 'link_click' })),
  ...Array.from({ length: 142 }, () => ({ eventType: 'onboarding_complete' })),
];

// Tendência últimos 14 dias
export const mockTrendData = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(now - (13 - i) * 24 * 3600 * 1000);
  return {
    date: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    aprovados: 5 + Math.floor(Math.random() * 12),
    recusados: 1 + Math.floor(Math.random() * 4),
    manuais: 2 + Math.floor(Math.random() * 6),
  };
});

export const mockHelenaInsights = [
  {
    id: 1,
    severity: 'high',
    title: 'Pico de manual review nas últimas 24h',
    description: '8 casos pendentes há mais de 24h. Recomenda-se priorizar revisão.',
    action: 'Ver casos',
  },
  {
    id: 2,
    severity: 'medium',
    title: 'Taxa de rejeição acima da média',
    description: 'Segmento "Educação" com 32% de rejeição (média geral: 18%).',
    action: 'Investigar',
  },
  {
    id: 3,
    severity: 'low',
    title: 'Tempo médio de análise melhorou 12%',
    description: 'IA está 1.2s mais rápida que semana passada.',
    action: 'Ver detalhes',
  },
];