// Mock data — Unidades de Recebíveis (UR) regulatórias + Efeitos de Contrato + CERC
// Cobre Mentor API Entrega 6 Parte 3 (F3586-F3804)

export const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export const formatCurrencyShort = (v) => {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}K`;
  return formatCurrency(v);
};

// ========== REGISTRADORAS ==========
export const REGISTRARS = {
  CERC: { label: 'CERC', color: 'bg-violet-100 text-violet-700 border-violet-200', primary: true },
  CIP: { label: 'CIP', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  B3: { label: 'B3', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  TAG: { label: 'TAG', color: 'bg-amber-100 text-amber-700 border-amber-200' },
};

// ========== ARRANJOS DE PAGAMENTO ==========
export const PAYMENT_ARRANGEMENTS = {
  credit_avista: { label: 'Crédito à vista', color: 'bg-blue-100 text-blue-700' },
  credit_parcelado: { label: 'Crédito parcelado', color: 'bg-violet-100 text-violet-700' },
  debit: { label: 'Débito', color: 'bg-emerald-100 text-emerald-700' },
  voucher: { label: 'Voucher', color: 'bg-amber-100 text-amber-700' },
  pix: { label: 'PIX', color: 'bg-cyan-100 text-cyan-700' },
};

// ========== STATUS REGULATÓRIO ==========
export const UR_STATUS = {
  active: { label: 'Ativa', color: 'bg-blue-100 text-blue-700 border-blue-200', desc: 'UR sem efeitos — totalmente disponível' },
  partially_committed: { label: 'Parcialmente comprometida', color: 'bg-amber-100 text-amber-700 border-amber-200', desc: 'Parte comprometida, restante disponível' },
  fully_committed: { label: 'Totalmente comprometida', color: 'bg-orange-100 text-orange-700 border-orange-200', desc: 'Sem valor livre' },
  liquidated: { label: 'Liquidada', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', desc: 'Estado final saudável' },
  cancelled: { label: 'Cancelada', color: 'bg-slate-100 text-slate-700 border-slate-200', desc: 'UR cancelada' },
};

// ========== STATUS REGISTRO REGISTRADORA ==========
export const REGISTRATION_STATUS = {
  registered: { label: 'Registrado', color: 'bg-emerald-100 text-emerald-700' },
  pending: { label: 'Pendente registro', color: 'bg-amber-100 text-amber-700' },
  failed: { label: 'Falha registro', color: 'bg-red-100 text-red-700' },
};

// ========== TIPOS DE EFEITO DE CONTRATO ==========
export const EFFECT_TYPES = {
  fiduciary_assignment: { label: 'Cessão fiduciária', color: 'bg-violet-100 text-violet-700', icon: '🛡️', desc: 'UR cedida como garantia — lojista pode resgatar quitando' },
  credit_assignment: { label: 'Cessão de crédito', color: 'bg-fuchsia-100 text-fuchsia-700', icon: '💱', desc: 'UR vendida definitivamente — não retorna' },
  judicial_lien: { label: 'Oneração judicial', color: 'bg-red-100 text-red-700', icon: '⚖️', desc: 'Bloqueio por decisão judicial' },
  administrative_lien: { label: 'Oneração administrativa', color: 'bg-orange-100 text-orange-700', icon: '🏛️', desc: 'Bloqueio por órgão regulador' },
  attachment: { label: 'Penhora', color: 'bg-rose-100 text-rose-700', icon: '🔗', desc: 'Penhora em execução fiscal/trabalhista' },
  voluntary_lock: { label: 'Trava voluntária', color: 'bg-slate-100 text-slate-700', icon: '🔒', desc: 'Bloqueio voluntário pelo lojista' },
  registered_anticipation: { label: 'Antecipação registrada', color: 'bg-cyan-100 text-cyan-700', icon: '⚡', desc: 'Antecipação aplicada e registrada' },
};

export const EFFECT_STATUS = {
  active: { label: 'Ativo', color: 'bg-blue-100 text-blue-700' },
  suspended: { label: 'Suspenso', color: 'bg-amber-100 text-amber-700' },
  cancelled: { label: 'Cancelado', color: 'bg-slate-100 text-slate-700' },
  liquidated: { label: 'Liquidado', color: 'bg-emerald-100 text-emerald-700' },
  failed_registration: { label: 'Falha registro', color: 'bg-red-100 text-red-700' },
};

// ========== KPIs UR ==========
export const UR_KPIS = {
  total_count: 12_842,
  total_gross: 28_450_320,
  total_net: 26_120_540,
  total_available: 18_300_000,
  total_committed: 7_820_540,
  active_count: 8_420,
  partially_committed_count: 2_140,
  fully_committed_count: 580,
  liquidated_count: 1_650,
  cancelled_count: 52,
  registration_pending: 23,
  registration_failed: 8,
  conciliation_divergences: 5,
  cerc_concordance_rate: 99.6,
  avg_registration_time_hours: 3.2,
};

// ========== KPIs Efeitos ==========
export const EFFECTS_KPIS = {
  total_count: 4_280,
  total_value_affected: 9_450_000,
  fiduciary_assignment_count: 1_240,
  credit_assignment_count: 320,
  judicial_lien_count: 145,
  administrative_lien_count: 22,
  attachment_count: 38,
  voluntary_lock_count: 18,
  registered_anticipation_count: 2_497,
  active_count: 3_980,
  failed_registration_count: 12,
  with_conflict_count: 4,
  top_counterparty: 'Banco Itaú S/A',
  top_counterparty_value: 2_120_000,
};

// ========== KPIs CERC Conciliation ==========
export const CERC_KPIS = {
  conciliations_30d: 30,
  avg_concordance_rate: 99.6,
  divergences_critical: 2,
  divergences_medium: 8,
  divergences_minor: 24,
  pending_treatment: 5,
  avg_sla_hours: 18,
  files_exchanged_30d: 540,
};

const merchants = [
  { id: 'mer_001', name: 'E-commerce XYZ Ltda', cnpj: '12.345.678/0001-90', segment: 'E-commerce' },
  { id: 'mer_002', name: 'PetShop Premium', cnpj: '98.765.432/0001-10', segment: 'Varejo' },
  { id: 'mer_003', name: 'Fashion Online ME', cnpj: '11.222.333/0001-44', segment: 'Moda' },
  { id: 'mer_004', name: 'SaaS Cloud BR', cnpj: '55.666.777/0001-88', segment: 'Tecnologia' },
  { id: 'mer_005', name: 'Mega Lojas SA', cnpj: '22.333.444/0001-55', segment: 'Varejo' },
];

const acquirers = ['Cielo', 'Stone', 'Adyen', 'Rede', 'Getnet'];
const brands = ['visa', 'mastercard', 'elo', 'amex', 'hipercard'];
const arrangementKeys = Object.keys(PAYMENT_ARRANGEMENTS);
const statusKeys = ['active', 'active', 'active', 'partially_committed', 'partially_committed', 'fully_committed', 'liquidated', 'cancelled'];
const regKeys = Object.keys(REGISTRARS);
const regStatusKeys = ['registered', 'registered', 'registered', 'registered', 'registered', 'pending', 'failed'];

const today = new Date();
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x.toISOString().split('T')[0];
};

// ========== UR MOCK DATA ==========
export const MOCK_URS = Array.from({ length: 120 }).map((_, i) => {
  const merchant = merchants[i % merchants.length];
  const gross = 500 + Math.random() * 25_000;
  const mdr = gross * (0.018 + Math.random() * 0.025);
  const net = gross - mdr - (Math.random() * 50);
  const installment = (i % 12) + 1;
  const totalInstallments = i % 4 === 0 ? 12 : (i % 3 === 0 ? 6 : 1);
  const arrangement = totalInstallments > 1 ? 'credit_parcelado' : arrangementKeys[i % arrangementKeys.length];
  const status = statusKeys[i % statusKeys.length];
  const registrar = regKeys[i % regKeys.length];
  const regStatus = regStatusKeys[i % regStatusKeys.length];
  const hasEffects = status === 'partially_committed' || status === 'fully_committed';
  const committedAmount = hasEffects ? (status === 'fully_committed' ? net : net * (0.3 + Math.random() * 0.4)) : 0;

  return {
    id: `UR-${String(2026000 + i).padStart(7, '0')}`,
    registrar_id: `${registrar}-${String(900000 + i).padStart(8, '0')}`,
    transaction_id: `TXN-${String(5000000 + i).padStart(7, '0')}`,
    merchant,
    brand: brands[i % brands.length],
    acquirer: acquirers[i % acquirers.length],
    arrangement,
    installment,
    total_installments: totalInstallments,
    capture_date: addDays(today, -((i % 30) + 1)),
    expected_date: addDays(today, ((i % 30) - 5)),
    registration_date: addDays(today, -((i % 30))),
    gross_value: Number(gross.toFixed(2)),
    mdr_value: Number(mdr.toFixed(2)),
    net_value: Number(net.toFixed(2)),
    available_value: Number(Math.max(0, net - committedAmount).toFixed(2)),
    committed_value: Number(committedAmount.toFixed(2)),
    status,
    registrar,
    registration_status: regStatus,
    effects_count: hasEffects ? Math.ceil(Math.random() * 3) : 0,
    has_judicial_lien: hasEffects && i % 7 === 0,
    has_assignment: hasEffects && i % 5 === 0,
    has_anticipation: hasEffects && i % 4 === 0,
    cerc_conciliation_status: i % 25 === 0 ? 'divergence' : (i % 30 === 0 ? 'pending' : 'conciliated'),
    health_score: regStatus === 'failed' ? 35 : (regStatus === 'pending' ? 70 : (hasEffects ? 85 : 95)),
    nsu: String(800000 + i),
    arn: `ARN${String(100000 + i).padStart(15, '0')}`,
    terminal_id: `TRM-${String(100 + (i % 50)).padStart(4, '0')}`,
    project_id: i % 3 === 0 ? 'proj_alpha' : (i % 3 === 1 ? 'proj_beta' : 'proj_gamma'),
    transactions_count: totalInstallments > 1 ? 1 : Math.ceil(Math.random() * 80) + 20,
  };
});

// ========== CONTRACT EFFECTS MOCK ==========
const counterparties = [
  { id: 'cp_001', name: 'Banco Itaú S/A', type: 'bank', cnpj: '60.701.190/0001-04' },
  { id: 'cp_002', name: 'Banco Bradesco S/A', type: 'bank', cnpj: '60.746.948/0001-12' },
  { id: 'cp_003', name: 'Banco Santander', type: 'bank', cnpj: '90.400.888/0001-42' },
  { id: 'cp_004', name: 'BTG Pactual', type: 'bank', cnpj: '30.306.294/0001-45' },
  { id: 'cp_005', name: '3ª Vara Cível de SP', type: 'judicial', cnpj: null, process: '1234567-89.2024.8.26.0100' },
  { id: 'cp_006', name: 'Justiça do Trabalho 2ª Região', type: 'judicial', cnpj: null, process: '0001234-56.2024.5.02.0001' },
  { id: 'cp_007', name: 'Receita Federal', type: 'administrative', cnpj: '00.394.460/0001-41' },
  { id: 'cp_008', name: 'PagSmile', type: 'internal', cnpj: '12.345.678/0001-99' },
];

const effectTypeKeys = Object.keys(EFFECT_TYPES);
const effectStatusKeys = ['active', 'active', 'active', 'active', 'liquidated', 'cancelled', 'failed_registration'];

export const MOCK_EFFECTS = Array.from({ length: 80 }).map((_, i) => {
  const ur = MOCK_URS[i % MOCK_URS.length];
  const typeKey = effectTypeKeys[i % effectTypeKeys.length];
  const type = EFFECT_TYPES[typeKey];
  let counterparty;
  if (typeKey === 'judicial_lien' || typeKey === 'attachment') counterparty = counterparties[4 + (i % 2)];
  else if (typeKey === 'administrative_lien') counterparty = counterparties[6];
  else if (typeKey === 'registered_anticipation') counterparty = counterparties[7];
  else counterparty = counterparties[i % 4];

  const valueAffected = ur.net_value * (0.2 + Math.random() * 0.6);
  const status = effectStatusKeys[i % effectStatusKeys.length];

  return {
    id: `EFF-${String(202600 + i).padStart(6, '0')}`,
    registrar_id: `${ur.registrar}-EFF-${String(700000 + i).padStart(8, '0')}`,
    type: typeKey,
    sub_type: typeKey === 'attachment' ? (i % 2 === 0 ? 'fiscal' : 'labor') : null,
    ur_id: ur.id,
    ur,
    counterparty,
    value_affected: Number(valueAffected.toFixed(2)),
    pct_of_ur: Number((valueAffected / ur.net_value * 100).toFixed(1)),
    application_date: addDays(today, -((i % 40) + 1)),
    registration_date: addDays(today, -((i % 40))),
    expiration_date: typeKey === 'voluntary_lock' || typeKey === 'administrative_lien' ? addDays(today, 30 + (i % 60)) : null,
    status,
    registrar: ur.registrar,
    has_conflict: i % 20 === 0,
    documents_count: Math.ceil(Math.random() * 4),
    notes: i % 5 === 0 ? `Efeito aplicado em ${type.label.toLowerCase()} — referência ${i}` : null,
    process_ref: counterparty.process || null,
    contract_ref: typeKey.includes('assignment') ? `CONTR-2026-${String(1000 + i).padStart(4, '0')}` : null,
    created_by: 'sistema.regulatorio@pagsmile.com',
  };
});

// ========== CERC CONCILIATIONS MOCK ==========
export const MOCK_CONCILIATIONS = Array.from({ length: 30 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  const total = 400 + Math.floor(Math.random() * 200);
  const divergences = i % 5 === 0 ? Math.floor(Math.random() * 8) + 2 : Math.floor(Math.random() * 3);
  return {
    id: `CONC-${date.toISOString().split('T')[0]}`,
    execution_date: date.toISOString(),
    method: i % 7 === 0 ? 'manual' : 'automatic',
    scope: 'all_urs_day',
    total_compared: total,
    concordant: total - divergences,
    divergent: divergences,
    concordance_rate: Number(((total - divergences) / total * 100).toFixed(2)),
    critical_divergences: i % 10 === 0 ? Math.ceil(divergences * 0.3) : 0,
    medium_divergences: Math.ceil(divergences * 0.4),
    minor_divergences: Math.floor(divergences * 0.3),
    status: i % 15 === 0 ? 'failed' : (divergences > 0 ? 'with_divergences' : 'success'),
    triggered_by: i % 7 === 0 ? 'admin@pagsmile.com' : 'system_scheduler',
    duration_seconds: 30 + Math.floor(Math.random() * 90),
  };
});

// ========== DIVERGENCES (per conciliation) MOCK ==========
export const MOCK_DIVERGENCES = Array.from({ length: 18 }).map((_, i) => {
  const ur = MOCK_URS[i];
  const types = ['value_mismatch', 'missing_in_cerc', 'missing_internal', 'status_mismatch', 'effect_not_registered'];
  const severities = ['critical', 'critical', 'medium', 'medium', 'minor'];
  return {
    id: `DIV-${String(50000 + i).padStart(5, '0')}`,
    conciliation_id: `CONC-${addDays(today, -(i % 7))}`,
    ur_id: ur.id,
    ur,
    type: types[i % types.length],
    severity: severities[i % severities.length],
    detected_at: new Date(Date.now() - i * 3600000).toISOString(),
    internal_value: ur.net_value,
    cerc_value: ur.net_value + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 100,
    description: `Divergência de ${types[i % types.length].replace('_', ' ')} na UR ${ur.id}`,
    status: i % 4 === 0 ? 'resolved' : (i % 3 === 0 ? 'in_treatment' : 'pending'),
    sla_hours_remaining: severities[i % severities.length] === 'critical' ? 24 - (i * 2) : 168 - (i * 5),
    assigned_to: i % 3 === 0 ? 'ops.tech@pagsmile.com' : null,
  };
});

export const DIVERGENCE_TYPES = {
  value_mismatch: { label: 'Valor divergente', color: 'bg-amber-100 text-amber-700' },
  missing_in_cerc: { label: 'Ausente na CERC', color: 'bg-red-100 text-red-700' },
  missing_internal: { label: 'Ausente interno', color: 'bg-red-100 text-red-700' },
  status_mismatch: { label: 'Status divergente', color: 'bg-orange-100 text-orange-700' },
  effect_not_registered: { label: 'Efeito não registrado', color: 'bg-violet-100 text-violet-700' },
};

export const DIVERGENCE_SEVERITY = {
  critical: { label: 'Crítica', color: 'bg-red-100 text-red-700 border-red-200', sla_hours: 24 },
  medium: { label: 'Média', color: 'bg-amber-100 text-amber-700 border-amber-200', sla_hours: 72 },
  minor: { label: 'Menor', color: 'bg-blue-100 text-blue-700 border-blue-200', sla_hours: 168 },
};

// ========== CERC FILES MOCK ==========
export const CERC_FILE_TYPES = {
  REGISTRO_UR: { label: 'Registro UR', color: 'bg-blue-100 text-blue-700' },
  ATUALIZACAO_UR: { label: 'Atualização UR', color: 'bg-cyan-100 text-cyan-700' },
  CANCELAMENTO_UR: { label: 'Cancelamento UR', color: 'bg-slate-100 text-slate-700' },
  REGISTRO_EFEITO: { label: 'Registro Efeito', color: 'bg-violet-100 text-violet-700' },
  CANCELAMENTO_EFEITO: { label: 'Cancelamento Efeito', color: 'bg-fuchsia-100 text-fuchsia-700' },
  CONCILIACAO: { label: 'Conciliação', color: 'bg-emerald-100 text-emerald-700' },
  CONSULTA: { label: 'Consulta', color: 'bg-amber-100 text-amber-700' },
  RETORNO: { label: 'Retorno', color: 'bg-orange-100 text-orange-700' },
};

export const MOCK_CERC_FILES = Array.from({ length: 60 }).map((_, i) => {
  const types = Object.keys(CERC_FILE_TYPES);
  const formats = ['CNAB', 'XML', 'JSON'];
  return {
    id: `FILE-${String(80000 + i).padStart(6, '0')}`,
    type: types[i % types.length],
    format: formats[i % formats.length],
    direction: i % 3 === 0 ? 'inbound' : 'outbound',
    file_name: `${types[i % types.length].toLowerCase()}_${addDays(today, -i)}.${formats[i % formats.length].toLowerCase()}`,
    size_bytes: 1024 * (50 + Math.floor(Math.random() * 5000)),
    created_at: new Date(Date.now() - i * 3600000).toISOString(),
    status: i % 12 === 0 ? 'error' : (i % 8 === 0 ? 'pending' : 'processed'),
    records_count: 10 + Math.floor(Math.random() * 500),
    aggregate_value: Math.random() * 5_000_000,
    checksum: `sha256:${Math.random().toString(36).substring(2, 18)}...`,
    version: i % 6 === 0 ? 2 : 1,
  };
});

// Sample CNAB content
export const SAMPLE_CNAB_CONTENT = `0000001REGISTRO UR                                              CERC2026050100000001
0000002UR-202600001    CERC-90000001  12345678000190VISA  CIELO 20260601C0001 0000005000000
0000003UR-202600002    CERC-90000002  12345678000190MASTRCIELO 20260601C0001 0000003000000
0000004UR-202600003    CERC-90000003  98765432000110VISA  STONE 20260615C0001 0000008500000
0000005UR-202600004    CERC-90000004  11222333000144ELO   ADYEN 20260710D0001 0000001200000
9999999TOTAL                                              0000000000000017700000`;

export const SAMPLE_XML_CONTENT = `<?xml version="1.0" encoding="UTF-8"?>
<CERCRegister xmlns="http://cerc.com.br/v1" timestamp="2026-05-01T03:00:00Z">
  <Header>
    <FileType>REGISTRO_UR</FileType>
    <Originator>PAGSMILE</Originator>
    <RecordCount>4</RecordCount>
  </Header>
  <Records>
    <UR id="UR-202600001" registrarId="CERC-90000001">
      <Merchant cnpj="12345678000190"/>
      <Brand>VISA</Brand>
      <Acquirer>CIELO</Acquirer>
      <DueDate>2026-06-01</DueDate>
      <Amount>50000.00</Amount>
    </UR>
    <UR id="UR-202600002" registrarId="CERC-90000002">
      <Merchant cnpj="12345678000190"/>
      <Brand>MASTERCARD</Brand>
      <Acquirer>CIELO</Acquirer>
      <DueDate>2026-06-01</DueDate>
      <Amount>30000.00</Amount>
    </UR>
  </Records>
</CERCRegister>`;