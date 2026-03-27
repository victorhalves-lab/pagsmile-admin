import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { current_rates, proposed_rates, volume } = await req.json();
        
        // Simple simulation logic
        // Calculate revenue for current and proposed
        // Return difference
        
        // This is a mock simulation for frontend display
        const currentRevenue = volume * 0.011; // 1.1% margin example
        const proposedRevenue = volume * 0.0095; // 0.95% margin example
        
        return Response.json({
            current_revenue: currentRevenue,
            proposed_revenue: proposedRevenue,
            difference: proposedRevenue - currentRevenue,
            impact_percent: ((proposedRevenue - currentRevenue) / currentRevenue) * 100
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});