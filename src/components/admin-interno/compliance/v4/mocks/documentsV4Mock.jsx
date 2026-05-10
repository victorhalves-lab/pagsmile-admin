// Mock — Document Uploads V4

const day = 24 * 3600 * 1000;
const isoOffset = (n) => new Date(Date.now() - n * day).toISOString();

export const mockDocuments = [
  // TechMart — caso oc_m_001
  { id: 'doc_001', document_id: 'DOC-001', onboarding_case_id: 'oc_m_001', subaccount_id: 'sub_techmart', document_type: 'cnpj_card', document_name: 'Cartão CNPJ — TechMart', file_url: '/files/cnpj_techmart.pdf', file_size_bytes: 245000, mime_type: 'application/pdf', status: 'valid', validation_provider: 'caf', validation_score: 95, uploaded_by: 'compliance@techmart.com.br', uploaded_at: isoOffset(2), validated_at: isoOffset(2), is_required: true, version: 1, merchantName: 'TechMart Marketplace', tipo: 'merchant' },
  { id: 'doc_002', document_id: 'DOC-002', onboarding_case_id: 'oc_m_001', document_type: 'social_contract', document_name: 'Contrato Social', file_url: '/files/cs_techmart.pdf', file_size_bytes: 1240000, mime_type: 'application/pdf', status: 'valid', validation_provider: 'caf', validation_score: 92, uploaded_at: isoOffset(2), is_required: true, version: 2, merchantName: 'TechMart Marketplace', tipo: 'merchant' },
  { id: 'doc_003', document_id: 'DOC-003', onboarding_case_id: 'oc_m_001', document_type: 'balance_sheet', document_name: 'Balanço Patrimonial 2025', file_url: '/files/balance_2025.pdf', status: 'pending', uploaded_at: isoOffset(0.3), is_required: true, merchantName: 'TechMart Marketplace', tipo: 'merchant' },
  { id: 'doc_004', document_id: 'DOC-004', onboarding_case_id: 'oc_m_001', document_type: 'rg', document_name: 'RG — Pedro Almeida (UBO 51%)', status: 'valid', validation_score: 98, validation_provider: 'caf', uploaded_at: isoOffset(2), is_required: true, merchantName: 'TechMart Marketplace', tipo: 'merchant' },
  { id: 'doc_005', document_id: 'DOC-005', onboarding_case_id: 'oc_m_001', document_type: 'selfie_with_doc', document_name: 'Selfie + RG — Pedro Almeida', status: 'valid', validation_score: 89, validation_provider: 'caf', uploaded_at: isoOffset(2), is_required: true, merchantName: 'TechMart Marketplace', tipo: 'merchant' },
  { id: 'doc_006', document_id: 'DOC-006', onboarding_case_id: 'oc_m_001', document_type: 'address_proof', document_name: 'Comprovante de Endereço Sede', status: 'valid', validation_score: 88, uploaded_at: isoOffset(2), is_required: true, merchantName: 'TechMart Marketplace', tipo: 'merchant' },

  // LojaExpress — oc_m_002
  { id: 'doc_007', document_id: 'DOC-007', onboarding_case_id: 'oc_m_002', subaccount_id: 'sub_lojaexpress', document_type: 'cnpj_card', document_name: 'Cartão CNPJ — LojaExpress', status: 'valid', validation_score: 97, uploaded_at: isoOffset(5), is_required: true, merchantName: 'LojaExpress', tipo: 'merchant' },
  { id: 'doc_008', document_id: 'DOC-008', onboarding_case_id: 'oc_m_002', document_type: 'social_contract', document_name: 'Contrato Social', status: 'valid', validation_score: 95, uploaded_at: isoOffset(5), is_required: true, merchantName: 'LojaExpress', tipo: 'merchant' },
  { id: 'doc_009', document_id: 'DOC-009', onboarding_case_id: 'oc_m_002', document_type: 'rg', document_name: 'RG — Sócio Único', status: 'valid', validation_score: 96, uploaded_at: isoOffset(5), is_required: true, merchantName: 'LojaExpress', tipo: 'merchant' },

  // Subseller TechMart — oc_s_001
  { id: 'doc_010', document_id: 'DOC-010', onboarding_case_id: 'oc_s_001', document_type: 'cnpj_card', document_name: 'Cartão CNPJ — EletroBrasil', status: 'valid', validation_score: 91, uploaded_at: isoOffset(3), is_required: true, merchantName: 'EletroBrasil (Subseller TechMart)', tipo: 'subseller_pj', merchant_pai_name: 'TechMart Marketplace' },
  { id: 'doc_011', document_id: 'DOC-011', onboarding_case_id: 'oc_s_001', document_type: 'social_contract', document_name: 'Contrato Social', status: 'valid', validation_score: 88, uploaded_at: isoOffset(3), is_required: true, merchantName: 'EletroBrasil', tipo: 'subseller_pj', merchant_pai_name: 'TechMart Marketplace' },

  // Subseller PF — oc_s_002 (João Silva)
  { id: 'doc_012', document_id: 'DOC-012', onboarding_case_id: 'oc_s_002', document_type: 'cnh', document_name: 'CNH — João Silva', status: 'valid', validation_score: 82, uploaded_at: isoOffset(1), is_required: true, merchantName: 'João da Silva Santos (Subseller PF)', tipo: 'subseller_pf', merchant_pai_name: 'TechMart Marketplace' },
  { id: 'doc_013', document_id: 'DOC-013', onboarding_case_id: 'oc_s_002', document_type: 'selfie_with_doc', document_name: 'Selfie + CNH', status: 'valid', validation_score: 78, uploaded_at: isoOffset(1), is_required: true, merchantName: 'João Silva', tipo: 'subseller_pf', merchant_pai_name: 'TechMart Marketplace' },
  { id: 'doc_014', document_id: 'DOC-014', onboarding_case_id: 'oc_s_002', document_type: 'address_proof', document_name: 'Comprovante de Endereço', status: 'rejected', validation_notes: 'Documento com mais de 90 dias', uploaded_at: isoOffset(1), is_required: true, merchantName: 'João Silva', tipo: 'subseller_pf', merchant_pai_name: 'TechMart Marketplace' },

  // CloudTech — docs pendentes
  { id: 'doc_015', document_id: 'DOC-015', onboarding_case_id: 'oc_m_004', document_type: 'social_contract', document_name: 'Contrato Social Atualizado', status: 'pending', uploaded_at: isoOffset(0.2), is_required: true, merchantName: 'CloudTech', tipo: 'merchant' },
  { id: 'doc_016', document_id: 'DOC-016', onboarding_case_id: 'oc_m_004', document_type: 'tax_clearance', document_name: 'Certidão Negativa Tributos', status: 'pending', uploaded_at: isoOffset(0.2), is_required: true, merchantName: 'CloudTech', tipo: 'merchant' },
];

export const DOC_TYPE_CONFIG = {
  cnpj_card: { label: 'Cartão CNPJ', icon: '🏢' },
  social_contract: { label: 'Contrato Social', icon: '📄' },
  balance_sheet: { label: 'Balanço Patrimonial', icon: '📊' },
  rg: { label: 'RG', icon: '🪪' },
  cnh: { label: 'CNH', icon: '🪪' },
  passport: { label: 'Passaporte', icon: '🪪' },
  address_proof: { label: 'Comp. Endereço', icon: '📮' },
  selfie: { label: 'Selfie', icon: '🤳' },
  selfie_with_doc: { label: 'Selfie + Doc', icon: '🤳' },
  bank_statement: { label: 'Extrato Bancário', icon: '🏦' },
  tax_clearance: { label: 'Cert. Tributos', icon: '🧾' },
  operating_license: { label: 'Alvará', icon: '📜' },
  anvisa_license: { label: 'Anvisa', icon: '⚕️' },
  bacen_license: { label: 'BACEN', icon: '🏛️' },
  pld_policy: { label: 'Política PLD', icon: '🛡️' },
  ubo_declaration: { label: 'Declaração UBO', icon: '👤' },
  pep_declaration: { label: 'Declaração PEP', icon: '⚠️' },
  other: { label: 'Outros', icon: '📎' },
};

export const DOC_STATUS_CONFIG = {
  pending: { label: 'Pendente', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  uploaded: { label: 'Enviado', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  validating: { label: 'Validando', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' },
  valid: { label: 'Válido', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  invalid: { label: 'Inválido', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  expired: { label: 'Expirado', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
};