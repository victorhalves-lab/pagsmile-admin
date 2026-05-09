import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Banner de aviso para telas que não têm base direta na API Tuna oficial.
 * Sinaliza que a feature está em estudo/preview e não corresponde a um endpoint Tuna documentado.
 */
export default function PreviewBanner({ message }) {
  return (
    <Card className="bg-amber-50 border-amber-300">
      <CardContent className="p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-bold text-amber-900 text-sm">Preview · Não disponível na API Tuna atual</p>
          <p className="text-xs text-amber-800 mt-1">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}