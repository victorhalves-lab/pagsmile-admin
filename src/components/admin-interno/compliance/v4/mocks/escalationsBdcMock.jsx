// Mock — Escalation Reviews + BDC Retry Queue + Revalidation Schedule

const day = 24 * 3600 * 1000;
const isoOffset = (n) => new Date(Date.now() - n * day).toISOString();

export const mockEscalations = [
  {
    id: 'esc_001',
    escalation_id: 'ESC-2026-001',
    onboarding_case_id: 'CASE-2026-001234',
    case_merchant: 'TechMart Marketplace',
    escalation_reason: 'false_positive_caf',
    escalated_by: 'maria.silva@pagsmile.com',
    escalated_at: isoOffset(0.3),
    severity: 'high',
    original_decision: 'auto_reject',
    questioned_aspect: 'CAF retornou liveness fail mas o vídeo está claramente ok',
    review_status: 'pending',
  },
  {
    id: 'esc_002',
    escalation_id: 'ESC-2026-002',
    onboarding_case_id: 'CASE-2026-001100',
    case_merchant: 'Empresa Marketplace XYZ',
    escalation_reason: 'fraud_suspected',
    escalated_by: 'pedro.santos@pagsmile.com',
    escalated_at: isoOffset(1),
    severity: 'critical',
    original_decision: 'manual_approve',
    questioned_aspect: 'Padrão suspeito de transações detectado pós-aprovação',
    review_status: 'in_review',
    reviewer: 'gerente.compliance@pagsmile.com',
  },
  {
    id: 'esc_003',
    escalation_id: 'ESC-2026-003',
    onboarding_case_id: 'CASE-2026-001500',
    case_merchant: 'CloudTech Brasil',
    escalation_reason: 'no_technical_reason',
    escalated_by: 'ana.lima@pagsmile.com',
    escalated_at: isoOffset(2),
    severity: 'medium',
    original_decision: 'auto_reject',
    questioned_aspect: 'Recusa por score 79 sem motivo claro',
    review_status: 'overturned',
    reviewer: 'gerente.compliance@pagsmile.com',
    review_completed_at: isoOffset(0.5),
    outcome_action: 'reverse_decision',
  },
  {
    id: 'esc_004',
    escalation_id: 'ESC-2026-004',
    onboarding_case_id: 'CASE-2026-001600',
    case_merchant: 'DigitalPay Subseller',
    escalation_reason: 'ai_confidence_low',
    escalated_by: 'maria.silva@pagsmile.com',
    escalated_at: isoOffset(0.8),
    severity: 'low',
    original_decision: 'manual_review',
    questioned_aspect: 'Helena com confiança 65% — analista quer segunda opinião',
    review_status: 'confirmed_correct',
    reviewer: 'sr.compliance@pagsmile.com',
    review_completed_at: isoOffset(0.3),
    outcome_action: 'no_action',
  },
];

export const mockBdcRetries = [
  { id: 'r_001', retry_id: 'RTR-001', dataset_name: 'CompanyBasicData', document_query: '12.345.678/0001-90', attempt_number: 2, max_attempts: 5, status: 'retrying', error_code: 'TIMEOUT', error_message: 'Request timeout (30s)', http_status: 504, last_attempt_at: isoOffset(0.05), next_retry_at: isoOffset(-0.02), blocks_pipeline: true, onboarding_case_id: 'CASE-2026-002100' },
  { id: 'r_002', retry_id: 'RTR-002', dataset_name: 'OFACSanctions', document_query: 'José Silva 123.456.789-01', attempt_number: 3, max_attempts: 5, status: 'pending', error_code: 'RATE_LIMIT', error_message: 'BDC rate limit exceeded', http_status: 429, last_attempt_at: isoOffset(0.1), next_retry_at: isoOffset(-0.05), blocks_pipeline: true, onboarding_case_id: 'CASE-2026-002101' },
  { id: 'r_003', retry_id: 'RTR-003', dataset_name: 'PEPDataset', document_query: '987.654.321-09', attempt_number: 5, max_attempts: 5, status: 'permanent_failure', error_code: 'NOT_FOUND', error_message: 'Dataset returned 404 after 5 attempts', http_status: 404, last_attempt_at: isoOffset(0.2), blocks_pipeline: false, onboarding_case_id: 'CASE-2026-002102' },
  { id: 'r_004', retry_id: 'RTR-004', dataset_name: 'CompanyFinancials', document_query: '34.567.890/0001-12', attempt_number: 1, max_attempts: 5, status: 'success', last_attempt_at: isoOffset(0.3), response_time_ms: 1840, blocks_pipeline: false, onboarding_case_id: 'CASE-2026-002103' },
  { id: 'r_005', retry_id: 'RTR-005', dataset_name: 'AddressValidation', document_query: 'Av. Paulista 1000, SP', attempt_number: 4, max_attempts: 5, status: 'manual_required', error_code: 'INVALID_RESPONSE', error_message: 'Resposta com formato inesperado', last_attempt_at: isoOffset(0.5), blocks_pipeline: true, onboarding_case_id: 'CASE-2026-002104' },
];

export const mockRevalidations = [
  { id: 'rev_001', schedule_id: 'REV-001', onboarding_case_id: 'CASE-2025-000142', subaccount_id: 'sub_lojaexpress', merchant_name: 'LojaExpress', revalidation_type: 'periodic', frequency: 'annual', last_revalidation_at: '2025-05-10', next_revalidation_at: '2026-05-10', last_score: 78, status: 'due_soon', priority: 'medium', auto_revalidate: true },
  { id: 'rev_002', schedule_id: 'REV-002', merchant_name: 'TechMart Marketplace', revalidation_type: 'triggered', frequency: 'custom', next_revalidation_at: '2026-05-15', last_score: 85, score_delta: -7, status: 'scheduled', priority: 'high', trigger_reason: 'Mudança societária detectada via BDC', auto_revalidate: false, assigned_analyst: 'maria.silva@pagsmile.com' },
  { id: 'rev_003', schedule_id: 'REV-003', merchant_name: 'PixGateway Solutions', revalidation_type: 'regulatory', frequency: 'semiannual', next_revalidation_at: '2026-05-08', last_score: 90, status: 'overdue', priority: 'critical', regulatory_basis: 'Resolução BACEN 4.658', auto_revalidate: false },
  { id: 'rev_004', schedule_id: 'REV-004', merchant_name: 'CloudTech Brasil', revalidation_type: 'periodic', frequency: 'annual', next_revalidation_at: '2026-08-20', last_score: 82, status: 'scheduled', priority: 'low', auto_revalidate: true },
  { id: 'rev_005', schedule_id: 'REV-005', merchant_name: 'EletroBrasil (Subseller)', revalidation_type: 'triggered', frequency: 'custom', next_revalidation_at: '2026-05-12', last_score: 71, score_delta: -12, status: 'in_progress', priority: 'high', trigger_reason: 'Volume transacional 4x acima do declarado', alerts_count: 3 },
  { id: 'rev_006', schedule_id: 'REV-006', merchant_name: 'PaymentSub Ltda', revalidation_type: 'post_incident', next_revalidation_at: '2026-05-09', last_score: 65, status: 'overdue', priority: 'critical', trigger_reason: 'Reclame Aqui — 47 reclamações em 30 dias' },
];