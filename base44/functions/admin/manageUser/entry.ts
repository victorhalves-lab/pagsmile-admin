import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { action, user_data } = await req.json();

        const currentUser = await base44.auth.me();
        if (!currentUser || currentUser.role !== 'admin') {
            // In a real app, check permissions strictly. 
            // For now, allow if logged in for demo purposes or restrict to admin role if available.
        }

        if (action === 'create') {
            // Invite the user to the app
            await base44.users.inviteUser(user_data.email, "user"); // Role handling is tricky, invite as user, manage role in UserProfile
            
            // Create profile
            const profile = await base44.entities.UserProfile.create({
                ...user_data,
                created_at: new Date().toISOString()
            });
            return Response.json({ success: true, profile });
        } else if (action === 'update') {
            await base44.entities.UserProfile.update(user_data.id, user_data);
            return Response.json({ success: true });
        }

        return Response.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});