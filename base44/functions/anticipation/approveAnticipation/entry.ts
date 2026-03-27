import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { request_id, approved } = await req.json();

        const user = await base44.auth.me();
        
        const request = await base44.entities.AnticipationRequest.get(request_id);
        
        if (approved) {
            await base44.entities.AnticipationRequest.update(request_id, {
                status: 'approved',
                analyzed_by: user.email,
                analyzed_at: new Date().toISOString(),
                approved_amount: request.requested_amount // Simplified
            });
            
            // Trigger settlement creation for the anticipation
            // await base44.functions.invoke('settlement/createFromAnticipation', { ... })
        } else {
            await base44.entities.AnticipationRequest.update(request_id, {
                status: 'rejected',
                analyzed_by: user.email,
                analyzed_at: new Date().toISOString()
            });
        }

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});