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
        if (!subaccount) {
            return Response.json({ error: 'Subaccount not found' }, { status: 404 });
        }

        // Simulate sending email
        // In a real scenario, we would use base44.integrations.SendEmail
        console.log(`Sending KYC reminder to ${subaccount.email}`);

        // Log event
        await base44.entities.OnboardingEvent.create({
            subaccount_id,
            event_type: 'reminder_sent',
            details: 'KYC reminder sent to representative',
            timestamp: new Date().toISOString(),
            actor: 'system'
        });

        return Response.json({ success: true, message: 'Reminder sent' });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});