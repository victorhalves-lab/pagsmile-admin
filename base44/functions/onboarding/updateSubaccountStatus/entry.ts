import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { subaccount_id, new_status, details } = await req.json();

        if (!subaccount_id || !new_status) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Update subaccount status
        await base44.entities.Subaccount.update(subaccount_id, {
            status: new_status,
            last_activity_at: new Date().toISOString()
        });

        // Log event
        await base44.entities.OnboardingEvent.create({
            subaccount_id,
            event_type: 'status_change', // Using a generic type mapped to status change or specific based on status
            details: `Status changed to ${new_status}. ${details || ''}`,
            timestamp: new Date().toISOString(),
            actor: 'user' // or 'system' depending on context, assuming user action for now
        });

        return Response.json({ success: true, message: 'Status updated successfully' });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});