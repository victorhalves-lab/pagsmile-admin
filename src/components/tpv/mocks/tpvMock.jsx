// Mock data for TPV Analytics (Mentor API ORIGEM 198-199)

export const TPV_KPIS = {
  total_tpv: 1_847_523_000,
  net_tpv: 1_795_204_000,
  growth_vs_previous: 18.4,
  avg_ticket: 287.50,
  active_merchants: 8_421,
  approval_rate: 96.8,
  chargeback_rate: 0.12,
  total_transactions: 6_426_843,
  pareto_top20_concentration: 78.3,
  projected_eom: 2_120_400_000,
};

const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const TPV_TIMELINE = months.map((m, idx) => ({
  month: m,
  current: 120_000_000 + Math.random() * 80_000_000 + idx * 5_000_000,
  previous: 100_000_000 + Math.random() * 60_000_000 + idx * 3_000_000,
}));

export const TPV_BY_BRAND = [
  { name: 'Visa', value: 720_500_000, share: 39.0, ticket_avg: 312, approval: 97.1 },
  { name: 'Mastercard', value: 612_300_000, share: 33.1, ticket_avg: 295, approval: 96.5 },
  { name: 'Elo', value: 285_400_000, share: 15.4, ticket_avg: 218, approval: 95.8 },
  { name: 'Hipercard', value: 142_800_000, share: 7.7, ticket_avg: 187, approval: 94.2 },
  { name: 'Amex', value: 86_523_000, share: 4.7, ticket_avg: 425, approval: 98.3 },
];

export const TPV_BY_ACQUIRER = [
  { name: 'Cielo', value: 645_500_000, share: 35.0 },
  { name: 'Stone', value: 497_300_000, share: 26.9 },
  { name: 'Adyen', value: 369_500_000, share: 20.0 },
  { name: 'Rede', value: 224_300_000, share: 12.1 },
  { name: 'GetNet', value: 110_923_000, share: 6.0 },
];

export const TPV_BY_PAYMENT = [
  { name: 'Crédito à Vista', value: 738_500_000, share: 40.0 },
  { name: 'Crédito Parcelado', value: 461_800_000, share: 25.0 },
  { name: 'Débito', value: 295_400_000, share: 16.0 },
  { name: 'PIX', value: 277_100_000, share: 15.0 },
  { name: 'Voucher', value: 74_700_000, share: 4.0 },
];

export const TPV_TOP_MERCHANTS = [
  { rank: 1, name: 'Marketplace Ace', cnpj: '67.890.123/0001-45', tpv: 145_200_000, share: 7.86, growth: 24.3 },
  { rank: 2, name: 'TechShop SP', cnpj: '23.456.789/0001-01', tpv: 98_400_000, share: 5.33, growth: 18.7 },
  { rank: 3, name: 'Boutique Elegance', cnpj: '56.789.012/0001-34', tpv: 72_100_000, share: 3.90, growth: -5.2 },
  { rank: 4, name: 'Loja do Pedro', cnpj: '12.345.678/0001-90', tpv: 56_800_000, share: 3.07, growth: 32.1 },
  { rank: 5, name: 'Restaurante Bom Sabor', cnpj: '45.678.901/0001-23', tpv: 41_300_000, share: 2.24, growth: 12.8 },
  { rank: 6, name: 'Farmácia Saúde+', cnpj: '34.567.890/0001-12', tpv: 38_900_000, share: 2.10, growth: 8.4 },
  { rank: 7, name: 'EletroMaster', cnpj: '78.901.234/0001-56', tpv: 35_400_000, share: 1.92, growth: -2.1 },
  { rank: 8, name: 'Posto Combustível Sul', cnpj: '89.012.345/0001-67', tpv: 31_200_000, share: 1.69, growth: 4.6 },
  { rank: 9, name: 'PetShop Premium', cnpj: '90.123.456/0001-78', tpv: 28_700_000, share: 1.55, growth: 15.3 },
  { rank: 10, name: 'Academia FitMax', cnpj: '01.234.567/0001-89', tpv: 24_500_000, share: 1.33, growth: 22.7 },
];

export const TPV_BY_REGION = [
  { state: 'SP', tpv: 738_500_000, share: 40.0, merchants: 3_245 },
  { state: 'RJ', tpv: 295_400_000, share: 16.0, merchants: 1_124 },
  { state: 'MG', tpv: 184_500_000, share: 10.0, merchants: 942 },
  { state: 'RS', tpv: 147_800_000, share: 8.0, merchants: 681 },
  { state: 'PR', tpv: 129_300_000, share: 7.0, merchants: 612 },
  { state: 'BA', tpv: 92_400_000, share: 5.0, merchants: 489 },
  { state: 'SC', tpv: 86_500_000, share: 4.7, merchants: 421 },
  { state: 'PE', tpv: 64_200_000, share: 3.5, merchants: 345 },
  { state: 'CE', tpv: 51_800_000, share: 2.8, merchants: 287 },
  { state: 'GO', tpv: 39_400_000, share: 2.1, merchants: 218 },
  { state: 'Outros', tpv: 17_723_000, share: 0.9, merchants: 57 },
];

export const TPV_ANOMALIES = [
  { id: 'an_1', date: '2026-04-22', label: 'Pico anormal em PIX (+340%)', type: 'spike', impact: 'positive' },
  { id: 'an_2', date: '2026-04-15', label: 'Queda em Hipercard (-22%)', type: 'drop', impact: 'negative' },
  { id: 'an_3', date: '2026-04-08', label: 'Crescimento sustentado MG (+18% 4 sem)', type: 'trend', impact: 'positive' },
];

export const TPV_MARGINAL_CONTRIBUTION = [
  { driver: 'Crescimento orgânico de carteira existente', contribution: 6.2 },
  { driver: 'Novos lojistas onboardados', contribution: 4.8 },
  { driver: 'Mix favorável (mais ticket alto)', contribution: 2.1 },
  { driver: 'Aumento de aprovação por orquestração', contribution: 3.4 },
  { driver: 'Reativação de lojistas dormentes', contribution: 1.9 },
];

// Saved views examples
export const SAVED_VIEWS = [
  { id: 'sv_1', name: 'TPV mensal por adquirente últimos 12 meses', creator: 'CFO' },
  { id: 'sv_2', name: 'Top 100 lojistas trimestrais', creator: 'Comercial' },
  { id: 'sv_3', name: 'TPV intraday Black Friday 2025', creator: 'Marketing' },
  { id: 'sv_4', name: 'Concentração regional SP/RJ', creator: 'Risco' },
];