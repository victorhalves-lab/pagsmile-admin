import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { subaccount_id, analyst_id } = await req.json();

        if (!subaccount_id || !analyst_id) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await base44.entities.Subaccount.update(subaccount_id, {
            assigned_analyst_id: analyst_id
        });

        return Response.json({ success: true, message: 'Analyst assigned' });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});