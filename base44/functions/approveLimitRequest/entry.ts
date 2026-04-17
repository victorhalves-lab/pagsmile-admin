import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { requestId, action, comments, approvedLimit } = await req.json();

    if (!requestId || !action || !comments) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get the request
    const requests = await base44.asServiceRole.entities.ClientLimitRequest.filter({ id: requestId });
    const request = requests[0];

    if (!request) {
      return Response.json({ error: 'Request not found' }, { status: 404 });
    }

    // Update the request
    const updatedRequest = await base44.asServiceRole.entities.ClientLimitRequest.update(requestId, {
      status: action,
      reviewed_by: user.email,
      reviewed_at: new Date().toISOString(),
      admin_comments: comments,
      approved_limit: action === 'approved' ? approvedLimit : null
    });

    // If approved, update the merchant's limits
    if (action === 'approved') {
      const subaccounts = await base44.asServiceRole.entities.Subaccount.filter({ id: request.subaccount_id });
      const subaccount = subaccounts[0];

      if (subaccount) {
        const limitsConfig = subaccount.limits || {};
        limitsConfig[request.limit_type] = approvedLimit;

        await base44.asServiceRole.entities.Subaccount.update(request.subaccount_id, {
          limits: limitsConfig
        });
      }
    }

    // Send notification email to client
    const subaccounts = await base44.asServiceRole.entities.Subaccount.filter({ id: request.subaccount_id });
    const subaccount = subaccounts[0];

    if (subaccount?.email) {
      const subject = action === 'approved' 
        ? 'Solicitação de Limite Aprovada' 
        : 'Solicitação de Limite Rejeitada';
      
      const body = action === 'approved'
        ? `Sua solicitação de aumento de limite foi aprovada!\n\nNovo limite: R$ ${approvedLimit.toLocaleString('pt-BR')}\nComentários: ${comments}`
        : `Sua solicitação de aumento de limite foi rejeitada.\n\nMotivo: ${comments}`;

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: subaccount.email,
        subject,
        body
      });
    }

    return Response.json({ success: true, data: updatedRequest });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});