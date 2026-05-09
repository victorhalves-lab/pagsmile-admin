import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid3x3, Plus } from 'lucide-react';
import { CARD_BRANDS, PAYMENT_MODALITIES, CHANNELS_FOR_MDR, SPREAD_POLICY } from '@/components/mentor/mocks/spreadMDRMock';

/**
 * Heatmap interativo bandeira × modalidade × canal — F1521-F1525
 */
export default function SpreadMDRMatrix({ matrix = [], onCellClick, onAdd }) {
  const [channelFilter, setChannelFilter] = useState('all');

  const filtered = channelFilter === 'all' ? matrix : matrix.filter((m) => m.channel === channelFilter);

  const brands = Object.keys(CARD_BRANDS);
  const modalities = Object.keys(PAYMENT_MODALITIES);

  const findCell = (brand, modality) => {
    if (channelFilter !== 'all') {
      return filtered.find((m) => m.brand === brand && m.modality === modality && m.channel === channelFilter);
    }
    // Aggregate when 'all'
    const cells = filtered.filter((m) => m.brand === brand && m.modality === modality);
    if (cells.length === 0) return null;
    if (cells.length === 1) return cells[0];
    return {
      ...cells[0],
      spread: cells.reduce((s, c) => s + c.spread, 0) / cells.length,
      mdr_min: cells.reduce((s, c) => s + c.mdr_min, 0) / cells.length,
      observed_avg: cells.reduce((s, c) => s + c.observed_avg, 0) / cells.length,
      _aggregated: cells.length,
    };
  };

  const colorForSpread = (spread) => {
    if (!spread) return 'bg-slate-50 dark:bg-slate-900';
    if (spread < 0.5) return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200';
    if (spread < 1.0) return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200';
    if (spread < 1.5) return 'bg-violet-50 dark:bg-violet-900/20 border-violet-200';
    if (spread < SPREAD_POLICY.spread_alert_threshold) return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200';
    return 'bg-red-50 dark:bg-red-900/20 border-red-300';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between gap-2 flex-wrap">
          <span className="flex items-center gap-2">
            <Grid3x3 className="w-4 h-4" />Matriz Spread MDR
          </span>
          <div className="flex items-center gap-2">
            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger className="w-44 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os canais (média)</SelectItem>
                {Object.entries(CHANNELS_FOR_MDR).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={onAdd}>
              <Plus className="w-3.5 h-3.5 mr-1" />Nova combinação
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 sticky left-0 bg-white dark:bg-[#003459] z-10 border-r">Bandeira</th>
                {modalities.map((m) => (
                  <th key={m} className="text-center p-2 font-semibold border-l">
                    <div>{PAYMENT_MODALITIES[m].label}</div>
                    <div className="text-[9px] text-slate-400 font-normal">{PAYMENT_MODALITIES[m].short}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand}>
                  <td className="p-2 sticky left-0 bg-white dark:bg-[#003459] z-10 border-r border-t">
                    <div className="flex items-center gap-2 font-bold">
                      <span>{CARD_BRANDS[brand].icon}</span>
                      {CARD_BRANDS[brand].label}
                    </div>
                  </td>
                  {modalities.map((modality) => {
                    const cell = findCell(brand, modality);
                    if (!cell) {
                      return (
                        <td key={modality} className="border-l border-t p-1">
                          <button
                            onClick={() => onCellClick?.({ brand, modality, channel: channelFilter !== 'all' ? channelFilter : 'ecommerce' }, true)}
                            className="w-full h-16 rounded text-[10px] text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-dashed border-slate-300"
                            title="Cadastrar"
                          >
                            +
                          </button>
                        </td>
                      );
                    }
                    return (
                      <td key={modality} className="border-l border-t p-1">
                        <button
                          onClick={() => onCellClick?.(cell, false)}
                          className={`w-full p-2 rounded border text-left hover:ring-2 hover:ring-[#2bc196] transition ${colorForSpread(cell.spread)}`}
                        >
                          <div className="text-base font-bold">{cell.spread.toFixed(2)}%</div>
                          <div className="text-[9px] text-slate-600 mt-0.5">
                            mín {cell.mdr_min.toFixed(2)}%
                            {cell.observed_avg && ` · obs ${cell.observed_avg.toFixed(2)}%`}
                          </div>
                          {cell._aggregated && (
                            <Badge className="mt-1 text-[8px] bg-slate-100 text-slate-600">{cell._aggregated} canais</Badge>
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
          <span className="text-slate-500 font-semibold">Legenda:</span>
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">&lt; 0,5%</Badge>
          <Badge className="bg-blue-50 text-blue-700 border-blue-200">0,5-1%</Badge>
          <Badge className="bg-violet-50 text-violet-700 border-violet-200">1-1,5%</Badge>
          <Badge className="bg-amber-50 text-amber-700 border-amber-200">1,5-2%</Badge>
          <Badge className="bg-red-50 text-red-700 border-red-300">&gt; 2% (alerta)</Badge>
        </div>
      </CardContent>
    </Card>
  );
}