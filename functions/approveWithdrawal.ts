import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { withdrawalId, action, comments } = await req.json();

    if (!withdrawalId || !action) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const withdrawals = await base44.asServiceRole.entities.Withdrawal.filter({ id: withdrawalId });
    const withdrawal = withdrawals[0];

    if (!withdrawal) {
      return Response.json({ error: 'Withdrawal not found' }, { status: 404 });
    }

    let updateData = {};

    if (action === 'approve') {
      updateData = {
        status: 'processing',
        processed_date: new Date().toISOString()
      };
    } else if (action === 'reject') {
      updateData = {
        status: 'cancelled',
        failure_reason: comments || 'Rejeitado pelo Admin Interno'
      };
    }

    const result = await base44.asServiceRole.entities.Withdrawal.update(withdrawalId, updateData);

    // Send notification to client
    if (withdrawal.subaccount_id) {
      const subaccounts = await base44.asServiceRole.entities.Subaccount.filter({ id: withdrawal.subaccount_id });
      const subaccount = subaccounts[0];

      if (subaccount?.email) {
        const subject = action === 'approve' ? 'Saque Aprovado' : 'Saque Rejeitado';
        const body = action === 'approve'
          ? `Seu saque de R$ ${withdrawal.amount.toLocaleString('pt-BR')} foi aprovado e está sendo processado.`
          : `Seu saque de R$ ${withdrawal.amount.toLocaleString('pt-BR')} foi rejeitado.\n\nMotivo: ${comments}`;

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: subaccount.email,
          subject,
          body
        });
      }
    }

    return Response.json({ success: true, data: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});