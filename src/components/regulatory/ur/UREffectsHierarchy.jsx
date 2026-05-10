import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { ArrowDown, ExternalLink, AlertTriangle } from 'lucide-react';
import { EFFECT_TYPES, EFFECT_STATUS, formatCurrency } from '../mocks/urMock';

// Hierarchy precedence (regulatory order):
const PRECEDENCE_ORDER = ['judicial_lien', 'attachment', 'administrative_lien', 'fiduciary_assignment', 'credit_assignment', 'voluntary_lock', 'registered_anticipation'];

export default function UREffectsHierarchy({ effects = [], urValue = 0 }) {
  const sorted = [...effects].sort((a, b) => PRECEDENCE_ORDER.indexOf(a.type) - PRECEDENCE_ORDER.indexOf(b.type));
  const totalCommitted = sorted.reduce((s, e) => s + (e.value_affected || 0), 0);
  const available = Math.max(0, urValue - totalCommitted);

  if (effects.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base">Efeitos de Contrato (hierarquia)</CardTitle></CardHeader>
        <CardContent>
          <div className="text-center py-6 text-sm text-slate-500">
            ✓ UR sem efeitos — totalmente disponível
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>Efeitos de Contrato (hierarquia regulatória)</span>
          <Badge variant="outline" className="text-[10px]">{effects.length} efeito(s)</Badge>
        </CardTitle>
        <p className="text-[10px] text-slate-500">Ordem de precedência conforme Resolução CMN 4.734/2019</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {sorted.map((effect, idx) => {
          const type = EFFECT_TYPES[effect.type];
          const status = EFFECT_STATUS[effect.status];
          return (
            <div key={effect.id}>
              <div className={`p-3 border-2 rounded-lg ${effect.has_conflict ? 'border-red-200 bg-red-50/50' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <div className="flex flex-col items-center gap-0.5">
                      <Badge className="bg-violet-100 text-violet-700 text-[10px] font-bold">#{idx + 1}</Badge>
                      <span className="text-2xl">{type?.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge className={`${type?.color} text-[10px]`}>{type?.label}</Badge>
                        {effect.sub_type && <Badge variant="outline" className="text-[9px]">{effect.sub_type}</Badge>}
                        <Badge className={`${status?.color} text-[9px]`}>{status?.label}</Badge>
                        {effect.has_conflict && (
                          <Badge className="bg-red-100 text-red-700 text-[9px] border-red-300">
                            <AlertTriangle className="w-2.5 h-2.5 mr-0.5" /> Conflito
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs font-medium mt-1">{effect.counterparty?.name}</p>
                      {effect.process_ref && <p className="text-[10px] text-slate-500 font-mono">Processo: {effect.process_ref}</p>}
                      {effect.contract_ref && <p className="text-[10px] text-slate-500 font-mono">{effect.contract_ref}</p>}
                      <p className="text-[10px] text-slate-500 mt-0.5">Aplicado em {new Date(effect.application_date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black text-red-700">−{formatCurrency(effect.value_affected)}</p>
                    <p className="text-[10px] text-slate-500">{effect.pct_of_ur}% da UR</p>
                    <Link to={`${createPageUrl('AdminIntContractEffectDetail360')}?id=${effect.id}`}>
                      <Button size="sm" variant="outline" className="h-6 text-[10px] mt-1">
                        <ExternalLink className="w-2.5 h-2.5 mr-0.5" /> Detalhe
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              {idx < sorted.length - 1 && (
                <div className="flex justify-center py-1"><ArrowDown className="w-3 h-3 text-slate-400" /></div>
              )}
            </div>
          );
        })}

        {/* Final waterfall summary */}
        <div className="mt-4 p-3 bg-slate-50 rounded-lg border-2 border-dashed">
          <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">Distribuição na liquidação (waterfall)</p>
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between"><span>Valor líquido UR:</span><span className="font-bold">{formatCurrency(urValue)}</span></div>
            {sorted.map((e) => (
              <div key={e.id} className="flex justify-between text-red-700">
                <span className="truncate">→ {EFFECT_TYPES[e.type]?.label} ({e.counterparty?.name?.slice(0, 20)})</span>
                <span>−{formatCurrency(e.value_affected)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t pt-1 font-bold text-emerald-700">
              <span>= Para o lojista:</span>
              <span>{formatCurrency(available)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}