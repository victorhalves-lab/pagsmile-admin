import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { fmt, CARD_BRANDS, PAYMENT_MODALITIES } from '@/components/mentor/mocks/spreadMDRMock';

/**
 * Simulador "what if": ajusta spread em massa e calcula impacto — F1543
 */
export default function SpreadMDRWhatIfSimulator({ matrix = [], onApply }) {
  const [scope, setScope] = useState('all');
  const [scopeValue, setScopeValue] = useState('');
  const [delta, setDelta] = useState([0]);

  const affected = useMemo(() => {
    if (scope === 'all') return matrix;
    if (scope === 'brand') return matrix.filter((m) => m.brand === scopeValue);
    if (scope === 'modality') return matrix.filter((m) => m.modality === scopeValue);
    return matrix;
  }, [scope, scopeValue, matrix]);

  const projection = useMemo(() => {
    const deltaPct = delta[0]; // em pp (pontos percentuais)
    const totalCurrentRevenue = affected.reduce((s, m) => s + (m.spread / 100) * m.monthly_tpv, 0);
    const totalNewRevenue = affected.reduce((s, m) => s + Math.max(0, ((m.spread + deltaPct) / 100)) * m.monthly_tpv, 0);
    const totalMerchants = affected.reduce((s, m) => s + m.merchants_count, 0);
    const tpvImpact = affected.reduce((s, m) => s + m.monthly_tpv, 0);

    // Elasticidade simplificada: cada +0.10pp gera ~1.5% redução de adoção
    const elasticityFactor = 1 - Math.max(0, deltaPct) * 0.015 * 10;
    const adjustedNewRevenue = totalNewRevenue * elasticityFactor;

    return {
      currentRevenue: totalCurrentRevenue,
      naiveNewRevenue: totalNewRevenue,
      adjustedNewRevenue,
      delta: adjustedNewRevenue - totalCurrentRevenue,
      affectedCells: affected.length,
      affectedMerchants: totalMerchants,
      affectedTPV: tpvImpact,
      churnRiskPct: deltaPct > 0 ? Math.min(5, deltaPct * 1.5) : 0,
    };
  }, [delta, affected]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Calculator className="w-4 h-4" />Simulador "what if"
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Aplicar a</Label>
            <Select value={scope} onValueChange={(v) => { setScope(v); setScopeValue(''); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as combinações</SelectItem>
                <SelectItem value="brand">Bandeira específica</SelectItem>
                <SelectItem value="modality">Modalidade específica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {scope === 'brand' && (
            <div>
              <Label className="text-xs">Bandeira</Label>
              <Select value={scopeValue} onValueChange={setScopeValue}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CARD_BRANDS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.icon} {v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {scope === 'modality' && (
            <div>
              <Label className="text-xs">Modalidade</Label>
              <Select value={scopeValue} onValueChange={setScopeValue}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(PAYMENT_MODALITIES).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <Label>Variação (pontos percentuais)</Label>
            <strong className={delta[0] > 0 ? 'text-red-600' : delta[0] < 0 ? 'text-emerald-600' : ''}>
              {delta[0] > 0 ? '+' : ''}{delta[0].toFixed(2)}pp
            </strong>
          </div>
          <Slider min={-1} max={1} step={0.05} value={delta} onValueChange={setDelta} />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>-1pp</span>
            <span>0</span>
            <span>+1pp</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t">
          <div className="bg-slate-50 dark:bg-slate-900 rounded p-2 text-center">
            <p className="text-[10px] text-slate-500 uppercase">Receita atual</p>
            <p className="text-base font-bold">{fmt(projection.currentRevenue)}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2 text-center border border-blue-200">
            <p className="text-[10px] text-blue-700 uppercase">Receita projetada</p>
            <p className="text-base font-bold text-blue-700">{fmt(projection.adjustedNewRevenue)}</p>
            <p className="text-[9px] text-slate-500">com elasticidade</p>
          </div>
          <div className={`rounded p-2 text-center border ${projection.delta >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <p className="text-[10px] uppercase">Δ Impacto</p>
            <p className={`text-base font-bold flex items-center justify-center gap-1 ${projection.delta >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
              {projection.delta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {fmt(Math.abs(projection.delta))}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2 text-[10px] text-slate-500">
          <span><Users className="w-3 h-3 inline mr-1" />{projection.affectedMerchants.toLocaleString('pt-BR')} lojistas em {projection.affectedCells} combinações</span>
          {projection.churnRiskPct > 0 && (
            <span className="text-amber-600 font-semibold">⚠ ~{projection.churnRiskPct.toFixed(1)}% risco de churn esperado</span>
          )}
        </div>

        <Button className="w-full" disabled={delta[0] === 0} onClick={() => onApply?.({ scope, scopeValue, delta: delta[0] })}>
          Aplicar em massa (revisar combinações afetadas)
        </Button>
      </CardContent>
    </Card>
  );
}