import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { id, type, value, reason, action } = await req.json();

        const user = await base44.auth.me();
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        let result;
        if (action === 'add') {
            result = await base44.entities.Blocklist.create({
                type,
                value,
                reason,
                scope: 'global', // simplified
                created_at: new Date().toISOString(),
                created_by: user.email
            });
        } else if (action === 'remove') {
            result = await base44.entities.Blocklist.delete(id);
        }

        return Response.json({ success: true, result });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});