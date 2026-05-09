import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { CARD_BRANDS, PAYMENT_MODALITIES, CHANNELS_FOR_MDR } from '@/components/mentor/mocks/spreadMDRMock';

/**
 * Decomposição visual "MDR base + Spread = Mínimo" — F1527
 */
export default function SpreadMDRDecomposer({ cell }) {
  if (!cell) return null;
  const brand = CARD_BRANDS[cell.brand];
  const modality = PAYMENT_MODALITIES[cell.modality];
  const channel = CHANNELS_FOR_MDR[cell.channel];

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 border-blue-200">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={brand?.color}>{brand?.icon} {brand?.label}</Badge>
          <Badge variant="outline">{modality?.label}</Badge>
          <Badge variant="outline">{channel?.label}</Badge>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-sm">
          <div className="flex flex-col items-center bg-white dark:bg-slate-900 rounded p-2 min-w-[100px]">
            <span className="text-[10px] text-slate-500 uppercase">MDR base</span>
            <span className="text-xl font-bold text-blue-700">{cell.mdr_base?.toFixed(2)}%</span>
            <span className="text-[9px] text-slate-400">interchange + bandeira</span>
          </div>

          <span className="text-slate-400 text-2xl font-light">+</span>

          <div className="flex flex-col items-center bg-white dark:bg-slate-900 rounded p-2 min-w-[100px] border-2 border-[#2bc196]">
            <span className="text-[10px] text-[#2bc196] uppercase font-bold">Spread PagSmile</span>
            <span className="text-xl font-bold text-[#2bc196]">{cell.spread.toFixed(2)}%</span>
            <span className="text-[9px] text-slate-400">margem cobrada</span>
          </div>

          <span className="text-slate-400 text-2xl font-light">=</span>

          <div className="flex flex-col items-center bg-white dark:bg-slate-900 rounded p-2 min-w-[100px]">
            <span className="text-[10px] text-slate-500 uppercase">MDR mínimo</span>
            <span className="text-xl font-bold">{cell.mdr_min.toFixed(2)}%</span>
            <span className="text-[9px] text-slate-400">piso para planos</span>
          </div>

          <ArrowRight className="text-slate-400 w-4 h-4" />

          <div className="flex flex-col items-center bg-emerald-50 dark:bg-emerald-900/30 rounded p-2 min-w-[100px] border border-emerald-200">
            <span className="text-[10px] text-emerald-700 uppercase">Observado</span>
            <span className="text-xl font-bold text-emerald-700">{cell.observed_avg?.toFixed(2)}%</span>
            <span className="text-[9px] text-emerald-600">+{((cell.observed_avg - cell.mdr_min) * 100 / cell.mdr_min).toFixed(1)}% acima mín</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-blue-200 text-[10px]">
          <div>
            <span className="text-slate-500">Planos usando: </span>
            <strong>{cell.plans_using}</strong>
          </div>
          <div>
            <span className="text-slate-500">Lojistas: </span>
            <strong>{cell.merchants_count?.toLocaleString('pt-BR')}</strong>
          </div>
          <div>
            <span className="text-slate-500">TPV/mês: </span>
            <strong>R$ {(cell.monthly_tpv / 1_000_000).toFixed(1)}mi</strong>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}