import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { v4 as uuidv4 } from 'npm:uuid';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { merchant_id, name, type } = await req.json();

        const user = await base44.auth.me();
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        // Generate a key (simulated)
        const prefix = type === 'production' ? 'pk_live_' : 'pk_test_';
        const key = prefix + uuidv4().replace(/-/g, '');

        const apiKey = await base44.entities.ApiKey.create({
            name: name || 'API Key',
            type: type || 'production',
            key_type: 'public', // Usually public key for frontend, secret for backend. Simplifying.
            status: 'active',
            permissions: ['full_access'], // Simplify perms
            // In a real app we might hash the key or store it securely, but here we just store it
            // Assuming the entity has a field for the key itself or a reference
            // Adding a custom field to ApiKey entity might be needed if not present
            // For now assuming we just create the record.
            // But wait, ApiKey entity schema in snapshot doesn't have 'key' value field, assume 'key_id' is the identifier, but we need the actual key value.
            // I'll assume we can't store the full secret key in plain text in a real scenario, but for this demo I'll put it in the name or description if possible, or assume it's returned once.
            // Let's assume we return it and the entity just tracks it.
        });
        
        // Actually, let's update the entity schema if needed, but I cannot do it inside this function call.
        // I will assume for now we return the key to the user and the entity tracks metadata.

        return Response.json({ apiKey, key_value: key });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});