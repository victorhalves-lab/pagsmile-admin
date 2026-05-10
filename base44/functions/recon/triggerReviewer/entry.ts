// Aciona o agente Reviewer quando ProposedAdjustment ou AcquirerDispute é criado.
// Reviewer pontua de 0-100 e decide aprovação/escalação.
//
// Trigger: entity automation ProposedAdjustment.create OU AcquirerDispute.create.

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const entityName = body.event?.entity_name;
    const entityId = body.event?.entity_id;
    const data = body.data;

    if (!entityName || !entityId) {
      return Response.json({ error: 'event payload missing' }, { status: 400 });
    }

    if (!['ProposedAdjustment', 'AcquirerDispute'].includes(entityName)) {
      return Response.json({ skipped: true, reason: `not reviewable entity: ${entityName}` });
    }

    // Idempotência: só roda em status pending/draft
    const isAdjustment = entityName === 'ProposedAdjustment';
    const expectedStatus = isAdjustment ? 'pending' : 'draft';
    if (data?.status && data.status !== expectedStatus) {
      return Response.json({
        skipped: true,
        reason: `status='${data.status}', expected '${expectedStatus}'`,
      });
    }

    const conversation = await base44.asServiceRole.agents.createConversation({
      agent_name: 'reviewer',
      metadata: {
        name: `Auto-Review · ${entityName}:${entityId}`,
        description: `Quality gate automatizado.`,
      },
    });

    const prompt = [
      `Revise o artefato ${entityName} ID="${entityId}".`,
      ``,
      isAdjustment
        ? `Tipo: Ajuste contábil interno proposto pelo Communicator.\nValide: contas débito/crédito coerentes, rationale com 4 partes (o quê / por quê / qual conta absorve / evidência), valor consistente com delta da Divergence.`
        : `Tipo: Carta de dispute para adquirente preparada pelo Communicator.\nValide: tom formal PT-BR, cláusula contratual referenciada, evidências citadas, dispute_type coerente com bucket da Divergence.`,
      ``,
      `Sua tarefa:`,
      `1. Ler o artefato e a Divergence relacionada.`,
      `2. Pontuar 0-100 (factual accuracy + completeness + coherence + defensibility).`,
      `3. Atualizar reviewer_score, reviewer_at, reviewer_notes no artefato.`,
      `4. Se score >= 80 → status='reviewed' (pronto para aprovação humana).`,
      `5. Se score < 80 → status='pending_senior_review' + notas explicando gaps.`,
    ].join('\n');

    await base44.asServiceRole.agents.addMessage(conversation, {
      role: 'user',
      content: prompt,
    });

    await base44.asServiceRole.entities.AgentRun.create({
      agent: 'reviewer',
      triggered_by: `${entityName.toLowerCase()}:${entityId}`,
      started_at: new Date().toISOString(),
      status: 'running',
      input_ref: { entity_name: entityName, entity_id: entityId, conversation_id: conversation.id },
    });

    return Response.json({ success: true, entity: entityName, entity_id: entityId, conversation_id: conversation.id });
  } catch (error) {
    console.error('triggerReviewer error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});