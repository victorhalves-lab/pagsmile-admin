import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';

export default function RetryVisualEditor({ retries: initialRetries = [1, 3, 7, 14, 21] }) {
  const [retries, setRetries] = useState(initialRetries);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Timeline de retentativas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-20 mb-4">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2" />
          {retries.map((day, i) => (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${(day / 30) * 100}%` }}
            >
              <div className="w-7 h-7 rounded-full bg-[#2bc196] border-2 border-white shadow flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">{i + 1}</span>
              </div>
              <p className="text-[10px] text-center mt-1 font-medium">D+{day}</p>
            </div>
          ))}
          <div className="absolute top-1/2 -translate-y-1/2 right-0">
            <Badge variant="destructive" className="text-[9px]">D+30 cancelar</Badge>
          </div>
        </div>

        <div className="space-y-2.5">
          {retries.map((day, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs font-bold w-16">Retry {i + 1}</span>
              <Slider
                value={[day]}
                min={1}
                max={29}
                step={1}
                className="flex-1"
                onValueChange={(v) => {
                  const next = [...retries];
                  next[i] = v[0];
                  setRetries(next);
                }}
              />
              <span className="text-xs font-mono w-12 text-right">D+{day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}