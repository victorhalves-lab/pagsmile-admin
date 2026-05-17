/**
 * Mocks da Conciliação Completa (Admin Sub) · V8
 *
 * Visão do MERCHANT contra a PagSmile (que é seu sub-adquirente).
 * Não existe "adquirente externo" aqui. Tudo é:
 *   Lado A (ERP / pedidos do merchant)  vs.  Lado B (PagSmile)
 *
 * Sem travessões (proibidos em todo o admin).
 */

export const KPI_PERIODO = {
  vendas_brutas: 1_842_400,         // R$ que a PagSmile diz que vendeu pra ele
  vendas_count: 1247,
  taxas_cobradas: 67_320,           // tudo que a PagSmile descontou
  taxas_esperadas: 64_180,          // o que o contrato dele prevê
  divergencia_taxas: 3_140,
  recebido_na_conta: 1_612_800,     // o que efetivamente caiu na conta bancária externa
  a_receber: 162_280,               // agenda futura
  estornos: 18_420,                 // refunds + chargebacks
  divergencias_abertas: 23,
  divergencias_valor: 12_840,
  health_score: 89,                 // 0 a 100 (qualidade da conciliação)
};

export const TIMELINE_14D = [
  { date: '03/05', vendas: 142_300, recebido: 124_800, taxas: 5_120 },
  { date: '04/05', vendas: 138_900, recebido: 121_200, taxas: 4_980 },
  { date: '05/05', vendas: 156_400, recebido: 138_400, taxas: 5_620 },
  { date: '06/05', vendas: 128_700, recebido: 112_900, taxas: 4_620 },
  { date: '07/05', vendas: 162_800, recebido: 144_200, taxas: 5_840 },
  { date: '08/05', vendas: 178_400, recebido: 158_100, taxas: 6_390 },
  { date: '09/05', vendas: 98_200, recebido: 86_400, taxas: 3_520 },
  { date: '10/05', vendas: 132_400, recebido: 116_700, taxas: 4_750 },
  { date: '11/05', vendas: 148_600, recebido: 131_200, taxas: 5_320 },
  { date: '12/05', vendas: 164_200, recebido: 145_800, taxas: 5_880 },
  { date: '13/05', vendas: 124_900, recebido: 110_100, taxas: 4_480 },
  { date: '14/05', vendas: 144_700, recebido: 128_200, taxas: 5_180 },
  { date: '15/05', vendas: 168_400, recebido: 149_800, taxas: 6_020 },
  { date: '16/05', vendas: 152_500, recebido: 135_000, taxas: 5_460 },
];

// Confronto pedido a pedido (ERP do merchant vs PagSmile)
export const VENDAS_VS_PAGSMILE = [
  {
    id: 'V-9842',
    erp_order: 'PED-58421',
    erp_value: 1240.00,
    pagsmile_tx: 'TXN-90342',
    pagsmile_value: 1240.00,
    method: 'pix',
    date: '2026-05-16',
    status: 'match',  // bate
    delta: 0,
  },
  {
    id: 'V-9841',
    erp_order: 'PED-58420',
    erp_value: 890.00,
    pagsmile_tx: 'TXN-90341',
    pagsmile_value: 890.00,
    method: 'credit_card',
    date: '2026-05-16',
    status: 'match',
    delta: 0,
  },
  {
    id: 'V-9840',
    erp_order: 'PED-58419',
    erp_value: 540.00,
    pagsmile_tx: null,
    pagsmile_value: null,
    method: 'credit_card',
    date: '2026-05-16',
    status: 'erp_only', // venda no ERP sem transação na PagSmile
    delta: -540.00,
  },
  {
    id: 'V-9839',
    erp_order: null,
    erp_value: null,
    pagsmile_tx: 'TXN-90338',
    pagsmile_value: 320.00,
    method: 'pix',
    date: '2026-05-16',
    status: 'pagsmile_only', // transação na PagSmile sem venda no ERP
    delta: 320.00,
  },
  {
    id: 'V-9838',
    erp_order: 'PED-58418',
    erp_value: 2_400.00,
    pagsmile_tx: 'TXN-90337',
    pagsmile_value: 2_376.00,
    method: 'credit_card',
    date: '2026-05-15',
    status: 'value_mismatch', // valor divergente
    delta: -24.00,
  },
  {
    id: 'V-9837',
    erp_order: 'PED-58417',
    erp_value: 158.00,
    pagsmile_tx: 'TXN-90336',
    pagsmile_value: 158.00,
    method: 'boleto',
    date: '2026-05-15',
    status: 'match',
    delta: 0,
  },
  {
    id: 'V-9836',
    erp_order: 'PED-58416',
    erp_value: 1_890.00,
    pagsmile_tx: 'TXN-90335',
    pagsmile_value: 1_890.00,
    method: 'pix',
    date: '2026-05-15',
    status: 'match',
    delta: 0,
  },
];

// Auditoria de taxas (contratado vs cobrado)
export const TAXAS_AUDITORIA = [
  {
    id: 'T-001',
    categoria: 'MDR Crédito 1x',
    contratado_pct: 2.99,
    cobrado_pct: 2.99,
    volume: 312_400,
    taxa_esperada: 9_341,
    taxa_cobrada: 9_341,
    delta: 0,
    status: 'match',
  },
  {
    id: 'T-002',
    categoria: 'MDR Crédito 2x a 6x',
    contratado_pct: 3.49,
    cobrado_pct: 3.49,
    volume: 184_200,
    taxa_esperada: 6_429,
    taxa_cobrada: 6_429,
    delta: 0,
    status: 'match',
  },
  {
    id: 'T-003',
    categoria: 'MDR Crédito 7x a 12x',
    contratado_pct: 3.99,
    cobrado_pct: 4.15,
    volume: 124_800,
    taxa_esperada: 4_980,
    taxa_cobrada: 5_179,
    delta: 199,
    status: 'overcharge',  // PagSmile cobrou a mais
    expected_recovery: 199,
  },
  {
    id: 'T-004',
    categoria: 'Taxa PIX in',
    contratado_pct: 0.99,
    cobrado_pct: 0.99,
    volume: 624_100,
    taxa_esperada: 6_179,
    taxa_cobrada: 6_179,
    delta: 0,
    status: 'match',
  },
  {
    id: 'T-005',
    categoria: 'Boleto (R$ por título)',
    contratado_fixo: 3.49,
    cobrado_fixo: 3.49,
    volume: 184,
    taxa_esperada: 642,
    taxa_cobrada: 642,
    delta: 0,
    status: 'match',
  },
  {
    id: 'T-006',
    categoria: 'Antecipação',
    contratado_pct: 2.49,
    cobrado_pct: 2.49,
    volume: 280_000,
    taxa_esperada: 6_972,
    taxa_cobrada: 6_972,
    delta: 0,
    status: 'match',
  },
  {
    id: 'T-007',
    categoria: 'Saque TED',
    contratado_fixo: 8.90,
    cobrado_fixo: 12.50,
    volume: 18,  // qtd de saques
    taxa_esperada: 160,
    taxa_cobrada: 225,
    delta: 65,
    status: 'overcharge',
    expected_recovery: 65,
  },
  {
    id: 'T-008',
    categoria: 'Tarifa estorno',
    contratado_fixo: 0,
    cobrado_fixo: 4.90,
    volume: 12,
    taxa_esperada: 0,
    taxa_cobrada: 58.80,
    delta: 58.80,
    status: 'unexpected', // tarifa não prevista no contrato
    expected_recovery: 58.80,
  },
];

// Liquidações previstas vs realizadas
export const LIQUIDACOES = [
  { id: 'L-001', data_prevista: '2026-05-12', data_realizada: '2026-05-12', valor_previsto: 142_800, valor_realizado: 142_800, status: 'on_time' },
  { id: 'L-002', data_prevista: '2026-05-13', data_realizada: '2026-05-13', valor_previsto: 138_400, valor_realizado: 138_400, status: 'on_time' },
  { id: 'L-003', data_prevista: '2026-05-14', data_realizada: '2026-05-14', valor_previsto: 156_200, valor_realizado: 156_200, status: 'on_time' },
  { id: 'L-004', data_prevista: '2026-05-15', data_realizada: '2026-05-16', valor_previsto: 124_900, valor_realizado: 124_900, status: 'late_1d' },
  { id: 'L-005', data_prevista: '2026-05-16', data_realizada: null, valor_previsto: 168_200, valor_realizado: 0, status: 'pending' },
  { id: 'L-006', data_prevista: '2026-05-17', data_realizada: null, valor_previsto: 152_500, valor_realizado: 0, status: 'scheduled' },
];

// Saques solicitados vs creditados no banco externo
export const SAQUES = [
  { id: 'S-001', solicitado_em: '2026-05-10 14:22', valor: 240_000, banco_destino: 'Itaú 0001/12345-6', creditado_em: '2026-05-10 16:14', tarifa: 8.90, status: 'creditado' },
  { id: 'S-002', solicitado_em: '2026-05-12 09:18', valor: 180_000, banco_destino: 'Itaú 0001/12345-6', creditado_em: '2026-05-12 11:42', tarifa: 8.90, status: 'creditado' },
  { id: 'S-003', solicitado_em: '2026-05-14 18:42', valor: 320_000, banco_destino: 'Itaú 0001/12345-6', creditado_em: null, tarifa: 12.50, status: 'pendente', alerta: 'Saque há 48h sem crédito na conta. Acionar suporte PagSmile.' },
  { id: 'S-004', solicitado_em: '2026-05-15 10:08', valor: 150_000, banco_destino: 'Itaú 0001/12345-6', creditado_em: '2026-05-15 12:02', tarifa: 8.90, status: 'creditado' },
];

// Divergências consolidadas (lado merchant)
export const DIVERGENCIAS = [
  {
    id: 'D-2026-0184',
    bucket: 'taxa_acima_contrato',
    titulo: 'MDR cobrado acima do contratado',
    descricao: 'PagSmile cobrou MDR de 4.15% em parcelado 7x a 12x. Contrato prevê 3.99%.',
    valor: 199,
    detectado_em: '2026-05-16 08:14',
    severidade: 'media',
    status: 'pronta_contestar',
    auditor_confidence: 96,
    acao_sugerida: 'Abrir contestação contra a PagSmile com base na cláusula 4.2 do contrato.',
  },
  {
    id: 'D-2026-0183',
    bucket: 'tarifa_nao_prevista',
    titulo: 'Tarifa de estorno não prevista',
    descricao: 'Cobrança de R$ 4,90 por estorno em 12 ocorrências. Contrato não prevê essa tarifa.',
    valor: 58.80,
    detectado_em: '2026-05-16 07:32',
    severidade: 'baixa',
    status: 'pronta_contestar',
    auditor_confidence: 98,
    acao_sugerida: 'Solicitar reembolso integral. Cláusula contratual ausente.',
  },
  {
    id: 'D-2026-0182',
    bucket: 'saque_nao_creditado',
    titulo: 'Saque solicitado há 48h sem crédito',
    descricao: 'TED de R$ 320.000 solicitado em 14/05 às 18:42. Conta destino Itaú ainda não recebeu.',
    valor: 320_000,
    detectado_em: '2026-05-16 09:00',
    severidade: 'critica',
    status: 'aguardando_suporte',
    auditor_confidence: 100,
    acao_sugerida: 'Abrir ticket urgente. Verificar comprovante de TED na PagSmile.',
  },
  {
    id: 'D-2026-0181',
    bucket: 'venda_erp_sem_pagsmile',
    titulo: 'Venda no ERP sem transação correspondente',
    descricao: 'Pedido PED-58419 (R$ 540) confirmado no ERP em 16/05, sem transação na PagSmile.',
    valor: 540,
    detectado_em: '2026-05-16 10:12',
    severidade: 'media',
    status: 'investigando',
    auditor_confidence: 82,
    acao_sugerida: 'Verificar se pedido foi cobrado fora da PagSmile ou se falhou o webhook.',
  },
  {
    id: 'D-2026-0180',
    bucket: 'valor_divergente',
    titulo: 'Valor cobrado menor que o pedido',
    descricao: 'PED-58418 fechou R$ 2.400 no ERP. PagSmile registrou R$ 2.376 (delta R$ 24).',
    valor: 24,
    detectado_em: '2026-05-15 22:08',
    severidade: 'baixa',
    status: 'investigando',
    auditor_confidence: 74,
    acao_sugerida: 'Possível desconto aplicado no checkout. Confirmar com time de pricing.',
  },
  {
    id: 'D-2026-0179',
    bucket: 'tarifa_acima_contrato',
    titulo: 'Tarifa de saque acima do contratado',
    descricao: 'TED de 14/05 cobrou R$ 12,50. Contrato prevê R$ 8,90 (delta R$ 3,60 por saque).',
    valor: 65,
    detectado_em: '2026-05-15 18:42',
    severidade: 'baixa',
    status: 'pronta_contestar',
    auditor_confidence: 99,
    acao_sugerida: 'Solicitar reembolso da diferença em 18 saques no mês.',
  },
];

export const DIVERGENCE_BUCKETS_LABELS = {
  taxa_acima_contrato:    { label: 'Taxa acima do contrato', color: '#B45309' },
  tarifa_nao_prevista:    { label: 'Tarifa não prevista',    color: '#B91C1C' },
  saque_nao_creditado:    { label: 'Saque não creditado',    color: '#B91C1C' },
  venda_erp_sem_pagsmile: { label: 'Venda no ERP sem PagSmile', color: '#B45309' },
  pagsmile_sem_erp:       { label: 'PagSmile sem ERP',       color: '#64748B' },
  valor_divergente:       { label: 'Valor divergente',       color: '#B45309' },
  liquidacao_atrasada:    { label: 'Liquidação atrasada',    color: '#B91C1C' },
  estorno_duplicado:      { label: 'Estorno duplicado',      color: '#B91C1C' },
  chargeback_indevido:    { label: 'Chargeback indevido',    color: '#B91C1C' },
  antecipacao_desconto:   { label: 'Antecipação fora do simulado', color: '#B45309' },
};

export const SEVERIDADE_META = {
  critica: { label: 'Crítica', color: '#B91C1C', bg: '#FEE2E2' },
  alta:    { label: 'Alta',    color: '#B91C1C', bg: '#FEE2E2' },
  media:   { label: 'Média',   color: '#B45309', bg: '#FEF3C7' },
  baixa:   { label: 'Baixa',   color: '#64748B', bg: '#F1F5F9' },
};

export const STATUS_DIV_META = {
  pronta_contestar:    { label: 'Pronta para contestar', color: '#007A5C', bg: '#E0F8F1' },
  investigando:        { label: 'Investigando',          color: '#002443', bg: '#E6ECF2' },
  aguardando_suporte:  { label: 'Aguardando suporte',    color: '#B45309', bg: '#FEF3C7' },
  resolvida:           { label: 'Resolvida',             color: '#007A5C', bg: '#E0F8F1' },
};

export const fmtBRL = (v) => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL', maximumFractionDigits: 2,
}).format(v || 0);

export const fmtBRLShort = (v) => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL', maximumFractionDigits: 0,
}).format(v || 0);

export const fmtPct = (v) => `${(v || 0).toFixed(2)}%`;