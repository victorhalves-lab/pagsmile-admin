import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, GitCompare, ArrowDown, ArrowUp, CheckCircle2 } from 'lucide-react';
import { MOCK_PLAN_VERSIONS } from '@/components/mentor/mocks/salesPlansMock';

const MOCK_DIFF = [
  { field: 'spread_visa_credit', label: 'Spread Visa Crédito', from: 0.40, to: 0.45, unit: '%', impact: 'increase' },
  { field: 'mcc_restrictions', label: 'MCCs restritos', from: ['7995'], to: ['7995', '5993'], type: 'array' },
  { field: 'mdr_pix_in', label: 'MDR Pix In', from: 1.09, to: 0.99, unit: '%', impact: 'decrease' },
  { field: 'regulatory_program', label: 'Programa regulatório', from: 'visa_vamp', to: 'visa_vamp + mc_ecp', type: 'string' },
];

export default function SalesPlanVersionHistoryTab({ planId }) {
  const versions = MOCK_PLAN_VERSIONS[planId] || MOCK_PLAN_VERSIONS.sp_001;
  const [comparing, setComparing] = useState({ from: null, to: null });

  return (
    <div className="space-y-4">
      <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200">
        <CardContent className="p-3 text-xs">
          <p className="font-bold flex items-center gap-1.5 mb-1"><History className="w-3.5 h-3.5" />Diferencial Mentor: histórico versionado</p>
          <p>Cada alteração no plano gera uma <strong>nova versão imutável</strong>. Selecione duas versões abaixo para ver o diff visual com cores indicando aumentos/reduções e seu impacto financeiro estimado.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2"><History className="w-4 h-4" />Timeline de versões ({versions.length})</span>
            {comparing.from && comparing.to && (
              <Button size="sm" variant="outline" onClick={() => setComparing({ from: null, to: null })}>
                Limpar comparação
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative border-l-2 border-violet-200 dark:border-violet-800 ml-2 space-y-3">
            {versions.map((v, idx) => {
              const isCurrent = idx === 0;
              const isFrom = comparing.from === v.version;
              const isTo = comparing.to === v.version;
              return (
                <li key={v.version} className="ml-4">
                  <div className={`absolute w-3 h-3 rounded-full -left-[7px] mt-1.5 ${isCurrent ? 'bg-emerald-500' : 'bg-violet-500'}`} />
                  <Card className={(isFrom || isTo) ? 'border-violet-400 bg-violet-50 dark:bg-violet-900/20' : ''}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="text-[10px] bg-violet-100 text-violet-700">v{v.version}</Badge>
                            {isCurrent && <Badge className="text-[9px] bg-emerald-100 text-emerald-700"><CheckCircle2 className="w-2.5 h-2.5 mr-1" />Vigente</Badge>}
                            <Badge variant="outline" className="text-[9px]">{v.changes_count} alterações</Badge>
                          </div>
                          <p className="text-sm font-semibold">{v.summary}</p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            Vigente desde {new Date(v.effective_from).toLocaleDateString('pt-BR')} ·
                            alterado por {v.changed_by} em {new Date(v.changed_at).toLocaleString('pt-BR')} ·
                            aprovado por {v.approved_by}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          {!comparing.from || comparing.from === v.version ? (
                            <Button
                              size="sm"
                              variant={isFrom ? 'default' : 'outline'}
                              onClick={() => setComparing({ ...comparing, from: isFrom ? null : v.version })}
                              className="h-7 text-[10px]"
                            >
                              {isFrom ? '✓ De' : 'Comparar de'}
                            </Button>
                          ) : null}
                          {comparing.from && comparing.from !== v.version && (
                            <Button
                              size="sm"
                              variant={isTo ? 'default' : 'outline'}
                              onClick={() => setComparing({ ...comparing, to: isTo ? null : v.version })}
                              className="h-7 text-[10px]"
                            >
                              {isTo ? '✓ Para' : 'Para'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      {comparing.from && comparing.to && (
        <Card className="border-violet-300 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <GitCompare className="w-4 h-4" />Diff: v{comparing.from} → v{comparing.to}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {MOCK_DIFF.map((d, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 rounded border">
                  <span className="text-xs font-bold flex-1">{d.label}</span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded">
                      {Array.isArray(d.from) ? d.from.join(', ') : d.from + (d.unit || '')}
                    </span>
                    <span>→</span>
                    <span className="font-mono bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded">
                      {Array.isArray(d.to) ? d.to.join(', ') : d.to + (d.unit || '')}
                    </span>
                    {d.impact === 'increase' && <ArrowUp className="w-3 h-3 text-red-500" />}
                    {d.impact === 'decrease' && <ArrowDown className="w-3 h-3 text-emerald-500" />}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200">
              <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">📊 Impacto financeiro estimado da transição</p>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1">
                Aplicado retroativamente nos últimos 90 dias: receita teria sido <strong>+R$ 2,8M</strong> (+1.4%) ·
                margem teria sido <strong>+0.3pp</strong> · estimativa baseada em 4.2M transações reais
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}