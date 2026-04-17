import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        // No params needed for general dashboard insights, or could accept filters

        const user = await base44.auth.me();
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        // In a real scenario, we would aggregate data here to pass to LLM
        const mockRiskStats = "Ratio Visa: 0.42%, Ratio MC: 0.38%. 2 merchants in VDMP. 45 open disputes.";

        const prompt = `
        Você é o DIA, assistente de risco da PagSmile.
        Analise os seguintes dados de risco e gere insights curtos e acionáveis:
        ${mockRiskStats}
        
        Gere 4 insights em formato JSON:
        {
            "insights": [
                {"type": "alert|warning|info|success", "text": "Insight text"}
            ]
        }
        `;

        const response = await base44.integrations.Core.InvokeLLM({
            prompt: prompt,
            response_json_schema: {
                type: "object",
                properties: {
                    insights: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                type: { type: "string" },
                                text: { type: "string" }
                            }
                        }
                    }
                }
            }
        });

        return Response.json(response);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});