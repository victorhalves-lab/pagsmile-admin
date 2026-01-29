import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { subaccountId, startDate, endDate } = await req.json();

    // Get all revenue entries for the subaccount
    const revenueEntries = await base44.asServiceRole.entities.RevenueEntry.filter({ 
      subaccount_id: subaccountId 
    });

    // Get all cost entries
    const costEntries = await base44.asServiceRole.entities.CostEntry.filter({ 
      subaccount_id: subaccountId 
    });

    // Get transactions for GMV calculation
    const transactions = await base44.asServiceRole.entities.Transaction.filter({ 
      subaccount_id: subaccountId,
      status: 'approved'
    });

    // Calculate metrics
    const gmv = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const revenueByType = {};
    revenueEntries.forEach(entry => {
      if (!revenueByType[entry.revenue_type]) {
        revenueByType[entry.revenue_type] = 0;
      }
      revenueByType[entry.revenue_type] += entry.amount || 0;
    });

    const costByType = {};
    costEntries.forEach(entry => {
      if (!costByType[entry.cost_type]) {
        costByType[entry.cost_type] = 0;
      }
      costByType[entry.cost_type] += entry.amount || 0;
    });

    const totalRevenue = revenueEntries.reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalCost = costEntries.reduce((sum, e) => sum + (e.amount || 0), 0);
    const spread = totalRevenue - totalCost;
    const margin = gmv > 0 ? (spread / gmv) * 100 : 0;

    return Response.json({
      success: true,
      data: {
        gmv,
        totalRevenue,
        totalCost,
        spread,
        margin,
        revenueByType,
        costByType,
        transactionCount: transactions.length
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});