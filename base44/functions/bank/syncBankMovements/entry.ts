// PR-05 · Ingestão de movimentos bancários (Lina/Open Finance) — MOCK MODE.
//
// Em produção isso buscaria via API Lina. Por ora, geramos BankMovements
// fictícios que "fecham" os matches pendentes, para que o pipeline de
// reconciliação atinja 3-way completo.
//
// Estratégia mock:
//   - Lê todas AcquirerRecord settled
//   - Para cada uma sem BankMovement correspondente, cria um movimento
//     com amount_cents = net_cents, occurred_at ~ settle_date
//   - Idempotência via source_tx_id determinístico (hash do external_id)
//
// Admin-only.

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function makeSourceTxId(acq) {
  // determinístico — mesmo input = mesmo id, garante idempotência
  return `lina_mock_${acq.acquirer_id}_${acq.external_id}`.substring(0, 80);
}

function buildMovementFromAcquirer(acq) {
  return {
    bank_account_id: 'BA_PAGSMILE_MAE',
    source: 'lina_api',
    source_tx_id: makeSourceTxId(acq),
    amount_cents: acq.net_cents,
    direction: 'credit',
    occurred_at: new Date(`${acq.settle_date}T08:00:00Z`).toISOString(),
    posted_at: new Date(`${acq.settle_date}T08:01:00Z`).toISOString(),
    counterparty: {
      name: acq.acquirer_id?.toUpperCase(),
      document: '00000000000000',
    },
    description: `LIQ ${acq.acquirer_id?.toUpperCase()} ${acq.settle_date} ${acq.external_id}`,
    transaction_type: 'ted',
    raw_hash: `mock_${acq.raw_hash || acq.id}`,
    lina_updated_at: new Date().toISOString(),
    match_state: 'unmatched',
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'admin only' }, { status: 403 });
    }

    const acqs = await base44.asServiceRole.entities.AcquirerRecord.list();
    const existingMovs = await base44.asServiceRole.entities.BankMovement.list();

    const existingIds = new Set(existingMovs.map(m => m.source_tx_id));

    const toCreate = [];
    let skipped = 0;

    for (const acq of acqs) {
      // só geramos mock para sales settled (chargebacks/refunds não geram crédito)
      if (acq.transaction_type !== 'sale' && acq.status !== 'settled' && acq.status !== 'captured') {
        skipped++;
        continue;
      }
      if (!acq.settle_date || !acq.net_cents) {
        skipped++;
        continue;
      }
      const candidate = buildMovementFromAcquirer(acq);
      if (existingIds.has(candidate.source_tx_id)) {
        skipped++;
        continue;
      }
      // também pula se já existe um movimento com mesmo valor e data próxima
      // (evita duplicar com os 4 seeds reais)
      const conflict = existingMovs.find(m =>
        m.amount_cents === candidate.amount_cents &&
        m.direction === 'credit' &&
        m.occurred_at?.substring(0, 10) === candidate.occurred_at.substring(0, 10)
      );
      if (conflict) {
        skipped++;
        continue;
      }
      toCreate.push(candidate);
    }

    if (toCreate.length > 0) {
      await base44.asServiceRole.entities.BankMovement.bulkCreate(toCreate);
    }

    // log de consentimento (LGPD/BCB compliance simulado)
    await base44.asServiceRole.entities.LinaConsentLog.create({
      bank_account_id: 'BA_PAGSMILE_MAE',
      action: 'transactions_read',
      requested_at: new Date().toISOString(),
      requested_by: 'syncBankMovements',
      purpose: 'reconciliation_automatic',
      records_returned: toCreate.length,
      lina_request_id: `mock_${Date.now()}`,
    });

    return Response.json({
      success: true,
      mode: 'mock',
      acquirer_records_seen: acqs.length,
      created: toCreate.length,
      skipped,
    });

  } catch (error) {
    console.error('syncBankMovements error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});