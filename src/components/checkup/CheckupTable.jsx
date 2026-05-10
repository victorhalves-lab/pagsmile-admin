import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Eye, Copy, ExternalLink, AlertCircle } from 'lucide-react';
import { CHECKUP_TYPES, CHECKUP_SEVERITIES, CHECKUP_STATUS, CHECKUP_RECOMMENDATIONS } from './mocks/checkupMock';
import { Link } from 'react-router-dom';

function SLABadge({ hoursOpen, slaHours, breached }) {
  if (breached) {
    return (
      <Badge className="bg-red-500 text-white gap-1">
        <AlertCircle className="w-3 h-3" />
        +{Math.round(hoursOpen - slaHours)}h
      </Badge>
    );
  }
  const remaining = slaHours - hoursOpen;
  if (remaining < slaHours * 0.2) {
    return <Badge className="bg-amber-500 text-white">~{remaining.toFixed(1)}h restantes</Badge>;
  }
  return <Badge className="bg-emerald-500 text-white">{remaining.toFixed(1)}h restantes</Badge>;
}

export default function CheckupTable({ items, selected, onSelectionChange, onViewDetail }) {
  const allSelected = items.length > 0 && items.every(i => selected.has(i.id));
  
  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(items.map(i => i.id)));
    }
  };

  const toggleOne = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-3 w-10">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
              </th>
              <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300">ID Checkup</th>
              <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300">Lojista</th>
              <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300">Tipo</th>
              <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300">Severidade</th>
              <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300">Status</th>
              <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300">SLA</th>
              <th className="text-right p-3 font-semibold text-slate-700 dark:text-slate-300">Valor</th>
              <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300">Recomendação IA</th>
              <th className="text-left p-3 font-semibold text-slate-700 dark:text-slate-300">Atribuído</th>
              <th className="text-center p-3 font-semibold text-slate-700 dark:text-slate-300">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const typeCfg = CHECKUP_TYPES[item.type];
              const sevCfg = CHECKUP_SEVERITIES[item.severity];
              const stCfg = CHECKUP_STATUS[item.status];
              const recCfg = CHECKUP_RECOMMENDATIONS[item.recommendation];
              return (
                <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                  <td className="p-3">
                    <Checkbox checked={selected.has(item.id)} onCheckedChange={() => toggleOne(item.id)} />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <code className="text-xs font-mono text-slate-600 dark:text-slate-300">{item.id}</code>
                      <button onClick={() => navigator.clipboard.writeText(item.id)} className="text-slate-400 hover:text-slate-600">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <Link to={`/AdminIntTransactionDetail?id=${item.transaction_id}`} className="text-xs text-cyan-600 hover:underline flex items-center gap-1 mt-0.5">
                      {item.transaction_id} <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-slate-800 dark:text-slate-100">{item.merchant.name}</div>
                    <div className="text-xs text-slate-500">{item.merchant.cnpj}</div>
                  </td>
                  <td className="p-3">
                    <Badge className={`${typeCfg.color} text-xs`}>{typeCfg.label}</Badge>
                    {item.tags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {item.tags.includes('regulatorio') && <Badge variant="outline" className="text-xs">🏛️</Badge>}
                        {item.tags.includes('pld_ft') && <Badge variant="outline" className="text-xs">🚨</Badge>}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <Badge className={sevCfg.color}>{sevCfg.label}</Badge>
                  </td>
                  <td className="p-3">
                    <Badge className={stCfg.color} variant="secondary">{stCfg.label}</Badge>
                  </td>
                  <td className="p-3">
                    <SLABadge hoursOpen={item.hours_open} slaHours={item.sla_hours} breached={item.sla_breached} />
                  </td>
                  <td className="p-3 text-right font-mono text-sm">
                    R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3">
                    <span className={`text-xs font-medium ${recCfg.color}`}>{recCfg.label}</span>
                  </td>
                  <td className="p-3">
                    {item.assigned_to ? (
                      <div className="text-xs">
                        <div className="font-medium">{item.assigned_to.name}</div>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">Não atribuído</Badge>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <Button size="icon" variant="ghost" onClick={() => onViewDetail(item)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}