// Função de TESTE/DIAGNÓSTICO do parser Cielo CNAB240.
// Gera um arquivo CNAB sintético inline e roda a lógica de parse (sem persistir).
// Serve como prova de conceito visível para qualquer usuário autenticado.
//
// NÃO invoca parseCnab.js (esse exige admin e persiste em DB).
// Aqui replicamos o parser inline apenas para fins de demonstração visual.
//
// Uso (frontend): const r = await base44.functions.invoke('cnab/testCnabParser', {})

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// ============ Helpers de geração CNAB sintético ============

function pad(value, length, char = '0', side = 'left') {
  const s = String(value);
  if (s.length >= length) return s.substring(0, length);
  return side === 'left' ? s.padStart(length, char) : s.padEnd(length, char);
}

function buildHeaderArquivo() {
  let line = '';
  line += pad('CIELO', 7, ' ', 'right');
  line += '0';
  line += pad('', 5, ' ', 'right');
  line += pad('01027058000191', 14);
  line += pad('', 116, ' ', 'right');
  line += '07052026';
  line += pad('', 89, ' ', 'right');
  return line.padEnd(240, ' ').substring(0, 240);
}

function buildDetailLine(opts) {
  let line = '';
  line += pad('', 7, ' ', 'right');
  line += '3';
  line += pad('', 5, ' ', 'right');
  line += 'T';
  line += pad('', 24, ' ', 'right');
  line += pad(opts.nsu, 9);
  line += pad(opts.autorizacao, 6);
  line += pad(opts.cnpj, 14);
  line += pad(opts.bandeira, 3);
  line += opts.data_venda;
  line += opts.data_liquidacao;
  line += pad(opts.valor_bruto_cents, 15);
  line += pad(opts.valor_taxa_cents, 15);
  line += pad(opts.valor_liquido_cents, 15);
  line += pad(opts.parcelas, 2);
  line += pad(opts.status, 2);
  line += pad('', 105, ' ', 'right');
  return line.padEnd(240, ' ').substring(0, 240);
}

function buildSyntheticCieloFile() {
  const lines = [];
  lines.push(buildHeaderArquivo());
  lines.push(buildDetailLine({
    nsu: '829461', autorizacao: '122334', cnpj: '12345678000190', bandeira: '001',
    data_venda: '07052026', data_liquidacao: '07062026',
    valor_bruto_cents: 129990, valor_taxa_cents: 5200, valor_liquido_cents: 124790,
    parcelas: 3, status: '01',
  }));
  lines.push(buildDetailLine({
    nsu: '551247', autorizacao: '998877', cnpj: '22334455000166', bandeira: '002',
    data_venda: '07052026', data_liquidacao: '06062026',
    valor_bruto_cents: 18900, valor_taxa_cents: 757, valor_liquido_cents: 18143,
    parcelas: 1, status: '01',
  }));
  lines.push(buildDetailLine({
    nsu: '661129', autorizacao: '223344', cnpj: '22334455000166', bandeira: '001',
    data_venda: '15042026', data_liquidacao: '15052026',
    valor_bruto_cents: 75000, valor_taxa_cents: 3000, valor_liquido_cents: 72000,
    parcelas: 2, status: '03',
  }));
  lines.push(buildDetailLine({
    nsu: '999999', autorizacao: '888888', cnpj: '11111111000111', bandeira: '004',
    data_venda: '00000000', data_liquidacao: '00000000',
    valor_bruto_cents: 50000, valor_taxa_cents: 2000, valor_liquido_cents: 48000,
    parcelas: 1, status: '01',
  }));
  return lines.join('\n');
}

// ============ Parser Cielo (cópia da lógica de parseCnab.js) ============

const FIELDS = {
  segmento: { start: 13, end: 14 },
  nsu: { start: 38, end: 47 },
  autorizacao: { start: 47, end: 53 },
  cnpj_estab: { start: 53, end: 67 },
  bandeira: { start: 67, end: 70 },
  data_venda: { start: 70, end: 78 },
  data_liquidacao: { start: 78, end: 86 },
  valor_bruto: { start: 86, end: 101 },
  valor_taxa: { start: 101, end: 116 },
  valor_liquido: { start: 116, end: 131 },
  parcelas: { start: 131, end: 133 },
  status_movim: { start: 133, end: 135 },
};
const BANDEIRA_MAP = { '001': 'visa', '002': 'mastercard', '003': 'amex', '004': 'elo', '005': 'hipercard' };
const STATUS_MAP = { '01': 'captured', '02': 'cancelled', '03': 'chargeback', '04': 'refund', '05': 'settled' };

function parseDate(raw) {
  if (!raw || raw.length !== 8 || raw === '00000000') return null;
  return `${raw.substring(4, 8)}-${raw.substring(2, 4)}-${raw.substring(0, 2)}`;
}
function slc(line, f) { return line.substring(f.start, f.end).trim(); }
function intCents(s) { const n = parseInt((s || '').replace(/\D/g, ''), 10); return isNaN(n) ? 0 : n; }

function parseCielo(content) {
  const lines = content.split(/\r?\n/).filter(l => l.length > 0);
  const records = [];
  const errors = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.charAt(7) !== '3') continue;
    if (line.length < 240) { errors.push({ line: i + 1, error: 'comprimento < 240' }); continue; }
    if (slc(line, FIELDS.segmento) !== 'T') continue;
    const dataVenda = parseDate(slc(line, FIELDS.data_venda));
    if (!dataVenda) { errors.push({ line: i + 1, error: 'data_venda inválida' }); continue; }
    const nsu = slc(line, FIELDS.nsu);
    const autorizacao = slc(line, FIELDS.autorizacao);
    const statusCod = slc(line, FIELDS.status_movim);
    records.push({
      external_id: `${nsu}_${autorizacao}`,
      merchant_doc: slc(line, FIELDS.cnpj_estab),
      amount_cents: intCents(slc(line, FIELDS.valor_bruto)),
      fee_cents: intCents(slc(line, FIELDS.valor_taxa)),
      net_cents: intCents(slc(line, FIELDS.valor_liquido)),
      occurred_at: `${dataVenda}T00:00:00Z`,
      settle_date: parseDate(slc(line, FIELDS.data_liquidacao)),
      status: STATUS_MAP[statusCod] || 'other',
      card_brand: BANDEIRA_MAP[slc(line, FIELDS.bandeira)] || 'other',
      installments: parseInt(slc(line, FIELDS.parcelas), 10) || 1,
      transaction_type: statusCod === '03' ? 'chargeback' : statusCod === '04' ? 'refund' : 'sale',
    });
  }
  return { records, errors };
}

// ============ Endpoint ============

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const fileContent = buildSyntheticCieloFile();
    const lines = fileContent.split('\n');
    const { records, errors } = parseCielo(fileContent);

    return Response.json({
      test: 'cielo_cnab240_synthetic',
      input: {
        total_lines: lines.length,
        line_lengths: lines.map(l => l.length),
        sample_detail_line_preview: lines[1].substring(0, 50) + '...',
      },
      output: {
        records_parsed: records.length,
        errors_count: errors.length,
        records,
        errors,
      },
      note: 'Persistência em DB requer admin e ocorre via cnab/parseCnab',
    });

  } catch (error) {
    console.error('test error:', error);
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
});