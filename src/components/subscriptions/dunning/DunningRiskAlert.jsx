import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function DunningRiskAlert({ config }) {
  const issues = [];
  if (config.retry_count < 3) issues.push('Poucas retentativas (recomendado: ≥4)');
  if (config.cancel_after_days < 21) issues.push('Cancelamento muito rápido (<21d)');
  if (!config.sms_enabled && !config.whatsapp_enabled) issues.push('Apenas email — adicione SMS/WhatsApp');

  if (issues.length === 0) return null;

  return (
    <Card className="border-amber-300 bg-amber-50/40">
      <CardContent className="p-3 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs">
          <p className="font-bold text-amber-900 mb-1">Configuração em risco</p>
          <ul className="space-y-0.5 text-amber-800">
            {issues.map((i, idx) => <li key={idx}>• {i}</li>)}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}