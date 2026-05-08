import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  CreditCard,
  Lock,
  Unlock,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Info,
  AlertTriangle,
  Calculator,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BRANDS, TIERS, calculateAutoRateForTier, calculateAutoRate } from '@/lib/mdrCalculator';

/**
 * Componente reutilizável para edição da grade de taxas MDR.
 *
 * Props:
 * - value: { visa: { '1x': {value, mode, installmentOverrides}, ... }, ... }
 * - onChange: (newValue) => void
 * - anticipationRate: número (% a.m.) - usado no modo auto
 * - onAnticipationChange: (newValue) => void (opcional)
 * - baseRateForAuto: opcional - quando o modo é auto, usa este como MDR à vista
 * - inheritedFrom: { brand, tier } => { source, sourceLabel, value } - mostra herança
 * - title: título do card
 * - description: descrição
 * - readOnly: só visualização
 * - costBaseTable: opcional - tabela de custos para alerta (idêntica ao formato de value)
 */
export default function MdrRateGrid({
  value,
  onChange,
  anticipationRate = 1.99,
  onAnticipationChange,
  inheritedFrom,
  title = 'Taxas MDR - Cartão de Crédito',
  description = 'Configure as taxas por bandeira e faixa de parcelas. Use modo Manual para sobrescrever o cálculo automático.',
  readOnly = false,
  costBaseTable = null,
}) {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleExpand = (brand, tier) => {
    const key = `${brand}_${tier}`;
    setExpandedRows(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateCell = (brand, tier, patch) => {
    if (readOnly) return;
    const next = { ...value };
    next[brand] = { ...next[brand] };
    next[brand][tier] = { ...next[brand][tier], ...patch };
    onChange(next);
  };

  const updateInstallmentOverride = (brand, tier, installment, val) => {
    const cell = value[brand][tier];
    const overrides = { ...(cell.installmentOverrides || {}) };
    if (val === '' || val == null) {
      delete overrides[installment];
    } else {
      overrides[installment] = parseFloat(val);
    }
    updateCell(brand, tier, { installmentOverrides: Object.keys(overrides).length > 0 ? overrides : null });
  };

  const getEffectiveRate = (brand, tier) => {
    const cell = value[brand]?.[tier];
    if (!cell) return null;
    if (cell.mode === 'manual') return cell.value;
    // Auto: calcula da taxa à vista + antecipação
    const baseRate = value[brand]?.['1x']?.value ?? 2.99;
    return calculateAutoRateForTier({
      baseRate,
      anticipationRateMonthly: anticipationRate,
      tier,
    });
  };

  const renderInstallmentOverrideRow = (brand, tier) => {
    const cell = value[brand]?.[tier];
    const tierConfig = TIERS.find(t => t.code === tier);
    if (!cell || !tierConfig || tierConfig.min === tierConfig.max) return null;

    const installments = [];
    for (let i = tierConfig.min; i <= tierConfig.max; i++) installments.push(i);

    const baseRate = value[brand]?.['1x']?.value ?? 2.99;

    return (
      <tr key={`${brand}_${tier}_overrides`} className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
        <td colSpan={5} className="py-3 px-3">
          <div className="flex items-start gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Override por parcela ({tierConfig.label}):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {installments.map(inst => {
                const override = cell.installmentOverrides?.[inst];
                const autoVal = calculateAutoRate({
                  baseRate,
                  anticipationRateMonthly: anticipationRate,
                  installments: inst,
                });
                const placeholder = autoVal.toFixed(2);
                return (
                  <div key={inst} className="flex items-center gap-1">
                    <span className="text-[11px] font-medium text-slate-500 w-6">{inst}x</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={override ?? ''}
                      placeholder={placeholder}
                      onChange={(e) => updateInstallmentOverride(brand, tier, inst, e.target.value)}
                      disabled={readOnly}
                      className={cn(
                        'h-7 w-16 text-center text-[11px]',
                        override != null ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20' : ''
                      )}
                    />
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 w-full">
              💡 Deixe vazio para usar o cálculo automático ({placeholderHelp(baseRate, anticipationRate, tierConfig)}). Preencha apenas as parcelas que quer sobrescrever.
            </p>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-500" />
              {title}
            </CardTitle>
            {description && <CardDescription className="mt-1">{description}</CardDescription>}
          </div>
          {onAnticipationChange && (
            <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-lg border border-orange-200 dark:border-orange-800">
              <Calculator className="w-4 h-4 text-orange-600" />
              <Label className="text-xs font-medium whitespace-nowrap">Taxa Antecipação:</Label>
              <Input
                type="number"
                step="0.01"
                value={anticipationRate}
                onChange={(e) => onAnticipationChange(parseFloat(e.target.value) || 0)}
                disabled={readOnly}
                className="h-7 w-20 text-center text-xs font-bold"
              />
              <span className="text-xs text-slate-600">% a.m.</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40">
                <th className="text-left py-3 px-3 font-semibold text-slate-600 dark:text-slate-300">Bandeira</th>
                <th className="text-center py-3 px-3 font-semibold text-slate-600 dark:text-slate-300">À Vista (1x)</th>
                <th className="text-center py-3 px-3 font-semibold text-slate-600 dark:text-slate-300">2x a 6x</th>
                <th className="text-center py-3 px-3 font-semibold text-slate-600 dark:text-slate-300">7x a 12x</th>
                <th className="text-center py-3 px-3 font-semibold text-slate-600 dark:text-slate-300 w-24">Detalhar</th>
              </tr>
            </thead>
            <tbody>
              {BRANDS.map(brand => (
                <React.Fragment key={brand.code}>
                  <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-6 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                          {brand.code.slice(0, 4).toUpperCase()}
                        </div>
                        {brand.label}
                      </div>
                    </td>
                    {TIERS.map(tier => {
                      const cell = value[brand.code]?.[tier.code] ?? { value: 0, mode: 'auto' };
                      const effective = getEffectiveRate(brand.code, tier.code);
                      const costBase = costBaseTable?.[brand.code]?.[tier.code]?.value;
                      const belowCost = costBase != null && effective != null && effective < costBase;
                      const hasOverrides = cell.installmentOverrides && Object.keys(cell.installmentOverrides).length > 0;
                      const isAuto = cell.mode === 'auto' && tier.code !== '1x';

                      return (
                        <td key={tier.code} className="py-3 px-3">
                          <div className="flex flex-col items-center gap-1">
                            {/* Toggle Auto/Manual (não disponível para 1x) */}
                            {tier.code !== '1x' && (
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button
                                        type="button"
                                        disabled={readOnly}
                                        onClick={() =>
                                          updateCell(brand.code, tier.code, {
                                            mode: cell.mode === 'auto' ? 'manual' : 'auto',
                                          })
                                        }
                                        className={cn(
                                          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors',
                                          cell.mode === 'auto'
                                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300'
                                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300',
                                          readOnly && 'cursor-not-allowed opacity-70'
                                        )}
                                      >
                                        {cell.mode === 'auto' ? (
                                          <>
                                            <Sparkles className="w-2.5 h-2.5" /> Auto
                                          </>
                                        ) : (
                                          <>
                                            <Lock className="w-2.5 h-2.5" /> Manual
                                          </>
                                        )}
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      {cell.mode === 'auto' ? (
                                        <p>
                                          <strong>Modo Auto:</strong> calculado a partir do MDR à vista + taxa de antecipação. Clique para sobrescrever manualmente.
                                        </p>
                                      ) : (
                                        <p>
                                          <strong>Modo Manual:</strong> taxa fixa, ignora o cálculo automático. Clique para voltar ao cálculo auto.
                                        </p>
                                      )}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            )}

                            {/* Input/Display */}
                            {(cell.mode === 'manual' || tier.code === '1x') && !readOnly ? (
                              <div className="flex items-center gap-1">
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={cell.value ?? ''}
                                  onChange={(e) =>
                                    updateCell(brand.code, tier.code, {
                                      value: e.target.value === '' ? null : parseFloat(e.target.value),
                                      mode: 'manual',
                                    })
                                  }
                                  className={cn(
                                    'h-8 w-20 text-center text-xs font-semibold',
                                    belowCost && 'border-red-400 bg-red-50 dark:bg-red-900/20'
                                  )}
                                />
                                <span className="text-[10px] text-slate-500">%</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <span
                                  className={cn(
                                    'text-sm font-semibold',
                                    isAuto ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white',
                                    belowCost && 'text-red-600'
                                  )}
                                >
                                  {effective != null ? effective.toFixed(2) : '—'}%
                                </span>
                                {belowCost && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger><AlertTriangle className="w-3 h-3 text-red-500" /></TooltipTrigger>
                                      <TooltipContent>Abaixo do custo base ({costBase?.toFixed(2)}%)</TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            )}

                            {/* Indicador de override por parcela */}
                            {hasOverrides && (
                              <Badge variant="outline" className="text-[9px] py-0 px-1 h-4 bg-amber-50 text-amber-700 border-amber-300">
                                {Object.keys(cell.installmentOverrides).length} override{Object.keys(cell.installmentOverrides).length > 1 ? 's' : ''}
                              </Badge>
                            )}

                            {/* Indicador de herança */}
                            {inheritedFrom && inheritedFrom(brand.code, tier.code)?.source &&
                              inheritedFrom(brand.code, tier.code).source !== 'self' && (
                                <Badge variant="outline" className="text-[9px] py-0 px-1 h-4">
                                  ← {inheritedFrom(brand.code, tier.code).sourceLabel}
                                </Badge>
                              )}
                          </div>
                        </td>
                      );
                    })}
                    <td className="py-3 px-3 text-center">
                      {/* Botão para expandir detalhamento por parcela (só faz sentido para 2-6x e 7-12x) */}
                      <div className="flex flex-col items-center gap-1">
                        {['2_6', '7_12'].map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => toggleExpand(brand.code, t)}
                            className="text-[10px] text-slate-500 hover:text-purple-600 flex items-center gap-1"
                          >
                            {expandedRows[`${brand.code}_${t}`] ? (
                              <ChevronDown className="w-3 h-3" />
                            ) : (
                              <ChevronRight className="w-3 h-3" />
                            )}
                            {t === '2_6' ? '2-6x' : '7-12x'}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                  {/* Linhas de override por parcela */}
                  {expandedRows[`${brand.code}_2_6`] && renderInstallmentOverrideRow(brand.code, '2_6')}
                  {expandedRows[`${brand.code}_7_12`] && renderInstallmentOverrideRow(brand.code, '7_12')}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legenda */}
        <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[10px] gap-1 py-0.5"><Sparkles className="w-2.5 h-2.5" /> Auto</Badge>
            <span>= calculada do MDR à vista + antecipação</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] gap-1 py-0.5"><Lock className="w-2.5 h-2.5" /> Manual</Badge>
            <span>= taxa fixa, sobrescreve o cálculo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3" />
            <span>Clique em "2-6x" ou "7-12x" para detalhar parcela a parcela</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function placeholderHelp(baseRate, anticipationRate, tierConfig) {
  const exemplo = calculateAutoRate({
    baseRate,
    anticipationRateMonthly: anticipationRate,
    installments: tierConfig.min,
  });
  return `${tierConfig.min}x ≈ ${exemplo.toFixed(2)}%`;
}