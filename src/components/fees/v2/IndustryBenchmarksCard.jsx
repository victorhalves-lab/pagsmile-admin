import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3, Award, Mail } from 'lucide-react';
import { toast } from 'sonner';

const BENCHMARKS = [
  { method: 'Crédito Vista (Visa/MC)', yours: 2.99, median: 2.85, top25: 2.65, position: 'mid' },
  { method: 'Crédito Parcelado 2-6x', yours: 3.49, median: 3.55, top25: 3.25, position: 'good' },
  { method: 'Crédito Parcelado 7-12x', yours: 4.49, median: 4.20, top25: 3.95, position: 'bad' },
  { method: 'Débito', yours: 1.99, median: 1.85, top25: 1.65, position: 'mid' },
  { method: 'PIX', yours: 0.99, median: 1.10, top25: 0.79, position: 'mid' },
];

const COLORS = {
  good: 'text-emerald-600 bg-emerald-50',
  mid: 'text-amber-600 bg-amber-50',
  bad: 'text-red-600 bg-red-50',
};

const LABELS = {
  good: '✓ Você está abaixo da mediana',
  mid: '~ Próximo da mediana',
  bad: '⚠ Acima da mediana',
};

export default function IndustryBenchmarksCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-600" />
            Industry Benchmarks · SaaS Brasil 2026
            <Badge className="bg-slate-200 text-slate-700 border-0 text-[9px]">Sample: 1.247 merchants</Badge>
          </CardTitle>
          <Button size="sm" variant="outline" className="border-[#2bc196]/30 text-[#2bc196]" onClick={() => toast.success('Solicitação de revisão enviada à equipe comercial')}>
            <Mail className="w-3.5 h-3.5 mr-1" /> Solicitar revisão de MDR
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {BENCHMARKS.map((b) => {
            const minVal = Math.min(b.yours, b.median, b.top25);
            const maxVal = Math.max(b.yours, b.median, b.top25);
            const range = maxVal - minVal || 1;
            return (
              <div key={b.method} className="border rounded-lg p-3 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-slate-800">{b.method}</p>
                  <Badge className={`${COLORS[b.position]} border-0 text-[9px]`}>{LABELS[b.position]}</Badge>
                </div>

                <div className="relative h-10 bg-gradient-to-r from-emerald-100 via-amber-100 to-red-100 rounded-md mb-2">
                  {[
                    { val: b.top25, label: 'Top 25%', color: 'bg-emerald-600', icon: Award },
                    { val: b.median, label: 'Mediana', color: 'bg-amber-500', icon: null },
                    { val: b.yours, label: 'Você', color: 'bg-blue-600 ring-2 ring-blue-300', icon: null },
                  ].map((m, i) => {
                    const pos = ((m.val - minVal) / range) * 100;
                    const Icon = m.icon;
                    return (
                      <div
                        key={i}
                        className="absolute top-0 bottom-0 flex flex-col items-center"
                        style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
                      >
                        <div className={`w-3 h-3 rounded-full ${m.color} mt-1 ring-2 ring-white shadow-md flex items-center justify-center`}>
                          {Icon && <Icon className="w-2 h-2 text-white" />}
                        </div>
                        <span className="text-[8px] font-bold text-slate-700 mt-0.5">{m.label}</span>
                        <span className="text-[8px] text-slate-500">{m.val.toFixed(2)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 p-2.5 bg-blue-50 rounded-lg flex items-start gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] text-blue-800">
            <span className="font-bold">Posicionamento global:</span> Sua taxa efetiva está em <span className="font-bold">P52</span> (mediana). Top 25% atinge -0.30pp menor — <span className="underline cursor-pointer">como chegar lá?</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}