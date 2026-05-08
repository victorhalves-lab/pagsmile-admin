import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowRight, Shield } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

const rules = [
  { id: 'low_value', label: 'Auto-refund se valor < R$ 100', enabled: true, hits: 24 },
  { id: 'first_dispute', label: 'Auto-refund se cliente tem 0 disputas anteriores', enabled: true, hits: 18 },
  { id: 'high_ltv', label: 'Auto-refund se cliente tem LTV > R$ 1.000 (preserva relacionamento)', enabled: true, hits: 9 },
  { id: 'reason_unknown', label: 'Auto-refund se reason = duplicate ou unknown', enabled: true, hits: 6 },
  { id: 'block_high_value', label: 'NÃO auto-refund se valor > R$ 500', enabled: true, hits: 14 },
  { id: 'block_repeat', label: 'NÃO auto-refund se cliente é repeat offender', enabled: true, hits: 5 },
];

export default function PrecbAutoRefundRulesCard() {
  return (
    <Card className="border-emerald-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600" />
          Auto-refund inteligente — Rule engine
          <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] ml-auto">
            {rules.filter((r) => r.enabled).length} regras ativas
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        <p className="text-[11px] text-slate-500 mb-2">
          Granularidade muda o jogo: substitui o toggle binário por decisões inteligentes por valor, cliente, motivo e LTV.
        </p>
        {rules.map((r) => (
          <div key={r.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <Switch checked={r.enabled} className="scale-75" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{r.label}</p>
              {r.enabled && r.hits > 0 && (
                <p className="text-[10px] text-emerald-600 font-bold">{r.hits} aplicadas este mês</p>
              )}
            </div>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </div>
        ))}
        <div className="flex items-center gap-1.5 pt-2 mt-1 border-t border-slate-100">
          <Sparkles className="w-3 h-3 text-purple-600" />
          <p className="text-[10px] text-slate-500">
            IA também atribui um <span className="font-bold">score 0-100</span> em cada alerta sugerindo a melhor ação.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}