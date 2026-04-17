import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { subaccount_id, documents_requested, notes } = await req.json();

        if (!subaccount_id || !documents_requested) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Update subaccount status if needed, or just log the request
        await base44.entities.Subaccount.update(subaccount_id, {
            status: 'awaiting_docs'
        });

        // Simulate sending request email
        console.log(`Requesting documents: ${documents_requested.join(', ')}`);

        // Log event
        await base44.entities.OnboardingEvent.create({
            subaccount_id,
            event_type: 'doc_requested',
            details: `Documents requested: ${documents_requested.join(', ')}. Notes: ${notes || ''}`,
            timestamp: new Date().toISOString(),
            actor: 'analyst'
        });

        return Response.json({ success: true, message: 'Documents requested' });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});