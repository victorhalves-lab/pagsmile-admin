import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, FileText, Undo2, Ban, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import UrgencyPill from './UrgencyPill';
import { fmtBRL, channelLabel, channelColor, aiScoreForPrecb, recommendedActionLabel } from './utils';

function ChannelBadge({ channel }) {
  return (
    <Badge variant="outline" className={cn('text-[10px] font-bold', channelColor(channel))}>
      {channelLabel(channel)}
    </Badge>
  );
}

function WinProbCell({ item }) {
  if (item._channel !== 'cb') return <span className="text-slate-300 text-xs">—</span>;
  const p = item.win_probability;
  if (p === undefined || p === null) return <span className="text-slate-400 text-xs">—</span>;
  const color = p >= 60 ? 'emerald' : p >= 30 ? 'amber' : 'red';
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full',
            color === 'emerald' ? 'bg-emerald-500' : color === 'amber' ? 'bg-amber-500' : 'bg-red-500'
          )}
          style={{ width: `${p}%` }}
        />
      </div>
      <span className={cn(
        'text-[10px] font-bold',
        color === 'emerald' ? 'text-emerald-600' : color === 'amber' ? 'text-amber-600' : 'text-red-600'
      )}>{p}%</span>
    </div>
  );
}

function AiActionCell({ item }) {
  if (item._channel === 'precb') {
    const { recommended } = aiScoreForPrecb(item);
    const a = recommendedActionLabel(recommended);
    return <Badge className={cn('text-[10px] border-0', a.color)}>{a.label}</Badge>;
  }
  if (item._channel === 'cb' && item.ai_recommendation) {
    const a = recommendedActionLabel(item.ai_recommendation);
    return <Badge className={cn('text-[10px] border-0', a.color)}>{a.label}</Badge>;
  }
  return <span className="text-slate-300 text-xs">—</span>;
}

export default function UnifiedQueueTable({ items, selected, onToggleSelect, onToggleAll, onView, onAction }) {
  const allSelected = items.length > 0 && items.every((i) => selected.has(i.id));

  if (items.length === 0) {
    return (
      <Card className="p-12 text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
        <p className="text-sm font-bold">Nenhuma disputa na fila</p>
        <p className="text-xs text-slate-500">Sua operação está em dia.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="w-8">
              <Checkbox checked={allSelected} onCheckedChange={onToggleAll} />
            </TableHead>
            <TableHead className="text-[10px] font-bold uppercase">Canal</TableHead>
            <TableHead className="text-[10px] font-bold uppercase">ID / Transação</TableHead>
            <TableHead className="text-[10px] font-bold uppercase">Cliente</TableHead>
            <TableHead className="text-[10px] font-bold uppercase">Valor</TableHead>
            <TableHead className="text-[10px] font-bold uppercase">Bandeira / Motivo</TableHead>
            <TableHead className="text-[10px] font-bold uppercase">Prazo</TableHead>
            <TableHead className="text-[10px] font-bold uppercase">Win Prob</TableHead>
            <TableHead className="text-[10px] font-bold uppercase">Ação IA</TableHead>
            <TableHead className="text-[10px] font-bold uppercase text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="hover:bg-slate-50/50">
              <TableCell>
                <Checkbox checked={selected.has(item.id)} onCheckedChange={() => onToggleSelect(item.id)} />
              </TableCell>
              <TableCell><ChannelBadge channel={item._channel} /></TableCell>
              <TableCell>
                <p className="text-xs font-mono font-bold">{item.dispute_id || item.med_id || item.id?.slice(0, 10)}</p>
                <p className="text-[10px] text-slate-500 font-mono truncate max-w-[120px]">{item.transaction_id || '—'}</p>
              </TableCell>
              <TableCell>
                <p className="text-xs font-medium">{item.customer_name || item.payer_name || '—'}</p>
                <p className="text-[10px] text-slate-500 truncate max-w-[140px]">{item.customer_email || '—'}</p>
              </TableCell>
              <TableCell className="text-xs font-bold">{fmtBRL(item.amount || item.requested_amount)}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-[10px] mb-0.5">
                  {item.card_brand || (item._channel === 'med' ? 'PIX' : '—')}
                </Badge>
                <p className="text-[10px] text-slate-500 max-w-[120px] truncate">
                  {item.reason_code || item.reason_description || item.reason || '—'}
                </p>
              </TableCell>
              <TableCell><UrgencyPill item={item} /></TableCell>
              <TableCell><WinProbCell item={item} /></TableCell>
              <TableCell><AiActionCell item={item} /></TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-0.5">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onView(item)}>
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                  {item._channel === 'precb' && (
                    <>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-emerald-600" onClick={() => onAction('refund', item)}>
                        <Undo2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-500" onClick={() => onAction('ignore', item)}>
                        <Ban className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  )}
                  {item._channel === 'cb' && (
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-purple-600" onClick={() => onAction('contest', item)}>
                      <FileText className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  {item._channel === 'med' && (
                    <>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-emerald-600" onClick={() => onAction('accept_med', item)}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-red-600" onClick={() => onAction('reject_med', item)}>
                        <Ban className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}