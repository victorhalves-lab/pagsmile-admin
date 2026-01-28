import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { alert_id, action } = await req.json(); // action: refund, ignore

        const user = await base44.auth.me();
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        const alert = await base44.entities.PreChargeback.get(alert_id);
        
        if (action === 'refund') {
            // Logic to refund transaction linked to alert
            // await base44.functions.invoke('transactions/refundTransaction', { transaction_id: alert.transaction_id, ... })
            
            await base44.entities.PreChargeback.update(alert_id, {
                status: 'refunded',
                resolution_action: 'manual_refund',
                resolution_date: new Date().toISOString(),
                saved_amount: alert.amount // Assumes full amount saved from CB fees/ratio
            });
        } else if (action === 'ignore') {
            await base44.entities.PreChargeback.update(alert_id, {
                status: 'ignored',
                resolution_action: 'ignored',
                resolution_date: new Date().toISOString()
            });
        }

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});