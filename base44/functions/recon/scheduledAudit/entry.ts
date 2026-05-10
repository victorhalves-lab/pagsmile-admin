// PR-13 · Auditoria agendada (a cada 4h).
// Reviewer audita amostras aleatórias de matches já feitos pelo pipeline,
// e re-analisa divergências que estão paradas há > 24h em status 'detected'.
//
// Trigger: scheduled automation, repeat_interval=4, repeat_unit=hours.

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const STUCK_THRESHOLD_MS = 1000 * 60 * 60 * 24; // 24h

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    // Quando rodando via automation o user é o app builder; em dev permite admin manual.
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 1) Re-aciona Investigador para divergências paradas
    const stuckDivergences = await base44.asServiceRole.entities.Divergence.filter({
      status: 'detected',
    });
    const trulyStuck = stuckDivergences.filter(
      (d) => Date.now() - new Date(d.detected_at).getTime() > STUCK_THRESHOLD_MS
    );

    let revived = 0;
    for (const d of trulyStuck.slice(0, 10)) {
      try {
        await base44.functions.invoke('recon/triggerInvestigator', { divergence_id: d.id });
        revived++;
      } catch (e) {
        console.error(`Failed to revive divergence ${d.id}:`, e.message);
      }
    }

    // 2) Sample audit: pega 5 matches recentes sem reviewer_score e marca para auditoria
    const matches = await base44.asServiceRole.entities.ReconciliationMatch.list('-matched_at', 50);
    const unaudited = matches.filter((m) => m.reviewer_score == null).slice(0, 5);

    let auditConvId = null;
    if (unaudited.length > 0) {
      const conv = await base44.asServiceRole.agents.createConversation({
        agent_name: 'reviewer',
        metadata: {
          name: `Scheduled Audit · ${new Date().toISOString().slice(0, 16)}`,
          description: `Auditoria 4h: ${unaudited.length} matches amostrados.`,
        },
      });
      auditConvId = conv.id;

      const ids = unaudited.map((m) => m.id).join(', ');
      await base44.asServiceRole.agents.addMessage(conv, {
        role: 'user',
        content: [
          `Auditoria agendada: revise os seguintes ReconciliationMatch IDs: ${ids}.`,
          `Para cada um, atribua reviewer_score (0-100) baseado em:`,
          `- Coerência entre Transaction, AcquirerRecord e BankMovement.`,
          `- Tolerâncias aplicadas justificáveis.`,
          `- Confidence_score consistente com evidence.`,
          `Atualize cada match com reviewer_score e reviewer_notes (1-2 frases).`,
        ].join('\n'),
      });

      await base44.asServiceRole.entities.AgentRun.create({
        agent: 'reviewer',
        triggered_by: 'scheduled:audit_4h',
        started_at: new Date().toISOString(),
        status: 'running',
        input_ref: { conversation_id: conv.id, match_ids: unaudited.map((m) => m.id) },
      });
    }

    return Response.json({
      success: true,
      revived_divergences: revived,
      audited_matches: unaudited.length,
      audit_conversation_id: auditConvId,
    });
  } catch (e) {
    console.error('scheduledAudit error:', e);
    return Response.json({ error: e.message }, { status: 500 });
  }
});