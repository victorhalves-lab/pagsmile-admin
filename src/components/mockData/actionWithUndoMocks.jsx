/**
 * Mocks de ações undo-able (ActionWithUndo) para popular o
 * `AdminIntAuditTrailEnhanced`.
 *
 * - mockUndoableActionsHistory: 50 ações históricas (confirmed/cancelled/errored)
 * - mockPendingActionsQueue:     2 ações pendentes (ainda dentro do undo window)
 */

const ACTORS = [
  { user_id: 'u_001', name: 'João Silva', email: 'joao@pagsmile.com', role: 'OpsManager' },
  { user_id: 'u_002', name: 'Mariana Costa', email: 'mariana@pagsmile.com', role: 'Risk Manager' },
  { user_id: 'u_003', name: 'Ana Souza', email: 'ana@pagsmile.com', role: 'Compliance' },
  { user_id: 'u_004', name: 'Pedro Almeida', email: 'pedro@pagsmile.com', role: 'Finance Manager' },
  { user_id: 'u_005', name: 'Carla Mendes', email: 'carla@pagsmile.com', role: 'Analyst' },
  { user_id: 'u_006', name: 'Rafael Lima', email: 'rafael@pagsmile.com', role: 'Commercial' },
  { user_id: 'u_007', name: 'Beatriz Oliveira', email: 'beatriz@pagsmile.com', role: 'SuperAdmin' },
  { user_id: 'u_008', name: 'Lucas Ferreira', email: 'lucas@pagsmile.com', role: 'Risk Manager' },
];

const MERCHANTS = [
  'E-commerce XYZ', 'Loja ABC', 'Tech Store', 'Fashion Online', 'SaaS Cloud',
  'Educação Plus', 'Marketplace Pro', 'Saúde Total', 'Games Universe', 'Viagens Online',
  'Fintech Pay', 'Serviços Express',
];

const ACTION_TYPES = [
  { type: 'merchant.block', label: 'Bloqueio de Merchant', severity: 'high', tone: 'destructive' },
  { type: 'merchant.unblock', label: 'Desbloqueio de Merchant', severity: 'medium', tone: 'warning' },
  { type: 'merchant.suspend', label: 'Suspensão de Merchant', severity: 'high', tone: 'destructive' },
  { type: 'subseller.cancel', label: 'Cancelamento de Subseller', severity: 'medium', tone: 'destructive' },
  { type: 'fee_plan.bulk_change', label: 'Alteração de plano em massa', severity: 'high', tone: 'warning' },
  { type: 'manual_adjustment.apply', label: 'Ajuste manual financeiro', severity: 'high', tone: 'destructive' },
  { type: 'withdrawal.reject', label: 'Rejeição de Saque', severity: 'medium', tone: 'warning' },
  { type: 'anticipation.cancel', label: 'Cancelamento de Antecipação', severity: 'medium', tone: 'warning' },
];

const CONFIRMED_VIA = ['timer_expired', 'manual_confirm', 'modal_close', 'post_reload_auto'];

const CNPJ_POOL = [
  '12.345.678/0001-90', '66.777.888/0001-88', '11.222.333/0001-44', '55.444.333/0001-22',
  '99.888.777/0001-66', '33.222.111/0001-55', '77.666.555/0001-44', '22.111.000/0001-33',
];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function buildHistoricalAction(idx) {
  const actor = rand(ACTORS);
  const at = rand(ACTION_TYPES);
  const merchant = rand(MERCHANTS);
  const cnpj = rand(CNPJ_POOL);

  // Distribuição: 70% confirmed · 25% cancelled · 5% errored
  const r = Math.random();
  let state, confirmed_via, duration_ms, cancelled_after_seconds, errored_reason;
  if (r < 0.05) {
    state = 'errored';
    errored_reason = 'API timeout';
    duration_ms = 60000 + randInt(0, 5000);
  } else if (r < 0.30) {
    state = 'cancelled';
    cancelled_after_seconds = randInt(3, 58);
  } else {
    state = 'confirmed';
    confirmed_via = rand(CONFIRMED_VIA);
    duration_ms = confirmed_via === 'manual_confirm'
      ? randInt(2000, 25000)
      : confirmed_via === 'timer_expired'
        ? 60000 + randInt(0, 800)
        : randInt(30000, 60000);
  }

  // Timestamps distribuídos nos últimos 14 dias
  const queuedAt = new Date(Date.now() - randInt(0, 14 * 24 * 60 * 60 * 1000));
  const finalAt = state === 'cancelled'
    ? new Date(queuedAt.getTime() + cancelled_after_seconds * 1000)
    : new Date(queuedAt.getTime() + (duration_ms || 60000));

  // Target summary específico por tipo
  let target_summary = `${merchant} (CNPJ ${cnpj})`;
  if (at.type === 'fee_plan.bulk_change') {
    const n = randInt(2, 8);
    target_summary = `${n} merchants — variação estimada R$ ${randInt(3, 12)}.${String(randInt(0, 999)).padStart(3, '0')}/mês`;
  } else if (at.type === 'manual_adjustment.apply') {
    target_summary = `Ajuste de R$ ${randInt(500, 12000).toLocaleString('pt-BR')} em ${merchant}`;
  } else if (at.type === 'withdrawal.reject') {
    target_summary = `Saque #W${queuedAt.getFullYear()}${String(queuedAt.getMonth() + 1).padStart(2, '0')}${randInt(1000, 9999)} — R$ ${randInt(800, 18000).toLocaleString('pt-BR')}`;
  } else if (at.type === 'anticipation.cancel') {
    target_summary = `Antecipação #A${randInt(10000, 99999)} — ${merchant}`;
  } else if (at.type === 'subseller.cancel') {
    target_summary = `Subseller "${['João Pereira', 'Lúcia Martins', 'Carlos Dias', 'Renata Souza'][idx % 4]}" (subseller de ${merchant})`;
  }

  return {
    event_id: `evt_${String(idx).padStart(4, '0')}`,
    action_id: `act_${String(idx).padStart(4, '0')}_${Math.random().toString(36).slice(2, 6)}`,
    action_type: at.type,
    action_label: at.label,
    target_summary,
    actor,
    queued_at: queuedAt.toISOString(),
    final_at: finalAt.toISOString(),
    duration_ms,
    cancelled_after_seconds,
    confirmed_via,
    errored_reason,
    severity: at.severity,
    tone: at.tone,
    state,
  };
}

export const mockUndoableActionsHistory = Array.from({ length: 50 }, (_, i) => buildHistoricalAction(i + 1))
  .sort((a, b) => new Date(b.queued_at) - new Date(a.queued_at));

export const mockPendingActionsQueue = [
  {
    action_id: 'act_pending_001',
    action_type: 'merchant.block',
    action_label: 'Bloqueio de Merchant',
    target_summary: 'Tech Store (CNPJ 11.222.333/0001-44)',
    actor: ACTORS[1],
    queued_at: new Date(Date.now() - 30000).toISOString(),
    scheduled_confirm_at: new Date(Date.now() + 30000).toISOString(),
    severity: 'high',
    tone: 'destructive',
    state: 'counting',
  },
  {
    action_id: 'act_pending_002',
    action_type: 'withdrawal.reject',
    action_label: 'Rejeição de Saque',
    target_summary: 'Saque #W20260517018 — R$ 12.500,00',
    actor: ACTORS[3],
    queued_at: new Date(Date.now() - 10000).toISOString(),
    scheduled_confirm_at: new Date(Date.now() + 50000).toISOString(),
    severity: 'medium',
    tone: 'warning',
    state: 'counting',
  },
];

// Snapshot de estatísticas (KPIs do header)
export const mockUndoStats = {
  total_today: mockUndoableActionsHistory.filter(a => {
    const d = new Date(a.queued_at);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length,
  confirmed_pct: Math.round(
    (mockUndoableActionsHistory.filter(a => a.state === 'confirmed').length / mockUndoableActionsHistory.length) * 100
  ),
  cancelled_pct: Math.round(
    (mockUndoableActionsHistory.filter(a => a.state === 'cancelled').length / mockUndoableActionsHistory.length) * 100
  ),
  pending_now: mockPendingActionsQueue.length,
};