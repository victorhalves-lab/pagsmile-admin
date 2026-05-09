import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Search } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { MOCK_SALES_PLANS, PLAN_STATUS } from '@/components/mentor/mocks/salesPlansMock';

export default function PlanComparatorPicker({ selected = [], onChange, max = 4 }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const available = MOCK_SALES_PLANS.filter(
    (p) => !selected.includes(p.id) && (p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase()))
  );

  const add = (id) => {
    if (selected.length >= max) return;
    onChange([...selected, id]);
    setSearch('');
    setOpen(false);
  };

  const remove = (id) => {
    onChange(selected.filter((s) => s !== id));
  };

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 mr-2">Comparando:</span>
          {selected.map((id) => {
            const plan = MOCK_SALES_PLANS.find((p) => p.id === id);
            if (!plan) return null;
            const status = PLAN_STATUS[plan.status];
            return (
              <Badge key={id} className={`pl-2 pr-1 py-1 text-[10px] gap-1 ${status?.color}`}>
                <span className="font-mono">{plan.code}</span>
                <button onClick={() => remove(id)} className="hover:bg-black/10 dark:hover:bg-white/10 rounded p-0.5 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}
          {selected.length < max && (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button size="sm" variant="outline" className="h-7 text-[10px]">
                  <Plus className="w-3 h-3 mr-1" />Adicionar plano ({selected.length}/{max})
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-2" align="start">
                <div className="relative mb-2">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <Input placeholder="Buscar plano..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 pl-7 text-xs" />
                </div>
                <div className="max-h-72 overflow-y-auto space-y-1">
                  {available.length === 0 && <p className="text-xs text-slate-500 italic p-2">Nenhum plano disponível</p>}
                  {available.map((p) => {
                    const status = PLAN_STATUS[p.status];
                    return (
                      <button
                        key={p.id}
                        onClick={() => add(p.id)}
                        className="w-full text-left p-2 rounded hover:bg-violet-50 dark:hover:bg-violet-900/20 border border-transparent hover:border-violet-200 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-[11px] font-bold truncate">{p.name}</span>
                          <Badge className={`text-[8px] ${status?.color} shrink-0`}>{status?.label}</Badge>
                        </div>
                        <p className="text-[9px] text-slate-500 font-mono">{p.code} · {p.project_name}</p>
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardContent>
    </Card>
  );
}