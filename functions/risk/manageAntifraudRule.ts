import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { rule_id, data, action } = await req.json(); // action: create, update, delete

        const user = await base44.auth.me();
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        let result;
        if (action === 'create') {
            result = await base44.entities.AntifraudRule.create({
                ...data,
                created_at: new Date().toISOString()
            });
        } else if (action === 'update') {
            result = await base44.entities.AntifraudRule.update(rule_id, {
                ...data,
                updated_at: new Date().toISOString()
            });
        } else if (action === 'delete') {
            result = await base44.entities.AntifraudRule.delete(rule_id);
        }

        return Response.json({ success: true, result });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});