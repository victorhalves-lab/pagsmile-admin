import React from 'react';
import { Search, X, Bookmark } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { defaultSavedViews } from '@/components/subscriptions/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function SubscriptionsFilters({
  search, onSearch, planFilter, onPlanChange, plans,
  methodFilter, onMethodChange, valueRange, onValueRangeChange,
  ageFilter, onAgeChange, healthFilter, onHealthChange,
  trialExpiringFilter, onTrialExpiringChange,
  activeFilterCount, onClearFilters, onSelectView, currentView,
}) {
  return (
    <Card>
      <CardContent className="p-3 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {defaultSavedViews.map((v) => (
            <button
              key={v.id}
              onClick={() => onSelectView(v.id)}
              className={cn(
                'px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1',
                currentView === v.id ? 'bg-[#2bc196] text-white border-[#2bc196]' : 'border-slate-200 hover:border-slate-300 text-slate-600'
              )}
            >
              <Bookmark className="w-2.5 h-2.5" />
              {v.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <Input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Buscar cliente, email, plano, ID..." className="pl-9 h-8 text-xs" />
          </div>
          <Select value={planFilter} onValueChange={onPlanChange}>
            <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Plano" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Todos planos</SelectItem>
              {plans.map((p) => <SelectItem key={p.plan_id} value={p.plan_id} className="text-xs">{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={methodFilter} onValueChange={onMethodChange}>
            <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Método" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Todos</SelectItem>
              <SelectItem value="card" className="text-xs">Cartão</SelectItem>
              <SelectItem value="pix" className="text-xs">PIX</SelectItem>
              <SelectItem value="boleto" className="text-xs">Boleto</SelectItem>
            </SelectContent>
          </Select>
          <Select value={valueRange} onValueChange={onValueRangeChange}>
            <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Valor" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Qualquer</SelectItem>
              <SelectItem value="low" className="text-xs">Até R$ 100</SelectItem>
              <SelectItem value="mid" className="text-xs">R$ 100-500</SelectItem>
              <SelectItem value="high" className="text-xs">+R$ 500</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ageFilter} onValueChange={onAgeChange}>
            <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Idade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Qualquer</SelectItem>
              <SelectItem value="new" className="text-xs">Novos</SelectItem>
              <SelectItem value="recent" className="text-xs">1-3m</SelectItem>
              <SelectItem value="mature" className="text-xs">3-12m</SelectItem>
              <SelectItem value="veteran" className="text-xs">+1a</SelectItem>
            </SelectContent>
          </Select>
          <Select value={healthFilter} onValueChange={onHealthChange}>
            <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Saúde" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Todas</SelectItem>
              <SelectItem value="healthy" className="text-xs">Saudável</SelectItem>
              <SelectItem value="attention" className="text-xs">Atenção</SelectItem>
              <SelectItem value="risk" className="text-xs">Em risco</SelectItem>
            </SelectContent>
          </Select>
          <Select value={trialExpiringFilter} onValueChange={onTrialExpiringChange}>
            <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Trial" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Todas</SelectItem>
              <SelectItem value="3" className="text-xs">Trial: 3d</SelectItem>
              <SelectItem value="7" className="text-xs">Trial: 7d</SelectItem>
              <SelectItem value="14" className="text-xs">Trial: 14d</SelectItem>
            </SelectContent>
          </Select>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onClearFilters}>
              <X className="w-3 h-3 mr-1" /> Limpar
              <Badge className="ml-1 h-4 text-[9px]">{activeFilterCount}</Badge>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}