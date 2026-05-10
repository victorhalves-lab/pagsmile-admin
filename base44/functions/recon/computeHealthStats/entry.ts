// Computa snapshot de saúde da reconciliação (PR-12).
// Retorna métricas agregadas para o Health Dashboard, sem persistir nada.
// Pode ser chamado on-demand (botão "Atualizar") ou via scheduled (cache futuro).

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Busca paralela
    const [transactions, divergences, matches, adjustments, disputes] = await Promise.all([
      base44.asServiceRole.entities.Transaction.list('-created_date', 1000),
      base44.asServiceRole.entities.Divergence.list('-detected_at', 500),
      base44.asServiceRole.entities.ReconciliationMatch.list('-matched_at', 500),
      base44.asServiceRole.entities.ProposedAdjustment.list('-proposed_at', 500),
      base44.asServiceRole.entities.AcquirerDispute.list('-prepared_at', 500),
    ]);

    // === Concilation rate ===
    const totalTx = transactions.length;
    const matchedTx = transactions.filter((t) =>
      ['matched_acquirer', 'matched_bank', 'matched_three_way', 'resolved'].includes(t.reconciliation_state)
    ).length;
    const matchRate = totalTx > 0 ? Math.round((matchedTx / totalTx) * 100) : 0;

    // === Divergence breakdown ===
    const divByBucket = {};
    const divBySeverity = { low: 0, medium: 0, high: 0, critical: 0 };
    let openDivCents = 0;
    let resolvedDiv = 0;
    for (const d of divergences) {
      divByBucket[d.bucket] = (divByBucket[d.bucket] || 0) + 1;
      if (d.severity) divBySeverity[d.severity] = (divBySeverity[d.severity] || 0) + 1;
      if (['detected', 'investigating', 'investigated', 'proposed'].includes(d.status)) {
        openDivCents += Math.abs(d.delta_cents || 0);
      }
      if (d.status === 'resolved') resolvedDiv++;
    }

    // === Match types ===
    const matchByType = {};
    for (const m of matches) matchByType[m.match_type] = (matchByType[m.match_type] || 0) + 1;

    // === Resolução ===
    const adjPending = adjustments.filter((a) =>
      ['pending', 'reviewed', 'pending_senior_review'].includes(a.status)
    ).length;
    const adjApproved = adjustments.filter((a) => ['approved', 'posted'].includes(a.status)).length;
    const dispOpen = disputes.filter((d) =>
      ['draft', 'pending_approval', 'submitted', 'in_review'].includes(d.status)
    ).length;
    const dispResolved = disputes.filter((d) => d.status === 'resolved').length;

    // === Reviewer quality ===
    const reviewedAdj = adjustments.filter((a) => a.reviewer_score != null);
    const avgReviewScore = reviewedAdj.length > 0
      ? Math.round(reviewedAdj.reduce((s, a) => s + a.reviewer_score, 0) / reviewedAdj.length)
      : null;

    // === SLA ===
    const now = Date.now();
    const stuck = divergences.filter((d) => {
      if (d.status !== 'detected') return false;
      return now - new Date(d.detected_at).getTime() > 1000 * 60 * 60 * 24; // > 24h
    }).length;

    return Response.json({
      generated_at: new Date().toISOString(),
      transactions: { total: totalTx, matched: matchedTx, match_rate_pct: matchRate },
      divergences: {
        total: divergences.length,
        resolved: resolvedDiv,
        open_value_cents: openDivCents,
        by_bucket: divByBucket,
        by_severity: divBySeverity,
        stuck_24h: stuck,
      },
      matches: { total: matches.length, by_type: matchByType },
      resolution: {
        adjustments_pending: adjPending,
        adjustments_approved: adjApproved,
        disputes_open: dispOpen,
        disputes_resolved: dispResolved,
      },
      quality: {
        avg_reviewer_score: avgReviewScore,
        reviewed_count: reviewedAdj.length,
      },
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
});