import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    const base44 = createClientFromRequest(req);
    
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
        return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { action, userId, subaccountId, userData } = await req.json();

    if (!action) {
        return Response.json({ error: 'Action is required' }, { status: 400 });
    }

    try {
        let result;

        switch (action) {
            case 'create':
                if (!subaccountId || !userData?.email || !userData?.full_name) {
                    return Response.json({ error: 'Subaccount ID, email and full name are required' }, { status: 400 });
                }

                result = await base44.asServiceRole.entities.ClientUser.create({
                    user_id: `user_${Date.now()}`,
                    subaccount_id: subaccountId,
                    full_name: userData.full_name,
                    email: userData.email,
                    phone: userData.phone || '',
                    role: userData.role || 'viewer',
                    status: 'pending',
                    invited_by: user.email,
                    invited_at: new Date().toISOString()
                });

                // Send invitation email
                await base44.asServiceRole.integrations.Core.SendEmail({
                    to: userData.email,
                    subject: 'Convite para acessar o Admin PagSmile',
                    body: `Olá ${userData.full_name},\n\nVocê foi convidado para acessar o Admin da sua conta PagSmile com o papel de ${userData.role}.\n\nClique no link abaixo para ativar sua conta.\n\nEquipe PagSmile`
                });

                break;

            case 'update':
                if (!userId || !userData) {
                    return Response.json({ error: 'User ID and data are required' }, { status: 400 });
                }

                result = await base44.asServiceRole.entities.ClientUser.update(userId, userData);
                break;

            case 'delete':
                if (!userId) {
                    return Response.json({ error: 'User ID is required' }, { status: 400 });
                }

                result = await base44.asServiceRole.entities.ClientUser.delete(userId);
                break;

            case 'reset_password':
                if (!userId || !userData?.email) {
                    return Response.json({ error: 'User ID and email are required' }, { status: 400 });
                }

                // Send password reset email
                await base44.asServiceRole.integrations.Core.SendEmail({
                    to: userData.email,
                    subject: 'Resetar sua senha - PagSmile',
                    body: `Olá,\n\nRecebemos uma solicitação para resetar sua senha.\n\nClique no link abaixo para criar uma nova senha.\n\nEquipe PagSmile`
                });

                result = { success: true, message: 'Reset email sent' };
                break;

            default:
                return Response.json({ error: `Unknown action: ${action}` }, { status: 400 });
        }

        return Response.json({ success: true, data: result });

    } catch (error) {
        return Response.json({ 
            error: 'Failed to manage client user', 
            details: error.message 
        }, { status: 500 });
    }
});