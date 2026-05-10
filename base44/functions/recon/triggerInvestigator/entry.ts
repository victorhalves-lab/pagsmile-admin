// Aciona o agente Investigador IA sobre uma divergência específica.
//
// Pode ser chamado:
//   - Manualmente (payload {divergence_id})
//   - Via automation entity (Divergence.create) — payload { event, data }
//
// Cria conversa com agent_name='investigator' e envia mensagem inicial
// estruturada com o ID da divergência.

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Payload pode vir em 2 formatos:
    //   1) Manual: { divergence_id: "..." }
    //   2) Automation: { event: { type, entity_name, entity_id }, data: {...} }
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

    // Carrega a divergência se ainda não tem (idempotência: só dispara se status=detected)
    if (!divergence) {
      const list = await base44.asServiceRole.entities.Divergence.filter({ id: divergenceId });
      divergence = list[0];
    }

    if (!divergence) {
      return Response.json({ error: 'divergence not found', divergenceId }, { status: 404 });
    }

    if (divergence.status !== 'detected') {
      return Response.json({
        skipped: true,
        reason: `divergence status is '${divergence.status}', expected 'detected'`,
        divergenceId,
      });
    }

    // Marca como 'investigating' antes de chamar o agente (evita re-trigger)
    await base44.asServiceRole.entities.Divergence.update(divergenceId, {
      status: 'investigating',
    });

    // Cria conversa com o Investigador
    const conversation = await base44.asServiceRole.agents.createConversation({
      agent_name: 'investigator',
      metadata: {
        name: `Auto-Investigation · ${divergenceId}`,
        description: `Auto-trigger via entity automation on Divergence.${divergence.bucket}`,
      },
    });

    const prompt = [
      `Investigue a Divergence ID="${divergenceId}".`,
      `Bucket: ${divergence.bucket}. Severity: ${divergence.severity}.`,
      divergence.delta_cents != null ? `Delta: ${divergence.delta_cents} centavos.` : '',
      divergence.transaction_id ? `Transaction relacionada: ${divergence.transaction_id}.` : '',
      divergence.acquirer_record_id ? `AcquirerRecord ID: ${divergence.acquirer_record_id}.` : '',
      divergence.bank_movement_id ? `BankMovement ID: ${divergence.bank_movement_id}.` : '',
      ``,
      `Sua tarefa:`,
      `1. Ler os registros relacionados (Transaction, AcquirerRecord, BankMovement) via tools.`,
      `2. Identificar a causa raiz no formato "<quem> <fez o quê> porque <razão>".`,
      `3. Determinar owner (ops|reference_data|accounting|upstream|merchant|external).`,
      `4. Propor ação (monitor|adjust|contest|suppress|escalate|retry).`,
      `5. ATUALIZAR a Divergence com root_cause, owner, proposed_action e status='investigated'.`,
    ].filter(Boolean).join('\n');

    await base44.asServiceRole.agents.addMessage(conversation, {
      role: 'user',
      content: prompt,
    });

    // Registra AgentRun para auditoria
    await base44.asServiceRole.entities.AgentRun.create({
      agent: 'investigator',
      triggered_by: `divergence:${divergenceId}`,
      started_at: new Date().toISOString(),
      status: 'running',
      input_ref: {
        divergence_id: divergenceId,
        bucket: divergence.bucket,
        conversation_id: conversation.id,
      },
    });

    return Response.json({
      success: true,
      divergence_id: divergenceId,
      conversation_id: conversation.id,
      bucket: divergence.bucket,
    });

  } catch (error) {
    console.error('triggerInvestigator error:', error);
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
});