import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Users, ArrowRight, Sparkles } from 'lucide-react';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

// Mock similar customers — in real product would be ML based (cosine similarity over RFM features)
const SIMILAR = [
  { name: 'Mariana Silva', similarity: 94, ltv: 4200, segment: 'VIP', insight: 'Comprou 3x mais após receber Recovery email' },
  { name: 'Roberto Lima', similarity: 89, ltv: 3850, segment: 'VIP', insight: 'Convertido por oferta de tokenização' },
  { name: 'Ana Costa', similarity: 86, ltv: 3100, segment: 'Recorrente', insight: 'Alto NPS após upgrade de plano' },
];

export default function CustomerSimilarity({ customer }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
            <Users className="w-3.5 h-3.5 text-blue-700" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Clientes Similares</p>
            <p className="text-[11px] text-slate-500">Look-alike audience baseado em RFM + comportamento</p>
          </div>
        </div>
        <Sparkles className="w-3.5 h-3.5 text-purple-500" />
      </div>

      <div className="space-y-2">
        {SIMILAR.map((s, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate">{s.name}</p>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {s.similarity}% match
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {s.segment} · LTV {formatCurrency(s.ltv)}
              </p>
              <p className="text-[10px] text-purple-700 mt-1 italic">💡 {s.insight}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-3 p-2.5 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-[11px] text-blue-900">
          🎯 <strong>Padrão detectado:</strong> Clientes similares converteram 3x mais com campanha "Tokenização + 10% off". Aplicar a este cliente?
        </p>
      </div>
    </Card>
  );
}