import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { action, subsellerId, subsellerData } = await req.json();

    let result;

    switch (action) {
      case 'create':
        result = await base44.asServiceRole.entities.SubSeller.create({
          ...subsellerData,
          subseller_id: `SS-${Date.now()}`,
          activation_date: new Date().toISOString(),
          created_by: user.email
        });
        break;

      case 'update':
        result = await base44.asServiceRole.entities.SubSeller.update(subsellerId, subsellerData);
        break;

      case 'delete':
        result = await base44.asServiceRole.entities.SubSeller.delete(subsellerId);
        break;

      case 'toggle_status':
        const sellers = await base44.asServiceRole.entities.SubSeller.filter({ id: subsellerId });
        const seller = sellers[0];
        if (seller) {
          const newStatus = seller.status === 'active' ? 'inactive' : 'active';
          result = await base44.asServiceRole.entities.SubSeller.update(subsellerId, { status: newStatus });
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