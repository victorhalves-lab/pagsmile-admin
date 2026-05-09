import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers } from 'lucide-react';
import { COMPONENT_TYPES, MOCK_PLAN_COMPOSITION } from '@/components/mentor/mocks/salesPlansMock';

export default function SalesPlanCompositionTab({ planId }) {
  const composition = MOCK_PLAN_COMPOSITION[planId] || MOCK_PLAN_COMPOSITION.sp_001;

  const grouped = composition.reduce((acc, item) => {
    if (!acc[item.channel]) acc[item.channel] = {};
    if (!acc[item.channel][item.brand]) acc[item.channel][item.brand] = [];
    acc[item.channel][item.brand].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200">
        <CardContent className="p-3 text-xs">
          <p className="font-bold flex items-center gap-1.5 mb-1"><Layers className="w-3.5 h-3.5" />Como ler a composição</p>
          <p>Cada modalidade (canal × marca × parcelamento) é decomposta em <strong>componentes somáveis</strong>: MDR base (custo de interchange), Spread PagSmile, Antecipação embutida quando aplicável, sobretaxas regulatórias e taxas de rede. O total é a tarifa final cobrada do merchant.</p>
        </CardContent>
      </Card>

      {Object.entries(grouped).map(([channel, brands]) => (
        <Card key={channel}>
          <CardHeader>
            <CardTitle className="text-sm capitalize">Canal: {channel}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(brands).map(([brand, modalities]) => (
              <div key={brand} className="border rounded-lg p-2.5">
                <p className="text-xs font-bold uppercase mb-2 text-slate-700 dark:text-slate-300">{brand}</p>
                <div className="space-y-3">
                  {modalities.map((m, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-900 rounded p-2">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold capitalize">{m.modality.replace(/_/g, ' ')}</p>
                        <Badge className="text-[10px] bg-slate-700 text-white font-mono">Total: {m.total.toFixed(2)}%</Badge>
                      </div>
                      <div className="space-y-1">
                        {m.components.map((c, ci) => {
                          const config = COMPONENT_TYPES[c.type];
                          const pct = (c.value / m.total) * 100;
                          return (
                            <div key={ci} className="flex items-center gap-2 text-[11px]">
                              <Badge className={`text-[9px] ${config?.color} min-w-[100px] justify-center`}>{config?.icon} {config?.label}</Badge>
                              <span className="flex-1">{c.label}</span>
                              <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 max-w-[100px]">
                                <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="font-mono font-bold text-slate-700 dark:text-slate-300 min-w-[55px] text-right">{c.value.toFixed(2)}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}