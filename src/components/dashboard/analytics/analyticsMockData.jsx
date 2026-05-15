/**
 * Mock dataset central — alimenta as abas Cartão / PIX / Analytics Avançado.
 * Como a entidade Transaction está vazia na DEV/PROD, estes dados representam
 * uma operação realista para o cliente ver valor imediato no dashboard.
 */

// =========== CARTÃO ===========
export const CARD_KPIS = {
  approvalRate: 87.4,
  approvalRateChange: 1.8,
  approvalRateTarget: 90,
  totalAttempts: 14820,
  totalApproved: 12956,
  totalDeclined: 1864,
  avgTicket: 142.8,
  avgTicketChange: 3.2,
  totalVolume: 1850390,
  totalVolumeChange: 12.1,
  chargebackRate: 0.42,
  chargebackRateChange: -0.08,
  fraudRate: 0.18,
  fraudRateChange: -0.03,
  retryRecovered: 1280,
  retryRecoveredRate: 23.8,
  threeDsUsage: 38.2,
  threeDsLiftPp: 6.4,
};

export const CARD_BRANDS = [
  { brand: 'visa',       label: 'Visa',        approvalRate: 89.2, count: 6240, approved: 5566, declined: 674, volume: 820440, share: 42.1, debit: 28, credit: 72 },
  { brand: 'mastercard', label: 'Mastercard',  approvalRate: 88.1, count: 5108, approved: 4500, declined: 608, volume: 690220, share: 34.5, debit: 31, credit: 69 },
  { brand: 'elo',        label: 'Elo',         approvalRate: 82.4, count: 1620, approved: 1335, declined: 285, volume: 196300, share: 10.9, debit: 22, credit: 78 },
  { brand: 'amex',       label: 'Amex',        approvalRate: 91.6, count: 980,  approved: 898,  declined: 82,  volume: 138420, share: 6.6,  debit: 0,  credit: 100 },
  { brand: 'hipercard',  label: 'Hipercard',   approvalRate: 78.3, count: 510,  approved: 399,  declined: 111, volume: 38260,  share: 3.4,  debit: 12, credit: 88 },
  { brand: 'other',      label: 'Outras',      approvalRate: 71.8, count: 362,  approved: 260,  declined: 102, volume: 21750,  share: 2.5,  debit: 18, credit: 82 },
];

export const CARD_INSTALLMENTS = [
  { label: 'À Vista (1x)', range: '1x',     count: 7820, approvalRate: 90.1, volume: 920400, share: 52.8, mdr: 2.99 },
  { label: '2x – 3x',      range: '2-3x',   count: 2940, approvalRate: 88.3, volume: 412600, share: 19.8, mdr: 3.49 },
  { label: '4x – 6x',      range: '4-6x',   count: 2180, approvalRate: 86.2, volume: 322880, share: 14.7, mdr: 3.89 },
  { label: '7x – 10x',     range: '7-10x',  count: 1180, approvalRate: 82.7, volume: 124220, share: 8.0,  mdr: 4.29 },
  { label: '11x – 12x',    range: '11-12x', count: 700,  approvalRate: 79.4, volume: 70290,  share: 4.7,  mdr: 4.59 },
];

export const CARD_VALUE_RANGES = [
  { label: 'Até R$ 50',        approvalRate: 92.1, count: 4280, declineMain: 'card_declined', avg: 28 },
  { label: 'R$ 50 – R$ 200',   approvalRate: 89.8, count: 5120, declineMain: 'insufficient_funds', avg: 118 },
  { label: 'R$ 200 – R$ 500',  approvalRate: 87.5, count: 3140, declineMain: 'do_not_honor', avg: 312 },
  { label: 'R$ 500 – R$ 1k',   approvalRate: 83.2, count: 1480, declineMain: 'antifraud_high', avg: 720 },
  { label: 'R$ 1k – R$ 5k',    approvalRate: 76.4, count: 620,  declineMain: 'antifraud_high', avg: 1980 },
  { label: 'Acima de R$ 5k',   approvalRate: 68.9, count: 180,  declineMain: '3ds_failed',  avg: 8420 },
];

export const CARD_DECLINE_REASONS = [
  { code: '51', reason: 'Saldo insuficiente',       count: 612, share: 32.8, recoverable: true,  action: 'retry_24h' },
  { code: '05', reason: 'Não autorizada',           count: 384, share: 20.6, recoverable: false, action: 'contact_customer' },
  { code: '14', reason: 'Cartão inválido',          count: 228, share: 12.2, recoverable: false, action: 'update_card' },
  { code: '54', reason: 'Cartão expirado',          count: 186, share: 10.0, recoverable: true,  action: 'updater_visa' },
  { code: '57', reason: 'Não permitida ao portador', count: 142, share: 7.6,  recoverable: false, action: 'review_mcc' },
  { code: 'FR', reason: 'Suspeita de fraude',       count: 134, share: 7.2,  recoverable: false, action: 'antifraud_review' },
  { code: '91', reason: 'Emissor indisponível',     count: 98,  share: 5.3,  recoverable: true,  action: 'retry_smart' },
  { code: '12', reason: 'Transação inválida',       count: 80,  share: 4.3,  recoverable: true,  action: 'fix_payload' },
];

export const CARD_ISSUER_PERFORMANCE = [
  { issuer: 'Itaú',         approvalRate: 91.2, count: 3120, retryLift: 8.4 },
  { issuer: 'Bradesco',     approvalRate: 88.7, count: 2640, retryLift: 6.2 },
  { issuer: 'Santander',    approvalRate: 89.1, count: 2240, retryLift: 5.8 },
  { issuer: 'Banco do Brasil', approvalRate: 86.4, count: 1820, retryLift: 9.1 },
  { issuer: 'Caixa',        approvalRate: 82.3, count: 1480, retryLift: 11.2 },
  { issuer: 'Nubank',       approvalRate: 93.6, count: 2980, retryLift: 3.4 },
  { issuer: 'Inter',        approvalRate: 90.8, count: 1240, retryLift: 4.7 },
  { issuer: 'C6',           approvalRate: 87.9, count: 680,  retryLift: 7.1 },
];

export const CARD_HOURLY_APPROVAL = [
  // 0-23h, taxa de aprovação por hora
  { hour: '00', rate: 82.1, volume: 18 }, { hour: '01', rate: 80.4, volume: 12 },
  { hour: '02', rate: 78.9, volume: 8 },  { hour: '03', rate: 79.2, volume: 6 },
  { hour: '04', rate: 81.6, volume: 7 },  { hour: '05', rate: 84.3, volume: 11 },
  { hour: '06', rate: 86.8, volume: 28 }, { hour: '07', rate: 87.9, volume: 64 },
  { hour: '08', rate: 88.4, volume: 142 }, { hour: '09', rate: 88.9, volume: 218 },
  { hour: '10', rate: 89.2, volume: 286 }, { hour: '11', rate: 89.1, volume: 312 },
  { hour: '12', rate: 88.6, volume: 348 }, { hour: '13', rate: 88.9, volume: 332 },
  { hour: '14', rate: 89.4, volume: 298 }, { hour: '15', rate: 89.1, volume: 286 },
  { hour: '16', rate: 88.8, volume: 312 }, { hour: '17', rate: 88.4, volume: 348 },
  { hour: '18', rate: 87.9, volume: 412 }, { hour: '19', rate: 87.6, volume: 482 },
  { hour: '20', rate: 86.8, volume: 524 }, { hour: '21', rate: 86.2, volume: 468 },
  { hour: '22', rate: 84.9, volume: 318 }, { hour: '23', rate: 83.4, volume: 142 },
];

export const CARD_RETRY_FUNNEL = {
  declined: 1864,
  eligibleForRetry: 1240,
  retried: 1180,
  recovered: 280,
  recoveredVolume: 39820,
  avgAttempts: 1.8,
};

// =========== PIX ===========
export const PIX_KPIS = {
  conversionRate: 72.8,
  conversionRateChange: 3.4,
  totalGenerated: 8420,
  totalPaid: 6130,
  totalPending: 1284,
  totalExpired: 1006,
  avgPaymentTime: '1min 47s',
  medianPaymentTime: '52s',
  avgTicket: 86.4,
  totalVolume: 529620,
  refundRate: 0.31,
  manualVsAuto: { manual: 72, automatic: 18, biometric: 10 },
};

export const PIX_FLOW_DISTRIBUTION = [
  { flow: 'manual',     label: 'PIX Manual (QR/Copia-Cola)', share: 72.0, conversion: 68.4, avgTime: '2min 18s', volume: 381300 },
  { flow: 'automatic',  label: 'PIX Automático (Recorrente)', share: 18.0, conversion: 94.2, avgTime: '8s',       volume: 95330  },
  { flow: 'biometric',  label: 'PIX Biometria (Open Finance)', share: 10.0, conversion: 96.8, avgTime: '12s',      volume: 52990  },
];

export const PIX_TIMING_BUCKETS = [
  { label: '< 30s',    share: 28.2, count: 1729, color: 'emerald' },
  { label: '30s – 1min', share: 22.4, count: 1373, color: 'emerald' },
  { label: '1 – 5 min',  share: 31.8, count: 1949, color: 'blue' },
  { label: '5 – 15 min', share: 11.2, count: 686,  color: 'yellow' },
  { label: '15 – 60 min', share: 4.8,  share2: 4.8, count: 294, color: 'amber' },
  { label: '> 60 min',   share: 1.6,  count: 99,   color: 'red' },
];

export const PIX_BANK_DISTRIBUTION = [
  { bank: 'Nubank',         share: 28.4, conversion: 78.2, volume: 150460 },
  { bank: 'Itaú',           share: 18.6, conversion: 74.1, volume: 98510 },
  { bank: 'Bradesco',       share: 14.2, conversion: 71.8, volume: 75210 },
  { bank: 'Banco do Brasil', share: 11.8, conversion: 69.4, volume: 62500 },
  { bank: 'Caixa',          share: 9.4,  conversion: 66.2, volume: 49780 },
  { bank: 'Santander',      share: 7.2,  conversion: 72.6, volume: 38130 },
  { bank: 'Inter',          share: 5.8,  conversion: 81.4, volume: 30720 },
  { bank: 'Outros',         share: 4.6,  conversion: 68.0, volume: 24370 },
];

export const PIX_VALUE_RANGES = [
  { label: 'Até R$ 50',       conversion: 78.4, count: 2840, volume: 92420, expired: 14.2 },
  { label: 'R$ 50 – R$ 200',  conversion: 75.1, count: 2380, volume: 174240, expired: 16.8 },
  { label: 'R$ 200 – R$ 500', conversion: 71.8, count: 1640, volume: 168320, expired: 19.4 },
  { label: 'R$ 500 – R$ 1k',  conversion: 68.2, count: 920,  volume: 84960,  expired: 22.1 },
  { label: 'R$ 1k – R$ 5k',   conversion: 62.4, count: 480,  volume: 84200,  expired: 28.6 },
  { label: 'Acima de R$ 5k',  conversion: 54.8, count: 160,  volume: 124000, expired: 36.4 },
];

export const PIX_MANDATES = {
  active: 1240,
  expiringSoon: 84,
  revoked: 36,
  failureRate: 2.4,
  monthlyRecurringVolume: 187420,
};

export const PIX_REFUND_REASONS = [
  { reason: 'Devolução solicitada pelo cliente', count: 38, share: 42.2 },
  { reason: 'Pagamento duplicado',                count: 18, share: 20.0 },
  { reason: 'Cancelamento de pedido',             count: 16, share: 17.8 },
  { reason: 'Erro de valor',                      count: 10, share: 11.1 },
  { reason: 'MED (Mecanismo Especial de Devolução)', count: 8, share: 8.9 },
];

export const PIX_HOURLY_CONVERSION = [
  { hour: '00', rate: 64.2, volume: 32 }, { hour: '01', rate: 61.8, volume: 24 },
  { hour: '02', rate: 58.4, volume: 18 }, { hour: '03', rate: 56.1, volume: 14 },
  { hour: '04', rate: 59.7, volume: 16 }, { hour: '05', rate: 64.8, volume: 28 },
  { hour: '06', rate: 70.2, volume: 64 }, { hour: '07', rate: 72.8, volume: 128 },
  { hour: '08', rate: 74.6, volume: 286 }, { hour: '09', rate: 75.4, volume: 364 },
  { hour: '10', rate: 76.1, volume: 412 }, { hour: '11', rate: 76.8, volume: 438 },
  { hour: '12', rate: 75.2, volume: 482 }, { hour: '13', rate: 75.9, volume: 468 },
  { hour: '14', rate: 76.4, volume: 442 }, { hour: '15', rate: 76.2, volume: 428 },
  { hour: '16', rate: 75.8, volume: 462 }, { hour: '17', rate: 75.1, volume: 498 },
  { hour: '18', rate: 73.4, volume: 542 }, { hour: '19', rate: 72.8, volume: 612 },
  { hour: '20', rate: 71.2, volume: 648 }, { hour: '21', rate: 70.4, volume: 582 },
  { hour: '22', rate: 68.6, volume: 412 }, { hour: '23', rate: 66.2, volume: 198 },
];

// =========== ANALYTICS AVANÇADO ===========
export const COHORT_DATA = [
  // Cohort de retenção mensal de clientes (M0 a M5)
  { cohort: 'Dez/25', size: 1240, m0: 100, m1: 64, m2: 48, m3: 39, m4: 34, m5: 30 },
  { cohort: 'Jan/26', size: 1420, m0: 100, m1: 68, m2: 51, m3: 42, m4: 36, m5: null },
  { cohort: 'Fev/26', size: 1380, m0: 100, m1: 71, m2: 54, m3: 44, m4: null, m5: null },
  { cohort: 'Mar/26', size: 1520, m0: 100, m1: 72, m2: 56, m3: null, m4: null, m5: null },
  { cohort: 'Abr/26', size: 1680, m0: 100, m1: 74, m2: null, m3: null, m4: null, m5: null },
  { cohort: 'Mai/26', size: 1820, m0: 100, m1: null, m2: null, m3: null, m4: null, m5: null },
];

export const HOURLY_WEEKDAY_HEATMAP = (() => {
  // 7 dias × 24 horas com taxa de aprovação simulada
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const data = [];
  days.forEach((day, di) => {
    for (let h = 0; h < 24; h++) {
      // Padrão realista: melhor durante dia útil, pior madrugada
      const base = di === 0 || di === 6 ? 82 : 86;
      const hourPenalty = h < 6 ? -8 : h > 22 ? -5 : h > 18 ? -2 : 0;
      const peak = h >= 19 && h <= 21 ? 3 : 0;
      const rate = base + hourPenalty + peak + (Math.sin(h * 0.5 + di) * 2);
      const volume = h < 6 ? 12 + Math.floor(Math.random() * 20) : 80 + Math.floor(Math.random() * 280);
      data.push({ day, hour: h, rate: Math.max(60, Math.min(96, rate)), volume });
    }
  });
  return data;
})();

export const TOP_BINS = [
  { bin: '516292', issuer: 'Nubank',    brand: 'Mastercard', tier: 'Platinum', approvalRate: 94.8, count: 1240, country: 'BR' },
  { bin: '498412', issuer: 'Itaú',      brand: 'Visa',       tier: 'Black',    approvalRate: 92.4, count: 980,  country: 'BR' },
  { bin: '552020', issuer: 'Bradesco',  brand: 'Mastercard', tier: 'Gold',     approvalRate: 91.2, count: 820,  country: 'BR' },
  { bin: '438540', issuer: 'Santander', brand: 'Visa',       tier: 'Platinum', approvalRate: 89.6, count: 720,  country: 'BR' },
  { bin: '627780', issuer: 'Caixa',     brand: 'Elo',        tier: 'Standard', approvalRate: 82.1, count: 640,  country: 'BR' },
  { bin: '516309', issuer: 'Inter',     brand: 'Mastercard', tier: 'Gold',     approvalRate: 93.1, count: 580,  country: 'BR' },
  { bin: '479073', issuer: 'BB',        brand: 'Visa',       tier: 'Gold',     approvalRate: 87.4, count: 540,  country: 'BR' },
  { bin: '378282', issuer: 'Amex BR',   brand: 'Amex',       tier: 'Platinum', approvalRate: 95.2, count: 420,  country: 'BR' },
];

export const CHARGEBACK_DISTRIBUTION = [
  { reason: 'Fraude (4837)',         count: 28, share: 38.4, recoveryRate: 12 },
  { reason: 'Não reconhece (4863)',   count: 18, share: 24.7, recoveryRate: 22 },
  { reason: 'Serviço não prestado',   count: 12, share: 16.4, recoveryRate: 48 },
  { reason: 'Produto não recebido',   count: 9,  share: 12.3, recoveryRate: 52 },
  { reason: 'Duplicidade',            count: 4,  share: 5.5,  recoveryRate: 78 },
  { reason: 'Outros',                 count: 2,  share: 2.7,  recoveryRate: 30 },
];

export const FRAUD_INSIGHTS = {
  fraudRate: 0.18,
  fraudRateChange: -0.03,
  flagged: 142,
  trueFraud: 26,
  falsePositives: 28,
  falseNegatives: 4,
  preventedLossBRL: 38420,
  topCountries: [
    { country: '🇧🇷 Brasil',  count: 18420, fraudRate: 0.14 },
    { country: '🇵🇾 Paraguai', count: 240, fraudRate: 4.2 },
    { country: '🇺🇸 EUA',     count: 180, fraudRate: 1.8 },
    { country: '🇦🇷 Argentina', count: 96, fraudRate: 2.4 },
  ],
};

export const DISPUTE_DEFENSE = {
  totalOpen: 28,
  totalWon: 14,
  totalLost: 8,
  totalPending: 6,
  winRate: 63.6,
  winRateChange: 4.2,
  avgEvidenceTime: '2h 14m',
  amountAtRisk: 38920,
  amountRecovered: 19420,
};