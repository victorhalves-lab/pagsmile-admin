// Mock data for Admin Sub (Merchant) compliance/audit/blockage/MED features
// Entrega 8 - Compliance Crítico

export const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(v || 0);

// ============== MY AUDIT TRAIL ==============
export const myAuditKpis = {
  total_events_30d: 1247,
  critical_events: 8,
  unique_users: 12,
  failed_logins_24h: 3,
  config_changes_30d: 47,
  api_calls_30d: 89432
};

export const myAuditEvents = [
  { id: 'evt_001', timestamp: '2026-05-10T09:42:13', user: 'joao@techshop.com.br', user_role: 'admin', category: 'auth', action: 'login_success', ip: '189.45.123.10', location: 'São Paulo, BR', device: 'Chrome 124 / macOS', resource: '-', severity: 'info', details: { mfa: true, session_id: 'sess_abc123' } },
  { id: 'evt_002', timestamp: '2026-05-10T09:15:22', user: 'maria@techshop.com.br', user_role: 'finance', category: 'financial', action: 'withdrawal_requested', ip: '189.45.123.11', location: 'São Paulo, BR', device: 'Chrome 124 / Win', resource: 'withdrawal/W-2026-04421', severity: 'high', details: { amount: 125000, account: '****4421' } },
  { id: 'evt_003', timestamp: '2026-05-10T08:55:41', user: 'admin@techshop.com.br', user_role: 'admin', category: 'config', action: 'webhook_updated', ip: '189.45.123.10', location: 'São Paulo, BR', device: 'Chrome 124 / macOS', resource: 'webhook/wh_pix_main', severity: 'medium', details: { field: 'url', old: 'https://old.api/wh', new: 'https://new.api/wh' } },
  { id: 'evt_004', timestamp: '2026-05-10T07:33:18', user: 'system', user_role: 'system', category: 'security', action: 'mfa_enforced', ip: '-', location: '-', device: '-', resource: 'user/3 users', severity: 'medium', details: { policy: 'mandatory_mfa_admins' } },
  { id: 'evt_005', timestamp: '2026-05-10T03:12:05', user: 'unknown', user_role: '-', category: 'auth', action: 'login_failed', ip: '45.123.89.221', location: 'Manaus, BR', device: 'Curl/8.0', resource: '-', severity: 'critical', details: { reason: 'invalid_password', attempts: 5, blocked: true } },
  { id: 'evt_006', timestamp: '2026-05-09T18:42:33', user: 'pedro@techshop.com.br', user_role: 'developer', category: 'api', action: 'api_key_rotated', ip: '189.45.123.99', location: 'São Paulo, BR', device: 'Chrome 124', resource: 'apikey/sk_live_***ax21', severity: 'high', details: { reason: 'scheduled_rotation' } },
  { id: 'evt_007', timestamp: '2026-05-09T16:22:11', user: 'maria@techshop.com.br', user_role: 'finance', category: 'config', action: 'pix_key_changed', ip: '189.45.123.11', location: 'São Paulo, BR', device: 'Chrome 124', resource: 'subaccount', severity: 'critical', details: { old_key: 'cnpj_***0001', new_key: 'cnpj_***0002', otp_validated: true } },
  { id: 'evt_008', timestamp: '2026-05-09T14:05:48', user: 'joao@techshop.com.br', user_role: 'admin', category: 'data', action: 'export_generated', ip: '189.45.123.10', location: 'São Paulo, BR', device: 'Chrome 124', resource: 'export/exp_2026_04', severity: 'medium', details: { records: 14523, format: 'xlsx' } }
];

export const auditCategories = [
  { value: 'all', label: 'Todas categorias' },
  { value: 'auth', label: 'Autenticação' },
  { value: 'financial', label: 'Financeiro' },
  { value: 'config', label: 'Configurações' },
  { value: 'security', label: 'Segurança' },
  { value: 'api', label: 'API/Integrações' },
  { value: 'data', label: 'Dados/LGPD' }
];

// ============== MY MED QUEUE ==============
export const myMedKpis = {
  active_meds: 7,
  pending_response: 3,
  in_contestation: 2,
  resolved_30d: 14,
  total_amount_active: 47820.50,
  avg_response_time_h: 18.4,
  acceptance_rate: 21.4,
  approaching_deadline: 2
};

export const myMeds = [
  { id: 'med_001', med_id: 'MED-2026-04421', transaction_id: 'tx_pix_8821', amount: 12500.00, requested_amount: 12500.00, reason: 'fraud', reason_description: 'Transação não reconhecida — possível fraude no cartão do pagador', status: 'pending', received_at: '2026-05-09T14:22:18', deadline_at: '2026-05-12T14:22:18', hours_remaining: 52, payer_name: 'João Silva', payer_document: '***.456.789-**', payer_bank: 'Itaú Unibanco', requester_ispb: '00000000', pix_end_to_end_id: 'E20186101202604221234567890', urgency: 'high', has_evidence: false },
  { id: 'med_002', med_id: 'MED-2026-04420', transaction_id: 'tx_pix_8820', amount: 5840.00, requested_amount: 5840.00, reason: 'operational_failure', reason_description: 'Falha operacional reportada pelo PSP pagador', status: 'pending', received_at: '2026-05-09T18:12:05', deadline_at: '2026-05-12T18:12:05', hours_remaining: 56, payer_name: 'Maria Costa', payer_document: '***.789.123-**', payer_bank: 'Bradesco', requester_ispb: '60746948', pix_end_to_end_id: 'E20186101202604220987654321', urgency: 'medium', has_evidence: true },
  { id: 'med_003', med_id: 'MED-2026-04418', transaction_id: 'tx_pix_8801', amount: 28430.50, requested_amount: 28430.50, reason: 'fraud', reason_description: 'Engenharia social comprovada — vítima foi induzida ao erro', status: 'pending', received_at: '2026-05-08T10:33:42', deadline_at: '2026-05-11T10:33:42', hours_remaining: 25, payer_name: 'Carlos Mendes', payer_document: '***.234.567-**', payer_bank: 'Nubank', requester_ispb: '18236120', pix_end_to_end_id: 'E20186101202604180123456789', urgency: 'critical', has_evidence: false },
  { id: 'med_004', med_id: 'MED-2026-04415', transaction_id: 'tx_pix_8775', amount: 1050.00, requested_amount: 1050.00, reason: 'user_request', reason_description: 'Solicitação do próprio usuário pagador', status: 'in_contestation', received_at: '2026-05-07T09:15:00', deadline_at: '2026-05-10T09:15:00', hours_remaining: 0, response_date: '2026-05-08T16:42:11', payer_name: 'Ana Souza', payer_document: '***.111.222-**', payer_bank: 'Santander', urgency: 'low', has_evidence: true },
  { id: 'med_005', med_id: 'MED-2026-04401', transaction_id: 'tx_pix_8654', amount: 8730.00, requested_amount: 8730.00, accepted_amount: 0, reason: 'fraud', status: 'rejected', received_at: '2026-05-04T11:22:00', deadline_at: '2026-05-07T11:22:00', response_date: '2026-05-06T10:18:33', response_reason: 'Comprovação documental de prestação de serviço — NF e contrato anexos', payer_name: 'Roberto Lima', payer_document: '***.987.654-**', payer_bank: 'Itaú Unibanco', urgency: 'low', has_evidence: true }
];

export const medReasonLabels = {
  fraud: { label: 'Fraude', color: 'bg-red-100 text-red-700' },
  operational_failure: { label: 'Falha operacional', color: 'bg-orange-100 text-orange-700' },
  user_request: { label: 'Solicitação do usuário', color: 'bg-blue-100 text-blue-700' },
  other: { label: 'Outros', color: 'bg-slate-100 text-slate-700' }
};

export const medStatusLabels = {
  pending: { label: 'Aguardando resposta', color: 'bg-amber-100 text-amber-700', icon: 'Clock' },
  in_contestation: { label: 'Em contestação', color: 'bg-blue-100 text-blue-700', icon: 'Shield' },
  accepted: { label: 'Aceita (devolução feita)', color: 'bg-green-100 text-green-700', icon: 'CheckCircle' },
  partially_accepted: { label: 'Parcialmente aceita', color: 'bg-emerald-100 text-emerald-700', icon: 'CheckCircle2' },
  rejected: { label: 'Contestada com sucesso', color: 'bg-slate-100 text-slate-700', icon: 'XCircle' },
  expired: { label: 'Prazo expirado', color: 'bg-red-100 text-red-700', icon: 'AlertTriangle' }
};

// ============== MY COMPLIANCE CENTER ==============
export const myComplianceStatus = {
  overall_status: 'compliant',
  overall_score: 87,
  next_revalidation: '2026-08-15',
  documents_total: 24,
  documents_valid: 22,
  documents_expiring_30d: 1,
  documents_expired: 1,
  pending_actions: 2,
  last_review: '2026-02-15',
  kyc_status: 'approved',
  pld_risk_classification: 'low'
};

export const myComplianceDocs = [
  { id: 'doc_001', name: 'Contrato Social', category: 'societal', uploaded_at: '2025-08-15', expires_at: '2027-08-15', status: 'valid', size_kb: 1240, version: 3 },
  { id: 'doc_002', name: 'Cartão CNPJ', category: 'fiscal', uploaded_at: '2026-02-15', expires_at: '2026-08-15', status: 'expiring_soon', size_kb: 180, version: 2 },
  { id: 'doc_003', name: 'Comprovante de Endereço (sede)', category: 'address', uploaded_at: '2025-11-10', expires_at: '2026-05-10', status: 'expired', size_kb: 320, version: 1 },
  { id: 'doc_004', name: 'Procuração — Diretor Financeiro', category: 'representation', uploaded_at: '2025-12-01', expires_at: '2026-12-01', status: 'valid', size_kb: 540, version: 1 },
  { id: 'doc_005', name: 'Certidão Negativa Federal', category: 'fiscal', uploaded_at: '2026-04-20', expires_at: '2026-10-20', status: 'valid', size_kb: 220, version: 4 },
  { id: 'doc_006', name: 'Certidão Negativa Trabalhista', category: 'fiscal', uploaded_at: '2026-04-20', expires_at: '2026-10-20', status: 'valid', size_kb: 195, version: 2 },
  { id: 'doc_007', name: 'IRPF do Sócio Majoritário', category: 'partners', uploaded_at: '2026-03-15', expires_at: '2027-03-15', status: 'valid', size_kb: 980, version: 1 }
];

export const myComplianceActions = [
  { id: 'act_001', priority: 'high', title: 'Comprovante de Endereço expirado', description: 'Documento expirou em 10/05/2026. Reenvie em até 7 dias para evitar bloqueio preventivo.', cta: 'Reenviar agora', deadline: '2026-05-17', regulation: 'BCB Circ. 3.978/2020' },
  { id: 'act_002', priority: 'medium', title: 'Cartão CNPJ vencendo', description: 'Documento expira em 15/08/2026 (97 dias). Recomendamos atualização preventiva.', cta: 'Agendar atualização', deadline: '2026-08-15', regulation: 'BCB Circ. 3.978/2020' }
];

// ============== MY BLOCKAGES CENTER ==============
export const myBlockagesKpis = {
  active_blockages: 1,
  resolved_30d: 0,
  pending_review: 1,
  next_review_date: '2026-05-25',
  total_amount_blocked: 8420.00
};

export const myBlockages = [
  { id: 'blk_001', blockage_id: 'BLK-2026-00128', type: 'partial', scope: 'pix_out_only', amount_blocked: 8420.00, status: 'active', reason_category: 'risk_anomaly', reason_description: 'Pico de transações PIX OUT acima do padrão histórico (300% do baseline) detectado em 02/05. Bloqueio preventivo conforme Circular BCB 3.978/2020 Art. 7º para análise de PLD/FT.', created_at: '2026-05-02T16:42:00', next_review_at: '2026-05-25T00:00:00', is_contestable: true, has_contestation: false, regulator_notice: false, restored_methods: ['pix_in', 'card', 'boleto'], blocked_methods: ['pix_out'] }
];

export const blockageReasonCategories = {
  risk_anomaly: { label: 'Anomalia de risco', color: 'bg-orange-100 text-orange-700' },
  compliance_pending: { label: 'Pendência compliance', color: 'bg-amber-100 text-amber-700' },
  pld_review: { label: 'Revisão PLD', color: 'bg-red-100 text-red-700' },
  judicial: { label: 'Ordem judicial', color: 'bg-purple-100 text-purple-700' },
  contractual: { label: 'Contratual', color: 'bg-slate-100 text-slate-700' }
};

// ============== MY DRIFT ALERTS ==============
export const myDriftKpis = {
  total_alerts_30d: 14,
  active_unresolved: 3,
  total_impact_brl: 4287.50,
  potential_recovery: 4287.50,
  contracted_mdr_avg: 2.85,
  applied_mdr_avg: 2.97,
  drift_pp: 0.12
};

export const myDriftAlerts = [
  { id: 'drift_001', detected_at: '2026-05-08T11:22:00', method: 'card_credit_2x', card_brand: 'visa', contracted_rate: 2.85, applied_rate: 3.10, drift_pp: 0.25, transactions_affected: 1247, period_start: '2026-05-01', period_end: '2026-05-08', total_volume: 1485420.00, financial_impact: 3713.55, status: 'open', cause: 'Aplicação de MDR de adquirente substituta (failover Cielo→Stone) sem ajuste de tarifário do plano 4.2-PRO.', recommendation: 'Solicitar revisão e estorno do diferencial aplicado nas 1.247 transações afetadas.' },
  { id: 'drift_002', detected_at: '2026-05-05T14:33:00', method: 'pix', card_brand: null, contracted_rate: 0.99, applied_rate: 1.10, drift_pp: 0.11, transactions_affected: 522, period_start: '2026-05-03', period_end: '2026-05-05', total_volume: 152830.00, financial_impact: 168.11, status: 'open', cause: 'MDR PIX aplicado fora do horário de operação especial (madrugada) — taxa diferenciada não atualizada.', recommendation: 'Estorno automático aprovado pela governança PagSmile.' },
  { id: 'drift_003', detected_at: '2026-05-02T09:14:00', method: 'card_credit_1x', card_brand: 'mastercard', contracted_rate: 1.99, applied_rate: 2.15, drift_pp: 0.16, transactions_affected: 187, period_start: '2026-04-28', period_end: '2026-05-02', total_volume: 253480.00, financial_impact: 405.84, status: 'open', cause: 'Promoção contratual "First 1.99%" deveria estar ativa até 30/04 mas se estendeu indevidamente.', recommendation: 'Documento contratual em revisão pelo time comercial.' },
  { id: 'drift_004', detected_at: '2026-04-28T16:42:00', method: 'card_credit_3x', card_brand: 'elo', contracted_rate: 3.45, applied_rate: 3.65, drift_pp: 0.20, transactions_affected: 89, period_start: '2026-04-20', period_end: '2026-04-28', total_volume: 187420.00, financial_impact: 374.84, status: 'resolved', resolved_at: '2026-05-02T10:15:00', resolution_amount: 374.84, cause: 'Tabela Elo desatualizada após ajuste de interchange.', recommendation: 'Estorno realizado com sucesso.' }
];

export const myDriftHistory = [
  { month: 'Dez/25', total_drift_brl: 1240, recovered: 1240 },
  { month: 'Jan/26', total_drift_brl: 2870, recovered: 2870 },
  { month: 'Fev/26', total_drift_brl: 3420, recovered: 3420 },
  { month: 'Mar/26', total_drift_brl: 5680, recovered: 5680 },
  { month: 'Abr/26', total_drift_brl: 4920, recovered: 4545 },
  { month: 'Mai/26', total_drift_brl: 4287, recovered: 0 }
];