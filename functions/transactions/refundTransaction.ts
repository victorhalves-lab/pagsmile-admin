import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { transaction_id, type, amount, reason } = await req.json();

        const user = await base44.auth.me();
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        const transaction = await base44.entities.Transaction.get(transaction_id); // Assuming get by ID works or list with filter
        // Actually Base44 .get usually takes ID. If transaction_id is the record ID.
        // If not, we filter.
        
        // Mocking the refund logic
        const refundAmount = amount || transaction.amount;
        
        // Create a refund record (or update transaction status if full refund and model supports it)
        // Here we'll update the transaction status for simplicity if full refund, or create a new transaction record of type 'refund'
        
        // Ideally create a new transaction of type refund linked to original
        const refundTxn = await base44.entities.Transaction.create({
            transaction_id: `REF-${Math.floor(Math.random()*1000000)}`,
            subaccount_id: transaction.subaccount_id,
            merchant_name: transaction.merchant_name,
            type: type === 'partial' ? 'partial_refund' : 'refund',
            method: transaction.method,
            status: 'approved',
            amount: refundAmount,
            created_at: new Date().toISOString(),
            metadata: { original_transaction_id: transaction_id, reason: reason, requested_by: user.email }
        });

        // Update original transaction status if full refund
        if (type !== 'partial' && refundAmount >= transaction.amount) {
            await base44.entities.Transaction.update(transaction.id, {
                status: 'refunded',
                updated_at: new Date().toISOString()
            });
        } else {
             await base44.entities.Transaction.update(transaction.id, {
                status: 'partial_refunded',
                updated_at: new Date().toISOString()
            });
        }

        return Response.json({ success: true, refund: refundTxn });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});