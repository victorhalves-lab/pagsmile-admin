import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Mock financial health stats
        const stats = {
            revenue: 2500000,
            cost: 1700000,
            margin_abs: 800000,
            margin_pct: 0.95,
            negative_margin_merchants: 12
        };

        return Response.json({ success: true, stats });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});