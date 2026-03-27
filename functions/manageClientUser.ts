import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { action, userId, userData } = await req.json();

    let result;

    switch (action) {
      case 'create':
        result = await base44.asServiceRole.entities.ClientUser.create({
          ...userData,
          invitation_sent_at: new Date().toISOString(),
          created_by: user.email
        });
        
        // Send invitation email
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: userData.email,
          subject: 'Convite para acessar o Admin PagSmile',
          body: `Olá ${userData.full_name},\n\nVocê foi convidado para acessar o Admin da subconta.\n\nClique aqui para aceitar o convite e criar sua senha.`
        });
        break;

      case 'update':
        result = await base44.asServiceRole.entities.ClientUser.update(userId, userData);
        break;

      case 'delete':
        result = await base44.asServiceRole.entities.ClientUser.delete(userId);
        break;

      case 'reset_password':
        // Send password reset email
        const clientUser = await base44.asServiceRole.entities.ClientUser.filter({ id: userId });
        if (clientUser[0]) {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: clientUser[0].email,
            subject: 'Reset de Senha - PagSmile Admin',
            body: `Olá,\n\nClique no link abaixo para redefinir sua senha:\n[Link de reset]`
          });
          result = { success: true, message: 'E-mail de reset enviado' };
        }
        break;

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

    return Response.json({ success: true, data: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});