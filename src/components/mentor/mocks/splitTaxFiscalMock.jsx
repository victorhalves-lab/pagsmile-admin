/**
 * Mock Mentor — Wave H.11 · Tax & Fiscal Hub
 * Gestão automática de obrigações fiscais sobre splits: IR retido, NF, DIRF, informes
 */

export const mockTaxKPIs = {
  total_ir_retained_ytd: 184_320,        // total IR retido no ano corrente
  total_iss_calculated_ytd: 92_140,      // total ISS calculado
  total_pcc_retained_ytd: 38_840,        // PIS/COFINS/CSLL
  pending_dirf: 1,                       // declarações DIRF pendentes
  pending_informes: 412,                 // informes de rendimentos pendentes
  beneficiaries_with_tax: 3_840,         // beneficiários sujeitos a tributação
  taxable_volume_30d: 18_400_000,        // volume tributável 30d
  compliance_score: 96,                  // score fiscal
};

export const mockTaxRules = [
  {
    rule_id: 'TAX-IR-PF',
    name: 'IRRF · Pessoa Física',
    description: 'Retenção na fonte para beneficiários pessoa física conforme tabela progressiva',
    applies_to: 'individual',
    rate_type: 'progressive',
    bracket: 'IN RFB 1.500/2014 + atualizações 2026',
    active: true,
    auto_calculate: true,
    auto_retain: true,
  },
  {
    rule_id: 'TAX-IR-PJ',
    name: 'IRRF · Pessoa Jurídica (serviços)',
    description: 'Retenção 1,5% para PJ prestadora de serviços profissionais (Lei 9.430/96 Art. 647)',
    applies_to: 'company',
    rate_type: 'fixed',
    rate: 1.5,
    bracket: 'Lei 9.430/96 Art. 647',
    active: true,
    auto_calculate: true,
    auto_retain: true,
  },
  {
    rule_id: 'TAX-PCC',
    name: 'PIS/COFINS/CSLL · PJ',
    description: 'Retenção total 4,65% (PIS 0,65% + COFINS 3% + CSLL 1%) para PJ acima de R$ 215,05/mês',
    applies_to: 'company',
    rate_type: 'fixed',
    rate: 4.65,
    bracket: 'Lei 10.833/03 Art. 30',
    active: true,
    auto_calculate: true,
    auto_retain: true,
    threshold: 215.05,
  },
  {
    rule_id: 'TAX-ISS',
    name: 'ISS · Município',
    description: 'Variação por município conforme cadastro do prestador',
    applies_to: 'both',
    rate_type: 'variable_by_city',
    bracket: 'LC 116/2003 + códigos municipais',
    active: true,
    auto_calculate: true,
    auto_retain: false,
    note: 'Apenas calcula · retenção depende de configuração municipal',
  },
];

export const mockTaxLedger = [
  {
    entry_id: 'TAX-2026-05-08-0142',
    beneficiary: 'Bruno Magalhães',
    document: '042.***.***-91',
    type: 'individual',
    transaction_id: 'TXN-89012451',
    gross_amount: 1240.00,
    ir_retained: 18.60,        // 1,5% no caso PF acima de threshold
    iss_calculated: 62.00,     // 5%
    pcc_retained: 0,
    net_to_beneficiary: 1159.40,
    period: '2026-05-08',
    status: 'collected',
  },
  {
    entry_id: 'TAX-2026-05-08-0143',
    beneficiary: 'TechStore LTDA',
    document: '14.123.456/0001-78',
    type: 'company',
    transaction_id: 'TXN-89012891',
    gross_amount: 6311.32,
    ir_retained: 94.67,        // 1,5%
    iss_calculated: 315.57,    // 5%
    pcc_retained: 293.48,      // 4,65%
    net_to_beneficiary: 5607.60,
    period: '2026-05-08',
    status: 'collected',
  },
  {
    entry_id: 'TAX-2026-05-08-0144',
    beneficiary: 'Pereira & Cia',
    document: '12.910.382/0001-15',
    type: 'company',
    transaction_id: 'TXN-89015321',
    gross_amount: 580.00,
    ir_retained: 8.70,
    iss_calculated: 29.00,
    pcc_retained: 0,           // abaixo do threshold mensal
    net_to_beneficiary: 542.30,
    period: '2026-05-08',
    status: 'collected',
  },
];

export const mockFiscalDocuments = [
  {
    doc_id: 'DIRF-2025',
    type: 'DIRF Anual',
    period: '2025',
    beneficiaries_count: 3_640,
    total_retained: 1_842_300,
    deadline: '2026-02-28',
    status: 'submitted',
    submitted_at: '2026-02-25T18:00:00Z',
    receipt_id: 'RFB-DIRF-2025-92841',
  },
  {
    doc_id: 'INFORMES-2025',
    type: 'Informes de Rendimentos · 2025',
    period: '2025',
    beneficiaries_count: 3_640,
    total_retained: 1_842_300,
    deadline: '2026-02-28',
    status: 'all_sent',
    submitted_at: '2026-02-26T09:00:00Z',
  },
  {
    doc_id: 'DCTF-2026-04',
    type: 'DCTFWeb · abril/2026',
    period: '2026-04',
    beneficiaries_count: 3_840,
    total_retained: 184_320,
    deadline: '2026-05-15',
    status: 'pending_review',
  },
  {
    doc_id: 'DARF-IR-2026-05',
    type: 'DARF · IRRF maio/2026',
    period: '2026-05-pre',
    beneficiaries_count: 1_240,
    total_retained: 24_840,
    deadline: '2026-06-20',
    status: 'in_progress',
  },
];