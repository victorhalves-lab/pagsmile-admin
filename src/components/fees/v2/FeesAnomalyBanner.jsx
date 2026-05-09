import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X, Sparkles } from 'lucide-react';

export default function FeesAnomalyBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <Card className="border-2 border-amber-300 bg-amber-50">
      <CardContent className="p-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-amber-900">Anomalia detectada</p>
            <Badge className="bg-purple-100 text-purple-700 border-0 text-[9px]">
              <Sparkles className="w-2.5 h-2.5 mr-1" /> Helena IA
            </Badge>
          </div>
          <p className="text-[11px] text-amber-700">
            Suas fees totais aumentaram <span className="font-bold">+18% este mês</span> sem aumento proporcional de volume. Causa provável: mix shiftou para parcelado 7-12x. <span className="underline cursor-pointer">Investigar →</span>
          </p>
        </div>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setDismissed(true)}>
          <X className="w-3.5 h-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
}