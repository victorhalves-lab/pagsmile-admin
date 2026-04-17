import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { event, data, old_data } = await req.json();

        // Check if status changed to failing or failures increased significantly
        if (data.status === 'failing' && old_data?.status !== 'failing') {
             // Send alert to operations team (mock)
             // Could create a notification entity or send email/slack
             console.log(`Webhook failure alert for ${data.url}`);
             
             // If we had a Slack connector authorized, we would use it here.
             // For now just log and maybe return status.
        }

        return Response.json({ status: 'monitored' });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});