// Mocks extras para páginas Compliance (Forms, Rules, Audit, Helena Training)

const now = Date.now();
const daysAgo = (d) => new Date(now - d * 24 * 3600 * 1000).toISOString();
const hoursAgo = (h) => new Date(now - h * 3600 * 1000).toISOString();

// === FORMULÁRIOS / QUESTIONÁRIOS V4 ===
export const mockQuestionnaireTemplates = [
  {
    id: 'q1', model: 'CompliancePixMerchantV4', name: 'PIX Merchant v4',
    version: '4.0.2', segment: 'PIX', isActive: true,
    questionsCount: 40, blocksCount: 8, completionAvg: 12, // min
    submissionsCount: 1247, lastUpdated: daysAgo(3),
    description: 'Compliance PIX + Conta para merchants. Foco em volume, natureza, PLD/FT e UBOs.',
  },
  {
    id: 'q2', model: 'CompliancePixIntermediarioV4', name: 'PIX Intermediário v4',
    version: '4.0.1', segment: 'PIX', isActive: true,
    questionsCount: 47, blocksCount: 8, completionAvg: 18,
    submissionsCount: 312, lastUpdated: daysAgo(7),
    description: 'Para intermediários (Gateway/PSP, Marketplace, Plataforma). Split, anti-bolção, MED e regulatório BCB.',
  },
  {
    id: 'q3', model: 'ComplianceGatewayV4', name: 'Gateway v4',
    version: '4.0.5', segment: 'Gateway', isActive: true,
    questionsCount: 85, blocksCount: 12, completionAvg: 28,
    submissionsCount: 198, lastUpdated: daysAgo(1),
    description: 'Cobertura regulatória ~98%. Pré-preenchimento Lead v5.',
  },
  {
    id: 'q4', model: 'ComplianceMarketplaceV4', name: 'Marketplace v4',
    version: '4.0.3', segment: 'Marketplace', isActive: true,
    questionsCount: 75, blocksCount: 11, completionAvg: 24,
    submissionsCount: 156, lastUpdated: daysAgo(5),
    description: 'Foco em sellers, split e anti-bolsão.',
  },
  {
    id: 'q5', model: 'ComplianceEcommerceV4', name: 'E-commerce v4',
    version: '4.0.4', segment: 'Ecommerce', isActive: true,
    questionsCount: 44, blocksCount: 8, completionAvg: 14,
    submissionsCount: 892, lastUpdated: daysAgo(2),
    description: 'Foco em produtos, logística e entrega.',
  },
  {
    id: 'q6', model: 'ComplianceSaaSV4', name: 'SaaS v4',
    version: '4.0.2', segment: 'SaaS', isActive: true,
    questionsCount: 40, blocksCount: 9, completionAvg: 13,
    submissionsCount: 423, lastUpdated: daysAgo(8),
    description: 'Modelo de negócio, recorrência, segurança de dados e triagem fintech.',
  },
  {
    id: 'q7', model: 'ComplianceInfoprodutosV4', name: 'Infoprodutos v4',
    version: '4.0.1', segment: 'Ecommerce', isActive: true,
    questionsCount: 56, blocksCount: 11, completionAvg: 19,
    submissionsCount: 267, lastUpdated: daysAgo(12),
    description: 'Produto digital, afiliados e práticas de vendas.',
  },
  {
    id: 'q8', model: 'CompliancePlataformaVerticalV4', name: 'Plataforma Vertical v4',
    version: '4.0.0', segment: 'Marketplace', isActive: false,
    questionsCount: 52, blocksCount: 9, completionAvg: 17,
    submissionsCount: 89, lastUpdated: daysAgo(35),
    description: 'Verticais de nicho (food, saúde, eventos).',
  },
  {
    id: 'q9', model: 'ComplianceMerchantLinkV4', name: 'Merchant Link v4',
    version: '4.0.3', segment: 'Lite', isActive: true,
    questionsCount: 41, blocksCount: 9, completionAvg: 11,
    submissionsCount: 1893, lastUpdated: daysAgo(4),
    description: 'Micro-merchants (MEI/SLU), canais social, entrega presencial.',
  },
];

// === REGRAS E WORKFLOWS ===
export const mockComplianceRules = [
  {
    id: 'r1', name: 'Auto-aprovação Score >= 80 + sem PEP', priority: 1,
    conditions: 'risk_score >= 80 AND is_pep = false AND is_sanctioned = false',
    action: 'auto_approve', isActive: true, executionsCount: 8472, hits: 7891,
    lastExecuted: hoursAgo(0.3),
  },
  {
    id: 'r2', name: 'Auto-rejeição Score < 25', priority: 1,
    conditions: 'risk_score < 25 OR is_sanctioned = true',
    action: 'auto_reject', isActive: true, executionsCount: 423, hits: 401,
    lastExecuted: hoursAgo(1.2),
  },
  {
    id: 'r3', name: 'Manual Review se PEP detectado', priority: 2,
    conditions: 'is_pep = true',
    action: 'manual_review', isActive: true, executionsCount: 89, hits: 89,
    lastExecuted: hoursAgo(4),
  },
  {
    id: 'r4', name: 'Solicitar docs se score 40-60', priority: 3,
    conditions: 'risk_score >= 40 AND risk_score < 60',
    action: 'request_documents', isActive: true, executionsCount: 1247, hits: 1098,
    lastExecuted: hoursAgo(0.1),
  },
  {
    id: 'r5', name: 'Escalonar para Compliance Sr se valor > R$ 1M/mês', priority: 2,
    conditions: 'expected_monthly_volume > 1000000',
    action: 'escalate_senior', isActive: true, executionsCount: 67, hits: 67,
    lastExecuted: daysAgo(1),
  },
  {
    id: 'r6', name: 'BDC retry automático se health = partial', priority: 4,
    conditions: 'bdc_health_status = "partial"',
    action: 'retry_bdc', isActive: false, executionsCount: 234, hits: 198,
    lastExecuted: daysAgo(15),
  },
];

// === AUDITORIA ===
const auditUsers = ['ana.silva@pagsmile.com', 'carlos.lima@pagsmile.com', 'julia.costa@pagsmile.com', 'sistema@pagsmile.com'];
const auditActions = [
  { type: 'APPROVAL', label: 'Aprovação manual', desc: 'Caso aprovado após revisão manual' },
  { type: 'REJECTION', label: 'Rejeição manual', desc: 'Caso rejeitado por inconsistências' },
  { type: 'STATUS_CHANGE', label: 'Mudança de status', desc: 'Status alterado no sistema' },
  { type: 'DOC_REQUEST', label: 'Solicitação de docs', desc: 'Documentos adicionais solicitados' },
  { type: 'HELENA_DECISION', label: 'Decisão Helena IA', desc: 'IA tomou decisão automática' },
  { type: 'POLICY_UPDATE', label: 'Atualização de política', desc: 'Regra de compliance modificada' },
  { type: 'OVERRIDE', label: 'Override manual', desc: 'Decisão da IA sobrescrita' },
];

export const mockAuditLogs = Array.from({ length: 50 }, (_, i) => {
  const action = auditActions[i % auditActions.length];
  return {
    id: `audit_${i + 1}`,
    actionType: action.type,
    actionLabel: action.label,
    actionDescription: action.desc,
    entityType: 'OnboardingCase',
    entityId: `CASE-${String(2026000 + (i % 28)).padStart(7, '0')}`,
    actor: action.type === 'HELENA_DECISION' ? 'sistema@pagsmile.com' : auditUsers[i % auditUsers.length],
    timestamp: hoursAgo(i * 1.7),
    ipAddress: action.type === 'HELENA_DECISION' ? null : `192.168.1.${100 + (i % 50)}`,
    details: {
      previousStatus: ['Pendente', 'Em Análise', 'Manual'][i % 3],
      newStatus: ['Aprovado', 'Recusado', 'Manual', 'Docs Solicitados'][i % 4],
    },
  };
});

// === HELENA TRAINING ===
export const mockHelenaMetrics = {
  modelVersion: 'sentinel_v4.2',
  lastTrainingDate: daysAgo(7),
  totalDecisions: 12453,
  accuracy: 94.7,
  precision: 96.2,
  recall: 92.8,
  f1Score: 94.5,
  agreementRate: 91.3, // % de feedback dos analistas que concordam
  avgConfidence: 87.4,
  avgProcessingTimeMs: 2840,
  trainingExamples: 8941,
  pendingFeedback: 142,
};

export const mockHelenaFeedbackLog = Array.from({ length: 20 }, (_, i) => ({
  id: `fb_${i + 1}`,
  case_id: `CASE-${String(2026000 + i).padStart(7, '0')}`,
  helenaDecision: ['APPROVED', 'REJECTED', 'MANUAL_REVIEW'][i % 3],
  analystDecision: i % 4 === 0 ? 'OVERRIDDEN' : 'AGREED',
  feedbackType: i % 3 === 0 ? 'positive' : i % 3 === 1 ? 'negative' : 'neutral',
  comment: i % 3 === 0
    ? 'IA capturou corretamente o red flag PEP'
    : i % 3 === 1
    ? 'Falso positivo - empresa legítima reprovada por endereço'
    : 'Decisão correta mas com baixa confiança',
  analyst: auditUsers[i % 3],
  timestamp: hoursAgo(i * 5),
}));

export const mockHelenaTrainingHistory = Array.from({ length: 8 }, (_, i) => ({
  version: `sentinel_v4.${8 - i}`,
  date: daysAgo(i * 7 + 3),
  examplesAdded: 200 + Math.floor(Math.random() * 800),
  accuracyDelta: (Math.random() * 4 - 1).toFixed(1),
  notes: [
    'Refinamento em detecção de PEP',
    'Melhor calibração para SaaS',
    'Correção de viés em endereços compartilhados',
    'Novos exemplos de fraude documental',
    'Ajuste threshold marketplace',
    'Treinamento com casos LITE',
    'Re-balanceamento de scores',
    'Versão inicial v4',
  ][i],
}));