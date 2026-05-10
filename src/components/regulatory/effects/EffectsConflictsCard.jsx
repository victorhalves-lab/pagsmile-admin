import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { formatCurrency, EFFECT_TYPES } from '../mocks/urMock';

export default function EffectsConflictsCard({ effects }) {
  const conflicts = effects.filter((e) => e.has_conflict);

  if (conflicts.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base">Efeitos em conflito</CardTitle></CardHeader>
        <CardContent>
          <div className="text-center py-4 text-sm text-emerald-600">✓ Nenhum conflito detectado</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-red-200 bg-red-50/30">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          Efeitos em conflito ({conflicts.length})
        </CardTitle>
        <p className="text-[10px] text-slate-600">Casos onde múltiplos efeitos sobre mesma UR podem gerar disputa em liquidação</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {conflicts.slice(0, 5).map((e) => {
          const type = EFFECT_TYPES[e.type];
          return (
            <div key={e.id} className="flex items-center justify-between p-2 bg-white rounded border border-red-200">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-sm">{type?.icon}</span>
                  <Badge className={`${type?.color} text-[9px]`}>{type?.label}</Badge>
                  <span className="text-[10px] font-mono">{e.id}</span>
                </div>
                <p className="text-[10px] text-slate-600 mt-0.5">UR: {e.ur_id} · {e.counterparty?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold">{formatCurrency(e.value_affected)}</p>
                <Link to={`${createPageUrl('AdminIntContractEffectDetail360')}?id=${e.id}`}>
                  <Button size="sm" variant="outline" className="h-6 text-[9px] mt-1">
                    <ExternalLink className="w-2.5 h-2.5 mr-0.5" /> Detalhe
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
        <Button size="sm" variant="outline" className="w-full text-xs">
          Escalar para Jurídico
        </Button>
      </CardContent>
    </Card>
  );
}