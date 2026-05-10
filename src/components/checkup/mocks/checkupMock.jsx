// Mock data for Checkup Hub (Mentor API ORIGEM 194-197)

export const CHECKUP_TYPES = {
  authorization_orphan: { 
    label: 'Autorização Órfã', 
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    description: 'Transação autorizada no adquirente mas não capturada internamente'
  },
  capture_orphan: { 
    label: 'Captura Órfã', 
    color: 'bg-red-100 text-red-700 border-red-200',
    description: 'Capturada no sistema mas não confirmada no adquirente'
  },
  status_divergent: { 
    label: 'Status Divergente', 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    description: 'Status diferente entre sistema interno e adquirente'
  },
  settlement_anomaly: { 
    label: 'Liquidação Pendente Anômala', 
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    description: 'Capturada mas pagamento não gerado em janela esperada'
  },
  timeout_critical: { 
    label: 'Timeout em Fluxo Crítico', 
    color: 'bg-rose-100 text-rose-700 border-rose-200',
    description: 'Estado intermediário por tempo anormal'
  },
  value_inconsistency: { 
    label: 'Inconsistência de Valores', 
    color: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
    description: 'Divergência entre valor capturado e valor reportado'
  },
  cancel_incomplete: { 
    label: 'Cancelamento Incompleto', 
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    description: 'Cancelada mas reversão de efeitos não aconteceu'
  },
  chargeback_unreflected: { 
    label: 'Chargeback Não Refletido', 
    color: 'bg-pink-100 text-pink-700 border-pink-200',
    description: 'Chargeback aplicado mas não refletido no sistema'
  },
  fiscal_inconsistency: { 
    label: 'Inconsistência Fiscal', 
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    description: 'Divergências em valores fiscais (IOF, ISS, IR)'
  },
  propagation_failure: { 
    label: 'Falha de Propagação', 
    color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    description: 'Capturada mas falha em sistema downstream'
  },
};

export const CHECKUP_SEVERITIES = {
  critical: { label: 'Crítica', color: 'bg-red-500 text-white', sla_hours: 4, weight: 4 },
  high: { label: 'Alta', color: 'bg-orange-500 text-white', sla_hours: 24, weight: 3 },
  medium: { label: 'Média', color: 'bg-yellow-500 text-white', sla_hours: 72, weight: 2 },
  low: { label: 'Baixa', color: 'bg-blue-400 text-white', sla_hours: 168, weight: 1 },
};

export const CHECKUP_STATUS = {
  active: { label: 'Ativo', color: 'bg-amber-100 text-amber-700' },
  in_analysis: { label: 'Em Análise', color: 'bg-blue-100 text-blue-700' },
  in_treatment: { label: 'Em Tratativa', color: 'bg-purple-100 text-purple-700' },
  resolved: { label: 'Regularizado', color: 'bg-emerald-100 text-emerald-700' },
  discarded: { label: 'Descartado', color: 'bg-slate-100 text-slate-600' },
  escalated: { label: 'Escalado', color: 'bg-rose-100 text-rose-700' },
};

export const CHECKUP_RECOMMENDATIONS = {
  authorize: { label: 'Autorizar manualmente', color: 'text-emerald-600', icon: 'check' },
  soft_delete: { label: 'Soft delete', color: 'text-rose-600', icon: 'trash' },
  wait: { label: 'Aguardar regularização', color: 'text-blue-600', icon: 'clock' },
  escalate: { label: 'Escalar para sênior', color: 'text-orange-600', icon: 'arrow-up' },
};

const merchants = [
  { id: 'mer_001', name: 'Loja do Pedro', cnpj: '12.345.678/0001-90' },
  { id: 'mer_002', name: 'TechShop SP', cnpj: '23.456.789/0001-01' },
  { id: 'mer_003', name: 'Farmácia Saúde+', cnpj: '34.567.890/0001-12' },
  { id: 'mer_004', name: 'Restaurante Bom Sabor', cnpj: '45.678.901/0001-23' },
  { id: 'mer_005', name: 'Boutique Elegance', cnpj: '56.789.012/0001-34' },
  { id: 'mer_006', name: 'Marketplace Ace', cnpj: '67.890.123/0001-45' },
];

const acquirers = ['Cielo', 'Stone', 'Adyen', 'Rede', 'GetNet'];
const brands = ['Visa', 'Mastercard', 'Elo', 'Hipercard', 'Amex'];
const operators = [
  { id: 'op_001', name: 'Ana Souza', email: 'ana.souza@pagsmile.com' },
  { id: 'op_002', name: 'Bruno Lima', email: 'bruno.lima@pagsmile.com' },
  { id: 'op_003', name: 'Carla Mendes', email: 'carla.mendes@pagsmile.com' },
  null, // unassigned
];

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export const CHECKUP_KPIS = {
  total_active: 247,
  critical_count: 18,
  sla_breached: 23,
  avg_resolution_hours: 6.4,
  total_value_affected: 4_250_800,
  resolved_today: 89,
  resolution_rate_30d: 94.2,
  false_positive_rate: 8.7,
  unassigned_count: 42,
  escalated_count: 11,
};

// Generate 50 mock checkups
function generateMocks() {
  const types = Object.keys(CHECKUP_TYPES);
  const severities = Object.keys(CHECKUP_SEVERITIES);
  const statuses = ['active', 'active', 'active', 'in_analysis', 'in_treatment', 'resolved', 'discarded', 'escalated'];
  const recs = Object.keys(CHECKUP_RECOMMENDATIONS);
  const out = [];
  
  for (let i = 1; i <= 50; i++) {
    const type = pickRandom(types);
    const severity = pickRandom(severities);
    const status = pickRandom(statuses);
    const merchant = pickRandom(merchants);
    const acquirer = pickRandom(acquirers);
    const brand = pickRandom(brands);
    const operator = pickRandom(operators);
    const detected_hours_ago = Math.random() * 240;
    const sla_hours = CHECKUP_SEVERITIES[severity].sla_hours;
    const sla_breached = detected_hours_ago > sla_hours;
    const amount = Math.random() < 0.15 ? 5000 + Math.random() * 50000 : 50 + Math.random() * 4000;
    
    out.push({
      id: `chk_${String(i).padStart(5, '0')}`,
      transaction_id: `txn_${String(900000 + i).padStart(7, '0')}`,
      nsu: String(100000000 + i),
      auth_code: String(500000 + i),
      type,
      severity,
      status,
      confidence: Math.random() < 0.7 ? 'high' : (Math.random() < 0.5 ? 'medium' : 'low'),
      merchant,
      acquirer,
      brand,
      amount: Math.round(amount * 100) / 100,
      installments: Math.random() < 0.3 ? Math.floor(Math.random() * 12) + 1 : 1,
      detected_at: new Date(Date.now() - detected_hours_ago * 3600000).toISOString(),
      transaction_date: new Date(Date.now() - (detected_hours_ago + Math.random() * 48) * 3600000).toISOString(),
      sla_hours,
      sla_breached,
      hours_open: Math.round(detected_hours_ago * 10) / 10,
      assigned_to: operator,
      recommendation: pickRandom(recs),
      tags: Math.random() < 0.3 ? (Math.random() < 0.5 ? ['regulatorio'] : ['pld_ft']) : [],
      attempts: Math.floor(Math.random() * 4),
      project: pickRandom(['PagSmile Brasil', 'PagSmile México', 'PagSmile Argentina']),
      capture_method: pickRandom(['ecommerce', 'pos', 'paylink', 'api']),
      // diff for detail view
      internal_state: { status: 'authorized', captured: false, amount },
      external_state: { status: 'authorized', captured: true, amount },
    });
  }
  return out;
}

export const CHECKUP_MOCKS = generateMocks();

// Distribution by type for analytics
export const CHECKUP_TYPE_DISTRIBUTION = Object.keys(CHECKUP_TYPES).map(key => ({
  type: CHECKUP_TYPES[key].label,
  count: CHECKUP_MOCKS.filter(c => c.type === key).length,
  key,
}));

export const CHECKUP_TIMELINE_24H = Array.from({ length: 24 }, (_, h) => ({
  hour: `${String(h).padStart(2, '0')}h`,
  detected: Math.floor(Math.random() * 25) + (h >= 9 && h <= 18 ? 15 : 3),
}));

// Anomalies
export const CHECKUP_ANOMALIES = [
  {
    id: 'anom_001',
    severity: 'critical',
    title: 'Pico súbito de Autorização Órfã',
    description: '47 novos casos em 1h — adquirente Cielo pode estar com instabilidade',
    suggestion: 'Validar com equipe técnica do Cielo + escalar para SRE',
    related_count: 47,
  },
  {
    id: 'anom_002',
    severity: 'high',
    title: 'Lojista com volume anormal',
    description: 'TechShop SP tem 12× a taxa média de diagnósticos do segmento',
    suggestion: 'Investigar configuração de terminal ou padrão suspeito',
    related_count: 28,
  },
  {
    id: 'anom_003',
    severity: 'medium',
    title: 'Operador com fila acumulada',
    description: 'Bruno Lima tem 18 diagnósticos críticos abertos há mais de 24h',
    suggestion: 'Redistribuir carga ou escalar para sênior',
    related_count: 18,
  },
];

// Authorize/Delete eligibility validation rules (for flow pages)
export const ELIGIBILITY_RULES = {
  authorize: [
    { field: 'status', allowed: ['authorization_orphan'], message: 'Apenas autorizações órfãs são elegíveis' },
    { field: 'has_chargeback', forbidden: true, message: 'Transações com chargeback aberto não podem ser re-autorizadas' },
  ],
  soft_delete: [
    { field: 'has_payment_generated', forbidden: true, message: 'Transações com pagamento gerado precisam reverter pagamento primeiro' },
    { field: 'has_chargeback', forbidden: true, message: 'Transações em chargeback não podem ser soft-deletadas' },
  ],
};