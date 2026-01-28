import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { subaccount_id, contact_type, notes } = await req.json();

        if (!subaccount_id || !contact_type) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Log event as a contact record
        // In a real app we might have a separate ActivityLog entity, but OnboardingEvent works for now
        await base44.entities.OnboardingEvent.create({
            subaccount_id,
            event_type: 'contact_registered', // custom type
            details: `Contact via ${contact_type}. Notes: ${notes}`,
            timestamp: new Date().toISOString(),
            actor: 'analyst'
        });

        return Response.json({ success: true, message: 'Contact registered' });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});