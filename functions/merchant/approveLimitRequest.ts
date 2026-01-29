import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    const base44 = createClientFromRequest(req);
    
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
        return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { requestId, decision, adminComments, approvedLimit } = await req.json();

    if (!requestId || !decision) {
        return Response.json({ error: 'Request ID and decision are required' }, { status: 400 });
    }

    if (!['approved', 'rejected'].includes(decision)) {
        return Response.json({ error: 'Decision must be approved or rejected' }, { status: 400 });
    }

    try {
        // Get the request
        const requests = await base44.asServiceRole.entities.ClientLimitRequest.filter({ id: requestId });
        if (!requests || requests.length === 0) {
            return Response.json({ error: 'Limit request not found' }, { status: 404 });
        }

        const request = requests[0];

        // Update the request
        await base44.asServiceRole.entities.ClientLimitRequest.update(requestId, {
            status: decision,
            reviewed_by: user.email,
            reviewed_at: new Date().toISOString(),
            admin_comments: adminComments || '',
            approved_limit: decision === 'approved' ? (approvedLimit || request.requested_limit) : null,
            rejection_reason: decision === 'rejected' ? adminComments : null
        });

        // If approved, update the subaccount limits
        if (decision === 'approved') {
            const limitToApply = approvedLimit || request.requested_limit;
            const subaccount = await base44.asServiceRole.entities.Subaccount.filter({ id: request.subaccount_id });
            
            if (subaccount && subaccount.length > 0) {
                const currentLimits = subaccount[0].limits || {};
                const updatedLimits = {
                    ...currentLimits,
                    [request.limit_type]: limitToApply
                };

                await base44.asServiceRole.entities.Subaccount.update(request.subaccount_id, {
                    limits: updatedLimits
                });

                // Send notification to client
                await base44.asServiceRole.integrations.Core.SendEmail({
                    to: subaccount[0].email,
                    subject: 'Solicitação de Limite Aprovada - PagSmile',
                    body: `Olá ${subaccount[0].business_name},\n\nSua solicitação de aumento de limite foi APROVADA!\n\nTipo: ${request.limit_type}\nLimite Anterior: R$ ${request.current_limit.toLocaleString('pt-BR')}\nNovo Limite: R$ ${limitToApply.toLocaleString('pt-BR')}\n\n${adminComments ? `Observações: ${adminComments}\n\n` : ''}Equipe PagSmile`
                });
            }
        } else {
            // Send rejection notification
            const subaccount = await base44.asServiceRole.entities.Subaccount.filter({ id: request.subaccount_id });
            if (subaccount && subaccount.length > 0) {
                await base44.asServiceRole.integrations.Core.SendEmail({
                    to: subaccount[0].email,
                    subject: 'Solicitação de Limite - PagSmile',
                    body: `Olá ${subaccount[0].business_name},\n\nInfelizmente, sua solicitação de aumento de limite não pôde ser aprovada no momento.\n\nMotivo: ${adminComments || 'Não especificado'}\n\nPara mais informações, entre em contato com nosso suporte.\n\nEquipe PagSmile`
                });
            }
        }

        return Response.json({ 
            success: true, 
            message: `Limit request ${decision}`,
            approved_limit: decision === 'approved' ? (approvedLimit || request.requested_limit) : null
        });

    } catch (error) {
        return Response.json({ 
            error: 'Failed to approve limit request', 
            details: error.message 
        }, { status: 500 });
    }
});