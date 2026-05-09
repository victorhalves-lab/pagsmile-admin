import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Network, TrendingDown, Sparkles } from 'lucide-react';

const ACQUIRERS = [
  { name: 'Stone', mdr: 2.85, share: 45, color: 'bg-emerald-500', logo: '🟢', best: true },
  { name: 'Cielo', mdr: 3.00, share: 25, color: 'bg-blue-500', logo: '🔵' },
  { name: 'Adyen', mdr: 2.95, share: 20, color: 'bg-purple-500', logo: '🟣' },
  { name: 'Rede', mdr: 3.05, share: 10, color: 'bg-orange-500', logo: '🟠' },
];

export default function AcquirerRoutingCard() {
  const weightedMdr = ACQUIRERS.reduce((s, a) => s + (a.mdr * a.share / 100), 0);
  const savedVsWorst = (3.05 - weightedMdr) * 850000 / 100;

  return (
    <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/40 to-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Network className="w-4 h-4 text-emerald-600" />
            Acquirer Routing · Orquestração Inteligente
            <Badge className="bg-emerald-600 text-white border-0 text-[9px]">Diferencial PagSmile</Badge>
          </CardTitle>
          <div className="text-right">
            <p className="text-[10px] text-slate-500">MDR ponderada</p>
            <p className="text-xl font-bold text-emerald-600">{weightedMdr.toFixed(2)}%</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-3">
          {ACQUIRERS.map((a) => (
            <div key={a.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{a.logo}</span>
                  <span className="text-xs font-bold">{a.name}</span>
                  {a.best && <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[8px]">★ Mais barato</Badge>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-500">MDR {a.mdr.toFixed(2)}%</span>
                  <Badge variant="outline" className="text-[9px] w-12 justify-center">{a.share}%</Badge>
                </div>
              </div>
              <div className="flex h-2 bg-slate-100 rounded overflow-hidden">
                <div className={`${a.color} h-full transition-all`} style={{ width: `${a.share}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="p-2.5 bg-emerald-100 rounded-lg flex items-start gap-2">
          <TrendingDown className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] text-emerald-900">
            <span className="font-bold">Sistema rota automaticamente para o adquirente mais barato</span> mantendo aprovação alta.
            Economia estimada: <span className="font-bold">R$ {Math.round(savedVsWorst).toLocaleString('pt-BR')}/mês</span> vs roteamento estático.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}