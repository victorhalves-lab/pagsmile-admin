import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { id, mcc, reason } = await req.json();

        const user = await base44.auth.me();
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        const subaccount = await base44.entities.Subaccount.get(id);
        
        const note = {
            user: user.email,
            content: `MCC alterado de ${subaccount.mcc} para ${mcc}. Motivo: ${reason || 'Não informado'}`,
            date: new Date().toISOString()
        };

        const updated = await base44.entities.Subaccount.update(id, {
            mcc: mcc,
            notes: [...(subaccount.notes || []), note]
        });

        return Response.json(updated);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});