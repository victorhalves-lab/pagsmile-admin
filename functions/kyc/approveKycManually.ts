import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { subaccount_id, notes, conditions } = await req.json();

        if (!subaccount_id) {
            return Response.json({ error: 'Missing subaccount_id' }, { status: 400 });
        }

        await base44.entities.Subaccount.update(subaccount_id, {
            status: 'kyc_approved',
            kyc_decision: 'approved',
            approval_notes: notes,
            kyc_approved_at: new Date().toISOString()
        });

         await base44.entities.OnboardingEvent.create({
            subaccount_id,
            event_type: 'kyc_approved',
            details: `Manually approved by analyst. Notes: ${notes}. Conditions: ${JSON.stringify(conditions)}`,
            timestamp: new Date().toISOString(),
            actor: 'analyst'
        });

        return Response.json({ success: true, message: 'KYC Approved Manually' });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});