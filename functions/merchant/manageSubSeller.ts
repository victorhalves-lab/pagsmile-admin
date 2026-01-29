import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    const base44 = createClientFromRequest(req);
    
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
        return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { action, sellerId, parentSubaccountId, sellerData } = await req.json();

    if (!action) {
        return Response.json({ error: 'Action is required' }, { status: 400 });
    }

    try {
        let result;

        switch (action) {
            case 'create':
                if (!parentSubaccountId || !sellerData?.business_name || !sellerData?.document) {
                    return Response.json({ error: 'Parent subaccount ID, business name and document are required' }, { status: 400 });
                }

                // Get parent subaccount
                const parentSub = await base44.asServiceRole.entities.Subaccount.filter({ id: parentSubaccountId });
                if (!parentSub || parentSub.length === 0) {
                    return Response.json({ error: 'Parent subaccount not found' }, { status: 404 });
                }

                result = await base44.asServiceRole.entities.SubSeller.create({
                    subseller_id: `SS-${Date.now()}`,
                    parent_subaccount_id: parentSubaccountId,
                    parent_business_name: parentSub[0].business_name,
                    business_name: sellerData.business_name,
                    legal_name: sellerData.legal_name || '',
                    document: sellerData.document,
                    document_type: sellerData.document_type || 'cnpj',
                    email: sellerData.email || '',
                    phone: sellerData.phone || '',
                    split_type: sellerData.split_type || 'percentage',
                    split_value: sellerData.split_value || 95,
                    status: sellerData.status || 'active',
                    onboarding_date: new Date().toISOString()
                });

                break;

            case 'update':
                if (!sellerId || !sellerData) {
                    return Response.json({ error: 'Seller ID and data are required' }, { status: 400 });
                }

                result = await base44.asServiceRole.entities.SubSeller.update(sellerId, sellerData);
                break;

            case 'delete':
                if (!sellerId) {
                    return Response.json({ error: 'Seller ID is required' }, { status: 400 });
                }

                result = await base44.asServiceRole.entities.SubSeller.delete(sellerId);
                break;

            case 'get_stats':
                if (!sellerId) {
                    return Response.json({ error: 'Seller ID is required' }, { status: 400 });
                }

                // Get transactions for this sub-seller
                const transactions = await base44.asServiceRole.entities.Transaction.filter({
                    subseller_id: sellerId,
                    status: 'approved'
                });

                const stats = {
                    total_volume: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
                    total_transactions: transactions.length,
                    avg_ticket: transactions.length > 0 ? transactions.reduce((sum, t) => sum + (t.amount || 0), 0) / transactions.length : 0,
                    last_transaction_date: transactions.length > 0 ? transactions[0].created_at : null
                };

                // Update sub-seller stats
                await base44.asServiceRole.entities.SubSeller.update(sellerId, stats);

                result = stats;
                break;

            default:
                return Response.json({ error: `Unknown action: ${action}` }, { status: 400 });
        }

        return Response.json({ success: true, data: result });

    } catch (error) {
        return Response.json({ 
            error: 'Failed to manage sub-seller', 
            details: error.message 
        }, { status: 500 });
    }
});