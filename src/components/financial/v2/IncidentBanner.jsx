import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Banner de incidente — alerta operador sobre problemas externos.
 * Ex: "PIX fora do ar", "Adquirente atrasou liquidação".
 */
export default function IncidentBanner({ title, description, severity = 'warning', onDismiss }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const colors = {
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    critical: 'bg-red-50 border-red-200 text-red-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
  };

  return (
    <Alert className={colors[severity]}>
      <AlertTriangle className="h-4 w-4" />
      <div className="flex items-start justify-between gap-4 flex-1">
        <div>
          <AlertTitle className="font-semibold">{title}</AlertTitle>
          <AlertDescription className="text-sm">{description}</AlertDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 -mt-1"
          onClick={() => { setDismissed(true); onDismiss?.(); }}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Alert>
  );
}