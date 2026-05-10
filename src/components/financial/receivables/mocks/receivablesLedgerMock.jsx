// Mock data — Receivables Ledger (Wave K)
export const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export const RECEIVABLE_STATUS = {
  pending: { label: 'A receber', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  available: { label: 'Disponível', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  paid: { label: 'Liquidado', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  blocked: { label: 'Bloqueado', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  in_chargeback: { label: 'Em chargeback', color: 'bg-red-100 text-red-700 border-red-200' },
  ceded: { label: 'Cedido', color: 'bg-violet-100 text-violet-700 border-violet-200' },
  anticipated: { label: 'Antecipado', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
};

export const CERC_STATUS = {
  registered: { label: 'Registrado', color: 'bg-emerald-100 text-emerald-700' },
  pending_registration: { label: 'Pendente', color: 'bg-amber-100 text-amber-700' },
  divergence: { label: 'Divergência', color: 'bg-red-100 text-red-700' },
  not_applicable: { label: 'N/A', color: 'bg-slate-100 text-slate-600' },
};

export const RECEIVABLES_KPIS = {
  total_gross: 18_450_320,
  total_net: 17_120_540,
  pending: 12_300_000,
  available: 4_820_540,
  blocked: 285_000,
  in_chargeback: 145_320,
  ceded: 980_000,
  anticipated: 2_100_000,
  cerc_pending: 12,
  cerc_divergences: 3,
  count_total: 1842,
};

export const TOP_BLOCK_REASONS = [
  { reason: 'Chargeback aberto', count: 18, value: 145_320 },
  { reason: 'Suspeita de fraude', count: 8, value: 89_400 },
  { reason: 'Bloqueio judicial', count: 3, value: 42_180 },
  { reason: 'Compliance review', count: 5, value: 8_100 },
];

const merchants = [
  { id: 'M-001', name: 'E-commerce XYZ Ltda', cnpj: '12.345.678/0001-90' },
  { id: 'M-002', name: 'PetShop Premium', cnpj: '98.765.432/0001-10' },
  { id: 'M-003', name: 'Fashion Online ME', cnpj: '11.222.333/0001-44' },
  { id: 'M-004', name: 'SaaS Cloud BR', cnpj: '55.666.777/0001-88' },
  { id: 'M-005', name: 'Mega Lojas SA', cnpj: '22.333.444/0001-55' },
];

const brands = ['visa', 'mastercard', 'elo', 'amex', 'hipercard'];
const statuses = ['pending', 'available', 'paid', 'blocked', 'in_chargeback', 'ceded', 'anticipated'];
const cercStatuses = ['registered', 'registered', 'registered', 'pending_registration', 'divergence'];

const today = new Date();
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x.toISOString().split('T')[0];
};

export const MOCK_RECEIVABLES = Array.from({ length: 80 }).map((_, i) => {
  const merchant = merchants[i % merchants.length];
  const gross = 200 + Math.random() * 9800;
  const mdr = gross * (0.018 + Math.random() * 0.025);
  const installment = (i % 12) + 1;
  const totalInstallments = installment > 1 ? 12 : 1;
  return {
    id: `RCV-${String(2026000 + i).padStart(7, '0')}`,
    transaction_id: `TXN-${String(5000000 + i).padStart(7, '0')}`,
    nsu: String(800000 + i),
    arn: `ARN${String(100000 + i).padStart(15, '0')}`,
    merchant,
    capture_date: addDays(today, -((i % 30) + 1)),
    expected_date: addDays(today, ((i % 30) - 5)),
    gross_value: Number(gross.toFixed(2)),
    mdr: Number(mdr.toFixed(2)),
    net_value: Number((gross - mdr).toFixed(2)),
    brand: brands[i % brands.length],
    installment,
    total_installments: totalInstallments,
    status: statuses[i % statuses.length],
    cerc_status: cercStatuses[i % cercStatuses.length],
  };
});