/**
 * Calculadora unificada de MDR
 * Suporta:
 * - Cálculo automático baseado em MDR à vista + taxa de antecipação
 * - Override manual por faixa (1x, 2-6x, 7-12x)
 * - Override manual por parcela individual (1x, 2x, ..., 12x)
 * - Hierarquia de resolução: Merchant > MCC > Plano > Global
 */

export const BRANDS = [
  { code: 'visa', label: 'Visa' },
  { code: 'mastercard', label: 'Mastercard' },
  { code: 'elo', label: 'Elo' },
  { code: 'amex', label: 'Amex' },
  { code: 'hipercard', label: 'Hipercard' },
];

export const TIERS = [
  { code: '1x', label: '1x (à vista)', min: 1, max: 1 },
  { code: '2_6', label: '2x a 6x', min: 2, max: 6 },
  { code: '7_12', label: '7x a 12x', min: 7, max: 12 },
];

/**
 * Calcula a taxa parcelada automaticamente:
 * MDR_parcelado = MDR_avista + (taxa_antecipacao_mensal × meses_efetivos)
 * onde meses_efetivos é o prazo médio de recebimento adiantado.
 */
export function calculateAutoRate({ baseRate, anticipationRateMonthly, installments }) {
  if (installments <= 1) return baseRate;
  // Prazo médio de recebimento (D+30 por parcela)
  const prazoMedioDias = Math.round((30 + 30 * installments) / 2);
  const diasAntecipados = Math.max(0, prazoMedioDias - 1);
  const custoAntecipacao = (diasAntecipados / 30) * anticipationRateMonthly;
  return baseRate + custoAntecipacao;
}

/**
 * Calcula taxa para uma faixa inteira (média da faixa)
 */
export function calculateAutoRateForTier({ baseRate, anticipationRateMonthly, tier }) {
  if (tier === '1x') return baseRate;
  const tierConfig = TIERS.find(t => t.code === tier);
  if (!tierConfig) return baseRate;
  // Usa a parcela média da faixa
  const avgInstallments = Math.round((tierConfig.min + tierConfig.max) / 2);
  return calculateAutoRate({ baseRate, anticipationRateMonthly, installments: avgInstallments });
}

/**
 * Resolve qual taxa aplicar dada a hierarquia.
 * Prioridade: merchantOverride > mccOverride > planRate > globalRate
 */
export function resolveMdrRate({ merchantOverride, mccOverride, planRate, globalRate, brand, tier }) {
  const sources = [
    { rate: merchantOverride, source: 'merchant', label: 'Merchant' },
    { rate: mccOverride, source: 'mcc', label: 'MCC' },
    { rate: planRate, source: 'plan', label: 'Plano' },
    { rate: globalRate, source: 'global', label: 'Global' },
  ];

  for (const s of sources) {
    if (s.rate?.rates?.[brand]?.[tier] != null) {
      const cell = s.rate.rates[brand][tier];
      return {
        value: cell.value,
        mode: cell.mode || 'auto',
        source: s.source,
        sourceLabel: s.label,
        installmentOverrides: cell.installmentOverrides || null,
      };
    }
  }
  return { value: null, mode: 'auto', source: 'none', sourceLabel: 'Não definida', installmentOverrides: null };
}

/**
 * Cria estrutura vazia de tabela MDR
 */
export function createEmptyRateTable() {
  const rates = {};
  BRANDS.forEach(b => {
    rates[b.code] = {};
    TIERS.forEach(t => {
      rates[b.code][t.code] = { value: null, mode: 'auto', installmentOverrides: null };
    });
  });
  return rates;
}

/**
 * Cria tabela com valores default (para inicializar UI)
 */
export function createDefaultRateTable() {
  const defaults = {
    visa: { '1x': 2.99, '2_6': 3.49, '7_12': 3.99 },
    mastercard: { '1x': 2.99, '2_6': 3.49, '7_12': 3.99 },
    elo: { '1x': 3.19, '2_6': 3.69, '7_12': 4.19 },
    amex: { '1x': 3.49, '2_6': 3.99, '7_12': 4.49 },
    hipercard: { '1x': 3.29, '2_6': 3.79, '7_12': 4.29 },
  };
  const rates = {};
  BRANDS.forEach(b => {
    rates[b.code] = {};
    TIERS.forEach(t => {
      rates[b.code][t.code] = {
        value: defaults[b.code]?.[t.code] ?? 3.99,
        mode: 'manual',
        installmentOverrides: null,
      };
    });
  });
  return rates;
}