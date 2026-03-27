import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { subaccount_id } = await req.json();

        if (!subaccount_id) {
            return Response.json({ error: 'Missing subaccount_id' }, { status: 400 });
        }

        const subaccount = await base44.entities.Subaccount.get(subaccount_id);
        
        if (subaccount.status !== 'kyc_approved') {
             return Response.json({ error: 'Subaccount not in approved state' }, { status: 400 });
        }

        // Simulate activation steps (Gateway creation, Banking account, etc.)
        // In real app, these would be calls to external APIs

        await base44.entities.Subaccount.update(subaccount_id, {
            status: 'active',
            activated_at: new Date().toISOString()
        });

        await base44.entities.OnboardingEvent.create({
            subaccount_id,
            event_type: 'merchant_activated',
            details: 'Merchant fully activated in Gateway and Banking systems.',
            timestamp: new Date().toISOString(),
            actor: 'system'
        });

        return Response.json({ success: true, message: 'Merchant Activated' });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});