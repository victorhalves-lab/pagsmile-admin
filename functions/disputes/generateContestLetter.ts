import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { dispute_id, merchant_name, reason_code, evidence_summary } = await req.json();

        const user = await base44.auth.me();
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        const prompt = `
        Gere uma carta de contestação de chargeback formal em inglês para a bandeira do cartão.
        
        Dados:
        Merchant: ${merchant_name}
        Reason Code: ${reason_code}
        Evidências Disponíveis: ${evidence_summary}
        
        A carta deve ser profissional, direta e focar nos argumentos que invalidam o motivo do chargeback.
        Estrutura: Cabeçalho, Resumo do Caso, Argumentos/Evidências, Conclusão.
        `;

        const response = await base44.integrations.Core.InvokeLLM({
            prompt: prompt
        });

        return Response.json({ letter: response });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});