import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { Search, Filter, X, BookmarkPlus, Bookmark, Activity, ChevronDown } from 'lucide-react';

const savedViewsMock = [
  { id: 'risk', label: 'Em risco de expirar', filters: { status: 'active', sort: 'expiring_soon' } },
  { id: 'no_use', label: 'Sem uso há 30+ dias', filters: { sort: 'low_usage' } },
  { id: 'top', label: 'Top performers', filters: { status: 'active', sort: 'best_revenue' } },
];

export default function CouponListFilters({
  search, onSearch,
  statusFilter, onStatusChange,
  typeFilter, onTypeChange,
  nominalFilter, onNominalChange,
  audienceFilter, onAudienceChange,
  valueRange, onValueRangeChange,
  sortBy, onSortChange,
  healthMode, onHealthModeChange,
  activeFiltersCount, onClearFilters,
}) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 border rounded-xl p-3 space-y-2">
      <div className="flex flex-col lg:flex-row lg:items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Código, nome ou e-mail..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10 h-9"
          />
        </div>

        {/* Quick filters */}
        <div className="flex flex-wrap gap-1.5">
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-32 h-9 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
              <SelectItem value="expired">Expirados</SelectItem>
              <SelectItem value="depleted">Esgotados</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={onTypeChange}>
            <SelectTrigger className="w-28 h-9 text-xs"><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Tipos</SelectItem>
              <SelectItem value="percentage">Percentual</SelectItem>
              <SelectItem value="fixed_amount">Valor Fixo</SelectItem>
            </SelectContent>
          </Select>
          <Select value={nominalFilter} onValueChange={onNominalChange}>
            <SelectTrigger className="w-28 h-9 text-xs"><SelectValue placeholder="Escopo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="nominal">Nominais</SelectItem>
              <SelectItem value="general">Gerais</SelectItem>
            </SelectContent>
          </Select>

          {/* Advanced Popover */}
          <Popover open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 text-xs gap-1">
                <Filter className="w-3.5 h-3.5" />
                Avançado
                <ChevronDown className="w-3 h-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-3 space-y-3" align="end">
              <div>
                <label className="text-xs font-semibold text-slate-600">Audiência</label>
                <Select value={audienceFilter} onValueChange={onAudienceChange}>
                  <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue placeholder="Todas" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Novos">Novos clientes</SelectItem>
                    <SelectItem value="VIPs">VIPs</SelectItem>
                    <SelectItem value="Geral">Geral</SelectItem>
                    <SelectItem value="Afiliados">Afiliados</SelectItem>
                    <SelectItem value="Nominal">Nominais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Faixa de desconto</label>
                <Select value={valueRange} onValueChange={onValueRangeChange}>
                  <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue placeholder="Todos" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="low">Até 10%</SelectItem>
                    <SelectItem value="mid">10–25%</SelectItem>
                    <SelectItem value="high">25%+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Ordenar por</label>
                <Select value={sortBy} onValueChange={onSortChange}>
                  <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Mais recentes</SelectItem>
                    <SelectItem value="best_revenue">Maior receita</SelectItem>
                    <SelectItem value="best_conversion">Melhor conversão</SelectItem>
                    <SelectItem value="most_used">Mais usados</SelectItem>
                    <SelectItem value="expiring_soon">Expirando em breve</SelectItem>
                    <SelectItem value="low_usage">Baixa utilização</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>

          {/* Saved Views */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 text-xs gap-1">
                <Bookmark className="w-3.5 h-3.5" /> Visões
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end">
              <p className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Visões salvas</p>
              {savedViewsMock.map((v) => (
                <button
                  key={v.id}
                  className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => {
                    onStatusChange(v.filters.status || 'all');
                    onSortChange(v.filters.sort || 'recent');
                  }}
                >
                  {v.label}
                </button>
              ))}
              <div className="border-t mt-1 pt-1">
                <button className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-[#2bc196]">
                  <BookmarkPlus className="w-3.5 h-3.5" /> Salvar visão atual
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Health mode toggle */}
          <Button
            variant={healthMode ? 'default' : 'outline'}
            size="sm"
            className="h-9 text-xs gap-1"
            onClick={() => onHealthModeChange(!healthMode)}
            title="Modo saúde — mostra badge colorido por linha"
          >
            <Activity className="w-3.5 h-3.5" />
            Saúde
          </Button>

          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" className="h-9 text-xs" onClick={onClearFilters}>
              <X className="w-3.5 h-3.5 mr-1" />
              Limpar
              <Badge className="ml-1 h-4 text-[9px] px-1">{activeFiltersCount}</Badge>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}