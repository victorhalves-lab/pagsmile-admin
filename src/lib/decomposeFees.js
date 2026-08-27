/**
 * decomposeFees(transaction)
 * Decompõe o custo total de taxas de uma transação em componentes individuais
 * (MDR, antecipação, taxa fixa de transação, antifraude, 3DS).
 *
 * Quando o registro possui `fee_amount` autoritativo, ele âncora o total e os
 * componentes estimados são escalados proporcionalmente para reconciliar.
 * Quando não há, os componentes são estimados a partir de taxas de mercado.
 *
 * Retorna valores em R$ (exceto taxas percentuais).
 */

const MARKET_RATES = {
  pix_credit: 0.0099,      // 0,99%
  debit: 0.0199,           // 1,99%
  card_1x: 0.0349,         // 3,49%
  card_2_6x: 0.0499,       // 4,99%
  card_7_12x: 0.0599,      // 5,99%
  anticipation: 0.0399,    // 3,99% a.a. sobre saldo antecipado
  transaction_fee: 0.40,   // R$ por transação
  antifraud_fee: 0.20,    // R$ por análise
  threeds_fee: 0.10,       // R$ por autenticação
};

export function decomposeFees(tx) {
  const amount = tx?.amount || 0;
  const method = tx?.method || tx?.type || 'credit_card';
  const installments = tx?.installments || 1;
  const isCard = method === 'credit_card' || method === 'debit_card' || method === 'card';
  const isDebit = method === 'debit_card' || method === 'debit';
  const isPix = method === 'pix';

  // --- MDR estimado ---
  let mdrRate = 0;
  if (isPix) {
    mdrRate = MARKET_RATES.pix_credit;
  } else if (isDebit) {
    mdrRate = MARKET_RATES.debit;
  } else if (isCard) {
    if (installments <= 1) mdrRate = MARKET_RATES.card_1x;
    else if (installments <= 6) mdrRate = MARKET_RATES.card_2_6x;
    else mdrRate = MARKET_RATES.card_7_12x;
  }
  let mdr = amount * mdrRate;

  // --- Antecipação (apenas cartão parcelado) ---
  let anticipation = 0;
  let anticipationRate = 0;
  if (isCard && installments > 1) {
    anticipationRate = MARKET_RATES.anticipation * ((installments - 1) / 12);
    anticipation = amount * anticipationRate;
  }

  // --- Taxa fixa de transação ---
  let transactionFee = MARKET_RATES.transaction_fee;

  // --- Antifraude (se houve análise) ---
  const hasAntifraud = !!tx?.antifraud_data || !!tx?.antifraud_status || !!tx?.antifraud_data?.status;
  let antifraudFee = hasAntifraud ? MARKET_RATES.antifraud_fee : 0;

  // --- 3DS (se autenticado) ---
  const has3ds =
    tx?.three_ds_data?.status === 'authenticated' ||
    tx?.threeds_authenticated === true ||
    tx?.three_ds_data?.eci === '05';
  let threeDsFee = has3ds ? MARKET_RATES.threeds_fee : 0;

  // --- Total estimado ---
  const estimatedTotal = mdr + anticipation + transactionFee + antifraudFee + threeDsFee;

  // --- Âncora: se o registro tem fee_amount autoritativo, reconcilia proporcionalmente ---
  const authoritativeFee = tx?.fee_amount || tx?.mdr_amount || 0;
  let totalFees = estimatedTotal;
  let scale = 1;
  if (authoritativeFee > 0 && estimatedTotal > 0) {
    scale = authoritativeFee / estimatedTotal;
    mdr *= scale;
    anticipation *= scale;
    transactionFee *= scale;
    antifraudFee *= scale;
    threeDsFee *= scale;
    totalFees = authoritativeFee;
  }

  const netAfterFees = amount - totalFees;
  const effectiveRate = amount > 0 ? (totalFees / amount) * 100 : 0;

  return {
    mdr,
    mdrRate,
    mdrRatePct: mdrRate * 100,
    anticipation,
    anticipationRate,
    transactionFee,
    antifraudFee,
    threeDsFee,
    totalFees,
    netAfterFees,
    effectiveRate,
    isEstimated: authoritativeFee === 0,
    components: [
      { key: 'mdr', label: 'MDR', value: mdr, rate: mdrRate * 100 },
      { key: 'anticipation', label: 'Antecipação', value: anticipation, rate: anticipationRate * 100 },
      { key: 'transaction_fee', label: 'Taxa de Transação', value: transactionFee, fixed: true },
      { key: 'antifraud', label: 'Antifraude', value: antifraudFee, fixed: true },
      { key: 'threeds', label: '3DS', value: threeDsFee, fixed: true },
    ].filter(c => c.value > 0),
  };
}

export { MARKET_RATES };