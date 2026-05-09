// Mock data for Mentor Sales Representatives

export const REP_STATUSES = {
  active: { label: 'Ativo', color: 'bg-emerald-100 text-emerald-700' },
  inactive: { label: 'Inativo', color: 'bg-slate-100 text-slate-600' },
  on_leave: { label: 'Afastado', color: 'bg-amber-100 text-amber-700' },
};

export const REP_TYPES = {
  internal: { label: 'Interno', color: 'bg-blue-100 text-blue-700' },
  external: { label: 'Externo', color: 'bg-violet-100 text-violet-700' },
  freelance: { label: 'Autônomo', color: 'bg-orange-100 text-orange-700' },
};

const tpvEvolution = (base) => {
  const arr = [];
  let val = base * 0.7;
  for (let i = 0; i < 24; i++) {
    val = val * (1 + (Math.random() - 0.4) * 0.08);
    arr.push({ month: `M${i + 1}`, tpv: Math.round(val) });
  }
  return arr;
};

export const MOCK_SALES_REPS = [
  {
    id: 'rep_001',
    name: 'Ricardo Almeida',
    email: 'ricardo.almeida@pagsmile.com',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    status: 'active',
    type: 'internal',
    region: 'sudeste',
    specialty: 'b2b_saas',
    commission_pct: 0.15,
    hierarchy: ['Diretoria Comercial', 'Gerência Sudeste', 'Ricardo Almeida'],
    accounts_count: 28,
    monthly_tpv: 145_000_000,
    monthly_revenue: 1_850_000,
    monthly_commission: 27_750,
    ytd_commission: 138_750,
    quota_target_value: 150_000_000,
    quota_target_pct: 96.7,
    growth_12m_pct: 18.3,
    avg_approval_rate: 93.1,
    captures_12m: 8,
    losses_12m: 2,
    tpv_evolution_24m: tpvEvolution(145_000_000),
    accounts: [
      { id: 'a1', name: 'TechBR Solutions', type: 'PJ', tpv: 28_000_000 },
      { id: 'a2', name: 'CloudFlow SaaS', type: 'PJ', tpv: 22_500_000 },
      { id: 'a3', name: 'DataSync Inc', type: 'PJ', tpv: 18_900_000 },
      { id: 'a4', name: 'AppForge Studio', type: 'PJ', tpv: 14_200_000 },
    ],
    commission_history: [
      { month: '2026-04', value: 27_750, status: 'paid', paid_at: '2026-05-05' },
      { month: '2026-03', value: 25_400, status: 'paid', paid_at: '2026-04-05' },
      { month: '2026-02', value: 23_800, status: 'paid', paid_at: '2026-03-05' },
    ],
    captures_losses: [
      { type: 'capture', name: 'TechBR Solutions', date: '2026-04-12', source: 'inbound' },
      { type: 'capture', name: 'AppForge Studio', date: '2026-03-08', source: 'evento Web Summit' },
      { type: 'loss', name: 'OldClient Corp', date: '2026-02-22', reason: 'churn por preço' },
    ],
  },
  {
    id: 'rep_002',
    name: 'Mariana Costa',
    email: 'mariana.costa@pagsmile.com',
    phone: '(11) 99876-5432',
    cpf: '987.654.321-00',
    status: 'active',
    type: 'internal',
    region: 'sudeste',
    specialty: 'ecommerce',
    commission_pct: 0.18,
    hierarchy: ['Diretoria Comercial', 'Gerência Sudeste', 'Mariana Costa'],
    accounts_count: 42,
    monthly_tpv: 215_000_000,
    monthly_revenue: 2_840_000,
    monthly_commission: 51_120,
    ytd_commission: 256_800,
    quota_target_value: 200_000_000,
    quota_target_pct: 107.5,
    growth_12m_pct: 24.6,
    avg_approval_rate: 91.8,
    captures_12m: 12,
    losses_12m: 1,
    tpv_evolution_24m: tpvEvolution(215_000_000),
    accounts: [
      { id: 'b1', name: 'MegaShop E-commerce', type: 'PJ', tpv: 58_000_000 },
      { id: 'b2', name: 'FashionStore Online', type: 'PJ', tpv: 41_500_000 },
      { id: 'b3', name: 'ElectroMart BR', type: 'PJ', tpv: 38_200_000 },
    ],
    commission_history: [
      { month: '2026-04', value: 51_120, status: 'paid', paid_at: '2026-05-05' },
      { month: '2026-03', value: 48_900, status: 'paid', paid_at: '2026-04-05' },
    ],
    captures_losses: [
      { type: 'capture', name: 'MegaShop E-commerce', date: '2026-04-18', source: 'indicação' },
    ],
  },
  {
    id: 'rep_003',
    name: 'Carlos Pereira',
    email: 'cpereira@parceiro.com.br',
    phone: '(21) 97654-3210',
    cpf: '456.789.123-00',
    status: 'active',
    type: 'external',
    region: 'sul',
    specialty: 'varejo',
    commission_pct: 0.22,
    hierarchy: ['Parceria Externa Sul', 'Carlos Pereira'],
    accounts_count: 18,
    monthly_tpv: 68_000_000,
    monthly_revenue: 920_000,
    monthly_commission: 20_240,
    ytd_commission: 95_400,
    quota_target_value: 80_000_000,
    quota_target_pct: 85.0,
    growth_12m_pct: 6.2,
    avg_approval_rate: 89.4,
    captures_12m: 4,
    losses_12m: 3,
    tpv_evolution_24m: tpvEvolution(68_000_000),
    accounts: [
      { id: 'c1', name: 'RedeVarejo Sul', type: 'PJ', tpv: 22_000_000 },
      { id: 'c2', name: 'SuperMercado Central', type: 'PJ', tpv: 18_500_000 },
    ],
    commission_history: [
      { month: '2026-04', value: 20_240, status: 'paid', paid_at: '2026-05-05' },
    ],
    captures_losses: [
      { type: 'loss', name: 'PetShop Garra', date: '2026-04-10', reason: 'concorrência (Stone)' },
      { type: 'loss', name: 'Casa & Lar', date: '2026-03-15', reason: 'falência' },
    ],
  },
  {
    id: 'rep_004',
    name: 'Ana Silva',
    email: 'ana.silva@autonomo.com',
    phone: '(85) 96543-2109',
    cpf: '321.654.987-00',
    status: 'active',
    type: 'freelance',
    region: 'nordeste',
    specialty: 'foodservice',
    commission_pct: 0.20,
    hierarchy: ['Autônomos', 'Ana Silva'],
    accounts_count: 14,
    monthly_tpv: 32_000_000,
    monthly_revenue: 420_000,
    monthly_commission: 8_400,
    ytd_commission: 41_500,
    quota_target_value: 50_000_000,
    quota_target_pct: 64.0,
    growth_12m_pct: -8.4,
    avg_approval_rate: 87.2,
    captures_12m: 2,
    losses_12m: 5,
    tpv_evolution_24m: tpvEvolution(32_000_000),
    accounts: [
      { id: 'd1', name: 'Restaurante Sabor', type: 'PJ', tpv: 5_200_000 },
      { id: 'd2', name: 'Delivery Express NE', type: 'PJ', tpv: 8_100_000 },
    ],
    commission_history: [
      { month: '2026-04', value: 8_400, status: 'paid', paid_at: '2026-05-05' },
    ],
    captures_losses: [
      { type: 'loss', name: 'PizzaHouse Fortaleza', date: '2026-04-22', reason: 'churn' },
      { type: 'loss', name: 'Açaí da Praia', date: '2026-04-02', reason: 'inatividade' },
      { type: 'loss', name: 'Burger Local', date: '2026-03-19', reason: 'concorrência' },
    ],
  },
];

export const REP_AUDIT_EVENTS = [
  { id: 'aur_1', date: '2026-05-07 11:23', user: 'admin@pagsmile.com', action: 'Comissão alterada', detail: '12% → 15%', category: 'config' },
  { id: 'aur_2', date: '2026-04-22 09:14', user: 'system', action: 'Captação registrada', detail: 'TechBR Solutions adicionada à carteira', category: 'portfolio' },
  { id: 'aur_3', date: '2026-04-10 15:30', user: 'admin@pagsmile.com', action: 'Mudança de hierarquia', detail: 'Movido para Gerência Sudeste', category: 'org' },
];