import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator } from 'lucide-react';
import SplitFlowDiagram from './SplitFlowDiagram';

/**
 * Simulador inline — testar uma rule com valor antes de aplicar.
 */
export default function SplitSimulator({ rule }) {
  const [amount, setAmount] = useState(100);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calculator className="w-4 h-4 text-indigo-500" />
          Simular esta regra
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label className="text-xs">Valor da transação (R$)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
          <div className="flex gap-1">
            {[50, 100, 500, 1000].map((v) => (
              <Button key={v} variant="outline" size="sm" onClick={() => setAmount(v)}>
                R$ {v}
              </Button>
            ))}
          </div>
        </div>

        <SplitFlowDiagram rule={rule} sampleAmount={amount} />
      </CardContent>
    </Card>
  );
}