import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    const base44 = createClientFromRequest(req);
    
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
        return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { approvalId, decision, adminComments } = await req.json();

    if (!approvalId || !decision) {
        return Response.json({ error: 'Approval ID and decision are required' }, { status: 400 });
    }

    if (!['approved', 'rejected'].includes(decision)) {
        return Response.json({ error: 'Decision must be approved or rejected' }, { status: 400 });
    }

    try {
        // Get the approval request
        const approvals = await base44.asServiceRole.entities.WithdrawalApproval.filter({ id: approvalId });
        if (!approvals || approvals.length === 0) {
            return Response.json({ error: 'Withdrawal approval not found' }, { status: 404 });
        }

        const approval = approvals[0];

        // Update the approval
        await base44.asServiceRole.entities.WithdrawalApproval.update(approvalId, {
            status: decision,
            reviewed_by: user.email,
            reviewed_at: new Date().toISOString(),
            admin_comments: adminComments || '',
            rejection_reason: decision === 'rejected' ? adminComments : null
        });

        if (decision === 'approved') {
            // Update the withdrawal to processing
            await base44.asServiceRole.entities.Withdrawal.update(approval.withdrawal_id, {
                status: 'processing'
            });

            // In a real scenario, trigger the actual withdrawal process here
            // For now, we'll just mark it as processing

            // Send notification
            const subaccount = await base44.asServiceRole.entities.Subaccount.filter({ id: approval.subaccount_id });
            if (subaccount && subaccount.length > 0) {
                await base44.asServiceRole.integrations.Core.SendEmail({
                    to: subaccount[0].email,
                    subject: 'Saque Aprovado - PagSmile',
                    body: `Olá ${approval.business_name},\n\nSeu saque de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(approval.net_amount)} foi APROVADO!\n\nO valor será creditado em sua conta bancária em até 1 dia útil.\n\nEquipe PagSmile`
                });
            }
        } else {
            // Update the withdrawal to failed/cancelled
            await base44.asServiceRole.entities.Withdrawal.update(approval.withdrawal_id, {
                status: 'cancelled',
                failure_reason: adminComments
            });

            // Send rejection notification
            const subaccount = await base44.asServiceRole.entities.Subaccount.filter({ id: approval.subaccount_id });
            if (subaccount && subaccount.length > 0) {
                await base44.asServiceRole.integrations.Core.SendEmail({
                    to: subaccount[0].email,
                    subject: 'Saque Não Aprovado - PagSmile',
                    body: `Olá ${approval.business_name},\n\nSeu saque de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(approval.amount)} não pôde ser aprovado.\n\nMotivo: ${adminComments || 'Não especificado'}\n\nPara mais informações, entre em contato com nosso suporte.\n\nEquipe PagSmile`
                });
            }
        }

        return Response.json({ 
            success: true, 
            message: `Withdrawal ${decision}` 
        });

    } catch (error) {
        return Response.json({ 
            error: 'Failed to approve withdrawal', 
            details: error.message 
        }, { status: 500 });
    }
});