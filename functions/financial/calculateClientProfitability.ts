import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    const base44 = createClientFromRequest(req);
    
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
        return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { subaccountId, startDate, endDate } = await req.json();

    if (!subaccountId) {
        return Response.json({ error: 'Subaccount ID is required' }, { status: 400 });
    }

    try {
        // Get transactions for the client in the period
        const transactions = await base44.asServiceRole.entities.Transaction.filter({
            subaccount_id: subaccountId,
            status: 'approved'
        });

        // Filter by date if provided
        const filteredTransactions = transactions.filter(t => {
            const txDate = new Date(t.created_at);
            const start = startDate ? new Date(startDate) : new Date(0);
            const end = endDate ? new Date(endDate) : new Date();
            return txDate >= start && txDate <= end;
        });

        // Calculate GMV
        const gmv = filteredTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);

        // Get revenue entries for this client
        const revenueEntries = await base44.asServiceRole.entities.RevenueEntry.filter({
            subaccount_id: subaccountId
        });

        // Calculate revenues by type
        const revenues = {
            mdr_card: 0,
            mdr_pix: 0,
            anticipation: 0,
            fixed_fee: 0,
            antifraud: 0,
            other: 0
        };

        const costs = {
            mdr_cost: 0,
            pix_cost: 0,
            operational: 0
        };

        revenueEntries.forEach(entry => {
            if (entry.revenue_type.startsWith('mdr_')) {
                revenues[entry.revenue_type] += entry.revenue_amount || 0;
            } else if (['fixed_fee_pix', 'fixed_fee_card'].includes(entry.revenue_type)) {
                revenues.fixed_fee += entry.revenue_amount || 0;
            } else if (entry.revenue_type === 'anticipation') {
                revenues.anticipation += entry.revenue_amount || 0;
            } else if (entry.revenue_type === 'antifraud') {
                revenues.antifraud += entry.revenue_amount || 0;
            } else {
                revenues.other += entry.revenue_amount || 0;
            }

            costs.mdr_cost += entry.cost_amount || 0;
        });

        const totalRevenue = Object.values(revenues).reduce((sum, v) => sum + v, 0);
        const totalCost = Object.values(costs).reduce((sum, v) => sum + v, 0);
        const netSpread = totalRevenue - totalCost;
        const margin = gmv > 0 ? (netSpread / gmv) * 100 : 0;

        // Get sub-sellers count
        const subSellers = await base44.asServiceRole.entities.SubSeller.filter({
            parent_subaccount_id: subaccountId,
            status: 'active'
        });

        return Response.json({
            success: true,
            data: {
                gmv,
                revenues,
                costs,
                totalRevenue,
                totalCost,
                netSpread,
                margin,
                transactionCount: filteredTransactions.length,
                subSellersCount: subSellers.length,
                period: {
                    start: startDate || 'all',
                    end: endDate || 'now'
                }
            }
        });

    } catch (error) {
        return Response.json({ 
            error: 'Failed to calculate profitability', 
            details: error.message 
        }, { status: 500 });
    }
});