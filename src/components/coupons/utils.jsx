// Utilitários compartilhados entre as telas de Cupons

export const calcCouponHealth = (coupon) => {
  // Score 0-100 baseado em conversão / uso / ROI
  const conv = coupon.times_used > 0 && coupon.views_count > 0
    ? (coupon.times_used / coupon.views_count) * 100
    : (coupon.times_used > 0 ? 50 : 0);
  const roi = coupon.total_discount_given > 0
    ? (coupon.total_revenue_generated / coupon.total_discount_given)
    : 0;
  const usageRate = coupon.usage_limit_total
    ? (coupon.times_used / coupon.usage_limit_total) * 100
    : (coupon.times_used > 5 ? 80 : 30);

  let score = 50;
  if (roi >= 10) score += 25;
  else if (roi >= 5) score += 15;
  else if (roi >= 2) score += 5;
  if (conv >= 20) score += 15;
  else if (conv >= 10) score += 8;
  if (usageRate >= 50) score += 10;
  else if (usageRate >= 20) score += 5;

  score = Math.min(100, Math.max(0, score));

  let status = 'good';
  let label = 'Saudável';
  if (score < 40) {
    status = 'bad';
    label = 'Problema';
  } else if (score < 70) {
    status = 'warn';
    label = 'Atenção';
  }
  return { score, status, label };
};

export const calcRoi = (coupon) => {
  if (!coupon.total_discount_given || coupon.total_discount_given === 0) return 0;
  return (coupon.total_revenue_generated / coupon.total_discount_given);
};

export const calcConversion = (coupon) => {
  // Mock: views_count fictício baseado em times_used
  const views = coupon.views_count || (coupon.times_used * 4 + 50);
  if (!views) return 0;
  return (coupon.times_used / views) * 100;
};

export const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return diff;
};

export const timeSinceUse = (coupon) => {
  if (!coupon.times_used || coupon.times_used === 0) return 'Nunca';
  // Mock baseado em volume
  if (coupon.times_used > 200) return 'há 8 min';
  if (coupon.times_used > 50) return 'há 2h';
  if (coupon.times_used > 10) return 'há 1 dia';
  return 'há 5 dias';
};

export const expiryBadge = (coupon) => {
  if (!coupon.end_date) return { label: 'Sem validade', color: 'bg-slate-100 text-slate-600' };
  const days = daysUntil(coupon.end_date);
  if (days < 0) return { label: `Expirou há ${Math.abs(days)}d`, color: 'bg-slate-100 text-slate-500' };
  if (days === 0) return { label: 'Expira hoje', color: 'bg-red-100 text-red-700' };
  if (days <= 3) return { label: `${days}d restantes`, color: 'bg-red-100 text-red-700' };
  if (days <= 7) return { label: `${days}d restantes`, color: 'bg-amber-100 text-amber-700' };
  if (days <= 30) return { label: `${days}d restantes`, color: 'bg-emerald-100 text-emerald-700' };
  return { label: `${days}d restantes`, color: 'bg-slate-100 text-slate-600' };
};

// Audiência fictícia para coluna nova
export const inferAudience = (coupon) => {
  if (coupon.is_nominal) return 'Nominal';
  if (coupon.code?.toLowerCase().includes('bemvindo') || coupon.code?.toLowerCase().includes('first')) return 'Novos';
  if (coupon.code?.toLowerCase().includes('vip') || coupon.code?.toLowerCase().includes('premium')) return 'VIPs';
  if (coupon.code?.toLowerCase().includes('flash') || coupon.code?.toLowerCase().includes('promo')) return 'Geral';
  if (coupon.code?.toLowerCase().includes('parceiro') || coupon.code?.toLowerCase().includes('aff')) return 'Afiliados';
  return 'Geral';
};

export const formatBRL = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);