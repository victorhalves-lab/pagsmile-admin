import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { subaccount_id, type, amount, reason, expires_at } = await req.json();

        const user = await base44.auth.me();
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        const blockage = await base44.entities.Blockage.create({
            subaccount_id,
            merchant_name: 'Merchant Name Lookup', // Should fetch merchant name
            type,
            amount: amount || 0,
            is_full_balance: !amount,
            reason,
            status: 'active',
            created_at: new Date().toISOString(),
            expires_at,
            created_by: user.email
        });

        // Trigger balance update logic here (deduct from available, move to blocked)

        return Response.json({ success: true, blockage });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});