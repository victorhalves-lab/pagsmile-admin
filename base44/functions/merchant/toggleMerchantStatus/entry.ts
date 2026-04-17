import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { id, status, reason } = await req.json();

        const user = await base44.auth.me();
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        const subaccount = await base44.entities.Subaccount.get(id);

        const note = {
            user: user.email,
            content: `Status alterado de ${subaccount.status} para ${status}. Motivo: ${reason || 'Não informado'}`,
            date: new Date().toISOString()
        };

        const updateData = {
            status: status,
            notes: [...(subaccount.notes || []), note]
        };

        if (status === 'suspended') updateData.suspension_reason = reason;

        const updated = await base44.entities.Subaccount.update(id, updateData);

        return Response.json(updated);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});