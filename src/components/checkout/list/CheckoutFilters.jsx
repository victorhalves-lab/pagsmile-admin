import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Filtros enriquecidos para a lista de checkouts.
 * Status / Método principal / Tipo / Performance + Sort.
 */
export default function CheckoutFilters({ filters, onChange, onClear, viewMode, onViewModeChange }) {
  const hasActive = filters.status !== 'all' || filters.method !== 'all' || filters.type !== 'all' || filters.perf !== 'all' || filters.search;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por nome, tag, descrição..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>

        <Select value={filters.status} onValueChange={(v) => onChange({ ...filters, status: v })}>
          <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
            <SelectItem value="draft">Rascunhos</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.method} onValueChange={(v) => onChange({ ...filters, method: v })}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Método" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos métodos</SelectItem>
            <SelectItem value="pix">PIX-first</SelectItem>
            <SelectItem value="card">Cartão-first</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.type} onValueChange={(v) => onChange({ ...filters, type: v })}>
          <SelectTrigger className="w-32"><SelectValue placeholder="Tipo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos tipos</SelectItem>
            <SelectItem value="one-step">One-step</SelectItem>
            <SelectItem value="multi-step">Multi-step</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.perf} onValueChange={(v) => onChange({ ...filters, perf: v })}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Performance" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toda performance</SelectItem>
            <SelectItem value="above">Acima da média</SelectItem>
            <SelectItem value="below">Abaixo da média</SelectItem>
            <SelectItem value="ab-active">Em A/B test</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.sort} onValueChange={(v) => onChange({ ...filters, sort: v })}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Ordenar" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Mais recente</SelectItem>
            <SelectItem value="sales">Mais vendido</SelectItem>
            <SelectItem value="conversion-desc">Melhor conversão</SelectItem>
            <SelectItem value="conversion-asc">Pior conversão</SelectItem>
          </SelectContent>
        </Select>

        {hasActive && (
          <Button variant="ghost" size="sm" onClick={onClear} className="text-xs">
            <X className="w-3 h-3 mr-1" /> Limpar
          </Button>
        )}

        <div className="ml-auto flex gap-1 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`px-2 py-1 text-xs rounded ${viewMode === 'grid' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-500'}`}
          >
            Grid
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`px-2 py-1 text-xs rounded ${viewMode === 'list' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-500'}`}
          >
            Lista
          </button>
        </div>
      </div>
    </div>
  );
}