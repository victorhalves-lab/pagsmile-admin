// Aciona o agente Communicator quando uma Divergence transita para status='investigated'.
// Communicator decide entre criar ProposedAdjustment (interno) ou AcquirerDispute (externo).
//
// Trigger: entity automation Divergence.update com data.status='investigated'.

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    let divergenceId = body.divergence_id;
    let divergence = null;

    if (!divergenceId && body.event?.entity_name === 'Divergence') {
      divergenceId = body.event.entity_id;
      divergence = body.data;
    }

    if (!divergenceId) {
      return Response.json({ error: 'divergence_id required' }, { status: 400 });
    }

    if (!divergence) {
      const list = await base44.asServiceRole.entities.Divergence.filter({ id: divergenceId });
      divergence = list[0];
    }

    if (!divergence) {
      return Response.json({ error: 'divergence not found' }, { status: 404 });
    }

    if (divergence.status !== 'investigated') {
      return Response.json({
        skipped: true,
        reason: `status='${divergence.status}', expected 'investigated'`,
      });
    }

    const conversation = await base44.asServiceRole.agents.createConversation({
      agent_name: 'communicator',
      metadata: {
        name: `Auto-Communication · ${divergenceId}`,
        description: `Auto-trigger após investigação. Owner=${divergence.owner}, Action=${divergence.proposed_action}`,
      },
    });

    const prompt = [
      `A Divergence ID="${divergenceId}" foi investigada. Agora prepare a comunicação/ação.`,
      ``,
      `Contexto:`,
      `- Bucket: ${divergence.bucket}`,
      `- Owner: ${divergence.owner}`,
      `- Proposed action: ${divergence.proposed_action}`,
      `- Root cause: ${divergence.root_cause || 'N/A'}`,
      `- Delta: ${divergence.delta_cents} centavos`,
      ``,
      `Decida e execute UMA das opções:`,
      `A) Se proposed_action='adjust' → CRIAR ProposedAdjustment com débito/crédito contábil, valor e rationale (4 partes).`,
      `B) Se proposed_action='contest' → CRIAR AcquirerDispute com letter_text formal, dispute_type e cláusula contratual.`,
      `C) Se proposed_action='monitor'/'suppress' → ATUALIZAR Divergence.status='proposed' sem criar artefato.`,
      ``,
      `Ao final, ATUALIZE Divergence.status='proposed'.`,
    ].join('\n');

    await base44.asServiceRole.agents.addMessage(conversation, {
      role: 'user',
      content: prompt,
    });

    await base44.asServiceRole.entities.AgentRun.create({
      agent: 'communicator',
      triggered_by: `divergence:${divergenceId}`,
      started_at: new Date().toISOString(),
      status: 'running',
      input_ref: { divergence_id: divergenceId, conversation_id: conversation.id },
    });

    return Response.json({ success: true, divergence_id: divergenceId, conversation_id: conversation.id });
  } catch (error) {
    console.error('triggerCommunicator error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});