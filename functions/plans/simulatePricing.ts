import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { mcc, tpv, mix, plan_id } = await req.json();
        
        // Mock simulation logic
        // In real world: load plan fees, load mcc costs, calculate margin
        
        const revenue = tpv * 0.0406; // Mock 4.06%
        const cost = tpv * 0.0207; // Mock 2.07%
        const margin = revenue - cost;
        
        const simulation = {
            revenue,
            cost,
            margin,
            margin_pct: (margin / tpv) * 100,
            details: [
                { product: "Visa 1x", volume: tpv * 0.15, revenue: tpv * 0.15 * 0.0399, cost: tpv * 0.15 * 0.0203 },
                // ... more details
            ]
        };

        return Response.json({ success: true, simulation });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});