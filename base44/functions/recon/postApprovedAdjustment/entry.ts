// PR-14 · Postagem efetiva de ajuste aprovado.
// Quando ProposedAdjustment passa para status='approved', cria o lançamento contábil
// (mock de journal_entry) e atualiza a Divergence relacionada para 'resolved'.
//
// Trigger: entity automation ProposedAdjustment.update com data.status='approved'.

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const adjId = body.event?.entity_id;
    const data = body.data;

    if (!adjId || !data) {
      return Response.json({ error: 'event payload missing' }, { status: 400 });
    }

    // Idempotência: só posta uma vez
    if (data.status !== 'approved' || data.posted_at) {
      return Response.json({ skipped: true, reason: 'not approved or already posted' });
    }

    // TODO PR real: integração com sistema contábil (SAP/Oracle/etc).
    // Por ora, geramos um journal_entry_id determinístico e marcamos como posted.
    const journalEntryId = `JE-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${adjId.slice(-6).toUpperCase()}`;

    await base44.asServiceRole.entities.ProposedAdjustment.update(adjId, {
      status: 'posted',
      posted_at: new Date().toISOString(),
      journal_entry_id: journalEntryId,
    });

    // Resolve a Divergence relacionada
    if (data.divergence_id) {
      await base44.asServiceRole.entities.Divergence.update(data.divergence_id, {
        status: 'resolved',
        resolved_at: new Date().toISOString(),
        resolved_by: `journal:${journalEntryId}`,
      });
    }

    return Response.json({
      success: true,
      adjustment_id: adjId,
      journal_entry_id: journalEntryId,
    });
  } catch (e) {
    console.error('postApprovedAdjustment error:', e);
    return Response.json({ error: e.message }, { status: 500 });
  }
});