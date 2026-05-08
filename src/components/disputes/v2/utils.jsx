import { differenceInHours, differenceInDays } from 'date-fns';

export const fmtBRL = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export const fmtBRLShort = (v) => {
  const n = v || 0;
  if (Math.abs(n) >= 1_000_000) return `R$ ${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `R$ ${(n / 1_000).toFixed(1)}k`;
  return `R$ ${n.toFixed(0)}`;
};

// Categoriza item da fila unificada (precb / cb / med) por urgência
export const computeUrgency = (item) => {
  const deadline = item.alert_deadline || item.deadline_date || item.deadline_at;
  if (!deadline) return { level: 'low', label: 'Sem prazo', color: 'slate' };

  const d = new Date(deadline);
  const now = new Date();
  const hours = differenceInHours(d, now);
  const days = differenceInDays(d, now);

  // MED: prazo em horas (8h)
  if (item._channel === 'med') {
    if (hours < 0) return { level: 'expired', label: 'Expirado', color: 'slate' };
    if (hours <= 2) return { level: 'critical', label: `${hours}h`, color: 'red' };
    if (hours <= 4) return { level: 'high', label: `${hours}h`, color: 'orange' };
    return { level: 'medium', label: `${hours}h`, color: 'amber' };
  }

  // PreCB: <24h crítico
  if (item._channel === 'precb') {
    if (hours < 0) return { level: 'expired', label: 'Expirado', color: 'slate' };
    if (hours < 24) return { level: 'critical', label: `${hours}h`, color: 'red' };
    if (days <= 3) return { level: 'high', label: `${days}d`, color: 'orange' };
    return { level: 'medium', label: `${days}d`, color: 'emerald' };
  }

  // CB: <48h crítico
  if (days < 0) return { level: 'expired', label: 'Expirado', color: 'slate' };
  if (days <= 2) return { level: 'critical', label: `${days}d`, color: 'red' };
  if (days <= 7) return { level: 'high', label: `${days}d`, color: 'amber' };
  return { level: 'medium', label: `${days}d`, color: 'emerald' };
};

export const channelLabel = (ch) => {
  if (ch === 'precb') return 'Pre-CB';
  if (ch === 'cb') return 'CB';
  if (ch === 'med') return 'MED';
  return ch;
};

export const channelColor = (ch) => {
  if (ch === 'precb') return 'bg-orange-100 text-orange-700 border-orange-200';
  if (ch === 'cb') return 'bg-red-100 text-red-700 border-red-200';
  if (ch === 'med') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

// Score IA mock para PreCB (deveria vir do backend; gera determinístico por id)
export const aiScoreForPrecb = (item) => {
  const seed = (item.id || '').split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const score = (seed * 13) % 100;
  let recommended = 'review';
  if (score >= 70) recommended = 'refund';
  else if (score <= 25) recommended = 'ignore';
  return { score, recommended };
};

export const recommendedActionLabel = (action) => {
  if (action === 'refund') return { label: 'Reembolsar', color: 'bg-emerald-100 text-emerald-700' };
  if (action === 'ignore') return { label: 'Ignorar', color: 'bg-slate-100 text-slate-600' };
  if (action === 'review') return { label: 'Revisar', color: 'bg-amber-100 text-amber-700' };
  if (action === 'contest') return { label: 'Contestar', color: 'bg-purple-100 text-purple-700' };
  if (action === 'accept') return { label: 'Aceitar', color: 'bg-slate-100 text-slate-600' };
  return { label: action, color: 'bg-slate-100 text-slate-600' };
};

// Win prob explainability mock (decompõe % em fatores)
export const explainWinProb = (dispute) => {
  const p = dispute.win_probability || 0;
  const factors = [];

  // Fatores positivos/negativos com base em mock + reason
  if (p >= 50) factors.push({ label: '3DS authenticated', impact: '+15pp', positive: true });
  if (p >= 40) factors.push({ label: 'Tracking de entrega disponível', impact: '+12pp', positive: true });
  if (p >= 35) factors.push({ label: 'Cliente com histórico (2+ compras)', impact: '+8pp', positive: true });
  if (dispute.reason_code === '4855' || dispute.reason_category === 'consumer')
    factors.push({ label: `Reason ${dispute.reason_code || 'consumer'} historicamente difícil`, impact: '-10pp', positive: false });
  if (dispute.opened_date) {
    const ageDays = differenceInDays(new Date(), new Date(dispute.opened_date));
    if (ageDays > 14) factors.push({ label: `Idade da CB ${ageDays}d`, impact: `-${Math.min(15, Math.floor(ageDays / 4))}pp`, positive: false });
  }
  if (dispute.is_fraud) factors.push({ label: 'Fraude confirmada', impact: '-20pp', positive: false });

  return { probability: p, factors };
};

// Evidence pack por reason code
export const evidencePackForReason = (reasonCode = '', reasonCategory = '') => {
  const code = String(reasonCode);
  if (code.startsWith('4855') || reasonCategory === 'consumer') {
    return [
      { label: 'Log de autenticação 3DS', required: true },
      { label: 'IP / device fingerprint da transação', required: true },
      { label: 'Comprovante de entrega assinado', required: true },
      { label: 'Histórico de comunicação com cliente', required: false },
      { label: 'Política de termos aceita', required: false },
    ];
  }
  if (code.startsWith('4863') || reasonCategory === 'authorization') {
    return [
      { label: 'Authorization log da bandeira', required: true },
      { label: 'AVS / CVV match', required: true },
      { label: 'Tracking de entrega', required: false },
    ];
  }
  if (reasonCategory === 'fraud') {
    return [
      { label: 'Log 3DS com CAVV/ECI', required: true },
      { label: 'Device fingerprint', required: true },
      { label: 'Geo IP match', required: true },
      { label: 'Histórico de risco do cliente', required: false },
    ];
  }
  return [
    { label: 'Comprovante da transação', required: true },
    { label: 'Comunicação com cliente', required: true },
    { label: 'Política de termos', required: false },
  ];
};