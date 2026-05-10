// Função orquestradora de parse de arquivos CNAB de adquirentes.
//
// IMPORTANTE: Base44 backend functions NÃO suportam imports locais.
// Por isso, todos os parsers ficam INLINE neste arquivo.
// Quando criar parser novo (Stone/Rede/etc), adicione função aqui e registre
// em PARSER_REGISTRY.
//
// Fluxo:
//   1. Recebe { file_url|file_content_inline, acquirer_id, file_name? }
//   2. Baixa conteúdo (ou usa inline)
//   3. Calcula SHA-256 (idempotência - mesmo arquivo nunca é processado 2x)
//   4. Cria AcquirerFile com status="parsing"
//   5. Despacha para parser do adquirente
//   6. Bulk-insert AcquirerRecords
//   7. Atualiza AcquirerFile com estatísticas finais
//
// Auth: somente admin.

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PARSER_VERSION = '1.0.0';

// =============================================================================
// PARSER: CIELO CNAB240 (layout EEDI - Extrato Eletrônico de Documentos)
// Referência: Manual Cielo EEDI v3.0 (Febraban CNAB240 estendido)
// Estrutura: Header(0) → HeaderLote(1) → Detalhes(3 segmento T) → Trailers(5,9)
// Cada linha = 240 caracteres fixos.
// =============================================================================

const CIELO_FIELDS = {
  segmento:        { start: 13,  end: 14  },
  nsu:             { start: 38,  end: 47  },
  autorizacao:     { start: 47,  end: 53  },
  cnpj_estab:      { start: 53,  end: 67  },
  bandeira:        { start: 67,  end: 70  },
  data_venda:      { start: 70,  end: 78  },  // DDMMAAAA
  data_liquidacao: { start: 78,  end: 86  },
  valor_bruto:     { start: 86,  end: 101 },  // centavos, 15 dígitos
  valor_taxa:      { start: 101, end: 116 },
  valor_liquido:   { start: 116, end: 131 },
  parcelas:        { start: 131, end: 133 },
  status_movim:    { start: 133, end: 135 },
};

const CIELO_BANDEIRA_MAP = {
  '001': 'visa', '002': 'mastercard', '003': 'amex',
  '004': 'elo', '005': 'hipercard', '006': 'other',
};

const CIELO_STATUS_MAP = {
  '01': 'captured', '02': 'cancelled', '03': 'chargeback',
  '04': 'refund', '05': 'settled',
};

function parseDateDDMMYYYY(raw) {
  if (!raw || raw.length !== 8 || raw === '00000000') return null;
  return `${raw.substring(4, 8)}-${raw.substring(2, 4)}-${raw.substring(0, 2)}`;
}

function sliceField(line, field) {
  return line.substring(field.start, field.end).trim();
}

function parseIntCents(str) {
  const n = parseInt((str || '').replace(/\D/g, ''), 10);
  return isNaN(n) ? 0 : n;
}

function parseCieloCnab240(fileContent) {
  const lines = fileContent.split(/\r?\n/).filter(l => l.length > 0);
  const records = [];
  const errors = [];
  let headerInfo = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const tipoReg = line.charAt(7);

    if (tipoReg === '0') {
      headerInfo = {
        cnpj_origem: line.substring(13, 27).trim(),
        data_geracao: parseDateDDMMYYYY(line.substring(143, 151)),
      };
      continue;
    }

    if (tipoReg !== '3') continue;

    if (line.length < 240) {
      errors.push({ line: i + 1, error: `comprimento ${line.length} < 240` });
      continue;
    }

    const segmento = sliceField(line, CIELO_FIELDS.segmento);
    if (segmento !== 'T') continue;

    const nsu = sliceField(line, CIELO_FIELDS.nsu);
    const autorizacao = sliceField(line, CIELO_FIELDS.autorizacao);
    if (!nsu || !autorizacao) {
      errors.push({ line: i + 1, error: 'NSU ou autorização ausente' });
      continue;
    }

    const dataVenda = parseDateDDMMYYYY(sliceField(line, CIELO_FIELDS.data_venda));
    if (!dataVenda) {
      errors.push({ line: i + 1, error: 'data_venda inválida' });
      continue;
    }

    const statusCod = sliceField(line, CIELO_FIELDS.status_movim);
    const parcelas = parseInt(sliceField(line, CIELO_FIELDS.parcelas), 10) || 1;

    records.push({
      acquirer_id: 'cielo',
      line_number: i + 1,
      external_id: `${nsu}_${autorizacao}`,
      merchant_doc: sliceField(line, CIELO_FIELDS.cnpj_estab),
      amount_cents: parseIntCents(sliceField(line, CIELO_FIELDS.valor_bruto)),
      fee_cents: parseIntCents(sliceField(line, CIELO_FIELDS.valor_taxa)),
      net_cents: parseIntCents(sliceField(line, CIELO_FIELDS.valor_liquido)),
      occurred_at: `${dataVenda}T00:00:00Z`,
      settle_date: parseDateDDMMYYYY(sliceField(line, CIELO_FIELDS.data_liquidacao)),
      status: CIELO_STATUS_MAP[statusCod] || 'other',
      card_brand: CIELO_BANDEIRA_MAP[sliceField(line, CIELO_FIELDS.bandeira)] || 'other',
      installments: Math.max(1, Math.min(24, parcelas)),
      transaction_type: statusCod === '03' ? 'chargeback' : statusCod === '04' ? 'refund' : 'sale',
      raw_line: line,
    });
  }

  return { records, errors, header_info: headerInfo };
}

// =============================================================================
// TEMPLATE PARA NOVOS PARSERS (Stone, Rede, GetNet, MP, Itaú)
// =============================================================================
// Quando receber CNAB real do adquirente:
//   1. Crie constantes <ACQUIRER>_FIELDS / _BANDEIRA_MAP / _STATUS_MAP acima,
//      copiando o padrão Cielo. Posições vêm do manual técnico do adquirente.
//   2. Escreva função parse<Acquirer>(fileContent) que retorna {records, errors}.
//      Cada record DEVE ter os mesmos campos do exemplo Cielo (schema universal).
//   3. Registre em PARSER_REGISTRY abaixo: { acquirer_id: parse<Acquirer> }.
//
// Variações comuns entre adquirentes:
//   - CNAB240 vs CNAB444 (linha de 444 chars; muda só LINE_LENGTH)
//   - Data DDMMAAAA vs AAAAMMDD (Stone usa AAAAMMDD)
//   - MP usa EDI (JSON Lines), parser totalmente diferente do CNAB
//   - Codes de bandeira/status divergem (cada adquirente tem tabela própria)
// =============================================================================

const PARSER_REGISTRY = {
  cielo: parseCieloCnab240,
  // stone:  parseStoneCnab444,    // TODO próximo PR
  // rede:   parseRedeCnab240,     // TODO
  // getnet: parseGetnetCnab240,   // TODO
  // mp:     parseMpEdi,           // TODO
  // itau:   parseItauCnab240,     // TODO
};

// =============================================================================
// ORQUESTRAÇÃO
// =============================================================================

async function sha256Hex(text) {
  const buf = new TextEncoder().encode(text);
  const hashBuf = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hashBuf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden: admin required' }, { status: 403 });

    const { file_url, acquirer_id, file_name, file_content_inline } = await req.json();

    if (!acquirer_id || !PARSER_REGISTRY[acquirer_id]) {
      return Response.json({
        error: `acquirer_id inválido ou parser não implementado: ${acquirer_id}`,
        available: Object.keys(PARSER_REGISTRY),
      }, { status: 400 });
    }

    let fileContent;
    if (file_content_inline) {
      fileContent = file_content_inline;
    } else if (file_url) {
      const fetchRes = await fetch(file_url);
      if (!fetchRes.ok) {
        return Response.json({ error: `falha ao baixar: HTTP ${fetchRes.status}` }, { status: 502 });
      }
      fileContent = await fetchRes.text();
    } else {
      return Response.json({ error: 'forneça file_url ou file_content_inline' }, { status: 400 });
    }

    // Idempotência por hash
    const fileHash = await sha256Hex(fileContent);
    const existing = await base44.asServiceRole.entities.AcquirerFile.filter({ file_hash: fileHash });
    if (existing.length > 0) {
      return Response.json({
        status: 'duplicate',
        message: 'arquivo já processado anteriormente',
        existing_file_id: existing[0].id,
      });
    }

    const acquirerFile = await base44.asServiceRole.entities.AcquirerFile.create({
      acquirer_id,
      file_name: file_name || `inline_${Date.now()}.txt`,
      file_size_bytes: fileContent.length,
      file_hash: fileHash,
      file_url: file_url || null,
      received_at: new Date().toISOString(),
      reference_date: new Date().toISOString().split('T')[0],
      format: acquirer_id === 'mp' ? 'edi' : 'cnab240',
      status: 'parsing',
      parser_version: PARSER_VERSION,
      total_records: 0,
      parsed_records: 0,
    });

    const parser = PARSER_REGISTRY[acquirer_id];
    const { records, errors } = parser(fileContent);

    let insertedCount = 0;
    if (records.length > 0) {
      const recordsWithFileId = records.map(r => ({ ...r, file_id: acquirerFile.id }));
      const BATCH_SIZE = 50;
      for (let i = 0; i < recordsWithFileId.length; i += BATCH_SIZE) {
        const batch = recordsWithFileId.slice(i, i + BATCH_SIZE);
        const results = await Promise.all(
          batch.map(r =>
            base44.asServiceRole.entities.AcquirerRecord.create(r)
              .then(() => true)
              .catch(e => { console.error('AcquirerRecord.create falhou:', e?.message); return false; })
          )
        );
        insertedCount += results.filter(Boolean).length;
      }
    }

    await base44.asServiceRole.entities.AcquirerFile.update(acquirerFile.id, {
      total_records: records.length + errors.length,
      parsed_records: insertedCount,
      status: errors.length > 0 && records.length === 0 ? 'failed' : 'parsed',
      parse_errors: errors.slice(0, 100),
    });

    return Response.json({
      status: 'success',
      file_id: acquirerFile.id,
      acquirer_id,
      records_parsed: records.length,
      records_inserted: insertedCount,
      errors_count: errors.length,
      sample_errors: errors.slice(0, 5),
    });

  } catch (error) {
    console.error('parse_cnab error:', error);
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
});