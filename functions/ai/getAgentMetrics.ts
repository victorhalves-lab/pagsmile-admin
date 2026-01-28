import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Mock metrics
        const metrics = {
            priscila: {
                analyses: 1234,
                success_rate: 98,
                avg_time: 2.3,
                conversion: 38
            },
            helena: {
                analyses: 856,
                success_rate: 99,
                avg_time: 4.5,
                auto_approval: 72
            },
            dia: {
                interactions: 23456,
                answered: 95,
                avg_time: 0.8
            }
        };

        return Response.json({ success: true, metrics });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});