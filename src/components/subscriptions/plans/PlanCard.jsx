import React from 'react';
import { Star, MoreHorizontal, Edit, Copy, Share2, Repeat, Archive, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { fmtCurrency } from '@/components/subscriptions/utils';
import { cn } from '@/lib/utils';

export default function PlanCard({ plan, onEdit, onAction, onClickDetail }) {
  return (
    <Card className={cn('relative cursor-pointer hover:shadow-xl transition-all', plan.is_popular && 'ring-2 ring-[#2bc196]')}>
      {plan.is_popular && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
          <Badge className="bg-[#2bc196] text-white border-0 text-[10px]"><Star className="w-3 h-3 mr-0.5" /> Popular</Badge>
        </div>
      )}
      <CardContent className="p-4" onClick={onClickDetail}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-base">{plan.name}</h3>
            <p className="text-[10px] text-slate-500">{plan.description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button size="icon" variant="ghost" className="h-7 w-7"><MoreHorizontal className="w-3.5 h-3.5" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => onEdit(plan)}><Edit className="w-3 h-3 mr-2" /> Editar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('duplicate', plan)}><Copy className="w-3 h-3 mr-2" /> Duplicar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('share', plan)}><Share2 className="w-3 h-3 mr-2" /> Copiar link</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('migrate', plan)}><Repeat className="w-3 h-3 mr-2" /> Migrar</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAction('toggle', plan)}>{plan.status === 'active' ? 'Desativar' : 'Ativar'}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('archive', plan)}><Archive className="w-3 h-3 mr-2" /> Arquivar</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => onAction('delete', plan)}><Trash2 className="w-3 h-3 mr-2" /> Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mb-3">
          <span className="text-2xl font-black">{fmtCurrency(plan.amount, { precise: true })}</span>
          <span className="text-xs text-slate-500">/mês</span>
        </div>

        {plan.trial_days > 0 && <Badge variant="outline" className="text-[10px] mb-3">Trial {plan.trial_days}d</Badge>}

        <ul className="space-y-1 mb-3">
          {(plan.benefits || []).slice(0, 4).map((b, i) => (
            <li key={i} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
              <span className="text-[#2bc196] mt-0.5">✓</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="border-t pt-2 grid grid-cols-3 gap-1 text-center">
          <div>
            <p className="text-[9px] uppercase font-bold text-slate-400">Subs</p>
            <p className="text-xs font-bold">{plan.current_subscribers}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase font-bold text-slate-400">MRR</p>
            <p className="text-xs font-bold text-emerald-600">{fmtCurrency(plan.mrr, { short: true })}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase font-bold text-slate-400">Churn</p>
            <p className={cn('text-xs font-bold', plan.churn_rate > 8 ? 'text-red-600' : plan.churn_rate > 5 ? 'text-amber-600' : 'text-emerald-600')}>{plan.churn_rate}%</p>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <Badge variant="outline" className="text-[9px]">Health {plan.plan_health}/100</Badge>
          <Badge className={cn('text-[9px] border-0', plan.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600')}>
            {plan.status === 'active' ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}