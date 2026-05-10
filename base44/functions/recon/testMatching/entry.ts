// Diagnóstico do motor de matching — modo dry-run.
// Roda exatamente a mesma lógica do runMatching, mas SEM persistir no DB.
// Retorna o que seria criado/atualizado, para inspeção visual.
//
// Aberto a qualquer usuário autenticado (somente leitura).

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const AMOUNT_TOLERANCE_CENTS = 1;
const TIME_TOLERANCE_DAYS = 2;

function daysBetween(a, b) {
  return Math.abs(new Date(a).getTime() - new Date(b).getTime()) / 86400000;
}

function findAcquirerMatch(tx, acqs) {
  return acqs.find(ar => ar.external_id === tx.external_id);
}

function findBankMatch(acq, bankPool) {
  const exact = bankPool.find(bm =>
    bm.amount_cents === acq.net_cents &&
    bm.direction === 'credit' &&
    bm.match_state !== 'matched' &&
    acq.settle_date &&
    daysBetween(bm.occurred_at, acq.settle_date) <= TIME_TOLERANCE_DAYS
  );
  if (exact) return { movement: exact, exact: true };
  const tolerant = bankPool.find(bm =>
    Math.abs(bm.amount_cents - acq.net_cents) <= AMOUNT_TOLERANCE_CENTS &&
    bm.direction === 'credit' &&
    bm.match_state !== 'matched' &&
    acq.settle_date &&
    daysBetween(bm.occurred_at, acq.settle_date) <= TIME_TOLERANCE_DAYS
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

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const txs = await base44.asServiceRole.entities.Transaction.list();
    const acqs = await base44.asServiceRole.entities.AcquirerRecord.list();
    const banks = await base44.asServiceRole.entities.BankMovement.list();

    const bankPool = banks.map(b => ({ ...b }));
    const breakdown = [];
    const stats = {
      three_way_perfect: 0, three_way_tolerance: 0,
      two_way_tx_acquirer: 0, unmatched: 0, skipped: 0,
    };

    for (const tx of txs) {
      if (tx.reconciliation_state === 'matched_three_way') { stats.skipped++; continue; }
      if (!tx.external_id) { stats.skipped++; continue; }

      const acq = findAcquirerMatch(tx, acqs);
      const bank = acq ? findBankMatch(acq, bankPool) : null;
      const type = classifyMatch(tx, acq, bank);
      stats[type]++;

      if (bank) {
        const idx = bankPool.findIndex(b => b.id === bank.movement.id);
        if (idx >= 0) bankPool.splice(idx, 1);
      }

      breakdown.push({
        tx: tx.transaction_id,
        external_id: tx.external_id,
        amount: tx.amount_cents,
        match_type: type,
        acquirer: acq ? { id: acq.acquirer_id, net: acq.net_cents } : null,
        bank: bank ? { amount: bank.movement.amount_cents, exact: bank.exact } : null,
      });
    }

    return Response.json({
      mode: 'dry_run',
      universe: { transactions: txs.length, acquirer_records: acqs.length, bank_movements: banks.length },
      stats,
      breakdown,
    });

  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});