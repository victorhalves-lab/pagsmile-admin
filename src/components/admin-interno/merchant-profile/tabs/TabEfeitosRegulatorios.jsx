import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ExternalLink } from 'lucide-react';
import { createPageUrl } from '@/components/utils';
import { MOCK_EFFECTS, EFFECT_TYPES, formatCurrency, formatCurrencyShort } from '@/components/regulatory/mocks/urMock';
import EffectsTable from '@/components/regulatory/effects/EffectsTable.jsx';
import { toast } from 'sonner';

export default function TabEfeitosRegulatorios({ merchant }) {
  const effects = useMemo(() => MOCK_EFFECTS.filter((e) => e.ur?.merchant?.id === 'mer_001'), []);

  const grouped = useMemo(() => {
    const acc = {};
    effects.forEach((e) => {
      acc[e.type] = acc[e.type] || { count: 0, value: 0 };
      acc[e.type].count += 1;
      acc[e.type].value += e.value_affected;
    });
    return acc;
  }, [effects]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-violet-600" /> Efeitos de Contrato Regulatórios
          </h2>
          <p className="text-xs text-slate-500">Cessões, oneraçãos, antecipações e travas registradas nas registradoras</p>
        </div>
        <Link to={`${createPageUrl('AdminIntContractEffectsRegistry')}?merchant_id=${merchant.id}`}>
          <Button size="sm" variant="outline">
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Hub central de Efeitos
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(grouped).map(([type, data]) => {
          const cfg = EFFECT_TYPES[type];
          return (
            <Card key={type}>
              <CardContent className="p-3">
                <p className="text-[10px] uppercase font-bold text-slate-500">{cfg?.icon} {cfg?.label}</p>
                <p className="text-lg font-bold">{data.count}</p>
                <p className="text-[10px] text-slate-500">{formatCurrencyShort(data.value)}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <EffectsTable
        items={effects}
        onViewDetail={(e) => window.location.href = `${createPageUrl('AdminIntContractEffectDetail360')}?id=${e.id}`}
        onReprocess={(e) => toast.success(`Reprocessamento de ${e.id} iniciado`)}
      />
    </div>
  );
}