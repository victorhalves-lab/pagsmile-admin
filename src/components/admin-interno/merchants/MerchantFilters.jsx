import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  Popover, PopoverContent, PopoverTrigger
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, X, Filter, ChevronDown } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'lead', label: 'Lead', icon: '⚪' },
  { value: 'kyc_pending', label: 'Em Análise', icon: '🟡' },
  { value: 'kyc_incomplete', label: 'KYC Pendente', icon: '🟠' },
  { value: 'active', label: 'Ativo', icon: '🟢' },
  { value: 'suspended', label: 'Suspenso', icon: '🔴' },
  { value: 'blocked', label: 'Bloqueado', icon: '⚫' },
  { value: 'inactive', label: 'Inativo', icon: '⚪' },
  { value: 'cancelled', label: 'Cancelado', icon: '⚫' }
];

const METHOD_OPTIONS = [
  { value: 'card', label: 'Cartão', icon: '💳' },
  { value: 'pix', label: 'PIX', icon: '⚡' },
  { value: 'boleto', label: 'Boleto', icon: '📄' }
];

const SEGMENT_OPTIONS = [
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'saas', label: 'SaaS/Digital' },
  { value: 'educacao', label: 'Educação' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'varejo', label: 'Varejo' },
  { value: 'servicos', label: 'Serviços' },
  { value: 'games', label: 'Games' },
  { value: 'viagens', label: 'Viagens' },
  { value: 'saude', label: 'Saúde' },
  { value: 'financeiro', label: 'Financeiro' },
  { value: 'outros', label: 'Outros' }
];

export default function MerchantFilters({ filters, onFiltersChange, onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleStatusToggle = (status) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    handleFilterChange('status', newStatuses);
  };

  const handleMethodToggle = (method) => {
    const currentMethods = filters.methods || [];
    const newMethods = currentMethods.includes(method)
      ? currentMethods.filter(m => m !== method)
      : [...currentMethods, method];
    handleFilterChange('methods', newMethods);
  };

  const removeFilter = (key) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
    setSearchTerm('');
  };

  const activeFiltersCount = Object.keys(filters).filter(k => 
    filters[k] && (Array.isArray(filters[k]) ? filters[k].length > 0 : true)
  ).length;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Buscar por nome, CNPJ, ID, e-mail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => { setSearchTerm(''); onSearch(''); }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
          </button>
        )}
      </form>

      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              Status
              {filters.status?.length > 0 && (
                <Badge variant="secondary" className="ml-1">{filters.status.length}</Badge>
              )}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3">
            <div className="space-y-2">
              {STATUS_OPTIONS.map((status) => (
                <div key={status.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status.value}`}
                    checked={filters.status?.includes(status.value)}
                    onCheckedChange={() => handleStatusToggle(status.value)}
                  />
                  <Label htmlFor={`status-${status.value}`} className="flex items-center gap-2 cursor-pointer">
                    <span>{status.icon}</span>
                    <span>{status.label}</span>
                  </Label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Method Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              Método
              {filters.methods?.length > 0 && (
                <Badge variant="secondary" className="ml-1">{filters.methods.length}</Badge>
              )}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3">
            <div className="space-y-2">
              {METHOD_OPTIONS.map((method) => (
                <div key={method.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`method-${method.value}`}
                    checked={filters.methods?.includes(method.value)}
                    onCheckedChange={() => handleMethodToggle(method.value)}
                  />
                  <Label htmlFor={`method-${method.value}`} className="flex items-center gap-2 cursor-pointer">
                    <span>{method.icon}</span>
                    <span>{method.label}</span>
                  </Label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Segment Filter */}
        <Select
          value={filters.segment || ''}
          onValueChange={(value) => handleFilterChange('segment', value)}
        >
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Segmento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>Todos</SelectItem>
            {SEGMENT_OPTIONS.map((segment) => (
              <SelectItem key={segment.value} value={segment.value}>
                {segment.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Advanced Filters Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          + Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount}</Badge>
          )}
        </Button>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs text-slate-500">TPV 30d (Mínimo)</Label>
              <Input
                type="number"
                placeholder="R$ 0"
                value={filters.tpvMin || ''}
                onChange={(e) => handleFilterChange('tpvMin', e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs text-slate-500">TPV 30d (Máximo)</Label>
              <Input
                type="number"
                placeholder="Sem limite"
                value={filters.tpvMax || ''}
                onChange={(e) => handleFilterChange('tpvMax', e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs text-slate-500">CB Ratio (Máximo)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="%"
                value={filters.cbRatioMax || ''}
                onChange={(e) => handleFilterChange('cbRatioMax', e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs text-slate-500">Comercial</Label>
              <Select
                value={filters.salesRep || ''}
                onValueChange={(value) => handleFilterChange('salesRep', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Todos</SelectItem>
                  <SelectItem value="maria">Maria Santos</SelectItem>
                  <SelectItem value="joao">João Silva</SelectItem>
                  <SelectItem value="ana">Ana Costa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Badges */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-500">Filtros ativos:</span>
          
          {filters.status?.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              Status = {filters.status.map(s => STATUS_OPTIONS.find(o => o.value === s)?.label).join(', ')}
              <X className="w-3 h-3 cursor-pointer" onClick={() => removeFilter('status')} />
            </Badge>
          )}
          
          {filters.methods?.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              Método = {filters.methods.map(m => METHOD_OPTIONS.find(o => o.value === m)?.label).join(', ')}
              <X className="w-3 h-3 cursor-pointer" onClick={() => removeFilter('methods')} />
            </Badge>
          )}
          
          {filters.segment && (
            <Badge variant="secondary" className="gap-1">
              Segmento = {SEGMENT_OPTIONS.find(s => s.value === filters.segment)?.label}
              <X className="w-3 h-3 cursor-pointer" onClick={() => removeFilter('segment')} />
            </Badge>
          )}
          
          {filters.tpvMin && (
            <Badge variant="secondary" className="gap-1">
              TPV &gt; R$ {Number(filters.tpvMin).toLocaleString('pt-BR')}
              <X className="w-3 h-3 cursor-pointer" onClick={() => removeFilter('tpvMin')} />
            </Badge>
          )}

          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-slate-500">
            Limpar Todos
          </Button>
        </div>
      )}
    </div>
  );
}