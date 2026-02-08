
// Mock data for Admin Interno module visualization

export const mockMerchants = [
  {
    id: "sub_mock_001",
    subaccount_id: "sub_mock_001",
    business_name: "Loja Teste Online Ltda",
    legal_name: "Loja Teste Online Ltda",
    document: "12.345.678/0001-90",
    email: "contato@lojteste.com",
    status: "active",
    mcc: "5411",
    mcc_description: "Supermercados",
    category: "Varejo",
    tpv_month: 850000.00,
    total_volume: 1500000.00,
    revenue_current_month: 12500.00,
    approval_rate: 89.5,
    cb_ratio: 0.3,
    balance: 45000.00,
    plan_name: "Growth",
    commercial_agent: "João Silva",
    compliance_status: "compliant",
    kyc_score: 95,
    kyc_decision: "approved",
    risk_level: "low",
    created_at: "2025-11-15T10:00:00Z",
    dia_insight: "Crescimento de 25% no TPV, oportunidade de upgrade.",
    partners: [
        { name: 'João da Silva', cpf: '123.456.789-00', share: '60%', pep: false, sanctions: false },
        { name: 'Maria Oliveira', cpf: '987.654.321-00', share: '40%', pep: false, sanctions: false }
    ],
    documents: [
        { name: 'Contrato Social', status: 'approved', url: '#' },
        { name: 'Cartão CNPJ', status: 'approved', url: '#' },
        { name: 'RG Sócios', status: 'approved', url: '#' }
    ]
  },
  {
    id: "sub_mock_002",
    subaccount_id: "sub_mock_002",
    business_name: "Tecno Inovação SA",
    legal_name: "Tecno Inovação SA",
    document: "98.765.432/0001-10",
    email: "contato@tecno.com",
    status: "pending_compliance",
    mcc: "5734",
    mcc_description: "Software",
    category: "SaaS",
    tpv_month: 1200000.00,
    total_volume: 250000.00,
    revenue_current_month: 18000.00,
    approval_rate: 92.0,
    cb_ratio: 0.1,
    balance: 120000.00,
    plan_name: "Pro",
    commercial_agent: "Maria Santos",
    compliance_status: "under_review",
    kyc_score: 65,
    kyc_decision: "manual_review",
    ai_red_flags: ["PEP na estrutura (sócio)", "Empresa < 2 anos"],
    ai_compliance_justification: "A empresa apresenta score 65 devido à combinação de fatores de risco moderado e presença de PEP na estrutura societária.",
    risk_level: "medium",
    created_at: "2026-01-10T14:30:00Z",
    dia_insight: "Cliente ideal, alto volume recorrente.",
    partners: [
        { name: 'Carlos Tech', cpf: '111.222.333-44', share: '100%', pep: true, sanctions: false }
    ],
    documents: [
        { name: 'Contrato Social', status: 'approved', url: '#' },
        { name: 'Cartão CNPJ', status: 'approved', url: '#' },
        { name: 'Balanço Patrimonial', status: 'pending', url: '#' }
    ]
  },
  {
    id: "sub_mock_003",
    subaccount_id: "sub_mock_003",
    business_name: "Moda Express",
    legal_name: "Moda Express Comércio de Roupas EIRELI",
    document: "11.222.333/0001-50",
    email: "financeiro@modaexpress.com.br",
    status: "suspended",
    mcc: "5651",
    mcc_description: "Varejo de Roupas",
    category: "Varejo",
    tpv_month: 320000.00,
    total_volume: 320000.00,
    revenue_current_month: 4500.00,
    approval_rate: 78.5,
    cb_ratio: 0.75,
    balance: 28000.00,
    plan_name: "Starter",
    commercial_agent: "Pedro Costa",
    compliance_status: "non_compliant",
    kyc_score: 45,
    kyc_decision: "rejected",
    ai_red_flags: ["Chargeback ratio elevado", "Documentos vencidos"],
    risk_level: "high",
    created_at: "2025-12-05T09:15:00Z",
    dia_insight: "⚠️ CB alto, próximo do limite de monitoramento VDMP.",
    partners: [],
    documents: []
  },
  {
    id: "sub_mock_004",
    subaccount_id: "sub_mock_004",
    business_name: "Café Gourmet",
    legal_name: "Café e Sabor Ltda",
    document: "44.555.666/0001-22",
    email: "contato@cafegourmet.com",
    status: "active",
    mcc: "5812",
    mcc_description: "Restaurantes",
    category: "Alimentação",
    tpv_month: 150000.00,
    total_volume: 450000.00,
    revenue_current_month: 2200.00,
    approval_rate: 95.0,
    cb_ratio: 0.05,
    balance: 5000.00,
    plan_name: "Starter",
    commercial_agent: "João Silva",
    compliance_status: "compliant",
    kyc_score: 88,
    kyc_decision: "approved",
    risk_level: "low",
    created_at: "2025-10-20T11:00:00Z",
    dia_insight: "Estabilidade operacional, baixo risco.",
    partners: [
        { name: 'Ana Café', cpf: '555.666.777-88', share: '100%', pep: false, sanctions: false }
    ],
    documents: [
        { name: 'Contrato Social', status: 'approved', url: '#' },
        { name: 'Cartão CNPJ', status: 'approved', url: '#' }
    ]
  },
  {
    id: "sub_mock_005",
    subaccount_id: "sub_mock_005",
    business_name: "Eletrônicos Baratos",
    legal_name: "Eletro Imports Ltda",
    document: "77.888.999/0001-33",
    email: "vendas@eletrobaratos.com",
    status: "active",
    mcc: "5732",
    mcc_description: "Eletrônicos",
    category: "Varejo",
    tpv_month: 2100000.00,
    total_volume: 15000000.00,
    revenue_current_month: 31000.00,
    approval_rate: 82.0,
    cb_ratio: 0.45,
    balance: 350000.00,
    plan_name: "Enterprise",
    commercial_agent: "Maria Santos",
    compliance_status: "compliant",
    kyc_score: 91,
    kyc_decision: "approved",
    risk_level: "medium",
    created_at: "2025-08-15T16:45:00Z",
    dia_insight: "Volume alto, monitorar chargebacks.",
    partners: [
        { name: 'Roberto Eletro', cpf: '222.333.444-55', share: '70%', pep: false, sanctions: false },
        { name: 'Paula Tech', cpf: '333.444.555-66', share: '30%', pep: false, sanctions: false }
    ],
    documents: [
        { name: 'Contrato Social', status: 'approved', url: '#' },
        { name: 'Cartão CNPJ', status: 'approved', url: '#' },
        { name: 'Licença de Importação', status: 'approved', url: '#' }
    ]
  },
  {
      id: "sub_mock_006",
      subaccount_id: "sub_mock_006",
      business_name: "Dropshipping Master",
      legal_name: "Drop Master Negócios Digitais",
      document: "33.221.112/0001-44",
      email: "suporte@dropmaster.com",
      status: "blocked",
      mcc: "5969",
      mcc_description: "Marketing Direto",
      category: "E-commerce",
      tpv_month: 50000.00,
      total_volume: 50000.00,
      revenue_current_month: 0.00,
      approval_rate: 60.0,
      cb_ratio: 2.5,
      balance: 15000.00,
      plan_name: "Starter",
      commercial_agent: "Pedro Costa",
      compliance_status: "non_compliant",
      kyc_score: 20,
      kyc_decision: "rejected",
      ai_red_flags: ["Fraude confirmada", "CB ratio crítico", "Documentos falsos"],
      risk_level: "critical",
      created_at: "2026-01-25T08:00:00Z",
      dia_insight: "🚨 Fraude confirmada, conta bloqueada.",
      partners: [],
      documents: []
  }
];

export const mockTransactions = [
  { id: 'TXN-12345678', date: '2026-01-28T14:32:00Z', merchant: 'Loja Teste Online', merchant_id: 'sub_mock_001', amount: 1250.00, method: 'credit_card', brand: 'Visa', status: 'approved', installments: 3, client_card: '**** 4567', arn: '74012345678901234', customer: { name: 'João Cliente', document: '***789' } },
  { id: 'TXN-12345677', date: '2026-01-28T14:30:00Z', merchant: 'Tech Solutions', merchant_id: 'sub_mock_002', amount: 89.90, method: 'pix', brand: null, status: 'approved', installments: 1, client_card: null, arn: 'E12345678901234567890123456789012', customer: { name: 'Maria Cliente', document: '***456' } },
  { id: 'TXN-12345676', date: '2026-01-28T14:28:00Z', merchant: 'Moda Express', merchant_id: 'sub_mock_003', amount: 450.00, method: 'credit_card', brand: 'Mastercard', status: 'refused', installments: 1, client_card: '**** 1234', arn: '-', refusal_reason: '51 - Saldo Insuficiente', customer: { name: 'Pedro Cliente', document: '***123' } },
  { id: 'TXN-12345675', date: '2026-01-28T14:25:00Z', merchant: 'Loja Teste Online', merchant_id: 'sub_mock_001', amount: 2300.00, method: 'credit_card', brand: 'Visa', status: 'refunded', installments: 10, client_card: '**** 9876', arn: '74098765432109876', customer: { name: 'Ana Cliente', document: '***321' } },
  { id: 'TXN-12345674', date: '2026-01-28T14:20:00Z', merchant: 'Café Gourmet', merchant_id: 'sub_mock_004', amount: 45.00, method: 'pix', brand: null, status: 'approved', installments: 1, client_card: null, arn: 'E98765432109876543210987654321098', customer: { name: 'Lucas Cliente', document: '***654' } },
  { id: 'TXN-12345673', date: '2026-01-28T14:15:00Z', merchant: 'Eletrônicos Baratos', merchant_id: 'sub_mock_005', amount: 3500.00, method: 'credit_card', brand: 'Elo', status: 'approved', installments: 12, client_card: '**** 5555', arn: '74055555555555555', customer: { name: 'Fernanda Cliente', document: '***987' } },
  { id: 'TXN-12345672', date: '2026-01-28T14:10:00Z', merchant: 'Eletrônicos Baratos', merchant_id: 'sub_mock_005', amount: 890.00, method: 'debit_card', brand: 'Visa', status: 'approved', installments: 1, client_card: '**** 3333', arn: '74033333333333333', customer: { name: 'Ricardo Cliente', document: '***111' } },
  { id: 'TXN-12345671', date: '2026-01-28T14:05:00Z', merchant: 'Tech Solutions', merchant_id: 'sub_mock_002', amount: 199.00, method: 'pix', brand: null, status: 'approved', installments: 1, client_card: null, arn: 'E11111111111111111111111111111111', customer: { name: 'Carla Cliente', document: '***222' } },
];

export const mockSubaccounts = [
  { id: 'sub1', name: 'Loja Fashion Store', marketplace: 'Marketplace A', marketplace_id: 'M-001', mcc: '5651', status: 'active', gmv: 150000, cb_ratio: 0.1, created_at: '2023-01-15' },
  { id: 'sub2', name: 'Tech Gadgets Pro', marketplace: 'Marketplace B', marketplace_id: 'M-002', mcc: '5732', status: 'pending_compliance', gmv: 0, cb_ratio: 0, created_at: '2024-03-20' },
  { id: 'sub3', name: 'Artesanato Brasil', marketplace: 'Marketplace C', marketplace_id: 'M-003', mcc: '5999', status: 'active', gmv: 92000, cb_ratio: 0.05, created_at: '2023-06-10' },
  { id: 'sub4', name: 'Gourmet Foods', marketplace: 'Marketplace A', marketplace_id: 'M-001', mcc: '5812', status: 'under_review', gmv: 45000, cb_ratio: 0.15, created_at: '2024-01-05' },
];

export const mockKycQueue = mockMerchants.filter(m => ['pending_compliance', 'under_review'].includes(m.compliance_status) || m.kyc_score < 70);

export const mockMetrics = {
    totalMerchants: 456,
    activeMerchants: 398,
    suspendedMerchants: 12,
    tpvMonth: "85M",
    revenueMonth: "2.5M",
    newMerchants: 23,
    kycPending: 7,
    kycManual: 5,
    kycAutoApproved: 75, // %
    kycApprovedMonth: 120,
    kycRejectedMonth: 8,
    topMerchants: [
        { name: 'Eletrônicos Baratos', value: 2100000 },
        { name: 'Tecno Inovação', value: 1200000 },
        { name: 'Loja Teste', value: 850000 },
        { name: 'Empresa X', value: 620000 },
        { name: 'Empresa Y', value: 480000 }
    ],
    statusDistribution: [
        { name: 'Ativo', value: 398, color: '#10B981' },
        { name: 'Pendente', value: 46, color: '#94A3B8' },
        { name: 'Suspenso', value: 8, color: '#F59E0B' },
        { name: 'Bloqueado', value: 4, color: '#EF4444' }
    ],
    mccDistribution: [
        { name: 'Varejo', value: 150, color: '#3B82F6' },
        { name: 'SaaS', value: 80, color: '#8B5CF6' },
        { name: 'Alimentação', value: 60, color: '#10B981' },
        { name: 'Serviços', value: 120, color: '#F59E0B' },
        { name: 'Outros', value: 46, color: '#64748B' }
    ]
};

export const mockDisputes = [
  { id: 'CB-001', transaction_id: 'TXN-12345678', merchant: 'Loja Teste Online', merchant_id: 'sub_mock_001', amount: 1250.00, reason: '13.1 - Mercadoria não recebida', status: 'open', deadline: '2026-02-15', created_at: '2026-01-20' },
  { id: 'CB-002', transaction_id: 'TXN-12345000', merchant: 'Moda Express', merchant_id: 'sub_mock_003', amount: 450.00, reason: '10.4 - Crédito não processado', status: 'pending_docs', deadline: '2026-02-10', created_at: '2026-01-18' },
  { id: 'CB-003', transaction_id: 'TXN-12344000', merchant: 'Eletrônicos Baratos', merchant_id: 'sub_mock_005', amount: 2800.00, reason: '13.3 - Produto diferente', status: 'won', deadline: '2026-01-25', created_at: '2026-01-10' },
];

export const mockPreChargebacks = [
  { id: 'PCB-001', transaction_id: 'TXN-12340001', merchant: 'Eletrônicos Baratos', merchant_id: 'sub_mock_005', amount: 890.00, provider: 'ethoca', status: 'pending', deadline: '2026-01-30', received_at: '2026-01-27' },
  { id: 'PCB-002', transaction_id: 'TXN-12340002', merchant: 'Loja Teste Online', merchant_id: 'sub_mock_001', amount: 350.00, provider: 'verifi', status: 'refunded', deadline: '2026-01-28', received_at: '2026-01-25' },
];

export const mockSettlements = [
  { id: 'SET-001', merchant: 'Loja Teste Online', merchant_id: 'sub_mock_001', amount_gross: 45230, amount_net: 43996, status: 'paid', date: '2026-01-27', bank: 'Itaú' },
  { id: 'SET-002', merchant: 'Tech Solutions', merchant_id: 'sub_mock_002', amount_gross: 28500, amount_net: 27610, status: 'processing', date: '2026-01-27', bank: 'Nubank' },
  { id: 'SET-003', merchant: 'Café Gourmet', merchant_id: 'sub_mock_004', amount_gross: 8450, amount_net: 8138, status: 'failed', date: '2026-01-27', bank: 'Inter' },
];
