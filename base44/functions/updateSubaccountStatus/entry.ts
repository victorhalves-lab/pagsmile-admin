import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // Verificar autenticação
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verificar se é admin
    if (user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Obter payload
    const { subaccountId, newStatus, reason } = await req.json();

    // Validar campos obrigatórios
    if (!subaccountId || !newStatus) {
      return Response.json({ 
        error: 'Missing required fields: subaccountId and newStatus are required' 
      }, { status: 400 });
    }

    // Validar status permitidos
    const allowedStatuses = ['draft', 'pending_compliance', 'pending_documents', 'under_review', 'active', 'suspended', 'blocked', 'cancelled'];
    if (!allowedStatuses.includes(newStatus)) {
      return Response.json({ 
        error: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}` 
      }, { status: 400 });
    }

    // Buscar subconta atual
    const subaccounts = await base44.asServiceRole.entities.Subaccount.filter({ subaccount_id: subaccountId });
    
    if (!subaccounts || subaccounts.length === 0) {
      return Response.json({ error: 'Subaccount not found' }, { status: 404 });
    }

    const subaccount = subaccounts[0];
    const previousStatus = subaccount.status;

    // Atualizar status da subconta
    const updateData = {
      status: newStatus
    };

    // Adicionar campos específicos baseados no status
    if (newStatus === 'active') {
      updateData.approval_date = new Date().toISOString().split('T')[0];
      updateData.rejection_reason = null;
      updateData.suspension_reason = null;
    } else if (newStatus === 'blocked' || newStatus === 'suspended') {
      updateData.suspension_reason = reason || `Status alterado para ${newStatus} por ${user.email}`;
    } else if (newStatus === 'cancelled') {
      updateData.rejection_reason = reason || `Conta cancelada por ${user.email}`;
    }

    // Executar atualização
    await base44.asServiceRole.entities.Subaccount.update(subaccount.id, updateData);

    // Registrar nota interna sobre a alteração
    const existingNotes = subaccount.notes || [];
    const newNote = {
      user: user.email,
      content: `Status alterado de "${previousStatus}" para "${newStatus}"${reason ? `. Motivo: ${reason}` : ''}`,
      date: new Date().toISOString()
    };

    await base44.asServiceRole.entities.Subaccount.update(subaccount.id, {
      notes: [...existingNotes, newNote]
    });

    return Response.json({
      success: true,
      message: `Subaccount status updated from "${previousStatus}" to "${newStatus}"`,
      subaccountId: subaccountId,
      previousStatus: previousStatus,
      newStatus: newStatus,
      updatedBy: user.email,
      updatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error updating subaccount status:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});