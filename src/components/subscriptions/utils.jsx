import { differenceInDays, differenceInMonths } from 'date-fns';

export const fmtCurrency = (value, opts = {}) => {
  const v = value || 0;
  if (opts.short) {
    if (Math.abs(v) >= 1000000) return `R$ ${(v / 1000000).toFixed(1)}M`;
    if (Math.abs(v) >= 1000) return `R$ ${(v / 1000).toFixed(1)}k`;
    return `R$ ${v.toFixed(0)}`;
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: opts.precise ? 2 : 0,
    maximumFractionDigits: opts.precise ? 2 : 0,
  }).format(v);
};

export const subscriptionAge = (sub) => {
  if (!sub.start_date) return null;
  const months = differenceInMonths(new Date(), new Date(sub.start_date));
  if (months < 1) return { months, bucket: 'new', label: 'Novo' };
  if (months < 3) return { months, bucket: 'recent', label: `${months}m` };
  if (months < 12) return { months, bucket: 'mature', label: `${months}m` };
  return { months, bucket: 'veteran', label: `${(months / 12).toFixed(1)}a` };
};

export const subscriptionOrigin = (sub) => sub.origin || 'Direto';

export const inferCohort = (sub) => {
  if (!sub.start_date) return '—';
  const d = new Date(sub.start_date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const nextDunningAction = (sub) => {
  if (sub.status !== 'delinquent') return null;
  const attempts = sub.failed_attempts || 0;
  if (attempts >= 4) return { label: 'Cancelar', urgency: 'critical' };
  if (attempts === 3) return { label: 'Última chance', urgency: 'critical' };
  if (attempts === 2) return { label: 'WhatsApp', urgency: 'high' };
  if (attempts === 1) return { label: 'Retry D+3', urgency: 'medium' };
  return { label: 'Retry D+1', urgency: 'low' };
};

export const calcHealthScore = (sub) => {
  let score = 100;
  if (sub.status === 'delinquent') score -= 40;
  if (sub.status === 'paused') score -= 20;
  if (sub.status === 'cancelled') score = 0;
  if (sub.failed_attempts > 0) score -= sub.failed_attempts * 10;
  if (sub.engagement_score !== undefined && sub.engagement_score < 30) score -= 15;
  if (sub.card_expiry) {
    try {
      const daysToExpiry = differenceInDays(new Date(sub.card_expiry), new Date());
      if (daysToExpiry < 30 && daysToExpiry >= 0) score -= 10;
      if (daysToExpiry < 0) score -= 25;
    } catch {}
  }
  return Math.max(0, Math.min(100, score));
};

export const buildMRRMovement = (period = '6m') => {
  const months = period === '3m' ? 3 : period === '12m' ? 12 : 6;
  const labels = ['Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'];
  return Array.from({ length: months }).map((_, i) => {
    const newBiz = 4500 + Math.random() * 2000;
    const expansion = 1800 + Math.random() * 800;
    const reactivation = 400 + Math.random() * 300;
    const contraction = -(800 + Math.random() * 400);
    const voluntaryChurn = -(1500 + Math.random() * 700);
    const involuntaryChurn = -(900 + Math.random() * 500);
    return {
      month: labels[i],
      newBiz: Math.round(newBiz),
      expansion: Math.round(expansion),
      reactivation: Math.round(reactivation),
      contraction: Math.round(contraction),
      voluntaryChurn: Math.round(voluntaryChurn),
      involuntaryChurn: Math.round(involuntaryChurn),
      netNewMRR: Math.round(newBiz + expansion + reactivation + contraction + voluntaryChurn + involuntaryChurn),
    };
  });
};

export const calcSaasMetrics = (movement) => {
  const last = movement[movement.length - 1] || {};
  const newAndExp = (last.newBiz || 0) + (last.expansion || 0);
  const churn = Math.abs((last.voluntaryChurn || 0) + (last.involuntaryChurn || 0));
  const mrr = 79539;
  const arr = mrr * 12;
  const churnRate = (churn / mrr) * 100;
  const arpu = mrr / 245;
  return {
    mrr,
    arr,
    netNewMRR: last.netNewMRR || 0,
    arpu,
    quickRatio: churn > 0 ? newAndExp / churn : newAndExp,
    nrr: 108.4,
    grr: 92.1,
    payback: 8.2,
    ltv: arpu / (churnRate / 100),
    cac: 320,
    magicNumber: 1.32,
    churnRate,
  };
};