import React from 'react';
import { Search, Calendar, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTransactionsContext } from './TransactionsContext';
import SavedViewsManager from './SavedViewsManager';

/**
 * Filtros sticky cross-aba (período/método/status persistem entre abas).
 * Padrão Mercury/Stripe.
 */
export default function StickyFiltersBar() {
  const { stickyFilters, updateFilter, removeFilter, clearFilters } = useTransactionsContext();

  const periodLabel = {
    today: 'Hoje',
    yesterday: 'Ontem',
    '7d': 'Últimos 7 dias',
    '30d': 'Últimos 30 dias',
    custom: 'Personalizado',
  };

  const methodLabel = {
    all: 'Todos os métodos',
    card: 'Cartão',
    pix: 'PIX',
    boleto: 'Boleto',
  };

  const activeChips = [];
  if (stickyFilters.period !== 'today') activeChips.push({ key: 'period', label: periodLabel[stickyFilters.period] });
  if (stickyFilters.method !== 'all') activeChips.push({ key: 'method', label: methodLabel[stickyFilters.method] });
  if (stickyFilters.statuses?.length) activeChips.push({ key: 'statuses', label: `${stickyFilters.statuses.length} status` });
  if (stickyFilters.search) activeChips.push({ key: 'search', label: `"${stickyFilters.search}"` });

  return (
    <div className="sticky top-16 z-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-3 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar ID, cliente, e-mail, pedido..."
            value={stickyFilters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {/* Period */}
        <Select value={stickyFilters.period} onValueChange={(v) => updateFilter('period', v)}>
          <SelectTrigger className="w-[170px] h-9">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="yesterday">Ontem</SelectItem>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="custom">Personalizado...</SelectItem>
          </SelectContent>
        </Select>

        {/* Method */}
        <Select value={stickyFilters.method} onValueChange={(v) => updateFilter('method', v)}>
          <SelectTrigger className="w-[150px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os métodos</SelectItem>
            <SelectItem value="card">Cartão</SelectItem>
            <SelectItem value="pix">PIX</SelectItem>
            <SelectItem value="boleto">Boleto</SelectItem>
          </SelectContent>
        </Select>

        {/* Saved Views */}
        <SavedViewsManager />
      </div>

      {/* Filter chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
          <span className="text-xs text-slate-500">Filtros ativos:</span>
          {activeChips.map(chip => (
            <Badge key={chip.key} variant="secondary" className="gap-1 cursor-pointer hover:bg-slate-200" onClick={() => removeFilter(chip.key)}>
              {chip.label}
              <X className="w-3 h-3" />
            </Badge>
          ))}
          <Button variant="ghost" size="sm" className="h-6 text-xs text-slate-500" onClick={clearFilters}>
            Limpar tudo
          </Button>
        </div>
      )}
    </div>
  );
}