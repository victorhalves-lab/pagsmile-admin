import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertTriangle, TrendingUp } from 'lucide-react';

const ANOMALIES = [
  { severity: 'high', title: 'Pico de chargebacks no merchant Mega Lojas', description: '12 recebíveis em chargeback nas últimas 24h (3,2x média)', value: 'R$ 45.820', action: 'Investigar' },
  { severity: 'medium', title: 'Divergência CERC em arquivo de 28/04', description: '3 recebíveis com valor divergente entre PagSmile e CERC', value: 'R$ 8.140', action: 'Re-sync' },
  { severity: 'low', title: 'Atraso de liquidação atípico', description: 'PetShop Premium com 2 liquidações atrasadas em 1 dia útil', value: 'R$ 12.300', action: 'Acompanhar' },
];

const colors = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function ReceivablesAnomaliesPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          Anomalias detectadas pela IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {ANOMALIES.map((a, i) => (
          <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
            <AlertTriangle className={`w-4 h-4 mt-0.5 ${a.severity === 'high' ? 'text-red-500' : a.severity === 'medium' ? 'text-amber-500' : 'text-blue-500'}`} />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs font-bold">{a.title}</p>
                <Badge className={`${colors[a.severity]} text-[9px] border`}>{a.severity.toUpperCase()}</Badge>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">{a.description}</p>
              <p className="text-[10px] text-slate-400 mt-1">Impacto: <strong>{a.value}</strong></p>
            </div>
            <Button size="sm" variant="outline" className="text-xs">{a.action}</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}