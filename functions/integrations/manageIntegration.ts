import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { integration_id, action, config } = await req.json();

        const user = await base44.auth.me();
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        if (action === 'test') {
            // Mock test connection
            const success = Math.random() > 0.1;
            return Response.json({ 
                success, 
                latency: Math.floor(Math.random() * 500), 
                message: success ? 'Connection successful' : 'Connection timeout' 
            });
        } else if (action === 'update') {
            await base44.entities.IntegrationConfig.update(integration_id, config);
            return Response.json({ success: true });
        }

        return Response.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});