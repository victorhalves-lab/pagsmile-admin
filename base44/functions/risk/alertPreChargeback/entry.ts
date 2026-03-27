import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { event, data } = await req.json();
        
        if (data.status === 'pending') {
            console.log(`New Pre-Chargeback alert: ${data.alert_id} for merchant ${data.merchant_name}`);
            // Send notification logic here
        }
        
        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});