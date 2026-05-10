// Motor de matching (reconciliação tripla) — PR-04.
//
// Pega Transactions com reconciliation_state ∈ {pending, unmatched} e tenta:
//   1) match Transaction ↔ AcquirerRecord pela chave external_id (NSU + auth)
//   2) match AcquirerRecord ↔ BankMovement por valor líquido (net_cents) +
//      janela de data (settle_date ±2 dias)
//   3) classifica em: three_way_perfect | three_way_tolerance |
//      two_way_tx_acquirer | unmatched
//
// Tolerâncias:
//   - valor: 1 centavo (R$ 0,01)
//   - tempo: 2 dias entre settle_date esperado e occurred_at do banco
//
// Saídas:
//   - cria registros em ReconciliationMatch
//   - cria registros em Divergence (quando há divergência de valor/data)
//   - atualiza Transaction.reconciliation_state e last_matched_at
//   - atualiza BankMovement.match_state quando match
//   - cria PipelineRun com estatísticas
//
// Admin-only (operação de pipeline).

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const AMOUNT_TOLERANCE_CENTS = 1;
const TIME_TOLERANCE_DAYS = 2;

// ---------- helpers ----------

function daysBetween(dateA, dateB) {
  const a = new Date(dateA).getTime();
  const b = new Date(dateB).getTime();
  return Math.abs(a - b) / (1000 * 60 * 60 * 24);
}

function findAcquirerMatch(transaction, acquirerRecords) {
  // primary key: external_id exato
  return acquirerRecords.find(ar => ar.external_id === transaction.external_id);
}

function findBankMatch(acquirerRecord, bankMovements) {
  // tenta match exato primeiro
  const exact = bankMovements.find(bm =>
    bm.amount_cents === acquirerRecord.net_cents &&
    bm.direction === 'credit' &&
    bm.match_state !== 'matched' &&
    acquirerRecord.settle_date &&
    daysBetween(bm.occurred_at, acquirerRecord.settle_date) <= TIME_TOLERANCE_DAYS
  );
  if (exact) return { movement: exact, exact: true };

  // tolerância de 1 centavo
  const tolerant = bankMovements.find(bm =>
    Math.abs(bm.amount_cents - acquirerRecord.net_cents) <= AMOUNT_TOLERANCE_CENTS &&
    bm.direction === 'credit' &&
    bm.match_state !== 'matched' &&
    acquirerRecord.settle_date &&
    daysBetween(bm.occurred_at, acquirerRecord.settle_date) <= TIME_TOLERANCE_DAYS
  );
  if (tolerant) return { movement: tolerant, exact: false };

  return null;
}

function classifyMatch(tx, acq, bank) {
  if (acq && bank?.exact) return 'three_way_perfect';
  if (acq && bank && !bank.exact) return 'three_way_tolerance';
  if (acq && !bank) return 'two_way_tx_acquirer';
  return 'unmatched';
}

function detectDivergence(tx, acq) {
  // valor: amount_cents da transaction vs amount_cents do acquirer
  if (acq && tx.amount_cents != null && acq.amount_cents != null) {
    const delta = acq.amount_cents - tx.amount_cents;
    if (Math.abs(delta) > AMOUNT_TOLERANCE_CENTS) {
      return {
        bucket: 'value_mismatch',
        severity: Math.abs(delta) > 100 ? 'high' : 'medium',
        delta_cents: delta,
        expected_value: tx.amount_cents,
        received_value: acq.amount_cents,
        root_cause: `Adquirente reportou valor divergente da transação (delta ${delta} centavos)`,
        owner: 'upstream',
        proposed_action: 'adjust',
      };
    }
  }
  return null;
}

// ---------- main ----------

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'admin only' }, { status: 403 });
    }

    const startedAt = new Date().toISOString();

    // 1) carrega universo de trabalho
    const txs = await base44.asServiceRole.entities.Transaction.list();
    const acqs = await base44.asServiceRole.entities.AcquirerRecord.list();
    const banks = await base44.asServiceRole.entities.BankMovement.list();

    // estado mutável local de bank movements para evitar duplo-match
    const bankPool = banks.map(b => ({ ...b }));

    const matchesToCreate = [];
    const divergencesToCreate = [];
    const txUpdates = []; // {id, data}
    const bankUpdates = []; // {id, data}

    let stats = {
      total_processed: 0,
      three_way_perfect: 0,
      three_way_tolerance: 0,
      two_way_tx_acquirer: 0,
      unmatched: 0,
      divergences: 0,
    };

    // 2) itera transactions tentando match
    for (const tx of txs) {
      // pula transações já 3-way (idempotência básica)
      if (tx.reconciliation_state === 'matched_three_way') continue;
      // só processa as que têm external_id (sem chave não há como casar)
      if (!tx.external_id) continue;

      stats.total_processed++;

      const acq = findAcquirerMatch(tx, acqs);
      const bankResult = acq ? findBankMatch(acq, bankPool) : null;
      const matchType = classifyMatch(tx, acq, bankResult);

      // detecta divergência de valor
      const divergence = detectDivergence(tx, acq);

      if (matchType === 'unmatched') {
        stats.unmatched++;
        if (tx.reconciliation_state !== 'unmatched') {
          txUpdates.push({ id: tx.id, data: { reconciliation_state: 'unmatched' } });
        }
        continue;
      }

      // monta evidência
      const evidence = {
        tx: { id: tx.id, transaction_id: tx.transaction_id, amount_cents: tx.amount_cents, occurred_at: tx.occurred_at },
        acquirer: acq ? { id: acq.id, external_id: acq.external_id, net_cents: acq.net_cents, settle_date: acq.settle_date } : null,
        bank: bankResult ? { id: bankResult.movement.id, amount_cents: bankResult.movement.amount_cents, occurred_at: bankResult.movement.occurred_at, exact: bankResult.exact } : null,
      };

      // confidence score simples
      let confidence = 50;
      if (matchType === 'three_way_perfect') confidence = 100;
      else if (matchType === 'three_way_tolerance') confidence = 90;
      else if (matchType === 'two_way_tx_acquirer') confidence = 70;
      if (divergence) confidence -= 20;

      const matchRecord = {
        transaction_id: tx.transaction_id,
        acquirer_record_id: acq?.id || null,
        bank_movement_id: bankResult?.movement.id || null,
        match_type: matchType,
        confidence_score: Math.max(0, confidence),
        matched_at: new Date().toISOString(),
        matched_by: 'pipeline',
        tolerance_applied: matchType === 'three_way_tolerance'
          ? { amount_cents: AMOUNT_TOLERANCE_CENTS, time_days: TIME_TOLERANCE_DAYS }
          : null,
        evidence,
      };
      matchesToCreate.push(matchRecord);

      // atualiza estado da transaction
      let newState;
      if (matchType === 'three_way_perfect' || matchType === 'three_way_tolerance') {
        newState = divergence ? 'divergent' : 'matched_three_way';
        stats[matchType]++;
      } else {
        newState = divergence ? 'divergent' : 'matched_acquirer';
        stats.two_way_tx_acquirer++;
      }

      txUpdates.push({
        id: tx.id,
        data: {
          reconciliation_state: newState,
          last_matched_at: new Date().toISOString(),
          actual_settle_date: bankResult?.movement.occurred_at?.substring(0, 10) || tx.actual_settle_date,
        },
      });

      // marca bank movement como matched (remove do pool)
      if (bankResult) {
        bankUpdates.push({
          id: bankResult.movement.id,
          data: { match_state: 'matched' },
        });
        // remove do pool local pra não casar duas vezes
        const idx = bankPool.findIndex(b => b.id === bankResult.movement.id);
        if (idx >= 0) bankPool.splice(idx, 1);
      }

      if (divergence) {
        stats.divergences++;
        divergencesToCreate.push({
          merchant_id: tx.merchant_id,
          transaction_id: tx.transaction_id,
          acquirer_record_id: acq?.id || null,
          bank_movement_id: bankResult?.movement.id || null,
          detected_at: new Date().toISOString(),
          detected_by: 'pipeline:value_mismatch',
          ...divergence,
          status: 'detected',
        });
      }
    }

    // 3) persiste em bulk
    if (matchesToCreate.length > 0) {
      await base44.asServiceRole.entities.ReconciliationMatch.bulkCreate(matchesToCreate);
    }
    if (divergencesToCreate.length > 0) {
      await base44.asServiceRole.entities.Divergence.bulkCreate(divergencesToCreate);
    }
    for (const u of txUpdates) {
      await base44.asServiceRole.entities.Transaction.update(u.id, u.data);
    }
    for (const u of bankUpdates) {
      await base44.asServiceRole.entities.BankMovement.update(u.id, u.data);
    }

    const endedAt = new Date().toISOString();

    // 4) registra PipelineRun
    await base44.asServiceRole.entities.PipelineRun.create({
      stage: 'match',
      source: 'recon_engine',
      window_from: startedAt,
      window_to: endedAt,
      started_at: startedAt,
      ended_at: endedAt,
      duration_ms: new Date(endedAt) - new Date(startedAt),
      records_in: stats.total_processed,
      records_out: matchesToCreate.length,
      matches_made: matchesToCreate.length,
      divergences_created: divergencesToCreate.length,
      status: 'success',
    });

    return Response.json({
      success: true,
      stats,
      matches_created: matchesToCreate.length,
      divergences_created: divergencesToCreate.length,
      tx_updates: txUpdates.length,
      bank_updates: bankUpdates.length,
      duration_ms: new Date(endedAt) - new Date(startedAt),
    });

  } catch (error) {
    console.error('runMatching error:', error);
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
});