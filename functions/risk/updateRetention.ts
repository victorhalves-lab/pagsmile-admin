import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { subaccount_id, new_rr_pct, new_rr_days, reason } = await req.json();

        const user = await base44.auth.me();
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        // Update Subaccount or specialized config entity
        // Here assuming Subaccount has retention_config field
        const subaccount = await base44.entities.Subaccount.get(subaccount_id);
        
        await base44.entities.Subaccount.update(subaccount_id, {
            retention_config: {
                ...subaccount.retention_config,
                rolling_reserve_pct: new_rr_pct,
                rolling_reserve_days: new_rr_days,
                override_reason: reason,
                last_updated_by: user.email,
                last_updated_at: new Date().toISOString()
            }
        });

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});