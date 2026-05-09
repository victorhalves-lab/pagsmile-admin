import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Receipt, BookOpen } from 'lucide-react';

export default function MentorTaxRulesPanel({ rules = [] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Receipt className="w-4 h-4 text-violet-600" />
          Regras Fiscais Ativas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {rules.map((r) => (
          <div key={r.rule_id} className="p-3 rounded-lg border bg-white dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{r.name}</p>
                  <Badge variant="outline" className="text-[9px]">
                    {r.applies_to === 'individual' ? 'PF' : r.applies_to === 'company' ? 'PJ' : 'PF e PJ'}
                  </Badge>
                  {r.rate && (
                    <Badge className="bg-violet-100 text-violet-700 text-[9px]">{r.rate}%</Badge>
                  )}
                  {r.rate_type === 'progressive' && (
                    <Badge className="bg-blue-100 text-blue-700 text-[9px]">Progressivo</Badge>
                  )}
                  {r.rate_type === 'variable_by_city' && (
                    <Badge className="bg-cyan-100 text-cyan-700 text-[9px]">Por município</Badge>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">{r.description}</p>
                <div className="flex items-center gap-1 mt-1.5 text-[10px] text-violet-600">
                  <BookOpen className="w-2.5 h-2.5" />
                  <span>{r.bracket}</span>
                </div>
                {r.note && (
                  <p className="text-[10px] text-amber-700 mt-1 italic">⚠️ {r.note}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500">Calcular</span>
                  <Switch checked={r.auto_calculate} disabled />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500">Reter</span>
                  <Switch checked={r.auto_retain} disabled />
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}