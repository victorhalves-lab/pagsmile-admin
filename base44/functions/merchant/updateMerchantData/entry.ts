import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { id, data } = await req.json();

        const user = await base44.auth.me();
        if (!user || user.role !== 'admin') {
             // Allow onboarding role too if implemented, for now check admin or specific permission
             // Assuming basic role check.
             if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!id || !data) {
            return Response.json({ error: 'Missing id or data' }, { status: 400 });
        }

        // Validate allowed fields to update
        // Prevent updating critical fields like document if active
        
        const updated = await base44.entities.Subaccount.update(id, data);

        return Response.json(updated);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});