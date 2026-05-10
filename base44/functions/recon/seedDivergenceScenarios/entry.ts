// Cria cenários variados de divergência para estressar os agentes IA.
// MOCK MODE — gera AcquirerRecords e BankMovements com defeitos intencionais
// que serão detectados pelo runMatching.
//
// Cenários injetados (idempotentes):
//   A) fee_mismatch — adquirente cobrou MDR maior que contratado
//   B) settlement_aging — bank movement chegou 7 dias após settle_date previsto
//   C) phantom_external — bank movement de R$ 500 sem AcquirerRecord/Transaction
//
// Admin-only.

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SCENARIO_PREFIX = 'SCENARIO_';

async function findExisting(base44, entity, key, value) {
  const list = await base44.asServiceRole.entities[entity].filter({ [key]: value });
  return list[0] || null;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'admin only' }, { status: 403 });
    }

    const created = { acquirer: 0, bank: 0, transaction: 0 };
    const skipped = [];

    // ============================================================
    // CENÁRIO A — fee_mismatch
    // Tx fee esperado: R$ 5,00 → adquirente cobrou R$ 8,50 (350 c a mais)
    // ============================================================
    const txAExtId = `${SCENARIO_PREFIX}FEE_001`;
    const existingTxA = await findExisting(base44, 'Transaction', 'external_id', txAExtId);
    if (!existingTxA) {
      await base44.asServiceRole.entities.Transaction.create({
        transaction_id: 'TX_SCENARIO_A',
        subaccount_id: 'SUB_TEST',
        merchant_id: 'MERCH_TEST',
        external_id: txAExtId,
        acquirer_id: 'cielo',
        method: 'credit_card',
        status: 'approved',
        amount: 100.00,
        amount_cents: 10000,
        fee_amount: 5.00,
        net_amount: 95.00,
        currency: 'BRL',
        occurred_at: '2026-05-01T10:00:00Z',
        expected_settle_date: '2026-05-31',
        reconciliation_state: 'pending',
      });
      created.transaction++;
    } else { skipped.push('txA'); }

    const existingAcqA = await findExisting(base44, 'AcquirerRecord', 'external_id', txAExtId);
    if (!existingAcqA) {
      await base44.asServiceRole.entities.AcquirerRecord.create({
        acquirer_id: 'cielo',
        file_id: 'SCENARIO_FILE_A',
        line_number: 1,
        external_id: txAExtId,
        merchant_doc: '00000000000100',
        amount_cents: 10000,
        fee_cents: 850, // ⚠️ esperado 500 — divergência de 350
        net_cents: 9150,
        occurred_at: '2026-05-01T10:00:00Z',
        settle_date: '2026-05-31',
        status: 'settled',
        card_brand: 'visa',
        installments: 1,
        transaction_type: 'sale',
        raw_hash: `mock_${txAExtId}`,
      });
      created.acquirer++;
    } else { skipped.push('acqA'); }

    const bankAId = `lina_mock_scenario_a`;
    const existingBankA = await findExisting(base44, 'BankMovement', 'source_tx_id', bankAId);
    if (!existingBankA) {
      await base44.asServiceRole.entities.BankMovement.create({
        bank_account_id: 'BA_PAGSMILE_MAE',
        source: 'lina_api',
        source_tx_id: bankAId,
        amount_cents: 9150, // bate com net_cents da adquirente (que é o valor errado)
        direction: 'credit',
        occurred_at: '2026-05-31T08:00:00Z',
        posted_at: '2026-05-31T08:01:00Z',
        description: `LIQ CIELO ${txAExtId}`,
        transaction_type: 'ted',
        raw_hash: `mock_bank_${txAExtId}`,
        match_state: 'unmatched',
      });
      created.bank++;
    } else { skipped.push('bankA'); }

    // ============================================================
    // CENÁRIO B — settlement_aging
    // settle_date = 2026-04-30 mas dinheiro só caiu em 2026-05-08 (8 dias atraso)
    // ============================================================
    const txBExtId = `${SCENARIO_PREFIX}AGING_001`;
    const existingTxB = await findExisting(base44, 'Transaction', 'external_id', txBExtId);
    if (!existingTxB) {
      await base44.asServiceRole.entities.Transaction.create({
        transaction_id: 'TX_SCENARIO_B',
        subaccount_id: 'SUB_TEST',
        merchant_id: 'MERCH_TEST',
        external_id: txBExtId,
        acquirer_id: 'stone',
        method: 'credit_card',
        status: 'approved',
        amount: 250.00,
        amount_cents: 25000,
        fee_amount: 7.50,
        net_amount: 242.50,
        currency: 'BRL',
        occurred_at: '2026-04-01T14:00:00Z',
        expected_settle_date: '2026-04-30',
        reconciliation_state: 'pending',
      });
      created.transaction++;
    } else { skipped.push('txB'); }

    const existingAcqB = await findExisting(base44, 'AcquirerRecord', 'external_id', txBExtId);
    if (!existingAcqB) {
      await base44.asServiceRole.entities.AcquirerRecord.create({
        acquirer_id: 'stone',
        file_id: 'SCENARIO_FILE_B',
        line_number: 1,
        external_id: txBExtId,
        merchant_doc: '00000000000100',
        amount_cents: 25000,
        fee_cents: 750,
        net_cents: 24250,
        occurred_at: '2026-04-01T14:00:00Z',
        settle_date: '2026-04-30',
        status: 'settled',
        card_brand: 'mastercard',
        installments: 1,
        transaction_type: 'sale',
        raw_hash: `mock_${txBExtId}`,
      });
      created.acquirer++;
    } else { skipped.push('acqB'); }

    const bankBId = `lina_mock_scenario_b`;
    const existingBankB = await findExisting(base44, 'BankMovement', 'source_tx_id', bankBId);
    if (!existingBankB) {
      await base44.asServiceRole.entities.BankMovement.create({
        bank_account_id: 'BA_PAGSMILE_MAE',
        source: 'lina_api',
        source_tx_id: bankBId,
        amount_cents: 24250,
        direction: 'credit',
        occurred_at: '2026-05-08T08:00:00Z', // ⚠️ 8 dias após settle_date
        posted_at: '2026-05-08T08:01:00Z',
        description: `LIQ STONE ${txBExtId} (atrasado)`,
        transaction_type: 'ted',
        raw_hash: `mock_bank_${txBExtId}`,
        match_state: 'unmatched',
      });
      created.bank++;
    } else { skipped.push('bankB'); }

    // ============================================================
    // CENÁRIO C — phantom_external (banco sem tx interna)
    // BankMovement de R$ 500 que não tem contraparte na PagSmile
    // ============================================================
    const bankCId = `lina_mock_phantom_001`;
    const existingBankC = await findExisting(base44, 'BankMovement', 'source_tx_id', bankCId);
    if (!existingBankC) {
      await base44.asServiceRole.entities.BankMovement.create({
        bank_account_id: 'BA_PAGSMILE_MAE',
        source: 'lina_api',
        source_tx_id: bankCId,
        amount_cents: 50000,
        direction: 'credit',
        occurred_at: '2026-05-05T11:30:00Z',
        posted_at: '2026-05-05T11:31:00Z',
        counterparty: { name: 'CONTRAPARTE DESCONHECIDA', document: '12345678000199' },
        description: 'CRED ORIGEM NAO IDENTIFICADA',
        transaction_type: 'pix_in',
        raw_hash: `mock_bank_phantom_001`,
        match_state: 'unmatched',
      });
      created.bank++;
    } else { skipped.push('bankC'); }

    // Cria divergência phantom_external diretamente (não passa pelo matching)
    const existingPhantom = await base44.asServiceRole.entities.Divergence.filter({
      detected_by: 'pipeline:phantom_external_seed',
    });
    if (existingPhantom.length === 0) {
      await base44.asServiceRole.entities.Divergence.create({
        merchant_id: 'MERCH_UNKNOWN',
        bank_movement_id: existingBankC?.id || null,
        detected_at: new Date().toISOString(),
        detected_by: 'pipeline:phantom_external_seed',
        bucket: 'phantom_external',
        severity: 'high',
        delta_cents: 50000,
        expected_value: 0,
        received_value: 50000,
        owner: 'external',
        proposed_action: 'escalate',
        status: 'detected',
      });
    } else { skipped.push('phantomDiv'); }

    return Response.json({
      success: true,
      mode: 'mock',
      scenarios_seeded: ['A:fee_mismatch', 'B:settlement_aging', 'C:phantom_external'],
      created,
      skipped,
      next_step: 'Execute recon/runMatching para detectar as divergências dos cenários A e B.',
    });

  } catch (error) {
    console.error('seedDivergenceScenarios error:', error);
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
});