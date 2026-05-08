import React from 'react';
import { Search, X, Bookmark } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const savedViews = [
  { id: 'critical', label: 'Prazo crítico' },
  { id: 'precb', label: 'Pre-CBs ativos' },
  { id: 'cb_high_prob', label: 'CB win prob > 60%' },
  { id: 'med_2h', label: 'MED < 2h' },
  { id: 'high_value', label: 'Alto valor' },
];

export default function UnifiedQueueFilters({
  search, onSearch, channelFilter, onChannelChange,
  brandFilter, onBrandChange, valueRange, onValueRangeChange,
  urgencyFilter, onUrgencyChange,
  activeFilterCount, onClearFilters, currentView, onSelectView,
}) {
  return (
    <Card>
      <CardContent className="p-3 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {savedViews.map((v) => (
            <button
              key={v.id}
              onClick={() => onSelectView(v.id)}
              className={cn(
                'px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1',
                currentView === v.id
                  ? 'bg-[#2bc196] text-white border-[#2bc196]'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
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
            <Input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Buscar ID, ARN, cliente, transação..."
              className="pl-9 h-8 text-xs"
            />
          </div>
          <Select value={channelFilter} onValueChange={onChannelChange}>
            <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Canal" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Todos canais</SelectItem>
              <SelectItem value="precb" className="text-xs">Pre-CB</SelectItem>
              <SelectItem value="cb" className="text-xs">Chargeback</SelectItem>
              <SelectItem value="med" className="text-xs">MED</SelectItem>
            </SelectContent>
          </Select>
          <Select value={brandFilter} onValueChange={onBrandChange}>
            <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Bandeira" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Todas</SelectItem>
              <SelectItem value="visa" className="text-xs">Visa</SelectItem>
              <SelectItem value="mastercard" className="text-xs">Mastercard</SelectItem>
              <SelectItem value="elo" className="text-xs">Elo</SelectItem>
              <SelectItem value="amex" className="text-xs">Amex</SelectItem>
              <SelectItem value="hipercard" className="text-xs">Hipercard</SelectItem>
              <SelectItem value="pix" className="text-xs">PIX (MED)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={valueRange} onValueChange={onValueRangeChange}>
            <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Valor" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Qualquer</SelectItem>
              <SelectItem value="low" className="text-xs">Até R$ 100</SelectItem>
              <SelectItem value="mid" className="text-xs">R$ 100-500</SelectItem>
              <SelectItem value="high" className="text-xs">R$ 500-2k</SelectItem>
              <SelectItem value="vhigh" className="text-xs">+R$ 2k</SelectItem>
            </SelectContent>
          </Select>
          <Select value={urgencyFilter} onValueChange={onUrgencyChange}>
            <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Urgência" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">Todas</SelectItem>
              <SelectItem value="critical" className="text-xs">Crítico</SelectItem>
              <SelectItem value="high" className="text-xs">Alto</SelectItem>
              <SelectItem value="medium" className="text-xs">Médio</SelectItem>
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