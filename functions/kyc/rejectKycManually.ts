import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { subaccount_id, reason } = await req.json();

        if (!subaccount_id || !reason) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await base44.entities.Subaccount.update(subaccount_id, {
            status: 'kyc_rejected',
            kyc_decision: 'rejected',
            rejection_reason: reason
        });

         await base44.entities.OnboardingEvent.create({
            subaccount_id,
            event_type: 'kyc_rejected', // Note: using a standard key from enum if possible, or mapping custom
            details: `Manually rejected. Reason: ${reason}`,
            timestamp: new Date().toISOString(),
            actor: 'analyst'
        });

        return Response.json({ success: true, message: 'KYC Rejected' });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});