// Mock data for Mentor Transactions module (F2638-F2787)

export const ACQUIRERS = [
  { id: 'cielo', name: 'Cielo', logo: '🟦', api_status: 'healthy', last_sync: '2026-05-09T08:30:00' },
  { id: 'stone', name: 'Stone', logo: '🟢', api_status: 'healthy', last_sync: '2026-05-09T08:25:00' },
  { id: 'rede', name: 'Rede', logo: '🟥', api_status: 'degraded', last_sync: '2026-05-09T07:15:00' },
  { id: 'adyen', name: 'Adyen', logo: '🟩', api_status: 'healthy', last_sync: '2026-05-09T08:32:00' },
  { id: 'getnet', name: 'GetNet', logo: '🟦', api_status: 'healthy', last_sync: '2026-05-09T08:00:00' },
];

export const RECONCILIATION_FILES = [
  {
    id: 'rcf_001', acquirer_id: 'cielo', acquirer_name: 'Cielo', file_name: 'CIELO_MOV_20260508.cnab',
    file_type: 'movimentacao_diaria', period: '2026-05-08', uploaded_at: '2026-05-09T05:30:00', uploaded_by: 'sistema_auto',
    status: 'processed', total_records: 487_234, processed_ok: 486_892, divergences: 342,
    tpv_acquirer: 145_678_900, tpv_pagsmile: 145_651_200, delta_brl: 27_700,
    processing_time_min: 18,
  },
  {
    id: 'rcf_002', acquirer_id: 'stone', acquirer_name: 'Stone', file_name: 'STONE_DAILY_20260508.txt',
    file_type: 'movimentacao_diaria', period: '2026-05-08', uploaded_at: '2026-05-09T06:00:00', uploaded_by: 'sistema_auto',
    status: 'processed', total_records: 234_891, processed_ok: 234_787, divergences: 104,
    tpv_acquirer: 89_456_300, tpv_pagsmile: 89_432_100, delta_brl: 24_200,
    processing_time_min: 9,
  },
  {
    id: 'rcf_003', acquirer_id: 'rede', acquirer_name: 'Rede', file_name: 'REDE_MOV_20260508.cnab',
    file_type: 'movimentacao_diaria', period: '2026-05-08', uploaded_at: '2026-05-09T08:45:00', uploaded_by: 'opstech@pagsmile.com',
    status: 'processing', total_records: 178_345, processed_ok: 89_120, divergences: 47,
    tpv_acquirer: 0, tpv_pagsmile: 0, delta_brl: 0, processing_time_min: 0,
  },
  {
    id: 'rcf_004', acquirer_id: 'adyen', acquirer_name: 'Adyen', file_name: 'ADYEN_CHARGEBACKS_W19.csv',
    file_type: 'chargebacks', period: '2026-05-04 a 2026-05-08', uploaded_at: '2026-05-09T07:00:00', uploaded_by: 'sistema_auto',
    status: 'processed', total_records: 287, processed_ok: 287, divergences: 0,
    tpv_acquirer: 1_245_600, tpv_pagsmile: 1_245_600, delta_brl: 0, processing_time_min: 1,
  },
  {
    id: 'rcf_005', acquirer_id: 'cielo', acquirer_name: 'Cielo', file_name: 'CIELO_AJUSTES_M04.cnab',
    file_type: 'ajustes', period: '2026-04', uploaded_at: '2026-05-05T10:00:00', uploaded_by: 'financeiro@pagsmile.com',
    status: 'processed_with_errors', total_records: 156, processed_ok: 142, divergences: 14,
    tpv_acquirer: 234_500, tpv_pagsmile: 218_300, delta_brl: 16_200, processing_time_min: 2,
  },
];

export const DIVERGENCES = [
  { id: 'div_001', file_id: 'rcf_001', type: 'value_mismatch', severity: 'high', tx_id: 'tx_a8f3d2', nsu: '00128734', acquirer: 'cielo', merchant_name: 'TechStore BR', value_pagsmile: 1_259.90, value_acquirer: 1_257.40, delta_brl: -2.50, status: 'pending', detected_at: '2026-05-09T05:40:00' },
  { id: 'div_002', file_id: 'rcf_001', type: 'status_mismatch', severity: 'high', tx_id: 'tx_b9e4c1', nsu: '00128812', acquirer: 'cielo', merchant_name: 'EduMax Cursos', value_pagsmile: 489.00, value_acquirer: 489.00, status_pagsmile: 'authorized', status_acquirer: 'reversed', status: 'pending', detected_at: '2026-05-09T05:42:00' },
  { id: 'div_003', file_id: 'rcf_001', type: 'phantom_pagsmile', severity: 'medium', tx_id: 'tx_c1d2e3', nsu: '00128901', acquirer: 'cielo', merchant_name: 'FitLife', value_pagsmile: 99.90, value_acquirer: null, status: 'investigating', detected_at: '2026-05-09T05:45:00' },
  { id: 'div_004', file_id: 'rcf_002', type: 'phantom_acquirer', severity: 'critical', tx_id: null, nsu: '99887766', acquirer: 'stone', merchant_name: '?', value_pagsmile: null, value_acquirer: 8_450.00, status: 'pending', detected_at: '2026-05-09T06:10:00' },
  { id: 'div_005', file_id: 'rcf_002', type: 'settlement_date', severity: 'low', tx_id: 'tx_d4e5f6', nsu: '00067543', acquirer: 'stone', merchant_name: 'TechStore BR', expected_date: '2026-05-10', actual_date: '2026-05-12', status: 'resolved', detected_at: '2026-05-09T06:15:00' },
];

export const SYNC_JOBS = [
  { id: 'sj_001', scope: 'period', acquirer: 'cielo', period_from: '2026-05-09T00:00', period_to: '2026-05-09T08:00', status: 'completed', total: 12_456, synced: 12_440, divergences: 16, started_at: '2026-05-09T08:15:00', completed_at: '2026-05-09T08:32:00', triggered_by: 'opstech@pagsmile.com', reason: 'Validação após incidente de timeout reportado pelo Cielo às 06h' },
  { id: 'sj_002', scope: 'transaction', acquirer: 'stone', target: 'tx_b9e4c1', status: 'completed', total: 1, synced: 1, divergences: 0, started_at: '2026-05-09T08:40:00', completed_at: '2026-05-09T08:40:02', triggered_by: 'suporte@pagsmile.com', reason: 'Lojista contestou status · validar fonte da verdade' },
  { id: 'sj_003', scope: 'filtered_set', acquirer: 'rede', filters: { merchant: 'mkt_001', period: 'last_24h' }, status: 'running', total: 3_456, synced: 1_240, divergences: 4, started_at: '2026-05-09T08:50:00', completed_at: null, triggered_by: 'risco@pagsmile.com', reason: 'Pico anormal de chargebacks · validar autorizações e status' },
  { id: 'sj_004', scope: 'transaction', acquirer: 'adyen', target: 'tx_xx9988', status: 'failed', total: 1, synced: 0, divergences: 0, started_at: '2026-05-09T07:30:00', completed_at: '2026-05-09T07:30:08', triggered_by: 'opstech@pagsmile.com', reason: 'Investigação · transação fantasma reportada', error: 'Adyen API: transaction not found in their records' },
];

export const EXPORT_JOBS = [
  { id: 'ej_001', requested_at: '2026-05-09T08:00:00', requested_by: 'financeiro@pagsmile.com', format: 'XLSX', total_rows: 1_234_567, status: 'ready', file_size_mb: 234, expires_at: '2026-05-16T08:00:00', destination: 'download', filters_summary: 'Período: 2026-04 · Todos lojistas · Status: liquidada', justification: 'Conciliação financeira mensal · fechamento contábil abril', masking_level: 'standard' },
  { id: 'ej_002', requested_at: '2026-05-09T07:30:00', requested_by: 'compliance@pagsmile.com', format: 'CSV', total_rows: 8_945_120, status: 'processing', progress_pct: 67, eta_min: 12, destination: 's3', filters_summary: 'Período: 2026-Q1 · MCCs: 7995, 5993, 5816 · Mascarado para auditoria', justification: 'Auditoria regulatória BCB · solicitação OF-2026-0234', masking_level: 'high' },
  { id: 'ej_003', requested_at: '2026-05-09T06:15:00', requested_by: 'comercial@pagsmile.com', format: 'PDF', total_rows: 12_456, status: 'ready', file_size_mb: 18, expires_at: '2026-05-16T06:15:00', destination: 'email', filters_summary: 'Lojista: TechStore BR · período: 2026-04', justification: 'Apresentação para revisão trimestral com cliente top', masking_level: 'standard' },
  { id: 'ej_004', requested_at: '2026-05-09T05:45:00', requested_by: 'risco@pagsmile.com', format: 'JSON', total_rows: 2_345, status: 'queued', destination: 'sftp', filters_summary: 'Transações suspeitas pendentes de revisão · score >850', justification: 'Integração com sistema antifraude externo Sift', masking_level: 'minimal' },
  { id: 'ej_005', requested_at: '2026-05-08T18:00:00', requested_by: 'opstech@pagsmile.com', format: 'XLSX', total_rows: 234, status: 'failed', destination: 'download', filters_summary: 'Transações em chargeback · prazo defesa próximo', justification: 'Análise técnica de evidências', masking_level: 'standard', error: 'Timeout na geração após 30min · refinar filtros' },
];