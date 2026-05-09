import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid3x3, Filter } from 'lucide-react';
import { CARD_BRANDS, MODALITIES, CHANNELS } from '@/components/mentor/mocks/spreadMdrMock';

/**
 * Matriz tridimensional bandeira × modalidade × canal — heatmap clicável (F1530-F1535)
 */
export default function SpreadMDRMatrix({ rules = [], onCellClick }) {
  const [channelFilter, setChannelFilter] = useState('ecommerce');

  // Heat color: lower spread = green, higher spread = red
  const getHeatColor = (spread) => {
    if (spread == null) return 'bg-slate-50 dark:bg-slate-900 text-slate-300';
    if (spread < 0.7) return 'bg-emerald-100 text-emerald-900';
    if (spread < 1.2) return 'bg-blue-100 text-blue-900';
    if (spread < 1.6) return 'bg-amber-100 text-amber-900';
    if (spread < 2.0) return 'bg-orange-100 text-orange-900';
    return 'bg-red-100 text-red-900';
  };

  const getCell = (brand, modality) =>
    rules.find((r) => r.brand === brand && r.modality === modality && r.channel === channelFilter);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Grid3x3 className="w-4 h-4" />Matriz MDR · spread por combinação (heatmap clicável)
          </span>
          <div className="flex items-center gap-2">
            <Filter className="w-3 h-3 text-slate-500" />
            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CHANNELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.icon} {v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 font-semibold w-32">Bandeira ↓ / Modalidade →</th>
                {Object.entries(MODALITIES).map(([k, v]) => (
                  <th key={k} className="text-center p-2 font-semibold">
                    <Badge className={`text-[9px] ${v.color}`}>{v.label}</Badge>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(CARD_BRANDS).map(([brandKey, brand]) => (
                <tr key={brandKey} className="border-t">
                  <td className="p-2">
                    <Badge className={`text-[10px] ${brand.color}`}>{brand.icon} {brand.label}</Badge>
                  </td>
                  {Object.entries(MODALITIES).map(([modKey]) => {
                    const cell = getCell(brandKey, modKey);
                    return (
                      <td key={modKey} className="p-1.5">
                        <button
                          onClick={() => cell && onCellClick?.(cell)}
                          disabled={!cell}
                          className={`w-full p-2.5 rounded-lg text-center font-mono font-bold transition-all ${getHeatColor(cell?.spread)} ${cell ? 'hover:ring-2 hover:ring-[#2bc196] cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
                        >
                          {cell ? (
                            <>
                              <div className="text-base">{cell.spread.toFixed(2)}%</div>
                              <div className="text-[9px] opacity-70 font-normal">
                                MDR efet. {(cell.spread + cell.mdr_base).toFixed(2)}%
                              </div>
                              <div className="text-[9px] opacity-60 font-normal">{(cell.applied_count / 1000).toFixed(1)}k tx</div>
                            </>
                          ) : (
                            <div className="text-xs opacity-50">não cadastrado</div>
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

        {/* Legenda heatmap */}
        <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-3 flex-wrap">
          <span>Heatmap:</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-100" />&lt; 0,70%</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-100" />0,70-1,20%</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100" />1,20-1,60%</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-100" />1,60-2,00%</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100" />&gt; 2,00%</span>
        </div>
      </CardContent>
    </Card>
  );
}