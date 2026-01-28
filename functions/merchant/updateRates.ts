import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { id, rates, reason } = await req.json();

        const user = await base44.auth.me();
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!id || !rates) {
            return Response.json({ error: 'Missing id or rates' }, { status: 400 });
        }

        // Logic to validate rates or require approval could be added here
        
        const subaccount = await base44.entities.Subaccount.get(id);
        const newRatesConfig = { ...subaccount.rates_config, ...rates };
        
        // Add to history (notes or specific history entity if it existed)
        const note = {
            user: user.email,
            content: `Taxas alteradas. Motivo: ${reason || 'Não informado'}`,
            date: new Date().toISOString()
        };

        const updated = await base44.entities.Subaccount.update(id, {
            rates_config: newRatesConfig,
            notes: [...(subaccount.notes || []), note]
        });

        return Response.json(updated);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});