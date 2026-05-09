import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, TrendingDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { name: 'Visita à página', count: 12400, conversion: 100, avgTime: 0, color: '#94a3b8' },
  { name: 'Início do Checkout', count: 4960, conversion: 40, avgTime: 12, color: '#3b82f6' },
  { name: 'Preenchimento Dados', count: 3472, conversion: 28, avgTime: 47, color: '#6366f1' },
  { name: 'Seleção Pagamento', count: 2480, conversion: 20, avgTime: 22, color: '#8b5cf6' },
  { name: 'Pagamento', count: 1860, conversion: 15, avgTime: 18, color: '#ec4899' },
  { name: 'Aprovação', count: 1538, conversion: 12.4, avgTime: 4, color: '#10b981' },
];

const fmtTime = (s) => s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;

export default function EnhancedFunnelStep({ breakdown, onBreakdownChange }) {
  const max = Math.max(...STEPS.map(s => s.count));

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0 gap-4 flex-wrap">
        <div>
          <CardTitle className="text-base">Funil de Conversão Detalhado</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Tempo médio entre etapas + drop-off por passo</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Breakdown:</span>
          <Select value={breakdown || 'none'} onValueChange={onBreakdownChange}>
            <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none" className="text-xs">Sem breakdown</SelectItem>
              <SelectItem value="device" className="text-xs">Por device</SelectItem>
              <SelectItem value="browser" className="text-xs">Por browser</SelectItem>
              <SelectItem value="country" className="text-xs">Por país</SelectItem>
              <SelectItem value="method" className="text-xs">Por método pagto</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="24h">
            <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1h" className="text-xs">Janela 1h</SelectItem>
              <SelectItem value="24h" className="text-xs">Janela 24h</SelectItem>
              <SelectItem value="7d" className="text-xs">Janela 7d</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {STEPS.map((step, i) => {
            const widthPct = (step.count / max) * 100;
            const dropOff = i > 0 ? ((STEPS[i - 1].count - step.count) / STEPS[i - 1].count * 100).toFixed(1) : null;
            const stepDropAlert = dropOff && parseFloat(dropOff) > 30;

            return (
              <div key={i}>
                <div className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-800">{step.name}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-slate-700">{step.count.toLocaleString('pt-BR')}</span>
                        <Badge variant="outline" className="text-[10px] h-5">{step.conversion}%</Badge>
                      </div>
                    </div>
                    <div className="h-7 bg-slate-100 rounded-md overflow-hidden relative">
                      <div
                        className="h-full transition-all flex items-center px-2"
                        style={{ width: `${widthPct}%`, backgroundColor: step.color }}
                      >
                        <span className="text-[10px] font-bold text-white truncate">{step.conversion}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector with time and drop */}
                {i < STEPS.length - 1 && (
                  <div className="flex items-center gap-3 ml-4 my-1">
                    <div className="w-4 border-l-2 border-dashed border-slate-300 h-6"></div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {fmtTime(STEPS[i + 1].avgTime)} médio
                      </span>
                      {dropOff && (
                        <span className={cn(
                          'inline-flex items-center gap-1 font-bold',
                          stepDropAlert ? 'text-red-600' : 'text-amber-600'
                        )}>
                          <TrendingDown className="w-3 h-3" />
                          -{dropOff}% drop
                          {stepDropAlert && ' ⚠️'}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-xs font-bold text-amber-800">⚠️ Alerta: Maior drop em "Preenchimento Dados" ({((STEPS[1].count - STEPS[2].count) / STEPS[1].count * 100).toFixed(1)}%)</p>
          <p className="text-xs text-amber-700 mt-1">
            Sugestão: investigar campos do formulário (CPF, endereço) — ver aba <strong>Diagnóstico</strong>.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}