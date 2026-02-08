// Mock data for Admin Interno module visualization

// Comerciantes Principais (Merchants) - nível superior da hierarquia
export const mockMainMerchants = [
  {
    id: "merchant_001",
    business_name: "Marketplace Brasil S.A.",
    legal_name: "Marketplace Brasil Tecnologia S.A.",
    document: "12.345.678/0001-90",
    document_type: "cnpj",
    email: "contato@marketplacebrasil.com",
    phone: "(11) 3000-1234",
    website: "www.marketplacebrasil.com.br",
    status: "active",
    mcc: "5411",
    mcc_description: "Marketplace Geral",
    cnae: "4751-2/01",
    category: "Marketplace",
    opening_date: "2018-03-15",
    address: {
      street: "Av. Paulista",
      number: "1000",
      complement: "10º andar",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      zip_code: "01310-100"
    },
    total_volume: 25000000.00,
    total_transactions_count: 150000,
    available_balance: 850000.00,
    pending_balance: 320000.00,
    subaccounts_count: 3,
    created_at: "2018-03-15T10:00:00Z"
  },
  {
    id: "merchant_002",
    business_name: "Tech Solutions Group",
    legal_name: "Tech Solutions Group Ltda",
    document: "98.765.432/0001-10",
    document_type: "cnpj",
    email: "admin@techsolutions.com",
    phone: "(11) 4000-5678",
    website: "www.techsolutions.com.br",
    status: "active",
    mcc: "5734",
    mcc_description: "Software/SaaS",
    cnae: "6201-5/00",
    category: "SaaS",
    opening_date: "2020-06-01",
    address: {
      street: "Rua Funchal",
      number: "500",
      complement: "5º andar",
      neighborhood: "Vila Olímpia",
      city: "São Paulo",
      state: "SP",
      zip_code: "04551-060"
    },
    total_volume: 8500000.00,
    total_transactions_count: 45000,
    available_balance: 280000.00,
    pending_balance: 95000.00,
    subaccounts_count: 2,
    created_at: "2020-06-01T14:30:00Z"
  },
  {
    id: "merchant_003",
    business_name: "E-Commerce Master",
    legal_name: "E-Commerce Master Negócios Digitais Ltda",
    document: "55.666.777/0001-88",
    document_type: "cnpj",
    email: "financeiro@ecommercemaster.com",
    phone: "(21) 2500-9999",
    website: "www.ecommercemaster.com.br",
    status: "pending_compliance",
    mcc: "5969",
    mcc_description: "Marketing Direto",
    cnae: "4789-0/99",
    category: "E-commerce",
    opening_date: "2023-01-10",
    address: {
      street: "Av. Rio Branco",
      number: "156",
      complement: "Sala 1201",
      neighborhood: "Centro",
      city: "Rio de Janeiro",
      state: "RJ",
      zip_code: "20040-901"
    },
    total_volume: 1200000.00,
    total_transactions_count: 8500,
    available_balance: 45000.00,
    pending_balance: 18000.00,
    subaccounts_count: 2,
    created_at: "2023-01-10T09:00:00Z"
  }
];

// Subcontas vinculadas aos comerciantes principais
export const mockHierarchicalSubaccounts = [
  // Subcontas do Marketplace Brasil (merchant_001)
  {
    id: "sub_001_a",
    parent_merchant_id: "merchant_001",
    subaccount_id: "sub_001_a",
    business_name: "Loja Fashion Store",
    legal_name: "Fashion Store Comércio de Roupas Ltda",
    document: "11.111.111/0001-11",
    document_type: "cnpj",
    email: "contato@fashionstore.com",
    phone: "(11) 99999-1111",
    website: "www.fashionstore.com.br",
    status: "active",
    mcc: "5651",
    mcc_description: "Varejo de Roupas",
    mcc_declared: "5651",
    cnae: "4781-4/00",
    cnae_declared: "4781-4/00",
    mcc_compliance_status: "compliant",
    category: "Varejo",
    opening_date: "2019-05-20",
    address: {
      street: "Rua das Flores",
      number: "123",
      complement: "Loja A",
      neighborhood: "Jardins",
      city: "São Paulo",
      state: "SP",
      zip_code: "01410-000"
    },
    bank_accounts: [
      {
        id: "ba_001",
        bank_name: "Itaú Unibanco",
        bank_code: "341",
        agency: "1234",
        account_number: "12345-6",
        account_type: "checking",
        pix_key: "contato@fashionstore.com",
        pix_key_type: "email",
        is_primary: true
      }
    ],
    documents: [
      { id: "doc_001", type: "contrato_social", name: "Contrato Social", url: "#", status: "approved", uploaded_at: "2023-01-15T10:00:00Z" },
      { id: "doc_002", type: "cnpj_card", name: "Cartão CNPJ", url: "#", status: "approved", uploaded_at: "2023-01-15T10:05:00Z" },
      { id: "doc_003", type: "rg_socios", name: "RG dos Sócios", url: "#", status: "approved", uploaded_at: "2023-01-15T10:10:00Z" }
    ],
    kyc_data: {
      expected_monthly_volume: "R$ 100.000 - R$ 500.000",
      main_products: "Roupas femininas e masculinas",
      customer_profile: "Pessoa física, classe A/B",
      delivery_method: "Correios e transportadoras"
    },
    partners: [
      { name: "Maria Fernanda Silva", cpf: "123.456.789-00", share: "60%", pep: false, sanctions: false },
      { name: "João Carlos Silva", cpf: "987.654.321-00", share: "40%", pep: false, sanctions: false }
    ],
    contacts: [
      { name: "Maria Fernanda", email: "maria@fashionstore.com", phone: "(11) 99999-1111", type: "owner", is_primary: true }
    ],
    notes: [
      { user: "admin@pagsmile.com", content: "Cliente com bom histórico de transações", date: "2024-06-15T14:00:00Z" },
      { user: "compliance@pagsmile.com", content: "Documentos validados sem pendências", date: "2024-01-20T09:30:00Z" }
    ],
    total_volume: 8500000.00,
    total_transactions_count: 45000,
    available_balance: 125000.00,
    pending_balance: 45000.00,
    blocked_balance: 0,
    revenue_current_month: 12500.00,
    avg_approval_rate: 92.5,
    avg_chargeback_ratio: 0.08,
    compliance_status: "compliant",
    ai_compliance_score: 95,
    ai_compliance_status: "approved",
    ai_compliance_justification: "Cliente com excelente histórico, documentação completa e score de risco baixo.",
    ai_compliance_red_flags: [],
    risk_level: "low",
    limits: {
      per_transaction: 10000,
      daily: 100000,
      monthly: 2000000,
      pix_per_transaction: 5000,
      pix_daily: 50000
    },
    rates_config: {
      mdr_credit: 3.49,
      mdr_debit: 2.49,
      mdr_pix: 0.99,
      fixed_fee_card: 0.50,
      fixed_fee_pix: 0,
      anticipation_rate: 2.49
    },
    plan_name: "Growth",
    selected_plan: "growth",
    created_at: "2023-01-15T10:00:00Z"
  },
  {
    id: "sub_001_b",
    parent_merchant_id: "merchant_001",
    subaccount_id: "sub_001_b",
    business_name: "Tech Gadgets Pro",
    legal_name: "Tech Gadgets Comércio Eletrônico Ltda",
    document: "22.222.222/0001-22",
    document_type: "cnpj",
    email: "vendas@techgadgets.com",
    phone: "(11) 99999-2222",
    website: "www.techgadgets.com.br",
    status: "pending_compliance",
    mcc: "5732",
    mcc_description: "Eletrônicos",
    mcc_declared: "5732",
    cnae: "4753-9/00",
    cnae_declared: "4753-9/00",
    mcc_compliance_status: "under_review",
    category: "Eletrônicos",
    opening_date: "2022-08-10",
    address: {
      street: "Av. Brigadeiro Faria Lima",
      number: "2000",
      complement: "Conj 201",
      neighborhood: "Pinheiros",
      city: "São Paulo",
      state: "SP",
      zip_code: "05426-200"
    },
    bank_accounts: [
      {
        id: "ba_002",
        bank_name: "Nubank",
        bank_code: "260",
        agency: "0001",
        account_number: "9876543-2",
        account_type: "checking",
        pix_key: "22222222000122",
        pix_key_type: "cnpj",
        is_primary: true
      }
    ],
    documents: [
      { id: "doc_004", type: "contrato_social", name: "Contrato Social", url: "#", status: "approved", uploaded_at: "2024-03-20T10:00:00Z" },
      { id: "doc_005", type: "cnpj_card", name: "Cartão CNPJ", url: "#", status: "approved", uploaded_at: "2024-03-20T10:05:00Z" },
      { id: "doc_006", type: "balanco", name: "Balanço Patrimonial", url: "#", status: "pending", uploaded_at: "2024-03-20T10:10:00Z" }
    ],
    kyc_data: {
      expected_monthly_volume: "R$ 50.000 - R$ 100.000",
      main_products: "Smartphones, tablets, acessórios",
      customer_profile: "Pessoa física, jovens 18-35",
      delivery_method: "Transportadoras"
    },
    partners: [
      { name: "Carlos Eduardo Tech", cpf: "111.222.333-44", share: "100%", pep: false, sanctions: false }
    ],
    contacts: [
      { name: "Carlos Eduardo", email: "carlos@techgadgets.com", phone: "(11) 99999-2222", type: "owner", is_primary: true }
    ],
    notes: [
      { user: "compliance@pagsmile.com", content: "Aguardando balanço patrimonial atualizado", date: "2024-03-25T11:00:00Z" }
    ],
    total_volume: 0,
    total_transactions_count: 0,
    available_balance: 0,
    pending_balance: 0,
    blocked_balance: 0,
    revenue_current_month: 0,
    avg_approval_rate: 0,
    avg_chargeback_ratio: 0,
    compliance_status: "pending_docs",
    ai_compliance_score: 65,
    ai_compliance_status: "manual_review",
    ai_compliance_justification: "Empresa nova (< 2 anos), necessita análise manual e documentos adicionais.",
    ai_compliance_red_flags: ["Empresa < 2 anos", "Balanço patrimonial pendente"],
    risk_level: "medium",
    limits: {
      per_transaction: 5000,
      daily: 50000,
      monthly: 500000,
      pix_per_transaction: 2000,
      pix_daily: 20000
    },
    rates_config: {
      mdr_credit: 3.99,
      mdr_debit: 2.99,
      mdr_pix: 1.29,
      fixed_fee_card: 0.60,
      fixed_fee_pix: 0,
      anticipation_rate: 2.99
    },
    plan_name: "Starter",
    selected_plan: "starter",
    created_at: "2024-03-20T10:00:00Z"
  },
  {
    id: "sub_001_c",
    parent_merchant_id: "merchant_001",
    subaccount_id: "sub_001_c",
    business_name: "Artesanato Brasil",
    legal_name: "Artesanato Brasil ME",
    document: "33.333.333/0001-33",
    document_type: "cnpj",
    email: "contato@artesanatobrasil.com",
    phone: "(21) 99999-3333",
    website: "www.artesanatobrasil.com.br",
    status: "active",
    mcc: "5999",
    mcc_description: "Varejo Diversos",
    mcc_declared: "5999",
    cnae: "4789-0/99",
    cnae_declared: "4789-0/99",
    mcc_compliance_status: "compliant",
    category: "Artesanato",
    opening_date: "2017-03-15",
    address: {
      street: "Rua do Artesão",
      number: "50",
      complement: "",
      neighborhood: "Santa Teresa",
      city: "Rio de Janeiro",
      state: "RJ",
      zip_code: "20240-230"
    },
    bank_accounts: [
      {
        id: "ba_003",
        bank_name: "Banco do Brasil",
        bank_code: "001",
        agency: "5678",
        account_number: "54321-0",
        account_type: "checking",
        pix_key: "(21) 99999-3333",
        pix_key_type: "phone",
        is_primary: true
      }
    ],
    documents: [
      { id: "doc_007", type: "contrato_social", name: "Contrato Social", url: "#", status: "approved", uploaded_at: "2023-06-10T10:00:00Z" },
      { id: "doc_008", type: "cnpj_card", name: "Cartão CNPJ", url: "#", status: "approved", uploaded_at: "2023-06-10T10:05:00Z" }
    ],
    kyc_data: {
      expected_monthly_volume: "R$ 10.000 - R$ 50.000",
      main_products: "Artesanato brasileiro, decoração",
      customer_profile: "Pessoa física, turistas",
      delivery_method: "Correios"
    },
    partners: [
      { name: "Ana Costa Artesã", cpf: "555.666.777-88", share: "100%", pep: false, sanctions: false }
    ],
    contacts: [
      { name: "Ana Costa", email: "ana@artesanatobrasil.com", phone: "(21) 99999-3333", type: "owner", is_primary: true }
    ],
    notes: [],
    total_volume: 920000.00,
    total_transactions_count: 12500,
    available_balance: 18500.00,
    pending_balance: 5200.00,
    blocked_balance: 0,
    revenue_current_month: 1850.00,
    avg_approval_rate: 96.2,
    avg_chargeback_ratio: 0.02,
    compliance_status: "compliant",
    ai_compliance_score: 92,
    ai_compliance_status: "approved",
    ai_compliance_justification: "Empresa estabelecida com mais de 5 anos, excelente histórico.",
    ai_compliance_red_flags: [],
    risk_level: "low",
    limits: {
      per_transaction: 3000,
      daily: 30000,
      monthly: 300000,
      pix_per_transaction: 2000,
      pix_daily: 15000
    },
    rates_config: {
      mdr_credit: 3.49,
      mdr_debit: 2.49,
      mdr_pix: 0.99,
      fixed_fee_card: 0.50,
      fixed_fee_pix: 0,
      anticipation_rate: 2.49
    },
    plan_name: "Pro",
    selected_plan: "pro",
    created_at: "2023-06-10T10:00:00Z"
  },
  // Subcontas do Tech Solutions (merchant_002)
  {
    id: "sub_002_a",
    parent_merchant_id: "merchant_002",
    subaccount_id: "sub_002_a",
    business_name: "SaaS Platform Alpha",
    legal_name: "Alpha Plataforma Digital Ltda",
    document: "44.444.444/0001-44",
    document_type: "cnpj",
    email: "billing@alphaplatform.com",
    phone: "(11) 99999-4444",
    website: "www.alphaplatform.com.br",
    status: "active",
    mcc: "5734",
    mcc_description: "Software/SaaS",
    mcc_declared: "5734",
    cnae: "6201-5/00",
    cnae_declared: "6201-5/00",
    mcc_compliance_status: "compliant",
    category: "SaaS",
    opening_date: "2021-01-10",
    address: {
      street: "Rua Funchal",
      number: "500",
      complement: "Conj 510",
      neighborhood: "Vila Olímpia",
      city: "São Paulo",
      state: "SP",
      zip_code: "04551-060"
    },
    bank_accounts: [
      {
        id: "ba_004",
        bank_name: "Inter",
        bank_code: "077",
        agency: "0001",
        account_number: "1234567-8",
        account_type: "checking",
        pix_key: "billing@alphaplatform.com",
        pix_key_type: "email",
        is_primary: true
      }
    ],
    documents: [
      { id: "doc_009", type: "contrato_social", name: "Contrato Social", url: "#", status: "approved", uploaded_at: "2023-02-01T10:00:00Z" },
      { id: "doc_010", type: "cnpj_card", name: "Cartão CNPJ", url: "#", status: "approved", uploaded_at: "2023-02-01T10:05:00Z" }
    ],
    kyc_data: {
      expected_monthly_volume: "R$ 200.000 - R$ 500.000",
      main_products: "Assinaturas de software, licenças",
      customer_profile: "Empresas B2B, PMEs",
      delivery_method: "Digital"
    },
    partners: [
      { name: "Pedro Alpha", cpf: "444.555.666-77", share: "70%", pep: false, sanctions: false },
      { name: "Laura Beta", cpf: "777.888.999-00", share: "30%", pep: false, sanctions: false }
    ],
    contacts: [
      { name: "Pedro Alpha", email: "pedro@alphaplatform.com", phone: "(11) 99999-4444", type: "owner", is_primary: true }
    ],
    notes: [],
    total_volume: 5200000.00,
    total_transactions_count: 28000,
    available_balance: 185000.00,
    pending_balance: 62000.00,
    blocked_balance: 0,
    revenue_current_month: 9500.00,
    avg_approval_rate: 94.8,
    avg_chargeback_ratio: 0.05,
    compliance_status: "compliant",
    ai_compliance_score: 88,
    ai_compliance_status: "approved",
    ai_compliance_justification: "Empresa de tecnologia com bom histórico de pagamentos recorrentes.",
    ai_compliance_red_flags: [],
    risk_level: "low",
    limits: {
      per_transaction: 15000,
      daily: 150000,
      monthly: 3000000,
      pix_per_transaction: 10000,
      pix_daily: 100000
    },
    rates_config: {
      mdr_credit: 2.99,
      mdr_debit: 1.99,
      mdr_pix: 0.79,
      fixed_fee_card: 0.40,
      fixed_fee_pix: 0,
      anticipation_rate: 1.99
    },
    plan_name: "Enterprise",
    selected_plan: "enterprise",
    created_at: "2023-02-01T10:00:00Z"
  },
  {
    id: "sub_002_b",
    parent_merchant_id: "merchant_002",
    subaccount_id: "sub_002_b",
    business_name: "Gourmet Foods Delivery",
    legal_name: "Gourmet Foods Alimentos Ltda",
    document: "55.555.555/0001-55",
    document_type: "cnpj",
    email: "financeiro@gourmetfoods.com",
    phone: "(41) 99999-5555",
    website: "www.gourmetfoods.com.br",
    status: "under_review",
    mcc: "5812",
    mcc_description: "Restaurantes",
    mcc_declared: "5812",
    cnae: "5611-2/01",
    cnae_declared: "5611-2/01",
    mcc_compliance_status: "under_review",
    category: "Alimentação",
    opening_date: "2022-08-20",
    address: {
      street: "Av. Gastronômica",
      number: "200",
      complement: "",
      neighborhood: "Batel",
      city: "Curitiba",
      state: "PR",
      zip_code: "80420-000"
    },
    bank_accounts: [
      {
        id: "ba_005",
        bank_name: "Santander",
        bank_code: "033",
        agency: "4321",
        account_number: "87654321-0",
        account_type: "checking",
        pix_key: "55555555000155",
        pix_key_type: "cnpj",
        is_primary: true
      }
    ],
    documents: [
      { id: "doc_011", type: "contrato_social", name: "Contrato Social", url: "#", status: "approved", uploaded_at: "2024-01-05T10:00:00Z" },
      { id: "doc_012", type: "cnpj_card", name: "Cartão CNPJ", url: "#", status: "approved", uploaded_at: "2024-01-05T10:05:00Z" },
      { id: "doc_013", type: "alvara", name: "Alvará de Funcionamento", url: "#", status: "pending", uploaded_at: "2024-01-05T10:10:00Z" }
    ],
    kyc_data: {
      expected_monthly_volume: "R$ 30.000 - R$ 100.000",
      main_products: "Refeições gourmet, delivery",
      customer_profile: "Pessoa física, classe A/B",
      delivery_method: "Delivery próprio e iFood"
    },
    partners: [
      { name: "Carlos Lima Chef", cpf: "888.999.000-11", share: "100%", pep: false, sanctions: false }
    ],
    contacts: [
      { name: "Carlos Lima", email: "carlos@gourmetfoods.com", phone: "(41) 99999-5555", type: "owner", is_primary: true }
    ],
    notes: [
      { user: "compliance@pagsmile.com", content: "Aguardando alvará de funcionamento atualizado", date: "2024-01-10T15:00:00Z" }
    ],
    total_volume: 450000.00,
    total_transactions_count: 8500,
    available_balance: 12000.00,
    pending_balance: 4500.00,
    blocked_balance: 0,
    revenue_current_month: 820.00,
    avg_approval_rate: 89.5,
    avg_chargeback_ratio: 0.12,
    compliance_status: "under_review",
    ai_compliance_score: 72,
    ai_compliance_status: "manual_review",
    ai_compliance_justification: "Documentação parcialmente completa, aguardando alvará.",
    ai_compliance_red_flags: ["Alvará pendente", "CB ratio acima da média do setor"],
    risk_level: "medium",
    limits: {
      per_transaction: 2000,
      daily: 20000,
      monthly: 200000,
      pix_per_transaction: 1000,
      pix_daily: 10000
    },
    rates_config: {
      mdr_credit: 3.49,
      mdr_debit: 2.49,
      mdr_pix: 0.99,
      fixed_fee_card: 0.50,
      fixed_fee_pix: 0,
      anticipation_rate: 2.49
    },
    plan_name: "Growth",
    selected_plan: "growth",
    created_at: "2024-01-05T10:00:00Z"
  },
  // Subcontas do E-Commerce Master (merchant_003)
  {
    id: "sub_003_a",
    parent_merchant_id: "merchant_003",
    subaccount_id: "sub_003_a",
    business_name: "Dropshipping Express",
    legal_name: "Drop Express Negócios Digitais ME",
    document: "66.666.666/0001-66",
    document_type: "cnpj",
    email: "suporte@dropexpress.com",
    phone: "(21) 99999-6666",
    website: "www.dropexpress.com.br",
    status: "blocked",
    mcc: "5969",
    mcc_description: "Marketing Direto",
    mcc_declared: "5411",
    cnae: "4789-0/99",
    cnae_declared: "4751-2/01",
    mcc_observed: "5969",
    mcc_compliance_status: "potential_deviation",
    category: "E-commerce",
    opening_date: "2024-06-01",
    address: {
      street: "Rua Virtual",
      number: "999",
      complement: "",
      neighborhood: "Centro",
      city: "Rio de Janeiro",
      state: "RJ",
      zip_code: "20040-020"
    },
    bank_accounts: [
      {
        id: "ba_006",
        bank_name: "C6 Bank",
        bank_code: "336",
        agency: "0001",
        account_number: "6666666-6",
        account_type: "checking",
        pix_key: "chave_aleatoria_123456",
        pix_key_type: "random",
        is_primary: true
      }
    ],
    documents: [
      { id: "doc_014", type: "contrato_social", name: "Contrato Social", url: "#", status: "rejected", uploaded_at: "2024-06-05T10:00:00Z" }
    ],
    kyc_data: {
      expected_monthly_volume: "R$ 500.000+",
      main_products: "Produtos importados diversos",
      customer_profile: "Pessoa física",
      delivery_method: "Fornecedor direto ao cliente"
    },
    partners: [
      { name: "Nome Suspeito", cpf: "000.111.222-33", share: "100%", pep: false, sanctions: true }
    ],
    contacts: [
      { name: "Nome Suspeito", email: "suporte@dropexpress.com", phone: "(21) 99999-6666", type: "owner", is_primary: true }
    ],
    notes: [
      { user: "risk@pagsmile.com", content: "Conta bloqueada por suspeita de fraude", date: "2024-07-15T09:00:00Z" },
      { user: "compliance@pagsmile.com", content: "Documentos falsos identificados", date: "2024-07-14T16:00:00Z" }
    ],
    total_volume: 85000.00,
    total_transactions_count: 520,
    available_balance: 0,
    pending_balance: 0,
    blocked_balance: 25000.00,
    revenue_current_month: 0,
    avg_approval_rate: 45.0,
    avg_chargeback_ratio: 3.5,
    compliance_status: "non_compliant",
    ai_compliance_score: 15,
    ai_compliance_status: "rejected",
    ai_compliance_justification: "Múltiplos red flags identificados: documentos falsos, sócio em lista de sanções, CB ratio crítico.",
    ai_compliance_red_flags: ["Documentos falsos", "Sócio em lista de sanções", "CB ratio crítico (3.5%)", "MCC divergente", "Empresa < 1 ano"],
    risk_level: "critical",
    limits: {
      per_transaction: 0,
      daily: 0,
      monthly: 0,
      pix_per_transaction: 0,
      pix_daily: 0
    },
    rates_config: {
      mdr_credit: 4.99,
      mdr_debit: 3.99,
      mdr_pix: 1.99,
      fixed_fee_card: 0.80,
      fixed_fee_pix: 0.30,
      anticipation_rate: 3.99
    },
    plan_name: "Starter",
    selected_plan: "starter",
    created_at: "2024-06-05T10:00:00Z"
  },
  {
    id: "sub_003_b",
    parent_merchant_id: "merchant_003",
    subaccount_id: "sub_003_b",
    business_name: "Imports Premium",
    legal_name: "Imports Premium Comércio Ltda",
    document: "77.777.777/0001-77",
    document_type: "cnpj",
    email: "vendas@importspremium.com",
    phone: "(21) 99999-7777",
    website: "www.importspremium.com.br",
    status: "suspended",
    mcc: "5732",
    mcc_description: "Eletrônicos",
    mcc_declared: "5732",
    cnae: "4753-9/00",
    cnae_declared: "4753-9/00",
    mcc_compliance_status: "compliant",
    category: "Eletrônicos",
    opening_date: "2023-03-01",
    address: {
      street: "Av. das Américas",
      number: "5000",
      complement: "Bloco 2",
      neighborhood: "Barra da Tijuca",
      city: "Rio de Janeiro",
      state: "RJ",
      zip_code: "22640-102"
    },
    bank_accounts: [
      {
        id: "ba_007",
        bank_name: "Bradesco",
        bank_code: "237",
        agency: "9876",
        account_number: "7777777-7",
        account_type: "checking",
        pix_key: "vendas@importspremium.com",
        pix_key_type: "email",
        is_primary: true
      }
    ],
    documents: [
      { id: "doc_015", type: "contrato_social", name: "Contrato Social", url: "#", status: "approved", uploaded_at: "2023-11-01T10:00:00Z" },
      { id: "doc_016", type: "cnpj_card", name: "Cartão CNPJ", url: "#", status: "approved", uploaded_at: "2023-11-01T10:05:00Z" },
      { id: "doc_017", type: "licenca_importacao", name: "Licença de Importação", url: "#", status: "expired", uploaded_at: "2023-11-01T10:10:00Z" }
    ],
    kyc_data: {
      expected_monthly_volume: "R$ 100.000 - R$ 300.000",
      main_products: "Eletrônicos importados",
      customer_profile: "Pessoa física, classe A/B",
      delivery_method: "Transportadoras"
    },
    partners: [
      { name: "Roberto Imports", cpf: "222.333.444-55", share: "60%", pep: false, sanctions: false },
      { name: "Paula Premium", cpf: "333.444.555-66", share: "40%", pep: true, sanctions: false }
    ],
    contacts: [
      { name: "Roberto Imports", email: "roberto@importspremium.com", phone: "(21) 99999-7777", type: "owner", is_primary: true }
    ],
    notes: [
      { user: "compliance@pagsmile.com", content: "Conta suspensa: licença de importação vencida e PEP na estrutura", date: "2024-02-01T10:00:00Z" }
    ],
    total_volume: 1800000.00,
    total_transactions_count: 9500,
    available_balance: 0,
    pending_balance: 45000.00,
    blocked_balance: 85000.00,
    revenue_current_month: 0,
    avg_approval_rate: 78.5,
    avg_chargeback_ratio: 0.85,
    compliance_status: "non_compliant",
    ai_compliance_score: 48,
    ai_compliance_status: "manual_review",
    ai_compliance_justification: "Licença de importação vencida e presença de PEP na estrutura societária requerem análise manual.",
    ai_compliance_red_flags: ["Licença de importação vencida", "PEP na estrutura societária", "CB ratio elevado"],
    risk_level: "high",
    limits: {
      per_transaction: 0,
      daily: 0,
      monthly: 0,
      pix_per_transaction: 0,
      pix_daily: 0
    },
    rates_config: {
      mdr_credit: 3.99,
      mdr_debit: 2.99,
      mdr_pix: 1.29,
      fixed_fee_card: 0.60,
      fixed_fee_pix: 0,
      anticipation_rate: 2.99
    },
    plan_name: "Growth",
    selected_plan: "growth",
    created_at: "2023-11-01T10:00:00Z"
  }
];

// Transações mockadas com subaccount_id para filtragem
export const mockSubaccountTransactions = [
  { id: 'TXN-SUB-001', date: '2026-02-08T14:32:00Z', subaccount_id: 'sub_001_a', amount: 1250.00, method: 'credit_card', brand: 'Visa', status: 'approved', installments: 3, customer: { name: 'João Cliente', document: '***789', email: 'joao@email.com' } },
  { id: 'TXN-SUB-002', date: '2026-02-08T14:30:00Z', subaccount_id: 'sub_001_a', amount: 89.90, method: 'pix', brand: null, status: 'approved', installments: 1, customer: { name: 'Maria Cliente', document: '***456', email: 'maria@email.com' } },
  { id: 'TXN-SUB-003', date: '2026-02-08T14:28:00Z', subaccount_id: 'sub_001_b', amount: 450.00, method: 'credit_card', brand: 'Mastercard', status: 'refused', installments: 1, customer: { name: 'Pedro Cliente', document: '***123', email: 'pedro@email.com' } },
  { id: 'TXN-SUB-004', date: '2026-02-08T14:25:00Z', subaccount_id: 'sub_001_a', amount: 2300.00, method: 'credit_card', brand: 'Visa', status: 'refunded', installments: 10, customer: { name: 'Ana Cliente', document: '***321', email: 'ana@email.com' } },
  { id: 'TXN-SUB-005', date: '2026-02-08T14:20:00Z', subaccount_id: 'sub_001_c', amount: 45.00, method: 'pix', brand: null, status: 'approved', installments: 1, customer: { name: 'Lucas Cliente', document: '***654', email: 'lucas@email.com' } },
  { id: 'TXN-SUB-006', date: '2026-02-08T14:15:00Z', subaccount_id: 'sub_002_a', amount: 3500.00, method: 'credit_card', brand: 'Elo', status: 'approved', installments: 12, customer: { name: 'Fernanda Cliente', document: '***987', email: 'fernanda@email.com' } },
  { id: 'TXN-SUB-007', date: '2026-02-08T14:10:00Z', subaccount_id: 'sub_002_a', amount: 890.00, method: 'debit_card', brand: 'Visa', status: 'approved', installments: 1, customer: { name: 'Ricardo Cliente', document: '***111', email: 'ricardo@email.com' } },
  { id: 'TXN-SUB-008', date: '2026-02-08T14:05:00Z', subaccount_id: 'sub_002_b', amount: 199.00, method: 'pix', brand: null, status: 'approved', installments: 1, customer: { name: 'Carla Cliente', document: '***222', email: 'carla@email.com' } },
  { id: 'TXN-SUB-009', date: '2026-02-07T18:00:00Z', subaccount_id: 'sub_001_a', amount: 850.00, method: 'credit_card', brand: 'Mastercard', status: 'approved', installments: 6, customer: { name: 'Bruno Cliente', document: '***333', email: 'bruno@email.com' } },
  { id: 'TXN-SUB-010', date: '2026-02-07T16:30:00Z', subaccount_id: 'sub_003_a', amount: 1500.00, method: 'credit_card', brand: 'Visa', status: 'chargeback', installments: 1, customer: { name: 'Suspeito Cliente', document: '***000', email: 'suspeito@email.com' } },
];

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