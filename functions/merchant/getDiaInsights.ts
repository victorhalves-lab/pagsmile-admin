import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { merchant_id, context } = await req.json();

        const user = await base44.auth.me();
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        // Fetch merchant data
        const merchant = await base44.entities.Subaccount.get(merchant_id);

        const prompt = `
        Você é o DIA (Data Intelligence Agent), assistente inteligente da PagSmile.
        Analise os dados deste merchant e forneça insights estratégicos.
        
        Dados do Merchant:
        Nome: ${merchant.business_name}
        MCC: ${merchant.mcc} (${merchant.mcc_description})
        TPV Mês: ${merchant.revenue_current_month || 'N/A'}
        Score Risco: ${merchant.risk_score}
        Status: ${merchant.status}
        
        Contexto Específico: ${context || 'Geral'}
        
        Forneça:
        1. Insights de Crescimento
        2. Alertas de Risco
        3. Oportunidades de Receita
        4. Pontos de Atenção (Saúde)
        
        Responda em formato JSON compatível com o frontend.
        `;

        const response = await base44.integrations.Core.InvokeLLM({
            prompt: prompt,
            response_json_schema: {
                type: "object",
                properties: {
                    growth_insights: { type: "array", items: { type: "string" } },
                    risk_alerts: { type: "array", items: { type: "string" } },
                    revenue_opportunities: { type: "array", items: { type: "string" } },
                    health_warnings: { type: "array", items: { type: "string" } }
                }
            }
        });

        return Response.json(response);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});