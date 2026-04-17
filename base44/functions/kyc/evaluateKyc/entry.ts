import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        // This function might be called by system automation or manually triggered
        const { subaccount_id } = await req.json();

        if (!subaccount_id) {
            return Response.json({ error: 'Missing subaccount_id' }, { status: 400 });
        }

        const subaccount = await base44.entities.Subaccount.get(subaccount_id);
        if (!subaccount) {
            return Response.json({ error: 'Subaccount not found' }, { status: 404 });
        }

        // Simulate AI Evaluation logic (HELENA)
        // In reality, this would call external providers or run complex logic
        const randomScore = Math.floor(Math.random() * 40) + 60; // 60-99
        let decision = 'manual_review';
        let redFlags = [];

        if (randomScore >= 80) {
            decision = 'approved';
        } else if (randomScore < 50) {
            decision = 'rejected';
            redFlags.push('Low compliance score');
        } else {
            decision = 'manual_review';
            redFlags.push('Mid-range score requires manual check');
        }
        
        if (subaccount.has_pep) {
            redFlags.push('PEP identified in structure');
            if (decision === 'approved') decision = 'manual_review';
        }

        if (subaccount.company_age_years < 1) {
             redFlags.push('Company age less than 1 year');
        }

        await base44.entities.Subaccount.update(subaccount_id, {
            kyc_score: randomScore,
            kyc_decision: decision,
            ai_red_flags: redFlags,
            status: decision === 'approved' ? 'kyc_approved' : (decision === 'rejected' ? 'kyc_rejected' : 'manual_review'),
            kyc_approved_at: decision === 'approved' ? new Date().toISOString() : null
        });

         await base44.entities.OnboardingEvent.create({
            subaccount_id,
            event_type: 'kyc_analyzed', // custom type
            details: `HELENA Analysis: Score ${randomScore}. Decision: ${decision}. Red Flags: ${redFlags.join(', ')}`,
            timestamp: new Date().toISOString(),
            actor: 'system'
        });

        return Response.json({ success: true, score: randomScore, decision, redFlags });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});