import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Mock irregularity detection
        // In real world: analyze transactions patterns vs MCC expected behavior
        
        const irregularities = [
            {
                irregularity_id: 'IRR-001',
                subaccount_id: 'SUB-123',
                merchant_name: 'Loja ABC',
                current_mcc: '5411',
                suggested_mcc: '5651',
                confidence_score: 85,
                impact_level: 'high',
                detected_at: new Date().toISOString(),
                cost_impact: 1870,
                evidence: {
                    avg_ticket: 450,
                    expected_ticket: 150,
                    installments_share: 55,
                    expected_installments: 20
                }
            }
        ];

        return Response.json({ success: true, irregularities });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});