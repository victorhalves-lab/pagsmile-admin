import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

const rules = [
  { id: 'low_value_user_request', label: 'Auto-aceitar MEDs <R$ 50 com motivo "user_request"', enabled: true, hits: 12 },
  { id: 'reject_3ds_delivered', label: 'Auto-rejeitar quando há 3DS auth + entrega completada', enabled: true, hits: 8 },
  { id: 'escalate_high_value', label: 'Encaminhar para humano se valor > R$ 1.000', enabled: true, hits: 3 },
  { id: 'auto_reject_repeat', label: 'Auto-rejeitar se cliente já fez MED nos últimos 30 dias', enabled: false, hits: 0 },
];

export default function MedAutoDecisionCard() {
  return (
    <Card className="border-purple-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          Auto-decisão (rule engine)
          <Badge className="bg-purple-100 text-purple-700 border-0 text-[10px] ml-auto">
            {rules.filter((r) => r.enabled).length} ativas
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
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
        <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-100">
          💡 Configure regras adicionais em <span className="font-bold">Settings → Disputas</span>.
        </p>
      </CardContent>
    </Card>
  );
}