import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CARD_BRANDS, MODALITIES, CHANNELS } from '@/components/mentor/mocks/spreadMdrMock';

/**
 * Decomposição visual MDR base + Spread = Mínimo cobrado — F1531
 */
export default function SpreadMDRDecomposer({ rule }) {
  if (!rule) return null;
  const total = rule.spread + rule.mdr_base;
  const spreadPct = (rule.spread / total) * 100;
  const basePct = (rule.mdr_base / total) * 100;

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <Badge className={`text-[10px] ${CARD_BRANDS[rule.brand]?.color}`}>{CARD_BRANDS[rule.brand]?.label}</Badge>
          <Badge className={`text-[10px] ${MODALITIES[rule.modality]?.color}`}>{MODALITIES[rule.modality]?.label}</Badge>
          <Badge variant="outline" className="text-[10px]">{CHANNELS[rule.channel]?.icon} {CHANNELS[rule.channel]?.label}</Badge>
        </div>

        <p className="text-xs text-slate-500 mb-2">Decomposição do MDR mínimo cobrado ao lojista:</p>

        <div className="flex items-end gap-1 h-16 mb-2">
          <div
            className="bg-blue-500 rounded-l flex items-end justify-center px-2 text-white text-xs font-bold"
            style={{ width: `${basePct}%` }}
            title="MDR base bandeira (interchange + brand fee + adquirência)"
          >
            {basePct > 18 && `${rule.mdr_base.toFixed(2)}%`}
          </div>
          <div
            className="bg-[#2bc196] rounded-r flex items-end justify-center px-2 text-white text-xs font-bold"
            style={{ width: `${spreadPct}%` }}
            title="Spread PagSmile (margem do projeto)"
          >
            {spreadPct > 18 && `+${rule.spread.toFixed(2)}%`}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-blue-500" />
            <span>MDR Base bandeira <strong>{rule.mdr_base.toFixed(2)}%</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-[#2bc196]" />
            <span>Spread PagSmile <strong>{rule.spread.toFixed(2)}%</strong></span>
          </div>
          <div>
            <span className="text-slate-500">MDR mínimo total: </span>
            <strong className="text-base">{total.toFixed(2)}%</strong>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 italic mt-3">
          Lojistas com plano abaixo deste mínimo precisam de aprovação especial. Aplicado em <strong>{rule.applied_count.toLocaleString('pt-BR')}</strong> transações nos últimos 30 dias.
        </p>
      </CardContent>
    </Card>
  );
}