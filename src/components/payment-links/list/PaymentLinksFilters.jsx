import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutGrid, List, KanbanSquare, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PaymentLinksFilters({
  searchTerm,
  onSearch,
  statusFilter,
  onStatusChange,
  methodFilter,
  onMethodChange,
  valueTypeFilter,
  onValueTypeChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  activeFiltersCount = 0,
  onClearFilters,
}) {
  return (
    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border space-y-3">
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
        <Input
          placeholder="Buscar por nome ou ID..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="lg:max-w-xs"
        />

        <div className="flex flex-wrap gap-2 flex-1">
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
              <SelectItem value="expired">Expirados</SelectItem>
              <SelectItem value="sold_out">Esgotados</SelectItem>
              <SelectItem value="draft">Rascunhos</SelectItem>
              <SelectItem value="problem">⚠️ Com problema</SelectItem>
            </SelectContent>
          </Select>

          <Select value={methodFilter} onValueChange={onMethodChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Método" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos métodos</SelectItem>
              <SelectItem value="pix">Apenas PIX</SelectItem>
              <SelectItem value="card">Apenas Cartão</SelectItem>
              <SelectItem value="both">PIX + Cartão</SelectItem>
            </SelectContent>
          </Select>

          <Select value={valueTypeFilter} onValueChange={onValueTypeChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos tipos</SelectItem>
              <SelectItem value="fixed">Valor fixo</SelectItem>
              <SelectItem value="open">Valor aberto</SelectItem>
              <SelectItem value="minimum">Valor mínimo</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Mais recentes</SelectItem>
              <SelectItem value="best_seller">Mais vendidos</SelectItem>
              <SelectItem value="best_conversion">Melhor conversão</SelectItem>
              <SelectItem value="highest_revenue">Maior arrecadação</SelectItem>
              <SelectItem value="worst_perf">Pior performance</SelectItem>
            </SelectContent>
          </Select>

          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="w-4 h-4 mr-1" />
              Limpar ({activeFiltersCount})
            </Button>
          )}
        </div>

        <div className="flex gap-1 border rounded-lg p-1">
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            className="h-7 px-2"
            onClick={() => onViewModeChange('table')}
            title="Tabela densa"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'default' : 'ghost'}
            size="sm"
            className="h-7 px-2"
            onClick={() => onViewModeChange('cards')}
            title="Cards visuais"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'ghost'}
            size="sm"
            className="h-7 px-2"
            onClick={() => onViewModeChange('kanban')}
            title="Kanban por status"
          >
            <KanbanSquare className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}