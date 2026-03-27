import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // This function would normally be called by a scheduled automation (service role)
        // But automations call functions with payload, let's assume service role context is handled by SDK if needed or we use user context if triggered manually.
        // For scheduled tasks, we usually check for admin or service role.
        
        // Fetch all active merchants
        // In a real scenario, we would filter by date in the query to be efficient
        const merchants = await base44.entities.Subaccount.list(); // Should use filter
        
        const expiring = [];
        const today = new Date();
        const sixtyDaysFromNow = new Date();
        sixtyDaysFromNow.setDate(today.getDate() + 60);

        for (const merchant of merchants) {
             // Mock check document logic
             // Assuming documents is an array of objects with validity_date
             if (merchant.documents) {
                 for (const doc of merchant.documents) {
                     if (doc.validity_date) {
                         const validDate = new Date(doc.validity_date);
                         if (validDate > today && validDate < sixtyDaysFromNow) {
                             expiring.push({
                                 merchant_id: merchant.id,
                                 merchant_name: merchant.business_name,
                                 doc_type: doc.type,
                                 validity: doc.validity_date
                             });
                             
                             // Send email notification (mock)
                             await base44.integrations.Core.SendEmail({
                                 to: merchant.email,
                                 subject: `Ação Necessária: Documento vencendo em breve`,
                                 body: `Olá ${merchant.business_name}, seu documento ${doc.type} vence em ${doc.validity_date}. Por favor, envie uma versão atualizada.`
                             });
                         }
                     }
                 }
             }
        }

        return Response.json({ processed: merchants.length, expiring_found: expiring.length, expiring_details: expiring });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});